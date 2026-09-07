# Squad Decisions

## Active Decisions

### Canon

#### Canon sources
[README.md](../README.md), [prizes.md](../prizes.md), [thoughts.md](../thoughts.md), and the existing room files under `rooms/` are canon. If something in those files contradicts a request, ask the user before changing them.

#### Don't guess or assume
Don't guess, make assumptions, or make things up. If you want to make a suggested change or assumption, or are not sure - ask the user.

#### Crystal/prize decoupling and Scrying Stone scope - 2026-09-06 (via Senshi)
Ben decoupled the 7 Crystal Shards from real-world prizes. The crystals are dungeon props for color-locked doors and the final star-lock puzzle only. Players gather all 7 Crystal Shards and place them in the star-lock in the correct order to open the escape portal. The Black Crystal is one of the seven exit crystals and has no prize role, no grand-prize gate, and no rule keeping it off the main escape route. The Scrying Stone reveals clues for crystal color-locked doors and the correct final exit-lock order, plus room and Xhal'theris context where useful. It does not reveal treasure locations, bigger Treasure Items, prize tiers, prize cards, or real-world prizes. Real-world prizes are separate prize Item Cards found in the dungeon or bought from Treasure Goblins with in-dungeon gold at the listed prices in prizes.md. This supersedes older wording that tied the Scrying Stone, crystal clues, Black Crystal, or prizes.md to treasure reveals or real-world prize gates.

#### Prize Item Cards separated from crystals - 2026-09-06 (via Falin)
Falin confirmed crystals and real-world prizes are separate systems. Players claim prize Item Cards by finding them in the dungeon or buying them from Treasure Goblins with in-dungeon gold at the listed prices in `prizes.md`. The Dungeons & Dragons 2024 Core Rulebook Set + GM Screen is the highest-value prize card and is not tied to any crystal, including the Black Crystal.

### Design

#### Lethal by design
This is a grinder for 8–12 players at level 3 with a hard 40 HP cap. Rooms should pressure players. Lethality is a feature, not a bug. Death is final; gear stays on the body.

#### Rest economy
Maximum 3 short rests total, each 15 real-world minutes, one Hit Die spent per rest. No long rests. Safe spaces are rare and may be traps.

#### Crystal integrity
There are exactly 7 crystals (Green, White, Yellow, Blue, Purple, Red, Black). All 7 are required to open the escape portal by placing them in the final star-lock in the correct order. The crystals are dungeon props for color-locked doors and the final exit-lock puzzle only. The Black Crystal is one of the seven exit crystals and has no prize role, no grand-prize gate rule, and no rule keeping it off the main escape route. Crystal placements must match the door and exit puzzle clue chain, not `prizes.md`.

#### H-shape with lava divider
The dungeon is roughly H-shaped. The middle bar is the lava/ruins zone, which separates Caves from Stone Dungeon. The Red Crystal lives in the lava zone.

### Voice

#### Writing style
No em-dashes. No flowery AI fantasy prose. Direct and grounded - the test is whether a real DM would say this out loud at the table. Complete sentences. Concrete nouns and verbs.

#### Xhal'theris voice
Cruel, amused, theatrical, clinical. Treats players as contestants and specimens. Speaks through psychic projection, carved mouths, statues, or dungeon mechanisms - does not need a physical body present.

### Content

#### Markdown only
This repo is content, not code. Rooms in `rooms/`, props in `props/`, handouts in `handouts/`, art in `images/rooms/`. Follow existing filename conventions in each folder.

#### Room format
Each page is one Dungeon Section file in `rooms/` holding one or more `## Room N "Name"` rooms. Per room: a `**Description**` label with a `>` read-aloud, inline `**Treasure**:` / `**Monsters**:`, then a `### TRAP` or `### PUZZLE` block. GM notes and `#### HISTORY` use `> [!NOTE] GM NOTE` callouts. Anchor: [ArtificersLair.md](../rooms/ArtificersLair.md). Full spec in [.github/copilot-instructions.md](../.github/copilot-instructions.md) under "Page & Room Format". This supersedes the earlier `**Features**` / `**DM Notes**` format.

#### Stat blocks
D&D 5e 2024 Monster Manual format. Inline spell summaries (range, save, damage, duration, concentration).

#### Magic-item loot rarity (proposed; review only) - 2026-06-26 (via Falin)
`items/magic-items/` is a full compendium dump, not a loot table. Proposed rule for this level-3, 40 HP-cap, one-night grinder: Common + Uncommon (consumable-heavy: potions, scrolls, oils, dusts, single-use beads) are general dungeon loot; Rare items are GM-curated only and are no longer tied to any Black Crystal prize area; Very Rare and above are skipped. Psychic/mind-themed items (e.g. potion-of-psionic-fortitude, ring-of-mind-shielding) are thematic to the Mind Flayer host. Nothing placed yet; any magic-item placement needs Falin and Chilchuck review, plus Laios if tied to a room. Superseded 2026-09-06: magic items are not tied to crystals.

#### Magic-item balance bans - 2026-06-26 (via Chilchuck)
To preserve lethality for 8-12 level-3 PCs at a 40 HP cap, ban as loot: passive/recharging healing, at-will hard CC, flight, teleport, and save-or-die weapons. ring-of-mind-shielding and ring-of-free-action are GM-curated only, not general drops.

#### Prize token files + GP conversion rate - 2026-06-27 (via Falin)
Each prize in [prizes.md](../prizes.md) now has a derived in-game item file in `items/tokens/` (15 files, one per row). GP conversion rate for prize tokens is canon: 1 GP = $0.10. Round each USD price UP to the nearest whole dollar, then multiply by 10 ($7.59 -> $8 -> 80 GP; $154.95 -> $155 -> 1550 GP). Files use the existing `items/treasure/*.md` format (YAML frontmatter with `category: Token`, `type: Prize`, `cost: <N> GP`; H1; bullet list). prizes.md was NOT modified and remains the source of truth. Tying any prize to a specific crystal/room is retired. Superseded 2026-09-06: the Black Crystal has no prize role, so any older Black Crystal grand-prize area wording is retired.

#### Survival loot power cap - 2026-09-02 (via Chilchuck)
The positive side of the 2026-06-26 balance bans: what MAY be placed as loot. +1 weapons, armor, and shields only (no +2/+3, no named legendaries). Healing is single-use potions only (no recurring or passive healing). Spellcasting is consumable scrolls only (no recharging wands or staffs). Utility must be finite or bounded (bag-of-holding, rope-of-climbing, driftglobe, feather tokens, resistance potions). enduring-spellbook is allowed, treated as a package of scrolls. The 2026-06-26 bans still hold: recurring/at-will healing, hard crowd control, flight, teleport, save-or-die weapons, and the anti-Mind-Flayer rings (ring-of-mind-shielding, ring-of-free-action) as telegraphed rewards only. Named banned scrolls: scroll-of-tarrasque-summoning, scroll-of-titan-summoning, nether-scroll-of-azumar, scroll-of-the-comet, scroll-of-spell-power, scroll-of-nightmares.

#### Treasure Goblin vendor economy (deflated prices) - 2026-09-02, APPLIED 2026-09-03 (via Falin)
Curated magic-item loot uses a deflated in-dungeon price scale (well below official 5e), sold by Treasure Goblin vendors and written as `cost: N GP` frontmatter matching the existing card format. Reference prices: +1 weapon 150, +1 light armor 100, +1 medium armor 150, +1 heavy armor 200, +1 shield 100; spell scrolls 10 / 25 / 50 / 100 GP by cantrip / 1st / 2nd / 3rd; potion of healing 25, greater healing 75, resistance/utility 40; bag of holding 200, rope of climbing 75, driftglobe 100, feather token (feather fall) 25. Themed 5-scroll spellbooks sum the scroll prices, then take a 10% bundle discount (current books land 160-210 GP). The prize-token rate (1 GP = $0.10) applies only to out-of-game merchandise, never to in-dungeon barter. APPLIED 2026-09-03: Senshi wrote `cost:` into 17 SRD loot files (14 from this table; 3 gap prices on Ben's go-ahead: scroll-of-protection 50, enduring-spellbook 100, potion-of-heroism 40 GP). potion-of-heroism carries a deck price but stays flagged Rare/GM-curated; its placement is Falin's call and is not tied to the Black Crystal.

#### Dungeon coin drop locked at 2,845 GP + homebrew coin values - 2026-09-04 (via Falin)
Ben LOCKED the total dungeon coin drop at 2,845 GP (Ben owns the number), superseding the earlier ~1,800 GP estimate by about 1,045 GP. Canon homebrew coin values for the Vault: Copper 1, Silver 5, Gold 10, Platinum 50 GP (non-standard, not 5e defaults). 525 physical coins - 295 copper, 110 silver, 100 gold, 20 platinum - total 2,845 GP. Recomputed kit-out: ~237 GP/player (12 PCs) to ~355 GP/player (8 PCs), about 2-3 items each at the 108 GP catalog average (the 46-card deck totals 4,985 GP for one of each; the pool buys ~57%). Falin's recommended risk-tier distribution (Ben may override with a flat spread): Copper + Silver (845 GP) on the main escape path, Gold (1,000 GP) in optional danger, Platinum (1,000 GP) in the hardest optional rooms, keeping the escape route lean. Superseded 2026-09-06: the Black Crystal is one of seven exit crystals and no longer defines a grand-prize area or prize route. prizes.md unchanged (the coin drop is economy, not a crystal prize tier). Handoff to Laios for per-room placement by tier; Senshi for physical coin props (four denominations, 525 coins).

#### Magic-item print-and-play deck - 2026-09-04 (via Senshi)
The curated magic-item loot is now a 46-card two-sided print-and-play deck at `items/magic-items/deck/magic-item-deck-printandplay.pdf` (12-page US Letter, ~9 MB). Fronts are text only (name, rarity/type, price, full rules); backs are illustrated (art feathered into parchment, item name, type in large letters, short description, price). Card size 2.5 x 3.5 in, parchment/maroon/gold to match the existing cards. Laid out for HP 3201dw SHORT-edge duplex: back pages row-mirrored and each back rotated 180 degrees, with a 1.75 mm downward back-registration compensation (BACK_DY_MM) verified on Ben's hardware. Print at Actual Size / 100% on cardstock, 9 cards per sheet, cut on the crop marks. Reproducible build tools (render-cards-v2, assemble-deck, apply-prices, preview-pairs) plus README live in `items/magic-items/deck/tools/`; the old single-sided renderer and shared back are superseded. Prop spec in [props/itemcards.md](../props/itemcards.md).

#### Vial of Poison mechanics - 2026-09-04 (via Chilchuck)
Respec of the Treasure Goblin Vial of Poison (Uncommon, 40 GP, injury), now canon for this item. An action coats one weapon or up to three pieces of ammunition; one application per vial; coating lasts 1 minute. For that minute, every creature that takes damage from the coated weapon takes an extra 2d4 Poison on the hit (no save on that part). A creature that takes the 2d4 then takes 1d4 Poison at the start of each of its turns, repeating a DC 12 Constitution save at the end of each of its turns to end the ongoing damage. Once a creature succeeds on the save it can't be affected by this poison again (anti-stacking / anti-perma-DoT). Removed the old "first creature struck only" and "DC 12 or gain the Poisoned condition" clauses. DC 12 kept: the 2d4 on-hit is automatic and the save only ends the minor 1d4 trickle, staying in the standard injury-poison band and clear of the 2026-06-26 balance bans (finite consumable, player-side offense). Frontmatter unchanged; card re-rendered and deck PDF rebuilt.

#### Room loot and Item Card start locked - 2026-09-06 (via Falin)
Ben locked the Vault loot model. Character sheets start empty except clothing. Armor, weapons, and gear are Item Cards found in the dungeon, starting with the Room 1 Cells supply pile in [ArtificersLair.md](../rooms/ArtificersLair.md). Room treasure may include consumables, mundane gear, and coin only. Permanent magic items, including +1 weapons, wondrous items, and spellbooks, come only from Treasure Goblin vendors. This supersedes any prior wording that allowed permanent magic items as room loot. Artificer's Lair Room 4 stays deliberately bare: Crystal Sphere prop plus blank seven-socket diagram only, no crystal, coin, or magic.

## Governance

- All meaningful changes require team consensus on direction; mechanical edits do not
- Document design decisions here
- Keep history focused on work, decisions focused on direction
