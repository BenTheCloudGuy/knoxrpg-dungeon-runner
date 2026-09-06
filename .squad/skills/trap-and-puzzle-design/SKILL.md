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

Traps live as a `### TRAP` block inside a room in a Dungeon Section page (see [ArtificersLair.md](../../../rooms/ArtificersLair.md)). Hand the read-aloud line to Marcille.

```markdown
### TRAP

**Read Aloud (when triggered)**
> [Optional. One or two sentences for when the trap fires. Hand to Marcille for final phrasing.]

- **Type**: [Mechanical / magical, plus the area it affects and where is safe]
- **Trigger**: [Pressure plate / tripwire / proximity / opened container / magic word / line-of-sight / passive. Be specific about distance and timing.]
- **Detection**:
  - Perception DC [N]: [what the PCs actually see that gives it away]
  - Investigation DC [N]: [what a closer look reveals]
- **Deactivate**: [Tool, spell, or skill check + DC, or state it cannot be stopped by mechanical means]
  - **Success** - [result]
  - **Failure** - [result. State whether the failed save itself deals damage.]
  - [Escalation / Natural 20 / Countermeasure / Reset as needed]

#### [Named Mechanic, when the effect needs its own rules]

**Save DC**: [N] [Ability]

[Damage dice + type, a round-by-round table, or an initiative-count expansion table. State whether half-on-save applies.]

#### HISTORY
> [!NOTE] GM NOTE
> [Why this trap is here. Who built it. What it guards. TPK warning if a bad roll can wipe multiple PCs.]
```

Every save-or-die still needs a real, findable countermeasure. State it under **Deactivate** or in the HISTORY callout.

## Puzzle format

Puzzles are not traps. They're decision problems with a mechanical resolution. Same lethality contract applies if failure damages or kills. A puzzle uses a `### PUZZLE` block in place of `### TRAP`.

```markdown
### PUZZLE

**Read Aloud**
> [Read-aloud setup. Hand to Marcille.]

- **Premise**: [What the PCs see and what they're trying to solve.]
- **Solve (intended)**: [The clean solve. What check, what DC, what action sequence.]
- **Solve (clever)**: [How a smart party can bypass.]
- **Failure**: [What happens on a wrong answer. Damage dice, saves, doors locking, room flooding. State whether retries are allowed.]
- **Hint chain**: [What the party can find that progressively gives away the solve. Tie to Perception / Investigation / Arcana / History DCs.]
- **Time pressure**: [None, or a clock. "The room fills with water at 1 ft / round."]

#### HISTORY
> [!NOTE] GM NOTE
> [Which crystal this puzzle gates, if any. Common wrong solves and what the DM should do. Xhal'theris commentary cues.]
```

## Step-by-step

1. Identify what the trap or puzzle is *for*: gating a crystal, slowing the party, killing the greedy, testing a specific skill, or pure spectacle.
2. Pick a damage band that fits the lethality budget for this point in the dungeon.
3. Write the Trigger / Effect / Detect / Disable / Countermeasures (or the Premise / Path A / Path B / Failure / Hints).
4. Run the **lethality contract** checks above. If a save-or-die has no countermeasure, fix it before publishing.
5. Drop the block into the relevant room in the Dungeon Section page under a `### TRAP` or `### PUZZLE` heading.
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

- [rooms/ArtificersLair.md](../../../rooms/ArtificersLair.md): Room 1 (timed crush trap with a cinematic brace countermeasure) and Room 2 (Grovlikk's cloud, a solve-the-joke puzzle-trap) are the current trap and puzzle precedent
