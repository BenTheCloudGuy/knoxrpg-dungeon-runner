import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pcDir = path.resolve(here, "..");
const repoRoot = path.resolve(pcDir, "..");
const itemsDir = path.join(repoRoot, "items");
const sharedTools = path.join(itemsDir, "magic-items", "deck", "tools");
const requireShared = createRequire(path.join(sharedTools, "package.json"));
const sharp = requireShared("sharp");
const { PDFDocument } = requireShared("pdf-lib");

const SRC_DIR = path.join(pcDir, "markdown");
const OUT_DIR = path.join(pcDir, "sheets");
const PREVIEW_DIR = path.join(here, "_preview");
const PHASE2_CONTENT = path.join(repoRoot, ".squad", "decisions", "inbox", "chilchuck-charsheet-content-phase2.md");
const ROSTER_README = path.join(SRC_DIR, "README.md");
const W = 1748;
const H = 2480;
const PDF_W = 420;
const PDF_H = 595;

for (const dir of [OUT_DIR, PREVIEW_DIR]) fs.mkdirSync(dir, { recursive: true });
for (const file of fs.readdirSync(PREVIEW_DIR).filter((name) => name.toLowerCase().endsWith(".png"))) {
  fs.unlinkSync(path.join(PREVIEW_DIR, file));
}

const ABILS = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const ABR = { Strength: "STR", Dexterity: "DEX", Constitution: "CON", Intelligence: "INT", Wisdom: "WIS", Charisma: "CHA" };
const SPOT_PREVIEWS = new Set(["Alderachk", "Drakor", "Bishop", "Tobrin_Gearwhistle", "Halvar_Kolsrud"].map(slugify));
const SKILL_ORDER = [
  "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation",
  "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival",
];

const EXPLAINERS = {
  ability: "Ability modifier: The + or - number is what you add to d20 rolls tied to that ability.",
  save: "Saving throw: When something targets you, like a spell, poison, or a trap, roll d20 + this number.",
  skill: "Skill check: When the DM asks for a check, roll d20 + the skill's number.",
  action: "Action economy: Each turn you can Move, take 1 Action, and maybe 1 Bonus Action. Between turns you get 1 Reaction.",
  slots: "Spell slots: Cross off a slot when you cast a leveled spell. Cantrips are free. These slots are doubled because there is no rest here.",
  death: "Death saves: At 0 HP, each turn roll d20. 10 or higher is a success, under 10 is a failure. 3 successes means stable, 3 failures means dead. A 20 means you pop back up with 1 HP.",
};

const CONFIG = {
  "eldric-vaelthorn": {
    source: "Eldric_Vaelthorn.md",
    number: "154714847",
    spellSaveDc: "13",
    spellAttack: "+5",
    slots: [{ label: "Level 1", count: 8 }, { label: "Level 2", count: 4 }],
    resources: [
      { label: "Sorcery Points", count: 6 },
      { label: "Innate Sorcery", count: 4 },
      { label: "Tides of Chaos", count: 2 },
      { label: "Detect Magic free cast", count: 2 },
      { label: "Guiding Bolt free cast", count: 2 },
    ],
    featureGroups: [
      { title: "Sorcerer core", items: [
        "Font of Magic: Eldric has 6 Sorcery Points for this one-shot. He spends SP on Metamagic or creating spell slots.",
        "Convert slot: No action. Spend a spell slot to gain Sorcery Points equal to the slot's level.",
        "Create spell slot: Bonus Action. Level 1 costs 2 SP. Level 2 costs 3 SP. The slot lasts until the adventure ends.",
        "Innate Sorcery: Bonus Action. Spend 1 use for 1 minute. Sorcerer save DC rises by 1, and Sorcerer spell attacks have Advantage.",
      ]},
      { title: "Metamagic and wild magic", items: [
        "Careful Spell: Spend 1 SP when casting a spell that forces a save. Up to 3 chosen creatures automatically succeed and take no half damage if that applies.",
        "Empowered Spell: Spend 1 SP when rolling spell damage. Reroll up to 3 damage dice and use the new rolls.",
        "Wild Magic Surge: Once per turn after casting a Sorcerer spell with a spell slot, roll d20. On a 20, roll on the Wild Magic Surge table.",
        "Tides of Chaos: Before a d20 Test, spend 1 use for Advantage. Afterward, the next Sorcerer spell with a slot can trigger Wild Magic Surge and refresh it.",
      ]},
      { title: "Feats and passive traits", items: [
        "Magic Initiate, Wizard: Shocking Grasp and Acid Splash are free cantrips. Detect Magic has 2 free casts here and can also use spell slots.",
        "Magic Initiate, Cleric: Moment to Think and Sacred Flame are free cantrips. Guiding Bolt has 2 free casts here and can also use spell slots.",
        "Resourceful: Passive. Eldric gains Heroic Inspiration after a Long Rest. Since there is no rest here, it is not a use pool.",
      ]},
    ],
    actionGroups: {
      actions: [
        "Magic: Cast a cantrip or leveled spell.",
        "Magic Initiate, Wizard: Shocking Grasp, Acid Splash, or Detect Magic.",
        "Magic Initiate, Cleric: Moment to Think, Sacred Flame, or Guiding Bolt.",
        "Attack, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Study, Influence, Utilize.",
      ],
      bonus: [
        "Innate Sorcery: Spend 1 use for the 1-minute boost.",
        "Font of Magic: Spend 2 SP for a level 1 slot or 3 SP for a level 2 slot.",
        "Misty Step: Teleport to an unoccupied space you can see.",
      ],
      reactions: ["Opportunity Attack: When a creature you can see leaves your reach, make one melee attack."],
    },
  },
  "varka-stonefist": {
    source: "Varka_Stonefist.md",
    number: "154966602",
    slots: [],
    resources: [
      { label: "Rage", count: 6 },
      { label: "Adrenaline Rush", count: 4 },
      { label: "Relentless Endurance", count: 2 },
    ],
    featureGroups: [
      { title: "Rage and offense", items: [
        "Rage: Bonus Action. While raging, Varka adds +2 damage to Strength melee and unarmed hits, resists bludgeoning, piercing, and slashing damage, and has Advantage on Strength checks and Strength saves.",
        "Reckless Attack: At-will. On the first Strength attack of the turn, gain Advantage on Strength attack rolls until next turn. Attacks against Varka have Advantage during that time.",
        "Frenzy: Passive while raging. If Varka uses Reckless Attack during Rage, the first creature he hits that turn with a Strength attack takes 2d6 extra damage.",
      ]},
      { title: "Weapons and brawling", items: [
        "Cleave: Once per turn after hitting with a Greataxe, make one extra Greataxe attack against a second creature within 5 feet of the first. Do not add ability modifier to the second damage roll.",
        "Push: When Varka hits a Large or smaller creature with a Greatclub, he can push it up to 10 feet straight away.",
        "Tavern Brawler: Damaging unarmed hits deal 1d4 + 3 bludgeoning. Reroll a 1 on unarmed damage. Once per turn, an unarmed hit can also push 5 feet.",
      ]},
      { title: "Survival and movement", items: [
        "Unarmored Defense: Passive. While not wearing armor, AC is 10 + Dex modifier + Con modifier. Current unarmored AC is 15, plus any shield bonus.",
        "Danger Sense: Passive. Varka has Advantage on Dexterity saving throws unless Incapacitated.",
        "Primal Knowledge: Passive. While raging, Varka can use Strength for Acrobatics, Intimidation, Perception, Stealth, or Survival checks.",
        "Adrenaline Rush: Bonus Action. Spend 1 use to Dash and gain 2 temporary HP.",
        "Relentless Endurance: When reduced to 0 HP but not killed outright, spend 1 use to drop to 1 HP instead.",
      ]},
    ],
    actionGroups: {
      actions: [
        "Attack: Hit things with Strength. While raging, Strength melee and unarmed hits add +2 damage.",
        "Cleave: After a Greataxe hit, make the second attack if another enemy is within 5 feet.",
        "Push: Greatclub hit can push a Large or smaller target up to 10 feet.",
        "Enhanced Unarmed Strike: +5 to hit, 1d4 + 3 bludgeoning.",
      ],
      bonus: [
        "Rage: Spend 1 use to start Rage.",
        "Adrenaline Rush: Spend 1 use to Dash and gain 2 temporary HP.",
      ],
      reactions: ["Opportunity Attack: When a creature you can see leaves your reach, make one melee attack."],
    },
  },
};

function parsePhase2Configs() {
  if (!fs.existsSync(PHASE2_CONTENT)) return {};
  const md = fs.readFileSync(PHASE2_CONTENT, "utf8");
  const configs = {};
  const headings = [...md.matchAll(/^##\s+(.+?)\s*$/gm)];
  for (let i = 0; i < headings.length; i++) {
    const match = headings[i];
    const characterKey = cleanText(match[1]);
    const body = md.slice(match.index + match[0].length, headings[i + 1]?.index ?? md.length);
    const sourceNumber = body.match(/Source:\s*benmitchell1979_(\d+)\.pdf/i)?.[1] || "";
    const source = `${characterKey}.md`;
    const resourceBlock = body.match(/### Doubled resource list[\s\S]*?(?=### Condensed feature)/i)?.[0] || "";
    const featureBlock = body.match(/### Condensed feature and feat summaries([\s\S]*)$/i)?.[1] || "";
    const spellLine = resourceBlock.match(/Spellcasting:\s*([^,]+),\s*([^,]+),\s*Spell Save DC\s*(\d+),\s*Spell Attack\s*([+-]\d+)/i);
    const cfg = {
      source,
      number: sourceNumber,
      spellSaveDc: spellLine?.[3] || "",
      spellAttack: spellLine?.[4] || "",
      slots: [],
      resources: [],
      featureGroups: parseFeatureGroups(featureBlock),
    };

    for (const rawLine of resourceBlock.split(/\r?\n/)) {
      const line = cleanText(rawLine.replace(/^-\s*/, ""));
      if (!line || /^###/.test(line)) continue;
      const pact = line.match(/^Level\s+(\d+)\s+Pact Magic slots:.*?doubled\s+(\d+),\s*boxes/i);
      const slots = line.match(/^Level\s+(\d+)\s+spell slots:.*?doubled\s+(\d+),\s*boxes/i);
      if (pact) {
        cfg.slots.push({ label: `Level ${pact[1]} Pact`, count: Number(pact[2]) });
        continue;
      }
      if (slots) {
        cfg.slots.push({ label: `Level ${slots[1]}`, count: Number(slots[2]) });
        continue;
      }
      if (/^Spellcasting:/i.test(line) || /No spell slots/i.test(line) || /Spell quick-list/i.test(line) || /Spell save noted/i.test(line)) continue;
      if (/no doubled tracker|not a rest resource|do not double|not a page-3 combat tracker|not print a tracker|not a useful no-rest tracker/i.test(line)) continue;
      const res = line.match(/^(.+?):.*?doubled\s+(\d+)(?:\s+\w+)?\s*,\s*(circles|printed number plus dry-erase[^.]*)/i);
      if (!res) continue;
      const count = Number(res[2]);
      const tracker = res[3].toLowerCase().includes("printed") || count > 12 ? "pool" : "circles";
      cfg.resources.push({
        label: shortenResourceLabel(res[1]),
        count,
        tracker,
        unit: resourceUnit(res[1]),
      });
    }
    configs[slugify(characterKey)] = cfg;
  }
  return configs;
}

function parseFeatureGroups(featureBlock) {
  const groups = [];
  let current = null;
  for (const raw of featureBlock.split(/\r?\n/)) {
    const heading = raw.match(/^####\s+(.+)/);
    if (heading) {
      current = { title: cleanText(heading[1]), items: [] };
      groups.push(current);
      continue;
    }
    const item = raw.match(/^-\s+(.+)/);
    if (item && current) current.items.push(cleanText(item[1]));
  }
  return groups;
}

function shortenResourceLabel(label) {
  return cleanText(label)
    .replace(/, including.*$/i, "")
    .replace(/^Magic Initiate,\s*[^,]+,\s*/i, "")
    .replace(/^Drow (?:Magic|Lineage),\s*/i, "")
    .replace(/^Infernal Legacy,\s*/i, "")
    .replace(/^Familiar Friend,\s*/i, "")
    .replace(/^Wood Elf\s*/i, "Wood Elf ")
    .replace(/\s+from\s+.+$/i, "")
    .replace(/\s+healing pool$/i, "")
    .replace(/\s+recovered slot levels$/i, "")
    .replace(/\s+free use$/i, " free use")
    .replace(/\s+free casts?$/i, " free cast");
}

function resourceUnit(label) {
  if (/Lay On Hands/i.test(label)) return "HP";
  if (/Arcane Recovery/i.test(label)) return "slot levels";
  return "uses";
}

function buildActionGroups(c, cfg) {
  if (cfg.actionGroups) return cfg.actionGroups;
  const actions = ["Attack or Magic: Use a listed weapon, cantrip, spell, or class option."];
  const bonus = [];
  const reactions = ["Opportunity Attack: When a creature you can see leaves your reach, make one melee attack."];
  const allItems = cfg.featureGroups.flatMap((g) => g.items);
  for (const item of allItems) {
    if (/\bReaction\b/i.test(item)) reactions.push(item);
    else if (/\bBonus Action\b/i.test(item)) bonus.push(item);
    else if (/\b(Magic Action|Utilize Action|Action\.|Replace one attack|1 Minute)\b/i.test(item)) actions.push(item);
    else if (/\bSpecial\b/i.test(item) && actions.length < 5) actions.push(item);
  }
  actions.push("Dash, Disengage, Dodge, Help, Hide, Ready, Search, Study, Influence, Utilize.");
  if (!bonus.length) bonus.push("Use this space for class features that say Bonus Action, if any are granted by loot or spells.");
  return {
    actions: uniqueClean(actions).slice(0, 6),
    bonus: uniqueClean(bonus).slice(0, 6),
    reactions: uniqueClean(reactions).slice(0, 5),
  };
}

function uniqueClean(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const clean = cleanText(item);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
  }
  return out;
}

function rosterOrder() {
  if (!fs.existsSync(ROSTER_README)) return [];
  const md = fs.readFileSync(ROSTER_README, "utf8");
  return [...md.matchAll(/\((\.\/)?([^)\s]+\.md)\)/g)].map((m) => slugify(path.basename(m[2], ".md")));
}

const SPELL_EFFECTS = {
  "Blade Ward": "Protect yourself with warding magic.",
  "Fire Bolt": "Ranged fire attack.",
  "Create Bonfire": "Fill a 5-foot cube with fire. Dex save.",
  "Sorcerous Burst": "Ranged spell attack with chosen damage type.",
  "Shocking Grasp": "Melee lightning attack. Target cannot take reactions on hit.",
  "Acid Splash": "Acid bursts in a small area. Dex save.",
  "Moment to Think": "Quick mental reset from the Cleric initiate feat.",
  "Sacred Flame": "Radiant flame. Dex save, ignores cover.",
  "Chaos Bolt": "Ranged spell attack with unstable damage.",
  "Catapult": "Throw an object in a line. Dex save.",
  "Grease": "Make a 10-foot square slippery. Dex save.",
  "Witch Bolt": "Lightning link. Spell attack, concentration.",
  "Detect Magic": "Sense magic within 30 feet while concentrating.",
  "Guiding Bolt": "Radiant attack. Next attack against target has Advantage.",
  "Vortex Warp": "Move a creature you can see. Con save.",
  "Misty Step": "Bonus Action teleport.",
};

function slugify(s) {
  return String(s || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cleanText(s) {
  return String(s || "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/\s+/g, " ")
    .trim();
}

function xml(s) {
  return cleanText(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function wrap(text, maxChars) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textEl(x, y, txt, opts = {}) {
  const { size = 32, weight = "400", fill = "#111827", anchor = "start", style = "", family = "Arial, Helvetica, sans-serif" } = opts;
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${style ? ` ${style}` : ""}>${xml(txt)}</text>`;
}

function lineText(x, y, txt, maxWidth, opts = {}) {
  const size = opts.size || 32;
  const maxChars = Math.max(8, Math.floor(maxWidth / (size * 0.52)));
  const lines = wrap(txt, maxChars);
  const lh = opts.lh || Math.round(size * 1.22);
  return {
    svg: lines.map((l, i) => textEl(x, y + i * lh, l, opts)).join(""),
    height: Math.max(lh, lines.length * lh),
    lines: lines.length,
  };
}

function panel(x, y, w, h, title = "") {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="#ffffff" stroke="#111827" stroke-width="4"/>`;
  if (title) {
    s += `<rect x="${x}" y="${y}" width="${w}" height="62" rx="24" fill="#111827"/>`;
    s += `<rect x="${x}" y="${y + 38}" width="${w}" height="28" fill="#111827"/>`;
    s += textEl(x + 24, y + 42, title.toUpperCase(), { size: 28, weight: "700", fill: "#ffffff" });
  }
  return s;
}

function circleRow(x, y, count, r = 15, gap = 14) {
  let s = "";
  for (let i = 0; i < count; i++) {
    s += `<circle cx="${x + i * (r * 2 + gap) + r}" cy="${y + r}" r="${r}" fill="#ffffff" stroke="#111827" stroke-width="4"/>`;
  }
  return s;
}

function boxRow(x, y, count, size = 34, gap = 12) {
  let s = "";
  for (let i = 0; i < count; i++) {
    s += `<rect x="${x + i * (size + gap)}" y="${y}" width="${size}" height="${size}" rx="5" fill="#ffffff" stroke="#111827" stroke-width="4"/>`;
  }
  return s;
}

function parseCharacter(fileName) {
  const md = fs.readFileSync(path.join(SRC_DIR, fileName), "utf8");
  const name = md.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(fileName, ".md");
  const subtitle = md.match(/^\*([^*]+)\*/m)?.[1] || "";
  const [species = "", classLevel = "", background = ""] = subtitle.split("·").map((s) => cleanText(s));
  const sourceNumber = md.match(/Source:\s*benmitchell1979_(\d+)\.pdf/i)?.[1] || "";
  const abilityLine = section(md, "Ability Scores").split(/\r?\n/).find((l) => /\d+\s*\([+-]\d+\)/.test(l)) || "";
  const abilityRow = abilityLine.split("|").slice(1, -1).map((s) => s.trim());
  const abilities = {};
  ABILS.forEach((a, i) => {
    const m = (abilityRow[i] || "").match(/(\d+)\s*\(([+-]\d+)\)/);
    abilities[a] = { score: m?.[1] || "", mod: m?.[2] || "" };
  });
  const ac = md.match(/\*\*AC\*\*\s*(\d+)/)?.[1] || "";
  const initiative = md.match(/\*\*Initiative\*\*\s*([+-]\d+)/)?.[1] || "";
  const speed = md.match(/\*\*Speed\*\*\s*([^|\n]+)/)?.[1]?.trim() || "";
  const prof = md.match(/\*\*Proficiency Bonus\*\*\s*([+-]\d+)/)?.[1] || "";
  const maxHp = md.match(/\*\*Max HP\*\*\s*(\d+)/)?.[1] || "";
  const hitDice = md.match(/\*\*Hit Dice\*\*\s*([^\n]+)/)?.[1]?.trim() || "";
  const passive = md.match(/\*\*Passive\*\*\s*([^\n]+)/)?.[1]?.trim() || "";
  const senses = md.match(/\*\*Senses\*\*\s*([^\n]+)/)?.[1]?.trim() || "";
  const saveLine = section(md, "Saving Throws").split(/\r?\n/).find((l) => l.trim()) || "";
  const saves = {};
  for (const part of saveLine.split(/,\s*/)) {
    const m = part.match(/^(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+([+-]\d+)(?:\s+\(proficient\))?/);
    if (m) saves[m[1]] = { mod: m[2], proficient: /proficient/.test(part) };
  }
  const skillLine = section(md, "Skills").split(/\r?\n/).find((l) => l.trim()) || "";
  const skills = {};
  for (const part of skillLine.split(/,\s*/)) {
    const m = part.match(/^(.+?)\s+([+-]\d+)\s+\((STR|DEX|CON|INT|WIS|CHA)\)(?:\s+\(proficient\))?/);
    if (m) skills[m[1]] = { mod: m[2], ability: m[3], proficient: /proficient/.test(part) };
  }
  const attacks = section(md, "Weapon Attacks & Cantrips").split(/\r?\n/).map((l) => {
    const m = l.match(/^-\s+\*\*(.+?)\*\*\s+[\u2013\u2014-]\s+(.+)$/);
    return m ? { name: cleanText(m[1]), detail: cleanText(m[2]) } : null;
  }).filter(Boolean);
  const spellcasting = parseSpellcasting(md);
  return { name, species, classLevel, background, sourceNumber, abilities, ac, initiative, speed, prof, maxHp, hitDice, passive, senses, saves, skills, attacks, spellcasting };
}

function section(md, heading) {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return "";
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ") || lines[i].startsWith("---")) break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}

function parseSpellcasting(md) {
  const sc = section(md, "Spellcasting");
  if (!sc) return null;
  const header = sc.match(/\*\*Class\*\*\s*(.+?)\s*·\s*\*\*Ability\*\*\s*(.+?)\s*·\s*\*\*Save DC\*\*\s*(\d+)\s*·\s*\*\*Attack\*\*\s*([+-]\d+)/);
  const spells = [];
  for (const line of sc.split(/\r?\n/)) {
    const m = line.match(/^-\s+\*\*(.+?)\*\*\s+_(.+?)_\s+[\u2013\u2014-]\s+(.+)$/);
    if (!m) continue;
    const chunks = m[3].split(";").map((s) => cleanText(s));
    spells.push({
      name: cleanText(m[1]),
      source: cleanText(m[2]),
      action: chunks[0] || "",
      range: chunks[1] || "",
      test: chunks.find((c) => /^save\/atk/i.test(c))?.replace(/^save\/atk\s*/i, "") || "",
      effect: SPELL_EFFECTS[cleanText(m[1])] || "See spell card or PHB if the table needs exact text.",
    });
  }
  return header ? { className: cleanText(header[1]), ability: cleanText(header[2]), saveDc: header[3], attack: header[4], spells } : { spells };
}

function basePage(title, subtitle = "") {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<rect width="${W}" height="${H}" fill="#f6f7f9"/>`;
  s += `<rect x="0" y="0" width="${W}" height="24" fill="#111827"/>`;
  s += textEl(60, 78, title, { size: 42, weight: "700", fill: "#111827" });
  if (subtitle) s += textEl(W - 60, 78, subtitle, { size: 24, weight: "600", fill: "#4b5563", anchor: "end" });
  return s;
}

function renderHeader(c) {
  let s = panel(60, 112, 1628, 130);
  s += textEl(92, 178, c.name, { size: 64, weight: "800" });
  s += textEl(94, 220, `${c.species} | ${c.classLevel} | ${c.background}`, { size: 30, weight: "600", fill: "#374151" });
  s += textEl(1660, 154, `D&D Beyond #${c.sourceNumber}`, { size: 24, weight: "700", fill: "#4b5563", anchor: "end" });
  return s;
}

function renderPage1(c) {
  let s = basePage("Page 1 - Core", "New player sheet");
  s += renderHeader(c);

  s += panel(60, 275, 780, 400, "HP and survival");
  s += textEl(95, 380, `Max HP ${c.maxHp}`, { size: 42, weight: "800" });
  s += textEl(94, 445, "Current HP", { size: 28, weight: "700", fill: "#374151" });
  s += `<rect x="92" y="468" width="250" height="126" rx="18" fill="#fff" stroke="#111827" stroke-width="5"/>`;
  s += textEl(392, 445, "Temp HP", { size: 28, weight: "700", fill: "#374151" });
  s += `<rect x="390" y="468" width="180" height="126" rx="18" fill="#fff" stroke="#111827" stroke-width="5"/>`;
  s += textEl(606, 445, "Hit Dice", { size: 28, weight: "700", fill: "#374151" });
  s += textEl(606, 505, c.hitDice, { size: 34, weight: "800" });
  s += `<rect x="716" y="470" width="70" height="70" rx="10" fill="#fff" stroke="#111827" stroke-width="5"/>`;
  s += textEl(95, 642, "Death Saves", { size: 30, weight: "800" });
  s += textEl(300, 642, "Successes", { size: 25, weight: "700", fill: "#374151" });
  s += circleRow(430, 613, 3, 18, 18);
  s += textEl(585, 642, "Failures", { size: 25, weight: "700", fill: "#374151" });
  s += circleRow(695, 613, 3, 18, 18);

  s += panel(880, 275, 808, 400, "Abilities");
  const bw = 238, bh = 126, bx = 915, by = 352;
  ABILS.forEach((a, i) => {
    const x = bx + (i % 3) * 250;
    const y = by + Math.floor(i / 3) * 145;
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="18" fill="#ffffff" stroke="#111827" stroke-width="4"/>`;
    s += textEl(x + 18, y + 38, ABR[a], { size: 27, weight: "900", fill: "#4b5563" });
    s += textEl(x + 118, y + 88, c.abilities[a]?.mod || "", { size: 58, weight: "900", anchor: "middle" });
    s += textEl(x + bw - 18, y + 38, c.abilities[a]?.score || "", { size: 28, weight: "800", anchor: "end", fill: "#374151" });
  });

  s += panel(60, 705, 1628, 190, "Core stats");
  const stats = [["AC", c.ac], ["Initiative", c.initiative], ["Speed", c.speed.replace(" (Walking)", "")], ["Prof", c.prof], ["Passive Perception", (c.passive.match(/Perception\s+\d+/)?.[0] || c.passive)], ["Senses", c.senses || "Normal"]];
  stats.forEach(([label, value], i) => {
    const x = 92 + i * 260;
    s += textEl(x, 790, label, { size: 24, weight: "800", fill: "#4b5563" });
    s += textEl(x, 850, value, { size: i >= 4 ? 28 : 42, weight: "900" });
  });

  s += panel(60, 925, 780, 520, "Saving throws");
  ABILS.forEach((a, i) => {
    const y = 1024 + i * 58;
    const save = c.saves[a] || { mod: c.abilities[a]?.mod || "+0", proficient: false };
    s += save.proficient ? `<circle cx="100" cy="${y - 11}" r="13" fill="#111827"/>` : `<circle cx="100" cy="${y - 11}" r="13" fill="#fff" stroke="#111827" stroke-width="4"/>`;
    s += textEl(132, y, `${ABR[a]} ${save.mod}`, { size: 32, weight: "800" });
    s += textEl(265, y, a, { size: 28, weight: "600", fill: "#374151" });
  });
  s += lineText(95, 1398, EXPLAINERS.save, 700, { size: 24, weight: "600", fill: "#4b5563" }).svg;

  s += panel(880, 925, 808, 520, "Attacks and cantrips");
  c.attacks.forEach((atk, i) => {
    const y = 1015 + i * 72;
    s += textEl(920, y, atk.name, { size: 31, weight: "900" });
    s += textEl(920, y + 36, atk.detail, { size: 25, weight: "600", fill: "#374151" });
  });

  s += panel(60, 1480, 1628, 350, "Conditions tracker");
  s += textEl(95, 1566, "Write conditions, concentration, marks, or special effects here.", { size: 28, weight: "600", fill: "#374151" });
  for (let i = 0; i < 4; i++) s += `<line x1="95" y1="${1624 + i * 54}" x2="1650" y2="${1624 + i * 54}" stroke="#9ca3af" stroke-width="3"/>`;

  s += panel(60, 1865, 1628, 545, "Quick reminders");
  let ey = 1955;
  for (const t of [EXPLAINERS.ability, EXPLAINERS.death]) {
    const block = lineText(95, ey, t, 1540, { size: 30, weight: "700", fill: "#111827", lh: 40 });
    s += block.svg;
    ey += block.height + 38;
  }
  s += `</svg>`;
  return s;
}

function renderPage2(c, cfg) {
  let s = basePage("Page 2 - Skills and features", "Dots mean proficient");
  s += panel(60, 130, 720, 2200, "Skills");
  let y = 225;
  for (const name of SKILL_ORDER) {
    const sk = c.skills[name] || { mod: "+0", ability: "", proficient: false };
    s += sk.proficient ? `<circle cx="100" cy="${y - 12}" r="13" fill="#111827"/>` : `<circle cx="100" cy="${y - 12}" r="13" fill="#fff" stroke="#111827" stroke-width="4"/>`;
    s += textEl(132, y, sk.mod, { size: 30, weight: "900" });
    s += textEl(210, y, name, { size: 27, weight: "700" });
    s += textEl(720, y, sk.ability, { size: 23, weight: "700", fill: "#6b7280", anchor: "end" });
    y += 61;
  }
  s += `<line x1="95" y1="${y + 18}" x2="745" y2="${y + 18}" stroke="#d1d5db" stroke-width="3"/>`;
  s += lineText(95, y + 75, EXPLAINERS.skill, 640, { size: 29, weight: "700", fill: "#111827", lh: 38 }).svg;
  s += lineText(95, y + 185, "Proficiency dot: A filled dot means proficiency is already included in the number.", 640, { size: 25, weight: "600", fill: "#4b5563", lh: 34 }).svg;

  s += panel(820, 130, 868, 2200, "Features and traits");
  const content = [];
  for (const group of cfg.featureGroups) {
    content.push({ type: "heading", text: group.title });
    for (const item of group.items) content.push({ type: "bullet", text: item });
  }
  s += fittedBullets(858, 225, 790, 2030, content, 30, 23);
  s += `</svg>`;
  return s;
}

function fittedBullets(x, y, w, maxH, items, maxFont, minFont) {
  for (let size = maxFont; size >= minFont; size--) {
    const lh = Math.round(size * 1.25);
    let total = 0;
    for (const it of items) {
      if (it.type === "heading") total += lh + 18;
      else total += wrap(it.text, Math.floor((w - 35) / (size * 0.51))).length * lh + 15;
    }
    if (total <= maxH) return drawBullets(x, y, w, items, size, lh);
  }
  return drawBullets(x, y, w, items, minFont, Math.round(minFont * 1.2), maxH);
}

function drawBullets(x, y, w, items, size, lh, maxH = Infinity) {
  let s = "";
  let cy = y;
  for (const it of items) {
    if (cy - y > maxH - 40) break;
    if (it.type === "heading") {
      s += textEl(x, cy, it.text, { size: size + 2, weight: "900", fill: "#111827" });
      cy += lh + 14;
      continue;
    }
    const lines = wrap(it.text, Math.floor((w - 40) / (size * 0.51)));
    s += textEl(x, cy, "•", { size, weight: "900" });
    lines.forEach((line, i) => {
      s += textEl(x + 32, cy + i * lh, line, { size, weight: "600", fill: "#1f2937" });
    });
    cy += lines.length * lh + 14;
  }
  return s;
}

function renderPage3(c, cfg) {
  let s = basePage("Page 3 - Actions and tracking", cfg.slots.length ? "Spells and resources" : "Resources and notes");
  s += panel(60, 130, 1628, 160, "Turn reminder");
  s += lineText(95, 218, EXPLAINERS.action, 1540, { size: 31, weight: "800", fill: "#111827", lh: 40 }).svg;

  const boxes = [
    [60, 325, 520, 500, "Actions", cfg.actionGroups.actions],
    [614, 325, 520, 500, "Bonus actions", cfg.actionGroups.bonus],
    [1168, 325, 520, 500, "Reactions", cfg.actionGroups.reactions],
  ];
  for (const [x, y, w, h, title, items] of boxes) {
    s += panel(x, y, w, h, title);
    s += fittedBullets(x + 28, y + 92, w - 56, h - 120, items.map((text) => ({ type: "bullet", text })), 25, 20);
  }

  if (cfg.slots.length) {
    s += panel(60, 865, 760, 500, "Spell slots");
    s += textEl(95, 955, `Save DC ${cfg.spellSaveDc} | Spell Attack ${cfg.spellAttack}`, { size: 32, weight: "900" });
    s += textEl(95, 1002, "Doubled - no rest", { size: 24, weight: "800", fill: "#6b7280" });
    let sy = 1070;
    for (const row of cfg.slots) {
      const slotBoxX = row.label.length > 8 ? 335 : 250;
      s += textEl(95, sy + 28, row.label, { size: row.label.length > 8 ? 26 : 30, weight: "900" });
      s += boxRow(slotBoxX, sy - 2, row.count, 34, 12);
      sy += 78;
    }
    s += lineText(95, 1220, EXPLAINERS.slots, 680, { size: 23, weight: "700", fill: "#374151", lh: 31 }).svg;

    s += panel(860, 865, 828, 500, "Per-rest resources");
    s += textEl(895, 955, "Doubled for this one-shot (no rest)", { size: 26, weight: "900", fill: "#374151" });
    const resourceEnd = drawResources(895, 1018, cfg.resources, 750, 30);
    s += resourceEnd.svg;
    if (/Rogue/i.test(c.classLevel)) {
      s += textEl(895, Math.max(resourceEnd.nextY + 18, 1160), "Notes and tracking", { size: 24, weight: "900", fill: "#374151" });
      for (let i = 0; i < 4; i++) s += `<line x1="895" y1="${Math.max(resourceEnd.nextY + 56, 1200) + i * 45}" x2="1650" y2="${Math.max(resourceEnd.nextY + 56, 1200) + i * 45}" stroke="#9ca3af" stroke-width="3"/>`;
    }

    s += panel(60, 1415, 1628, 930, "Spell quick-list");
    s += renderSpellList(c, 95, 1505, 1560, 760);
  } else {
    s += panel(60, 865, 760, 420, "Per-rest resources");
    s += textEl(95, 955, "Doubled for this one-shot (no rest)", { size: 28, weight: "900", fill: "#374151" });
    s += drawResources(95, 1030, cfg.resources, 690, 34).svg;

    s += panel(860, 865, 828, 760, "Notes and tracking");
    s += textEl(895, 955, "Use this area for conditions, targets, loot notes, or class state.", { size: 25, weight: "700", fill: "#374151" });
    for (let i = 0; i < 10; i++) s += `<line x1="895" y1="${1020 + i * 54}" x2="1650" y2="${1020 + i * 54}" stroke="#9ca3af" stroke-width="3"/>`;

    s += panel(60, 1325, 760, 520, "Combat reminders");
    const reminders = combatReminders(c, cfg).map((text) => ({ type: "bullet", text }));
    s += fittedBullets(95, 1415, 680, 410, reminders, 27, 22);

    s += panel(60, 1885, 1628, 460, "More dry-erase space");
    for (let i = 0; i < 6; i++) s += `<line x1="95" y1="${1975 + i * 55}" x2="1650" y2="${1975 + i * 55}" stroke="#9ca3af" stroke-width="3"/>`;
  }

  s += `</svg>`;
  return s;
}

function combatReminders(c, cfg) {
  if (/Barbarian/i.test(c.classLevel)) {
    return [
      "While raging, add +2 damage to Strength melee and unarmed hits.",
      "Reckless Attack gives Advantage on your Strength attacks, but enemies have Advantage against you until your next turn.",
      "Danger Sense gives Advantage on Dexterity saves unless you are Incapacitated.",
      "At 0 HP, use Relentless Endurance if it applies, then track death saves only if you still fall.",
    ];
  }
  const candidates = cfg.featureGroups.flatMap((g) => g.items).filter((item) => {
    return /\b(Action|Bonus Action|Reaction|Special|Passive|Spend|once per turn)\b/i.test(item);
  });
  return uniqueClean(candidates).slice(0, 4);
}

function drawResources(x, y, resources, w, size = 30) {
  let s = "";
  let cy = y;
  if (!resources.length) {
    s += textEl(x, cy + 28, "No limited per-rest resource tracker.", { size: 24, weight: "800", fill: "#374151" });
    return { svg: s, nextY: cy + 64 };
  }
  for (const r of resources) {
    const trackerX = x + Math.min(390, Math.floor(w * 0.55));
    const labelSize = r.label.length > 24 ? 21 : 26;
    const label = lineText(x, cy + 24, r.label, trackerX - x - 56, { size: labelSize, weight: "900", fill: "#111827", lh: 27 });
    s += label.svg;
    if (r.tracker === "pool" || r.count > 12) {
      s += textEl(trackerX, cy + 27, `${r.count} ${r.unit || "uses"}`, { size: 24, weight: "900" });
      s += textEl(trackerX + 260, cy - 10, "remaining", { size: 17, weight: "800", fill: "#4b5563" });
      s += `<rect x="${trackerX + 260}" y="${cy + 2}" width="92" height="42" rx="8" fill="#fff" stroke="#111827" stroke-width="4"/>`;
    } else {
      s += circleRow(trackerX, cy, r.count, Math.floor(size / 2), 13);
    }
    cy += Math.max(64, label.height + 22);
  }
  return { svg: s, nextY: cy };
}

function renderSpellList(c, x, y, w, h) {
  const spells = (c.spellcasting?.spells || []).filter((sp, idx, arr) => arr.findIndex((x) => x.name === sp.name) === idx);
  const compact = spells.length > 14;
  const rows = spells.map((sp) => {
    const effect = compact && sp.effect.startsWith("See spell card") ? "" : ` ${sp.effect}`;
    return `${sp.name}: ${sp.action}; ${sp.range}${sp.test ? `; ${sp.test}` : ""}.${effect}`;
  });
  if (!compact) return fittedBullets(x, y, w, h, rows.map((text) => ({ type: "bullet", text })), 27, 20);

  const colGap = 34;
  const colW = Math.floor((w - colGap) / 2);
  for (let size = 21; size >= 17; size--) {
    const lh = Math.round(size * 1.18);
    const heights = [0, 0];
    for (let i = 0; i < rows.length; i++) {
      const lines = wrap(rows[i], Math.floor((colW - 28) / (size * 0.5))).length;
      heights[i % 2] += Math.max(lh, lines * lh) + 8;
    }
    if (Math.max(...heights) <= h) return drawTwoColumnSpellList(x, y, colW, colGap, rows, size, lh);
  }
  return drawTwoColumnSpellList(x, y, colW, colGap, rows, 17, 20, h);
}

function drawTwoColumnSpellList(x, y, colW, colGap, rows, size, lh, maxH = Infinity) {
  let s = "";
  const cy = [y, y];
  for (let i = 0; i < rows.length; i++) {
    const col = i % 2;
    const tx = x + col * (colW + colGap);
    if (cy[col] - y > maxH - 28) break;
    const lines = wrap(rows[i], Math.floor((colW - 28) / (size * 0.5)));
    s += textEl(tx, cy[col], "•", { size, weight: "900" });
    lines.forEach((line, j) => {
      s += textEl(tx + 24, cy[col] + j * lh, line, { size, weight: "600", fill: "#1f2937" });
    });
    cy[col] += Math.max(lh, lines.length * lh) + 8;
  }
  return s;
}

async function renderCharacter(c, cfg) {
  const safeName = path.basename(cfg.source, ".md");
  const pageSvgs = [renderPage1(c), renderPage2(c, cfg), renderPage3(c, cfg)];
  const pngs = [];
  for (let i = 0; i < pageSvgs.length; i++) {
    const fullPng = await sharp(Buffer.from(pageSvgs[i])).png().toBuffer();
    pngs.push(fullPng);
    if (i === 2 && SPOT_PREVIEWS.has(slugify(safeName))) {
      await sharp(fullPng).resize({ width: 874 }).png().toFile(path.join(PREVIEW_DIR, `${safeName}-p3.png`));
    }
  }
  const pdf = await PDFDocument.create();
  for (const png of pngs) {
    const page = pdf.addPage([PDF_W, PDF_H]);
    const img = await pdf.embedPng(png);
    page.drawImage(img, { x: 0, y: 0, width: PDF_W, height: PDF_H });
  }
  const pdfPath = path.join(OUT_DIR, `${safeName}_${cfg.number || c.sourceNumber}.pdf`);
  fs.writeFileSync(pdfPath, await pdf.save());
  return pdfPath;
}

async function buildBooklet(pdfPaths) {
  const booklet = await PDFDocument.create();
  for (const pdfPath of pdfPaths) {
    const src = await PDFDocument.load(fs.readFileSync(pdfPath));
    const copied = await booklet.copyPages(src, src.getPageIndices());
    for (const page of copied) booklet.addPage(page);
  }
  const out = path.join(OUT_DIR, "all-characters-a5.pdf");
  fs.writeFileSync(out, await booklet.save());
  return out;
}

function selectConfigs() {
  const only = (process.env.ONLY || "").split(",").map((s) => slugify(s)).filter(Boolean);
  const allConfigs = { ...CONFIG, ...parsePhase2Configs() };
  const order = rosterOrder();
  let entries = Object.entries(allConfigs).sort((a, b) => {
    const ai = order.indexOf(slugify(a[1].source.replace(/\.md$/i, "")));
    const bi = order.indexOf(slugify(b[1].source.replace(/\.md$/i, "")));
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    return a[1].source.localeCompare(b[1].source);
  });
  if (only.length) {
    entries = entries.filter(([slug, cfg]) => {
      const keys = [slug, slugify(cfg.source.replace(/\.md$/i, "")), slugify(cfg.number)];
      return only.some((token) => keys.some((key) => key === token || key.includes(token) || token.includes(key)));
    });
  }
  return entries;
}

const selected = selectConfigs();
if (!selected.length) {
  console.error("No matching characters. Use ONLY=Eldric_Vaelthorn, ONLY=Varka_Stonefist, or a comma-separated subset.");
  process.exit(1);
}

const rendered = [];
for (const [slug, cfg] of selected) {
  const c = parseCharacter(cfg.source);
  cfg.spellSaveDc ||= c.spellcasting?.saveDc || "";
  cfg.spellAttack ||= c.spellcasting?.attack || "";
  cfg.actionGroups = buildActionGroups(c, cfg);
  const out = await renderCharacter(c, cfg);
  rendered.push(out);
  console.log(`rendered ${slug}: ${path.relative(repoRoot, out)}`);
}
if (!process.env.ONLY) {
  const booklet = await buildBooklet(rendered);
  console.log(`booklet: ${path.relative(repoRoot, booklet)}`);
}
console.log(`previews: ${path.relative(repoRoot, PREVIEW_DIR)}`);
