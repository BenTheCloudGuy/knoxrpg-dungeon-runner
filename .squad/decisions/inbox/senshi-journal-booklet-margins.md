# Senshi Decision Inbox: Berhan Voss Booklet Margins

## 2026-10-03: Saved text-booklet generator

The Berhan Voss saddle-stitch booklet is now rebuilt by `props\journal-deck\tools\journal-booklet.py`.

- Rebuild command: `.\.venv\Scripts\python.exe props\journal-deck\tools\journal-booklet.py`
- Output: `props\Berhan-Voss-Journal-Booklet.pdf`
- Margin constants: `OUTER_MARGIN = 30`, `GUTTER_MARGIN = 30`, `TOP_MARGIN = 61`, `BOTTOM_MARGIN = 44` points.
- This is the text-rendered booklet path and is separate from the image print-and-play deck renderer, `props\journal-deck\tools\journal-render.mjs`.
