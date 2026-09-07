import sharp from "sharp";
const slugs = ["beholder-potato-head-figure", "duck-dnd-resin-dice-set", "dnd-2024-core-rulebook-set-gm-screen", "the-book-of-holding", "haxtec-dragon-eye-dice-bag"];
const ts = [200, 220, 235, 245];
const CELL = 220, PAD = 4, W = (CELL + PAD) * ts.length + PAD, RH = CELL + PAD;
const rows = [];
for (const s of slugs) {
  const cells = [];
  for (let j = 0; j < ts.length; j++) {
    const buf = await sharp(`_t_${s}_${ts[j]}.png`).resize(CELL, CELL, { fit: "contain", background: "#fff" }).png().toBuffer();
    cells.push({ input: buf, left: PAD + j * (CELL + PAD), top: PAD });
  }
  const row = await sharp({ create: { width: W, height: RH, channels: 3, background: "#888888" } }).composite(cells).png().toBuffer();
  rows.push(row);
}
const H = RH * slugs.length;
await sharp({ create: { width: W, height: H, channels: 3, background: "#444444" } })
  .composite(rows.map((b, i) => ({ input: b, left: 0, top: i * RH })))
  .png().toFile("_grid.png");
console.log("grid ok", W, H);
