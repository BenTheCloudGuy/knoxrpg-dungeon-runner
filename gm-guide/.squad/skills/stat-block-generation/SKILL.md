# Stat Block Generation (5e 2024)

**Owner:** Chilchuck
**Confidence:** high

## Core rule (read first)

This mirrors the Stat Block Policy in [Chilchuck's charter](../../agents/chilchuck/charter.md) and supersedes any earlier guidance about custom mechanic design or "calibrating up" by changing stats.

1. **Default to official stats.** For any creature that exists in D&D 5e, use its official published stat block as written. Use the 2024 Monster Manual. If only a 2014 entry exists, present it in 2024 format but keep its real numbers. Do not re-tune HP, AC, or CR, do not add scenario-specific traits, and do not invent homebrew mechanics for this dungeon.
2. **Convert non-5e monsters.** If a creature is not a 5e monster (for example a Pathfinder creature or one from any other system), convert it faithfully into a proper 5e 2024 stat block using standard 2024 monster-design math, so the result reads exactly like an official 2024 Monster Manual entry.
3. **No custom scenario-based homebrew.** Every stat block must read as if it were printed in the official 2024 rules. No bespoke one-off powers invented for the Vault.
4. **Calibrate by selection and quantity, not stat surgery.** Tune fights for the big party by choosing appropriate official monsters and adjusting how many appear, not by editing individual stat blocks. Keep the party math in view (8 to 12 level-3 PCs, 40 HP cap, limited rests, lethal intent), but the lever is monster choice and count. Tactics, placement, treasure-on-body, and TPK warnings are not part of the stat block; that campaign context belongs in the relevant room file.

## When to use

Use this skill whenever the user asks for:

- An official monster, NPC, or construct stat block presented in 2024 format
- An existing official stat block shown in 2024 format, or reskinned by name and flavor only without changing its numbers
- Converting a non-5e creature (Pathfinder or another system) into a faithful 5e 2024 stat block

For trap mechanics or puzzle DCs, use [trap-and-puzzle-design](../trap-and-puzzle-design/SKILL.md) instead.

## Reference order (read before writing)

1. **D&D 2024 Monster Manual, PHB, DMG** — primary rules reference
2. [README.md](../../../README.md) — party composition (8–12 PCs, level 3, 40 HP cap, 3 short rests max)
3. [thoughts.md](../../../thoughts.md) — known creature slots (Fire Elementals + Imps in lava, Sentry in Artificer's Lair, Mimic Lake variants)
4. Existing rooms — [ArtificersLair.md](../../../rooms/ArtificersLair.md) (current-dungeon monsters and traps; more rooms pending)
5. [.squad/decisions.md](../../decisions.md) — encounter calibration decisions

## Party math (the calibration constraint)

- 8 to 12 PCs at level 3
- 40 HP cap per PC (no bigger pool after this)
- No long rests
- Three short rests total across the whole run, 15 real-time minutes each, 1 HD per rest
- Action economy at this scale breaks normal encounter-building math. The party can stack damage on a single target very fast.

Calibration rules of thumb (not Math, just patterns that have held up):

- A single boss-style stat block at CR 5 is paper for this party unless it has legendary actions, lair actions, or minions
- Hordes of CR 1/2 to CR 1 monsters scale better as a threat than one big enemy
- Save-or-die effects are allowed but MUST have a countermeasure (a clue, an alternate path, a forewarning)
- Lethality is the point. When in doubt add more official monsters or pick a tougher official creature, never rewrite a stat block. Record potential TPKs in the relevant room file, not in the stat block.

## Stat block format (2024 Monster Manual)

```markdown
## [Creature Name]

*[Size] [Type], [Alignment]*

**Armor Class** [AC] ([source])
**Hit Points** [HP] ([hit dice])
**Speed** [feet], [other speeds]

| STR | DEX | CON | INT | WIS | CHA |
|-----|-----|-----|-----|-----|-----|
| [score] ([mod]) | … | … | … | … | … |

**Saving Throws** [list]
**Skills** [list]
**Damage Resistances** [list]
**Damage Immunities** [list]
**Condition Immunities** [list]
**Senses** [list], passive Perception [N]
**Languages** [list]
**Challenge** [CR] ([XP]) **Proficiency Bonus** +[N]

### Traits

***[Trait Name].*** [Effect in plain language.]

### Spellcasting (if applicable)

The [creature] casts the following spells, using [ability] as the spellcasting ability (spell save DC [N], +[N] to hit with spell attacks):

- ***At will:*** [spell] — [range, save/attack, damage/effect, duration, concentration]
- ***[N]/day each:*** [spell] — [inline summary]

### Actions

***Multiattack.*** [Description.]

***[Attack Name].*** *Melee/Ranged Weapon Attack:* +[N] to hit, reach [feet] or range [feet], one target. *Hit:* [damage dice] [type] damage.

### Bonus Actions (if any)
### Reactions (if any)
### Lair Actions (if applicable)
### Legendary Actions (if applicable)
```

## Spell summaries (mandatory for spellcasters)

Every spell listed MUST include an inline summary so the DM doesn't open a rulebook mid-encounter:

- Range
- Save type or attack roll
- Damage dice and type
- Duration
- Concentration requirement
- Key mechanical effect in plain language

Example:

```
- *Fireball* — 150 ft. range, 20 ft. radius. 8d6 fire damage. DEX save DC 15 for half.
- *Hold Person* — 60 ft. Target humanoid: WIS save DC 15 or be paralyzed. Repeat save at end of each of its turns. Concentration, up to 1 min.
```

## Step-by-step

1. Confirm the creature's role (mook / elite / boss / swarm / construct) and which room it lives in.
2. Pick a CR band from the role guide below and select an official monster that fits.
3. Build the stat block in the format above, using the official numbers (or a faithful 2024 conversion for non-5e creatures).
4. Calibrate against the party math by choosing the right official monster and count: would a single round of focused fire kill it? If the fight is off, change which official monster you use or how many appear, do not edit the stat block.
5. Keep tactics, placement, treasure-on-body, and TPK warnings out of the stat block. Put that campaign context in the relevant room file or handoff notes.
6. If the creature guards a crystal, tag a handoff to Falin so the prize entry stays in sync.
7. Place the stat block inside the relevant `rooms/*.md` file under a `## Stat Block` heading, or in a dedicated stat block file if the user asks.

## Role guide

| Role | CR Range | HP Range | Key feature |
| --- | --- | --- | --- |
| Trash mob (single use) | 1/4 to 1 | 10 to 30 | Pack tactics, one good hit, dies fast |
| Standard threat | 1 to 3 | 30 to 75 | Multiattack, one notable trait |
| Elite | 3 to 6 | 75 to 130 | Reactions, condition effects, harder save DCs |
| Mini-boss / crystal guardian | 5 to 8 | 100 to 160 | Lair actions or legendary actions, telegraphed save-or-die |
| Boss / Black Crystal guardian | 7 to 11 | 150 to 240 | Lair + legendary, multiple phases, real TPK threat |
| Swarm | 2 to 5 | 50 to 80 | Official swarm stat block, area damage on the party |

> The role and CR guide is for PICKING official monsters that fit an encounter, not for inventing new ones. Match a role to a real 2024 Monster Manual creature.

## Rules

- Default to official stats. Use published 5e stat blocks as written; if only a 2014 entry exists, present it in 2024 format with its real numbers. Do not re-tune HP, AC, or CR.
- Non-5e monsters get converted to a faithful 5e 2024 stat block. Nothing should look homebrewed.
- No custom scenario-based mechanics. Every stat block reads as if printed in the official 2024 rules.
- No em-dashes anywhere, including in rules text.
- Every spell gets an inline summary. No exceptions.
- Save-or-die effects MUST have a countermeasure documented in the room file. If they don't, flag it back to Laios.
- Don't invent monsters that contradict the zone (no Fire Elementals in the cells, no goblins in the lava).
- Calibrate by picking official monsters and adjusting how many appear, not by editing stat blocks. When in doubt, add more or pick a tougher official creature, and put any TPK warning in the relevant room file.
- Don't modify [prizes.md](../../../prizes.md). That's Falin's file.

## Learned from

- [rooms/ArtificersLair.md](../../../rooms/ArtificersLair.md) — current-dungeon trap and creature precedent (Room 1 crush trap, Room 2 cloud puzzle-trap, Room 5 skeletons)
- [thoughts.md](../../../thoughts.md) — Sentry, Fire Elemental, Imp, Mirror Trap creature slots
