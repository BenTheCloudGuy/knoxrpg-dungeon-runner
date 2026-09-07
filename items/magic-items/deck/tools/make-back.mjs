// make-back.mjs — card-back generator for the magic-item deck.
//
// Produces a single 750x1050 px (2.5"x3.5" @ 300 dpi) card back that matches
// the deck look: parchment radial #f2e8d0 -> #d9c8a2, maroon frame #5b1a1a,
// gold inner line #b8963e, Georgia serif. Central faceted-gem motif, the deck
// name up top, and "LOOT" below.
//
// The art is horizontally symmetric. It is not vertically symmetric, so the
// deck's SHORT-edge duplex layout rotates each placed back 180 (the sheet
// assemblers handle the rotation, not this module).
//
// Import:  import { buildBackPng } from "./make-back.mjs";
// Standalone:  node make-back.mjs   ->  writes items/magic-items/deck/back.png

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const W = 750, H = 1050;
const CX = 375, CY = 500;

function gemBurst() {
  const spokes = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const a = (i * (2 * Math.PI)) / N;
    const x1 = CX + Math.cos(a) * 74, y1 = CY + Math.sin(a) * 74;
    const x2 = CX + Math.cos(a) * 205, y2 = CY + Math.sin(a) * 205;
    spokes.push(`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#b8963e" stroke-width="1.5" opacity="0.22"/>`);
  }
  return spokes.join("");
}

function backSvg() {
  const DEFS = `<defs><radialGradient id="pg" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#f2e8d0"/><stop offset="100%" stop-color="#d9c8a2"/></radialGradient></defs>`;
  const BG = `<rect width="${W}" height="${H}" rx="26" fill="url(#pg)"/>`;
  const FRAME = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" rx="20" fill="none" stroke="#5b1a1a" stroke-width="12"/><rect x="22" y="22" width="${W - 44}" height="${H - 44}" rx="14" fill="none" stroke="#b8963e" stroke-width="3"/>`;

  const banner = `
    <rect x="55" y="70" width="640" height="150" rx="16" fill="#6e1f1f" stroke="#b8963e" stroke-width="3"/>
    <text x="${CX}" y="134" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" letter-spacing="2" fill="#f4e6c8">THE VAULT OF THE</text>
    <text x="${CX}" y="184" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="34" letter-spacing="2" fill="#f4e6c8">STARVING MIND</text>`;

  // Layered faceted gem: gold outer, maroon middle, gold core, with facet lines.
  const gem = `
    ${gemBurst()}
    <polygon points="375,345 535,500 375,655 215,500" fill="#c9a13b" stroke="#7a5a1c" stroke-width="5"/>
    <line x1="375" y1="345" x2="375" y2="655" stroke="#7a5a1c" stroke-width="2" opacity="0.7"/>
    <line x1="215" y1="500" x2="535" y2="500" stroke="#7a5a1c" stroke-width="2" opacity="0.7"/>
    <line x1="375" y1="345" x2="215" y2="500" stroke="#f2e8d0" stroke-width="1.5" opacity="0.5"/>
    <line x1="375" y1="345" x2="535" y2="500" stroke="#f2e8d0" stroke-width="1.5" opacity="0.5"/>
    <polygon points="375,405 475,500 375,595 275,500" fill="#6e1f1f" stroke="#b8963e" stroke-width="3"/>
    <polygon points="375,455 425,500 375,545 325,500" fill="#c9a13b" stroke="#7a5a1c" stroke-width="2"/>`;

  const loot = `
    <text x="${CX}" y="792" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="76" letter-spacing="14" fill="#5b1a1a">LOOT</text>
    <line x1="230" y1="828" x2="520" y2="828" stroke="#b8963e" stroke-width="2"/>
    <text x="${CX}" y="872" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="26" letter-spacing="3" fill="#4a3d2a">Magic Item Deck</text>`;

  const footer = `
    <line x1="250" y1="950" x2="350" y2="950" stroke="#b8963e" stroke-width="2"/>
    <line x1="400" y1="950" x2="500" y2="950" stroke="#b8963e" stroke-width="2"/>
    <polygon points="375,940 390,950 375,960 360,950" fill="#c9a13b" stroke="#7a5a1c" stroke-width="1.5"/>
    <text x="${CX}" y="1002" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="22" letter-spacing="6" fill="#6e1f1f">KNOXRPG</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${BG}${banner}${gem}${loot}${footer}${FRAME}</svg>`;
}

export async function buildBackPng() {
  return await sharp(Buffer.from(backSvg())).png().toBuffer();
}

// Self-run: write back.png into the deck directory.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const deckDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const out = path.join(deckDir, "back.png");
  const buf = await buildBackPng();
  fs.writeFileSync(out, buf);
  console.log("wrote", out, `(${Math.round(buf.length / 1024)} KB)`);
}
