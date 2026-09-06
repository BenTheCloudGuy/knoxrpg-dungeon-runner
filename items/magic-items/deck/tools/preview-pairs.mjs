// preview-pairs.mjs — stitch front|back side by side for quick review.
// Usage: ONLY=longsword-1,goblin-juice node preview-pairs.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, "..");
const frontsDir = path.join(deckDir, "build", "fronts");
const backsDir = path.join(deckDir, "build", "backs");
const outDir = path.join(deckDir, "build", "preview");
fs.mkdirSync(outDir, { recursive: true });

const names = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
const GAP = 30, W = 750, H = 1050;
for (const name of names) {
  const f = path.join(frontsDir, name + ".png"), b = path.join(backsDir, name + ".png");
  if (!fs.existsSync(f) || !fs.existsSync(b)) { console.log("missing", name); continue; }
  const out = path.join(outDir, name + "-pair.png");
  await sharp({ create: { width: W * 2 + GAP, height: H, channels: 3, background: "#e9e2cf" } })
    .composite([{ input: f, left: 0, top: 0 }, { input: b, left: W + GAP, top: 0 }])
    .png().toFile(out);
  console.log("wrote", out);
}
