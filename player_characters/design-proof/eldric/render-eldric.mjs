import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..");
const sharedTools = path.join(repoRoot, "items", "magic-items", "deck", "tools");
const requireShared = createRequire(path.join(sharedTools, "package.json"));
const sharp = requireShared("sharp");
const { PDFDocument, StandardFonts, rgb } = requireShared("pdf-lib");

const OUT_DIR = here;
const ART_DIR = path.join(here, "art");
const PREVIEW_DIR = path.join(here, "preview");
const PDF_PATH = path.join(here, "Eldric_Vaelthorn_154714847.pdf");
const PORTRAIT_PATH = path.join(ART_DIR, "eldric-portrait.png");

const W = 419.53;
const H = 595.28;
const M = 24;
const IVORY = "#f7f1e3";
const INK = "#27201b";
const MUTED = "#6f6258";
const PLUM = "#5c2a4d";
const COPPER = "#b06a2c";
const PALE = "#efe1c5";
const RULE = "#c9a46b";

const data = {
  identity: {
    name: "Eldric Vaelthorn",
    line: "Human Wild Magic Sorcerer 3, Acolyte",
    ddb: "D&D Beyond #154714847",
    source: ".squad/decisions/inbox/chilchuck-eldric-datASPEC.md",
    languages: "Common, Elvish, Goblin",
    profs: "Simple weapons, Calligrapher's Supplies",
  },
  combat: [
    ["AC", "12"], ["Init", "+2"], ["Speed", "30 ft."], ["PB", "+2"],
    ["Max HP", "17"], ["Hit Dice", "3d6"], ["Passive Perception", "11"], ["Passive Investigation", "11"], ["Passive Insight", "11"],
  ],
  abilities: [
    ["STR", "11", "+0"], ["DEX", "14", "+2"], ["CON", "12", "+1"],
    ["INT", "12", "+1"], ["WIS", "9", "-1"], ["CHA", "17", "+3"],
  ],
  saves: [
    ["STR", "+0", false], ["DEX", "+2", false], ["CON", "+3", true],
    ["INT", "+1", false], ["WIS", "-1", false], ["CHA", "+5", true],
  ],
  skills: [
    ["Acrobatics", "DEX", "+2", false], ["Animal Handling", "WIS", "-1", false], ["Arcana", "INT", "+3", true],
    ["Athletics", "STR", "+0", false], ["Deception", "CHA", "+3", false], ["History", "INT", "+1", false],
    ["Insight", "WIS", "+1", true], ["Intimidation", "CHA", "+3", false], ["Investigation", "INT", "+1", false],
    ["Medicine", "WIS", "-1", false], ["Nature", "INT", "+1", false], ["Perception", "WIS", "+1", true],
    ["Performance", "CHA", "+3", false], ["Persuasion", "CHA", "+5", true], ["Religion", "INT", "+3", true],
    ["Sleight of Hand", "DEX", "+2", false], ["Stealth", "DEX", "+2", false], ["Survival", "WIS", "-1", false],
  ],
  attacks: [
    ["Fire Bolt", "+5", "1d10 Fire", "Ranged spell attack cantrip"],
    ["Sorcerous Burst", "+5", "1d8 Acid", "Ranged spell attack cantrip"],
    ["Shocking Grasp", "+5", "1d8 Lightning", "Melee spell attack cantrip"],
    ["Unarmed Strike", "+2", "1 Bludgeoning", "Mundane strike"],
  ],
  explainers: {
    ability: "Ability modifier: The + or - number is what you add to d20 rolls tied to that ability.",
    save: "Saving throw: When something targets you, like a spell, poison, or a trap, roll d20 + this number.",
    skill: "Skill check: When the DM asks for a check, roll d20 + the skill's number.",
    action: "Action economy: Each turn you can Move, take 1 Action, and maybe 1 Bonus Action. Between turns you get 1 Reaction.",
    slots: "Spell slots: Cross off a slot when you cast a leveled spell. Cantrips are free. These slots are doubled because there is no rest here.",
    death: "Death saves: At 0 HP, each turn roll d20. 10 or higher is a success, under 10 is a failure. 3 successes means stable, 3 failures means dead. A 20 means you pop back up with 1 HP.",
  },
  features: [
    ["Innate Sorcery", "Bonus Action", "Spend 1 use for 1 minute. Sorcerer save DC rises by 1, and Sorcerer spell attacks have Advantage."],
    ["Font of Magic", "No Action or Bonus Action", "Use the single Sorcery Point pool. Convert slots to SP, or spend 2 SP for a level 1 slot and 3 SP for a level 2 slot."],
    ["Careful Spell", "Special", "Spend 1 SP while casting a save spell. Protect up to 3 creatures so they succeed and avoid half damage if that applies."],
    ["Empowered Spell", "Special", "Spend 1 SP when rolling spell damage. Reroll up to 3 damage dice and use the new rolls."],
    ["Wild Magic Surge", "Passive", "After casting a Sorcerer spell with a slot, roll d20 once per turn. On a 20, roll on the surge table."],
    ["Tides of Chaos", "Special", "Before a d20 Test, spend 1 use for Advantage. The next Sorcerer slot spell can trigger the wild magic refresh hook."],
    ["Magic Initiate, Wizard", "Passive", "Shocking Grasp and Acid Splash are free cantrips. Detect Magic has 2 free casts here and can also use spell slots."],
    ["Magic Initiate, Cleric", "Passive", "Moment to Think and Sacred Flame are free cantrips. Guiding Bolt has 2 free casts here and can also use spell slots."],
    ["Resourceful", "Passive", "Heroic Inspiration after a Long Rest. There is no long rest here, so this is not a use pool."],
  ],
  turn: {
    actions: [
      "Cast a cantrip or leveled spell.",
      "Cast Shocking Grasp, Acid Splash, Detect Magic, Moment to Think, Sacred Flame, or Guiding Bolt from Magic Initiate.",
      "Attack, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Study, Influence, or Utilize.",
    ],
    bonus: [
      "Innate Sorcery: spend 1 use for the 1-minute boost.",
      "Font of Magic: spend 2 SP for a level 1 slot or 3 SP for a level 2 slot.",
      "Misty Step: teleport up to 30 ft. to an unoccupied space you can see.",
      "Moment to Think: rules need confirmation from the source.",
    ],
    reactions: ["Opportunity Attack: when a creature you can see leaves your reach, make one melee attack."],
  },
  spellcasting: { ability: "Charisma", dc: "13", attack: "+5" },
  slots: [["Level 1", 8], ["Level 2", 4]],
  resources: [
    ["Sorcery Points", 6, "boxes"], ["Innate Sorcery", 4, "circles"], ["Tides of Chaos", 2, "circles"],
    ["Detect Magic free cast", 2, "circles"], ["Guiding Bolt free cast", 2, "circles"],
  ],
  spells: [
    { group: "Cantrips", name: "Acid Splash", tag: "Action, 60 ft., Dex DC 13", text: "A 5 ft. acid burst. Creatures in the area that fail the save take 1d6 Acid damage. No damage on a successful save. At will. No concentration." },
    { group: "Cantrips", name: "Blade Ward", tag: "Action, Self, Concentration", text: "Protective warding magic makes attacks against Eldric less reliable while the spell lasts. Use the 2024 Blade Ward rule at the table. At will." },
    { group: "Cantrips", name: "Create Bonfire", tag: "Action, 60 ft., Dex DC 13", text: "Creates a 5 ft. cube bonfire on ground Eldric can see. A creature there when it appears, entering it, or ending there takes 1d8 Fire on a failed save. Concentration, up to 1 minute. At will." },
    { group: "Cantrips", name: "Fire Bolt", tag: "Action, 120 ft., Attack +5", text: "Ranged spell attack against one target. On a hit, 1d10 Fire damage. Can ignite unattended flammable objects that are not worn or carried. At will. No concentration." },
    { group: "Cantrips", name: "Moment to Think", tag: "Bonus Action, Self", text: "The source gives Bonus Action, Self, Instantaneous, V. The full mechanical effect is not present in the source. Rules need confirmation before play. At will if confirmed as a cantrip." },
    { group: "Cantrips", name: "Sacred Flame", tag: "Action, 60 ft., Dex DC 13", text: "One visible target makes the save. On a failure, it takes 1d8 Radiant damage. Cover does not help the target against this save. At will. No concentration." },
    { group: "Cantrips", name: "Shocking Grasp", tag: "Action, Touch, Attack +5", text: "Melee spell attack against one creature. On a hit, 1d8 Lightning damage, and the target cannot take Opportunity Attacks until the start of its next turn. At will." },
    { group: "Cantrips", name: "Sorcerous Burst", tag: "Action, 120 ft., Attack +5", text: "Ranged spell attack against one target. Source attack row is 1d8 Acid. If using the 2024 damage-choice rule, choose an allowed type when casting. At will." },
    { group: "Level 1 Spells", name: "Catapult", tag: "Action, 60 ft., Dex DC 13", text: "Hurl one loose object toward a creature or surface. A creature in the path saves. On a failure, the object strikes for 3d8 Bludgeoning and stops. Level 1 or higher slot. No concentration." },
    { group: "Level 1 Spells", name: "Chaos Bolt", tag: "Action, 120 ft., Attack +5", text: "Ranged spell attack against one creature. On a hit, 2d8 plus 1d6 damage. The d8s set the damage type. Matching d8s can jump to a different target within 30 ft. Level 1 or higher slot." },
    { group: "Level 1 Spells", name: "Detect Magic", tag: "Action, Self, Concentration", text: "For up to 10 minutes, Eldric senses magic within 30 ft. and can identify the school of visible magical effects when allowed. 2 free casts, then slots." },
    { group: "Level 1 Spells", name: "Grease", tag: "Action, 60 ft., Dex DC 13", text: "A 10 ft. square becomes slippery difficult terrain for 1 minute. A creature in it when it appears, entering it, or ending there saves or falls Prone. Level 1 or higher slot. No concentration." },
    { group: "Level 1 Spells", name: "Guiding Bolt", tag: "Action, 120 ft., Attack +5", text: "Ranged spell attack against one target. On a hit, 4d6 Radiant damage. The next attack against that target before the end of Eldric's next turn has Advantage. 2 free casts, then slots." },
    { group: "Level 1 Spells", name: "Witch Bolt", tag: "Action, 60 ft., Attack +5", text: "On a hit, lightning links Eldric to one creature and deals the initial Lightning damage. While concentration holds, he can sustain the spell on later turns if the target stays in range without total cover. Level 1 or higher slot." },
    { group: "Level 2 Spells", name: "Misty Step", tag: "Bonus Action, Self", text: "Eldric teleports up to 30 ft. to an unoccupied space he can see. Fast escape or repositioning. Level 2 or higher slot. No concentration." },
    { group: "Level 2 Spells", name: "Vortex Warp", tag: "Action, 90 ft., Con DC 13", text: "One visible creature saves. On a failure, Eldric teleports it to an unoccupied space he can see that can support it. Willing targets can be treated as failing if the DM allows. Level 2 or higher slot. No concentration." },
  ],
};

function hexToRgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}
function safeName(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

class PdfPage {
  constructor(pdf, fonts, number, title, subtitle) {
    this.pdf = pdf;
    this.page = pdf.addPage([W, H]);
    this.fonts = fonts;
    this.svg = [];
    this.number = number;
    this.title = title;
    this.subtitle = subtitle;
    this.rect(0, 0, W, H, { fill: IVORY, stroke: IVORY });
    this.text("THE VAULT OF THE STARVING MIND", M, H - 23, { font: "helveticaBold", size: 7.5, color: MUTED, caps: true, charSpace: 0.4 });
    this.text(`Page ${number}`, W - M - 28, H - 23, { font: "helvetica", size: 7.5, color: MUTED });
    this.text(title, M, H - 45, { font: "timesBold", size: 18, color: PLUM });
    if (subtitle) this.text(subtitle, M, H - 61, { font: "timesItalic", size: 9.5, color: MUTED });
    this.line(M, H - 72, W - M, H - 72, { color: RULE, width: 0.8 });
    this.filigree(W - M - 44, H - 56, 34, 18);
  }
  finish() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(W * 4)}" height="${Math.round(H * 4)}" viewBox="0 0 ${W} ${H}">${this.svg.join("\n")}</svg>`;
  }
  pdfFont(name) { return this.fonts[name]; }
  rect(x, y, w, h, opts = {}) {
    this.page.drawRectangle({ x, y, width: w, height: h, borderColor: opts.stroke ? hexToRgb(opts.stroke) : undefined, borderWidth: opts.width ?? (opts.stroke ? 0.7 : 0), color: opts.fill ? hexToRgb(opts.fill) : undefined, opacity: opts.opacity ?? 1 });
    this.svg.push(`<rect x="${x}" y="${H - y - h}" width="${w}" height="${h}" fill="${opts.fill || "none"}" stroke="${opts.stroke || "none"}" stroke-width="${opts.width ?? (opts.stroke ? 0.7 : 0)}" opacity="${opts.opacity ?? 1}"/>`);
  }
  line(x1, y1, x2, y2, opts = {}) {
    this.page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, color: hexToRgb(opts.color || INK), thickness: opts.width ?? 0.6 });
    this.svg.push(`<line x1="${x1}" y1="${H - y1}" x2="${x2}" y2="${H - y2}" stroke="${opts.color || INK}" stroke-width="${opts.width ?? 0.6}"/>`);
  }
  circle(x, y, r, opts = {}) {
    this.page.drawCircle({ x, y, size: r, color: opts.fill ? hexToRgb(opts.fill) : undefined, borderColor: hexToRgb(opts.stroke || INK), borderWidth: opts.width ?? 0.8 });
    this.svg.push(`<circle cx="${x}" cy="${H - y}" r="${r}" fill="${opts.fill || "none"}" stroke="${opts.stroke || INK}" stroke-width="${opts.width ?? 0.8}"/>`);
  }
  text(text, x, y, opts = {}) {
    const fontName = opts.font || "times";
    const font = this.pdfFont(fontName);
    const size = opts.size || 10.5;
    let t = String(text);
    if (opts.caps) t = t.toUpperCase();
    let drawX = x;
    if (opts.align === "center" && opts.maxWidth) drawX = x + (opts.maxWidth - font.widthOfTextAtSize(t, size)) / 2;
    if (opts.align === "right" && opts.maxWidth) drawX = x + opts.maxWidth - font.widthOfTextAtSize(t, size);
    this.page.drawText(t, { x: drawX, y, size, font, color: hexToRgb(opts.color || INK), characterSpacing: opts.charSpace || 0 });
    const family = fontName.includes("helvetica") ? "Helvetica, Arial, sans-serif" : "Times New Roman, Times, serif";
    const weight = fontName.includes("Bold") ? "700" : "400";
    const style = fontName.includes("Italic") ? "italic" : "normal";
    this.svg.push(`<text x="${drawX}" y="${H - y}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" fill="${opts.color || INK}" letter-spacing="${opts.charSpace || 0}">${esc(t)}</text>`);
  }
  wrap(text, x, y, w, opts = {}) {
    const fontName = opts.font || "times";
    const font = this.pdfFont(fontName);
    const size = opts.size || 10.5;
    const lineHeight = opts.lineHeight || size * 1.22;
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= w || !line) line = test;
      else { lines.push(line); line = word; }
    }
    if (line) lines.push(line);
    let cy = y;
    for (const l of lines) {
      this.text(l, x, cy, { ...opts, maxWidth: undefined });
      cy -= lineHeight;
    }
    return { lines, bottom: cy + lineHeight, height: lines.length * lineHeight };
  }
  section(label, x, y, w) {
    this.text(label, x, y, { font: "helveticaBold", size: 8.2, color: PLUM, caps: true, charSpace: 0.35 });
    this.line(x, y - 4, x + w, y - 4, { color: RULE, width: 0.6 });
  }
  tag(text, x, y, w) {
    this.rect(x, y - 2, w, 12, { fill: PALE, stroke: RULE, width: 0.35 });
    this.text(text, x + 4, y + 1, { font: "helveticaBold", size: 6.7, color: PLUM, caps: true });
  }
  panel(x, y, w, h, label) {
    this.rect(x, y, w, h, { fill: "#fffaf0", stroke: RULE, width: 0.55 });
    if (label) this.text(label, x + 7, y + h - 12, { font: "helveticaBold", size: 7.5, color: PLUM, caps: true, charSpace: 0.2 });
  }
  image(imageBytesB64, x, y, w, h) {
    this.svg.push(`<image x="${x}" y="${H - y - h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${imageBytesB64}"/>`);
  }
  async pdfImage(imagePath, x, y, w, h) {
    const img = await this.pdf.embedPng(fs.readFileSync(imagePath));
    this.page.drawImage(img, { x, y, width: w, height: h });
  }
  filigree(cx, cy, w, h) {
    const c = COPPER;
    this.line(cx, cy, cx + w, cy, { color: c, width: 0.45 });
    this.circle(cx + w * 0.25, cy + 2, 3.5, { stroke: c, width: 0.45 });
    this.circle(cx + w * 0.75, cy - 2, 3.5, { stroke: c, width: 0.45 });
    this.line(cx + w, cy, cx + w + 10, cy + h * 0.25, { color: c, width: 0.45 });
  }
}

function statBlock(p, x, y, w, h, label, value) {
  p.rect(x, y, w, h, { fill: "#fffaf0", stroke: RULE, width: 0.45 });
  p.text(label, x + 5, y + h - 10, { font: "helveticaBold", size: 6.5, color: MUTED, caps: true });
  p.text(value, x + w / 2 - 10, y + 9, { font: "timesBold", size: 17, color: PLUM, maxWidth: 20, align: "center" });
}
function trackerBoxes(p, x, y, count, size = 12, gap = 4) {
  for (let i = 0; i < count; i++) p.rect(x + i * (size + gap), y, size, size, { fill: "#fffdf7", stroke: PLUM, width: 0.8 });
}
function trackerCircles(p, x, y, count, r = 6.3, gap = 6) {
  for (let i = 0; i < count; i++) p.circle(x + r + i * (r * 2 + gap), y + r, r, { stroke: PLUM, width: 0.8, fill: "#fffdf7" });
}
function attackTable(p, x, y, w) {
  p.section("Attacks", x, y + 66, w);
  const cols = [0, 92, 128, 194];
  p.text("Attack", x, y + 48, { font: "helveticaBold", size: 7, color: MUTED });
  p.text("Hit", x + cols[1], y + 48, { font: "helveticaBold", size: 7, color: MUTED });
  p.text("Damage", x + cols[2], y + 48, { font: "helveticaBold", size: 7, color: MUTED });
  p.text("Note", x + cols[3], y + 48, { font: "helveticaBold", size: 7, color: MUTED });
  data.attacks.forEach((a, i) => {
    const yy = y + 32 - i * 13;
    p.line(x, yy + 10, x + w, yy + 10, { color: "#e1cda7", width: 0.35 });
    p.text(a[0], x, yy, { font: "timesBold", size: 9.5, color: INK });
    p.text(a[1], x + cols[1], yy, { font: "timesBold", size: 9.5, color: PLUM });
    p.text(a[2], x + cols[2], yy, { font: "times", size: 9.4, color: INK });
    p.text(a[3], x + cols[3], yy, { font: "times", size: 8.7, color: MUTED });
  });
}
function buildPage1(p, portraitB64) {
  p.wrap(data.identity.line, M, H - 90, 210, { font: "timesBold", size: 12, color: INK, lineHeight: 14 });
  p.text(data.identity.ddb, M, H - 108, { font: "helveticaBold", size: 8.5, color: COPPER });
  p.text("Player: benmitchell1979", M, H - 121, { font: "helvetica", size: 8.5, color: MUTED });
  p.rect(250, 303, 145, 219, { fill: PALE, stroke: RULE, width: 0.7 });
  p.image(portraitB64, 254, 307, 137, 211);
  p.rect(254, 307, 137, 211, { stroke: PLUM, width: 0.9 });
  p.text("GPT portrait, text-free", 276, 289, { font: "helvetica", size: 7, color: MUTED });

  p.section("Combat essentials", M, 450, 208);
  const stats = [["AC", "12"], ["INIT", "+2"], ["SPEED", "30"], ["PB", "+2"]];
  stats.forEach((s, i) => statBlock(p, M + i * 51, 399, 45, 38, s[0], s[1]));
  p.text("Speed is feet. PB means Proficiency Bonus.", M, 384, { font: "timesItalic", size: 8.5, color: MUTED });

  p.panel(M, 252, 215, 117, "Hit points and death saves");
  p.text("Max HP", M + 10, 334, { font: "helveticaBold", size: 8, color: MUTED, caps: true });
  p.text("17", M + 58, 326, { font: "timesBold", size: 24, color: PLUM });
  p.rect(M + 99, 319, 49, 31, { fill: "#fffdf7", stroke: PLUM, width: 0.8 });
  p.text("Current", M + 104, 338, { font: "helveticaBold", size: 6.2, color: MUTED, caps: true });
  p.rect(M + 158, 319, 47, 31, { fill: "#fffdf7", stroke: PLUM, width: 0.8 });
  p.text("Temp", M + 169, 338, { font: "helveticaBold", size: 6.2, color: MUTED, caps: true });
  p.text("Success", M + 10, 302, { font: "helveticaBold", size: 7.5, color: MUTED });
  trackerCircles(p, M + 55, 296, 3, 5.5, 6);
  p.text("Failure", M + 116, 302, { font: "helveticaBold", size: 7.5, color: MUTED });
  trackerCircles(p, M + 158, 296, 3, 5.5, 6);
  p.wrap("At 0 HP, roll d20: 10+ success, 9 or less failure. 3 successes stable, 3 failures dead. A 20 restores 1 HP.", M + 10, 286, 195, { font: "times", size: 9.8, color: MUTED, lineHeight: 10.8 });

  attackTable(p, M, 188, 371);

  p.section("Abilities", M, 158, 176);
  data.abilities.forEach((a, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = M + col * 58;
    const y = 108 - row * 43;
    p.rect(x, y, 49, 35, { fill: "#fffaf0", stroke: RULE, width: 0.45 });
    p.text(a[0], x + 5, y + 24, { font: "helveticaBold", size: 7, color: MUTED });
    p.text(a[2], x + 5, y + 7, { font: "timesBold", size: 15, color: PLUM });
    p.text(a[1], x + 33, y + 8, { font: "times", size: 10, color: INK });
  });
  p.wrap(data.explainers.ability, M, 36, 176, { font: "times", size: 8.4, color: MUTED, lineHeight: 9.6 });

  p.section("Saving throws", 222, 158, 173);
  data.saves.forEach((s, i) => {
    const y = 134 - i * 15.5;
    p.text(s[0], 222, y, { font: "helveticaBold", size: 8.5, color: INK });
    p.text(s[1], 272, y, { font: "timesBold", size: 10.5, color: s[2] ? PLUM : INK });
    if (s[2]) { p.circle(321, y + 3.5, 3.3, { fill: COPPER, stroke: COPPER }); p.text("proficient", 331, y, { font: "helvetica", size: 7.2, color: MUTED }); }
  });
  p.wrap(data.explainers.save, 222, 36, 173, { font: "times", size: 8.4, color: MUTED, lineHeight: 9.6 });
}
function buildPage2(p) {
  p.section("All skills", M, 507, 183);
  p.text("Skill", M, 489, { font: "helveticaBold", size: 7, color: MUTED });
  p.text("Abil", M + 103, 489, { font: "helveticaBold", size: 7, color: MUTED });
  p.text("Mod", M + 135, 489, { font: "helveticaBold", size: 7, color: MUTED });
  p.text("Prof", M + 162, 489, { font: "helveticaBold", size: 7, color: MUTED });
  data.skills.forEach((s, i) => {
    const y = 473 - i * 15.2;
    p.line(M, y + 10.8, M + 183, y + 10.8, { color: "#e4d1ad", width: 0.3 });
    p.text(s[0], M, y, { font: s[3] ? "timesBold" : "times", size: 10, color: INK });
    p.text(s[1], M + 106, y, { font: "helvetica", size: 8.2, color: MUTED });
    p.text(s[2], M + 136, y, { font: "timesBold", size: 10, color: s[3] ? PLUM : INK });
    if (s[3]) p.circle(M + 168, y + 3.3, 3.6, { fill: COPPER, stroke: COPPER });
  });
  p.panel(M, 156, 183, 38, "How to roll checks");
  p.wrap(data.explainers.skill, M + 8, 174, 167, { font: "times", size: 10, color: MUTED, lineHeight: 12 });

  p.section("Passive numbers", 225, 507, 170);
  [["Passive Perception", "11"], ["Passive Investigation", "11"], ["Passive Insight", "11"], ["Hit Dice", "3d6"], ["Languages", "Common, Elvish, Goblin"]].forEach((row, i) => {
    const y = 472 - i * 36;
    p.rect(225, y, 170, 25, { fill: "#fffaf0", stroke: RULE, width: 0.45 });
    p.text(row[0], 233, y + 14, { font: "helveticaBold", size: 7.2, color: MUTED, caps: true });
    p.text(row[1], 342, y + 8, { font: "timesBold", size: 12, color: PLUM, maxWidth: 45, align: "right" });
  });
  p.panel(225, 156, 170, 120, "How proficiency works");
  p.wrap("A filled copper dot means Eldric is proficient. Proficiency is already included in the printed modifier. Do not add it again.", 235, 246, 150, { font: "times", size: 10.3, color: INK, lineHeight: 12.4 });
  p.wrap("For ability checks without a listed skill, roll d20 plus the ability modifier from page 1.", 235, 196, 150, { font: "times", size: 10.3, color: INK, lineHeight: 12.4 });
}
function buildFeaturesPage(p, features, label) {
  p.section(label, M, 507, 371);
  let y = 472;
  const gap = 10;
  const h = features.length === 5 ? 73 : 88;
  for (const [name, tag, text] of features) {
    p.rect(M, y - h, 371, h, { fill: "#fffaf0", stroke: RULE, width: 0.45 });
    p.text(name, M + 10, y - 18, { font: "timesBold", size: 12.3, color: PLUM });
    p.tag(tag, M + 10, y - 34, 154);
    p.wrap(text, M + 10, y - 50, 351, { font: "times", size: 10, color: INK, lineHeight: 12.1 });
    y -= h + gap;
  }
}
function bulletList(p, items, x, y, w) {
  let cy = y;
  for (const item of items) {
    p.text("•", x, cy, { font: "timesBold", size: 11, color: COPPER });
    const r = p.wrap(item, x + 10, cy, w - 10, { font: "times", size: 10.2, color: INK, lineHeight: 12.4 });
    cy = r.bottom - 7;
  }
  return cy;
}
function buildPage3(p) {
  p.panel(M, 472, 371, 44, "Turn structure");
  p.wrap(data.explainers.action, M + 9, 494, 352, { font: "times", size: 10.6, color: INK, lineHeight: 13 });
  p.section("Actions", M, 445, 177);
  let y = bulletList(p, data.turn.actions, M, 425, 177);
  p.section("Bonus actions", M, y - 4, 177);
  y = bulletList(p, data.turn.bonus, M, y - 24, 177);
  p.section("Reactions", M, y - 4, 177);
  bulletList(p, data.turn.reactions, M, y - 24, 177);

  p.section("Spellcasting", 222, 445, 173);
  statBlock(p, 222, 395, 48, 36, "Save DC", data.spellcasting.dc);
  statBlock(p, 281, 395, 49, 36, "Attack", data.spellcasting.attack);
  statBlock(p, 341, 395, 54, 36, "Ability", "CHA");
  p.wrap("Concentration: You can keep only one concentration spell at a time. Taking damage can force a Constitution save to keep it.", 222, 375, 173, { font: "times", size: 10, color: MUTED, lineHeight: 12 });

  p.section("Doubled spell slots, no rest", 222, 327, 173);
  p.wrap(data.explainers.slots, 222, 307, 173, { font: "times", size: 10, color: INK, lineHeight: 12 });
  p.text("Level 1", 222, 254, { font: "helveticaBold", size: 8.5, color: PLUM });
  trackerBoxes(p, 276, 249, 8, 12.5, 3.4);
  p.text("Level 2", 222, 224, { font: "helveticaBold", size: 8.5, color: PLUM });
  trackerBoxes(p, 276, 219, 4, 12.5, 5);

  p.section("Single canonical resource trackers", 222, 184, 173);
  let ry = 160;
  for (const [name, count, kind] of data.resources) {
    p.text(name, 222, ry + 4, { font: "timesBold", size: 9.7, color: INK });
    if (kind === "boxes") trackerBoxes(p, 316, ry, count, 11.5, 3.2);
    else trackerCircles(p, 316, ry - 0.5, count, 5.5, 4.5);
    ry -= 24;
  }
  p.wrap("Careful Spell, Empowered Spell, and Font of Magic all spend the same Sorcery Point pool. They do not have separate trackers.", 222, 41, 173, { font: "timesItalic", size: 9.3, color: MUTED, lineHeight: 11 });
}
function spellCard(p, spell, x, y, w, h) {
  p.rect(x, y, w, h, { fill: "#fffaf0", stroke: RULE, width: 0.45 });
  p.text(spell.name, x + 8, y + h - 16, { font: "timesBold", size: 12.2, color: PLUM });
  p.tag(spell.tag, x + 8, y + h - 31, w - 16);
  p.wrap(spell.text, x + 8, y + h - 45, w - 16, { font: "times", size: 10, color: INK, lineHeight: 12.1 });
}
function buildSpellPage(p, group, spells, note) {
  p.section(group, M, 507, 371);
  let y = 474;
  const gap = 10;
  const available = y - 70;
  const h = Math.floor((available - gap * (spells.length - 1)) / spells.length);
  for (const spell of spells) {
    spellCard(p, spell, M, y - h, 371, h);
    y -= h + gap;
  }
  if (note) p.wrap(note, M, 42, 371, { font: "timesItalic", size: 9.5, color: MUTED, lineHeight: 11 });
}
function buildPage6(p) {
  const spells = data.spells.filter((s) => s.group === "Level 2 Spells");
  p.section("Level 2 Spells", M, 507, 371);
  spellCard(p, spells[0], M, 404, 371, 86);
  spellCard(p, spells[1], M, 306, 371, 86);
  p.section("Equipment, languages, and source notes", M, 267, 371);
  p.panel(M, 164, 371, 82, "Table handling");
  p.wrap(`Weapons: Simple Weapons. Tools: ${data.identity.profs.split(", ").slice(1).join(", ")}. Languages: ${data.identity.languages}.`, M + 10, 220, 351, { font: "times", size: 10.5, color: INK, lineHeight: 13 });
  p.wrap("Coins: source data lists 28 GP and 0 lb. carried. Campaign canon says characters wake with no useful gear or coin until Item Cards are found, so this proof treats coins as source-only, not starting table gear.", M + 10, 191, 351, { font: "times", size: 10.5, color: INK, lineHeight: 13 });
  p.panel(M, 63, 371, 76, "Dry-erase notes");
  p.line(M + 12, 114, W - M - 12, 114, { color: "#d6bc8b", width: 0.45 });
  p.line(M + 12, 94, W - M - 12, 94, { color: "#d6bc8b", width: 0.45 });
}

async function main() {
  if (!fs.existsSync(PORTRAIT_PATH)) throw new Error(`Missing portrait at ${PORTRAIT_PATH}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  for (const file of fs.readdirSync(PREVIEW_DIR)) if (/\.(png|svg|pdf)$/i.test(file)) fs.unlinkSync(path.join(PREVIEW_DIR, file));

  const pdf = await PDFDocument.create();
  const fonts = {
    times: await pdf.embedFont(StandardFonts.TimesRoman),
    timesBold: await pdf.embedFont(StandardFonts.TimesRomanBold),
    timesItalic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
    helvetica: await pdf.embedFont(StandardFonts.Helvetica),
    helveticaBold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  const portraitB64 = fs.readFileSync(PORTRAIT_PATH).toString("base64");
  const pages = [];
  const add = (title, subtitle) => { const p = new PdfPage(pdf, fonts, pages.length + 1, title, subtitle); pages.push(p); return p; };

  const p1 = add(data.identity.name, "Identity and combat controls");
  buildPage1(p1, portraitB64);
  await p1.pdfImage(PORTRAIT_PATH, 254, 307, 137, 211);
  const p2 = add("Skills and Features", "All checks, proficiencies, and beginner-facing rules");
  buildPage2(p2);
  const p3 = add("Features and Feats", "Sorcerer and Wild Magic rules");
  buildFeaturesPage(p3, data.features.slice(0, 5), "Sorcerer and Wild Magic");
  const p4 = add("Features and Feats", "Origin feats and passive notes");
  buildFeaturesPage(p4, data.features.slice(5), "Origin feats and passive notes");
  const p5turn = add("On Your Turn", "Actions, spell slots, and one canonical resource bank");
  buildPage3(p5turn);
  const cantrips = data.spells.filter((s) => s.group === "Cantrips");
  const p6 = add("Spell Reference", "Cantrips, part 1");
  buildSpellPage(p6, "Cantrips, part 1", cantrips.slice(0, 4), "Cantrips are at will and do not spend spell slots.");
  const p7 = add("Spell Reference", "Cantrips, part 2");
  buildSpellPage(p7, "Cantrips, part 2", cantrips.slice(4), "Moment to Think needs rules confirmation because the source did not include the full effect.");
  const level1 = data.spells.filter((s) => s.group === "Level 1 Spells");
  const p8 = add("Spell Reference", "Level 1 spells, part 1");
  buildSpellPage(p8, "Level 1 Spells, part 1", level1.slice(0, 3), "Use the Level 1 spell-slot tracker on page 5.");
  const p9 = add("Spell Reference", "Level 1 spells, part 2");
  buildSpellPage(p9, "Level 1 Spells, part 2", level1.slice(3), "Detect Magic and Guiding Bolt also have separate free-cast circles on page 5.");
  const p10 = add("Spell Reference", "Level 2 spells and table notes");
  buildPage6(p10);

  fs.writeFileSync(PDF_PATH, await pdf.save());

  const previewPaths = [];
  for (let i = 0; i < pages.length; i++) {
    const svg = pages[i].finish();
    const out = path.join(PREVIEW_DIR, `page-${i + 1}.png`);
    await sharp(Buffer.from(svg)).png().toFile(out);
    previewPaths.push(out);
  }
  const thumbW = 330;
  const thumbH = Math.round(thumbW * H / W);
  const gap = 24;
  const labelH = 26;
  const cols = 3;
  const rows = Math.ceil(previewPaths.length / cols);
  const sheetW = cols * thumbW + (cols + 1) * gap;
  const sheetH = rows * (thumbH + labelH) + (rows + 1) * gap + 28;
  const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}"><rect width="100%" height="100%" fill="${IVORY}"/><text x="${gap}" y="26" font-family="Helvetica" font-size="16" font-weight="700" fill="${PLUM}">Eldric Vaelthorn design proof contact sheet</text></svg>`;
  const composites = [];
  for (let i = 0; i < previewPaths.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = gap + col * (thumbW + gap);
    const top = gap + 28 + row * (thumbH + labelH + gap);
    composites.push({ input: await sharp(previewPaths[i]).resize(thumbW, thumbH).png().toBuffer(), left, top });
    const label = `<svg xmlns="http://www.w3.org/2000/svg" width="${thumbW}" height="${labelH}"><text x="0" y="17" font-family="Helvetica" font-size="14" font-weight="700" fill="${PLUM}">Page ${i + 1}</text></svg>`;
    composites.push({ input: Buffer.from(label), left, top: top + thumbH + 5 });
  }
  await sharp(Buffer.from(baseSvg)).composite(composites).png().toFile(path.join(PREVIEW_DIR, "contact-sheet.png"));

  const check = await PDFDocument.load(fs.readFileSync(PDF_PATH));
  const dims = check.getPages().map((page) => page.getSize());
  console.log(JSON.stringify({ pdf: path.relative(repoRoot, PDF_PATH), pages: dims.length, width: dims[0].width, height: dims[0].height, previews: previewPaths.map((p) => path.relative(repoRoot, p)), contact: path.relative(repoRoot, path.join(PREVIEW_DIR, "contact-sheet.png")) }, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
