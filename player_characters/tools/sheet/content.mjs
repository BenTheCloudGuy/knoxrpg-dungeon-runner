// Plain-language content for new players. Generic where possible (skills), keyed by
// name where character-specific (features, feats, spells, limited-use resources).
// Original summaries; no proprietary rules text is reproduced verbatim.

export const SKILL_USES = {
  "acrobatics": "Balance, tumble, stay on your feet, wriggle free.",
  "animal-handling": "Calm, control, or read the mood of an animal.",
  "arcana": "Recall lore about magic, spells, and magic items.",
  "athletics": "Climb, jump, swim, grapple, shove.",
  "deception": "Lie convincingly or hide the truth.",
  "history": "Recall past events, kingdoms, and old lore.",
  "insight": "Read a creature's true intentions or mood.",
  "intimidation": "Frighten or pressure someone with threats.",
  "investigation": "Search for clues and deduce how things work.",
  "medicine": "Stabilize the dying, diagnose illness.",
  "nature": "Recall lore about terrain, plants, animals, weather.",
  "perception": "Notice things: spot, hear, or sense danger.",
  "performance": "Entertain a crowd with music, dance, or acting.",
  "persuasion": "Win someone over with tact and good faith.",
  "religion": "Recall lore about gods, rites, and holy symbols.",
  "sleight-of-hand": "Pick pockets, palm objects, quick fingers.",
  "stealth": "Move quietly and stay hidden.",
  "survival": "Track, forage, navigate the wilds.",
};

// Feature / feat explanations. text = plain language for a new player.
// Structural or duplicate DDB entries are hidden via HIDE_FEATURES.
export const HIDE_FEATURES = new Set([
  "Core Sorcerer Traits", "Spellcasting", "Sorcerer Subclass",
  "Metamagic Options", "Ability Score Improvement",
  "Acolyte Ability Score Improvements",
]);

export const FEATURE_EXPLAIN = {
  "Innate Sorcery": "Bonus action to turn on for 1 minute: your spell save DC goes up by 1 and you have Advantage on your Sorcerer spell attack rolls. Limited uses (see trackers).",
  "Font of Magic": "You have Sorcery Points. As a bonus action you can turn Sorcery Points into extra spell slots, or turn spell slots into Sorcery Points.",
  "Metamagic": "You can bend your spells using the two tricks below. Each costs Sorcery Points.",
  "Wild Magic Surge": "Once per turn after you cast a Sorcerer spell with a slot, roll a d20. On a 20, roll on the Wild Magic table for a random magical effect.",
  "Tides of Chaos": "Give yourself Advantage on one d20 roll (attack, check, or save). Limited uses (see trackers).",
  "Empowered Spell": "When you roll spell damage, spend 1 Sorcery Point to reroll up to your Charisma modifier of the dice, and keep the new rolls.",
  "Careful Spell": "When you cast a spell that forces a save, spend 1 Sorcery Point to let up to your Charisma modifier of creatures automatically pass and take no damage.",
  "Magic Initiate (Cleric)": "You learned two Cleric cantrips and one 1st-level Cleric spell. You can cast the 1st-level spell for free once between rests, or with your own slots.",
  "Magic Initiate (Wizard)": "You learned two Wizard cantrips and one 1st-level Wizard spell. You can cast the 1st-level spell for free once between rests, or with your own slots.",
  "Dark Bargain": "A pact perk from your backstory. Confirm its exact effect with your DM before play.",
  "Acolyte Ability Score Improvements": "Your background boosts: +2 to one score and +1 to another (already included in your ability scores).",
};

// Plain-language explanation of what a character's ancestry means at the table.
// intro = one or two sentences; traits = [name, explanation] pairs shown as bullets.
export const RACE_EXPLAIN = {
  "Human": {
    intro: "Humans are the most adaptable people in the world. They do not have a single knack; instead they pick up a little of everything and push harder than most.",
    traits: [
      ["Resourceful", "You start play with Heroic Inspiration. You can spend it to reroll any one d20 roll and keep the result you want."],
      ["Skillful", "You are trained in one extra skill of your choice (already added into your Skills page)."],
      ["Versatile", "You gained an extra origin feat at character creation (listed under Feats below)."],
      ["Size and Speed", "You are Medium and move 30 feet on your turn."],
    ],
  },
};

// Plain-language explanation of what a class is and how it plays.
export const CLASS_EXPLAIN = {
  "Sorcerer": "Your magic is not studied from a book or granted by a god. It is in your blood, raw and instinctive. You know a small number of spells but you can shape them in ways other casters cannot, and you cast using your Charisma, your force of personality.",
};

// Plain-language explanation of a subclass.
export const SUBCLASS_EXPLAIN = {
  "Wild Magic Sorcery": "Your power is unstable. When you throw big spells around, raw chaos can leak out and cause a random magical effect. You also learned to nudge luck in your favor when you need it most.",
};

// Optional plain-language override for a background's intro. Falls back to the
// D&D Beyond short description when a name is not listed here.
export const BACKGROUND_EXPLAIN = {};

// Limited-use resources for the doubled trackers. perRest = normal count per long
// rest; the sheet DOUBLES it because this dungeon has no rest. Keyed by feature/feat.
export const RESOURCE_LIBRARY = {
  "Innate Sorcery": { label: "Innate Sorcery", perRest: 2 },
  "Tides of Chaos": { label: "Tides of Chaos", perRest: 1 },
  "Magic Initiate (Cleric)": { label: "Free Guiding Bolt", perRest: 1 },
  "Magic Initiate (Wizard)": { label: "Free Detect Magic", perRest: 1 },
};

// Plain-language "what you spend it on" line shown under each tracked resource.
// Keyed by a normalized name (lowercase, straight apostrophes, trailing "(...)" tag
// dropped). Falls back to a cleaned D&D Beyond snippet when a name is missing here.
export const RESOURCE_EXPLAIN = {
  "sorcery points": "Spend to create spell slots or convert a slot back into points (Font of Magic), or to fuel Metamagic.",
  "font of magic: sorcery points": "Spend to create spell slots or convert a slot back into points (Font of Magic), or to fuel Metamagic.",
  "focus points": "Spend to power your Monk features. Each ability and its cost is listed below.",
  "uncanny metabolism": "When you roll Initiative, regain all spent Focus Points and heal a little. One use.",
  "action surge": "On your turn, take one extra action (anything but the Magic action).",
  "second wind": "Bonus Action to regain 1d10 + your Fighter level in Hit Points.",
  "adrenaline rush": "Bonus Action to Dash and gain temporary Hit Points equal to your proficiency bonus.",
  "rage": "Bonus Action to Rage: resistance to bludgeoning, piercing, and slashing, plus bonus melee damage.",
  "channel divinity": "Spend a use to power a Channel Divinity option (Turn Undead or your domain's option).",
  "war priest: bonus attack": "Bonus Action to make one extra weapon or Unarmed Strike attack.",
  "lay on hands: healing pool": "Spend points from your healing pool to restore Hit Points by touch, or end one poison or disease.",
  "bardic inspiration": "Bonus Action to give an ally a Bardic Inspiration die they add to a check, attack, or save.",
  "wild shape": "Spend a use to transform into a Beast form you know (Circle of the Moon can also do more).",
  "hunter's mark": "Cast Hunter's Mark without a spell slot to add 1d6 damage when you hit a marked target.",
  "dreadful strike": "Once per turn, add extra psychic damage when you hit a creature with a weapon.",
  "innate sorcery": "Bonus Action to raise your spell save DC by 1 and add damage to your spells for 1 minute.",
  "tides of chaos": "Give yourself Advantage on one attack, check, or save before you roll.",
  "hexblade's curse": "Bonus Action to curse a creature within 30 ft for bonus damage, crits on 19 to 20, and healing when it dies.",
  "magical cunning": "Spend 1 minute to regain some of your expended Pact Magic spell slots.",
  "relentless endurance": "When dropped to 0 HP but not killed outright, drop to 1 HP instead. One use.",
  "arcane recovery": "Recover expended spell slots totaling up to half your Wizard level (rounded up).",
  "benign transposition": "Bonus Action to teleport up to 30 ft, or swap places with a willing creature you can see.",
  "bladesong": "Bonus Action to start your Bladesong for bonus AC, Concentration, and Dexterity Saving Throws.",
  "arcane shot": "When you make a ranged weapon attack, spend a use to add an Arcane Shot effect.",
  "create eldritch cannon": "Magic action to build your Eldritch Cannon (see the feature for its options).",
  "eldritch cannon": "Your cannon can Fire, or you can move it, as part of a Bonus Action (see the feature).",
  "tinker's magic": "Magic action with Tinker's Tools to create one small, useful nonmagical item.",
  "breath weapon": "Replace one attack with your breath weapon; targets make a save for half damage.",
  "hungry jaws": "Bonus Action bite attack; on a hit, gain temporary Hit Points.",
  "feline agility": "When you move in combat, double your speed until the end of the turn.",
  "hill's tumble": "When you hit a Large or smaller creature and deal damage, knock it Prone.",
  "stonecunning": "Bonus Action to gain Tremorsense 60 ft for 10 minutes while touching stone or worked stone.",
  "familiar friend": "While your familiar is near, add your proficiency bonus again on a skill you are proficient in.",
};

export function resourceExplain(name, snippet = "") {
  if (!name) return "";
  const key = String(name)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  if (RESOURCE_EXPLAIN[key]) return RESOURCE_EXPLAIN[key];
  // Fallback: clean the DDB snippet (strip HTML and {{...}} templates, trim to a sentence).
  let s = String(snippet).replace(/<[^>]+>/g, " ").replace(/\{\{[^}]*\}\}/g, "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const cut = s.slice(0, 150);
  const dot = cut.lastIndexOf(".");
  return dot > 40 ? cut.slice(0, dot + 1) : cut + (s.length > 150 ? "..." : "");
}

// Deeper breakdown: every combat option a resource pays for, each explained in plain
// language for players new to D&D. Composed per character (subclass, metamagic, and
// arcane-shot picks vary) by resourceDetailFor(model, name).
const FOCUS_OPTIONS = [
  ["Flurry of Blows", "Right after you take the Attack action, spend 1 Focus Point to make two Unarmed Strikes as a Bonus Action."],
  ["Patient Defense", "Spend 1 Focus Point to take both the Disengage and Dodge actions as a Bonus Action, so attacks against you have Disadvantage. (You can Disengage as a Bonus Action for free without spending.)"],
  ["Step of the Wind", "Spend 1 Focus Point to take both the Dash and Disengage actions as a Bonus Action, and your jump distance doubles this turn. (You can Dash as a Bonus Action for free without spending.)"],
];

const SORCERY_BASE = [
  ["Create a spell slot", "As a Bonus Action, turn Sorcery Points into a spell slot: 2 points makes a level-1 slot, 3 makes a level-2 slot, 5 makes a level-3 slot."],
  ["Convert a slot", "As a Bonus Action, turn one unused spell slot into Sorcery Points equal to its level."],
];

const CD_BASE_CLERIC = [
  ["Divine Spark", "Take the Magic action and spend one use: point at a creature within 30 ft and roll dice to either deal radiant or necrotic damage (it makes a save for half) or restore its Hit Points."],
  ["Turn Undead", "Take the Magic action and spend one use: each Undead within 30 ft that can see or hear you must make a Wisdom save or spend 1 minute Frightened and forced to flee from you."],
];

const CD_BY_SUBCLASS = {
  "War Domain": [
    ["Guided Strike", "When you or a creature within 30 ft misses with an attack roll, spend one use to add +10 to that roll, often turning the miss into a hit."],
  ],
  "Life Domain": [
    ["Preserve Life", "Take the Magic action and spend one use to restore Hit Points equal to five times your Cleric level, split among creatures within 30 ft. You can't raise anyone above half their Hit Point maximum."],
  ],
  "Oath of Devotion": [
    ["Sacred Weapon", "As a Bonus Action, spend one use to add your Charisma modifier to a weapon's attack rolls for 10 minutes. The weapon also sheds bright light."],
  ],
  "Oathbreaker (DMG)": [
    ["Control Undead", "Take the Magic action and spend one use: one Undead within 30 ft must succeed on a Charisma save or obey your commands for 24 hours."],
    ["Dreadful Aspect", "Take the Magic action and spend one use: creatures of your choice within 30 ft must succeed on a Wisdom save or be Frightened of you for 1 minute."],
  ],
  "Oathbreaker": [
    ["Control Undead", "Take the Magic action and spend one use: one Undead within 30 ft must succeed on a Charisma save or obey your commands for 24 hours."],
    ["Dreadful Aspect", "Take the Magic action and spend one use: creatures of your choice within 30 ft must succeed on a Wisdom save or be Frightened of you for 1 minute."],
  ],
};

// Chosen options that spend a resource (metamagic for Sorcerers, Arcane Shots for the
// Arcane Archer). Keyed by normalized option name; the character's actual picks are
// pulled from the sheet data.
const OPTION_EXPLAIN = {
  "empowered spell": "When you roll damage for a spell, reroll up to your Charisma modifier in damage dice and keep the new numbers. Costs 1 Sorcery Point.",
  "careful spell": "When you cast a spell that forces a saving throw, pick up to your Charisma modifier of creatures; they automatically pass that save. Costs 1 Sorcery Point.",
  "seeking spell": "If you make an attack roll for a spell and miss, reroll the d20 and use the new roll. Costs 1 Sorcery Point.",
  "quickened spell": "Change a spell's casting time from an Action to a Bonus Action for this casting. Costs 2 Sorcery Points.",
  "distant spell": "Double a spell's range, or give a touch spell a range of 30 ft. Costs 1 Sorcery Point.",
  "extended spell": "Double a spell's duration, up to a maximum of 24 hours. Costs 1 Sorcery Point.",
  "heightened spell": "One target of the spell has Disadvantage on its first saving throw against it. Costs 2 Sorcery Points.",
  "subtle spell": "Cast the spell without spoken or gestured components, so it can't be spotted or countered by sight or sound. Costs 1 Sorcery Point.",
  "twinned spell": "A spell that targets only one creature can target a second creature as well. Costs 1 Sorcery Point.",
  "transmuted spell": "Change a spell's damage type to acid, cold, fire, lightning, poison, or thunder. Costs 1 Sorcery Point.",
  "piercing shot": "You make no attack roll. The arrow flies in a line 30 ft long and 1 ft wide; each creature in the line makes a Dexterity save, taking the weapon's damage plus 1d6 piercing on a failure, half on a success.",
  "bursting shot": "The arrow bursts with force. The target and each creature within 10 ft of it takes 2d6 force damage.",
  "banishing arrow": "The target takes 2d6 force damage and must succeed on a Charisma save or be banished to a harmless demiplane until the end of your next turn.",
  "beguiling arrow": "The target takes 2d6 psychic damage and must succeed on a Wisdom save or be Charmed by an ally you choose until the start of your next turn.",
  "enfeebling arrow": "The target takes 2d6 necrotic damage and must succeed on a Constitution save or deal only half damage with weapon attacks until the end of your next turn.",
  "grasping arrow": "The target takes 2d6 poison damage, its speed drops by 10 ft, and it takes 2d6 slashing damage the first time it moves each turn until it escapes.",
  "shadow arrow": "The target takes 2d6 psychic damage and must succeed on a Wisdom save or be unable to see anything more than 5 ft away until the end of your next turn.",
};

function normResName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
}

// Returns [[name, text], ...] of every option that spends the given resource for THIS
// character, or null when the resource needs no extra breakdown.
export function resourceDetailFor(model, name) {
  const key = normResName(name);
  const opt = (n) => OPTION_EXPLAIN[normResName(n)];
  if (key === "focus points") return FOCUS_OPTIONS;
  if (key === "sorcery points" || key === "font of magic: sorcery points") {
    const meta = (model.metamagic || []).map((m) => [m, opt(m)]).filter((x) => x[1]);
    return [...SORCERY_BASE, ...meta];
  }
  if (key === "channel divinity") {
    const base = /cleric/i.test(model.className || "") ? CD_BASE_CLERIC : [];
    const sub = CD_BY_SUBCLASS[model.subclass] || [];
    const all = [...base, ...sub];
    return all.length ? all : null;
  }
  if (key === "arcane shot") {
    const shots = (model.metamagic || []).map((o) => [o, opt(o)]).filter((x) => x[1]);
    return shots.length ? shots : null;
  }
  return null;
}

// Full class-ability breakdown for the "Combat Abilities" page. Each entry lists what
// the ability does and what it costs (Focus Points, a Reaction, free, and so on), so a
// new player can run the character without looking anything up. Base list is keyed by
// class name; subclass extras are merged in from SUBCLASS_ABILITIES.
export const CLASS_ABILITIES = {
  Barbarian: [
    { name: "Rage", cost: "Bonus Action (Rage use)", text: "If you aren't wearing Heavy armor, enter a Rage as a Bonus Action. For up to 10 minutes you have Resistance to Bludgeoning, Piercing, and Slashing damage, deal +2 damage on Strength-based melee hits, and have Advantage on Strength checks and Strength saving throws. It ends early if you put on Heavy armor, or if you end a turn without having attacked a foe or taken damage since your last turn. Track uses on your usage boxes above." },
    { name: "Reckless Attack", cost: "Free", text: "On your first attack of the turn, you can attack recklessly: you gain Advantage on your Strength-based melee attack rolls this turn, but attack rolls against you have Advantage until your next turn." },
    { name: "Unarmored Defense", cost: "Passive", text: "While you wear no armor, your AC is 10 + your Dexterity modifier + your Constitution modifier. You can still use a Shield." },
    { name: "Danger Sense", cost: "Passive", text: "You have Advantage on Dexterity saving throws, unless something stops you from moving or acting." },
    { name: "Primal Knowledge", cost: "Free (while raging)", text: "While your Rage is active, you can make Acrobatics, Intimidation, Perception, Stealth, or Survival checks using Strength instead of their usual ability." },
    { name: "Weapon Mastery", cost: "Passive", text: "You can use the mastery property (such as Cleave or Topple) of two kinds of Melee weapons you chose." },
  ],
  Fighter: [
    { name: "Second Wind", cost: "Bonus Action (Second Wind use)", text: "As a Bonus Action, regain 1d10 + your Fighter level in Hit Points. Track uses on your usage boxes above." },
    { name: "Action Surge", cost: "Free (Action Surge use)", text: "On your turn, take one extra action (anything except the Magic action). Track uses on your usage boxes above." },
    { name: "Tactical Mind", cost: "Free (spends a Second Wind)", text: "When you fail an ability check, spend a Second Wind use to roll 1d10 and add it to the check, possibly turning the failure into a success. If it still fails, the use isn't spent." },
    { name: "Fighting Style", cost: "Passive", text: "You have a Fighting Style feat (see Your Feats) that improves your attacks or defense." },
    { name: "Weapon Mastery", cost: "Passive", text: "You can use the mastery property of three kinds of weapons you chose." },
  ],
  Rogue: [
    { name: "Sneak Attack", cost: "Free (once per turn)", text: "Once per turn, deal an extra 2d6 damage to a creature you hit with a Finesse or Ranged weapon, if you have Advantage on the attack or if an enemy of the target is within 5 ft of it and you don't have Disadvantage." },
    { name: "Cunning Action", cost: "Bonus Action", text: "On your turn, take the Dash, Disengage, or Hide action as a Bonus Action." },
    { name: "Steady Aim", cost: "Bonus Action", text: "If you haven't moved this turn, give yourself Advantage on your next attack roll this turn. Your Speed becomes 0 until the end of the turn." },
    { name: "Expertise", cost: "Passive", text: "You have Expertise (double your proficiency bonus) in two skills. They are marked on your Skills page." },
    { name: "Weapon Mastery", cost: "Passive", text: "You can use the mastery property of two kinds of weapons you chose." },
  ],
  Monk: [
    { name: "Martial Arts", cost: "Free", text: "Your Unarmed Strikes and Monk weapons deal damage using your Martial Arts die (a d6), and you can use Dexterity instead of Strength for their attack and damage rolls. When you take the Attack action on your turn, you can make one Unarmed Strike as a Bonus Action." },
    { name: "Unarmored Defense", cost: "Passive", text: "While you wear no armor and hold no Shield, your AC is 10 + your Dexterity modifier + your Wisdom modifier." },
    { name: "Flurry of Blows", cost: "1 Focus Point", text: "Right after you take the Attack action, spend 1 Focus Point to make two Unarmed Strikes as a Bonus Action." },
    { name: "Patient Defense", cost: "Free, or 1 Focus Point", text: "As a Bonus Action, take the Disengage action for free. Or spend 1 Focus Point to take both Disengage and Dodge, so attack rolls against you have Disadvantage until the start of your next turn." },
    { name: "Step of the Wind", cost: "Free, or 1 Focus Point", text: "As a Bonus Action, take the Dash action for free. Or spend 1 Focus Point to take both Dash and Disengage, and double your jump distance for the turn." },
    { name: "Unarmored Movement", cost: "Passive", text: "While you wear no armor and hold no Shield, your speed increases by 10 ft. This is already added into your Speed on page 1." },
    { name: "Deflect Attacks", cost: "Reaction (redirect costs 1 Focus Point)", text: "When an attack hits you and its damage includes Bludgeoning, Piercing, or Slashing, use your Reaction to reduce that attack's damage by 1d10 + your Dexterity modifier + your Monk level. If this reduces the damage to 0, you can spend 1 Focus Point to redirect the force: choose a creature within 5 ft (if the attack was melee) or within 60 ft (if it was ranged). That creature makes a Dexterity save or takes Force damage equal to two rolls of your Martial Arts die + your Dexterity modifier." },
    { name: "Slow Fall", cost: "Reaction", text: "When you fall, use your Reaction to reduce the falling damage you take by five times your Monk level." },
    { name: "Uncanny Metabolism", cost: "Once per run", text: "When you roll Initiative, you can regain all expended Focus Points and heal Hit Points equal to your Monk level + one roll of your Martial Arts die. Track this on the Uncanny Metabolism boxes." },
  ],
  Cleric: [
    { name: "Channel Divinity", cost: "Channel Divinity use", text: "You can channel divine power for special effects. You start with two options, Divine Spark and Turn Undead, plus your domain's option below. Track uses on your usage boxes above." },
    { name: "Divine Spark", cost: "Magic action (Channel Divinity use)", text: "Point at a creature within 30 ft and roll dice to either deal Radiant or Necrotic damage (it makes a save for half) or restore its Hit Points." },
    { name: "Turn Undead", cost: "Magic action (Channel Divinity use)", text: "Each Undead within 30 ft that can see or hear you must make a Wisdom save or spend 1 minute Frightened and forced to flee from you." },
    { name: "Divine Order", cost: "Passive", text: "You chose the Protector role: you gain proficiency with Martial weapons and Heavy armor." },
  ],
  Druid: [
    { name: "Wild Shape", cost: "Bonus Action (Wild Shape use)", text: "As a Bonus Action, transform into a Beast form you know for a time. Track uses on your usage boxes above." },
    { name: "Wild Companion", cost: "Magic action (spends Wild Shape or a spell slot)", text: "Spend a Wild Shape use or a spell slot to cast Find Familiar as a nature spirit, without material components." },
    { name: "Primal Order", cost: "Passive", text: "Your sacred role. Magician grants an extra Druid cantrip and a bonus to Arcana and Nature checks; Warden grants Martial weapon and Medium armor proficiency." },
  ],
  Bard: [
    { name: "Bardic Inspiration", cost: "Bonus Action (Bardic Inspiration use)", text: "As a Bonus Action, give a creature within 60 ft a Bardic Inspiration die (a d6). Within 10 minutes, it can add that die to one attack roll, ability check, or saving throw. Track uses on your usage boxes above." },
    { name: "Expertise", cost: "Passive", text: "You have Expertise (double your proficiency bonus) in two skills. They are marked on your Skills page." },
    { name: "Jack of All Trades", cost: "Passive", text: "Add half your proficiency bonus (rounded down) to any ability check that doesn't already use your proficiency bonus." },
  ],
  Sorcerer: [
    { name: "Innate Sorcery", cost: "Bonus Action (Innate Sorcery use)", text: "As a Bonus Action, unleash your innate magic for 1 minute: your spell save DC goes up by 1 and you have Advantage on the attack rolls of your Sorcerer spells. Track uses on your usage boxes above." },
    { name: "Font of Magic", cost: "Bonus Action (Sorcery Points)", text: "Spend Sorcery Points to create spell slots (2 points makes a level-1 slot, 3 makes level-2, 5 makes level-3), or turn an unused spell slot into Sorcery Points equal to its level." },
    { name: "Metamagic", cost: "Sorcery Points", text: "You can spend Sorcery Points to reshape your spells with your Metamagic options, listed below." },
  ],
  Warlock: [
    { name: "Magical Cunning", cost: "1 minute (Magical Cunning use)", text: "Spend 1 minute in a short rite to regain expended Pact Magic spell slots, up to half your maximum (rounded up). Track uses on your usage boxes above." },
    { name: "Eldritch Invocations", cost: "Passive", text: "You know Eldritch Invocations: special always-on or at-will magical perks (see Your Feats and Your Class)." },
  ],
  Wizard: [
    { name: "Arcane Recovery", cost: "Once (Arcane Recovery use)", text: "Recover expended spell slots totaling up to half your Wizard level (rounded up). Track uses on your usage boxes above." },
    { name: "Ritual Adept", cost: "Passive", text: "You can cast any spell in your spellbook that has the Ritual tag as a ritual (taking 10 extra minutes) without preparing it." },
  ],
  Paladin: [
    { name: "Lay On Hands", cost: "Bonus Action (Healing Pool)", text: "You have a healing pool equal to five times your Paladin level. As a Bonus Action, touch a creature to restore Hit Points from the pool, or spend 5 points from it to end one disease or the Poisoned condition. Track the pool on your usage boxes above." },
    { name: "Channel Divinity", cost: "Channel Divinity use", text: "You can channel divine power for special effects. You start with Divine Sense, plus your oath's option below. Track uses on your usage boxes above." },
    { name: "Divine Sense", cost: "Magic action (Channel Divinity use)", text: "For 10 minutes, you know the location and type of any Celestial, Fiend, or Undead within 60 ft that isn't behind Total Cover." },
    { name: "Paladin's Smite", cost: "Free (once per run)", text: "You always have the Divine Smite spell prepared, and once without spending a spell slot (normally recharges on a Long Rest, so treat it as once for this run)." },
    { name: "Weapon Mastery", cost: "Passive", text: "You can use the mastery property of two kinds of weapons you chose." },
  ],
  Ranger: [
    { name: "Favored Enemy: Hunter's Mark", cost: "Bonus Action (Hunter's Mark use)", text: "You always have Hunter's Mark prepared and can cast it without a spell slot a limited number of times (tracked on your usage boxes above). While it is up, you add 1d6 damage when you hit the marked target with a weapon." },
    { name: "Deft Explorer", cost: "Passive", text: "You gain Expertise in one skill (marked on your Skills page) and know two extra languages." },
    { name: "Weapon Mastery", cost: "Passive", text: "You can use the mastery property of two kinds of weapons you chose." },
  ],
  Artificer: [
    { name: "Magical Tinkering", cost: "Magic action", text: "While holding Tinker's Tools, use a Magic action to create one small useful item (such as Ball Bearings, a Flask, or a Pouch) in an open space within 5 ft." },
  ],
};

export const SUBCLASS_ABILITIES = {
  // Monk
  "Way of the Kensei (XGtE)": [
    { name: "Kensei Weapons", cost: "Passive", text: "Choose two weapon types (one must be ranged) to become Monk weapons for you, so they use your Martial Arts die and Dexterity." },
    { name: "Agile Parry", cost: "Free", text: "If you make an Unarmed Strike as part of the Attack action while holding a kensei melee weapon, you gain +2 AC until the start of your next turn." },
    { name: "Kensei's Shot", cost: "Free (Bonus Action)", text: "Before you make ranged attacks with a kensei weapon on your turn, use a Bonus Action to add 1d4 damage to each of those attacks that hits, until the end of the turn." },
  ],
  "Way of the Drunken Master (XGtE)": [
    { name: "Drunken Technique", cost: "Free (with Flurry of Blows)", text: "Whenever you use Flurry of Blows, you also gain the benefit of the Disengage action, and your walking speed increases by 10 ft until the end of the turn." },
    { name: "Bonus Proficiencies", cost: "Passive", text: "You gain proficiency in the Performance skill and with Brewer's Supplies." },
  ],
  // Barbarian
  "Path of the Berserker": [
    { name: "Frenzy", cost: "Free (while raging)", text: "If you use Reckless Attack while your Rage is active, the first creature you hit with a Strength-based attack on your turn takes extra damage: roll a number of d6s equal to your Rage Damage bonus (2 at your level)." },
  ],
  // Fighter
  Champion: [
    { name: "Improved Critical", cost: "Passive", text: "Your weapon and Unarmed Strike attacks score a Critical Hit on a roll of 19 or 20." },
    { name: "Remarkable Athlete", cost: "Passive", text: "You have Advantage on Initiative and Strength (Athletics) checks. Right after you score a Critical Hit, you can move up to half your Speed without provoking Opportunity Attacks." },
  ],
  "Arcane Archer": [
    { name: "Arcane Archer Lore", cost: "Passive", text: "You know the Druidcraft or Prestidigitation cantrip (using Intelligence) and gain a skill or tool proficiency." },
    { name: "Arcane Shot", cost: "Arcane Shot use", text: "Once per turn, when you make a ranged attack with a Simple or Martial weapon, you can apply one of your Arcane Shot options (listed below). Track uses on your usage boxes above." },
  ],
  // Rogue
  Assassin: [
    { name: "Assassinate", cost: "Passive / Free", text: "You have Advantage on Initiative. During the first round of combat you have Advantage on attack rolls against any creature that hasn't taken a turn yet, and the first time you Sneak Attack such a creature that round, it takes extra damage equal to your Rogue level." },
    { name: "Assassin's Tools", cost: "Passive", text: "You gain a Disguise Kit and a Poisoner's Kit and proficiency with both." },
  ],
  "Arcane Trickster": [
    { name: "Mage Hand Legerdemain", cost: "Bonus Action", text: "You can cast Mage Hand as a Bonus Action and make the spectral hand Invisible. You can control it as a Bonus Action and use it to make Sleight of Hand checks, pick locks, and disarm traps at a distance." },
  ],
  // Cleric
  "War Domain": [
    { name: "War Priest", cost: "Bonus Action (War Priest use)", text: "As a Bonus Action, make one attack with a weapon or an Unarmed Strike. You can do this a number of times equal to your Wisdom modifier. Track uses on your usage boxes above." },
    { name: "Guided Strike", cost: "Channel Divinity use", text: "When you or a creature within 30 ft misses with an attack roll, spend one Channel Divinity use to add +10 to that roll, often turning the miss into a hit." },
  ],
  "Life Domain": [
    { name: "Disciple of Life", cost: "Passive", text: "When you restore Hit Points to a creature with a leveled spell, it regains extra Hit Points equal to 2 + the spell's level." },
    { name: "Preserve Life", cost: "Magic action (Channel Divinity use)", text: "Spend one Channel Divinity use to restore Hit Points equal to five times your Cleric level, split among Bloodied creatures within 30 ft. You can't raise anyone above half their Hit Point maximum." },
  ],
  // Druid
  "Circle of the Moon": [
    { name: "Circle Forms", cost: "Passive (with Wild Shape)", text: "Your Wild Shape Beast forms can be tougher: the form's Challenge Rating can be up to your Druid level divided by 3, and its AC equals 13 + your Wisdom modifier if that is higher. While in a form, you can spend a spell slot as a Bonus Action to regain 1d8 Hit Points per level of the slot." },
    { name: "Circle of the Moon Spells", cost: "Passive", text: "You always have certain spells prepared, and you can cast them even while in Wild Shape." },
  ],
  "Circle of the Land": [
    { name: "Land's Aid", cost: "Magic action (Wild Shape use)", text: "Spend a Wild Shape use to bloom life-draining thorns in a 10-ft radius within 60 ft. Creatures you choose there make a Constitution save, taking 2d6 Necrotic on a failure (half on a success), and one creature you choose there regains 2d6 Hit Points." },
    { name: "Circle of the Land Spells", cost: "Passive", text: "After each Long Rest you choose a land type (arid, polar, temperate, or tropical) and always have its spells prepared." },
  ],
  // Bard
  "College of Lore": [
    { name: "Cutting Words", cost: "Reaction (Bardic Inspiration use)", text: "When a creature within 60 ft makes a damage roll, or succeeds on an attack roll or ability check, use your Reaction and spend a Bardic Inspiration die to subtract that die from the roll, possibly turning a hit into a miss." },
    { name: "Bonus Proficiencies", cost: "Passive", text: "You gain proficiency with three extra skills." },
  ],
  "College of the Moon": [
    { name: "Primal Lore", cost: "Passive", text: "You learn Druidic and one Druid cantrip that counts as a Bard spell for you." },
    { name: "Moon's Inspiration", cost: "Free (with Bardic Inspiration)", text: "When you give a creature a Bardic Inspiration die, you can also grant a moon-themed benefit, such as letting it briefly turn Invisible (Inspired Eclipse). See your subclass write-up for the full options." },
  ],
  // Sorcerer
  "Wild Magic Sorcery": [
    { name: "Wild Magic Surge", cost: "Free", text: "Once per turn, right after you cast a Sorcerer spell using a spell slot, you can roll 1d20. On a 20, roll on the Wild Magic Surge table for a random magical effect." },
    { name: "Tides of Chaos", cost: "Free (Tides of Chaos use)", text: "Give yourself Advantage on one attack roll, ability check, or saving throw. After you use it, you must cast a Sorcerer spell with a slot (or finish a rest) before using it again. Track uses on your usage boxes above." },
  ],
  "Spellfire Sorcery": [
    { name: "Spellfire Burst", cost: "Free (once per turn)", text: "Once per turn, when you spend at least 1 Sorcery Point as part of a Magic action or Bonus Action, you can unleash a Spellfire effect of your choice, such as Bolstering Flames. See your subclass write-up for the full list of options." },
    { name: "Spellfire Spells", cost: "Passive", text: "You always have certain spells prepared, including healing and fire spells." },
  ],
  // Warlock
  "Fiend Patron": [
    { name: "Dark One's Blessing", cost: "Free", text: "When you reduce an enemy to 0 Hit Points (or an ally does so while you are within 10 ft of that enemy), you gain Temporary Hit Points equal to your Charisma modifier + your Warlock level." },
    { name: "Fiend Spells", cost: "Passive", text: "You always have certain fiendish spells prepared." },
  ],
  "The Hexblade (XGtE)": [
    { name: "Hexblade's Curse", cost: "Bonus Action (Hexblade's Curse use)", text: "As a Bonus Action, curse a creature you can see within 30 ft for 1 minute: you add your proficiency bonus to damage against it, your attacks score Critical Hits against it on a 19 or 20, and if it dies you regain Hit Points equal to your Warlock level + your Charisma modifier. Track uses on your usage boxes above." },
    { name: "Hex Warrior", cost: "Passive", text: "You gain proficiency with Medium armor, Shields, and Martial weapons, and you can use Charisma instead of Strength or Dexterity for the attack and damage rolls of one weapon you bond with." },
  ],
  // Wizard
  Conjurer: [
    { name: "Benign Transposition", cost: "Bonus Action (Benign Transposition use)", text: "As a Bonus Action, teleport up to 30 ft to a space you can see, or swap places with a willing Medium or smaller creature. It recharges when you cast a Conjuration spell of level 1 or higher. Track uses on your usage boxes above." },
    { name: "Conjuration Savant", cost: "Passive", text: "You added two Conjuration spells to your spellbook for free, and you can copy Conjuration spells into it more cheaply." },
  ],
  Bladesinger: [
    { name: "Training in War and Song", cost: "Passive", text: "You gain proficiency with light Melee Martial weapons and can use one as a spellcasting focus. You also gain proficiency in the Performance skill." },
    { name: "Bladesong", cost: "Bonus Action (Bladesong use)", text: "As a Bonus Action (while wearing no armor and using no Shield), start your Bladesong for 1 minute: add your Intelligence modifier to your AC, gain +10 ft Speed, Advantage on Acrobatics checks, and a bonus to Concentration saves. Track uses on your usage boxes above." },
  ],
  // Paladin
  "Oath of Devotion": [
    { name: "Sacred Weapon", cost: "Free with Attack (Channel Divinity use)", text: "When you take the Attack action, spend one Channel Divinity use to add your Charisma modifier to a Melee weapon's attack rolls for 10 minutes. The weapon also sheds bright light." },
  ],
  "Oathbreaker (DMG)": [
    { name: "Control Undead", cost: "Magic action (Channel Divinity use)", text: "Target one Undead within 30 ft; it must succeed on a Charisma save or obey your commands for 24 hours." },
    { name: "Dreadful Aspect", cost: "Magic action (Channel Divinity use)", text: "Creatures of your choice within 30 ft must succeed on a Wisdom save or be Frightened of you for 1 minute." },
  ],
  // Ranger
  "Fey Wanderer": [
    { name: "Dreadful Strikes", cost: "Free (once per turn per target)", text: "When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage." },
    { name: "Otherworldly Glamour", cost: "Passive", text: "Add your Wisdom modifier (at least +1) to your Charisma checks, and you gain a Charisma-based skill proficiency." },
  ],
  "Gloom Stalker": [
    { name: "Dread Ambusher", cost: "Free / part of Attack", text: "At the start of your first turn of each combat, your Speed increases by 10 ft, and when you take the Attack action you can make one extra weapon attack that turn. That extra attack deals an extra 1d8 damage on a hit." },
    { name: "Umbral Sight", cost: "Passive", text: "You gain Darkvision 60 ft, and while you are in Darkness you are Invisible to any creature that relies on Darkvision to see you." },
  ],
  // Artificer
  Artillerist: [
    { name: "Eldritch Cannon", cost: "Magic action (Eldritch Cannon use)", text: "Using Smith's or Woodcarver's Tools, take a Magic action to create a Small or Tiny Eldritch Cannon within 5 ft. Choose Flamethrower (15-ft cone, 2d8 Fire, Dexterity save for half), Force Ballista (120 ft, ranged spell attack, 2d8 Force and push the target 5 ft), or Protector (grants Temporary Hit Points to nearby allies). As a Bonus Action you can activate the cannon or move it up to 15 ft. Track uses on your usage boxes above." },
    { name: "Tools of the Trade", cost: "Passive", text: "You gain proficiency with Martial Ranged weapons and Woodcarver's Tools." },
  ],
};

export function classAbilities(model) {
  const base = CLASS_ABILITIES[model.className];
  if (!base) return null;
  const sub = SUBCLASS_ABILITIES[model.subclass] || [];
  const list = [...base, ...sub];
  const opt = (n) => OPTION_EXPLAIN[normResName(n)];
  // Inject the character's own picks that spend a resource.
  if (model.className === "Sorcerer") {
    for (const m of model.metamagic || []) {
      const t = opt(m);
      if (t) list.push({ name: m, cost: "Metamagic (Sorcery Points)", text: t });
    }
  }
  if (model.subclass === "Arcane Archer") {
    for (const o of model.metamagic || []) {
      const t = opt(o);
      if (t) list.push({ name: o, cost: "Arcane Shot option", text: t });
    }
  }
  return list;
}

// Sorcery points = sorcerer level (from level 2). Handled specially in the model.

// Spell summaries. Structured facts (time/range/save/attack/duration) also come from
// the DDB JSON; this adds a short plain-language effect line and confirms the key facts.
export const SPELL_SUMMARY = {
  "Blade Ward": { time: "Action", range: "Self", effect: "Until your next turn, when a creature hits you with a melee attack it takes 1d4 force damage. No concentration." },
  "Fire Bolt": { time: "Action", range: "120 ft", attack: true, effect: "Ranged spell attack. Hit: 1d10 fire. Can ignite unattended flammable objects." },
  "Create Bonfire": { time: "Action", range: "60 ft", save: "DEX", conc: true, effect: "Make a 5 ft bonfire. A creature in it (or entering) takes 1d8 fire on a failed DEX save. Concentration, up to 1 minute." },
  "Sorcerous Burst": { time: "Action", range: "120 ft", attack: true, dmg: "1d8 (choose type)", effect: "Ranged spell attack. Hit: 1d8 of a damage type you pick (acid, cold, fire, lightning, poison, psychic, or thunder)." },
  "Moment to Think": { time: "Bonus Action", range: "Self", effect: "A quick mental beat. Confirm the exact benefit with your DM." },
  "Sacred Flame": { time: "Action", range: "60 ft", save: "DEX", effect: "Target makes a DEX save or takes 1d8 radiant. Cover does not help the save. No concentration." },
  "Shocking Grasp": { time: "Action", range: "Touch", attack: true, effect: "Melee spell attack. Hit: 1d8 lightning, and the target can't take reactions until its next turn. Advantage vs targets in metal armor." },
  "Acid Splash": { time: "Action", range: "60 ft", save: "DEX", effect: "One or two close creatures make a DEX save or take 1d6 acid. No concentration." },
  "Chaos Bolt": { time: "Action", range: "120 ft", attack: true, effect: "Ranged spell attack. Hit: 2d8 + 1d6 damage; the d8s' matching type sets the damage, and matching d8s can leap to a new target. 1st-level or higher slot." },
  "Catapult": { time: "Action", range: "60 ft", save: "DEX", effect: "Hurl one loose object; a creature in its path takes 3d8 bludgeoning on a failed DEX save. 1st-level or higher slot." },
  "Grease": { time: "Action", range: "60 ft", save: "DEX", effect: "A 10 ft square becomes slippery. Creatures there fall Prone on a failed DEX save. 1st-level or higher slot." },
  "Witch Bolt": { time: "Action", range: "30 ft", attack: true, conc: true, effect: "Ranged spell attack. Hit: 2d12 lightning, then each later turn you can deal 1d12 without another roll while concentrating. 1st-level or higher slot." },
  "Guiding Bolt": { time: "Action", range: "120 ft", attack: true, effect: "Ranged spell attack. Hit: 4d6 radiant, and the next attack against that target has Advantage. 1st-level or higher slot." },
  "Detect Magic": { time: "Action", range: "Self (30 ft)", conc: true, effect: "Sense magic within 30 ft and learn each aura's school. Concentration, up to 10 minutes." },
  "Vortex Warp": { time: "Action", range: "90 ft", save: "CON", effect: "Teleport one creature you can see to an open space within range; unwilling creatures get a CON save. 2nd-level or higher slot." },
  "Misty Step": { time: "Bonus Action", range: "Self", effect: "Teleport up to 30 ft to an open space you can see. No concentration." },
};
