# Left Dungeon - Map Section Plan

The Left Dungeon ("Artificers Workshop" block plus the serpent and gauntlet
wings) is carved into 9 small sections. Each section covers one to three rooms
and is sized to pair with roughly one A5 page of room data. Every section has a
tight crop from the best source image (the accuracy reference and the redraw
input) and a redraw that preserves that layout.

Crop regions are stored as fractions of the source image in
[crop-gen.mjs](crop-gen.mjs). Re-run a single crop with
`node crop-gen.mjs <section-id>`.

## Sections

| Section id | Rooms | Source image | Crop region (frac l,t,w,h) | Crop px | Aspect |
| --- | --- | --- | --- | --- | --- |
| artificers-cells | D1 The Cells | ArtificersLair.jpg | 0.48, 0.42, 0.44, 0.46 | 1760x1664 | landscape |
| grovlikk-hall | D2 Grovlikk's Last Laugh | ArtificersLair.jpg | 0.24, 0.50, 0.40, 0.44 | 1600x1592 | landscape |
| library-workshop | D3 Artificers Library + D5 Artificers Workshop | ArtificersLair.jpg | 0.00, 0.12, 0.48, 0.52 | 1920x1881 | landscape |
| portal-exit | D4 Portal Room [DUNGEON EXIT] | ArtificersLair.jpg | 0.50, 0.00, 0.48, 0.34 | 1920x1230 | landscape |
| floor-puzzle-hall | D6 Hallway + Wizards Floor Puzzle | dungeon-left.jpg | 0.56, 0.50, 0.44, 0.32 | 1144x875 | landscape |
| alchemists-lab | D7 Alchemists Lab | AlchemistsLabPoints.jpg | 0.02, 0.02, 0.96, 0.62 | 2789x2292 | landscape |
| serpents-lair | D8 Entrance + D9 Serpents Lair | dungeon-left.jpg | 0.47, 0.10, 0.48, 0.42 | 1248x1149 | landscape |
| old-cells | D10 The Old Cells | OldCellsPoints.jpg | 0.08, 0.24, 0.84, 0.70 | 2520x2026 | landscape |
| the-gauntlet | D11 The Gauntlet | TheGuantlet.jpg | 0.44, 0.03, 0.40, 0.93 | 1600x2790 | portrait |

## Notes on source choices

- D1-D5 all live on the blue-stone Artificers block in **ArtificersLair.jpg**
  (red point markers 1-5). It is the highest-resolution source for that wing, so
  four of the nine sections crop from it.
- D6's lettered floor puzzle is redrawn as a glowing blank-tile grid. The
  lettered solution (spelling the passphrase) is kept as a reference in the
  room text and is deliberately NOT rendered as legible letters on the map.
- The **Five Seals** wall (FiveSeals.png) is a vertical elevation handout, not a
  top-down map. It is excluded from this map set. It belongs with the gauntlet
  as a wall prop, handled separately.
- Colored point markers, arrows, lock icons, and emoji in the source photos are
  overlays, not terrain. The redraw prompt tells the model to ignore them.

## Accuracy check

Filled in after redraws. For each section: did the redraw keep the same room
shapes, room count, doorways, and key features? Compare images are
`<section>-compare.png` (crop left, redraw right).

| Section id | Verdict | Notes |
| --- | --- | --- |
| artificers-cells | Faithful | Central framed square, table, bodies, chest, and lava pool all kept. Right wall drifted into a pillar grid instead of solid wall. Minor. |
| grovlikk-hall | Faithful | Central statue figure, top-right table, chest, and scattered rubble preserved. Room shape and single-chamber layout hold. |
| library-workshop | Faithful | Two-room split with the divider beam kept. Shelf runs and the light source read correctly. Good match. |
| portal-exit | Faithful | Single chamber, central door, portal arch, and side niche all present. The crop's twin curved arcs collapsed to one arch. Minor drift, acceptable. |
| floor-puzzle-hall | Faithful | Corridor plus two braziers and the puzzle chamber kept. Tiles are intentionally abstracted to glowing blank floor and letters are omitted by design, per the plan note. |
| alchemists-lab | Faithful | Rounded main chamber, central green vat, wall niche, pillars, and the side room all preserved. Strongest match of the set. |
| serpents-lair | Faithful | Small entrance chamber with the coiled serpent plus the large circular knotwork lair, central square, braziers, and chest all kept. Top corridor simplified. Minor. |
| old-cells | Faithful | Cell grid with beds preserved along with both round pits (ice-serpent and skull-over-lava) in the correct spots. Cell count is close, not exact. |
| the-gauntlet | Faithful | Tall portrait corridor maze with torches and a framed wall panel preserved. The exact passage path is reinterpreted because the source is a loose ruin pile, not a clean grid. Faithful to intent. |
