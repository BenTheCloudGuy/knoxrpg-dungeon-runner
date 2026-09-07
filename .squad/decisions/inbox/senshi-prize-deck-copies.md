# Decision: Prize deck is one card per physical prize copy (copy-driven)

**Date:** 2026-09-06
**Author:** Senshi

## What changed
- The prize print deck now renders one card per physical prize copy, not one per prize type. Total went from 15 cards to 20.
- Multi-copy prizes carry a `copies:` frontmatter field in their `items/tokens/*.md`:
  - HiiFeuer Medieval Faux Leather Pouch = 2
  - LongLongJin DND Dragon Journal with Pen = 3
  - The Book of Holding = 2
  - Wooden DnD Dice Tray & Journal Box = 2
  - All other 11 prize tokens default to 1.
- Source of truth for QTY is `thoughts.md` `## Prizes` (QTY column). Adjust copies there and re-run the pipeline; the deck follows.

## Pipeline (repeatable)
1. Edit `copies:` in the token md (or `thoughts.md` QTY, then mirror to token frontmatter).
2. `node prize-render.mjs` (from `items/tokens/tools`) — writes `<name>-2.png` etc into build/fronts and build/backs, idempotent cleanup on reduction.
3. Rebuild committed sheets, then `merge-decks.mjs`, then `prize-assemble.mjs` for the legacy combined PDF.

## Result
- `items/decks/prizes/` now has 3 sheet PDFs (9+9+2). `items/decks/all-decks-printandplay.pdf` is now 64 pages (32 sheets).

## Flag for Falin
- `prizes.md` has NO QTY column; `thoughts.md` does. The two are out of sync on quantity. If Ben wants a single source of truth for prize counts, `prizes.md` should get a QTY column reconciled to `thoughts.md`.
