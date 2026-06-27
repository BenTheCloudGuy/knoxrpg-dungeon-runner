# Squad Decisions

## Active Decisions

### Canon

#### Canon sources
[README.md](../README.md), [prizes.md](../prizes.md), [thoughts.md](../thoughts.md), and the existing room files under `rooms/` are canon. If something in those files contradicts a request, ask the user before changing them.

#### Don't guess or assume
Don't guess, make assumptions, or make things up. If you want to make a suggested change or assumption, or are not sure — ask the user.

### Design

#### Lethal by design
This is a grinder for 8–12 players at level 3 with a hard 40 HP cap. Rooms should pressure players. Lethality is a feature, not a bug. Death is final; gear stays on the body.

#### Rest economy
Maximum 3 short rests total, each 15 real-world minutes, one Hit Die spent per rest. No long rests. Safe spaces are rare and may be traps.

#### Crystal integrity
There are exactly 7 crystals (Green, White, Yellow, Blue, Purple, Red, Black). All 7 are required to open the exit. The Black Crystal is the grand-prize gate and must sit in a high-danger optional area, never on the main escape path. Crystal placements must match the Scrying Stone clue chain in [prizes.md](../prizes.md).

#### H-shape with lava divider
The dungeon is roughly H-shaped. The middle bar is the lava/ruins zone, which separates Caves from Stone Dungeon. The Red Crystal lives in the lava zone.

### Voice

#### Writing style
No em-dashes. No flowery AI fantasy prose. Direct and grounded — the test is whether a real DM would say this out loud at the table. Complete sentences. Concrete nouns and verbs.

#### Xhal'theris voice
Cruel, amused, theatrical, clinical. Treats players as contestants and specimens. Speaks through psychic projection, carved mouths, statues, or dungeon mechanisms — does not need a physical body present.

### Content

#### Markdown only
This repo is content, not code. Rooms in `rooms/`, props in `props/`, handouts in `handouts/`, art in `images/rooms/`. Follow existing filename conventions in each folder.

#### Room format
Read-aloud paragraph, then `**Features**` list, then `**DM Notes**` (secrets, hooks, mechanics). Use existing rooms like [rainbowroom.md](../rooms/rainbowroom.md) as the format anchor.

#### Stat blocks
D&D 5e 2024 Monster Manual format. Inline spell summaries (range, save, damage, duration, concentration).

#### Magic-item loot rarity (proposed; review only) — 2026-06-26 (via Falin)
`items/magic-items/` is a full compendium dump, not a loot table. Proposed rule for this level-3, 40 HP-cap, one-night grinder: Common + Uncommon (consumable-heavy: potions, scrolls, oils, dusts, single-use beads) are general dungeon loot; Rare items are reserved for the Black Crystal grand-prize area only; Very Rare and above are skipped. Psychic/mind-themed items (e.g. potion-of-psionic-fortitude, ring-of-mind-shielding) are thematic to the Mind Flayer host. Nothing placed yet; tying any item to a crystal/room triggers a clue-chain audit plus placement notes for Laios and possibly Chilchuck.

#### Magic-item balance bans — 2026-06-26 (via Chilchuck)
To preserve lethality for 8-12 level-3 PCs at a 40 HP cap, ban as loot: passive/recharging healing, at-will hard CC, flight, teleport, and save-or-die weapons. ring-of-mind-shielding and ring-of-free-action are GM-curated only, not general drops.

#### Prize token files + GP conversion rate — 2026-06-27 (via Falin)
Each prize in [prizes.md](../prizes.md) now has a derived in-game item file in `items/tokens/` (15 files, one per row). GP conversion rate for prize tokens is canon: 1 GP = $0.10. Round each USD price UP to the nearest whole dollar, then multiply by 10 ($7.59 -> $8 -> 80 GP; $154.95 -> $155 -> 1550 GP). Files use the existing `items/treasure/*.md` format (YAML frontmatter with `category: Token`, `type: Prize`, `cost: <N> GP`; H1; bullet list). prizes.md was NOT modified and remains the source of truth. Tying any prize to a specific crystal/room requires a clue-chain audit (Falin) plus Laios/Chilchuck coordination.

## Governance

- All meaningful changes require team consensus on direction; mechanical edits do not
- Document design decisions here
- Keep history focused on work, decisions focused on direction
