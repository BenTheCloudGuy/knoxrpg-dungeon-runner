// Download the full D&D Beyond character JSON for every roster character.
// IDs come from the portrait filenames in player_characters/art (Name_<ID>.png).
// Saves the raw response envelope to player_characters/data/<Name>_<ID>.json.
//
// Run from repo root:  node .\player_characters\tools\fetch-all-json.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const artDir = path.join(root, "art");
const outDir = path.join(root, "data");
fs.mkdirSync(outDir, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

function roster() {
  return fs
    .readdirSync(artDir)
    .filter((f) => /_\d+\.png$/i.test(f))
    .map((f) => {
      const m = f.match(/^(.*)_(\d+)\.png$/i);
      return { name: m[1], id: m[2] };
    });
}

async function run() {
  const list = roster();
  const results = [];
  for (const c of list) {
    const dest = path.join(outDir, `${c.name}_${c.id}.json`);
    const row = { name: c.name, id: c.id, note: "" };
    try {
      const res = await fetch(`https://character-service.dndbeyond.com/character/v5/character/${c.id}`, { headers: UA });
      if (!res.ok) { row.note = `HTTP ${res.status}`; results.push(row); continue; }
      const text = await res.text();
      fs.writeFileSync(dest, text);
      const j = JSON.parse(text);
      row.note = `ok (${(text.length / 1024).toFixed(0)} KB) ${j?.data?.name || ""}`;
    } catch (e) {
      row.note = `ERROR ${e.message}`;
    }
    results.push(row);
    await new Promise((r) => setTimeout(r, 300));
  }
  for (const r of results) console.log(`${r.name.padEnd(22)} ${r.id}  ${r.note}`);
  const ok = results.filter((r) => r.note.startsWith("ok")).length;
  console.log(`\nfetched=${ok} / ${results.length}`);
}

run();
