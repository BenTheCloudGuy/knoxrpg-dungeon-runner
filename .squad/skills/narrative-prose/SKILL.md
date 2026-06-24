# Narrative Prose (Rooms, Traps, Monsters, Handouts, Xhal'theris)

**Owner:** Marcille
**Confidence:** high

## When to use

Use this skill whenever the user asks for in-world prose for the table: a room read-aloud paragraph, a trap reveal, a monster sighting, an Xhal'theris line, a handout written from a character's voice, or a rewrite of any of the above. Also use it when fixing voice drift in existing files.

## The voice (non-negotiable)

The voice for this project comes from [.github/copilot-instructions.md](../../../.github/copilot-instructions.md) and [.squad/identity/wisdom.md](../../identity/wisdom.md). Apply both.

**The test:** Would a real DM actually say this out loud at the table? If not, rewrite it.

Avoid:
- em-dashes (use commas, periods, or semicolons)
- ornamental phrasing and AI-fantasy prose
- sentence fragments used only for drama
- "not X, but Y" constructions unless a person would really say it that way
- poetic abstractions and trailer-voice
- vague mood language used instead of concrete information

Do:
- direct wording, functional sentences
- concrete nouns and concrete verbs
- speech-like rhythm, plainspoken fantasy tone
- blunt clarity, real human emphasis

**Voice examples (from existing rooms):**
- Bad: *"The chamber stretches before you, an ancient testament to forgotten cruelty, dust motes dancing in shafts of unholy light."*
- Good: *"It's a big stone room. The ceiling is high enough you can't see it. Something is dripping somewhere on your left."*

## Xhal'theris voice (specific anchors)

Xhal'theris, the Velvet Maw, is the host. He is cruel, amused, theatrical, and clinical. He treats the players as contestants and specimens. He speaks through carved mouths, statues, psychic projection, crystal eyes, and dungeon mechanisms. He is not always physically present.

- He announces deaths, opens routes, taunts, and bargains. He does not coach.
- He uses the word "specimen," "contestant," "guest," and "morsel." He calls the dungeon "my Vault."
- He does NOT use modern phrasing, internet voice, or stand-up comedian rhythm. He is older than the building.
- One or two short lines beats a paragraph. He doesn't monologue.

**Xhal'theris examples:**
- Good: *"Welcome back, specimen. The Green chamber is empty now. Someone has been clever."*
- Good: *"Ah. You found the Red. I did wonder which of you would burn first."*
- Bad: *"Hahaha! What a magnificent display of courage, dear contestants — truly, this performance shall be remembered as the greatest entertainment my ancient halls have ever known!"*

## Reference order (read before writing)

1. [README.md](../../../README.md) — Xhal'theris persona, core premise, tone
2. [thoughts.md](../../../thoughts.md) — zone flavor notes
3. [prizes.md](../../../prizes.md) — Scrying Stone clue phrasing (already in canon voice)
4. Existing rooms — [rainbowroom.md](../../../rooms/rainbowroom.md), [chess_puzzle.md](../../../rooms/chess_puzzle.md), [thecells.md](../../../rooms/thecells.md) — for current format and voice
5. Existing handouts — [grolvikk’s-fate.md](../../../handouts/grolvikk’s-fate.md), [prisoners-letter.md](../../../handouts/prisoners-letter.md)
6. [.squad/decisions.md](../../decisions.md) — locked voice and content decisions

## Step-by-step

1. Identify every named entity in the request (room, crystal, NPC, prop, monster). Look each one up in canon before writing.
2. Decide which format applies below.
3. Draft. Read it back out loud. Apply the "real DM at the table" test. Rewrite anything that fails.
4. Strip em-dashes. Strip mood language that doesn't tell the DM what is in the room.
5. If canon is missing or contradictory, stop and ask the user. Do not invent crystal placements, prize tiers, or NPCs.

## Formats

### Room / location

```markdown
# [Room Name]

> [One short paragraph the DM can read verbatim. What they see, hear, smell first. Concrete. No mood adjectives without an object. No em-dashes.]

**Features**
- [What is actually in the room: furniture, exits, light sources, smells, sounds]
- [Anything interactive: doors, levers, containers, bodies, crystals]
- [Anything obviously dangerous or out of place]

**DM Notes**
- [Secrets, hidden passages, perception/investigation cues]
- [How the room connects to the rest of the dungeon]
- [What changes if a crystal is taken / a trap fires / a monster dies]
- [Xhal'theris cue lines, if any]
```

Mechanics (DCs, damage, saves, stat blocks) belong inside Chilchuck's trap/monster write-ups, not in the prose section.

### Trap reveal (the read-aloud half — the mechanical block is Chilchuck)

```markdown
> [One or two sentences describing what the party experiences when the trap fires. Present tense. Concrete. The DM should be able to read this without rehearsal.]
```

Hand the Trigger / Effect / Detect / Disable / Countermeasures block to Chilchuck.

### Monster / creature reveal

```markdown
> [What the party perceives first. Sound before sight, sight before identification. One short paragraph. No "horror beyond imagining" — describe the actual thing.]
```

### Xhal'theris line

One or two short lines. Read it back out loud. If it sounds like a movie villain speech, cut it in half.

### Handout

Match the implied writer's voice. A desperate prisoner sounds different from a smug archmage who built the place. Use existing handouts in [handouts/](../../../handouts/) as format precedent.

## Rules

- Never invent canon. If a fact is missing, ask the user.
- Never describe a crystal as being in a room without confirming with Falin.
- Match existing room file precedents in [rooms/](../../../rooms/) before inventing a new layout.
- Read-aloud blocks must pass the "say it out loud" test. If it feels like reading a book aloud, rewrite it.
- Xhal'theris does not narrate combat. He comments on it after the fact.

## Learned from

- [.github/copilot-instructions.md](../../../.github/copilot-instructions.md) — the project voice rules
- [rooms/rainbowroom.md](../../../rooms/rainbowroom.md), [rooms/chess_puzzle.md](../../../rooms/chess_puzzle.md) — existing room format
- [handouts/grolvikk’s-fate.md](../../../handouts/grolvikk’s-fate.md), [handouts/prisoners-letter.md](../../../handouts/prisoners-letter.md) — handout voice precedent
