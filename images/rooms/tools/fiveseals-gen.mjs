import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("No OPENAI_API_KEY in env.");
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const roomsDir = path.resolve(here, "..");
const referencePath = path.join(roomsDir, "FiveSeals.png");
const outputPath = referencePath;

if (!fs.existsSync(referencePath)) {
  console.error(`Reference image missing: ${referencePath}`);
  process.exit(1);
}

const PROMPT = [
  "Starting from the supplied reference image, keep the exact five canon seal symbols and their exact left-to-right order.",
  "Seal 1: a road traveling straight into a radiant rising sun.",
  "Seal 2: an upright gauntlet with a single staring eye on the palm.",
  "Seal 3: an upright skeletal arm holding a balanced pair of scales.",
  "Seal 4: a ring of exactly seven stars inside a circle.",
  "Seal 5: a black mask.",
  "Do not swap, merge, restyle beyond recognition, or replace any of those five symbols.",
  "Recompose the scene into a wide dungeon wall shot, rich and atmospheric, like a final boss puzzle chamber.",
  "Each symbol sits inside its own circular stone medallion or inlaid roundel mounted on the wall, with ornate carved frames and stone arch details around the composition.",
  "Below the medallions, keep a row of five heavy stone switches or levers, one under each seal, with subtle blue-white lightning or arcane crackle running between them and across the wall.",
  "Add warm torchlight only as accent lighting from braziers on both outer sides.",
  "Keep the overall mood dark, foreboding, ominous, and dungeon-like, closer to the original reference tone than to a bright golden scene.",
  "Show more of the room: a stone floor in the foreground with a faint circular emblem or mosaic, scattered rubble and broken stone at the base of the wall, stone pilasters, and banner-like drapery hanging near the outer edges.",
  "All banner, plaque, and inscription surfaces must stay abstract and illegible.",
  "No legible text, no readable letters, no words, no numbers, no logos, no watermark, no runes that look like real writing.",
  "Painterly fantasy dungeon illustration, cohesive stone texture, high detail, landscape composition."
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
  form.append("size", "1536x1024");
  form.append("quality", "high");
  form.append("n", "1");
  form.append(
    "image",
    new Blob([fs.readFileSync(referencePath)], { type: "image/png" }),
    path.basename(referencePath)
  );

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400);
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
      size: "1536x1024",
      quality: "high",
      n: 1,
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 400);
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
console.log(`generated ${path.basename(outputPath)} via ${mode}, ${sizeKb} KB`);
