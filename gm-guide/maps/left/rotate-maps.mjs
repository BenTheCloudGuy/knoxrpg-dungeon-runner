// Pre-rotate landscape maps 90deg CW so they fill the tall A5 page.
// Writes rotated copies into gm-guide/a5-build/<id>.png. Portrait / near-square
// maps are NOT rotated here; the build script references their originals.
// Original source images are never modified.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // gm-guide/maps/left
const repoRoot = path.resolve(here, "..", "..", "..");
const leftDir = here;
const roomsImg = path.resolve(repoRoot, "images", "rooms");
const dungeonImg = path.resolve(repoRoot, "images", "dungeon");
const outDir = path.resolve(repoRoot, "gm-guide", "a5-build");

// id -> source file. Only these get rotated (w/h >= ~1.15, landscape).
const ROTATE = [
  ["portal-exit",          path.join(leftDir, "portal-exit-crop.png")],
  ["floor-puzzle-hall",    path.join(leftDir, "floor-puzzle-hall-crop.png")],
  ["alchemists-lab",       path.join(leftDir, "alchemists-lab-crop.png")],
  ["old-cells",            path.join(leftDir, "old-cells-crop.png")],
  ["dungeon-right",        path.join(roomsImg, "dungeon-right.jpg")],
  ["GoblinTunnelsPoints",  path.join(roomsImg, "GoblinTunnelsPoints.jpg")],
  ["GoblinGrottoPoints",   path.join(roomsImg, "GoblinGrottoPoints.jpg")],
  ["dungeon-b-crypts",     path.join(dungeonImg, "dungeon-b-crypts.jpg")],
];

for (const [id, src] of ROTATE) {
  const out = path.join(outDir, `${id}.png`);
  const info = await sharp(src).rotate(90).png().toFile(out);
  console.log(`rotated ${id}: -> ${info.width}x${info.height}  ${out}`);
}
console.log(`done: ${ROTATE.length} rotated map(s)`);
