import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const roomsDir = path.resolve(here, "..");
const repoRoot = path.resolve(here, "..", "..", "..");
const require = createRequire(path.join(repoRoot, "items", "magic-items", "deck", "tools", "package.json"));
const sharp = require("sharp");

const artPath = path.join(roomsDir, "FiveSeals-wall.png");
const printArtPath = path.join(roomsDir, "FiveSeals-wall-print.png");
const outPath = path.join(roomsDir, "FiveSeals-handout.png");
const previewPath = path.join(roomsDir, "FiveSeals-handout-preview.png");

const PRINT_TONE_MAP = {
  brightness: 1.85,
  saturation: 1.14,
  gamma: 2.2,
  contrast: 1.2,
  shadowLift: 38,
};

const MASK_SYMBOL_TOUCHUP = {
  left: 1120,
  top: 94,
  width: 330,
  height: 350,
  brightness: 1.54,
  saturation: 1.02,
  contrast: 1.05,
  lift: 6,
  feather: 46,
  ellipse: {
    cx: 135,
    cy: 166,
    rx: 105,
    ry: 160,
  },
};

const TITLE = "THE FIVE SEALS";
const RIDDLE = [
  "The gods have no need of names. Know them by their signs.",
  "“First, he who slept ten years within a blade, then rose to take the throne of his enemy.”",
  "“Second, he whose greatest dawn brought calamity even unto the gods.”",
  "“Third, he who became the blade by which Murder itself was slain.”",
  "“Fourth, he who alone remained divine when heaven cast the gods to earth.”",
  "“Last, she who bore another name before inheriting the mantle of magic.”",
];

const W = 2550;
const H = 3300;
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function wrapText(line, maxChars = 76) {
  const words = line.split(" ");
  const rows = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      rows.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) rows.push(current);
  return rows;
}

function parchmentSvg() {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="paper" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#f2e8cf"/>
      <stop offset="100%" stop-color="#c9ad75"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="17"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.18"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#paper)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.35"/>
  <rect x="72" y="72" width="${W - 144}" height="${H - 144}" rx="36" fill="none" stroke="#5b1a1a" stroke-width="22"/>
  <rect x="112" y="112" width="${W - 224}" height="${H - 224}" rx="24" fill="none" stroke="#b8963e" stroke-width="8"/>
</svg>`);
}

function overlaySvg() {
  const wrapped = RIDDLE.flatMap((line, index) => [
    ...wrapText(line).map((text) => ({ text, gapBefore: false })),
    ...(index < RIDDLE.length - 1 ? [{ text: "", gapBefore: true }] : []),
  ]);

  let y = 2200;
  const lineNodes = wrapped.map(({ text, gapBefore }) => {
    y += gapBefore ? 30 : 58;
    if (!text) return "";
    return `<text x="1275" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-size="47" font-weight="700" fill="#221711">${xml(text)}</text>`;
  }).join("");

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="180" y="155" width="2190" height="270" rx="34" fill="#d3b86c" fill-opacity="0.82" stroke="#5b1a1a" stroke-width="15"/>
  <rect x="220" y="195" width="2110" height="190" rx="22" fill="none" stroke="#7a5a1c" stroke-width="6"/>
  <text x="1275" y="330" text-anchor="middle" font-family="Georgia, serif" font-size="88" font-weight="700" fill="#4b251c" letter-spacing="4">${xml(TITLE)}</text>

  <rect x="220" y="500" width="2110" height="1420" rx="24" fill="none" stroke="#5b1a1a" stroke-width="18"/>
  <rect x="251" y="531" width="2048" height="1358" rx="16" fill="none" stroke="#b8963e" stroke-width="7"/>

  <rect x="180" y="2060" width="2190" height="1070" rx="34" fill="#d3b86c" fill-opacity="0.82" stroke="#5b1a1a" stroke-width="15"/>
  <rect x="220" y="2100" width="2110" height="990" rx="22" fill="none" stroke="#7a5a1c" stroke-width="6"/>
  <text x="1275" y="2182" text-anchor="middle" font-family="Georgia, serif" font-size="62" font-weight="700" fill="#4b251c" letter-spacing="2">INSCRIPTION</text>
  ${lineNodes}
</svg>`);
}

function softEllipseMaskSvg({ width, height, feather, ellipse }) {
return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs>
  <filter id="soften" x="-25%" y="-25%" width="150%" height="150%">
    <feGaussianBlur stdDeviation="${feather}"/>
  </filter>
</defs>
<rect width="${width}" height="${height}" fill="black"/>
<ellipse cx="${ellipse.cx}" cy="${ellipse.cy}" rx="${ellipse.rx}" ry="${ellipse.ry}" fill="white" filter="url(#soften)"/>
</svg>`);
}

async function brightenMaskSymbol(printBuffer) {
const { left, top, width, height, brightness, saturation, contrast, lift, feather, ellipse } = MASK_SYMBOL_TOUCHUP;
const alpha = await sharp(softEllipseMaskSvg({ width, height, feather, ellipse }))
  .removeAlpha()
  .greyscale()
  .raw()
  .toBuffer();

const patch = await sharp(printBuffer)
  .extract({ left, top, width, height })
  .modulate({ brightness, saturation })
  .linear(contrast, lift)
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png()
  .toBuffer();

return sharp(printBuffer)
  .composite([{ input: patch, left, top }])
  .png({ compressionLevel: 9 })
  .toBuffer();
}

async function compose() {
if (!fs.existsSync(artPath)) {
  throw new Error(`Wall art missing: ${artPath}`);
}

const printBuffer = await sharp(artPath)
  .modulate({
    brightness: PRINT_TONE_MAP.brightness,
    saturation: PRINT_TONE_MAP.saturation,
  })
  .gamma(PRINT_TONE_MAP.gamma)
  .linear(PRINT_TONE_MAP.contrast, PRINT_TONE_MAP.shadowLift)
  .png({ compressionLevel: 9 })
  .toBuffer();

const touchedPrintBuffer = await brightenMaskSymbol(printBuffer);
fs.writeFileSync(printArtPath, touchedPrintBuffer);

const art = await sharp(touchedPrintBuffer)
  .resize(2048, 1358, { fit: "contain", background: "#1b1614" })
  .png()
  .toBuffer();

  const finalBuffer = await sharp(parchmentSvg())
    .composite([
      { input: art, left: 251, top: 531 },
      { input: overlaySvg(), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(outPath, finalBuffer);

  await sharp(finalBuffer)
    .resize({ width: 760 })
    .png({ compressionLevel: 9 })
    .toFile(previewPath);

  const previewMeta = await sharp(previewPath).metadata();
  fs.unlinkSync(previewPath);

  const meta = await sharp(outPath).metadata();
  const size = fs.statSync(outPath).size;
  console.log(JSON.stringify({
    output: outPath,
    bytes: size,
    dimensions: { width: meta.width, height: meta.height },
    source: artPath,
    printSource: printArtPath,
    toneMap: PRINT_TONE_MAP,
    maskTouchup: MASK_SYMBOL_TOUCHUP,
    mode: "framed-from-print-brightened-wall-art",
    preview: {
      path: previewPath,
      width: previewMeta.width,
      height: previewMeta.height,
      deleted: !fs.existsSync(previewPath),
    },
  }, null, 2));
}

await compose();
