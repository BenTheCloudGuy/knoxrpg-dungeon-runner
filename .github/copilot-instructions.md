# KnoxRPG Dungeon Runner — Copilot Instructions

## ⚠️ MANDATORY: Always Route Through Squad

**Every user request in this workspace MUST be routed through the Squad agent framework, except for the narrow Direct Mode cases listed in step 4 below.**
Do not answer directly, do not edit files, and do not run commands without first identifying the owning agent.

1. Load the Squad coordinator at [.github/agents/squad.agent.md](.github/agents/squad.agent.md) and follow it for every turn. If the Squad coordinator file or [.squad/routing.md](.squad/routing.md) cannot be loaded, inform the user that the Squad framework is unavailable and ask whether to proceed with best-effort routing using the inline routing reminders below.
2. Use [.squad/routing.md](.squad/routing.md) and the inline routing quick-reference to pick the correct agent(s).
3. Spawn the matching agent(s) via the Squad's `task` / subagent mechanism. If the request spans multiple domains, fan out in parallel.
4. Direct Mode (no spawn) is allowed ONLY for: status checks, "where are we?", "who's on the team?", and trivial factual questions answerable from context already in this prompt. Any request that requires file edits, terminal commands, or new information must be routed through Squad.
5. Even for Direct Mode, acknowledge which agent *would* own the work if action were needed.

**Routing reminders:**
- Dungeon layout, room connectivity, flow, pacing, balance, map shape → **Laios**
- Read-aloud prose, room descriptions, Xhal'theris dialogue, in-world voice, handout text → **Marcille**
- Props, handouts, item cards, Scrying Stone, physical table pieces, Dwarven Forge notes → **Senshi**
- Stat blocks, monsters, traps, DCs, saves, encounter math, 5e 2024 rules → **Chilchuck**
- Prize item cards, crystal exit-puzzle economy, budget, table logistics → **Falin**
- Memory, decisions, session logs → **Cleric** (silent)
- Work queue monitoring → **Paladin**
**Skills.** Every agent has at least one skill in [.squad/skills/](../.squad/skills/) that codifies how they do their work (format, voice rules, step-by-step). When spawning an agent, instruct them to load their skill(s) before drafting. The index is at [.squad/skills/README.md](../.squad/skills/README.md).

**`??` shortcut.** If a user prompt starts with `??`, route to the matching agent and tell them to use the [question-answer](../.squad/skills/question-answer/SKILL.md) skill — answer the question, do NOT edit any file.
If the request is ambiguous, name the agent you picked and proceed. Never ignore the Squad framework.

## Project Context

This is a content workspace for **The Vault of the Starving Mind** — a lethal D&D 5e (2024) one-shot dungeon grinder for 8–12 players at level 3, run on 42 square feet of Dwarven Forge terrain across two tables at KnoxRPG events. There is no application code. Everything in this repo is markdown: room write-ups, props, handouts, prize tables, and design notes.

## Content Style

- D&D 5e 2024 rules (Monster Manual, PHB, DMG)
- Markdown only — no code, no app build
- Filename convention: match the existing convention (e.g. `ArtificersLair.md`)
- Room files live in `rooms/`, props in `props/`, handouts in `handouts/`, art refs in `images/rooms/`
- The campaign-level facts (HP cap of 40, level 3 start, 7 Crystal Shards exit-lock puzzle, etc.) live in [README.md](README.md) and [prizes.md](prizes.md). Treat those as canon.

## Writing Style (hard rules)

- **The test:** Would a real DM actually say this out loud at the table? If not, rewrite.
- **No em-dashes.** Use commas, periods, or semicolons.
- **No flowery, "AI fantasy prose."** Direct, grounded, plainspoken.
- **No "not X, but Y" constructions** unless a person would really say it that way.
- **No sentence fragments for drama.** Use complete sentences.
- Concrete nouns and verbs. Tell the DM what is actually there.
- Match Xhal'theris's voice in his dialogue: cruel, amused, theatrical, clinical.

## Conventions

- Always check [ArtificersLair.md](rooms/ArtificersLair.md) as the format exemplar before writing a new page.
- Stat blocks follow D&D 5e 2024 Monster Manual format.
- Room treasure may only list items that exist under [items/](items/) (weapons, armor, treasure and adventuring gear, magic-items decks, tokens). Never invent treasure. Verify each entry against a real item file before writing it.
- Spell scroll cards exist for every useful spell from Cantrip through Level 5 (the card files are a known gap to be filled later, but the scrolls are canon and may be referenced by name in treasure). Named scrolls that fit the dungeon (e.g. Detect Magic, Feather Fall, Lesser Restoration, Find Traps, Knock) are valid loot.
- The 7 Crystal Shards are exit-lock puzzle props: all seven open the escape portal, and crystals also gate color-locked doors. They are not tied to prizes. Real-world prizes are prize Item Cards, found in the dungeon or bought from Treasure Goblins.
- Don't guess campaign canon. If the README, prizes, or thoughts files don't say it, ask the user.

## Page & Room Format (canon)

A **page** is one Dungeon Section (an area of the dungeon), saved as a single file in `rooms/`. Each page holds one or more numbered rooms. [ArtificersLair.md](rooms/ArtificersLair.md) is the reference exemplar. Match it.

**Heading depth:**
- `#` Dungeon Section (page title), with the section art image directly beneath it
- `##` Room, titled `Room N "Name"` (add tags like `[DUNGEON EXIT]` in the title when useful)
- `###` `TRAP` or `PUZZLE` block inside a room
- `####` A named mechanic (e.g. a gas cloud) or `HISTORY`
- `#####` A sub-detail of a mechanic (e.g. Visibility)

Separate rooms with a `---` divider.

**Page skeleton:**

```markdown
# [Dungeon Section Name]

![alt text](../images/rooms/[SectionName].jpg)

## Room 1 "[Room Name]"

**Description**
> [Read-aloud paragraph the DM reads verbatim. Concrete, plainspoken, no em-dashes.]
  - [Optional hidden cue: DC 12 Perception to notice ...]
  - [Optional hidden cue: DC 16 Investigation to find ...]

**Treasure**:
- [item]

**Monsters**: [inline note, or a list]

### TRAP

**Read Aloud (when triggered)**
> [Optional. One or two sentences for the moment the trap fires.]

- **Type**: [Mechanical / magical, plus the area it affects and where is safe]
- **Trigger**: [What sets it off. Be specific about action, distance, timing.]
- **Detection**:
  - Perception DC [N]: [what they see]
  - Investigation DC [N]: [what a closer look reveals]
- **Deactivate**: [How it stops, or state it cannot be stopped by mechanical means]
  - **Success** - [result]
  - **Failure** - [result]
  - [Escalation / Natural 20 / Countermeasure / Reset as needed]

#### [Named Mechanic, when the effect needs its own rules]

**Save DC**: [N] [Ability]

[Round-by-round or initiative-count table]

##### [Sub-detail, e.g. Visibility]
- [bullets]

On a Failure:
- [bullets]

On a Success:
- [bullets]

> [A standing rule or clarification goes in a blockquote.]

#### HISTORY
> [!NOTE] GM NOTE
> [Backstory. Why this room or trap exists. Never read aloud.]

---

## Room 2 "[Room Name]"
[...]
```

**Format rules:**
- GM-facing notes and history use GitHub callouts: `> [!NOTE] GM NOTE` on the first line, note body on the following blockquote lines. Do not use a bold `**GM Note**:` label.
- Spell the deactivation bullet `**Deactivate**`, never `Deactive`.
- `**Read Aloud (when triggered)**` is optional per trap; include it when the trigger moment needs its own boxed text.
- Read-aloud text always sits in a `>` blockquote under a `**Description**` (rooms) or `**Read Aloud ...**` (traps) label.
- Rooms without a trap omit the `### TRAP` block. Rooms with a puzzle use `### PUZZLE` in its place.
- The writing hard rules above (no em-dashes, "would a DM say this out loud", no flowery prose) apply to every read-aloud and note.
