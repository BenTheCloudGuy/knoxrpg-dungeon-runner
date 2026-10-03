from __future__ import annotations

import math
import re
from dataclasses import dataclass
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject
from reportlab.lib.pagesizes import landscape, letter
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

SHEET_WIDTH, SHEET_HEIGHT = landscape(letter)
HALF_WIDTH = SHEET_WIDTH / 2

OUTER_MARGIN = 20
GUTTER_MARGIN = 45
TOP_MARGIN = 61
BOTTOM_MARGIN = 44

FRAME_WIDTH = HALF_WIDTH - OUTER_MARGIN - GUTTER_MARGIN

CAVEAT_REGULAR = "Caveat-Regular"
CAVEAT_BOLD = "Caveat-Bold"


@dataclass(frozen=True)
class Block:
    kind: str
    text: str


@dataclass(frozen=True)
class Line:
    text: str
    x: float
    y: float
    size: float
    font_name: str
    justify: bool = False
    frame_width: float = 0.0


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


def parse_markdown(text: str) -> list[Block]:
    text = re.sub(r"<!--\s*EDITORIAL NOTES.*?-->\s*", "", text, flags=re.S)
    entries = re.split(r"^## Journal Page \d+\s*$", text, flags=re.M)[1:]
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

    for entry_index, entry in enumerate(entries):
        if entry_index:
            blocks.append(Block("pagebreak", ""))
        for raw_line in entry.splitlines():
            line = raw_line.strip()
            if not line or line == "---":
                flush_paragraph()
                flush_quote()
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
            elif line in {"**Ingredients**", "**Method**"}:
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


def paginate(blocks: list[Block]) -> list[list[Line]]:
    pages: list[list[Line]] = [[]]
    y = SHEET_HEIGHT - TOP_MARGIN

    def new_page() -> None:
        nonlocal y
        pages.append([])
        y = SHEET_HEIGHT - TOP_MARGIN

    previous_kind = ""
    for block in blocks:
        if block.kind == "pagebreak":
            if pages[-1]:
                new_page()
            previous_kind = "pagebreak"
            continue
        style = STYLES[block.kind]
        font_name = style["font"]
        size = style["size"]
        leading = style["leading"]
        before = style["before"]
        if block.kind == "section" and block.text == "Method" and previous_kind == "list":
            before = 11.0
        after = style["after"]
        indent = style["indent"]
        width = FRAME_WIDTH - indent
        lines = wrap_text(block.text, font_name, size, width)
        if not lines:
            continue

        first_line_needed = before + leading
        if y - first_line_needed < BOTTOM_MARGIN and pages[-1]:
            new_page()
        else:
            y -= before

        last_line_index = len(lines) - 1
        should_justify = block.kind in {"body", "quote"}
        for line_index, line in enumerate(lines):
            if y < BOTTOM_MARGIN and pages[-1]:
                new_page()
            pages[-1].append(
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
        y -= after
        previous_kind = block.kind

    return pages


def draw_booklet_page(pdf: canvas.Canvas, lines: list[Line], base_x: float) -> None:
    for line in lines:
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


def impose_pages(pages: list[list[Line]]) -> tuple[int, int]:
    booklet_page_count = int(math.ceil(len(pages) / 4) * 4)
    while len(pages) < booklet_page_count:
        pages.append([])

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
    reader = PdfReader(str(OUTPUT))
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


def main() -> None:
    register_fonts()
    blocks = parse_markdown(SOURCE.read_text(encoding="utf-8"))
    pages = paginate(blocks)
    sheet_count, booklet_page_count = impose_pages(pages)
    print(
        f"Wrote {OUTPUT.relative_to(ROOT)}: {sheet_count} sheets, "
        f"{booklet_page_count} booklet pages, "
        f"fonts {REGULAR_FONT_PATH.name} and {BOLD_FONT_PATH.name}, "
        f"outer margin {OUTER_MARGIN} pt, gutter margin {GUTTER_MARGIN} pt."
    )


if __name__ == "__main__":
    main()
