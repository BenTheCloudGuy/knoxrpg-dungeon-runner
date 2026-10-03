// crystal-gen.mjs, generate painterly card art for crystal cards with
// the OpenAI Images API (gpt-image-1), matching the ingredient deck pipeline.
// Reads items/crystals/*.md and writes items/crystals/images/<slug>.png.
//
// Idempotent: skips crystals that already have art (FORCE=1 to redo).
// Subset:  ONLY=green,white node crystal-gen.mjs
// Key read from env OPENAI_API_KEY. Never printed.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("No OPENAI_API_KEY in env."); process.exit(1); }

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, ".."); // items/crystals-deck
const itemsDir = path.resolve(deckDir, ".."); // items
const sourceDir = path.join(itemsDir, "crystals");
const outDir = path.join(sourceDir, "images");

const STYLE =
  "Painterly fantasy item illustration, single centered object, warm soft lighting, muted warm parchment and neutral background that softly fades toward the edges, rich texture, tabletop RPG treasure aesthetic, no text, no lettering, no logos, no watermark.";

const ORDER = [
  "green",
  "white",
  "yellow",
  "blue",
  "purple",
  "red",
  "black",
  "magenta-pink",
  "necrotic",
  "silver",
  "wrought-iron",
  "copper",
  "gold",
];

const COLOR_BY_SLUG = {
  green: "green",
  white: "white",
  yellow: "yellow",
  blue: "blue",
  purple: "purple",
  red: "red",
  black: "black",
  "magenta-pink": "magenta-pink",
  necrotic: "sickly green and black glow",
  silver: "silver",
  "wrought-iron": "dark iron-grey",
  copper: "copper",
  gold: "gold",
};

function listItems() {
  return ORDER.map((slug) => {
    const md = path.join(sourceDir, slug + ".md");
    if (!fs.existsSync(md)) throw new Error(`Missing crystal source ${slug}.md`);
    return { slug, md };
  });
}

const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);

fs.mkdirSync(outDir, { recursive: true });

let made = 0, skipped = 0, failed = 0;
for (const item of listItems()) {
  if (only.length && !only.includes(item.slug)) continue;
  const out = path.join(outDir, item.slug + ".png");
  if (fs.existsSync(out) && !process.env.FORCE) { skipped++; continue; }
  const color = COLOR_BY_SLUG[item.slug];
  const prompt = `a single faceted glowing magical crystal shard, ${color} crystal, resting on a surface. ${STYLE}`;
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", quality: "medium", n: 1 }),
    });
    if (!res.ok) { console.error("FAIL", item.slug, res.status, (await res.text()).slice(0, 180)); failed++; continue; }
    const j = await res.json();
    fs.writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64"));
    made++;
    console.log("generated", item.slug);
  } catch (e) { console.error("ERROR", item.slug, e.message); failed++; }
}
console.log(`done: ${made} generated, ${skipped} skipped (already had art), ${failed} failed`);
if (failed) process.exitCode = 1;
