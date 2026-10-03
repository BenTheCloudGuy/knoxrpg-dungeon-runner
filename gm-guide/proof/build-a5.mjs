// ============================================================
// A5 BOOKLET builder for the WHOLE GM Guide -> GM-Guide-A5.pdf
//
// Page: 5.5in x 8.5in portrait, printed front-and-back as a booklet.
// Front of book: title page + Part 1/2/3 reference (flowing A5 pages).
// Then the dungeon area by area: a full-page MAP first, then that area's
// room data pulled LIVE from the rooms/*.md canon.
//
// Maps are ORIGINAL images only. The Left Dungeon uses two whole original
// section photos (dungeon-left.jpg overview + ArtificersLair.jpg closeup);
// every other area uses its original area map. No custom crops, no AI redraws.
// Landscape maps are pre-rotated + downscaled by
// gm-guide/maps/left/prepare-maps.mjs into gm-guide/a5-build/.
//
// Reuses the markdown-it -> HTML -> headless-Edge print pipeline and the
// a5.css look from the proof. Does NOT touch GM-Guide.md or print.css.
//
// Usage (from repo root):
//   node gm-guide/maps/left/rotate-maps.mjs    (once, to make rotated assets)
//   node gm-guide/proof/build-a5.mjs
// ============================================================
import { readFileSync, writeFileSync, existsSync, rmSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url)); // gm-guide/proof
const repoRoot = resolve(here, "..", "..");
const toolsDir = resolve(here, "..", "tools");

// markdown-it deps live in gm-guide/tools/node_modules.
const toolsRequire = createRequire(pathToFileURL(resolve(toolsDir, "package.json")));
const { default: MarkdownIt } = await import(pathToFileURL(toolsRequire.resolve("markdown-it")));
const { default: anchor }     = await import(pathToFileURL(toolsRequire.resolve("markdown-it-anchor")));
const { default: container }  = await import(pathToFileURL(toolsRequire.resolve("markdown-it-container")));

const cssPath = resolve(here, "a5.css");
const outPdf  = resolve(repoRoot, "GM-Guide-A5.pdf");
const outHtml = resolve(here, "GM-Guide-A5.html");
const outMd   = resolve(here, "GM-Guide-A5.src.md");

// ---------- helpers ----------
const read = (p) => readFileSync(resolve(repoRoot, p), "utf8");

// Drop inline markdown images (each area carries its own dedicated map page).
function stripImages(text) {
  return text
    .split("\n")
    .filter((l) => !/^\s*!\[[^\]]*\]\([^)]*\)\s*$/.test(l))
    .join("\n");
}

// Slice the text between a start heading and an end heading (exclusive).
// startRe matches the first line of the slice; endRe (nullable) ends it.
function slice(text, startRe, endRe) {
  const lines = text.split("\n");
  const s = lines.findIndex((l) => startRe.test(l));
  if (s === -1) throw new Error(`slice: start not found: ${startRe}`);
  let e = endRe ? lines.findIndex((l, i) => i > s && endRe.test(l)) : -1;
  if (e === -1) e = lines.length;
  return lines.slice(s, e).join("\n").trim();
}

// Everything after the first H1 line (used for single-map whole-file areas).
function bodyAfterH1(text) {
  const lines = text.split("\n");
  const h1 = lines.findIndex((l) => /^#\s/.test(l));
  return lines.slice(h1 === -1 ? 0 : h1 + 1).join("\n").trim();
}

const PAGEBREAK = '<div class="page-break"></div>';

// Every map is served from the prepared (rotated + downscaled JPEG) asset set
// in gm-guide/a5-build/. These are built from ORIGINAL images only by
// gm-guide/maps/left/prepare-maps.mjs; no AI redraws are used.
function mapSrc(id) {
  return `gm-guide/a5-build/${id}.jpg`;
}

// ---------- source files ----------
const frontMatter = read("gm-guide/00-front-matter.md");
const houseRules  = read("gm-guide/reference-house-rules.md");
const conditions  = read("gm-guide/reference-conditions-dcs.md");
const xhal         = read("gm-guide/xhaltheris-and-puzzles.md");

const dungeonLeft  = read("rooms/Dungeon-Left.md");
const dungeonRight = read("rooms/Dungeon-Right.md");
const caverns      = read("rooms/TheCaverns.md");
const goblinTunnels= read("rooms/GoblinTunnels.md");
const goblinCamp   = read("rooms/GoblinCamp.md");
const crypts       = read("rooms/crypts.md");

// ---------- Left Dungeon slices (per gm-guide/maps/left/plan.md) ----------
const L = {
  d1:  slice(dungeonLeft, /^###\s+D1\s+"The Cells"/,            /^###\s+D2\b/),
  d2:  slice(dungeonLeft, /^###\s+D2\s+"Grovlikk/,              /^###\s+D3\b/),
  d3:  slice(dungeonLeft, /^###\s+D3\s+"Artificers Library"/,   /^###\s+D4\b/),
  d4:  slice(dungeonLeft, /^###\s+D4\s+"Portal Room/,           /^###\s+D5\b/),
  d5:  slice(dungeonLeft, /^###\s+D5\s+"Artificers Workshop"/,  /^###\s+D6\b/),
  d6:  slice(dungeonLeft, /^###\s+D6:\s+Hallway/,               /^##\s+D7:/),
  d7:  slice(dungeonLeft, /^##\s+D7:\s+Alchemists Lab/,         /^###\s+D8:/),
  d8:  slice(dungeonLeft, /^###\s+D8:\s+Entrance to Serpents/,  /^###\s+D9:/),
  d9:  slice(dungeonLeft, /^###\s+D9:\s+Serpents Lair/,         /^###\s+D10:/),
  d10: slice(dungeonLeft, /^###\s+D10:\s+The Old Cells/,        /^##\s+The Gauntlet/),
  d11: slice(dungeonLeft, /^##\s+The Gauntlet \(D11\)/,         null),
};

// Full Left Dungeon room data (D1-D11) in order. Per GM decision the custom
// crops are dropped entirely; the Left Dungeon now uses two whole original
// photos as map pages, then all this room data flows after them.
const leftData = [L.d1, L.d2, L.d3, L.d4, L.d5, L.d6, L.d7, L.d8, L.d9, L.d10, L.d11].join("\n\n");

// ---------- Caverns slices (3 areas = 3 cavern-marked maps) ----------
const C = {
  a1: slice(caverns, /^##\s+Area 1\b/, /^#\s+Area 2\b/),
  a2: slice(caverns, /^#\s+Area 2\b/,  /^#\s+Area 3\b/),
  a3: slice(caverns, /^#\s+Area 3\b/,  null),
};

// ---------- the ordered area plan: [caption, map-id, original-path, data] ----------
const AREAS = [
  // Dungeon Ruins (Right), one original map.
  ["Dungeon Ruins (R1-R11)",         "dungeon-right",    "images/rooms/dungeon-right.jpg",   bodyAfterH1(dungeonRight)],

  // The Caverns, three original marked maps = three areas.
  ["The Caverns - Area 1 (C1-C3)",   "cavern-marked-1",  "images/rooms/cavern-marked-1.jpg", C.a1],
  ["The Caverns - Area 2 (C4-C6)",   "cavern-marked-2",  "images/rooms/cavern-marked-2.jpg", C.a2],
  ["The Caverns - Area 3 (C7-C14)",  "cavern-marked-3",  "images/rooms/cavern-marked-3.jpg", C.a3],

  // Goblin Tunnels, Goblin Camp, Crypts.
  ["Goblin Tunnels",                 "GoblinTunnelsPoints","images/rooms/GoblinTunnelsPoints.jpg", bodyAfterH1(goblinTunnels)],
  ["Goblin Camp",                    "GoblinGrottoPoints", "images/rooms/GoblinGrottoPoints.jpg",  bodyAfterH1(goblinCamp)],
  ["The Crypts",                     "dungeon-b-crypts",   "images/dungeon/dungeon-b-crypts.jpg",  bodyAfterH1(crypts)],
];

// ---------- compose the whole-guide markdown ----------
const parts = [];

// Title page (keep its title image; center it).
parts.push('<div class="titlepage">');
parts.push("");
parts.push(frontMatter.trim());
parts.push("");
parts.push("</div>");
parts.push(PAGEBREAK);

// Part 1-3 reference, each on fresh pages.
// NOTE: a blank line MUST follow each block-level part-label <p> so markdown-it
// parses the "# ..." heading that comes next as a heading, not as raw HTML.
parts.push('<p class="part-label">Part 1 - GM Reference</p>');
parts.push("");
parts.push(houseRules.trim());
parts.push(PAGEBREAK);

parts.push('<p class="part-label">Part 2 - GM Reference</p>');
parts.push("");
parts.push(conditions.trim());
parts.push(PAGEBREAK);

parts.push('<p class="part-label">Part 3 - GM Reference</p>');
parts.push("");
parts.push(xhal.trim());
parts.push(PAGEBREAK);

// Part 4: no standalone divider page. The "Part 4" label + title + one-line
// intro ride at the TOP of the first dungeon map page (above the map caption),
// so we don't waste a near-empty divider page. All lines are literal HTML so
// there is no block-HTML/markdown collision.
const part4Intro = [
  '<p class="part-label">Part 4 - The Dungeon</p>',
  '<h1>The Dungeon, Room by Room</h1>',
  '<p class="dungeon-intro">Each area opens with its map, then that area\'s room data on the pages that follow. Maps are the original dungeon images; room data is pulled straight from the canon room files.</p>',
].join("\n");

// ---------- Dungeon section as an ordered list of blocks ----------
// Each map is a full-page image that MUST land on a LEFT (even) page so its
// room data begins on the facing RIGHT (next) page and flows on from there.
// Page 1 is the first RIGHT page, so LEFT pages are the EVEN page numbers.
// Edge/Chromium headless ignores `break-before: left`, so the solver below
// computes parity and injects a blank page before any map that would land on
// a RIGHT (odd) page.
//
// Left Dungeon is the two-map "run" case: dungeon-left.jpg (overview, pins
// 1-11 = D1-D11) and ArtificersLair.jpg (closeup, pins 1-5 = D1-D5) are TWO
// consecutive map pages with no room data between them. Per Ben's imposition
// refinement, back-to-back maps are placed one per page on FACING pages with
// NO blank between them: the overview on the LEFT (even) page, the closeup on
// the immediately following RIGHT (odd) facing page. Both are whole original
// photos (no crops, no AI redraws). Only the FIRST map of a run is parity-
// locked to a LEFT page; the 2nd+ maps follow immediately and fall on the
// alternating facing pages.
const DUNGEON_BLOCKS = [
  { kind: "map", caption: "Dungeon - Left (D1-D11)", id: "dungeon-left",
    alt: "Left Dungeon overview", imgClass: "area-map area-map-intro", intro: true },
  { kind: "map", caption: "Artificers Block (D1-D5)", id: "artificers-lair",
    alt: "Artificers block closeup", imgClass: "area-map" },
  { kind: "data", md: stripImages(leftData).trim() },
];
for (const [caption, id, , data] of AREAS) {
  DUNGEON_BLOCKS.push({ kind: "map", caption, id, alt: caption, imgClass: "area-map" });
  DUNGEON_BLOCKS.push({ kind: "data", md: stripImages(data).trim() });
}

// Maps numbered 0..N-1 in reading order; the parity solver targets these.
const MAP_ORDER = DUNGEON_BLOCKS.filter((b) => b.kind === "map");
const MAP_COUNT = MAP_ORDER.length;

// Group maps into "runs" of consecutive map pages (no data block between).
// RUN_LEADER[mapIdx] is true for the FIRST map of each run and false for every
// follower. Only run-leaders are parity-locked to a LEFT (even) page; the 2nd+
// maps of a run follow IMMEDIATELY with no blank, so they land on the
// alternating facing pages (a run of 2 = LEFT then RIGHT). Today only the Left
// Dungeon is a run of length 2; every other area is a run of length 1.
const RUN_LEADER = [];
{
  let prevWasMap = false;
  for (const b of DUNGEON_BLOCKS) {
    if (b.kind === "map") {
      RUN_LEADER.push(!prevWasMap);
      prevWasMap = true;
    } else {
      prevWasMap = false;
    }
  }
}

// Compose the whole-guide markdown given a set of map indices that must be
// preceded by a blank filler page (to keep the map on a LEFT / even page).
function composeMd(blankBefore) {
  const out = parts.slice(); // title + Part 1-3 reference (ends on a PAGEBREAK)
  let mapIdx = -1;
  for (const b of DUNGEON_BLOCKS) {
    if (b.kind === "map") {
      mapIdx++;
      if (blankBefore.has(mapIdx)) out.push('<div class="blankpage"></div>');
      const inner = [];
      if (b.intro) inner.push(part4Intro);
      inner.push(`<p class="map-caption">${b.caption}</p>`);
      inner.push(`<img class="${b.imgClass}" src="${mapSrc(b.id)}" alt="${b.alt}">`);
      // One raw-HTML block (no internal blank lines) so markdown-it passes it
      // through verbatim; the map-page stays whole on its own page.
      out.push(['<section class="map-page">', inner.join("\n"), "</section>"].join("\n"));
      out.push("");
    } else {
      out.push(b.md);
      out.push(PAGEBREAK);
    }
  }
  return out.join("\n");
}

// ---------- text transforms (same spirit as the main builder) ----------
function stripEmoji(text) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2709}]/gu, "")
    .replace(/[ \t]{2,}/g, " ");
}

// Fold a "**Read Aloud ...**" label into the top of the blockquote that
// follows it, so the label can never be orphaned from its cream box.
function mergeReadAloudLabels(text) {
  const lines = text.split("\n");
  const out = [];
  const labelRe = /^\s*\*\*(Read Aloud[^*]*)\*\*\s*$/;
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(labelRe);
    if (m) {
      // find next non-empty line
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && /^\s*>/.test(lines[j])) {
        out.push(`> **${m[1].trim()}**`, ">");
        i = j; // continue emitting the blockquote lines as-is
        continue;
      }
    }
    out.push(lines[i]);
    i++;
  }
  return out.join("\n");
}

// Wrap monster stat blocks in <div class="statblock"> so they never split.
// A block starts at the stat line (has **AC** and **HP**), pulls in the
// immediately preceding heading, and runs until the next heading / blockquote
// / section label.
function wrapStatblocks(text) {
  const lines = text.split("\n");
  const out = [];
  const isHeading = (l) => /^#{1,6}\s/.test(l);
  const isItalicType = (l) => /^\s*\*[^*].*\*\s*$/.test(l.trim());
  // A stat block starts at either the compact mook line ("**AC** .. **HP** ..")
  // or the spelled-out boss line ("**Armor Class** ..").
  const isStatLine = (l) =>
    (/\*\*AC\*\*/.test(l) && /\*\*HP\*\*/.test(l)) || /^\s*\*\*Armor Class\*\*/.test(l);
  const stopRe = /^(?:#{1,6}\s|\s*>|\s*<div|\*{2,3}(?:Tactics|Development)\b|\*\*(?:Read Aloud|Treasure|Loot|Reward|Note|Monsters|Trap|Puzzle|Equipment)\b)/i;
  let i = 0;
  while (i < lines.length) {
    if (isStatLine(lines[i])) {
      // Back up to include the block header: the directly-preceding heading,
      // and (for bosses) the italic creature-type subtitle between them.
      let k = out.length - 1;
      while (k >= 0 && out[k].trim() === "") k--;
      if (k >= 0 && isItalicType(out[k])) {
        let h = k - 1;
        while (h >= 0 && out[h].trim() === "") h--;
        if (h >= 0 && isHeading(out[h])) k = h; // include heading above the type line
      } else if (!(k >= 0 && isHeading(out[k]))) {
        k = out.length; // no heading/subtitle to absorb
      }
      const headStart = k < out.length ? k : out.length;
      const head = out.splice(headStart);
      // Trim trailing blanks left in out.
      while (out.length && out[out.length - 1].trim() === "") out.pop();
      // Gather the stat block body forward until a stop line.
      const block = [...head.filter((l, idx) => !(idx === 0 && l.trim() === ""))];
      block.push(lines[i]);
      let j = i + 1;
      while (j < lines.length && !stopRe.test(lines[j])) {
        block.push(lines[j]);
        j++;
      }
      while (block.length && block[block.length - 1].trim() === "") block.pop();
      while (block.length && block[0].trim() === "") block.shift();
      out.push("", '<div class="statblock">', "", ...block, "", "</div>", "");
      i = j;
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out.join("\n");
}

// Convert GitHub-style "> [!NOTE]" callouts into ::: gmnote containers.
function convertCallouts(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;
  const isQuote = (l) => /^\s*>/.test(l);
  const strip1 = (l) => l.replace(/^\s*>\s?/, "");
  const marker = /^(?:\[!(\w+)\]|!(\w+))\s*/;
  while (i < lines.length) {
    if (isQuote(lines[i])) {
      let j = i;
      const block = [];
      while (j < lines.length && isQuote(lines[j])) { block.push(lines[j]); j++; }
      const body = block.map(strip1);
      const firstIdx = body.findIndex((l) => l.trim() !== "");
      if (firstIdx !== -1 && marker.test(body[firstIdx].trim())) {
        let first = body[firstIdx].replace(marker, "").trim();
        const bodyLines = body.slice(firstIdx + 1);
        if (first && !/^gm\s*note[:.]?$/i.test(first)) bodyLines.unshift(first);
        out.push("", "::: gmnote", ...bodyLines, ":::", "");
      } else {
        out.push(...block);
      }
      i = j;
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out.join("\n");
}

// ---------- markdown-it pipeline ----------
const md = new MarkdownIt({ html: true, linkify: false, typographer: false, breaks: false });
md.use(anchor);
md.use(container, "gmnote", {
  render(tokens, idx) {
    return tokens[idx].nesting === 1
      ? '<div class="gmnote"><p class="gmnote-title">GM Note</p>\n'
      : "</div>\n";
  },
});

const cssText = readFileSync(cssPath, "utf8");
const baseHref = pathToFileURL(repoRoot + "/").href; // repo-relative img src resolve

function mdToHtml(guideMd) {
  let src = stripEmoji(guideMd);
  src = mergeReadAloudLabels(src);
  src = wrapStatblocks(src);
  src = convertCallouts(src);
  const bodyHtml = md.render(src);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<base href="${baseHref}">
<title>The Vault of the Starving Mind - A5 GM Guide</title>
<style>${cssText}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

// ---------- headless Edge render ----------
// Each render runs with its OWN throwaway user-data-dir (in the OS temp dir) so
// a lingering Edge process from the previous pass never locks the profile; the
// output PDF is deleted first and the write is verified so the parity probe can
// never read a stale file. A short synchronous backoff covers handle release.
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const uddBase = resolve(tmpdir(), `edge-a5-${process.pid}`);
const uddDirs = [];
let renderSeq = 0;
function renderPdf(html) {
  writeFileSync(outHtml, html, "utf8");
  for (let attempt = 1; attempt <= 4; attempt++) {
    try { if (existsSync(outPdf)) rmSync(outPdf, { force: true }); } catch { sleep(800); }
    const udd = `${uddBase}-${renderSeq++}`;
    uddDirs.push(udd);
    const args = [
      "--headless=new",
      "--disable-gpu",
      `--user-data-dir=${udd}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--no-pdf-header-footer",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=30000",
      `--print-to-pdf=${outPdf}`,
      pathToFileURL(outHtml).href,
    ];
    const res = spawnSync(edge, args, { stdio: "inherit" });
    sleep(600); // let the file handle flush/release before we read it
    if (res.status === 0 && existsSync(outPdf) && statSync(outPdf).size > 0) return;
    console.error(`  render attempt ${attempt} did not produce a PDF; retrying...`);
    sleep(1500);
  }
  console.error("Edge print-to-pdf failed after retries");
  process.exit(1);
}

// Probe the rendered PDF with pymupdf: return the 1-based page number of every
// map page (reading order) plus the total page count. Map pages are the only
// pages carrying a large image (>45% of the page); the title-page image is far
// smaller (~29%), and all inline room images are stripped from the data.
function probeMapPages() {
  const py = `import pymupdf,json,sys
d=pymupdf.open(sys.argv[1])
maps=[]
for i,pg in enumerate(d,start=1):
    pa=pg.rect.width*pg.rect.height
    big=any((pymupdf.Rect(im['bbox']).width*pymupdf.Rect(im['bbox']).height)/pa>0.45 for im in pg.get_image_info())
    if big: maps.append(i)
print(json.dumps({'pages':d.page_count,'maps':maps}))`;
  const r = spawnSync("python", ["-c", py, outPdf], { encoding: "utf8" });
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  return JSON.parse(r.stdout.trim());
}

// ---------- booklet imposition solver ----------
// Iteratively add blank filler pages until every RUN-LEADER map lands on a
// LEFT (even) page. Followers (2nd+ map of a back-to-back run) are never
// padded and never parity-checked - they must stay immediately adjacent to
// their leader so they fall on the facing page. Fixing the earliest offending
// leader never disturbs the maps before it, so this converges in at most
// MAP_COUNT passes.
const blankBefore = new Set();
let probe;
for (let iter = 0; iter <= MAP_COUNT + 2; iter++) {
  renderPdf(mdToHtml(composeMd(blankBefore)));
  probe = probeMapPages();
  if (probe.maps.length !== MAP_COUNT) {
    console.error(`Expected ${MAP_COUNT} map pages, found ${probe.maps.length}:`, probe.maps);
    process.exit(1);
  }
  // Only run-leaders must sit on a LEFT (even) page; ignore followers.
  const firstOdd = probe.maps.findIndex((pg, idx) => RUN_LEADER[idx] && pg % 2 === 1);
  if (firstOdd === -1) {
    console.log(`Imposition converged after ${iter} pass(es).`);
    break;
  }
  if (blankBefore.has(firstOdd)) {
    console.error(`Map ${firstOdd} still on an odd page after a blank was added; aborting.`);
    process.exit(1);
  }
  blankBefore.add(firstOdd);
}

// Persist the final composed markdown (with the solved blanks) for inspection.
const finalMd = composeMd(blankBefore);
writeFileSync(outMd, finalMd, "utf8");
console.log("Wrote source markdown:", outMd);
console.log("Wrote HTML:", outHtml);
console.log("Wrote PDF:", outPdf);

// ---------- parity report ----------
console.log(`\nPages: ${probe.pages}   Blank fillers inserted: ${blankBefore.size}` +
  (blankBefore.size ? `   (before maps: ${[...blankBefore].sort((a, b) => a - b).join(", ")})` : ""));
console.log("Area map parity (page 1 = first RIGHT page; LEFT = even):");
probe.maps.forEach((pg, k) => {
  const side = pg % 2 === 0 ? "LEFT " : "RIGHT";
  const role = RUN_LEADER[k] ? "leader  " : "follower";
  console.log(`  map p${String(pg).padStart(3)} ${side} ${role}  data starts p${pg + 1}  ${MAP_ORDER[k].caption}`);
});

// Best-effort cleanup of the throwaway Edge profiles.
for (const d of uddDirs) { try { rmSync(d, { recursive: true, force: true }); } catch {} }
