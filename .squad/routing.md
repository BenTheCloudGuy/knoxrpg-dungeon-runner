# Work Routing

How to decide who handles what.

## Routing Table

| Work Type                                      | Route To    | Examples                                                          |
| ---------------------------------------------- | ----------- | ----------------------------------------------------------------- |
| Dungeon map / layout / room connectivity       | Laios       | H-shape adjustments, connecting routes, gear-gated paths          |
| Pacing, balance, difficulty tuning             | Laios       | "Is this room too lethal?", encounter spacing, rest-point placement |
| Side routes, shortcuts, dead ends, secret doors | Laios      | Hidden passages, optional zones, locked-room logic                |
| Starting locations & H-dungeon flow            | Laios       | Where do parties start, where they converge                       |
| Read-aloud / boxed text                        | Marcille    | First-impression paragraph for a room                             |
| Room features & DM notes prose                 | Marcille    | What players see, hear, smell; secrets & hooks                    |
| Xhal'theris dialogue & announcements           | Marcille    | Mind Flayer taunts, bargains, death announcements                 |
| Handout text & in-world letters                | Marcille    | Prisoner letters, fate notes, NPC writings                        |
| Continuity & canon check                       | Marcille    | Does this match the README and prizes.md? Voice consistency.      |
| Trap write-ups (mechanics)                     | Chilchuck   | Trigger, Effect, Detect DC, Disable DC, Countermeasures           |
| Monster & NPC stat blocks                      | Chilchuck   | 5e 2024 format, spell selection, lair/legendary actions           |
| Encounter math & DC calibration                | Chilchuck   | CR vs party of 8-12 level 3 with 40 HP cap                        |
| Puzzle mechanics (rules side)                  | Chilchuck   | ROYGBIV step DCs, chess puzzle resolution, sphere of annihilation |
| Props, item cards, physical pieces             | Senshi      | Scrying Stone, Artificer's Cube, health potion cards              |
| Dwarven Forge layout notes                     | Senshi      | What terrain pieces, table footprint, room dressing               |
| Handout production (format / layout)           | Senshi      | Paper props, card design, print-ready handouts                    |
| Prize tiers & gift card budget                 | Falin       | Crystal → prize mapping, value tuning, what's still TBD           |
| Scrying Stone clue chain                       | Falin       | Crystal → clue → next crystal sequence, integrity check           |
| Table logistics & player onboarding            | Falin       | Briefing players, rest tracking, death-out flow                   |
| Memory, decisions, session logs                | Cleric      | Automatic — never needs routing                                   |
| Work queue monitoring                          | Paladin     | Backlog, what's unfinished, what's blocked                        |

## Issue Routing

This project does not currently use GitHub issues. If issues are added later, follow the same `squad` / `squad:{member}` label convention as the source project.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work (e.g. when Laios drops a new room, spawn Marcille for prose and Chilchuck for stat blocks in the same turn).
2. **Cleric always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "how many crystals are there?" — it's in the README.
4. **When two agents could handle it**, pick the one whose domain is the primary concern. Room prose vs. room mechanics → Marcille for prose, Chilchuck for DCs.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** New room → Laios designs layout, Marcille writes boxed text, Chilchuck builds monsters/traps, Senshi notes props/terrain, Falin checks prize/crystal placement. Launch them together when the request is broad.
7. **Canon authority:** [README.md](../README.md) and [prizes.md](../prizes.md) are canon. Marcille and Falin are the fact-check gates. If something conflicts, ask the user — never invent.
