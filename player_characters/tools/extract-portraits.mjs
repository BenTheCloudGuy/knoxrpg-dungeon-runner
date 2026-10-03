// Extract real character portraits from D&D Beyond.
//
// Each character sheet PDF is named `Name_<CharacterID>.pdf`. The public
// character-service endpoint returns decorations.avatarUrl, which we download at
// full resolution (query string stripped) into player_characters/art/.
//
// Run from repo root:  node .\player_characters\tools\extract-portraits.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const sheetsDir = path.join(root, "sheets");
const outDir = path.join(root, "art");
fs.mkdirSync(outDir, { recursive: true });

const UA = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

function characters() {
  return fs
    .readdirSync(sheetsDir)
    .filter((f) => /_\d+\.pdf$/i.test(f))
    .map((f) => {
      const m = f.match(/^(.*)_(\d+)\.pdf$/i);
      return { name: m[1], id: m[2] };
    });
}

async function run() {
  const results = [];
  for (const c of characters()) {
    const url = `https://character-service.dndbeyond.com/character/v5/character/${c.id}`;
    const row = { name: c.name, id: c.id, kind: "", saved: "", bytes: 0, note: "" };
    try {
      const res = await fetch(url, { headers: UA });
      if (!res.ok) {
        row.note = `HTTP ${res.status}`;
        results.push(row);
        continue;
      }
      const json = await res.json();
      const avatar = json?.data?.decorations?.avatarUrl || "";
      if (!avatar) {
        row.note = "no avatarUrl (default portrait)";
        results.push(row);
        continue;
      }
      row.kind = /\/content\/|default/i.test(avatar) ? "default" : "custom";
      const full = avatar.split("?")[0];
      const imgRes = await fetch(full, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!imgRes.ok) {
        row.note = `image HTTP ${imgRes.status}`;
        results.push(row);
        continue;
      }
      const buf = Buffer.from(await imgRes.arrayBuffer());
      // D&D Beyond serves these as PNG regardless of the .jpeg URL.
      const dest = path.join(outDir, `${c.name}_${c.id}.png`);
      fs.writeFileSync(dest, buf);
      row.saved = dest;
      row.bytes = buf.length;
    } catch (e) {
      row.note = `ERROR ${e.message}`;
    }
    results.push(row);
    await new Promise((r) => setTimeout(r, 300));
  }

  const ok = results.filter((r) => r.bytes > 0);
  const fail = results.filter((r) => r.bytes === 0);
  for (const r of results) {
    console.log(`${r.name.padEnd(20)} ${r.id} ${r.kind.padEnd(7)} ${r.bytes || r.note}`);
  }
  console.log(`\nextracted=${ok.length} unavailable=${fail.length} total=${results.length}`);
}

run();
