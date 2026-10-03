# Decision: A5 GM Guide booklet uses original maps only

**Date:** 2026-10-02
**Proposed by:** Senshi (Quartermaster)
**Requested by:** Ben (GM)

## Decision
The custom Left Dungeon crops (`gm-guide/maps/left/*-crop.png`) AND the AI redraws (`gm-guide/maps/left/*-map.png`) are ABANDONED entirely for the A5 booklet. Nothing from `gm-guide/maps/left/` is used. Every map page in the finished A5 GM guide (`GM-Guide-A5.pdf`, repo root) is a WHOLE original photo, scaled/rotated to fit A5.

The Left Dungeon (D1-D11) now opens with exactly TWO whole original photos as map pages, in order:
1. `images/rooms/dungeon-left.jpg` — full left-table overview (red pins 1-11 = rooms D1-D11), no rotation (near-square 0.95 aspect).
2. `images/rooms/ArtificersLair.jpg` — blue-stone Artificers closeup (pins 1-5 = D1-D5), rotated 90 deg to fill the portrait page height (landscape 1.11 aspect).

After the two map pages, all Left Dungeon room data (D1-D11) flows continuously from `rooms/Dungeon-Left.md`, exactly as other areas do. Landscape maps elsewhere are rotated to fill; maps downscaled (JPEG q82, 2200px long side) to keep file size reasonable.

## Scope / what this is
- Separate A5 output: 5.5×8.5in portrait, booklet (front-and-back), 98 pages.
- Front section: title page + Part 1 House Rules + Part 2 Conditions/DCs + Part 3 Running Xhal'theris. Then dungeon area-by-area: each area's original map on its own page immediately before its live-sliced room data (pulled from canon `rooms/*.md`).
- Builder: `gm-guide/proof/build-a5.mjs` + `gm-guide/proof/a5.css` + `gm-guide/maps/left/prepare-maps.mjs`. This does NOT touch the Letter-size `GM-Guide.md` or `gm-guide/tools/print.css`.

## Known limitations (reported to GM)
1. Booklet imposition uses the map-immediately-before-data fallback, NOT strict verso/even-page facing placement.
2. Dungeon-Right (R1–R11) is one dense original map on a single page, not sub-cropped (no crop plan existed; sub-cropping risked cutting rooms).
3. Boss "Tactics" commentary flows as prose and may break across pages by design; the boxed stat blocks themselves never split.

## Update (2026-10-03): crops rejected, whole photos only
Ben reviewed and rejected the Left Dungeon crops ("the crops are not good"). Decision: DROP all custom crops entirely; use ONLY whole original section photos. Fixed the Left Dungeon map pages (nine crop pages -> two whole photos: dungeon-left.jpg overview + ArtificersLair.jpg closeup). All other areas were already whole originals and were left untouched. Rebuilt and verified: 87 pages (was 98), every page 5.5x8.5, no read-aloud/stat-block splits. Prepared assets renamed in `gm-guide/maps/left/prepare-maps.mjs` (dropped 9 crop entries, added `dungeon-left` + `artificers-lair`).
