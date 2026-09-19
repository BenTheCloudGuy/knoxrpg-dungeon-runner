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
#### Print-and-play deck duplex layout LOCKED and CONFIRMED (HP 3301dw) — 2026-09-06 (via Senshi)
The 31 committed sheet PDFs under `items/decks/` (equipment 23, magic-items 6, prizes 2) are re-tuned for Ben's HP 3301dw duplex and CONFIRMED working by Ben: both "Actual Size / 100%" and "Fit to Page / 96%" print correctly and cut clean on both faces. This supersedes the four intermediate 2026-09-06 tuning steps (short-edge revert, long-edge nudge, back-art-upright, crop-mark nudge) that led here. Final verified layout, built by the shared `items/magic-items/deck/tools/sheet-pdfs.mjs`: back slots ROW-mirrored as `backSlots[(ROWS-1-r)*COLS + c]`; backs NOT rotated (this printer flips the back position top-to-bottom but keeps content upright, so a 180 rotation printed the art upside down); `BACK_DY_MM = -2.5` and `BACK_DX_MM = 0` to cancel the front/back drift; crop marks shifted by the same (dx, dy) as the cards via `cropSvg(dx, dy)` so cut lines track the cards on every page, which is what let Fit-to-Page also work. Config lives in `items/magic-items/deck/tools/sheet-pdfs.mjs`, `assemble-deck.mjs`, `items/tokens/tools/prize-assemble.mjs`, `per-card-pdfs.mjs`, plus docs `items/magic-items/deck/tools/README.md` and [props/itemcards.md](../props/itemcards.md).


#### Named spell-scroll text is 2024-verified — 2026-09-06 (via Chilchuck)
Chilchuck audited Falin's 11 curated named spell scrolls against the 2024 PHB / SRD 5.2 so Senshi can print verbatim. Canon values for these cards:

- **Spell scroll boilerplate:** castable only if the spell is on your class's spell list; no material components needed; scroll crumbles after a completed cast. Save DC / attack bonus by scroll level (2024 DMG, unchanged from 2014): **Cantrip 13 / +5, 1st 13 / +5, 2nd 13 / +5, 3rd 15 / +7.** Falin's "DC 13 / +5 for cantrip through 3rd" is corrected: 3rd-level scrolls (Mass Healing Word, Dispel Magic) are **DC 15 / +7**.
- **Guidance is NOT a reaction in the published 2024 PHB.** The Reaction / Instantaneous version was the abandoned UA playtest. Final 2024 = Action, Touch, Concentration up to 1 minute; choose a skill at cast, target adds 1d4 to ability checks using that skill for the duration.
- **Cure Wounds** 2024 = 2d8 + mod, school Abjuration (was Evocation, 1d8). **Mass Healing Word** 2024 = 2d4 + mod, Bonus Action, up to six creatures, school Abjuration (was Evocation, 1d4). **Mind Sliver** 2024 = Int save, 1d6 Psychic, subtract 1d4 from the target's next save before the end of your next turn (V only, 1 round).
- **Fireball (existing card, out of scope):** as a 3rd-level scroll its save is DC 15, not 13. Fix if the current card prints 13.
- Roster unchanged. Mass Healing Word and Dispel Magic flagged to Ben as the strongest attrition-breakers in the set, both legal single-use consumables under the survival loot cap. No card files were built in this pass (audit only); Senshi owns the build.

#### Named spell scrolls replace the 4 generic deck cards — 2026-09-06 (via Falin)
**Direction:** The magic-item loot deck's 4 GENERIC level-based scroll cards are replaced with cards for specific named spells, each card carrying that spell's rules. Curation + content only; Chilchuck rules-audits and Senshi builds.

**DELETE (4 generic, remove from deck manifest + files):** `spell-scroll-cantrip.md`, `spell-scroll-level-1.md`, `spell-scroll-level-2.md`, `spell-scroll-level-3.md` (all in `items/magic-items/scrolls/`).

**KEEP unchanged:** `spell-scroll-of-fireball.md` (marquee 3rd), `scroll-of-protection.md` (specific item).

**Out of scope:** the other generic compendium scrolls (`spell-scroll-0-cantrip`, `spell-scroll-1st-level`..`9th-level`, `spell-scroll-level-4`..`9`, `spell-scroll.md`) are NOT in the deck; leave them.

**New roster (11 cards), deflated price scale, DC 13 / +5:**

| Slug (`items/magic-items/scrolls/`) | Spell | Lvl | School | Rarity | Price |
| --- | --- | --- | --- | --- | --- |
| spell-scroll-of-fire-bolt | Fire Bolt | Cantrip | Evocation | Common | 10 GP |
| spell-scroll-of-mind-sliver | Mind Sliver | Cantrip | Enchantment | Common | 10 GP |
| spell-scroll-of-guidance | Guidance | Cantrip | Divination | Common | 10 GP |
| spell-scroll-of-cure-wounds | Cure Wounds | 1st | Abjuration | Common | 25 GP |
| spell-scroll-of-magic-missile | Magic Missile | 1st | Evocation | Common | 25 GP |
| spell-scroll-of-shield | Shield | 1st | Abjuration | Common | 25 GP |
| spell-scroll-of-scorching-ray | Scorching Ray | 2nd | Evocation | Uncommon | 50 GP |
| spell-scroll-of-lesser-restoration | Lesser Restoration | 2nd | Abjuration | Uncommon | 50 GP |
| spell-scroll-of-see-invisibility | See Invisibility | 2nd | Divination | Uncommon | 50 GP |
| spell-scroll-of-mass-healing-word | Mass Healing Word | 3rd | Abjuration | Uncommon | 100 GP |
| spell-scroll-of-dispel-magic | Dispel Magic | 3rd | Abjuration | Uncommon | 100 GP |

**Placement:** none Rare, so all are general Treasure Goblin vendor stock; no grand-prize gating.

**Net deck change:** 46 - 4 + 11 = **53 cards**. Scroll subtotal 335 -> 605 GP (+270), so the ~4,985 GP one-of-each figure becomes ~5,255 GP.

**Optional:** Protection from Energy (3rd, 100 GP, fire resistance) is a strong thematic alt for the lava zone if Ben wants a 12th.

**Handoffs:** Chilchuck — audit 2024 text (Guidance reaction/instant, Mass Healing Word die, Mind Sliver 2024 PHB, Cure Wounds 2d8). Senshi — build 11 cards + update deck manifest (`assemble-deck.mjs`, `apply-prices.mjs`, `render-*.mjs`) and rebuild the PDF. Tag: Falin, Chilchuck, Senshi.

#### combined print-and-play deck file — 2026-09-06 (via Senshi)
There is now a single combined file for printing all three card decks at once: `items/decks/all-decks-printandplay.pdf` (62 pages, US-Letter, front/back interleaved). It merges the 31 committed per-sheet PDFs in deck order equipment -> magic-items -> prizes, each sorted by sheet number.

Rebuild anytime with `items/magic-items/deck/tools/merge-decks.mjs` (re-runnable, reads the deck folders from disk, overwrites the output). Same print settings as a single sheet: long-edge duplex, Actual Size / 100% (or Fit / 96%). Per-deck folders under `items/decks/` are unchanged for printing a single deck. The sheet PDFs and generators were not modified.

#### `ddvram` source tag scrubbed from all item metadata — 2026-09-06 (via Senshi)
The non-official `ddvram` source tag has been removed from all item `.md` files under `items/`. This was metadata-only; the `source` field is not rendered on the cards, so nothing was re-rendered or rebuilt and the printed cards are byte-identical.

**Canon going forward:**
- Multi-source weapons use `phb-2024, free-rules` (no `ddvram`).
- The three crossbows (hand/heavy/light) are treated as `phb-2024, free-rules`.
- `concertina.md` has an empty `source:` (no official source to cite; kept its in-body "Dungeons & Dragons vs. Rick and Morty, pg. 26" line as the only attribution).
- `.squad/` historical records still mention `ddvram` on purpose; leave them.

A search for `ddvram` under `items/**` now returns zero matches.

#### Equipment cards enriched with Description + Use — 2026-09-06 (via Senshi)
## What changed

All 136 bare items in `items/treasure/` now carry `- **Description:**` and `- **Use:**` bullets so they render on the poker-chip equipment cards. The 4 ammunition files were already enriched and were not touched. Cards re-rendered and committed sheets rebuilt (22 equipment sheets, merged 56-page `all-decks-printandplay.pdf`, all 2pg US-Letter 612x792). Card count unchanged at 195.

## Rules-bearing items use accurate 5e 2024 mechanics

Acid, alchemist's fire, oil, antitoxin, basic poison, potion of healing, ball bearings, caltrops, hunting trap, manacles, healer's kit, climber's kit, torch/candle/lamp/lanterns, tinderbox, and the spellcasting foci all use the exact mechanics Ben supplied.

## Flag for Chilchuck

`holy-water` and `holy-water-flask` use **2d8 Radiant** on a hit to a Fiend or Undead, per Ben's note. Ben asked to confirm the 2024 damage die. Please verify against the 2024 rules.

## Deviation for Ben to confirm

Ben's task list grouped `yew-wand` and `wooden-staff` (and `wooden-staff-also-a-quarterstaff`) under **Arcane** focus. Their own frontmatter category and 5e canon list a yew wand and a wooden staff as **Druidic** foci. I typed `wooden-staff` and `yew-wand` as Druidic (matching their file metadata) and kept the two "-also-a-quarterstaff" variants as Arcane (their frontmatter is Adventuring Gear, and they double as a quarterstaff). If Ben wants all staff/wand foci forced to Arcane, this is a one-line change per file.

#### 1 gp minimum price on all gear cards — 2026-09-06 (via Senshi)
**Scope:** Equipment deck / crystal economy (Falin, please note)

## Rule

Every item priced below 1 gp (previously cp/sp) is now floored to exactly `1 gp` on its card, in both the frontmatter `cost:` line and the body `- **Cost:**` bullet.

## Impact

- 43 gear cards changed: 37 in `items/treasure/`, 6 in `items/weapons/`.
- Magic-items and prize tokens were already >= 1 gp, so untouched.
- Items priced `Varies` or blank untouched.
- Equipment deck unchanged in count (199 cards / 23 sheets); merged print-and-play still 62 pages.

## Why it matters to the economy

Bulk mundane gear (rations, torch, oil, sling bullets, club, etc.) now costs at least 1 gp each on the cards. If any crystal clue, shop, or reward math assumed sub-1gp prices for these, Falin should confirm the prize/economy tables still hold.

#### Senshi — Laser-cut prize tokens (first pass) — 2026-09-06 (via Senshi)
**Decision:** Added a laser-cutter deliverable for the prize tokens alongside the existing print deck.

- Generator: `items/tokens/tools/laser-tokens.mjs` (Node ESM, reuses tools-dir `sharp`).
- Output: `items/tokens/laser/*.svg` — 20 SVGs, one per physical prize copy.
- 3 inch (76.2 mm) circular wood rounds. LightBurn encoding: red `#FF0000` no-fill circle = CUT layer; black `#000000` name + description + grayscale embedded image = ETCH.
- Price and USD value are intentionally omitted from these tokens (differs from the card deck, which keeps price/value).
- Art source is shared with the print deck: `items/tokens/images/<slug>.png`.
- Print/card pipeline (`prize-render.mjs`, `prize-gen.mjs`, `prize-assemble.mjs`) is untouched.

**For Falin:** the physical prize inventory now has a second production path (laser wood rounds). Same 15 prizes, same copy counts (20 total). No change to crystal economy or tier assignments — just a new physical form of the tokens.

#### Prize deck is one card per physical prize copy (copy-driven) — 2026-09-06 (via Senshi)
**What changed**
- The prize print deck now renders one card per physical prize copy, not one per prize type. Total went from 15 cards to 20.
- Multi-copy prizes carry a `copies:` frontmatter field in their `items/tokens/*.md`:
  - HiiFeuer Medieval Faux Leather Pouch = 2
  - LongLongJin DND Dragon Journal with Pen = 3
  - The Book of Holding = 2
  - Wooden DnD Dice Tray & Journal Box = 2
  - All other 11 prize tokens default to 1.
- Source of truth for QTY is `thoughts.md` `## Prizes` (QTY column). Adjust copies there and re-run the pipeline; the deck follows.

## Pipeline (repeatable)
1. Edit `copies:` in the token md (or `thoughts.md` QTY, then mirror to token frontmatter).
2. `node prize-render.mjs` (from `items/tokens/tools`) — writes `<name>-2.png` etc into build/fronts and build/backs, idempotent cleanup on reduction.
3. Rebuild committed sheets, then `merge-decks.mjs`, then `prize-assemble.mjs` for the legacy combined PDF.

## Result
- `items/decks/prizes/` now has 3 sheet PDFs (9+9+2). `items/decks/all-decks-printandplay.pdf` is now 64 pages (32 sheets).

## Flag for Falin
- `prizes.md` has NO QTY column; `thoughts.md` does. The two are out of sync on quantity. If Ben wants a single source of truth for prize counts, `prizes.md` should get a QTY column reconciled to `thoughts.md`.

#### Prizes excluded from the combined print-and-play PDF — 2026-09-06 (via Senshi)
**Relevant to:** Falin (prize logistics), print/table ops

## Decision

The combined print-and-play file `items/decks/all-decks-printandplay.pdf` now holds the equipment and magic-items decks only. The prizes deck is deliberately excluded so prize cards never print with the player-facing gear.

## Effect

- `items/magic-items/deck/tools/merge-decks.mjs` `DECK_ORDER` is `["equipment", "magic-items"]`.
- Combined file is 58 pages (29 sheets: equipment 23 + magic-items 6), all US-Letter 612x792.
- Prizes print separately and were NOT changed: per-sheet PDFs in `items/decks/prizes/` and the legacy combined prize PDF at `items/tokens/deck/prize-deck-printandplay.pdf` remain as-is.

## Note for Falin

The prize deck is now the only place prize cards live for printing. Keep the prize-deck build and its outputs current on their own; they no longer ride along in the all-decks file.

#### Spell scrolls are not Equipment-deck cards — 2026-09-06 (via Senshi)
- Generic "Spell Scroll (Cantrip)" and "Spell Scroll (Level 1)" placeholders were removed from the EQUIPMENT deck. They carried frontmatter `category: Adventuring Gear`, so they rendered as GEAR cards, which is wrong.
- Canon going forward: scrolls belong to the magic-items deck (named spell scrolls already exist there). Do not add generic scroll placeholders to `items/treasure/` / the equipment build.
- Equipment deck is now 195 cards / 22 sheets. Anyone quoting deck counts (prizes/logistics) should use 195 for equipment, 6 sheets for magic-items, 56 pages total in the combined print-and-play PDF.

## Governance

- All meaningful changes require team consensus on direction; mechanical edits do not
- Document design decisions here
- Keep history focused on work, decisions focused on direction

#### Potion recipe revision request - 2026-09-16 (via Cleric)
The user requested a revision to `alchemists_workshop.md`'s Potion Recipes section. This is a revision request only and does not change canon: retain the canon craftable potions and the existing puzzle intent, expand every recipe to 6-8 quantities of unlabeled ingredients, and use fair descriptive clues that maintain a solvable but not overly narrow recipe structure.

#### Print-ready double-sided ingredient card PDF request - 2026-09-16 (via Cleric)
Ben/user request preserved exactly: “Generate print-ready, double-sided PDF ingredient cards, using the existing project deck pipeline and available authorized API configuration where applicable.”

- This is a project requirement for a future implementation pass.
- Future implementation should use the existing project deck pipeline and any available authorized API configuration where applicable.
- This logging task is logging-only; ingredient cards, PDFs, deck outputs, and all other content artifacts must not be modified.

#### Ingredient-card deck implementation and asset blocker - 2026-09-16 (via Senshi)
- The 20 ingredient cards now have deterministic duplex-ready PDFs under `items/ingredients/deck/`, including the combined print-and-play PDF and separate fronts/back proofs.
- Validation confirmed 20 distinct fronts and 20 matching backs, deterministic order/pairing, a structurally valid six-page combined PDF, and structurally valid three-page separate proofs.
- Player-facing backs use the established parchment geometry plus a vector ingredient seal because the repository has no approved ingredient-image assets or configured image-generation/API adapter for this deck. No credentials, external downloads, or invented player-facing ingredient art were added.
- Recommended print settings are duplex long-edge and Actual Size / 100%.


#### Ingredient deck correction pass - 2026-09-16 (via Senshi)
This supersedes the 2026-09-16 "Ingredient-card deck implementation and asset blocker" entry's asset-blocker language. Real card art now exists at `items/ingredients/images/<name>.png`, one PNG per each of the 20 `items/ingredients/*.md` sources, generated with the OpenAI Images API (`gpt-image-1`) using the established equipment-deck STYLE prompt adapted to a raw alchemical specimen framing. No credentials were stored in the repo; the key was read from the `OPENAI_API_KEY` Windows User environment variable at build time only.

- Tooling relocated from `items/ingredients/deck/tools/ingredient-deck.mjs` to `items/ingredients-deck/tools/`, split into `ingredient-gen.mjs` (art generation) and `ingredient-render.mjs` (card + sheet rendering), matching the sibling `items/equipment-deck` convention. `items/ingredients/deck/` has been removed entirely.
- Final print PDFs now live at `items/decks/ingredients/sheet-01.pdf` through `sheet-03.pdf` (9+9+2 = 20 cards), matching the `items/decks/equipment/` and `items/decks/magic-items/` `sheet-NN.pdf` naming convention. The old `ingredient-cards-fronts.pdf` / `ingredient-cards-backs.pdf` / `ingredient-cards-printandplay.pdf` names are gone.
- Card backs now show real feathered art (equipment-deck back style) instead of the placeholder vector seal; the seal remains only as an automatic per-card fallback if an ingredient is ever missing art. Card fronts are unchanged: text-only identification clues pulled by an explicit label allowlist (Appearance, Simple Test, Handling, Found). No recipe or effect text appears on either player-facing side.
- Validation: 20/20 images generated (0 failed), 20 front PNGs + 20 back PNGs, 3 sheet PDFs each verified as 2 pages at US Letter 612x792 pt, pairing/order manifest at `items/ingredients-deck/ingredient-card-order.json` matches the alphabetical 20-slug list, `items/ingredients/deck/` confirmed absent.

#### Alchemist NPC journal prop request - 2026-09-16 (via Cleric)
The user requested that a new alchemist NPC be invented as the owner of the Alchemist's Lab and the recipes in `alchemists_workshop.md`, for a planned journal prop. The NPC's name and details are pending user review and must not be treated as finalized canon until that review is complete.


#### Berhan Voss mutation and roaming threat - 2026-09-16 (via Cleric)
Berhan Voss, the Alchemist's Lab NPC, was mutated by chemicals from his own vat. He now roams the entire dungeon hunting the Green Transmutation Crystal and attacks any player carrying it. This resolves the earlier open question: he is confirmed as the Room 5 vat creature, but he no longer stays in Room 5. Marcille is finalizing his journal and fate narrative in `npc/berhan-voss.md`; Chilchuck is building his roaming monster stat block in a new monsters file. Those follow-up content files remain in progress and open.
#### Berhan Voss ingredient scouting follow-up - 2026-09-16 (via Cleric)
Berhan Voss personally scouted the dungeon for alchemy ingredients; his supply came from field scouting, not merely trading with goblins. The dungeon map is still being developed, so specific ingredient locations remain pending user choice. Once those locations are decided, update `npc/berhan-voss.md`'s Supply Lines and Trade section to reflect his personal scouting, and feed the same information into the planned alchemist's journal prop. The journal remains pending/on hold until the ingredient locations and journal build are ready. No content-file changes are authorized by this follow-up.

#### Berhan Voss stat block and new `monsters/` convention - 2026-09-16 (via Chilchuck)
- Berhan Voss is confirmed as the mutated creature from the Alchemist's Lab vat in `rooms/DungeonOfFun.md`, Room 5. The stat block is named "Berhan Voss, the Vat-Touched" and lives at `monsters/berhan-voss.md`.
- The `monsters/{name}.md` convention is for roaming or cross-room creatures not tied to one room heading. Room-bound creatures remain inline in `rooms/*.md`.
- Berhan is CR 5 with 105 HP and roams Alchemist wing Rooms 1, 3, 4, and 5. He never enters Rooms 7 or 8.
- His deliberate aggro trigger is exposed possession of the Green Transmutation Crystal. He is a post-acquisition hazard, not a guardian gate, and no guardian-defeat requirement is needed for the Green Crystal.
- `npc/berhan-voss.md` and `rooms/DungeonOfFun.md` were read-only inputs for this work.

#### Berhan Voss journal deck print-ready prop - 2026-09-16 (via Senshi)
- Senshi completed `props/journal-deck/berhan-voss-journal-printandplay.pdf` from the approved 16 Journal Page blocks, preserving sequential page order 1 through 16.
- `props/journal-deck/tools/journal-sketch-gen.mjs` generates one original monochrome or sepia notebook sketch per bracketed production note. The completed build contains 14 sketch PNGs for pages 1 through 14; pages 15 and 16 have no production note.
- `props/journal-deck/tools/journal-render.mjs` keeps margin and correction text visible as side annotations while omitting production instructions from the printed body after converting them to artwork placement.
- Validation confirmed 16 US Letter pages at 612 x 792 points, matching page PNGs, and 14 sketch PNGs. Recommended print settings are duplex long-edge flip, Actual Size / 100%, US Letter, left-side journal binding.


#### Journal render rebuild and page-quality standard - 2026-09-16 (via Senshi)
The user rejected the first Berhan Voss journal render and required a full rebuild rather than a patch. The canonical fix set is: `props/journal-deck/tools/journal-render.mjs` now renders with `@napi-rs/canvas`; all page headers were removed; margin and correction annotations now wrap and auto-shrink instead of clipping; procedural parchment texture, stains, edge wear, and ruled lines are generated in canvas; the OFL-licensed `Caveat` handwriting font is embedded from `props/journal-deck/assets/fonts/Caveat-Variable.ttf`; web-UI borders and drop shadows were removed; whitespace was rebalanced; and sketches were moved inline beside the content they illustrate instead of floating as isolated square insets. All 16 pages were re-rendered and `props/journal-deck/berhan-voss-journal-printandplay.pdf` rebuilt. Known residual issues remain: page 1 and page 16 still carry noticeable empty space, page 13 margin notes render very small, and sketches still read as framed square insets in a right-hand column rather than fully inline marginalia.

#### Berhan Voss journal v2 approved final - 2026-09-16 (via user approval)
- The user reviewed and approved the v2 rebuild at `props/journal-deck/berhan-voss-journal-printandplay.pdf` as final. No further journal changes are requested at this time.
- The user explicitly accepted the known minor cosmetic imperfections and they must not be revisited: page 13's ingredient sketch contains baked-in block-letter text labeling `GREEN TRANSMUTATION CRYSTAL` instead of a clean hand-sketch, and minor dead whitespace remains on pages 1 and 16.
- The pending ingredient-location follow-up remains open and deferred. Once the user finalizes the dungeon map and selects the specific rooms where Berhan Voss scouted for ingredients, update `npc/berhan-voss.md`'s Supply Lines and Trade section with those locations; the journal content may receive a future revision pass at that time. No action is authorized until then.

#### Five Seals reference art - 2026-09-16 (via Senshi)
- `images/rooms/FiveSeals.png` is the approved reference art for the Five Seals lightning-trap wall in `rooms/gauntlet.md`.
- The 1536x1024 PNG preserves the canonical left-to-right seal order: road into sunrise, eye-bearing upright gauntlet, upright skeletal arm with balanced scales, circle of seven stars, and black mask.
- The image uses a texture-only inscription panel with no readable text. The existing room prose and its legacy image link remain unchanged.

#### Five Seals image regeneration workflow - 2026-09-16 (via Senshi)
- For future room-image regenerations where canon iconography is already approved, use the approved existing asset as the primary reference input to `POST /v1/images/edits` instead of relying on a text-only redraw.
- The current regeneration was executed by `images/rooms/tools/fiveseals-gen.mjs` and refreshed the single canonical file at `images/rooms/FiveSeals.png`.
- Preserve the five-seal order as road into sunrise, upright gauntlet with palm eye, skeletal arm with balanced scales, seven-star circle, and black mask; keep the five heavy levers below.
- Keep all inscription surfaces abstract and illegible. Do not generate readable lettering or rune text.
- Omit `response_format` for the current OpenAI image endpoint, and validate returned bytes as a real PNG before overwriting the canonical asset.
