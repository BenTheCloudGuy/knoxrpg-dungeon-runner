// Redraw each Left Dungeon crop as a clean top-down battle map that preserves
// the cropped layout. Follows the project pattern in
// gm-guide/proof/map-gen.mjs and images/rooms/tools/fiveseals-gen.mjs:
// POST the crop to images/edits with gpt-image-1, quality high; size matches
// the crop aspect; fall back to images/generations if edits fails.
// Output: gm-guide/maps/left/<section>-map.png
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { SECTIONS } from "./crop-gen.mjs";

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("No OPENAI_API_KEY in env.");
  process.exit(1);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const LANDSCAPE = "1536x1024";
const PORTRAIT = "1024x1536";

// Per-section dressing hints so the model keeps the features that matter.
const DRESSING = {
  "artificers-cells": "a row of small barred prison cells along the walls",
  "grovlikk-hall": "a broad hall with a large central statue or figure and scattered rubble",
  "library-workshop": "a library and workshop: shelves along the walls, worktables, a workbench, scattered debris and bones",
  "portal-exit": "a chamber with a large circular portal or archway feature set into one wall",
  "floor-puzzle-hall": "a corridor opening into a square room with a grid of floor tiles",
  "alchemists-lab": "a rounded chamber with a large circular vat or well in the center and a ring of pillars around the walls",
  "serpents-lair": "an ornate knotwork chamber with a raised dais and a large open floor",
  "old-cells": "a block of small cells in a grid, each with a bed, lava pits sunk into the floor",
  "the-gauntlet": "a long narrow maze of stone corridors with branching dead-ends and fire hazards",
};

function buildPrompt(id) {
  const dressing = DRESSING[id] || "connected stone chambers and corridors";
  return [
    "Redraw the supplied reference photo as a clean top-down fantasy dungeon battle map of exactly this area.",
    "Preserve the layout from the reference faithfully: the same room shapes, the same number of rooms, the same wall lines, the same doorways and openings, all in the same positions and proportions.",
    `This area is ${dressing}. Keep those features in the same spots as simple top-down shapes.`,
    "Keep any tables, braziers, chests, pillars, water, lava, statues, or bodies visible in the reference, placed where they sit in the reference.",
    "Render it as a crisp overhead tabletop battle map an RPG group would play on: clear stone walls, floor tiles, doorways, and room divisions, warm torchlit stone with subtle shadows, clean edges and good contrast.",
    "Ignore any colored dots, numbered circles, red arrows, lock icons, emoji, or blurred areas in the reference. Those are overlays and camera artifacts, not terrain. Do not draw them.",
    "Absolutely NO legible text, no letters, no numbers, no runes that look like writing, no labels, no grid coordinates, no legend, no title, no watermark, no logos. Any inscriptions stay abstract and illegible.",
    "Painterly fantasy cartography, cohesive stone texture, high detail, filling the full frame.",
  ].join(" ");
}

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

async function requestEdit(refPath, prompt, size) {
  const form = new FormData();
  form.append("model", "gpt-image-1");
  form.append("prompt", prompt);
  form.append("size", size);
  form.append("quality", "high");
  form.append("n", "1");
  form.append(
    "image",
    new Blob([fs.readFileSync(refPath)], { type: "image/png" }),
    path.basename(refPath)
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

async function requestGeneration(prompt, size) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size, quality: "high", n: 1 }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 600);
    throw new Error(`images/generations ${res.status}: ${detail}`);
  }
  return decodeImagePayload(await res.json());
}

async function redrawOne(s) {
  const refPath = path.join(here, `${s.id}-crop.png`);
  const outPath = path.join(here, `${s.id}-map.png`);
  const meta = await sharp(refPath).metadata();
  const size = meta.width >= meta.height ? LANDSCAPE : PORTRAIT;
  const prompt = buildPrompt(s.id);

  let buffer;
  let mode = "edit";
  try {
    buffer = await requestEdit(refPath, prompt, size);
  } catch (error) {
    console.warn(`${s.id}: edit failed, falling back to generation: ${error.message}`);
    mode = "generation";
    buffer = await requestGeneration(prompt, size);
  }
  validatePng(buffer);
  fs.writeFileSync(outPath, buffer);
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`${s.id}: ${path.basename(outPath)} via ${mode}, ${kb} KB (${size})`);
}

const only = process.argv.slice(2);
const list = only.length ? SECTIONS.filter((s) => only.includes(s.id)) : SECTIONS;
for (const s of list) {
  try {
    await redrawOne(s);
  } catch (error) {
    console.error(`${s.id}: FAILED - ${error.message}`);
  }
}
console.log(`done: ${list.length} redraw(s) attempted`);
