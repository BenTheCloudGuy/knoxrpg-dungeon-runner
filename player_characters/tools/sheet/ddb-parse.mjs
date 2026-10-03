// Normalize a D&D Beyond character-service v5 JSON into the model the A5 sheet needs.
// All final numbers are computed from D&D Beyond data (base stats + modifiers),
// which is the fix for the earlier garbled-extraction problem.

const ABIL = { 1: "STR", 2: "DEX", 3: "CON", 4: "INT", 5: "WIS", 6: "CHA" };
const ABIL_NAME = {
  STR: "Strength", DEX: "Dexterity", CON: "Constitution",
  INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};

// 18 standard skills: slug -> {label, ability}
const SKILLS = [
  ["acrobatics", "Acrobatics", "DEX"],
  ["animal-handling", "Animal Handling", "WIS"],
  ["arcana", "Arcana", "INT"],
  ["athletics", "Athletics", "STR"],
  ["deception", "Deception", "CHA"],
  ["history", "History", "INT"],
  ["insight", "Insight", "WIS"],
  ["intimidation", "Intimidation", "CHA"],
  ["investigation", "Investigation", "INT"],
  ["medicine", "Medicine", "WIS"],
  ["nature", "Nature", "INT"],
  ["perception", "Perception", "WIS"],
  ["performance", "Performance", "CHA"],
  ["persuasion", "Persuasion", "CHA"],
  ["religion", "Religion", "INT"],
  ["sleight-of-hand", "Sleight of Hand", "DEX"],
  ["stealth", "Stealth", "DEX"],
  ["survival", "Survival", "WIS"],
];

const mod = (score) => Math.floor((score - 10) / 2);
const sign = (n) => (n >= 0 ? `+${n}` : `${n}`);

function allModifiers(data) {
  const out = [];
  const groups = data.modifiers || {};
  for (const g of Object.keys(groups)) {
    for (const m of groups[g] || []) out.push({ ...m, _group: g });
  }
  return out;
}

function abilityScores(data, mods) {
  const scores = {};
  for (const s of data.stats) scores[ABIL[s.id]] = s.value || 10;
  for (const s of data.bonusStats || []) {
    if (s.value) scores[ABIL[s.id]] += s.value;
  }
  // Ability score bonuses live in modifiers (race / feat / background in 2024).
  for (const m of mods) {
    if (m.type === "bonus" && /(-score)$/.test(m.subType || "")) {
      const key = (m.subType || "").replace("-score", "");
      const abbr = Object.keys(ABIL_NAME).find((a) => ABIL_NAME[a].toLowerCase() === key);
      if (abbr) scores[abbr] += m.value ?? m.fixedValue ?? 0;
    }
  }
  // Overrides win outright.
  for (const s of data.overrideStats || []) {
    if (s.value != null) scores[ABIL[s.id]] = s.value;
  }
  return scores;
}

function hasProficiency(mods, subType) {
  return mods.some((m) => m.type === "proficiency" && m.subType === subType);
}
function hasExpertise(mods, subType) {
  return mods.some((m) => m.type === "expertise" && m.subType === subType);
}

function totalLevel(data) {
  return (data.classes || []).reduce((a, c) => a + (c.level || 0), 0);
}

function equippedArmorAC(data) {
  // Returns { base, maxDex, hasArmor, shield } from equipped inventory.
  let base = null, maxDex = Infinity, shield = 0;
  for (const it of data.inventory || []) {
    if (!it.equipped) continue;
    const d = it.definition || {};
    if (d.armorClass == null) continue;
    const t = d.armorTypeId; // 1 light, 2 medium, 3 heavy, 4 shield
    if (t === 4) { shield += d.armorClass; continue; }
    if (t === 1) { base = d.armorClass; maxDex = Infinity; }
    else if (t === 2) { base = d.armorClass; maxDex = 2; }
    else if (t === 3) { base = d.armorClass; maxDex = 0; }
  }
  return { base, maxDex, shield };
}

function computeAC(data, scores, mods) {
  const dex = mod(scores.DEX);
  const { base, maxDex, shield } = equippedArmorAC(data);
  let ac;
  if (base != null) {
    ac = base + Math.min(dex, maxDex) + shield;
  } else {
    // Unarmored. Check for Unarmored Defense style set-AC modifiers.
    let uac = 10 + dex;
    const con = mod(scores.CON), wis = mod(scores.WIS);
    const classNames = (data.classes || []).map((c) => (c.definition?.name || "").toLowerCase());
    if (classNames.includes("barbarian")) uac = Math.max(uac, 10 + dex + con);
    if (classNames.includes("monk")) uac = Math.max(uac, 10 + dex + wis);
    ac = uac + shield;
  }
  // Flat AC bonuses from items/features (e.g. Ring of Protection, Defense style).
  for (const m of mods) {
    if (m.type === "bonus" && m.subType === "armor-class" && typeof m.value === "number") {
      ac += m.value;
    }
  }
  return ac;
}

function speed(data, mods) {
  let sp = data.race?.weightSpeeds?.normal?.walk ?? 30;
  for (const m of mods) {
    if (m.type === "set" && m.subType === "innate-speed-walking" && m.value) sp = m.value;
    if (m.type === "bonus" && m.subType === "speed" && m.value) sp += m.value;
  }
  return sp;
}

// Standard multiclass full-caster slot table is embedded in each class definition
// (spellRules.levelSpellSlots). We sum per-class contributions.
function spellSlots(data) {
  const totals = new Array(9).fill(0);
  let any = false;
  for (const c of data.classes || []) {
    const table = c.definition?.spellRules?.levelSpellSlots;
    if (!table || !c.definition?.canCastSpells) continue;
    const row = table[c.level];
    if (!row) continue;
    any = true;
    for (let i = 0; i < 9; i++) totals[i] += row[i] || 0;
  }
  return any ? totals : null;
}

function spellcasting(data, scores, prof) {
  // Use the primary spellcasting class.
  const caster = (data.classes || []).find((c) => c.definition?.canCastSpells);
  if (!caster) return null;
  const abilId = caster.definition?.spellCastingAbilityId;
  const abbr = ABIL[abilId] || "CHA";
  const abilMod = mod(scores[abbr]);
  return {
    ability: abbr,
    saveDC: 8 + prof + abilMod,
    attack: prof + abilMod,
  };
}

function groupSpells(data) {
  const byLevel = {}; // level -> [{name, level, source}]
  const push = (sp, source) => {
    const def = sp.definition || {};
    const lvl = def.level ?? 0;
    const dmgMod = (def.modifiers || []).find((m) => m.type === "damage" && (m.die?.diceString || m.die?.diceValue));
    (byLevel[lvl] = byLevel[lvl] || []).push({
      name: def.name,
      level: lvl,
      school: def.school,
      source,
      castingTime: def.activation,
      range: def.range,
      concentration: def.concentration,
      ritual: def.ritual,
      duration: def.duration,
      components: def.components || [],
      componentsDescription: def.componentsDescription,
      description: def.description || "",
      requiresSavingThrow: def.requiresSavingThrow,
      requiresAttackRoll: def.requiresAttackRoll,
      attackType: def.attackType,
      saveAbility: ABIL[def.saveDcAbilityId] || null,
      damage: dmgMod ? { dice: dmgMod.die?.diceString || `${dmgMod.die?.diceCount || 1}d${dmgMod.die?.diceValue}`, type: dmgMod.subType || null } : null,
    });
  };
  for (const cs of data.classSpells || []) for (const sp of cs.spells || []) push(sp, "class");
  const grantGroups = data.spells || {};
  for (const g of Object.keys(grantGroups)) {
    for (const sp of grantGroups[g] || []) push(sp, g);
  }
  // Dedupe by name keeping first.
  for (const lvl of Object.keys(byLevel)) {
    const seen = new Set();
    byLevel[lvl] = byLevel[lvl].filter((s) => (seen.has(s.name) ? false : seen.add(s.name)));
  }
  return byLevel;
}

function featuresAtLevel(data) {
  const lvl = totalLevel(data);
  const feats = (data.feats || []).map((f) => ({
    name: f.definition?.name,
    description: f.definition?.description,
  }));
  const classFeatures = [];
  for (const c of data.classes || []) {
    for (const f of c.classFeatures || []) {
      const req = f.definition?.requiredLevel ?? 1;
      if (req <= (c.level || 0)) {
        classFeatures.push({ name: f.definition?.name, requiredLevel: req, description: f.definition?.description });
      }
    }
  }
  const metamagic = (data.options?.class || [])
    .map((o) => o.definition?.name)
    .filter(Boolean);
  return { feats, classFeatures, metamagic };
}

// Limited-use abilities (Rage, Channel Divinity, Second Wind, Focus/Ki, Bardic
// Inspiration, Lay on Hands pool, ...) derived from DDB action limitedUse blocks.
function limitedUses(data, scores) {
  const out = [];
  const seen = new Set();
  const groups = data.actions || {};
  for (const g of Object.keys(groups)) {
    for (const a of groups[g] || []) {
      const lu = a.limitedUse;
      if (!lu) continue;
      let max = lu.maxUses || 0;
      if (!max && lu.statModifierUsesId) {
        const abbr = ABIL[lu.statModifierUsesId];
        max = Math.max(1, mod(scores[abbr] ?? 10));
      }
      if (!max || max < 1) continue;
      const name = (a.name || "").replace(/\s*\(Enter\)\s*$/i, "").trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push({ name, max, reset: lu.resetType, snippet: a.snippet || "" }); // reset 1=short,2=long
    }
  }
  return out;
}

export function parseCharacter(data) {
  const mods = allModifiers(data);
  const scores = abilityScores(data, mods);
  const level = totalLevel(data);
  const prof = Math.ceil(level / 4) + 1;

  const abilities = {};
  for (const a of Object.keys(ABIL_NAME)) {
    abilities[a] = { score: scores[a], mod: mod(scores[a]), modText: sign(mod(scores[a])) };
  }

  const saves = {};
  for (const a of Object.keys(ABIL_NAME)) {
    const p = hasProficiency(mods, `${ABIL_NAME[a].toLowerCase()}-saving-throws`);
    const total = mod(scores[a]) + (p ? prof : 0);
    saves[a] = { proficient: p, total, totalText: sign(total) };
  }

  const skills = SKILLS.map(([slug, label, ability]) => {
    const p = hasProficiency(mods, slug);
    const e = hasExpertise(mods, slug);
    const total = mod(scores[ability]) + (p ? prof : 0) + (e ? prof : 0);
    return { slug, label, ability, proficient: p, expertise: e, total, totalText: sign(total) };
  });

  const conMod = abilities.CON.mod;
  const baseHP = data.baseHitPoints ?? 0;
  const bonusHP = data.bonusHitPoints || 0;
  const maxHP = data.overrideHitPoints != null
    ? data.overrideHitPoints
    : baseHP + conMod * level + bonusHP;

  const findSkill = (slug) => skills.find((s) => s.slug === slug);
  const passives = {
    perception: 10 + findSkill("perception").total,
    investigation: 10 + findSkill("investigation").total,
    insight: 10 + findSkill("insight").total,
  };

  const cls = data.classes || [];
  const classLine = cls
    .map((c) => `${c.definition?.name} ${c.level}${c.subclassDefinition?.name ? ` (${c.subclassDefinition.name})` : ""}`)
    .join(" / ");
  const hitDice = cls.map((c) => `${c.level}d${c.definition?.hitDice}`).join(", ");

  return {
    id: data.id,
    name: data.name,
    race: data.race?.fullName || data.race?.baseRaceName,
    raceBase: data.race?.baseRaceName || data.race?.fullName,
    raceTraits: (data.race?.racialTraits || [])
      .map((t) => t.definition?.name)
      .filter(Boolean),
    raceTraitsDetail: (data.race?.racialTraits || [])
      .map((t) => ({ name: t.definition?.name, description: t.definition?.description }))
      .filter((t) => t.name),
    background: data.background?.definition?.name,
    backgroundDetail: data.background?.definition ? {
      name: data.background.definition.name,
      intro: data.background.definition.shortDescription || data.background.definition.description || "",
      skills: data.background.definition.skillProficienciesDescription || "",
      tools: data.background.definition.toolProficienciesDescription || "",
      languages: data.background.definition.languagesDescription || "",
      featureName: data.background.definition.featureName || "",
    } : null,
    classLine,
    className: (data.classes || [])[0]?.definition?.name,
    classDescription: (data.classes || [])[0]?.definition?.description || "",
    subclass: cls[0]?.subclassDefinition?.name,
    subclassDescription: cls[0]?.subclassDefinition?.description || "",
    limitedUses: limitedUses(data, scores),
    level,
    prof,
    profText: sign(prof),
    abilities,
    saves,
    skills,
    ac: computeAC(data, scores, mods),
    initiative: abilities.DEX.mod,
    initiativeText: sign(abilities.DEX.mod),
    speed: speed(data, mods),
    maxHP,
    hitDice,
    passives,
    spellSlots: spellSlots(data),
    pactMagic: (data.classes || []).some((c) => /warlock/i.test(c.definition?.name || "") && c.definition?.canCastSpells),
    spellcasting: spellcasting(data, scores, prof),
    spellsByLevel: groupSpells(data),
    ...featuresAtLevel(data),
    portraitAvatarUrl: data.decorations?.avatarUrl || "",
  };
}
