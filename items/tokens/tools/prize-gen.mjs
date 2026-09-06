// prize-gen.mjs — generate painterly card-art for each prize with the OpenAI
// Images API (gpt-image-1), matching the magic-item deck art style.
//
// Products are described generically (no brand names, no readable text) so the
// art blends into the card backs like the other deck images.
//
// Key is read from the environment (User-scope OPENAI_API_KEY). Never printed.
// Run a subset with ONLY=beholder-potato-head-figure node prize-gen.mjs
// Force re-gen with FORCE=1.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("No OPENAI_API_KEY in env."); process.exit(1); }

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(toolsDir, "..", "images"); // items/tokens/images
fs.mkdirSync(outDir, { recursive: true });

const STYLE =
  "Painterly fantasy illustration, single centered subject, warm soft studio lighting, " +
  "muted warm parchment and neutral background that softly fades toward the edges, rich texture, " +
  "tabletop RPG treasure-hoard aesthetic, no text, no lettering, no logos, no watermark.";

const PRIZES = {
  "beholder-potato-head-figure": "a whimsical collectible desk figurine of a fantasy beholder, a floating round monster with one large central eye and many small eyestalks, rendered in a goofy toy potato-head style, sitting on a wooden surface",
  "4pcs-fantasy-sword-bookmarks": "four ornate metal fantasy sword bookmarks arranged in a neat fan, polished steel blades with decorative jeweled hilts",
  "teeturtle-reversible-plushie-mystery-box": "a small cute reversible stuffed plush toy of a friendly fantasy creature, soft rounded plush style, beside a small closed mystery gift box",
  "hiifeuer-medieval-faux-leather-pouch": "a medieval brown faux-leather drawstring belt pouch, worn adventurer aesthetic, closed with its leather drawcord",
  "haxtec-dragon-eye-dice-bag": "a small brown leather drawstring dice pouch with a glossy round 3D glass dragon eye set on the front",
  "longlongjin-dnd-dragon-journal-with-pen": "an embossed brown faux-leather journal with an ornate dragon design on the cover, a slim black pen resting beside it",
  "the-book-of-holding": "a thick blank leather-bound journal with a clasp, closed, adventurer's notebook aesthetic",
  "duck-dnd-resin-dice-set": "a novelty seven-piece polyhedral resin dice set with a cute rubber-duck theme, translucent yellow dice arranged beside a small velvet drawstring bag",
  "game-masters-book-of-astonishing-random-tables": "a thick hardcover game-master reference tome with a mysterious fantasy cover, closed",
  "banloga-metal-dice-set-with-pocket-watch-case": "a seven-piece antique bronze metal polyhedral dice set displayed in an ornate round bronze dragon pocket-watch-style case",
  "young-adventurers-collection-box-set-1": "a four-book boxed set of illustrated fantasy adventure guidebooks standing in a sturdy slipcase, colorful covers",
  "sweien-hollow-metal-dnd-dice-set": "a premium seven-piece hollow antique metal polyhedral dice set resting in an open vintage wooden box lined with cloth",
  "wooden-dnd-dice-tray-journal-box": "a large handcrafted wooden dice box with a felt-lined rolling tray and storage compartments for dice and miniatures",
  "stupid-dnd-jokes": "a small humorous pocket paperback joke book with a playful cartoon fantasy cover, closed",
  "dnd-2024-core-rulebook-set-gm-screen": "three thick premium fantasy roleplaying hardcover rulebooks stacked together with a folded four-panel game master screen standing behind them, grand-prize treasure presentation",
};

const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
let made = 0, skipped = 0, failed = 0;
for (const [name, desc] of Object.entries(PRIZES)) {
  if (only.length && !only.includes(name)) continue;
  const out = path.join(outDir, name + ".png");
  if (fs.existsSync(out) && !process.env.FORCE) { console.log("exists, skip:", name); skipped++; continue; }
  const prompt = `${desc}. ${STYLE}`;
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", quality: "medium", n: 1 }),
    });
    if (!res.ok) { console.error("FAIL", name, res.status, (await res.text()).slice(0, 160)); failed++; continue; }
    const j = await res.json();
    fs.writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64"));
    console.log("generated:", name, Math.round(fs.statSync(out).size / 1024) + "KB");
    made++;
  } catch (e) { console.error("ERROR", name, e.message); failed++; }
}
console.log(`done: ${made} generated, ${skipped} skipped, ${failed} failed`);
