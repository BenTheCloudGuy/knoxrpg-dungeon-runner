# Decision: Prizes excluded from the combined print-and-play PDF

**Date:** 2026-09-06
**Owner:** Senshi (Quartermaster)
**Relevant to:** Falin (prize logistics), print/table ops

## Decision

The combined print-and-play file `items/decks/all-decks-printandplay.pdf` now holds the equipment and magic-items decks only. The prizes deck is deliberately excluded so prize cards never print with the player-facing gear.

## Effect

- `items/magic-items/deck/tools/merge-decks.mjs` `DECK_ORDER` is `["equipment", "magic-items"]`.
- Combined file is 58 pages (29 sheets: equipment 23 + magic-items 6), all US-Letter 612x792.
- Prizes print separately and were NOT changed: per-sheet PDFs in `items/decks/prizes/` and the legacy combined prize PDF at `items/tokens/deck/prize-deck-printandplay.pdf` remain as-is.

## Note for Falin

The prize deck is now the only place prize cards live for printing. Keep the prize-deck build and its outputs current on their own; they no longer ride along in the all-decks file.
