// journal-sketch-gen.mjs
// Generate one original monochrome notebook sketch for every production note.
// Run with OPENAI_API_KEY set in the same shell. The key is never printed.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const draft = path.join(root, "props", "alchemist-journal-draft.md");
const outDir = path.join(root, "props", "journal-deck", "build", "sketches");
const key = process.env.OPENAI_API_KEY;
if (!key) { console.error("No OPENAI_API_KEY in env."); process.exit(1); }
const raw = fs.readFileSync(draft, "utf8");
const pages = raw.split(/^## Journal Page /m).slice(1).map((block) => { const mm = block.match(/^(\d+)\s*\n([\s\S]*)$/); return [null, mm[1], mm[2]]; });
fs.mkdirSync(outDir, { recursive: true });
let made=0, skipped=0, failed=0;
for (const m of pages) {
  const page = Number(m[1]);
  const notes = [...m[2].matchAll(/^\[Production note for Senshi:\s*(.*?)\]\s*$/gm)];
  for (let i=0; i<notes.length; i++) {
    const out = path.join(outDir, `page-${String(page).padStart(2,"0")}-sketch-${String(i+1).padStart(2,"0")}.png`);
    if (fs.existsSync(out) && !process.env.FORCE) { skipped++; continue; }
    const detail = notes[i][1].replace(/^sketch\s+/i, "").replace(/\.$/, "");
    const prompt = `Loose hand-drawn ink sketch for an alchemist's personal notebook: ${detail}. Monochrome or sepia ink on aged parchment, sketchy linework, quick bench doodle, imperfect strokes, no color, no text, no lettering, no labels, no logos, no watermark.`;
    try {
      const res = await fetch("https://api.openai.com/v1/images/generations", { method:"POST", headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"}, body:JSON.stringify({model:"gpt-image-1",prompt,size:"1024x1024",quality:"medium",n:1}) });
      if (!res.ok) { console.error("FAIL", page, i+1, res.status); failed++; continue; }
      const j = await res.json(); fs.writeFileSync(out, Buffer.from(j.data[0].b64_json,"base64")); made++;
    } catch (e) { console.error("ERROR", page, i+1, e.message); failed++; }
  }
}
console.log(`done: ${made} generated, ${skipped} skipped, ${failed} failed`);



