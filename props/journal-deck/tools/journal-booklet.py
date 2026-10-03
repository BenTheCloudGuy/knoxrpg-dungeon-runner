from __future__ import annotations

import math
import io
import re
from dataclasses import dataclass, field
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject
from PIL import Image
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "props" / "alchemist-journal-booklet.md"
OUTPUT = ROOT / "props" / "Berhan-Voss-Journal-Booklet.pdf"
FONT_DIR = ROOT / "props" / "journal-deck" / "assets" / "fonts"
VARIABLE_FONT = FONT_DIR / "Caveat-Variable.ttf"
REGULAR_FONT_PATH = FONT_DIR / "Caveat-Regular.ttf"
BOLD_FONT_PATH = FONT_DIR / "Caveat-Bold.ttf"

PAGE_WIDTH_IN, PAGE_HEIGHT_IN = 11.5, 8.5
SHEET_WIDTH, SHEET_HEIGHT = PAGE_WIDTH_IN * 72, PAGE_HEIGHT_IN * 72
HALF_WIDTH = SHEET_WIDTH / 2

OUTER_MARGIN = 20
GUTTER_MARGIN = 45
TOP_MARGIN = 61
BOTTOM_MARGIN = 44

FRAME_WIDTH = HALF_WIDTH - OUTER_MARGIN - GUTTER_MARGIN
FRAME_HEIGHT = SHEET_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN
IMAGE_ROTATION_DEGREES = -90

CAVEAT_REGULAR = "Caveat-Regular"
CAVEAT_BOLD = "Caveat-Bold"


@dataclass(frozen=True)
class Block:
    kind: str
    text: str


@dataclass(frozen=True)
class Entry:
    index: int
    title: str
    kind: str
    blocks: list[Block]


@dataclass(frozen=True)
class Line:
    text: str
    x: float
    y: float
    size: float
    font_name: str
    justify: bool = False
    frame_width: float = 0.0


@dataclass
class BookletPage:
    label: str
    blocks: list[Block] = field(default_factory=list)
    lines: list[Line] = field(default_factory=list)
    stretched: bool = False
    image_path: Path | None = None


STYLES = {
    "heading": {
        "font": CAVEAT_BOLD,
        "size": 26.0,
        "leading": 30.0,
        "before": 0.0,
        "after": 4.0,
        "indent": 0.0,
    },
    "section": {
        "font": CAVEAT_BOLD,
        "size": 19.0,
        "leading": 22.0,
        "before": 3.0,
        "after": 3.0,
        "indent": 0.0,
    },
    "body": {
        "font": CAVEAT_REGULAR,
        "size": 16.0,
        "leading": 18.8,
        "before": 0.0,
        "after": 7.0,
        "indent": 0.0,
    },
    "list": {
        "font": CAVEAT_REGULAR,
        "size": 15.5,
        "leading": 18.0,
        "before": 0.0,
        "after": 2.0,
        "indent": 0.0,
    },
    "number": {
        "font": CAVEAT_REGULAR,
        "size": 15.5,
        "leading": 18.0,
        "before": 0.0,
        "after": 3.0,
        "indent": 0.0,
    },
    "quote": {
        "font": CAVEAT_REGULAR,
        "size": 15.5,
        "leading": 18.0,
        "before": 7.0,
        "after": 7.0,
        "indent": 14.0,
    },
}


@dataclass
class RenderResult:
    lines: list[Line]
    y_after: float
    stretched: bool


@dataclass
class GapPlan:
    index: int
    cap: float
    priority: int


def make_static_caveat_font(weight: float, output_path: Path) -> None:
    style = "Regular" if weight == 400.0 else "Bold"
    postscript_name = f"Caveat-{style}"
    if output_path.exists() and output_path.stat().st_mtime >= VARIABLE_FONT.stat().st_mtime:
        return
    from fontTools.ttLib import TTFont as FontToolsTTFont
    from fontTools.varLib.instancer import instantiateVariableFont

    font = FontToolsTTFont(VARIABLE_FONT)
    static_font = instantiateVariableFont(font, {"wght": weight}, inplace=False, static=True)
    names = static_font["name"]
    for platform_id, encoding_id, language_id in ((3, 1, 0x409), (1, 0, 0)):
        names.setName("Caveat", 1, platform_id, encoding_id, language_id)
        names.setName(style, 2, platform_id, encoding_id, language_id)
        names.setName(f"Caveat {style}", 4, platform_id, encoding_id, language_id)
        names.setName(postscript_name, 6, platform_id, encoding_id, language_id)
        names.setName("Caveat", 16, platform_id, encoding_id, language_id)
        names.setName(style, 17, platform_id, encoding_id, language_id)
    static_font.save(output_path)


def register_fonts() -> None:
    make_static_caveat_font(400.0, REGULAR_FONT_PATH)
    make_static_caveat_font(700.0, BOLD_FONT_PATH)
    pdfmetrics.registerFont(TTFont(CAVEAT_REGULAR, str(REGULAR_FONT_PATH)))
    pdfmetrics.registerFont(TTFont(CAVEAT_BOLD, str(BOLD_FONT_PATH)))


def text_width(text: str, font_name: str, size: float) -> float:
    return pdfmetrics.stringWidth(text, font_name, size)


def wrap_text(text: str, font_name: str, size: float, width: float) -> list[str]:
    words = text.split()
    if not words:
        return []
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = f"{current} {word}"
        if text_width(candidate, font_name, size) <= width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def parse_entry_blocks(entry: str, source_dir: Path) -> list[Block]:
    blocks: list[Block] = []
    paragraph: list[str] = []
    quote: list[str] = []

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            blocks.append(Block("body", " ".join(paragraph).strip()))
            paragraph = []

    def flush_quote() -> None:
        nonlocal quote
        if quote:
            blocks.append(Block("quote", " ".join(quote).strip()))
            quote = []

    for raw_line in entry.splitlines():
        line = raw_line.strip()
        if not line or line == "---":
            flush_paragraph()
            flush_quote()
            continue
        image_match = re.match(r"^!\[[^\]]*]\(([^)]+)\)$", line)
        if image_match:
            flush_paragraph()
            flush_quote()
            image_path = image_match.group(1).strip()
            resolved_path = Path(image_path)
            if not resolved_path.is_absolute():
                resolved_path = source_dir / resolved_path
            blocks.append(Block("image", str(resolved_path)))
            continue
        if line.startswith("[PRODUCTION:"):
            flush_paragraph()
            flush_quote()
            continue
        if line.startswith(">"):
            flush_paragraph()
            quote.append(line.lstrip(">").strip())
            continue
        flush_quote()
        if line.startswith("### "):
            flush_paragraph()
            blocks.append(Block("heading", line[4:].strip()))
        elif re.match(r"^\*\*[^*]+\*\*$", line):
            flush_paragraph()
            blocks.append(Block("section", line.strip("*")))
        elif line.startswith("- "):
            flush_paragraph()
            blocks.append(Block("list", line[2:].strip()))
        elif re.match(r"^\d+\.\s+", line):
            flush_paragraph()
            blocks.append(Block("number", line))
        else:
            paragraph.append(line)
    flush_paragraph()
    flush_quote()
    return blocks


def parse_markdown(text: str) -> list[Entry]:
    text = re.sub(r"<!--\s*EDITORIAL NOTES.*?-->\s*", "", text, flags=re.S)
    raw_entries = re.split(r"^## Journal Page \d+\s*$", text, flags=re.M)[1:]
    entries: list[Entry] = []
    for entry_index, raw_entry in enumerate(raw_entries, start=1):
        blocks = parse_entry_blocks(raw_entry, SOURCE.parent)
        if not blocks or blocks[0].kind != "heading":
            raise ValueError(f"Journal Page {entry_index} is missing a heading")
        has_ingredients = any(block.kind == "section" and block.text == "Ingredients" for block in blocks)
        has_method = any(block.kind == "section" and block.text == "Method" for block in blocks)
        if has_ingredients != has_method:
            raise ValueError(f"Journal Page {entry_index} has only one recipe section")
        entry_kind = "RECIPE" if has_ingredients and has_method else "JOURNAL"
        entries.append(Entry(entry_index, blocks[0].text, entry_kind, blocks))
    return entries


def block_style(block: Block, previous_kind: str) -> dict[str, float | str]:
    style = dict(STYLES[block.kind])
    if block.kind == "section" and block.text == "Method" and previous_kind == "list":
        style["before"] = 11.0
    return style


def render_blocks_once(blocks: list[Block], extras_after: dict[int, float] | None = None) -> RenderResult:
    extras_after = extras_after or {}
    y = SHEET_HEIGHT - TOP_MARGIN
    lines_out: list[Line] = []
    previous_kind = ""
    for block_index, block in enumerate(blocks):
        style = block_style(block, previous_kind)
        font_name = str(style["font"])
        size = float(style["size"])
        leading = float(style["leading"])
        before = float(style["before"])
        after = float(style["after"])
        indent = float(style["indent"])
        width = FRAME_WIDTH - indent
        wrapped = wrap_text(block.text, font_name, size, width)
        if not wrapped:
            continue
        y -= before
        last_line_index = len(wrapped) - 1
        should_justify = block.kind in {"body", "quote"}
        for line_index, line in enumerate(wrapped):
            lines_out.append(
                Line(
                    line,
                    indent,
                    y,
                    size,
                    font_name,
                    justify=should_justify and line_index != last_line_index,
                    frame_width=width,
                )
            )
            y -= leading
        y -= after + extras_after.get(block_index, 0.0)
        previous_kind = block.kind
    return RenderResult(lines_out, y, bool(extras_after))


def find_gap_plans(blocks: list[Block]) -> list[GapPlan]:
    plans: list[GapPlan] = []
    for index, block in enumerate(blocks[:-1]):
        next_block = blocks[index + 1]
        if block.kind == "body" and next_block.kind == "section" and next_block.text == "Ingredients":
            plans.append(GapPlan(index, 22.0, 1))
        elif block.kind == "list" and next_block.kind == "list":
            plans.append(GapPlan(index, 2.0, 2))
        elif block.kind == "body" and next_block.kind in {"body", "section"}:
            plans.append(GapPlan(index, 4.0, 3))
        elif block.kind == "section" and next_block.kind == "list":
            plans.append(GapPlan(index, 2.0, 3))
    return plans


def allocate_gap_extras(slack: float, plans: list[GapPlan]) -> dict[int, float]:
    extras = {plan.index: 0.0 for plan in plans}
    remaining = max(0.0, slack)
    for priority in sorted({plan.priority for plan in plans}):
        group = [plan for plan in plans if plan.priority == priority]
        while remaining > 0.01:
            active = [plan for plan in group if extras[plan.index] < plan.cap - 0.01]
            if not active:
                break
            portion = remaining / len(active)
            used = 0.0
            for plan in active:
                room = plan.cap - extras[plan.index]
                add = min(room, portion)
                extras[plan.index] += add
                used += add
            remaining -= used
            if used <= 0.01:
                break
    return {index: extra for index, extra in extras.items() if extra > 0.01}


def render_blocks(blocks: list[Block], stretch: bool = True) -> RenderResult:
    normal = render_blocks_once(blocks)
    if not stretch or not blocks:
        return normal
    slack = normal.y_after - BOTTOM_MARGIN
    if slack < 28.0:
        return normal
    plans = find_gap_plans(blocks)
    if not plans:
        return normal
    extras = allocate_gap_extras(slack, plans)
    if not extras:
        return normal
    return render_blocks_once(blocks, extras)


def text_overflows(lines: list[Line]) -> bool:
    return any(line.y < BOTTOM_MARGIN - 0.01 for line in lines)


def blocks_fit_page(blocks: list[Block]) -> bool:
    if any(block.kind == "image" for block in blocks):
        return len(blocks) == 1
    rendered = render_blocks(blocks, stretch=False)
    return not text_overflows(rendered.lines)


def method_units(blocks: list[Block]) -> list[list[Block]]:
    units: list[list[Block]] = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        if block.kind == "image":
            units.append([block])
            index += 1
        elif block.kind == "section":
            unit = [block]
            index += 1
            if index < len(blocks):
                next_unit = collect_number_or_single(blocks, index)
                unit.extend(next_unit)
                index += len(next_unit)
            units.append(unit)
        elif block.kind == "number":
            unit = collect_number_or_single(blocks, index)
            units.append(unit)
            index += len(unit)
        else:
            units.append([block])
            index += 1
    return units


def natural_units(blocks: list[Block]) -> list[list[Block]]:
    units: list[list[Block]] = []
    index = 0
    while index < len(blocks):
        block = blocks[index]
        if block.kind == "image":
            units.append([block])
            index += 1
        elif block.kind in {"heading", "section"}:
            unit = [block]
            index += 1
            if index < len(blocks):
                next_unit = collect_number_or_single(blocks, index)
                unit.extend(next_unit)
                index += len(next_unit)
            units.append(unit)
        elif block.kind == "number":
            unit = collect_number_or_single(blocks, index)
            units.append(unit)
            index += len(unit)
        else:
            units.append([block])
            index += 1
    return units


def collect_number_or_single(blocks: list[Block], index: int) -> list[Block]:
    block = blocks[index]
    if block.kind != "number":
        return [block]
    unit = [block]
    cursor = index + 1
    while cursor < len(blocks) and blocks[cursor].kind == "quote":
        unit.append(blocks[cursor])
        cursor += 1
    return unit


def split_recipe(entry: Entry) -> tuple[list[Block], list[Block]]:
    ingredient_index = next(
        index for index, block in enumerate(entry.blocks) if block.kind == "section" and block.text == "Ingredients"
    )
    method_index = next(
        index for index, block in enumerate(entry.blocks) if block.kind == "section" and block.text == "Method"
    )
    if not any(block.kind == "list" for block in entry.blocks[ingredient_index + 1 : method_index]):
        raise ValueError(f"{entry.title} has no ingredient list")
    return entry.blocks[:method_index], entry.blocks[method_index:]


def make_title_page() -> BookletPage:
    title_specs = [
        ("Berhan Voss", CAVEAT_BOLD, 46.0, 48.0),
        ("Alchemicalist of the First Order", CAVEAT_REGULAR, 26.0, 34.0),
        ("Personal Journal", CAVEAT_BOLD, 32.0, 38.0),
    ]
    total_height = sum(spec[3] for spec in title_specs[:-1]) + title_specs[-1][2]
    y = (SHEET_HEIGHT + total_height) / 2.0
    lines: list[Line] = []
    for text, font_name, size, leading in title_specs:
        width = text_width(text, font_name, size)
        x = (FRAME_WIDTH - width) / 2.0
        lines.append(Line(text, x, y, size, font_name))
        y -= leading
    return BookletPage("title", lines=lines)


def finalize_page(page: BookletPage, stretch: bool = True) -> BookletPage:
    if page.blocks:
        rendered = render_blocks(page.blocks, stretch=stretch)
        page.lines = rendered.lines
        page.stretched = rendered.stretched
    return page


def add_blank_page(pages: list[BookletPage], reason: str = "BLANK") -> None:
    pages.append(BookletPage(reason))


def next_booklet_page_number(pages: list[BookletPage]) -> int:
    return len(pages) + 1


def ensure_next_page_is_left(pages: list[BookletPage]) -> None:
    if next_booklet_page_number(pages) % 2 == 1:
        add_blank_page(pages)


def add_single_page(pages: list[BookletPage], blocks: list[Block], label: str) -> None:
    page = BookletPage(label, blocks=list(blocks))
    finalize_page(page, stretch=True)
    if text_overflows(page.lines):
        raise ValueError(f"Page overflow while laying out {label}")
    pages.append(page)


def ensure_next_page_is_right(pages: list[BookletPage]) -> None:
    if next_booklet_page_number(pages) % 2 == 0:
        add_blank_page(pages)


def add_image_page(pages: list[BookletPage], image_block: Block) -> None:
    image_path = Path(image_block.text)
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    ensure_next_page_is_right(pages)
    pages.append(BookletPage("MAP (full page)", image_path=image_path))


def add_units_as_pages(pages: list[BookletPage], units: list[list[Block]], first_label: str, cont_label: str) -> None:
    current_blocks: list[Block] = []
    current_label = first_label
    for unit in units:
        if len(unit) == 1 and unit[0].kind == "image":
            if current_blocks:
                add_single_page(pages, current_blocks, current_label)
                current_blocks = []
                current_label = cont_label
            add_image_page(pages, unit[0])
            current_label = cont_label
            continue
        candidate = current_blocks + unit
        if current_blocks and not blocks_fit_page(candidate):
            add_single_page(pages, current_blocks, current_label)
            current_blocks = list(unit)
            current_label = cont_label
        else:
            current_blocks = candidate
        if not blocks_fit_page(current_blocks):
            raise ValueError(f"Kept-together unit is too tall for one page in {first_label}")
    if current_blocks:
        add_single_page(pages, current_blocks, current_label)


def split_last_page_to_avoid_blank(pages: list[BookletPage]) -> bool:
    if len(pages) % 2 != 0:
        return False
    last_page = pages[-1]
    if last_page.image_path or len(last_page.blocks) < 2:
        return False
    moved_blocks = [last_page.blocks[-1]]
    kept_blocks = last_page.blocks[:-1]
    if not blocks_fit_page(kept_blocks) or not blocks_fit_page(moved_blocks):
        return False
    last_page.blocks = kept_blocks
    last_page.lines = []
    last_page.stretched = False
    finalize_page(last_page, stretch=True)
    new_page = BookletPage(last_page.label, blocks=moved_blocks)
    finalize_page(new_page, stretch=True)
    if text_overflows(last_page.lines) or text_overflows(new_page.lines):
        return False
    pages.append(new_page)
    return True


def paginate(entries: list[Entry]) -> tuple[list[BookletPage], list[str]]:
    pages: list[BookletPage] = [make_title_page()]
    recipes_beyond_spread: list[str] = []

    for entry_number, entry in enumerate(entries, start=1):
        ensure_next_page_is_left(pages)
        if entry.kind == "RECIPE":
            left_blocks, right_blocks = split_recipe(entry)
            add_single_page(pages, left_blocks, f"{entry.title} - intro+ingredients")
            if next_booklet_page_number(pages) % 2 != 1:
                raise AssertionError(f"{entry.title} method did not land on a right page")
            before_method_page_count = len(pages)
            add_units_as_pages(
                pages,
                method_units(right_blocks),
                f"{entry.title} - method+notes",
                f"{entry.title} - method+notes cont.",
            )
            if len(pages) - before_method_page_count > 1:
                recipes_beyond_spread.append(entry.title)
        else:
            add_units_as_pages(
                pages,
                natural_units(entry.blocks),
                entry.title,
                f"{entry.title} - cont.",
            )
        if entry_number < len(entries):
            split_last_page_to_avoid_blank(pages)

    return pages, recipes_beyond_spread


def page_side(page_number: int) -> str:
    return "LEFT" if page_number % 2 == 0 else "RIGHT"


def draw_page_image(pdf: canvas.Canvas, image_path: Path, base_x: float) -> None:
    with Image.open(image_path) as source_image:
        rotated = source_image.convert("RGB").rotate(IMAGE_ROTATION_DEGREES, expand=True)
    scale = min(FRAME_WIDTH / rotated.width, FRAME_HEIGHT / rotated.height)
    draw_width = rotated.width * scale
    draw_height = rotated.height * scale
    x = base_x + (FRAME_WIDTH - draw_width) / 2.0
    y = BOTTOM_MARGIN + (FRAME_HEIGHT - draw_height) / 2.0
    pdf.drawImage(
        ImageReader(rotated),
        x,
        y,
        width=draw_width,
        height=draw_height,
        mask="auto",
    )


def draw_booklet_page(pdf: canvas.Canvas, page: BookletPage, base_x: float) -> None:
    if page.image_path:
        draw_page_image(pdf, page.image_path, base_x)
    for line in page.lines:
        x = base_x + line.x
        pdf.setFont(line.font_name, line.size)
        words = line.text.split()
        if line.justify and len(words) > 1 and line.frame_width > 0:
            word_widths = [
                pdfmetrics.stringWidth(word, line.font_name, line.size) for word in words
            ]
            slack = line.frame_width - sum(word_widths)
            if slack > 0:
                gap = slack / (len(words) - 1)
                cursor_x = x
                for word, word_width in zip(words, word_widths):
                    pdf.drawString(cursor_x, line.y, word)
                    cursor_x += word_width + gap
                continue
        pdf.drawString(x, line.y, line.text)


def impose_pages(pages: list[BookletPage]) -> tuple[int, int]:
    booklet_page_count = int(math.ceil(len(pages) / 4) * 4)
    while len(pages) < booklet_page_count:
        add_blank_page(pages)

    sheet_count = booklet_page_count // 2
    pdf = canvas.Canvas(str(OUTPUT), pagesize=(SHEET_WIDTH, SHEET_HEIGHT))
    pdf.setTitle("Berhan Voss's Personal Alchemist's Journal, booklet")
    pdf.setProducer("reportlab")
    pdf.setFillColorRGB(0, 0, 0)
    for sheet_index in range(sheet_count):
        if sheet_index % 2 == 0:
            left_page = booklet_page_count - sheet_index
            right_page = sheet_index + 1
        else:
            left_page = sheet_index + 1
            right_page = booklet_page_count - sheet_index

        draw_booklet_page(pdf, pages[left_page - 1], OUTER_MARGIN)
        draw_booklet_page(pdf, pages[right_page - 1], HALF_WIDTH + GUTTER_MARGIN)
        if sheet_index != sheet_count - 1:
            pdf.showPage()
            pdf.setFillColorRGB(0, 0, 0)

    pdf.save()
    remove_unused_standard_fonts()
    return sheet_count, booklet_page_count


def remove_unused_standard_fonts() -> None:
    reader = PdfReader(io.BytesIO(OUTPUT.read_bytes()))
    writer = PdfWriter()
    changed = False
    for page in reader.pages:
        content = page.get_contents()
        content_bytes = content.get_data() if content else b""
        resources = page.get("/Resources")
        resources = resources.get_object() if resources else None
        font_dict = resources.get("/Font") if resources else None
        font_dict = font_dict.get_object() if font_dict else None
        if font_dict:
            for resource_name in list(font_dict.keys()):
                font = font_dict[resource_name].get_object()
                base_font = str(font.get("/BaseFont"))
                marker = f"{resource_name} ".encode("ascii")
                if base_font == "/Helvetica" and marker not in content_bytes:
                    del font_dict[NameObject(str(resource_name))]
                    changed = True
        writer.add_page(page)
    if not changed:
        return
    if reader.metadata:
        writer.add_metadata(dict(reader.metadata))
    cleaned = OUTPUT.with_suffix(".clean.pdf")
    with cleaned.open("wb") as handle:
        writer.write(handle)
    cleaned.replace(OUTPUT)


def verify_layout(pages: list[BookletPage]) -> list[str]:
    issues: list[str] = []
    for page_number, page in enumerate(pages, start=1):
        for line in page.lines:
            if line.y < BOTTOM_MARGIN - 0.01:
                issues.append(
                    f"page {page_number} line below bottom margin: y={line.y:.2f} {line.text!r}"
                )
    return issues


def print_page_map(pages: list[BookletPage]) -> None:
    print("PAGE MAP")
    for page_number, page in enumerate(pages, start=1):
        label = page.label if page.label != "BLANK" else "BLANK"
        marker = " [spaced]" if page.stretched else ""
        print(f"{page_number:02d} {page_side(page_number):5s} - {label}{marker}")


def main() -> None:
    register_fonts()
    entries = parse_markdown(SOURCE.read_text(encoding="utf-8"))
    pages, recipes_beyond_spread = paginate(entries)
    sheet_count, booklet_page_count = impose_pages(pages)
    issues = verify_layout(pages)
    blank_pages = [
        index for index, page in enumerate(pages, start=1) if not page.lines and not page.image_path
    ]
    print(
        f"Wrote {OUTPUT.relative_to(ROOT)}: {sheet_count} sheets, "
        f"{booklet_page_count} booklet pages, "
        f"fonts {REGULAR_FONT_PATH.name} and {BOLD_FONT_PATH.name}, "
        f"outer margin {OUTER_MARGIN} pt, gutter margin {GUTTER_MARGIN} pt."
    )
    print("Side model: even booklet pages are LEFT; odd booklet pages are RIGHT.")
    print_page_map(pages)
    if recipes_beyond_spread:
        print("Recipes needing more than one spread: " + ", ".join(recipes_beyond_spread))
    else:
        print("Recipes needing more than one spread: none")
    print("Blank pages: " + (", ".join(str(page) for page in blank_pages) if blank_pages else "none"))
    if issues:
        print("Overflow check: FAIL")
        for issue in issues:
            print("  " + issue)
        raise SystemExit(1)
    print(f"Overflow check: PASS, no text drawn below {BOTTOM_MARGIN} pt.")


if __name__ == "__main__":
    main()
