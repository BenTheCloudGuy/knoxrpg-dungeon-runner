// Markdown -> HTML -> PDF (headless Edge) builder for the GM Guide.
// Usage: node build-pdf.mjs <input.md> <output.pdf>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import container from "markdown-it-container";

const [, , inArg, outArg] = process.argv;
if (!inArg || !outArg) {
  console.error("Usage: node build-pdf.mjs <input.md> <output.pdf>");
  process.exit(1);
}

const inPath = resolve(inArg);
const outPath = resolve(outArg);
const baseDir = dirname(inPath);

// typographer OFF so literal characters are preserved and no smart em-dashes are introduced.
const md = new MarkdownIt({ html: true, linkify: false, typographer: false, breaks: false });
md.use(anchor);
md.use(container, "gmnote", {
  render(tokens, idx) {
    return tokens[idx].nesting === 1
      ? '<div class="gmnote"><p class="gmnote-title">GM Note</p>\n'
      : "</div>\n";
  },
});

// Remove color emoji and variation selectors. Chromium renders color emoji as
// Type3 fonts with tiling patterns, which crashes some PDF viewers (PDF.js).
function stripEmoji(text) {
  return text
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}\u{2709}]/gu, "")
    .replace(/[ \t]{2,}/g, " ");
}

// Convert GitHub-style callout blockquotes ("> [!NOTE] ..." or "> !NOTE")
// into ::: gmnote fenced containers so the body still parses as markdown.
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
        // Drop a redundant leading "GM NOTE" label line.
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

const srcRaw = readFileSync(inPath, "utf8");
const src = convertCallouts(stripEmoji(srcRaw));
const bodyHtml = md.render(src);

// print.css sits next to this script.
const cssText = readFileSync(new URL("./print.css", import.meta.url), "utf8");

const baseHref = pathToFileURL(baseDir + "/").href;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<base href="${baseHref}">
<title>${basename(inPath)}</title>
<style>${cssText}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

const htmlPath = outPath.replace(/\.pdf$/i, "") + ".html";
writeFileSync(htmlPath, html, "utf8");
console.log("Wrote HTML:", htmlPath);

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const args = [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=20000",
  `--print-to-pdf=${outPath}`,
  pathToFileURL(htmlPath).href,
];

const res = spawnSync(edge, args, { stdio: "inherit" });
if (res.status !== 0) {
  console.error("Edge print-to-pdf failed with status", res.status);
  process.exit(res.status ?? 1);
}
console.log("Wrote PDF:", outPath);
