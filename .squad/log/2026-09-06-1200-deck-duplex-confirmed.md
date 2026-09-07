# Session Log: Print-and-play deck duplex layout confirmed working

**Date:** 2026-09-06 12:00
**Agents spawned:** Senshi (earlier batch), Cleric (logging)
**Files touched:** items/magic-items/deck/tools/sheet-pdfs.mjs, items/magic-items/deck/tools/assemble-deck.mjs, items/tokens/tools/prize-assemble.mjs, items/magic-items/deck/tools/per-card-pdfs.mjs, items/magic-items/deck/tools/README.md, props/itemcards.md, items/decks/ (31 committed sheet PDFs)

## What was decided

- Deck duplex layout is LOCKED and CONFIRMED for Ben's HP 3301dw. Both Actual Size / 100% and Fit to Page / 96% print correctly and cut clean on both faces.
- Final layout: back slots row-mirrored (ROWS-1-r)*COLS+c, backs NOT rotated, BACK_DY_MM = -2.5, BACK_DX_MM = 0, crop marks shifted by the same (dx,dy) as the cards via cropSvg(dx,dy).
- This supersedes the four intermediate tuning steps from earlier today (short-edge revert, long-edge nudge default, back-art-upright, crop-mark nudge).

## What was created or changed

- Merged the confirmed outcome into decisions.md under Content.
- Cleared the four pending Senshi inbox files (all part of this one converged saga).

## What is open

- Nothing. Ben confirmed the prints. Print code untouched.
