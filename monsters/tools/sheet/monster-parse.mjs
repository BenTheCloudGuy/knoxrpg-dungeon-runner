import fs from "fs";
import path from "path";

export const MONSTER_SLUGS = [
  "ashari-fire-elemental",
  "baron-kepmak",
  "berhan-voss",
  "bombardier-goblin",
  "caster-goblin",
  "cinderslag-elemental",
  "constrictor-snake",
  "demonfeed-spider",
  "drider-priestess",
  "dwarven-iron-golem",
  "feywild-guard",
  "flying-goblin",
  "giant-slime",
  "giant-spider",
  "goblin-artificer",
  "goblin-dog",
  "goblin-shaman",
  "goblin-warrior",
  "green-slaad",
  "hob-gob",
  "lizard-mage",
  "lizard-shaman",
  "lizardfolk-fighter",
  "magma-elemental",
  "magma-landshark",
  "sahuagin-baron",
  "skeleton",
  "statue",
  "vos-sykriss",
  "wraith",
  "zombie"
];

export function cleanText(value = "") {
  return String(value)
    .replace(/\r/g, "")
    .replace(/[\u2013\u2014]/g, ",")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\u00a0/g, " ")
    .trim();
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function safeFileName(value) {
  return cleanText(value).replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, " ").trim();
}

function stripMdInline(value = "") {
  return cleanText(value)
    .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function parseMeta(raw) {
  const meta = {};
  const re = /^\*\*(Armor Class|Hit Points|Speed|Saving Throws|Skills|Damage Vulnerabilities|Damage Resistances|Damage Immunities|Condition Immunities|Senses|Languages|Challenge)\*\*\s*(.+)$/gm;
  let m;
  while ((m = re.exec(raw))) meta[m[1]] = cleanText(m[2]);
  const challenge = meta.Challenge || "";
  const pb = challenge.match(/\*\*Proficiency Bonus\*\*\s*([+\-]\d+)/i);
  if (pb) meta["Proficiency Bonus"] = pb[1];
  meta.Challenge = stripMdInline(challenge.replace(/,\s*\*\*Proficiency Bonus\*\*\s*[+\-]\d+/i, ""));
  return meta;
}

function parseAbilities(raw) {
  const names = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  const blank = names.map((name) => ({ name, score: "", mod: "" }));
  const lines = raw.split("\n");
  const headerIdx = lines.findIndex((line) =>
    /\|\s*STR\s*\|\s*DEX\s*\|\s*CON\s*\|\s*INT\s*\|\s*WIS\s*\|\s*CHA\s*\|/i.test(line)
  );
  if (headerIdx === -1) return blank;
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("|")) break;
    if (/^[\s|:\-]+$/.test(line)) continue; // markdown separator row
    if (!/\d/.test(line)) continue;
    const cells = line.split("|").map((cell) => cell.trim());
    cells.shift();
    if (cells[cells.length - 1] === "") cells.pop();
    if (cells.length < 6) continue;
    return names.map((name, index) => {
      const cell = cells[index] || "";
      const hit = cell.match(/(-?\d+)\s*\(\s*([+\-]?\d+)\s*\)/);
      let mod = hit?.[2] || "";
      if (mod && !/^[+\-]/.test(mod)) mod = (Number(mod) >= 0 ? "+" : "") + mod;
      return { name, score: hit?.[1] || cell, mod };
    });
  }
  return blank;
}

function splitSections(raw) {
  const out = {};
  const re = /^###\s+(.+?)\s*$/gm;
  const matches = [...raw.matchAll(re)];
  for (let i = 0; i < matches.length; i++) {
    const name = cleanText(matches[i][1]);
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    out[name] = cleanText(raw.slice(start, end));
  }
  return out;
}

function parseEntries(sectionText = "") {
  const text = cleanText(sectionText);
  if (!text || /^None\.$/i.test(text)) return [];
  const re = /\*\*\*(.+?)\.\*\*\*\s*/g;
  const hits = [...text.matchAll(re)];
  if (!hits.length) return [{ name: "", body: text }];
  return hits.map((hit, index) => {
    const start = hit.index + hit[0].length;
    const end = index + 1 < hits.length ? hits[index + 1].index : text.length;
    return { name: cleanText(hit[1]), body: cleanText(text.slice(start, end)) };
  });
}

function parseAudit(root) {
  const auditPath = path.join(root, "monsters", "AUDIT.md");
  if (!fs.existsSync(auditPath)) return {};
  const audit = fs.readFileSync(auditPath, "utf8");
  const rows = audit.split("\n").filter((line) => /^\|[^-].+\|$/.test(line));
  const map = {};
  for (const row of rows.slice(2)) {
    const cells = row.split("|").slice(1, -1).map((x) => cleanText(stripMdInline(x)));
    if (cells.length < 4) continue;
    const source = cells[1].match(/`([^`]+)`/)?.[1] || cells[1].replace(/`/g, "");
    const slug = source.replace(/\.md$/i, "");
    if (!slug) continue;
    map[slug] = {
      sections: cells[2],
      options: cells[3],
      finding: cells[4] || ""
    };
  }
  return map;
}

export function loadMonsters(root) {
  const audit = parseAudit(root);
  return MONSTER_SLUGS.map((slug) => parseMonster(root, slug, audit[slug]));
}

export function parseMonster(root, slug, audit = null) {
  const file = path.join(root, "monsters", `${slug}.md`);
  const raw = cleanText(fs.readFileSync(file, "utf8"));
  const title = cleanText(raw.match(/^#\s+(.+)$/m)?.[1] || slug);
  const typeLine = cleanText(raw.match(/^\*(.+?)\*$/m)?.[1] || "");
  const sections = splitSections(raw);
  const traits = parseEntries(sections.Traits);
  const actions = parseEntries(sections.Actions);
  const bonusActions = parseEntries(sections["Bonus Actions"]);
  const reactions = parseEntries(sections.Reactions);
  const spellcasting = sections.Spellcasting ? cleanText(sections.Spellcasting) : "";
  return {
    slug,
    file,
    raw,
    name: title,
    typeLine,
    meta: parseMeta(raw),
    abilities: parseAbilities(raw),
    traits,
    spellcasting,
    actions,
    bonusActions,
    reactions,
    audit
  };
}

export function artPromptFor(monster) {
  const details = [
    monster.typeLine,
    monster.audit?.options ? `Important visible features or gear: ${monster.audit.options}.` : "",
    monster.traits.map((x) => `${x.name}: ${x.body}`).join(" "),
    monster.actions.map((x) => `${x.name}: ${x.body}`).join(" ")
  ].filter(Boolean).join("\n").slice(0, 2800);
  return cleanText(`Create original fantasy creature art for a tabletop monster sheet.
Monster: ${monster.name}.
Use only these source details from the local monster file:
${details}
Make a new creature portrait or full-body illustration with parchment-friendly contrast, no text, no lettering, no logo, no watermark, and no recognizable published character or sourcebook art. Keep the pose readable for a printed game aid.`);
}
