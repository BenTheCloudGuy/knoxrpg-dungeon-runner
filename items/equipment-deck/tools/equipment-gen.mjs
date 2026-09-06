// equipment-gen.mjs — generate painterly card-art for mundane gear with the
// OpenAI Images API (gpt-image-1), matching the deck style. Walks
// items/treasure, items/armor, items/weapons and writes <folder>/images/<name>.png.
//
// Idempotent: skips items that already have art (FORCE=1 to redo).
// Subset:  ONLY=longsword,chain-mail node equipment-gen.mjs
// One folder: FOLDER=weapons node equipment-gen.mjs
// Key read from env OPENAI_API_KEY. Never printed.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("No OPENAI_API_KEY in env."); process.exit(1); }

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const itemsDir = path.resolve(toolsDir, "..", ".."); // items
const SRC = ["treasure", "armor", "weapons"];

const STYLE =
  "Painterly fantasy item illustration, single centered object, warm soft lighting, " +
  "muted warm parchment and neutral background that softly fades toward the edges, rich texture, " +
  "tabletop RPG treasure aesthetic, no text, no lettering, no logos, no watermark.";

function fmOf(md) {
  const fm = {};
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (m) for (const line of m[1].split(/\r?\n/)) { const x = line.match(/^(\w+):\s*(.*)$/); if (x) fm[x[1]] = x[2].replace(/^"|"$/g, "").trim(); }
  return fm;
}

function listItems() {
  const out = [];
  for (const s of SRC) {
    const dir = path.join(itemsDir, s);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith(".md")) out.push({ folder: s, name: f.replace(/\.md$/, ""), md: path.join(dir, f) });
  }
  return out;
}

const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
const folderFilter = (process.env.FOLDER || "").trim();

let made = 0, skipped = 0, failed = 0;
for (const item of listItems()) {
  if (only.length && !only.includes(item.name)) continue;
  if (folderFilter && item.folder !== folderFilter) continue;
  const outDir = path.join(itemsDir, item.folder, "images");
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, item.name + ".png");
  if (fs.existsSync(out) && !process.env.FORCE) { skipped++; continue; }
  const fm = fmOf(fs.readFileSync(item.md, "utf8"));
  const title = fm.title || item.name;
  const cat = (fm.category || fm.armor_category || item.folder).replace(/\s*\(.*?\)\s*/g, "").trim();
  const prompt = `a single ${title}, a ${cat} item from Dungeons and Dragons, isolated object resting on a surface. ${STYLE}`;
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", quality: "medium", n: 1 }),
    });
    if (!res.ok) { console.error("FAIL", item.name, res.status, (await res.text()).slice(0, 140)); failed++; continue; }
    const j = await res.json();
    fs.writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64"));
    made++;
    if (made % 10 === 0) console.log("...", made, "generated");
  } catch (e) { console.error("ERROR", item.name, e.message); failed++; }
}
console.log(`done: ${made} generated, ${skipped} skipped (already had art), ${failed} failed`);
