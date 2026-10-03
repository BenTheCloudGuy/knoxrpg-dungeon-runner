import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MONSTER_SLUGS, parseMonster, artPromptFor } from "./monster-parse.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const outDir = path.join(root, "monsters", "art");
fs.mkdirSync(outDir, { recursive: true });

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error("No OPENAI_API_KEY in env. Set it from the Windows User scope before running this script.");
  process.exit(1);
}

async function generate(monster, out) {
  const body = {
    model: "gpt-image-1",
    prompt: artPromptFor(monster),
    size: "1024x1024",
    quality: "medium",
    n: 1
  };
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${text ? `: ${text.slice(0, 220)}` : ""}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("image response did not include b64_json");
  fs.writeFileSync(out, Buffer.from(b64, "base64"));
}

let made = 0;
let skipped = 0;
let failed = 0;
const failures = [];
for (const slug of MONSTER_SLUGS) {
  const out = path.join(outDir, `${slug}.png`);
  if (fs.existsSync(out) && !process.env.FORCE) {
    skipped++;
    console.log(`${slug}: skipped`);
    continue;
  }
  const monster = parseMonster(root, slug);
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      console.log(`${slug}: generating attempt ${attempt}`);
      await generate(monster, out);
      ok = true;
      made++;
    } catch (error) {
      if (attempt === 3) {
        failed++;
        failures.push({ slug, error: error.message });
        console.error(`${slug}: failed after retries`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
      }
    }
  }
}

fs.writeFileSync(path.join(outDir, "art-gen-report.json"), JSON.stringify({ made, skipped, failed, failures }, null, 2));
console.log(`done: ${made} generated, ${skipped} skipped, ${failed} failed`);
if (failed) process.exitCode = 1;
