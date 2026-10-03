// Build fonts-embed.css: parse the Google Fonts CSS, keep only the Latin subset
// @font-face blocks, download each woff2, and inline it as a base64 data URI so the
// rendered PDF needs no network and prints identically everywhere.
import fs from "fs";

const css = fs.readFileSync("fonts/gf.css", "utf8");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

const blocks = css.split("@font-face").slice(1).map((b) => "@font-face" + b.split("}")[0] + "}");
let out = "";
let kept = 0;
for (const b of blocks) {
  const range = (b.match(/unicode-range:\s*([^;]+);/) || [])[1] || "";
  // Latin subset always includes U+0000-00FF.
  if (!/U\+0000-00FF/.test(range)) continue;
  const url = (b.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
  if (!url) continue;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const buf = Buffer.from(await res.arrayBuffer());
  const b64 = buf.toString("base64");
  const newSrc = `url(data:font/woff2;base64,${b64}) format('woff2')`;
  out += b.replace(/src:\s*url\([^)]+\)\s*format\('woff2'\)/, `src: ${newSrc}`) + "\n";
  kept++;
}
fs.writeFileSync("fonts/fonts-embed.css", out);
console.log("embedded", kept, "latin font faces; bytes", out.length);
