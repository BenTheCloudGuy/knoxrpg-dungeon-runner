// Assembles the Master GM Guide from the section files into a single GM-Guide.md at the repo root.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = dirname(fileURLToPath(import.meta.url));
const guideDir = resolve(toolsDir, "..");        // gm-guide/
const repoRoot = resolve(guideDir, "..");        // repo root

const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n").trim();

// Rewrite the first top-level H1 of a section to a standardized Part heading.
function setPartTitle(md, partTitle) {
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^#\s+/.test(lines[i])) {
      lines[i] = `# ${partTitle}`;
      break;
    }
  }
  return lines.join("\n");
}

// Fix image paths inside room-file bodies so they resolve from the repo root.
function fixRoomImages(md) {
  return md
    .replaceAll("](../images/", "](images/")
    .replaceAll("](../monsters/", "](monsters/")
    .replaceAll("](../handouts/", "](handouts/")
    .replaceAll("](../props/", "](props/")
    .replaceAll("](image/crypts/1789587892413.jpg)", "](images/dungeon/dungeon-b-crypts.jpg)")
    .replaceAll("](image/gauntlet/1789597309075.png)", "](images/rooms/TheGuantlet.jpg)")
    .replaceAll("](image/gauntlet/1789603585630.png)", "](images/rooms/FiveSeals-handout.png)");
}

// Some room files inconsistently use "#" for mid-file area dividers. Keep only
// the first H1 (the area/page title) and demote any later H1 to H2 so the
// print CSS does not force a near-empty page break mid-area. Skips fenced code.
function normalizeRoomHeadings(md) {
  const lines = md.split("\n");
  let seenH1 = false;
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/^#\s+/.test(lines[i])) {
      if (!seenH1) seenH1 = true;
      else lines[i] = lines[i].replace(/^#\s+/, "## ");
    }
  }
  return lines.join("\n");
}

const g = (f) => resolve(guideDir, f);
const r = (f) => resolve(repoRoot, "rooms", f);

const parts = [];

// Cover / front matter (keeps its own H1 as the cover title).
parts.push(read(g("00-front-matter.md")));

// ---- GM Reference (front of book) ----

// Part 1
parts.push(setPartTitle(read(g("reference-house-rules.md")), "Part 1: Key House Rules"));

// Part 2
parts.push(setPartTitle(read(g("reference-conditions-dcs.md")), "Part 2: Conditions, Difficulty Classes, and Skills"));

// Part 3 (Xhal'theris voice only; puzzles now live in the rooms)
parts.push(setPartTitle(read(g("xhaltheris-and-puzzles.md")), "Part 3: Running Xhal'theris"));

// ---- The Dungeon (room by room) ----

// Part 4 divider + walkthrough. Monsters, stat blocks, traps, treasure, and
// puzzles all live inline in each room.
parts.push("# Part 4: The Dungeon, Room by Room");
const roomOrder = ["Dungeon-Left.md", "Dungeon-Right.md", "crypts.md", "TheCaverns.md", "GoblinTunnels.md", "GoblinCamp.md"];
for (const f of roomOrder) {
  parts.push(normalizeRoomHeadings(fixRoomImages(read(r(f)))));
}

const out = parts.join("\n\n---\n\n") + "\n";
const outPath = resolve(repoRoot, "GM-Guide.md");
writeFileSync(outPath, out, "utf8");
console.log("Wrote", outPath, "(" + out.length + " chars)");
