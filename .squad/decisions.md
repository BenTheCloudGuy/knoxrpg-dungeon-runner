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
Each page is one Dungeon Section file in `rooms/` holding one or more `## Room N "Name"` rooms. Per room: a `**Description**` label with a `>` read-aloud, inline `**Treasure**:` / `**Monsters**:`, then a `### TRAP` or `### PUZZLE` block. GM notes and `#### HISTORY` use `> [!NOTE] GM NOTE` callouts. Anchor: [ArtificersLair.md](../rooms/ArtificersLair.md). Full spec in [.github/copilot-instructions.md](../.github/copilot-instructions.md) under "Page & Room Format". This supersedes the earlier `**Features**` / `**DM Notes**` format.

#### Stat blocks
D&D 5e 2024 Monster Manual format. Inline spell summaries (range, save, damage, duration, concentration).

#### Magic-item loot rarity (proposed; review only) — 2026-06-26 (via Falin)
`items/magic-items/` is a full compendium dump, not a loot table. Proposed rule for this level-3, 40 HP-cap, one-night grinder: Common + Uncommon (consumable-heavy: potions, scrolls, oils, dusts, single-use beads) are general dungeon loot; Rare items are reserved for the Black Crystal grand-prize area only; Very Rare and above are skipped. Psychic/mind-themed items (e.g. potion-of-psionic-fortitude, ring-of-mind-shielding) are thematic to the Mind Flayer host. Nothing placed yet; tying any item to a crystal/room triggers a clue-chain audit plus placement notes for Laios and possibly Chilchuck.

#### Magic-item balance bans — 2026-06-26 (via Chilchuck)
To preserve lethality for 8-12 level-3 PCs at a 40 HP cap, ban as loot: passive/recharging healing, at-will hard CC, flight, teleport, and save-or-die weapons. ring-of-mind-shielding and ring-of-free-action are GM-curated only, not general drops.

#### Prize token files + GP conversion rate — 2026-06-27 (via Falin)
Each prize in [prizes.md](../prizes.md) now has a derived in-game item file in `items/tokens/` (15 files, one per row). GP conversion rate for prize tokens is canon: 1 GP = $0.10. Round each USD price UP to the nearest whole dollar, then multiply by 10 ($7.59 -> $8 -> 80 GP; $154.95 -> $155 -> 1550 GP). Files use the existing `items/treasure/*.md` format (YAML frontmatter with `category: Token`, `type: Prize`, `cost: <N> GP`; H1; bullet list). prizes.md was NOT modified and remains the source of truth. Tying any prize to a specific crystal/room requires a clue-chain audit (Falin) plus Laios/Chilchuck coordination.

#### Survival loot power cap — 2026-09-02 (via Chilchuck)
The positive side of the 2026-06-26 balance bans: what MAY be placed as loot. +1 weapons, armor, and shields only (no +2/+3, no named legendaries). Healing is single-use potions only (no recurring or passive healing). Spellcasting is consumable scrolls only (no recharging wands or staffs). Utility must be finite or bounded (bag-of-holding, rope-of-climbing, driftglobe, feather tokens, resistance potions). enduring-spellbook is allowed, treated as a package of scrolls. The 2026-06-26 bans still hold: recurring/at-will healing, hard crowd control, flight, teleport, save-or-die weapons, and the anti-Mind-Flayer rings (ring-of-mind-shielding, ring-of-free-action) as telegraphed rewards only. Named banned scrolls: scroll-of-tarrasque-summoning, scroll-of-titan-summoning, nether-scroll-of-azumar, scroll-of-the-comet, scroll-of-spell-power, scroll-of-nightmares.

#### Treasure Goblin vendor economy (deflated prices) — 2026-09-02, APPLIED 2026-09-03 (via Falin)
Curated magic-item loot uses a deflated in-dungeon price scale (well below official 5e), sold by Treasure Goblin vendors and written as `cost: N GP` frontmatter matching the existing card format. Reference prices: +1 weapon 150, +1 light armor 100, +1 medium armor 150, +1 heavy armor 200, +1 shield 100; spell scrolls 10 / 25 / 50 / 100 GP by cantrip / 1st / 2nd / 3rd; potion of healing 25, greater healing 75, resistance/utility 40; bag of holding 200, rope of climbing 75, driftglobe 100, feather token (feather fall) 25. Themed 5-scroll spellbooks sum the scroll prices, then take a 10% bundle discount (current books land 160-210 GP). The prize-token rate (1 GP = $0.10) applies only to out-of-game merchandise, never to in-dungeon barter. APPLIED 2026-09-03: Senshi wrote `cost:` into 17 SRD loot files (14 from this table; 3 gap prices on Ben's go-ahead: scroll-of-protection 50, enduring-spellbook 100, potion-of-heroism 40 GP). potion-of-heroism carries a deck price but stays flagged Rare/grand-prize-only; its placement is Falin's call.

#### Dungeon coin drop locked at 2,845 GP + homebrew coin values — 2026-09-04 (via Falin)
Ben LOCKED the total dungeon coin drop at 2,845 GP (Ben owns the number), superseding the earlier ~1,800 GP estimate by about 1,045 GP. Canon homebrew coin values for the Vault: Copper 1, Silver 5, Gold 10, Platinum 50 GP (non-standard, not 5e defaults). 525 physical coins — 295 copper, 110 silver, 100 gold, 20 platinum — total 2,845 GP. Recomputed kit-out: ~237 GP/player (12 PCs) to ~355 GP/player (8 PCs), about 2-3 items each at the 108 GP catalog average (the 46-card deck totals 4,985 GP for one of each; the pool buys ~57%). Falin's recommended risk-tier distribution (Ben may override with a flat spread): Copper + Silver (845 GP) on the main escape path, Gold (1,000 GP) in optional danger, Platinum (1,000 GP) in the Black Crystal area and hardest optional rooms — keeps the escape route lean and the Black Crystal grand prize off it. prizes.md unchanged (the coin drop is economy, not a crystal prize tier). Handoff to Laios for per-room placement by tier; Senshi for physical coin props (four denominations, 525 coins).

#### Magic-item print-and-play deck — 2026-09-04 (via Senshi)
The curated magic-item loot is now a 46-card two-sided print-and-play deck at `items/magic-items/deck/magic-item-deck-printandplay.pdf` (12-page US Letter, ~9 MB). Fronts are text only (name, rarity/type, price, full rules); backs are illustrated (art feathered into parchment, item name, type in large letters, short description, price). Card size 2.5 x 3.5 in, parchment/maroon/gold to match the existing cards. Laid out for HP 3201dw SHORT-edge duplex: back pages row-mirrored and each back rotated 180 degrees, with a 1.75 mm downward back-registration compensation (BACK_DY_MM) verified on Ben's hardware. Print at Actual Size / 100% on cardstock, 9 cards per sheet, cut on the crop marks. Reproducible build tools (render-cards-v2, assemble-deck, apply-prices, preview-pairs) plus README live in `items/magic-items/deck/tools/`; the old single-sided renderer and shared back are superseded. Prop spec in [props/itemcards.md](../props/itemcards.md).

#### Vial of Poison mechanics — 2026-09-04 (via Chilchuck)
Respec of the Treasure Goblin Vial of Poison (Uncommon, 40 GP, injury), now canon for this item. An action coats one weapon or up to three pieces of ammunition; one application per vial; coating lasts 1 minute. For that minute, every creature that takes damage from the coated weapon takes an extra 2d4 Poison on the hit (no save on that part). A creature that takes the 2d4 then takes 1d4 Poison at the start of each of its turns, repeating a DC 12 Constitution save at the end of each of its turns to end the ongoing damage. Once a creature succeeds on the save it can't be affected by this poison again (anti-stacking / anti-perma-DoT). Removed the old "first creature struck only" and "DC 12 or gain the Poisoned condition" clauses. DC 12 kept: the 2d4 on-hit is automatic and the save only ends the minor 1d4 trickle, staying in the standard injury-poison band and clear of the 2026-06-26 balance bans (finite consumable, player-side offense). Frontmatter unchanged; card re-rendered and deck PDF rebuilt.

## Governance

- All meaningful changes require team consensus on direction; mechanical edits do not
- Document design decisions here
- Keep history focused on work, decisions focused on direction
