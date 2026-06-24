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
- Crystal economy, prize tiers, clue chains, gift card budget, table logistics → **Falin**
- Memory, decisions, session logs → **Cleric** (silent)
- Work queue monitoring → **Paladin**
**Skills.** Every agent has at least one skill in [.squad/skills/](../.squad/skills/) that codifies how they do their work (format, voice rules, step-by-step). When spawning an agent, instruct them to load their skill(s) before drafting. The index is at [.squad/skills/README.md](../.squad/skills/README.md).

**`??` shortcut.** If a user prompt starts with `??`, route to the matching agent and tell them to use the [question-answer](../.squad/skills/question-answer/SKILL.md) skill — answer the question, do NOT edit any file.
If the request is ambiguous, name the agent you picked and proceed. Never ignore the Squad framework.

## Project Context

This is a content workspace for **The Vault of the Starving Mind** — a lethal D&D 5e (2024) one-shot dungeon grinder for 8–12 players at level 3, run on a 5'x7' Dwarven Forge layout at KnoxRPG events. There is no application code. Everything in this repo is markdown: room write-ups, props, handouts, prize tables, and design notes.

## Content Style

- D&D 5e 2024 rules (Monster Manual, PHB, DMG)
- Markdown only — no code, no app build
- Filename convention: lowercase or existing convention (e.g. `chess_puzzle.md`, `rainbowroom.md`)
- Room files live in `rooms/`, props in `props/`, handouts in `handouts/`, art refs in `images/rooms/`
- The campaign-level facts (HP cap of 40, level 3 start, 7 crystals, ROYGBIV puzzle, etc.) live in [README.md](README.md) and [prizes.md](prizes.md). Treat those as canon.

## Writing Style (hard rules)

- **The test:** Would a real DM actually say this out loud at the table? If not, rewrite.
- **No em-dashes.** Use commas, periods, or semicolons.
- **No flowery, "AI fantasy prose."** Direct, grounded, plainspoken.
- **No "not X, but Y" constructions** unless a person would really say it that way.
- **No sentence fragments for drama.** Use complete sentences.
- Concrete nouns and verbs. Tell the DM what is actually there.
- Match Xhal'theris's voice in his dialogue: cruel, amused, theatrical, clinical.

## Conventions

- Always check existing room files (e.g. [rainbowroom.md](rooms/rainbowroom.md), [chess_puzzle.md](rooms/chess_puzzle.md)) before introducing a new format.
- Stat blocks follow D&D 5e 2024 Monster Manual format.
- Trap write-ups include: Trigger, Effect (with saves and damage), Detect DC, Disable DC, Countermeasures.
- Room write-ups include: short read-aloud paragraph, then **Features** list, then **DM Notes** (secrets, hooks, mechanics).
- The Black Crystal is the grand-prize gate ($150 gift card). Keep it in a high-danger optional area, never on the main escape route.
- Don't guess campaign canon. If the README, prizes, or thoughts files don't say it, ask the user.
