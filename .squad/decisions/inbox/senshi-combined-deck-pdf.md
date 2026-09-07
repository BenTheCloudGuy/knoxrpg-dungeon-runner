# Decision: combined print-and-play deck file

**Agent:** Senshi
**Date:** 2026-09-06

There is now a single combined file for printing all three card decks at once: `items/decks/all-decks-printandplay.pdf` (62 pages, US-Letter, front/back interleaved). It merges the 31 committed per-sheet PDFs in deck order equipment -> magic-items -> prizes, each sorted by sheet number.

Rebuild anytime with `items/magic-items/deck/tools/merge-decks.mjs` (re-runnable, reads the deck folders from disk, overwrites the output). Same print settings as a single sheet: long-edge duplex, Actual Size / 100% (or Fit / 96%). Per-deck folders under `items/decks/` are unchanged for printing a single deck. The sheet PDFs and generators were not modified.
