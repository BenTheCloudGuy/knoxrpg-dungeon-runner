// Probe dimensions of every map we plan to place, to decide rotation.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // gm-guide/maps/left
const repoRoot = path.resolve(here, "..", "..", "..");
const leftDir = here;
const roomsImg = path.resolve(repoRoot, "images", "rooms");
const dungeonImg = path.resolve(repoRoot, "images", "dungeon");

const files = [
  ["artificers-cells", path.join(leftDir, "artificers-cells-crop.png")],
  ["grovlikk-hall", path.join(leftDir, "grovlikk-hall-crop.png")],
  ["library-workshop", path.join(leftDir, "library-workshop-crop.png")],
  ["portal-exit", path.join(leftDir, "portal-exit-crop.png")],
  ["floor-puzzle-hall", path.join(leftDir, "floor-puzzle-hall-crop.png")],
  ["alchemists-lab", path.join(leftDir, "alchemists-lab-crop.png")],
  ["serpents-lair", path.join(leftDir, "serpents-lair-crop.png")],
  ["old-cells", path.join(leftDir, "old-cells-crop.png")],
  ["the-gauntlet", path.join(leftDir, "the-gauntlet-crop.png")],
  ["dungeon-right", path.join(roomsImg, "dungeon-right.jpg")],
  ["cavern-marked-1", path.join(roomsImg, "cavern-marked-1.jpg")],
  ["cavern-marked-2", path.join(roomsImg, "cavern-marked-2.jpg")],
  ["cavern-marked-3", path.join(roomsImg, "cavern-marked-3.jpg")],
  ["GoblinTunnelsPoints", path.join(roomsImg, "GoblinTunnelsPoints.jpg")],
  ["GoblinGrottoPoints", path.join(roomsImg, "GoblinGrottoPoints.jpg")],
  ["dungeon-b-crypts", path.join(dungeonImg, "dungeon-b-crypts.jpg")],
];

for (const [id, f] of files) {
  try {
    const m = await sharp(f).metadata();
    const aspect = m.width >= m.height ? "LANDSCAPE" : "portrait";
    const ratio = (m.width / m.height).toFixed(2);
    console.log(`${id.padEnd(22)} ${String(m.width).padStart(5)}x${String(m.height).padEnd(5)} ${aspect} (w/h=${ratio})`);
  } catch (e) {
    console.log(`${id.padEnd(22)} ERROR ${e.message}`);
  }
}
