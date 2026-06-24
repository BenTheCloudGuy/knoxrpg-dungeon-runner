# Trap & Puzzle Design

**Owner:** Chilchuck
**Confidence:** high

## When to use

Use this skill whenever the user asks for:

- A new trap (mechanical or magical)
- A puzzle that resolves with checks, saves, or action economy (chess puzzle, color-coded puzzle, ROYGBIV sequence, sphere of annihilation interaction, mirror trap)
- A revision to an existing trap (re-tune DC, add a countermeasure, raise damage)

For creature stat blocks, use [stat-block-generation](../stat-block-generation/SKILL.md). For the read-aloud reveal text, hand to Marcille via [narrative-prose](../narrative-prose/SKILL.md).

## The lethality contract

This dungeon is supposed to kill people. Traps and puzzles are how it does most of the killing. The rules are:

1. **Save-or-die is allowed.** This dungeon has a sphere of annihilation. It can vaporize a PC. That's the point.
2. **Every save-or-die MUST have a countermeasure.** Not a "maybe they noticed." A real, findable, in-fiction warning: a body, a scorch mark, a clue from Xhal'theris, a previous room's handout, a Scrying Stone reading. If there's no countermeasure, raise it back to Laios before locking the trap.
3. **Detect / Disable DCs must be reachable by a level-3 party.** With +5 proficient skills and 8-12 PCs, a DC of 15 to 17 will be hit by someone. DC 20+ is rare and should gate optional loot, not the main path.
4. **Telegraph the trap.** The room file should make it obvious *something is wrong* even if the PCs don't know what. Marcille's read-aloud carries this.
5. **Reset rules matter.** If a trap resets, say so. Otherwise the third PC into the room walks through clean and the players notice.

## Trap format

```markdown
## [Trap Name]

> [One or two sentences for when the trap fires. Hand to Marcille for final phrasing.]

**Trigger:** [Pressure plate / tripwire / proximity / opened container / magic word / line-of-sight / passive — be specific about distance and timing]
**Effect:** [Damage dice + type, save type + DC, secondary effects (prone, restrained, stunned, on fire). State whether half-on-save applies.]
**Detect:** Passive Perception [N] or Investigation DC [N]. **Clue:** [What the PCs actually see that gives it away.]
**Disable:** [Tool, spell, skill check, DC. State who can do it.]
**Countermeasures:** [How a clever party can bypass without rolling. At least one option.]
**Reset:** [Yes / No. If yes, how long.]

### DM Notes

- [Why this trap is here. Who built it. What it guards.]
- [TPK warning if a bad roll can wipe multiple PCs.]
- [How it interacts with adjacent rooms or the crystal it guards.]
```

## Puzzle format

Puzzles are not traps. They're decision problems with a mechanical resolution. Same lethality contract applies if failure damages or kills.

```markdown
## [Puzzle Name]

> [Read-aloud setup. Hand to Marcille.]

**Premise:** [What the PCs see and what they're trying to solve.]
**Resolution path A (intended):** [The clean solve. What check, what DC, what action sequence.]
**Resolution path B (clever):** [How a smart party can bypass.]
**Failure state:** [What happens on wrong answer. Damage dice, saves, doors locking, room flooding. State whether retries are allowed.]
**Hint chain:** [What the party can find in the room that progressively gives away the solve. Tie to Perception / Investigation / Arcana / History DCs.]
**Time pressure:** [None, or a clock — "the room fills with water at 1 ft / round."]

### DM Notes

- [Which crystal this puzzle gates, if any.]
- [Common wrong solves and what the DM should do.]
- [Interactions with Xhal'theris commentary if he taunts during it.]
```

## Step-by-step

1. Identify what the trap or puzzle is *for*: gating a crystal, slowing the party, killing the greedy, testing a specific skill, or pure spectacle.
2. Pick a damage band that fits the lethality budget for this point in the dungeon.
3. Write the Trigger / Effect / Detect / Disable / Countermeasures (or the Premise / Path A / Path B / Failure / Hints).
4. Run the **lethality contract** checks above. If a save-or-die has no countermeasure, fix it before publishing.
5. Drop the block into the relevant `rooms/*.md` file under `## Trap` or `## Puzzle`.
6. Hand the read-aloud to Marcille. Hand any prop requirements to Senshi. If it guards a crystal, hand the crystal impact to Falin.

## Damage bands (for a level-3 party with 40 HP cap)

| Severity | Damage on failed save | Damage on success | When to use |
| --- | --- | --- | --- |
| Nuisance | 2d6 to 3d6 | half or 0 | Most rooms. Punishes carelessness, doesn't kill on its own. |
| Punisher | 4d6 to 6d6 | half | Gear-gated traps, mid-dungeon |
| Brutal | 8d6 to 10d6 | half | Crystal-adjacent traps, late dungeon |
| Save-or-die | n/a (instant) | n/a | Black Crystal area only, always with countermeasure |

A 40 HP PC is down at 0. Track it. If a single fail can drop two PCs to dying, that's a TPK risk and it goes in DM Notes.

## Rules

- No em-dashes.
- Every save-or-die has a countermeasure. No exceptions.
- Telegraph everything. The trap should be *findable*, even if it's hard to find.
- Don't change a trap's damage band without telling Laios — it changes the room's role in the lethality budget.
- Don't invent a trap that contradicts an existing room file. Read the room before writing the trap.

## Learned from

- [rooms/sphere_anniliation.md](../../../rooms/sphere_anniliation.md) — the canonical save-or-die-with-countermeasure precedent
- [rooms/colorcodedtrap.md](../../../rooms/colorcodedtrap.md) — telegraphed-trap format
- [rooms/chess_puzzle.md](../../../rooms/chess_puzzle.md), [rooms/rainbowroom.md](../../../rooms/rainbowroom.md) — puzzle precedent with hint chains
