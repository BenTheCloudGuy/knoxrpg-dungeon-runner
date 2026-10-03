// A5 BOOKLET PROOF builder (proof only; does NOT touch the main build).
// Builds a two-part spread for ONE area (the Artificer's Workshop, D1-D5):
//   Page 1 (LEFT)  = the redrawn full-page area map (ArtificersWorkshop-map.png)
//   Page 2+ (RIGHT)= the D1-D5 room data, pulled live from rooms/Dungeon-Left.md
// Reuses the markdown-it -> HTML -> headless-Edge print pipeline from
// gm-guide/tools/build-pdf.mjs, but points at a5.css and forces a page break
// so the map owns its own page.
//
// Usage (from repo root, with OPENAI not required here):
//   node gm-guide/proof/build-proof.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const toolsDir = resolve(here, "..", "tools");

// Resolve the markdown-it deps that live in gm-guide/tools/node_modules,
// then import them by absolute file URL so this script can live in /proof.
const toolsRequire = createRequire(pathToFileURL(resolve(toolsDir, "package.json")));
const { default: MarkdownIt } = await import(pathToFileURL(toolsRequire.resolve("markdown-it")));
const { default: anchor }     = await import(pathToFileURL(toolsRequire.resolve("markdown-it-anchor")));
const { default: container }  = await import(pathToFileURL(toolsRequire.resolve("markdown-it-container")));

// ---- Inputs / outputs ----
const sourceMd = resolve(repoRoot, "rooms", "Dungeon-Left.md");
const cssPath = resolve(here, "a5.css");
const mapFile = "ArtificersWorkshop-map.png"; // sits next to this script / the md
const outPdf = resolve(here, "proof.pdf");
const outHtml = resolve(here, "proof.html");
const outMd = resolve(here, "proof.md");

// ---- Extract the Artificer's Workshop area (D1-D5) straight from canon ----
function extractSection(allText) {
  const lines = allText.split("\n");
  const startIdx = lines.findIndex((l) => /^##\s+Artificers Workshop\s*$/.test(l));
  if (startIdx === -1) throw new Error("Could not find '## Artificers Workshop' in source.");
  let endIdx = lines.findIndex((l, i) => i > startIdx && /^###\s+D6\b/.test(l));
  if (endIdx === -1) endIdx = lines.length;
  const section = lines.slice(startIdx, endIdx);
  // Drop the old reference lair image; the LEFT page carries the redrawn map.
  const cleaned = section.filter((l) => !/!\[[^\]]*\]\(\.\.\/images\/rooms\/ArtificersLair\.jpg\)/.test(l));
  return cleaned.join("\n").trim();
}

const roomData = extractSection(readFileSync(sourceMd, "utf8"));

// ---- Compose the proof markdown: map page, forced break, then room data ----
const proofMd = [
  "# The Vault of the Starving Mind",
  "",
  "<p style=\"font-variant:small-caps;color:#7a2411;font-size:11pt;margin:0 0 0.5em;\">A5 booklet proof &mdash; Artificer&rsquo;s Workshop spread</p>",
  "",
  // LEFT page: full-page redrawn area map, then a hard page break.
  `<img class="area-map" src="${mapFile}" alt="Artificer's Workshop area map">`,
  '<div class="page-break"></div>',
  "",
  // RIGHT page onward: the room-by-room data.
  roomData,
  "",
].join("\n");

writeFileSync(outMd, proofMd, "utf8");
console.log("Wrote proof markdown:", outMd);

// ---- markdown-it pipeline (same behavior as the main builder) ----
const md = new MarkdownIt({ html: true, linkify: false, typographer: false, breaks: false });
md.use(anchor);
md.use(container, "gmnote", {
  render(tokens, idx) {
    return tokens[idx].nesting === 1
      ? '<div class="gmnote"><p class="gmnote-title">GM Note</p>\n'
      : "</div>\n";
  },
});

function stripEmoji(text) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2709}]/gu, "")
    .replace(/[ \t]{2,}/g, " ");
}

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
      while (j < lines.length && isQuote(lines[j])) {
        block.push(lines[j]);
        j++;
      }
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

const src = convertCallouts(stripEmoji(proofMd));
const bodyHtml = md.render(src);
const cssText = readFileSync(cssPath, "utf8");
const baseHref = pathToFileURL(here + "/").href;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<base href="${baseHref}">
<title>Artificer's Workshop - A5 proof</title>
<style>${cssText}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

writeFileSync(outHtml, html, "utf8");
console.log("Wrote HTML:", outHtml);

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=20000",
  `--print-to-pdf=${outPdf}`,
  pathToFileURL(outHtml).href,
];

const res = spawnSync(edge, args, { stdio: "inherit" });
if (res.status !== 0) {
  console.error("Edge print-to-pdf failed with status", res.status);
  process.exit(res.status ?? 1);
}
console.log("Wrote PDF:", outPdf);
