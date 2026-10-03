// firearm-gen.mjs, generate painterly card art for Firearm Ammunition (10)
// with the OpenAI Images API (gpt-image-1).
//
// Idempotent: skips the output if it already exists (FORCE=1 to redo).
// Key read from env OPENAI_API_KEY. Never printed.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("No OPENAI_API_KEY in env.");
  process.exit(1);
}

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(toolsDir, ".."); // items/ammo-deck
const itemsDir = path.resolve(deckDir, ".."); // items
const outDir = path.join(itemsDir, "treasure", "images");
const out = path.join(outDir, "firearm-ammunition-10.png");

const STYLE =
  "Painterly fantasy item illustration, single centered object, warm soft lighting, muted warm parchment and neutral background that softly fades toward the edges, rich texture, tabletop RPG treasure aesthetic, no text, no lettering, no logos, no watermark.";

const subject =
  "a small bundle of firearm ammunition: a cluster of lead round musket balls beside a curved powder horn with a little spilled black gunpowder and a few paper cartridges, resting loosely on a surface";

fs.mkdirSync(outDir, { recursive: true });

if (fs.existsSync(out) && !process.env.FORCE) {
  console.log("skipped existing firearm-ammunition-10.png");
  process.exit(0);
}

const prompt = `${subject}. ${STYLE}`;

try {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    }),
  });
  if (!res.ok) {
    console.error("OpenAI image generation failed", res.status, (await res.text()).slice(0, 180));
    process.exit(1);
  }
  const j = await res.json();
  fs.writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64"));
  console.log("generated firearm-ammunition-10.png");
} catch (e) {
  console.error("OpenAI image generation error", e.message);
  process.exit(1);
}
