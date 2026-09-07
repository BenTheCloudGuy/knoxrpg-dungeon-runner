# Decision: Deck backs use LONG-edge column-mirror (HP 3301dw)

**Date:** 2026-09-06
**By:** Senshi
**Supersedes:** all prior 2026-09-06 short-edge / row-mirror / rotate-180 duplex decisions for the print-and-play decks.

Ben's HP 3301dw flips duplex on the LONG edge (mirrors the back left-to-right). Confirmed from a printed sheet: front `amulet-worn-or-held` at grid (row2,col0) had `acid` on its back, and `acid` is at (row0,col2), the diagonally opposite corner. That corner-to-corner scramble is what a left-right printer flip does when paired with the old ROW-mirror back mapping.

The three grid generators now map each back with a COLUMN-mirror: `backSlots[r*COLS + (COLS-1-c)] = pageBacks[i]`. Backs are NOT rotated. Each back stays in its own row and only its column flips, so the correct back lands right-side up behind its own front after the flip.

BACK_DY_MM (-2.5), BACK_DX_MM (0), and the crop-mark shift are unchanged. Files: `items/magic-items/deck/tools/sheet-pdfs.mjs`, `items/magic-items/deck/tools/assemble-deck.mjs`, `items/tokens/tools/prize-assemble.mjs`, plus comment/doc updates in `items/magic-items/deck/tools/per-card-pdfs.mjs`, `items/magic-items/deck/tools/README.md`, `props/itemcards.md`. All 31 committed sheet PDFs regenerated (newest 2026-09-06T16:13:54), validated 31/31 as 2-page 612x792 pt.

**Print setting:** duplex flip on the LONG edge.
