// gear-gen.mjs, generate painterly card art for the single-item gear sheets.
//
// Run:
//   node items\gear-deck\tools\gear-gen.mjs artificers-toolkit
//   node items\gear-deck\tools\gear-gen.mjs smithing-tools

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(here, "..");
const itemsDir = path.resolve(deckDir, "..");
const outDir = path.join(itemsDir, "treasure", "images");

const STYLE =
  "Painterly fantasy item illustration, single centered object, warm soft lighting, muted warm parchment and neutral background that softly fades toward the edges, rich texture, tabletop RPG treasure aesthetic, no text, no lettering, no logos, no watermark.";

const DECKS = {
  "artificers-toolkit": {
    out: path.join(outDir, "artificers-toolkit.png"),
    subject:
      "a leather artificer's toolroll opened to show fine brass gears, tiny wrenches, files, calipers, and tinkering tools, resting on a workbench",
  },
  "smithing-tools": {
    out: path.join(outDir, "smithing-tools.png"),
    subject:
      "a blacksmith's smithing tools, a hammer, tongs, and a punch resting on an anvil beside glowing forge embers",
  },
};

async function generate(key) {
  const config = DECKS[key];
  if (!config) throw new Error(`Unknown gear art "${key}". Use artificers-toolkit, smithing-tools, or all.`);

  fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(config.out) && !process.env.FORCE) {
    console.log(`skipped existing ${path.basename(config.out)}`);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("No OPENAI_API_KEY in env.");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: `${config.subject}. ${STYLE}`,
      size: "1024x1024",
      quality: "medium",
      n: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI image generation failed ${res.status}: ${(await res.text()).slice(0, 180)}`);
  }

  const body = await res.json();
  fs.writeFileSync(config.out, Buffer.from(body.data[0].b64_json, "base64"));
  console.log(`generated ${path.basename(config.out)}`);
}

const target = process.argv[2];
if (!target) throw new Error("Missing gear art name. Use artificers-toolkit, smithing-tools, or all.");

if (target === "all") {
  for (const key of Object.keys(DECKS)) await generate(key);
} else {
  await generate(target);
}
