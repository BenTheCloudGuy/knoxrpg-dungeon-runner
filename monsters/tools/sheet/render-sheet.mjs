import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { parseMonster, safeFileName, cleanText } from "./monster-parse.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const requireFromPlayerSheets = createRequire(path.join(root, "player_characters", "tools", "sheet", "package.json"));
const { chromium } = requireFromPlayerSheets("playwright");

const fontCss = fs.readFileSync(path.join(here, "fonts", "fonts-embed.css"), "utf8");
const baseCss = fs.readFileSync(path.join(here, "sheet.css"), "utf8");

const esc = (value = "") => cleanText(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Split a combat value into a big headline token and a small qualifier line so
// parentheticals (AC descriptors, HP dice, extra movement modes) don't blow up
// the display font.
function splitStat(kind, value) {
  const text = cleanText(value || "");
  if (!text) return { big: "", sub: "" };
  if (kind === "ac") {
    const m = text.match(/^(\d+)\s*(.*)$/);
    if (m) return { big: m[1], sub: m[2].replace(/^\((.*)\)$/, "$1").trim() };
  }
  if (kind === "hp") {
    const m = text.match(/^(\d+)\s*(?:\(([^)]*)\))?\s*(.*)$/);
    if (m) return { big: m[1], sub: [m[2], m[3]].filter(Boolean).join(" ").trim() };
  }
  if (kind === "speed") {
    const m = text.match(/^(\d+\s*ft\.?)\s*[,;]?\s*(.*)$/i);
    if (m) return { big: m[1].replace(/\s+/g, " "), sub: m[2].trim() };
  }
  return { big: text, sub: "" };
}

function combatCell(value, label, kind) {
  const { big, sub } = splitStat(kind, value);
  const subHtml = sub ? `<div class="csub2">${esc(sub)}</div>` : "";
  return `<div class="cbox"><div class="cbig">${esc(big)}</div>${subHtml}<div class="clab">${esc(label)}</div></div>`;
}

function mdInline(value = "") {
  return esc(value)
    .replace(/\*\*\*(.+?)\*\*\*/g, "<b><i>$1</i></b>")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>");
}

function mdBlock(value = "") {
  const lines = cleanText(value).split("\n");
  let html = "";
  let inList = false;
  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }
    if (/^-\s+/.test(trimmed)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${mdInline(trimmed.replace(/^-\s+/, ""))}</li>`;
    } else {
      closeList();
      html += `<p>${mdInline(trimmed)}</p>`;
    }
  }
  closeList();
  return html;
}

function dataUri(file) {
  if (!fs.existsSync(file)) return "";
  return `data:image/png;base64,${fs.readFileSync(file).toString("base64")}`;
}

function placeholderArt(monster) {
  const name = esc(monster.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#3f160f"/><stop offset="1" stop-color="#b8963e"/></linearGradient></defs>
    <rect width="1024" height="1024" fill="#f1e2bd"/>
    <rect x="64" y="64" width="896" height="896" rx="44" fill="url(#g)" opacity=".92"/>
    <circle cx="512" cy="392" r="185" fill="#f6efdb" opacity=".22"/>
    <path d="M300 710c80-150 110-230 212-230s132 80 212 230" fill="none" stroke="#f6efdb" stroke-width="42" stroke-linecap="round"/>
    <text x="512" y="865" text-anchor="middle" font-family="Georgia, serif" font-size="58" fill="#f6efdb">${name}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function statPip(ability) {
  return `<div class="abil"><div class="abil-name">${esc(ability.name)}</div><div class="abil-mod">${esc(ability.mod)}</div><div class="abil-score">${esc(ability.score)}</div></div>`;
}

function metaLine(label, value) {
  if (!value) return "";
  return `<div class="mrow"><b>${esc(label)}</b><span>${mdInline(value)}</span></div>`;
}

function entryList(title, entries) {
  if (!entries?.length) return "";
  return `<div class="msection"><div class="mh">${esc(title)}</div>${entries.map((entry) => {
    const name = entry.name ? `<span class="entry-name">${esc(entry.name)}.</span> ` : "";
    return `<div class="entry">${name}<span class="entry-body">${mdBlock(entry.body)}</span></div>`;
  }).join("")}</div>`;
}

function spellcastingBlock(monster) {
  if (!monster.spellcasting) return "";
  return `<div class="msection spellcasting"><div class="mh">Spellcasting</div>${mdBlock(monster.spellcasting)}</div>`;
}

function auditBlock(monster) {
  if (!monster.audit?.options) return "";
  return `<div class="audit-options"><b>Audit weapon and action options:</b> ${esc(monster.audit.options)}</div>`;
}

function renderHtml(monster) {
  const artFile = path.join(root, "monsters", "art", `${monster.slug}.png`);
  const art = dataUri(artFile) || placeholderArt(monster);
  const m = monster.meta;
  const CSS = `${baseCss}
.page{width:215.9mm;height:139.7mm;padding:0;}
.page::before{inset:4mm;border-radius:2.4mm;}
.page::after{inset:6mm;border-radius:2mm;}
.fit-area{position:absolute;inset:9mm;display:flex;align-items:center;justify-content:center;overflow:hidden;z-index:1;}
.sheet-fit{transform-origin:center center;width:197mm;}
.frame-top{display:flex;justify-content:space-between;align-items:baseline;font-family:"Cinzel",serif;font-size:7pt;letter-spacing:.07em;color:var(--red);text-transform:uppercase;margin:0 .5mm 2mm;opacity:.9;}
.frame-top .ft-page{color:var(--red2);}
.card-fit{display:flex;gap:3.6mm;align-items:stretch;}
.stat-col{flex:0 0 64mm;display:flex;flex-direction:column;gap:2.4mm;}
.text-col{flex:1;min-width:0;display:flex;flex-direction:column;gap:2mm;}
.monster-title{background:linear-gradient(180deg,var(--red),#43110a);color:#f5e6c8;border:1.4pt solid var(--gold);border-radius:1.8mm;padding:2.2mm 3mm;text-align:center;}
.monster-title h1{font-family:"Cinzel",serif;font-size:16pt;line-height:1.05;margin:0;color:#f2d998;letter-spacing:.01em;}
.monster-title .type{font-size:8.8pt;margin-top:1mm;font-variant:small-caps;letter-spacing:.02em;}
.monster-art{border:1.6pt solid var(--red);border-radius:1.8mm;overflow:hidden;box-shadow:inset 0 0 0 1.6pt var(--gold);background:#fff;height:55mm;}
.monster-art img{width:100%;height:100%;object-fit:cover;display:block;}
.combat-strip{display:grid;grid-template-columns:1fr 1fr;margin:0;gap:2.2mm;}
.cbox{padding:1.4mm .6mm;min-height:12.5mm;display:flex;flex-direction:column;justify-content:center;border-radius:1.6mm;}
.cbig{font-size:14pt;line-height:1.0;}
.csub2{font-size:6.1pt;line-height:1.1;color:#5f5238;margin-top:.6mm;text-transform:none;letter-spacing:0;font-variant:normal;}
.clab{font-size:5.9pt;margin-top:.6mm;}
.abil-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1.8mm;margin:0;}
.abil{padding:1mm 0 1.2mm;border-radius:1.4mm;}
.abil-name{font-size:6.1pt;}
.abil-mod{font-size:12pt;}
.abil-score{font-size:6.6pt;padding:.2mm 1.4mm;margin-top:.4mm;}
.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 3.4mm;margin:0;}
.mrow{font-size:7pt;line-height:1.22;display:grid;grid-template-columns:22mm 1fr;gap:1.4mm;border-bottom:.6pt solid rgba(201,173,106,.4);padding:.6mm 0;}
.mrow b{font-family:"Cinzel",serif;font-size:6.1pt;color:var(--red);text-transform:uppercase;letter-spacing:.02em;}
.audit-options{font-size:6.6pt;line-height:1.22;color:#5f5238;background:#efe4c6;border:.8pt solid var(--line);border-radius:1.2mm;padding:1.2mm 1.6mm;margin:.4mm 0 1mm;}
.sheet-columns{column-count:2;column-gap:4mm;column-rule:.6pt solid rgba(201,173,106,.35);}
.msection{break-inside:auto;margin-bottom:1.8mm;}
.spellcasting{break-inside:auto;}
.spellcasting li,.spellcasting p,.entry{break-inside:avoid;}
.mh{break-after:avoid;}
.mh{font-family:"Cinzel",serif;font-weight:700;font-size:9pt;color:var(--red);border-bottom:1.1pt solid var(--red);margin:1mm 0 1mm;padding-bottom:.4mm;text-transform:uppercase;letter-spacing:.05em;}
.msection:first-child .mh,.meta-grid+.msection .mh{margin-top:0;}
.entry{font-size:7.4pt;line-height:1.26;margin:1mm 0;}
.entry-name{font-weight:700;color:var(--red);}
.entry p{display:inline;margin:0;}
.entry ul,.spellcasting ul{margin:.5mm 0 .7mm 3.6mm;padding:0;}
.entry li,.spellcasting li{margin:.3mm 0;}
.spellcasting{font-size:6.9pt;line-height:1.22;}
.spellcasting p{margin:.5mm 0;}
.spellcasting .mh{font-size:8.6pt;}
.note-line{display:none;}
`;
  const cr = m.Challenge ? m.Challenge.replace(/\s*,?\s*$/, "") : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}${CSS}</style></head><body>
<section class="page">
  <div class="fit-area">
    <div class="sheet-fit">
      <div class="frame-top"><span class="ft-title">The Vault of the Starving Mind</span><span class="ft-page">Monster Sheet</span></div>
      <div class="card-fit">
        <div class="stat-col">
          <div class="monster-art"><img src="${art}"></div>
          <div class="combat-strip">
            ${combatCell(m["Armor Class"], "Armor Class", "ac")}
            ${combatCell(m["Hit Points"], "Hit Points", "hp")}
            ${combatCell(m.Speed, "Speed", "speed")}
            ${combatCell(m["Proficiency Bonus"], "Prof. Bonus", "pb")}
          </div>
          <div class="abil-row">${monster.abilities.map(statPip).join("")}</div>
        </div>
        <div class="text-col">
          <div class="monster-title"><h1>${esc(monster.name)}</h1><div class="type">${esc(monster.typeLine)}</div></div>
          <div class="meta-grid">
            ${metaLine("Saving Throws", m["Saving Throws"])}
            ${metaLine("Skills", m.Skills)}
            ${metaLine("Vulnerable", m["Damage Vulnerabilities"])}
            ${metaLine("Resist", m["Damage Resistances"])}
            ${metaLine("Immune", m["Damage Immunities"])}
            ${metaLine("Cond. Immune", m["Condition Immunities"])}
            ${metaLine("Senses", m.Senses)}
            ${metaLine("Languages", m.Languages)}
            ${metaLine("Challenge", cr)}
          </div>
          ${auditBlock(monster)}
          <div class="sheet-columns">
            ${entryList("Traits", monster.traits)}
            ${spellcastingBlock(monster)}
            ${entryList("Actions", monster.actions)}
            ${entryList("Bonus Actions", monster.bonusActions)}
            ${entryList("Reactions", monster.reactions)}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</body></html>`;
}

async function fitPage(page) {
  await page.evaluate(() => {
    const area = document.querySelector(".fit-area").getBoundingClientRect();
    const fit = document.querySelector(".sheet-fit");
    fit.style.transform = "scale(1)";
    const box = fit.getBoundingClientRect();
    const raw = Math.min(area.height / box.height, area.width / box.width);
    const scale = Math.min(1, Math.max(0.5, raw));
    fit.style.transform = `scale(${scale})`;
    fit.dataset.fits = raw >= 0.5 - 0.004 ? "1" : "0";
    fit.dataset.scale = scale.toFixed(3);
  });
}

async function overflow(page) {
  return page.evaluate(() => {
    const fit = document.querySelector(".sheet-fit");
    return fit.dataset.fits === "0" ? [{ page: 1, scale: +fit.dataset.scale }] : [];
  });
}

export function countPdfPages(pdfPath) {
  const text = fs.readFileSync(pdfPath, "latin1");
  return (text.match(/\/Type\s*\/Page\b/g) || []).length;
}

export async function renderOne(slug, page, opts = {}) {
  const monster = parseMonster(root, slug);
  const outDir = path.join(root, "monsters", "sheets", slug);
  fs.mkdirSync(outDir, { recursive: true });
  const html = renderHtml(monster);
  const htmlPath = path.join(outDir, "sheet.html");
  fs.writeFileSync(htmlPath, html);
  await page.setContent(html, { waitUntil: "networkidle" });
  await fitPage(page);
  const pdfPath = path.join(outDir, `${safeFileName(monster.name)}.pdf`);
  await page.pdf({ path: pdfPath, width: "8.5in", height: "5.5in", printBackground: true, pageRanges: "1" });
  const pngPath = path.join(outDir, "preview.png");
  if (!opts.skipPreview) await page.locator(".page").screenshot({ path: pngPath });
  return {
    slug,
    name: monster.name,
    pdf: pdfPath,
    preview: pngPath,
    art: path.join(root, "monsters", "art", `${slug}.png`),
    pages: countPdfPages(pdfPath),
    overflow: await overflow(page)
  };
}

export async function newBrowserPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  return { browser, page };
}

async function main() {
  const slug = process.argv[2];
  if (!slug) throw new Error("Usage: node render-sheet.mjs <monster-slug>");
  const { browser, page } = await newBrowserPage();
  const result = await renderOne(slug, page, { skipPreview: process.env.NO_PREVIEW === "1" });
  await browser.close();
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1]?.endsWith("render-sheet.mjs")) main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
