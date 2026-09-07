# Senshi — Laser-cut prize tokens (first pass)

**Date:** 2026-09-06
**Decision:** Added a laser-cutter deliverable for the prize tokens alongside the existing print deck.

- Generator: `items/tokens/tools/laser-tokens.mjs` (Node ESM, reuses tools-dir `sharp`).
- Output: `items/tokens/laser/*.svg` — 20 SVGs, one per physical prize copy.
- 3 inch (76.2 mm) circular wood rounds. LightBurn encoding: red `#FF0000` no-fill circle = CUT layer; black `#000000` name + description + grayscale embedded image = ETCH.
- Price and USD value are intentionally omitted from these tokens (differs from the card deck, which keeps price/value).
- Art source is shared with the print deck: `items/tokens/images/<slug>.png`.
- Print/card pipeline (`prize-render.mjs`, `prize-gen.mjs`, `prize-assemble.mjs`) is untouched.

**For Falin:** the physical prize inventory now has a second production path (laser wood rounds). Same 15 prizes, same copy counts (20 total). No change to crystal economy or tier assignments — just a new physical form of the tokens.
