// Carve tight section crops from the Left Dungeon source maps.
// Crop regions are expressed as fractions of the source so they are easy to
// nudge. Each crop is both the accuracy reference and the redraw input.
// Output: gm-guide/maps/left/<section>-crop.png
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..");
const roomsImg = path.join(repoRoot, "images", "rooms");

// section, source file, fractional crop {l,t,w,h}
export const SECTIONS = [
  { id: "artificers-cells",    src: "ArtificersLair.jpg",      l: 0.48, t: 0.42, w: 0.44, h: 0.46 },
  { id: "grovlikk-hall",       src: "ArtificersLair.jpg",      l: 0.24, t: 0.50, w: 0.40, h: 0.44 },
  { id: "library-workshop",    src: "ArtificersLair.jpg",      l: 0.00, t: 0.12, w: 0.48, h: 0.52 },
  { id: "portal-exit",         src: "ArtificersLair.jpg",      l: 0.50, t: 0.00, w: 0.48, h: 0.34 },
  { id: "floor-puzzle-hall",   src: "dungeon-left.jpg",        l: 0.56, t: 0.50, w: 0.44, h: 0.32 },
  { id: "alchemists-lab",      src: "AlchemistsLabPoints.jpg", l: 0.02, t: 0.02, w: 0.96, h: 0.62 },
  { id: "serpents-lair",       src: "dungeon-left.jpg",        l: 0.47, t: 0.10, w: 0.48, h: 0.42 },
  { id: "old-cells",           src: "OldCellsPoints.jpg",      l: 0.08, t: 0.24, w: 0.84, h: 0.70 },
  { id: "the-gauntlet",        src: "TheGuantlet.jpg",         l: 0.44, t: 0.03, w: 0.40, h: 0.93 },
];

async function cropOne(s) {
  const file = path.join(roomsImg, s.src);
  const meta = await sharp(file).metadata();
  const left = Math.round(s.l * meta.width);
  const top = Math.round(s.t * meta.height);
  let width = Math.round(s.w * meta.width);
  let height = Math.round(s.h * meta.height);
  width = Math.min(width, meta.width - left);
  height = Math.min(height, meta.height - top);
  const out = path.join(here, `${s.id}-crop.png`);
  await sharp(file).extract({ left, top, width, height }).png().toFile(out);
  const aspect = width >= height ? "landscape" : "portrait";
  console.log(`${s.id}: ${s.src} -> ${width}x${height} (${aspect}) [${left},${top}]`);
}

const only = process.argv.slice(2);
const list = only.length ? SECTIONS.filter((s) => only.includes(s.id)) : SECTIONS;
const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (invokedDirectly) {
  for (const s of list) await cropOne(s);
  console.log(`done: ${list.length} crop(s)`);
}
