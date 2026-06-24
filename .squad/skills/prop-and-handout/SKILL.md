# Prop & Handout Production

**Owner:** Senshi
**Confidence:** high

## When to use

Use this skill whenever the user asks for:

- A new physical prop (item card, crystal token, Scrying Stone, Artificer's Cube, key, decoder, terrain piece)
- A handout that goes to the players as a physical artifact (letter, map fragment, journal page, contract)
- Dwarven Forge terrain notes for a room (which pieces, footprint, dressing, swap-outs)
- Table logistics (printing notes, transport, candle/sharp hazards)

Hand any in-world *text* on a prop or handout to Marcille via [narrative-prose](../narrative-prose/SKILL.md). Hand mechanical effects (DC to activate, charges, unlock conditions) to Chilchuck via [stat-block-generation](../stat-block-generation/SKILL.md) or [trap-and-puzzle-design](../trap-and-puzzle-design/SKILL.md).

## Reference order

1. [thoughts.md](../../../thoughts.md) — "Switch to Poker Chips with picture of items" note; Lava Room / Artificer's Lair prop ideas
2. Existing props — [props/scryingstone.md](../../../props/scryingstone.md), [props/ArtificersCube.md](../../../props/ArtificersCube.md), [props/healthpotions.md](../../../props/healthpotions.md), [props/itemcards.md](../../../props/itemcards.md), [props/rainbowroomClue.md](../../../props/rainbowroomClue.md)
3. Existing handouts — [handouts/grolvikk’s-fate.md](../../../handouts/grolvikk’s-fate.md), [handouts/prisoners-letter.md](../../../handouts/prisoners-letter.md)
4. [prizes.md](../../../prizes.md) — what the Scrying Stone has to reveal
5. Room files in [rooms/](../../../rooms/) — for what physical pieces each room needs

## Prop spec format

Every prop file in [props/](../../../props/) answers four questions:

```markdown
# [Prop Name]

## What is it

[One paragraph. What the object is in-fiction. Keep it short.]

## What does it do at the table

[How the DM uses it. When it gets handed out. What player action triggers it.]

## How does the DM use it (procedure)

1. [Step-by-step at-the-table procedure.]
2. [Including what to say, what to hand the player, what to take back.]
3. [Including any DM-only state — "do not show the back of this card to the players."]

## How to make it / source it

- **Material:** [Poker chip / cardstock / acrylic / printed paper / 3D print / found object]
- **Size:** [Dimensions.]
- **Quantity needed:** [How many. Spares?]
- **Where to print / source:** [Specific. "Drivethrucards.com," "Avery 5160 labels," "Goodwill candleholder."]
- **Hazards:** [Sharp edges, heat, ink that bleeds, things players might pocket and lose.]

## In-world text (if any)

[If the prop carries text the players read, this section is Marcille's. Senshi stubs it; Marcille writes the final.]
```

## Handout spec format

Handouts in [handouts/](../../../handouts/) are physical artifacts the players keep. They are part prop, part prose. Senshi specs the *physical object*; Marcille writes the *words*.

```markdown
# [Handout Name]

## What is it (in-fiction)

[A letter from / a journal page belonging to / a contract signed by …]

## What it looks like (physical spec)

- **Paper:** [Plain white printer, parchment cardstock, burned-edge paper, tea-stained.]
- **Print:** [Color or B/W. Specific font if it matters. Handwritten vs typed.]
- **Size:** [Letter, half-sheet, business card, scroll.]
- **Distress:** [Crumpled, torn corner, blood stain, wax seal.]
- **Quantity:** [One copy, or one per player.]

## When the DM hands it out

[What room. What trigger — found on a body, dropped from a ceiling, handed by Xhal'theris.]

## The text

[Stubbed by Senshi; Marcille writes the final voice-correct version. Link the relevant entity (the prisoner, Grolvikk, Xhal'theris) so Marcille has the persona.]
```

## Terrain notes (inside a room file)

When adding terrain notes to a room file, use a dedicated subsection so it doesn't bleed into Laios's connectivity notes:

```markdown
## Terrain (Dwarven Forge)

- **Pieces:** [Specific set names if known: "Caverns 1.0 small cavern, 2x stalagmite clusters, lava floor tiles."]
- **Footprint:** [Approximate dungeon-tile dimensions on the 5'x7' table.]
- **Dressing:** [Candles, mini props, tokens, terrain swap-outs between phases.]
- **Setup time:** [Minutes. Flag if this room needs to be pre-built and slid in.]
- **Swap trigger:** [What event causes the terrain to change mid-room, if any — "when the lava rises, swap floor tiles to Lava Set 2."]
```

## Step-by-step

1. Identify whether the request is a **prop** (object), a **handout** (paper artifact with text), or **terrain** (Dwarven Forge piece set for a room).
2. Pick the matching format above.
3. Fill in the physical / production sections fully. Be specific about source and material.
4. If the prop carries text, stub the text section and tag `→ Marcille` for the final words.
5. If the prop has a mechanical effect at the table (charges, DCs, an unlock procedure beyond "show it to the DM"), tag `→ Chilchuck`.
6. If the prop interacts with the crystal economy (Scrying Stone clues, crystal tokens), drop a note in `.squad/decisions/inbox/senshi-{slug}.md` for Falin.

## Rules

- No em-dashes.
- Prop language is plainspoken and tactile. This is craft and table operations, not in-world prose.
- Never write in-world text directly on a prop; stub it and hand to Marcille.
- Never set the mechanical DC or effect of a prop; stub it and hand to Chilchuck.
- Crystal tokens, Scrying Stone, and anything tied to the prize chain — coordinate with Falin before locking design changes.
- Call out physical hazards (sharp pieces, hot wax, fragile resin, small parts that get lost).
- Call out long setup times. A 30-minute Dwarven Forge build for one swap-in is an at-the-table problem, not just a prop problem.

## Learned from

- [props/scryingstone.md](../../../props/scryingstone.md) — the canonical decoder prop format
- [props/itemcards.md](../../../props/itemcards.md) — poker-chip item card pattern
- [handouts/prisoners-letter.md](../../../handouts/prisoners-letter.md), [handouts/grolvikk’s-fate.md](../../../handouts/grolvikk’s-fate.md) — handout format precedent
