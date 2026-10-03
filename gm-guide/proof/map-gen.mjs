// Proof-only map redraw for the A5 booklet proof (Artificer's Workshop area).
// Follows the project pattern in images/rooms/tools/fiveseals-gen.mjs:
// POST the reference to images/edits with model gpt-image-1, quality high,
// portrait 1024x1536. Falls back to images/generations if edits fails.
// Output: gm-guide/proof/ArtificersWorkshop-map.png
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("No OPENAI_API_KEY in env.");
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");
const referencePath = path.join(repoRoot, "images", "rooms", "ArtificersLair.jpg");
const outputPath = path.join(here, "ArtificersWorkshop-map.png");
const SIZE = "1024x1536"; // portrait, fills the left page of the A5 spread

if (!fs.existsSync(referencePath)) {
  console.error(`Reference image missing: ${referencePath}`);
  process.exit(1);
}

const PROMPT = [
  "Redraw the supplied reference image as a clean top-down fantasy dungeon battle map of this area.",
  "Keep the rough room shapes, proportions, and overall layout from the reference: the same cluster of connected chambers and corridors in roughly the same positions.",
  "Render it as a crisp overhead tabletop battle map an RPG group would play on, with clear stone walls, floor tiles, doorways, and room divisions.",
  "Atmospheric and moody but readable: warm torchlit stone, subtle shadows, clean edges, good contrast so every room and passage is easy to make out.",
  "Keep the dungeon dressing suggested by the reference (workcenches, debris, rubble, scattered bones, a mirror or portal feature) as simple top-down shapes.",
  "Absolutely NO legible text, no letters, no numbers, no runes that look like writing, no labels, no grid coordinates, no map legend, no title, no watermark, no logos.",
  "Any inscriptions, banners, or book spines must stay abstract and illegible.",
  "Painterly fantasy cartography, cohesive stone texture, high detail, portrait composition filling the full frame.",
].join(" ");

function decodeImagePayload(payload) {
  const b64 = payload?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data returned by API.");
  return Buffer.from(b64, "base64");
}

function validatePng(buffer) {
  const pngSig = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== pngSig) {
    throw new Error("Returned bytes are not a PNG.");
  }
  if (buffer.length < 200 * 1024) {
    throw new Error(`Generated PNG is unexpectedly small: ${buffer.length} bytes.`);
  }
}

async function requestEdit() {
  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", PROMPT);
  form.append("size", SIZE);
  form.append("quality", "high");
  form.append("n", "1");
  form.append(
    "image",
    new Blob([fs.readFileSync(referencePath)], { type: "image/jpeg" }),
    path.basename(referencePath)
  );

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 600);
    throw new Error(`images/edits ${res.status}: ${detail}`);
  }

  return decodeImagePayload(await res.json());
}

async function requestGeneration() {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: PROMPT,
      size: SIZE,
      quality: "high",
      n: 1,
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 600);
    throw new Error(`images/generations ${res.status}: ${detail}`);
  }

  return decodeImagePayload(await res.json());
}

let buffer;
let mode = "edit";

try {
  buffer = await requestEdit();
} catch (error) {
  console.warn(`Edit request failed, falling back to generation: ${error.message}`);
  mode = "generation";
  buffer = await requestGeneration();
}

validatePng(buffer);
fs.writeFileSync(outputPath, buffer);
const sizeKb = Math.round(fs.statSync(outputPath).size / 1024);
console.log(`generated ${path.basename(outputPath)} via ${mode}, ${sizeKb} KB (${SIZE})`);
