# Stat Block Generation (5e 2024)

**Owner:** Chilchuck
**Confidence:** high

## When to use

Use this skill whenever the user asks for:

- A new monster, NPC, or construct stat block
- A revision to an existing stat block (re-tune HP, swap a spell, raise CR)
- A custom creature for this dungeon (Sentry construct, Mirror Trap creature, swarm variants)

For trap mechanics or puzzle DCs, use [trap-and-puzzle-design](../trap-and-puzzle-design/SKILL.md) instead.

## Reference order (read before writing)

1. **D&D 2024 Monster Manual, PHB, DMG** — primary rules reference
2. [README.md](../../../README.md) — party composition (8–12 PCs, level 3, 40 HP cap, 3 short rests max)
3. [thoughts.md](../../../thoughts.md) — known creature slots (Fire Elementals + Imps in lava, Sentry in Artificer's Lair, Mimic Lake variants)
4. Existing rooms — [sphere_anniliation.md](../../../rooms/sphere_anniliation.md), [mimic_lake.md](../../../rooms/mimic_lake.md), [goblins_lair.md](../../../rooms/goblins_lair.md), [colorcodedtrap.md](../../../rooms/colorcodedtrap.md)
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
- Lethality is the point. Calibrate up when in doubt. Flag potential TPKs in DM Notes.

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

### DM Notes

- [Tactical notes: how it opens combat, what it does bloodied, what it does at 1 HP]
- [Which room it lives in / which crystal it guards]
- [Calibration warning if this can TPK the party with one bad roll]
- [Treasure on the body, if any]
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
2. Pick a CR band from the role guide below.
3. Build the stat block in the format above.
4. Calibrate against the party math: would a single round of focused fire kill it? Should it?
5. Write the DM Notes section: opening move, bloodied behavior, last-stand behavior, TPK warnings, treasure.
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
| Swarm | 2 to 5 | 50 to 80 | Custom per-unit scaling, area damage on the party |

## Rules

- No em-dashes anywhere, including in rules text.
- Every spell gets an inline summary. No exceptions.
- Save-or-die effects MUST have a countermeasure documented in the room file. If they don't, flag it back to Laios.
- Don't invent monsters that contradict the zone (no Fire Elementals in the cells, no goblins in the lava).
- When in doubt, calibrate up. Then write the TPK warning in DM Notes so the DM at least knows.
- Don't modify [prizes.md](../../../prizes.md). That's Falin's file.

## Learned from

- [rooms/sphere_anniliation.md](../../../rooms/sphere_anniliation.md) — save-or-die with countermeasure precedent
- [rooms/mimic_lake.md](../../../rooms/mimic_lake.md), [rooms/goblins_lair.md](../../../rooms/goblins_lair.md) — existing creature placements
- [thoughts.md](../../../thoughts.md) — Sentry, Fire Elemental, Imp, Mirror Trap creature slots
