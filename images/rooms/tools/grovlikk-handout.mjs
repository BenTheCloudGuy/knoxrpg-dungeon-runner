import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const roomsDir = path.resolve(here, "..");
const outPath = path.join(roomsDir, "GrovliksLastLaugh-handout.png");
const previewPath = path.join(roomsDir, "GrovliksLastLaugh-handout-preview.png");

const VERSE = [
  "Some earn roses. Some earn scorn.",
  "Both may take their bow.",
  "But he who earns only silence",
  "Must never leave the stage.",
];

const W = 2550;
const H = 3300;
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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
  const lineNodes = VERSE.map((line, i) =>
    `<text x="1275" y="${2680 + i * 94}" text-anchor="middle" font-family="Georgia, serif" font-size="76" font-weight="700" fill="#221711">${xml(line)}</text>`
  ).join("");

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="150" y="155" width="2250" height="2250" rx="24" fill="none" stroke="#5b1a1a" stroke-width="18"/>
  <rect x="181" y="186" width="2188" height="2188" rx="16" fill="none" stroke="#b8963e" stroke-width="7"/>
  <rect x="180" y="2460" width="2190" height="670" rx="34" fill="#d3b86c" fill-opacity="0.82" stroke="#5b1a1a" stroke-width="15"/>
  <rect x="220" y="2500" width="2110" height="590" rx="22" fill="none" stroke="#7a5a1c" stroke-width="6"/>
  <text x="1275" y="2585" text-anchor="middle" font-family="Georgia, serif" font-size="66" font-weight="700" fill="#4b251c" letter-spacing="2">BRASS PLAQUE INSCRIPTION</text>
  ${lineNodes}
</svg>`);
}

async function recoverDrawingFromExistingHandout() {
  if (!fs.existsSync(outPath)) {
    throw new Error(`Existing handout not found: ${outPath}`);
  }

  const source = await sharp(outPath)
    .extract({ left: 190, top: 195, width: 2170, height: 2170 })
    .resize(2250, 2250, { fit: "cover", position: "center" })
    .png()
    .toBuffer();

  return source;
}

async function compose() {
  const art = await recoverDrawingFromExistingHandout();
  const finalBuffer = await sharp(parchmentSvg())
    .composite([
      { input: art, left: 150, top: 155 },
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

  const size = fs.statSync(outPath).size;
  console.log(JSON.stringify({
    output: outPath,
    bytes: size,
    mode: "recomposed-from-existing-handout-crop",
    preview: {
      path: previewPath,
      width: previewMeta.width,
      height: previewMeta.height,
      deleted: !fs.existsSync(previewPath),
    },
  }, null, 2));
}

await compose();
