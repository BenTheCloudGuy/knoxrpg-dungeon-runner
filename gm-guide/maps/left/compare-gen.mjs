// Build side-by-side accuracy comparison images: crop (left) vs redraw (right).
// Both panels are resized to a common height and composited with a gap, then
// written downscaled so each compare stays easy to view.
// Output: gm-guide/maps/left/<section>-compare.png
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { SECTIONS } from "./crop-gen.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const H = 760; // common panel height
const GAP = 24;

async function panel(file) {
  const buf = await sharp(file)
    .resize({ height: H })
    .toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, w: meta.width, h: meta.height };
}

async function compareOne(s) {
  const left = await panel(path.join(here, `${s.id}-crop.png`));
  const right = await panel(path.join(here, `${s.id}-map.png`));
  const width = left.w + GAP + right.w;
  const out = path.join(here, `${s.id}-compare.png`);
  await sharp({
    create: { width, height: H, channels: 3, background: { r: 20, g: 20, b: 24 } },
  })
    .composite([
      { input: left.buf, left: 0, top: 0 },
      { input: right.buf, left: left.w + GAP, top: 0 },
    ])
    .png()
    .toFile(out);
  console.log(`${s.id}-compare.png: ${width}x${H}`);
}

const only = process.argv.slice(2);
const list = only.length ? SECTIONS.filter((s) => only.includes(s.id)) : SECTIONS;
for (const s of list) await compareOne(s);
console.log(`done: ${list.length} compare(s)`);
