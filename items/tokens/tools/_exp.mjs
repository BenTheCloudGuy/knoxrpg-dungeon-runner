import sharp from "sharp";
import path from "path";
const imagesDir = path.resolve("..", "images");
const slugs = ["beholder-potato-head-figure", "duck-dnd-resin-dice-set", "dnd-2024-core-rulebook-set-gm-screen", "the-book-of-holding", "haxtec-dragon-eye-dice-bag"];
const TRACE_PX = 700;

function cornerLuma(data, info) {
  const { width, height, channels } = info;
  const box = Math.max(4, Math.round(Math.min(width, height) * 0.06));
  let sum = 0, n = 0;
  const px = (x, y) => data[(y * width + x) * channels];
  for (let y = 0; y < box; y++) for (let x = 0; x < box; x++) {
    sum += px(x, y) + px(width - 1 - x, y) + px(x, height - 1 - y) + px(width - 1 - x, height - 1 - y);
    n += 4;
  }
  return sum / n;
}

for (const slug of slugs) {
  const src = path.join(imagesDir, slug + ".png");
  const base = sharp(src).resize(TRACE_PX, TRACE_PX, { fit: "inside" }).flatten({ background: "#ffffff" }).grayscale().normalize();
  const { data, info } = await base.clone().raw().toBuffer({ resolveWithObject: true });
  const corner = cornerLuma(data, info);
  let proc = base;
  if (corner < 128) proc = proc.negate();
  for (const t of [200, 220, 235, 245]) {
    await proc.clone().median(3).threshold(t).png().toFile(`_t_${slug}_${t}.png`);
  }
  console.log(slug, "corner", corner.toFixed(0));
}
console.log("done");
