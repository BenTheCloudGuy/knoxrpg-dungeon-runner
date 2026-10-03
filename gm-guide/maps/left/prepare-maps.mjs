// Prepare every A5 map asset: optional 90deg CW rotation (landscape -> portrait),
// downscale to print resolution, flatten onto white, encode JPEG. Output goes to
// gm-guide/a5-build/<id>.jpg. Original source images are never modified.
//
// Longest side capped at 2200px (~300dpi across a ~7in A5 page) so the booklet
// PDF stays small while the maps remain legible.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // gm-guide/maps/left
const repoRoot = path.resolve(here, "..", "..", "..");
const leftDir = here;
const roomsImg = path.resolve(repoRoot, "images", "rooms");
const dungeonImg = path.resolve(repoRoot, "images", "dungeon");
const outDir = path.resolve(repoRoot, "gm-guide", "a5-build");

const CAP = 2200; // max long-side px
const Q = 82;     // jpeg quality

// id, source file, rotate90CW?
const MAPS = [
  // Left Dungeon: whole original section photos ONLY. Custom crops dropped per GM.
  ["dungeon-left",         path.join(roomsImg, "dungeon-left.jpg"),             false],
  ["artificers-lair",      path.join(roomsImg, "ArtificersLair.jpg"),           true],
  ["dungeon-right",        path.join(roomsImg, "dungeon-right.jpg"),            true],
  ["cavern-marked-1",      path.join(roomsImg, "cavern-marked-1.jpg"),          false],
  ["cavern-marked-2",      path.join(roomsImg, "cavern-marked-2.jpg"),          false],
  ["cavern-marked-3",      path.join(roomsImg, "cavern-marked-3.jpg"),          false],
  ["GoblinTunnelsPoints",  path.join(roomsImg, "GoblinTunnelsPoints.jpg"),      true],
  ["GoblinGrottoPoints",   path.join(roomsImg, "GoblinGrottoPoints.jpg"),       true],
  ["dungeon-b-crypts",     path.join(dungeonImg, "dungeon-b-crypts.jpg"),       true],
];

for (const [id, src, rot] of MAPS) {
  let img = sharp(src);
  if (rot) img = img.rotate(90);
  const out = path.join(outDir, `${id}.jpg`);
  const info = await img
    .resize({ width: CAP, height: CAP, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: Q, mozjpeg: true })
    .toFile(out);
  const aspect = info.width >= info.height ? "landscape" : "portrait";
  console.log(`${id.padEnd(20)} ${rot ? "rot " : "    "}-> ${info.width}x${info.height} ${aspect} ${(info.size / 1024).toFixed(0)}KB`);
}
console.log(`done: ${MAPS.length} map(s)`);
