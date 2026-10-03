# Decision: A5 booklet formatting fixes (GM-Guide-A5.pdf)

**By:** Senshi (Quartermaster) — requested by Ben
**Date:** 2026-10-03
**Scope:** `gm-guide/proof/build-a5.mjs`, `gm-guide/proof/a5.css`, `rooms/TheCaverns.md` (table structure repair only). Letter-size `GM-Guide.md` / `gm-guide/tools/print.css` untouched.

## What changed
1. **Part-label / markdown collision (literal "#" leak).** In `build-a5.mjs`, every `<p class="part-label">` block must be followed by a blank line before the markdown heading, or markdown-it treats the `# Heading` as raw HTML content and the `#` prints literally. Added `parts.push("")` after Parts 1-3 labels. Rule to remember: **a block-level HTML line pushed into `parts` must be followed by `""` (blank line) if markdown follows it.**
2. **Part 4 divider page eliminated.** Dropped the standalone "Part 4 - The Dungeon" divider page; the Part 4 eyebrow + title + one-line intro now ride atop the first dungeon map page (Dungeon - Left). That first map uses `.area-map-intro` (shorter max-height) so intro + map share one page.
3. **Maps enlarged.** Nearly all area maps are width-bound (portrait ar 0.75-1.0) on a taller page, so raising `max-height` alone does little. Fix in `a5.css`: `.area-map` now bleeds ~0.22in into each page margin (`width: calc(100% + 0.44in); margin: 0 -0.22in; max-height: 7.5in`). This grows maps wider AND proportionally taller (aspect preserved, no crop, ~0.08in true margin remains). Tall/rotated maps are height-capped at 7.5in.
4. **Malformed canon table repaired.** `rooms/TheCaverns.md` C5 forge-crafting table had its header jammed onto a bullet line, so it never parsed — pipes, dashes, and `**` printed as literal text. Rewrote as a proper standalone table (blank line before, header row, `| --- |` separator). **Content/numbers preserved exactly**; only table structure fixed.

## Canon note for future authors
Tables in `rooms/*.md` must start on their own line with a blank line above them, not be appended to a bullet or paragraph line. Otherwise they leak literal markdown into the A5 build.

## Verification
Rebuilt `GM-Guide-A5.pdf`: 86 pages, every page exactly 5.5 x 8.5 in. Rendered pages 2/5/11 (styled headings, no "#"), 14 (Part 4 intro + large map, no divider page), 15/34/47 (enlarged maps), 23 (stat block whole), 57 (forge table now a real table). Full-document markdown-leak sweep clean (remaining ` | ` lines are the intended compact stat-block separators).
