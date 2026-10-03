# Decision: A5 booklet imposition — back-to-back map "runs"

**Area:** gm-guide A5 booklet (`GM-Guide-A5.pdf`, `gm-guide/proof/build-a5.mjs`, `gm-guide/proof/a5.css`)
**Requested by:** Ben
**Date:** 2026-10-03

## Rule (refines the prior "every map on a LEFT page" imposition)

1. **Back-to-back maps** (two or more consecutive map pages with NO room data between
   them) are placed one-per-page on FACING pages with **no blank between them**. Only the
   FIRST map of such a run is parity-locked to a LEFT/even page; the 2nd+ maps follow
   immediately and land on the alternating facing pages (a run of 2 = LEFT then RIGHT).
2. A **standalone** area map still opens on a LEFT/even page, facing its data on the right.
3. Room-by-room data may start on a left OR right page; it must never share a page with a
   map (map pages stay map-only). Unchanged.

## Concrete result (Left Dungeon)

- Overview (`dungeon-left.jpg`) on **p14 LEFT** (carries the Part 4 heading atop).
- Artificers closeup (`artificers-lair.jpg`) on **p15 RIGHT** (immediately facing, no blank).
- D1 "The Cells" room data begins **p16**.

## Implementation

- `build-a5.mjs`: added a `RUN_LEADER[]` array (first map of each consecutive map-run =
  leader). The parity solver now only pads/parity-checks run leaders; followers are never
  padded, keeping them adjacent to their leader.
- Blank fillers dropped from **7 → 5** (pages 47, 53, 61, 71, 87). Total page count
  **93 → 91**. All leaders on LEFT/even verified; no map page carries room data; no
  literal markdown leaks; all pages 5.5×8.5 in.
- `a5.css`: doc-comment only (describes the run rule); no functional CSS change needed.
