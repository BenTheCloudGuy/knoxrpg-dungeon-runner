// Render one character's A5 sheet (PDF + per-page PNG previews) from D&D Beyond data.
// Usage: node render-sheet.mjs <path-to-ddb-json> [--out DIR]
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import { parseCharacter } from "./ddb-parse.mjs";
import {
  SKILL_USES, FEATURE_EXPLAIN, HIDE_FEATURES, RESOURCE_LIBRARY, SPELL_SUMMARY,
  RACE_EXPLAIN, CLASS_EXPLAIN, SUBCLASS_EXPLAIN, BACKGROUND_EXPLAIN, resourceExplain, classAbilities,
} from "./content.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const pcRoot = path.resolve(here, "..", "..");
const fontCss = fs.readFileSync(path.join(here, "fonts", "fonts-embed.css"), "utf8");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const boxes = (n, filled = 0) =>
  Array.from({ length: n }, (_, i) => `<span class="ck${i < filled ? " on" : ""}"></span>`).join("");

function portraitDataUri(model) {
  const dir = path.join(pcRoot, "art");
  if (!fs.existsSync(dir)) return "";
  const hit = fs.readdirSync(dir).find((f) => f.endsWith(`_${model.id}.png`));
  if (!hit) return "";
  const b64 = fs.readFileSync(path.join(dir, hit)).toString("base64");
  return `data:image/png;base64,${b64}`;
}

// ---- limited-use resources with doubling (no rest in this dungeon) ----
function resources(model) {
  const list = [];
  const sorc = model.classLine.match(/Sorcerer (\d+)/);
  if (sorc) list.push({ name: "Sorcery Points", label: "Sorcery Points", normal: Number(sorc[1]), doubled: Number(sorc[1]) * 2, desc: resourceExplain("Sorcery Points") });
  for (const lu of model.limitedUses || []) {
    if (sorc && /sorcery points/i.test(lu.name)) continue; // handled specially above
    const label = RESOURCE_LIBRARY[lu.name]?.label || lu.name;
    list.push({ name: lu.name, label, normal: lu.max, doubled: lu.max * 2, desc: resourceExplain(lu.name, lu.snippet) });
  }
  const seen = new Set();
  return list.filter((r) => (seen.has(r.label) ? false : seen.add(r.label)));
}

// ---- spell formatting from DDB fields ----
const ACT_TYPE = { 1: "Action", 2: "No Action", 3: "Bonus Action", 4: "Reaction", 6: "Minute", 7: "Hour", 8: "Special" };
function fmtCastTime(sp) {
  const a = sp.castingTime || {};
  const base = ACT_TYPE[a.activationType] || "Action";
  const t = a.activationTime || 1;
  if (a.activationType === 6) return `${t} Minute${t > 1 ? "s" : ""}`;
  if (a.activationType === 7) return `${t} Hour${t > 1 ? "s" : ""}`;
  return base;
}
function fmtRange(sp) {
  const r = sp.range || {};
  if (r.origin === "Self") return r.aoeType ? `Self (${r.aoeValue}-ft ${String(r.aoeType).toLowerCase()})` : "Self";
  if (r.origin === "Touch") return "Touch";
  if (r.rangeValue) return `${r.rangeValue} ft`;
  return r.origin || "-";
}
function fmtDuration(sp) {
  const d = sp.duration || {};
  const type = d.durationType;
  if (!type || type === "Instantaneous") return "Instantaneous";
  if (type === "Concentration") return `Concentration, up to ${d.durationInterval} ${String(d.durationUnit || "").toLowerCase()}`;
  if (type === "Time") return `${d.durationInterval} ${String(d.durationUnit || "").toLowerCase()}${d.durationInterval > 1 ? "s" : ""}`;
  return type;
}
function fmtComponents(sp) {
  const map = { 1: "V", 2: "S", 3: "M" };
  const parts = (sp.components || []).map((c) => map[c]).filter(Boolean);
  let out = parts.join(", ");
  if (sp.componentsDescription) out += ` (${sp.componentsDescription})`;
  return out || "-";
}
// Sanitize DDB spell HTML: keep basic structure, drop attributes/media.
function cleanSpellHtml(html) {
  if (!html) return "";
  let s = String(html);
  s = s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<img[^>]*>/gi, "");
  s = s.replace(/<\/?(div|span|figure|figcaption)[^>]*>/gi, "");
  s = s.replace(/<a\b[^>]*>/gi, "").replace(/<\/a>/gi, "");
  // Strip all attributes from remaining allowed tags.
  s = s.replace(/<([a-z0-9]+)\b[^>]*>/gi, (m, tag) => `<${tag.toLowerCase()}>`);
  s = s.replace(/(&nbsp;|\u00a0)/gi, " ");
  s = s.replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n");
  s = s.replace(/<p>\s*<\/p>/gi, "");
  return s.trim();
}

// HTML -> plain text (for feature/race/class fallback bullets).
function htmlToText(html) {
  if (!html) return "";
  let s = String(html);
  s = s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<li[^>]*>/gi, " \u2022 ").replace(/<\/(p|div|li|tr|h[1-6]|ul|ol|table)>/gi, "\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&(rsquo|#8217|#39|apos);/gi, "\u2019")
       .replace(/&(lsquo|#8216);/gi, "\u2018").replace(/&(mdash|#8212);/gi, "\u2014")
       .replace(/&(ndash|#8211);/gi, "\u2013").replace(/&quot;/gi, '"').replace(/&(hellip|#8230);/gi, "\u2026")
       .replace(/&[a-z]+;/gi, " ");
  s = s.replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").replace(/\n{2,}/g, "\n").trim();
  return s;
}
// Concise summary: first sentence(s) up to max chars.
function shortText(html, max = 300) {
  let t = htmlToText(html);
  // Insert a sentence break where a block (e.g. a bold heading) lacks end punctuation.
  t = t.replace(/([^.!?:;\u2026])\n+/g, "$1. ").replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  if (stop > max * 0.55) return cut.slice(0, stop + 1);
  const sp = cut.lastIndexOf(" ");
  return (sp > 0 ? cut.slice(0, sp) : cut).trim() + "\u2026";
}
// Structural / duplicate features that should not appear on the Who-You-Are page.
function isHidden(name) {
  if (!name) return true;
  if (HIDE_FEATURES.has(name)) return true;
  if (/^Core .* Traits$/.test(name)) return true;
  if (/ Subclass$/.test(name)) return true;
  if (/ Options$/.test(name)) return true;
  if (/ Spells$/.test(name)) return true; // subclass/domain spell lists (spells appear on spell pages)
  if (/Ability Score (Improvements?|Increase)$/.test(name)) return true;
  if (/^(Spellcasting|Pact Magic|Size|Speed|Languages|Age|Alignment|Creature Type|Ability Score Increases?|Expanded Spell List)$/.test(name)) return true;
  return false;
}

// ---- action economy (moved to main page) ----
function actionEconomy(model) {
  const bonusActions = [];
  for (const lvl of Object.keys(model.spellsByLevel)) {
    for (const sp of model.spellsByLevel[lvl]) {
      if (sp.castingTime && sp.castingTime.activationType === 3) bonusActions.push(sp.name);
    }
  }
  if (model.classFeatures.some((f) => f.name === "Innate Sorcery")) bonusActions.unshift("Innate Sorcery (turn on)");
  if (model.classFeatures.some((f) => f.name === "Font of Magic")) bonusActions.push("Font of Magic (convert points/slots)");
  const hasSpells = Object.keys(model.spellsByLevel).length > 0;
  const castLine = hasSpells ? "<li>Cast a spell (see the Spell Reference pages)</li>" : "";
  return `<div class="panel"><div class="panel-h">On Your Turn</div>
    <div class="mini top">Each turn you can <b>Move</b>, take one <b>Action</b>, maybe one <b>Bonus Action</b>, and between turns one <b>Reaction</b>.</div>
    <div class="act-cols">
      <div class="act-block"><div class="act-h">Actions</div>
        <ul class="acts">${castLine}<li>Attack with a weapon or damaging cantrip (see Skills page)</li><li>Dash, Disengage, Dodge, Hide, Help, Search, Ready, Shove, Grapple, Influence, Study, Utilize</li></ul></div>
      <div class="act-block"><div class="act-h">Bonus Actions</div>
        <ul class="acts">${bonusActions.map((b) => `<li>${esc(b)}</li>`).join("") || "<li>None special</li>"}</ul></div>
      <div class="act-block"><div class="act-h">Reactions</div>
        <ul class="acts"><li>Opportunity Attack when a creature leaves your reach</li><li>Cast a spell with a Reaction casting time</li></ul></div>
    </div>
  </div>`;
}

// ---- house rules (main page, under On Your Turn) ----
function houseRules(model) {
  const faces = [...new Set((String(model.hitDice).match(/d\d+/g) || []))];
  const hd = faces.length ? faces.join(" or ") : "your Hit Die";
  return `<div class="panel house">
    <div class="panel-h">House Rules</div>
    <ul class="acts">
      <li><b>Catch your breath.</b> Out of combat, spend one Hit Die + your Constitution modifier to heal. Up to 3 times all run; mark each on the Hit Dice track above.</li>
      <li><b>Spellcasting.</b> Cast any spell of a type you can cast from a found Spell Book, if you have the slots. You can reach one level above your normal maximum by spending two slots of the level just below it: two level-1 slots cast a level-2 spell, two level-2 slots cast a level-3 spell like Fireball. That over-level cast needs a spellcasting check (DC 10 + the spell's level). The slots are spent whether you pass or fail, and a failure fizzles the spell.</li>
    </ul>
  </div>`;
}

// ---- trackers: spellcasting + spell slots (top of Spell pages) ----
function spellTrackers(model) {
  const sc = model.spellcasting;
  const pact = model.pactMagic;
  const slotRows = (model.spellSlots || []).map((n, i) => {
    if (!n) return "";
    const label = pact ? "Pact Magic" : `Level ${i + 1}`;
    return `<div class="slot-row"><span class="sl">${label}</span><span class="cks big">${boxes(n * 2)}</span></div>`;
  }).join("");
  const pactLevel = pact ? (model.spellSlots || []).findIndex((n) => n) + 1 : 0;
  const pactNote = pact && pactLevel > 0
    ? `<div class="mini">Pact Magic: all your slots are Level ${pactLevel}, and every spell is cast at that level.</div>`
    : "";
  if (!sc && !slotRows) return "";
  return `<div class="trackers"><div class="trk-row">
    ${sc ? `<div class="panel"><div class="panel-h">Spellcasting</div>
      <div class="sc-grid">
        <div class="sc-box"><b>${sc.saveDC}</b><span>Save DC</span></div>
        <div class="sc-box"><b>+${sc.attack}</b><span>Spell Attack</span></div>
        <div class="sc-box"><b>${sc.ability}</b><span>Ability</span></div>
      </div>
      <div class="mini">Concentration: only one concentration spell at a time. Taking damage can break it (CON save).</div>
    </div>` : ""}
    ${slotRows ? `<div class="panel slots"><div class="panel-h">Spell Slots</div>
      <div class="mini top">Cross off a box when you cast a leveled spell.</div>${slotRows}${pactNote}</div>` : ""}
    </div></div>`;
}

// ---- usage tracker (folded under Your Class, no "Limited Abilities" label) ----
function classTracker(model) {
  const res = resources(model).map((r) => {
    const track = r.doubled > 12
      ? `<span class="pool-n">${r.doubled} total</span><span class="wline"></span>`
      : `<span class="cks">${boxes(r.doubled)}</span>`;
    const desc = r.desc ? `<div class="res-desc">${esc(r.desc)}</div>` : "";
    return `<div class="res-item"><div class="res-row${r.doubled > 12 ? " pool" : ""}"><span class="rl">${esc(r.label)}</span>${track}</div>${desc}</div>`;
  }).join("");
  if (!res) return "";
  return `<div class="class-track"><div class="mini top">Track your limited uses here. Each box is one use, and every per-rest use is doubled because this dungeon has no rest.</div>${res}</div>`;
}

// ---------- page builders ----------
function statPip(a) {
  const x = a;
  return `<div class="abil">
    <div class="abil-name">${x.name}</div>
    <div class="abil-mod">${x.modText}</div>
    <div class="abil-score">${x.score}</div>
  </div>`;
}

function damagingAttacks(model) {
  const atks = [];
  const cantrips = model.spellsByLevel[0] || [];
  for (const sp of cantrips) {
    if (!sp.damage) continue;
    const dmg = sp.damage.type ? `${sp.damage.dice} ${sp.damage.type}` : `${sp.damage.dice} (choose type)`;
    if (sp.requiresAttackRoll) {
      atks.push({ name: sp.name, hit: model.spellcasting ? `+${model.spellcasting.attack}` : "-", dmg, note: fmtRange(sp) });
    } else if (sp.requiresSavingThrow) {
      atks.push({ name: sp.name, hit: model.spellcasting ? `DC ${model.spellcasting.saveDC}` : "-", dmg, note: `${sp.saveAbility || ""} save, ${fmtRange(sp)}` });
    } else {
      atks.push({ name: sp.name, hit: "-", dmg, note: fmtRange(sp) });
    }
  }
  if (/Monk/.test(model.className || "")) {
    const best = Math.max(model.abilities.STR.mod, model.abilities.DEX.mod);
    atks.push({ name: "Unarmed / Martial Arts", hit: `+${best + model.prof}`, dmg: `1d6 ${best >= 0 ? "+" : ""}${best} bludgeoning`, note: "Melee (STR or DEX)" });
  } else {
    const s = model.abilities.STR.mod;
    atks.push({ name: "Unarmed Strike", hit: `+${s + model.prof}`, dmg: `${1 + s} bludgeoning`, note: "Melee" });
  }
  return atks;
}

function pageCore(model, portrait, num) {
  const abilOrder = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  const abilRow = abilOrder.map((a) => statPip({ name: a, ...model.abilities[a] })).join("");
  const saveRow = abilOrder.map((a) => {
    const s = model.saves[a];
    return `<div class="save${s.proficient ? " prof" : ""}"><span class="dot"></span><span class="sv-name">${a}</span><span class="sv-val">${s.totalText}</span></div>`;
  }).join("");

  return `<section class="page">
    ${pageFrame(model, num)}
    <div class="hero">
      <div class="hero-left">
        <h1 class="cname">${esc(model.name)}</h1>
        <div class="csub">${esc(model.race)} &middot; ${esc(model.classLine)} &middot; ${esc(model.background)}</div>
      </div>
      ${portrait ? `<div class="portrait"><img src="${portrait}"></div>` : ""}
    </div>

    <div class="combat-strip">
      <div class="cbox"><div class="cbig">${model.ac}</div><div class="clab">Armor Class</div></div>
      <div class="cbox"><div class="cbig">${model.initiativeText}</div><div class="clab">Initiative</div></div>
      <div class="cbox"><div class="cbig">${model.speed}</div><div class="clab">Speed (ft)</div></div>
      <div class="cbox"><div class="cbig">${model.profText}</div><div class="clab">Prof. Bonus</div></div>
    </div>

    <div class="two-col">
      <div class="col">
        <div class="abil-row">${abilRow}</div>
        <div class="panel">
          <div class="panel-h">Saving Throws</div>
          <div class="saves">${saveRow}</div>
          <div class="mini">Filled dot = proficient. Roll d20 + this number when a spell or trap targets you.</div>
        </div>
      </div>
      <div class="col">
        <div class="panel hp">
          <div class="panel-h">Hit Points &amp; Death Saves</div>
          <div class="hp-grid">
            <div class="hp-max"><span>Max HP</span><b>${model.maxHP}</b></div>
            <div class="write"><span>Current</span><div class="wbox"></div></div>
            <div class="write"><span>Temp</span><div class="wbox"></div></div>
          </div>
          <div class="hd"><span>Hit Dice: <b>${esc(model.hitDice)}</b></span><span class="hd-track">Used <span class="cks">${boxes(model.level)}</span></span></div>
          <div class="death">
            <div class="death-row"><span>Deaths — Success</span><span class="cks">${boxes(3)}</span></div>
            <div class="death-row"><span>Deaths — Failure</span><span class="cks">${boxes(3)}</span></div>
          </div>
          <div class="mini">At 0 HP roll a d20 each turn: 10+ is a success, 9 or less a failure. Three successes and you are stable; three failures and you die. A natural 20 gives back 1 HP.</div>
        </div>
        <div class="panel passives">
          <div class="pv"><b>${model.passives.perception}</b><span>Passive Perception</span></div>
          <div class="pv"><b>${model.passives.investigation}</b><span>Passive Investigation</span></div>
          <div class="pv"><b>${model.passives.insight}</b><span>Passive Insight</span></div>
        </div>
      </div>
    </div>

    ${actionEconomy(model)}

    ${houseRules(model)}
  </section>`;
}

function pageSkills(model, num) {
  const skillRows = model.skills.map((s) => {
    return `<tr class="${s.proficient ? "prof" : ""}">
      <td class="sd"><span class="dot"></span></td>
      <td class="sv">${s.totalText}</td>
      <td class="sk">${esc(s.label)} <span class="ab">(${s.ability})</span></td>
      <td class="su">${esc(SKILL_USES[s.slug] || "")}</td>
    </tr>`;
  }).join("");

  const atkRows = damagingAttacks(model).map((a) =>
    `<tr><td class="an">${esc(a.name)}</td><td class="ah">${esc(a.hit)}</td><td class="ad">${esc(a.dmg)}</td><td class="anote">${esc(a.note)}</td></tr>`
  ).join("");

  return `<section class="page">
    ${pageFrame(model, num)}
    <h2 class="ph">Skills</h2>
    <div class="mini top">A skill check is d20 + the number shown. A filled dot means you are proficient (already added in).</div>
    <table class="skills"><tbody>${skillRows}</tbody></table>
    <h2 class="ph">Attacks &amp; Damaging Cantrips</h2>
    <div class="mini top">Roll d20 + the Hit number to hit with an attack. For a spell that forces a save, the target rolls against your DC instead.</div>
    <table class="atk"><thead><tr><th>Attack</th><th>Hit / DC</th><th>Damage</th><th>Notes</th></tr></thead><tbody>${atkRows}</tbody></table>
    <div class="mini">Writing in a weapon? To hit, add your proficiency and ability modifier: melee is <b>+${model.abilities.STR.mod + model.prof}</b> (STR), finesse or ranged is <b>+${model.abilities.DEX.mod + model.prof}</b> (DEX). Add that same modifier to the weapon's damage.</div>
  </section>`;
}

// Build the ordered "Who You Are" blocks (header/intro/bullet) for measure-packing.
function featureItems(model) {
  const items = [];
  const seen = new Set();
  const H = (html) => items.push({ html, keepWithNext: true });
  const P = (html) => items.push({ html, keepWithNext: true });
  const B = (name, text, feat) => {
    if (!name || seen.has(name) || isHidden(name) || !text) return;
    seen.add(name);
    items.push({ html: `<div class="fbul${feat ? " ft" : ""}"><b>${esc(name)}.</b> ${esc(text)}</div>`, keepWithNext: false });
  };

  // Ancestry
  const race = RACE_EXPLAIN[model.raceBase] || RACE_EXPLAIN[model.race];
  H(`<div class="fsect-h">Your Ancestry: ${esc(model.race)}</div>`);
  if (race) {
    P(`<p class="fsect-intro">${esc(race.intro)}</p>`);
    for (const [n, t] of race.traits) B(n, t, false);
  } else {
    P(`<p class="fsect-intro">Your ancestry gives you a few natural traits.</p>`);
    for (const t of model.raceTraitsDetail || []) B(t.name, shortText(t.description, 240), false);
  }

  // Background
  const bg = model.backgroundDetail;
  if (bg) {
    H(`<div class="fsect-h">Your Background: ${esc(bg.name)}</div>`);
    const bgIntro = BACKGROUND_EXPLAIN[bg.name] || shortText(bg.intro, 260);
    if (bgIntro) P(`<p class="fsect-intro">${esc(bgIntro)}</p>`);
    const skills = htmlToText(bg.skills).trim();
    const tools = htmlToText(bg.tools).trim();
    const langs = htmlToText(bg.languages).trim();
    if (skills) items.push({ html: `<div class="fbul"><b>Trained Skills.</b> ${esc(skills)} (already on your Skills page).</div>`, keepWithNext: false });
    if (tools) items.push({ html: `<div class="fbul"><b>Tools.</b> ${esc(tools)}.</div>`, keepWithNext: false });
    if (langs) items.push({ html: `<div class="fbul"><b>Languages.</b> ${esc(langs)}.</div>`, keepWithNext: false });
    if (bg.featureName) items.push({ html: `<div class="fbul"><b>Origin Feat.</b> ${esc(bg.featureName)} (explained under Your Feats).</div>`, keepWithNext: false });
  }

  // Feats
  const featStart = items.length;
  H(`<div class="fsect-h">Your Feats</div>`);
  P(`<p class="fsect-intro">Feats are special perks from your background and choices, on top of your class.</p>`);
  const beforeFeatBullets = items.length;
  for (const f of model.feats) B(f.name, FEATURE_EXPLAIN[f.name] || shortText(f.description, 300), true);
  if (items.length === beforeFeatBullets) items.length = featStart; // no feats shown: drop the header/intro

  // Class + subclass (closes out "Who You Are" with the full ability breakdown)
  H(`<div class="fsect-h">Your Class: ${esc(model.className || model.classLine)}${model.subclass ? ` (${esc(model.subclass)})` : ""}</div>`);
  const classIntro = CLASS_EXPLAIN[model.className] || shortText(model.classDescription, 300);
  if (classIntro) P(`<p class="fsect-intro">${esc(classIntro)}</p>`);
  const subIntro = model.subclass ? (SUBCLASS_EXPLAIN[model.subclass] || shortText(model.subclassDescription, 260)) : "";
  if (subIntro) P(`<p class="fsect-intro">${esc(subIntro)}</p>`);
  const abils = classAbilities(model);
  if (abils && abils.length) {
    const trk = classTracker(model);
    if (trk) items.push({ html: trk, keepWithNext: true });
    for (const a of abils) {
      items.push({ html: `<div class="fbul"><b>${esc(a.name)}.</b> ${esc(a.cost)}. ${esc(a.text)}</div>`, keepWithNext: false });
    }
  } else {
    for (const f of model.classFeatures) B(f.name, FEATURE_EXPLAIN[f.name] || shortText(f.description, 320), false);
    if (/Sorcerer/.test(model.className || "")) {
      for (const m of model.metamagic) B(m, FEATURE_EXPLAIN[m], false);
    }
  }

  return items;
}

function spellCard(sp) {
  const meta = [
    ["Casting Time", fmtCastTime(sp)],
    ["Range", fmtRange(sp)],
    ["Components", fmtComponents(sp)],
    ["Duration", fmtDuration(sp)],
  ];
  const tags = [];
  if (sp.concentration) tags.push("Concentration");
  if (sp.ritual) tags.push("Ritual");
  if (sp.requiresAttackRoll) tags.push("Spell attack");
  if (sp.requiresSavingThrow) tags.push("Saving throw");
  const lvlLabel = sp.level === 0 ? `${esc(sp.school)} Cantrip` : `Level ${sp.level} ${esc(sp.school)}`;
  const src = sp.source && sp.source !== "class" ? `<span class="ssrc">via ${esc(sp.source)}</span>` : "";
  // Very long (usually homebrew stat-block) descriptions are truncated so a single
  // card never grows taller than a page. Full text stays on D&D Beyond.
  const plainLen = htmlToText(sp.description).length;
  const descHtml = plainLen > 1500
    ? `<p>${esc(shortText(sp.description, 1300))}</p><p class="spell-more">Full text on D&amp;D Beyond.</p>`
    : cleanSpellHtml(sp.description);
  return `<div class="spell">
    <div class="spell-h"><span class="spell-n">${esc(sp.name)}</span><span class="spell-lvl">${lvlLabel}</span>${src}</div>
    <div class="spell-meta">${meta.map(([k, v]) => `<span><b>${k}:</b> ${esc(v)}</span>`).join("")}</div>
    ${tags.length ? `<div class="spell-tags">${tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
    <div class="spell-desc">${descHtml}</div>
  </div>`;
}

// Ordered spell items: a group header before each level's spells.
function spellItems(model) {
  const items = [];
  const levels = Object.keys(model.spellsByLevel).map(Number).sort((a, b) => a - b);
  for (const lvl of levels) {
    const list = model.spellsByLevel[lvl];
    if (!list || !list.length) continue;
    const title = lvl === 0
      ? "Cantrips \u2014 cast any time, no slot needed"
      : `Level ${lvl} Spells \u2014 each casting spends a slot`;
    items.push({ type: "gh", html: `<div class="spell-group-h">${esc(title)}</div>` });
    for (const sp of list) items.push({ type: "card", html: spellCard(sp) });
  }
  return items;
}

// Measure a list of blocks, then greedily pack into A5 pages so nothing clips.
// items: [{ html, keepWithNext }]. topHtml (optional) is placed once on the first page.
async function packToPages(page, model, { items, startNum, heading, topHtml = "" }) {
  if (!items.length && !topHtml) return [];
  const measHtml = wrapHtml(`<div class="measure">
    ${topHtml ? `<div id="mt">${topHtml}</div>` : ""}
    <div id="mph"><h2 class="ph">${esc(heading)}</h2></div>
    ${items.map((it, i) => `<div class="mitem" data-i="${i}">${it.html}</div>`).join("")}
  </div>`);
  await page.setContent(measHtml, { waitUntil: "networkidle" });
  const meas = await page.evaluate(() => {
    const mm = 96 / 25.4;
    const toMM = (px) => +(px / mm).toFixed(2);
    const top = (el) => el.getBoundingClientRect().top;
    const bottom = (el) => el.getBoundingClientRect().bottom;
    const mt = document.querySelector("#mt");
    const ph = document.querySelector("#mph .ph");
    const items = [...document.querySelectorAll(".mitem")];
    const phTop = top(ph);
    const firstTop = items.length ? top(items[0]) : bottom(ph);
    // Each item's height is the distance to the next item's top, so collapsed
    // margins between items are counted exactly (no fixed per-item fudge).
    const out = items.map((el, idx) => {
      const t = top(el);
      const nextTop = idx + 1 < items.length ? top(items[idx + 1]) : bottom(el);
      return { i: +el.dataset.i, h: toMM(nextTop - t) };
    });
    return {
      topH: mt ? toMM(phTop - top(mt)) : 0, // tracker block plus its gap to the heading
      phH: toMM(firstTop - phTop),          // heading plus its gap to the first item
      items: out,
    };
  });
  const H = {};
  meas.items.forEach((x) => { H[x.i] = x.h; });

  const BUDGET = 196; // usable mm of content per page (inside the safe print margin)
  const pages = [];
  let cur = [];
  let first = true;
  let pnum = startNum;
  let curH = meas.phH + (topHtml ? meas.topH : 0);
  const pushPage = () => {
    const inner = (first && topHtml ? topHtml : "") + cur.join("");
    pages.push(`<section class="page">${pageFrame(model, pnum)}<h2 class="ph">${esc(heading)}</h2>${inner}</section>`);
    pnum++;
    first = false;
    cur = [];
  };
  for (let k = 0; k < items.length; k++) {
    const ih = H[k] || 0;
    let need = ih;
    if (items[k].keepWithNext && items[k + 1]) need += H[k + 1] || 0;
    if (cur.length && curH + need > BUDGET) {
      pushPage();
      curH = meas.phH;
    }
    cur.push(items[k].html);
    curH += ih;
  }
  if (cur.length || (topHtml && pages.length === 0)) pushPage();
  return pages;
}

async function buildSpellPages(model, startNum, page) {
  const items = spellItems(model).map((it) => ({ html: it.html, keepWithNext: it.type === "gh" }));
  if (!items.length) return [];
  return packToPages(page, model, { items, startNum, heading: "Spell Reference", topHtml: spellTrackers(model) });
}

function pageFrame(model, num) {
  return `<div class="frame-top"><span class="ft-title">The Vault of the Starving Mind</span><span class="ft-page">Page ${num}</span></div>`;
}

const CSS = fs.readFileSync(path.join(here, "sheet.css"), "utf8");

function wrapHtml(body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontCss}
${CSS}
</style></head><body>${body}</body></html>`;
}

async function assembleHtml(model, portrait, page) {
  const pages = [];
  let num = 1;
  const add = (html) => { if (html) { pages.push(html); num++; } };
  add(pageCore(model, portrait, num));
  add(pageSkills(model, num));
  for (const p of await packToPages(page, model, { items: featureItems(model), startNum: num, heading: "Who You Are" })) add(p);
  const hasSpells = Object.keys(model.spellsByLevel).length > 0;
  if (hasSpells) {
    for (const p of await buildSpellPages(model, num, page)) add(p);
  }
  // Notes pages: always add at least 2 (3 when needed) so every sheet ends
  // on an even page count for double-sided printing.
  const notesCount = pages.length % 2 === 0 ? 2 : 3;
  for (let i = 0; i < notesCount; i++) add(blankPage(model, num));
  return wrapHtml(pages.join(""));
}

function blankPage(model, num) {
  return `<section class="page">
    ${pageFrame(model, num)}
    <div class="blank-note">Notes</div>
  </section>`;
}

export async function renderOne(jsonPath, outDirArg, page, opts = {}) {
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8")).data;
  const model = parseCharacter(data);
  const portrait = portraitDataUri(model);

  const safe = model.name.replace(/[^\w]+/g, "_");
  const outDir = outDirArg || path.join(pcRoot, "sheets-v2", safe.toLowerCase());
  fs.mkdirSync(outDir, { recursive: true });
  fs.rmSync(path.join(outDir, "preview"), { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "preview"), { recursive: true });

  const html = await assembleHtml(model, portrait, page);
  fs.writeFileSync(path.join(outDir, "sheet.html"), html);
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfPath = path.join(outDir, `${safe}_${model.id}.pdf`);
  await page.pdf({ path: pdfPath, width: "148mm", height: "227.9mm", printBackground: true });

  const count = await page.locator(".page").count();
  let overflow = [];
  if (opts.checkOverflow) {
    overflow = await page.evaluate(() => {
      const mm = 96 / 25.4;
      const bad = [];
      document.querySelectorAll(".page").forEach((pg, i) => {
        const top = pg.getBoundingClientRect().top;
        let maxB = 0;
        pg.querySelectorAll("*").forEach((el) => { if (el.offsetParent !== null) { const b = el.getBoundingClientRect().bottom - top; if (b > maxB) maxB = b; } });
        if (maxB / mm > 217.9) bad.push({ page: i + 1, mm: +(maxB / mm).toFixed(1) });
      });
      return bad;
    });
  }
  if (!opts.skipPreviews) {
    for (let i = 0; i < count; i++) {
      await page.locator(".page").nth(i).screenshot({ path: path.join(outDir, "preview", `page-${i + 1}.png`) });
    }
  }
  return { name: model.name, id: model.id, pages: count, pdf: pdfPath, outDir, overflow };
}

async function main() {
  const jsonPath = process.argv[2];
  const outArg = process.argv.indexOf("--out");
  const outDir = outArg > 0 ? process.argv[outArg + 1] : null;
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  const res = await renderOne(jsonPath, outDir, page, { checkOverflow: true });
  await browser.close();
  console.log(JSON.stringify(res, null, 2));
}

if (process.argv[1] && process.argv[1].endsWith("render-sheet.mjs")) main();
