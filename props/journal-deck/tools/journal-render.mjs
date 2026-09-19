// journal-render.mjs
// Render the approved 16 journal blocks without changing their wording.
// Full rebuild: no document header, textured hand-drawn parchment look,
// real embedded handwriting font with measured (non-clipping) wrapping,
// a genuine margin column down the side of the page, and sketches
// integrated as marginalia next to the content they illustrate.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { PDFDocument } from "pdf-lib";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const draft = path.join(root, "props", "alchemist-journal-draft.md");
const outDir = path.join(root, "props", "journal-deck", "build", "pages");
const sketchDir = path.join(root, "props", "journal-deck", "build", "sketches");
const pdfOut = path.join(root, "props", "journal-deck", "berhan-voss-journal-printandplay.pdf");
const fontPath = path.join(root, "props", "journal-deck", "assets", "fonts", "Caveat-Variable.ttf");

GlobalFonts.registerFromPath(fontPath, "Caveat");
const FONT = "Caveat";

// ---------- page geometry (US Letter at 150dpi) ----------
const W = 1275, H = 1650;
const BODY_X = 108;
const BODY_W = 610; // main column, right edge at 718
const MARGIN_X = 800;
const MARGIN_W = 350; // right edge at 1150, 125px clear of the page edge
const CONTENT_TOP = 168;
const CONTENT_BOTTOM = 1540;
const AVAILABLE_H = CONTENT_BOTTOM - CONTENT_TOP;

// ---------- seeded RNG so each page's wear pattern is stable across reruns ----------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- draft parsing ----------
const raw = fs.readFileSync(draft, "utf8");
const matches = raw
  .split(/^## Journal Page /m)
  .slice(1)
  .map((block) => {
    const mm = block.match(/^(\d+)\s*\n([\s\S]*)$/);
    return [null, mm[1], mm[2]];
  })
  .sort((a, b) => Number(a[1]) - Number(b[1]));
if (matches.length !== 16 || matches.some((m, i) => Number(m[1]) !== i + 1)) {
  throw new Error("Draft must contain Journal Page 1 through 16 in order");
}
fs.mkdirSync(outDir, { recursive: true });

function parseBlock(m) {
  const page = Number(m[1]);
  const lines = m[2].trim().split(/\r?\n/);
  const body = []; // {kind, text, num?}
  const margins = []; // {kind, label, text, anchor}
  const sketchNotes = []; // {text, anchor}
  for (const line of lines) {
    if (!line.trim()) { body.push({ kind: "blank" }); continue; }
    const pn = line.match(/^\[Production note for Senshi:\s*(.*?)\]\s*$/);
    if (pn) { sketchNotes.push({ text: pn[1], anchor: body.length }); continue; }
    const an = line.match(/^\[(Margin|Marginal note|Correction|Complaint|Stock note|Stock worry|Trade note):\s*(.*?)\]\s*$/);
    if (an) {
      const kind = an[1].toLowerCase().startsWith("correction") ? "correction" : "margin";
      margins.push({ kind, label: an[1], text: an[2], anchor: body.length });
      continue;
    }
    if (line.trim() === "---") continue;
    if (/^>\s?/.test(line)) { body.push({ kind: "body", text: line.replace(/^>\s?/, "") }); continue; }
    if (/^###\s+/.test(line)) { body.push({ kind: "heading", text: line.replace(/^###\s+/, "") }); continue; }
    if (/^\*\*Ingredients\*\*$/.test(line) || /^\*\*Method\*\*$/.test(line)) { body.push({ kind: "subhead", text: line.replace(/\*/g, "") }); continue; }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) { body.push({ kind: "bullet", text: bullet[1] }); continue; }
    const step = line.match(/^(\d+)\.\s+(.*)$/);
    if (step) { body.push({ kind: "step", num: step[1], text: step[2] }); continue; }
    body.push({ kind: "body", text: line });
  }
  return { page, body, margins, sketchNotes };
}

// ---------- text measurement / wrapping (real metrics, never clips) ----------
function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

// Lay out the main column at a given base font size. Returns render runs,
// total height, and the cumulative top-offset of every body item (for
// anchoring margin notes/sketches to the content they refer to).
function measureBody(ctx, items, size) {
  const heading = Math.round(size * 1.55);
  const subhead = Math.round(size * 1.12);
  const lh = Math.round(size * 1.36);
  const headingLh = Math.round(heading * 1.2);
  const subheadLh = Math.round(subhead * 1.3);
  let y = 0;
  const runs = [];
  const itemTops = [];
  for (const item of items) {
    itemTops.push(y);
    if (item.kind === "blank") { y += Math.round(size * 0.62); runs.push({ kind: "blank" }); continue; }
    if (item.kind === "heading") {
      ctx.font = `700 ${heading}px "${FONT}"`;
      const lines = wrapLines(ctx, item.text, BODY_W);
      runs.push({ kind: "heading", lines, size: heading, lh: headingLh, x: BODY_X });
      y += lines.length * headingLh + Math.round(heading * 0.35);
      continue;
    }
    if (item.kind === "subhead") {
      ctx.font = `700 ${subhead}px "${FONT}"`;
      const lines = wrapLines(ctx, item.text, BODY_W);
      runs.push({ kind: "subhead", lines, size: subhead, lh: subheadLh, x: BODY_X });
      y += lines.length * subheadLh + Math.round(subhead * 0.28);
      continue;
    }
    ctx.font = `${size}px "${FONT}"`;
    let indent = 0, prefix = "";
    if (item.kind === "bullet") { indent = Math.round(size * 1.5); prefix = "\u2013 "; }
    if (item.kind === "step") { indent = Math.round(size * 1.7); prefix = `${item.num}. `; }
    const lines = wrapLines(ctx, item.text, BODY_W - indent);
    runs.push({ kind: item.kind, lines, size, lh, x: BODY_X + indent, prefix, prefixX: BODY_X });
    y += lines.length * lh + Math.round(size * 0.16);
    continue;
  }
  itemTops.push(y); // top-of-nothing sentinel for anchors pointing past the last item
  return { runs, height: y, itemTops };
}

function chooseBodySize(ctx, body) {
  const candidates = [38, 36, 34, 32, 30, 28, 26, 24, 22];
  let best = candidates[candidates.length - 1];
  let bestLayout = null;
  for (const size of candidates) {
    const layout = measureBody(ctx, body, size);
    if (layout.height <= AVAILABLE_H) { return { size, layout }; }
    bestLayout = layout; best = size;
  }
  return { size: best, layout: bestLayout }; // smallest candidate; still drawn, never thrown away
}

// ---------- procedural aged-parchment background (no external texture asset) ----------
function paintParchment(ctx, rnd) {
  // base wash
  const base = ctx.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, "#e9dcb8");
  base.addColorStop(0.5, "#e3d3ac");
  base.addColorStop(1, "#e8daae");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // fine grain via direct pixel noise (fast single pass)
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 14;
    d[i] = clamp8(d[i] + n);
    d[i + 1] = clamp8(d[i + 1] + n * 0.92);
    d[i + 2] = clamp8(d[i + 2] + n * 0.75);
  }
  ctx.putImageData(img, 0, 0);

  // soft mottling blotches (large, low-alpha, warm/cool variance)
  for (let i = 0; i < 22; i++) {
    const x = rnd() * W, y = rnd() * H, r = 120 + rnd() * 260;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const warm = rnd() > 0.5;
    g.addColorStop(0, warm ? "rgba(150,110,55,0.07)" : "rgba(90,80,60,0.05)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  // a couple of distinct stains (coffee/tea rings, low count so they read as accidents not decoration)
  const stainCount = 1 + Math.floor(rnd() * 2);
  for (let i = 0; i < stainCount; i++) {
    const x = rnd() * (W - 300) + 150, y = rnd() * (H - 300) + 150, r = 55 + rnd() * 70;
    ctx.save();
    ctx.globalAlpha = 0.16 + rnd() * 0.08;
    ctx.strokeStyle = "#8a6435";
    ctx.lineWidth = 4 + rnd() * 3;
    ctx.beginPath(); ctx.ellipse(x, y, r, r * (0.85 + rnd() * 0.3), rnd() * Math.PI, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#8a6435";
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.8, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // edge darkening / vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.78);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(60,42,20,0.38)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  // faint ruled notebook guides across the working area
  ctx.save();
  ctx.strokeStyle = "rgba(110,85,50,0.14)";
  ctx.lineWidth = 1;
  for (let y = CONTENT_TOP - 10; y < CONTENT_BOTTOM + 20; y += 40) {
    ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(W - 70, y); ctx.stroke();
  }
  ctx.restore();

  // left binding margin rule + punch holes (this is meant to be duplex-bound on the left)
  ctx.save();
  ctx.strokeStyle = "rgba(150,60,50,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(78, 60); ctx.lineTo(78, H - 60); ctx.stroke();
  ctx.fillStyle = "rgba(60,45,25,0.18)";
  for (const hy of [H * 0.22, H * 0.5, H * 0.78]) {
    ctx.beginPath(); ctx.ellipse(46, hy, 9, 11, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function clamp8(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

// ---------- draw one page ----------
async function renderPage({ page, body, margins, sketchNotes }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const rnd = mulberry32(page * 7919 + 13);

  paintParchment(ctx, rnd);

  // choose the largest body size that fits without clipping/overflow (also fixes dead whitespace on short pages)
  let { size, layout } = chooseBodySize(ctx, body);
  const inkColors = ["#302010", "#2c2412", "#33210f"];
  const ink = inkColors[page % inkColors.length];

  // A page with very little written on it (a cover entry, a torn-off final
  // page) still fills the auto-fit candidates easily and leaves the rest of
  // the sheet empty, which reads like a slide deck rather than a page
  // someone actually used. When the fitted text only occupies a small
  // fraction of the writable area, grow the hand further and treat the
  // whole block (text + its sketch) as one composition centered in the
  // page, instead of pinned to the top with everything else left blank.
  let sketchBoxSize = 300;
  let contentTop = CONTENT_TOP;
  const isSparse = layout.height <= AVAILABLE_H * 0.4;
  if (isSparse) {
    for (const cand of [64, 58, 52, 46, 40]) {
      const l = measureBody(ctx, body, cand);
      if (l.height <= AVAILABLE_H * 0.4) { size = cand; layout = l; break; }
    }
    sketchBoxSize = 460;
    const hasSketch = sketchNotes.length > 0;
    const estimatedBlock = layout.height + (hasSketch ? 70 + sketchBoxSize : 0);
    contentTop = CONTENT_TOP + Math.max(0, Math.round((AVAILABLE_H - estimatedBlock) / 2.4));
  }

  // draw main column
  let y = contentTop;
  for (const run of layout.runs) {
    if (run.kind === "blank") { y += Math.round(size * 0.62); continue; }
    if (run.kind === "heading") {
      ctx.font = `700 ${run.size}px "${FONT}"`;
      ctx.fillStyle = "#241a0c";
      for (const line of run.lines) { y += run.lh; ctx.fillText(line, run.x, y); }
      // a hand-drawn underline swash instead of a typeset rule
      const lastLine = run.lines[run.lines.length - 1];
      const lw = ctx.measureText(lastLine).width;
      ctx.save();
      ctx.strokeStyle = "#5b4326"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(run.x, y + 10);
      ctx.quadraticCurveTo(run.x + lw * 0.5, y + 16 + (rnd() - 0.5) * 6, run.x + Math.min(lw, BODY_W), y + 9);
      ctx.stroke();
      ctx.restore();
      y += Math.round(run.size * 0.35);
      continue;
    }
    if (run.kind === "subhead") {
      ctx.font = `700 ${run.size}px "${FONT}"`;
      ctx.fillStyle = "#5c3d22";
      for (const line of run.lines) { y += run.lh; ctx.fillText(line, run.x, y); }
      y += Math.round(run.size * 0.28);
      continue;
    }
    // body / bullet / step
    ctx.font = `${run.size}px "${FONT}"`;
    ctx.fillStyle = ink;
    run.lines.forEach((line, i) => {
      y += run.lh;
      if (i === 0 && run.prefix) {
        ctx.fillText(run.prefix, run.prefixX, y);
      }
      ctx.fillText(line, run.x, y);
    });
    y += Math.round(run.size * 0.16);
  }

  // ---------- margin column: sketches + margin/correction notes, anchored near their content ----------
  const ingredientsIdx = body.findIndex((b) => b.kind === "subhead" && /ingredients/i.test(b.text));
  const defaultSketchAnchor = ingredientsIdx >= 0 ? ingredientsIdx : Math.min(2, Math.max(body.length - 1, 0));

  const colEntries = [];
  for (const note of sketchNotes) {
    const idx = Math.min(defaultSketchAnchor, layout.itemTops.length - 1);
    const desiredY = contentTop + layout.itemTops[idx];
    colEntries.push({ type: "sketch", desiredY });
  }
  for (const m of margins) {
    const idx = Math.min(m.anchor, layout.itemTops.length - 1);
    const desiredY = contentTop + layout.itemTops[idx];
    colEntries.push({ type: "note", data: m, desiredY });
  }
  // attach sketch source data (do this after the loop above so indices line up 1:1 with sketchNotes)
  let sIdx = 0;
  for (const e of colEntries) { if (e.type === "sketch") { e.data = sketchNotes[sIdx]; e.fileIndex = sIdx + 1; sIdx++; } }

  // pre-measure each entry's height and stack without overlap. If the notes
  // stacked in the column would run past the bottom margin (e.g. two long
  // notes anchored at the same point near the end of a page), shrink the
  // margin hand down until every entry fits fully inside the page, the same
  // way the body text auto-fits. This is what actually prevents a note from
  // being cut off by the page edge, rather than just clamping a position.
  colEntries.sort((a, b) => a.desiredY - b.desiredY);
  const gap = 34;
  let marginFont = Math.max(20, Math.round(size * 0.72));
  let marginLh;
  for (; marginFont >= 15; marginFont -= 2) {
    marginLh = Math.round(marginFont * 1.3);
    ctx.font = `${marginFont}px "${FONT}"`;
    for (const e of colEntries) {
      if (e.type === "sketch") {
        e.w = sketchBoxSize; e.h = sketchBoxSize;
      } else {
        const label = `${e.data.label}: ${e.data.text}`;
        e.lines = wrapLines(ctx, label, MARGIN_W - 16);
        e.h = e.lines.length * marginLh + 18;
      }
    }
    let cursor = contentTop;
    let overflow = false;
    for (const e of colEntries) {
      let y0 = Math.max(e.desiredY, cursor);
      if (y0 + e.h > CONTENT_BOTTOM) y0 = Math.max(cursor, CONTENT_BOTTOM - e.h);
      if (y0 + e.h > CONTENT_BOTTOM) overflow = true;
      e.y = y0;
      cursor = y0 + e.h + gap;
    }
    if (!overflow || marginFont <= 15) break;
  }

  for (const e of colEntries) {
    const angle = (rnd() - 0.5) * 0.07; // slightly angled, like a real scrawl or a doodle dropped at a tilt
    if (e.type === "sketch") {
      const file = path.join(sketchDir, `page-${String(page).padStart(2, "0")}-sketch-${String(e.fileIndex).padStart(2, "0")}.png`);
      if (fs.existsSync(file)) {
        const img = await loadImage(file);
        ctx.save();
        const cx = MARGIN_X + e.w / 2, cy = e.y + e.h / 2;
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.shadowColor = "rgba(40,28,14,0.35)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 6;
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(img, -e.w / 2, -e.h / 2, e.w, e.h);
        ctx.restore();
      }
      continue;
    }
    ctx.save();
    const cx = MARGIN_X + MARGIN_W / 2, cy = e.y + e.h / 2;
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.font = `${marginFont}px "${FONT}"`;
    ctx.fillStyle = e.data.kind === "correction" ? "#6b3220" : "#4a3018";
    ctx.textAlign = "left";
    const startX = -MARGIN_W / 2 + 8;
    let ly = -e.h / 2 + marginLh - 6;
    for (const line of e.lines) { ctx.fillText(line, startX, ly); ly += marginLh; }
    ctx.restore();
  }
  ctx.textAlign = "left";

  // tiny handwritten corner page number (not a header bar, just how a person paginates their own notebook)
  ctx.save();
  ctx.font = `26px "${FONT}"`;
  ctx.fillStyle = "rgba(60,44,24,0.55)";
  ctx.textAlign = "right";
  ctx.fillText(String(page), W - 60, H - 46);
  ctx.restore();

  return canvas.toBuffer("image/png");
}

// ---------- run ----------
const pngPaths = [];
for (const m of matches) {
  const parsed = parseBlock(m);
  const buf = await renderPage(parsed);
  const png = path.join(outDir, `page-${String(parsed.page).padStart(2, "0")}.png`);
  fs.writeFileSync(png, buf);
  pngPaths.push(png);
}

const pdf = await PDFDocument.create();
for (const png of pngPaths) {
  const img = await pdf.embedPng(fs.readFileSync(png));
  const page = pdf.addPage([612, 792]);
  page.drawImage(img, { x: 0, y: 0, width: 612, height: 792 });
}
fs.writeFileSync(pdfOut, await pdf.save());
console.log(`Rendered ${pngPaths.length} pages to ${pdfOut}`);
