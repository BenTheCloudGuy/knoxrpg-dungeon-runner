# Squad Decisions

## Active Decisions

### Canon

#### Canon sources
[README.md](../README.md), [prizes.md](../prizes.md), [thoughts.md](../thoughts.md), and the existing room files under `rooms/` are canon. If something in those files contradicts a request, ask the user before changing them.

#### Don't guess or assume
Don't guess, make assumptions, or make things up. If you want to make a suggested change or assumption, or are not sure - ask the user.

#### Crystal/prize decoupling and Scrying Stone scope - 2026-09-06 (via Senshi)
Ben decoupled the 8 Crystal Shards from real-world prizes. There is one exit Crystal Shard for each school of magic. The crystals are dungeon props for color-locked doors and the final star-lock puzzle only. Players gather all 8 Crystal Shards and place them in the star-lock in the correct order to open the escape portal. The Black Crystal is one of the eight exit crystals and has no prize role, no grand-prize gate, and no rule keeping it off the main escape route. The Scrying Stone reveals clues for crystal color-locked doors and the correct final exit-lock order, plus room and Xhal'theris context where useful. It does not reveal treasure locations, bigger Treasure Items, prize tiers, prize cards, or real-world prizes. Real-world prizes are separate prize Item Cards found in the dungeon or bought from Treasure Goblins with in-dungeon gold at the listed prices in prizes.md. This supersedes older wording that tied the Scrying Stone, crystal clues, Black Crystal, or prizes.md to treasure reveals or real-world prize gates.

#### Prize Item Cards separated from crystals - 2026-09-06 (via Falin)
Falin confirmed crystals and real-world prizes are separate systems. Players claim prize Item Cards by finding them in the dungeon or buying them from Treasure Goblins with in-dungeon gold at the listed prices in `prizes.md`. The Dungeons & Dragons 2024 Core Rulebook Set + GM Screen is the highest-value prize card and is not tied to any crystal, including the Black Crystal.

#### Exit requires all 8 Key crystals, NO ORDER - 2026-10-02 (via Ben)
CANON OVERRIDE. The dungeon exit requires all 8 Key crystals with **no order**. The party collects all 8 Key crystals (one per school of magic) and places them to force the exit Portal open, in any order. There is **no star-lock sequence** and **no Scrying-Stone answer key for an order**. This resolves and closes the earlier "star-lock order unknown" open item. This supersedes the earlier wording (including the 2026-09-06 crystal/prize decoupling note and the README) that described placing crystals "in the star-lock in the correct order." Corrected to match: `rooms/Dungeon-Left.md` (D4 Portal Room) and `crystals.md`.

### Design

#### Lethal by design
This is a grinder for 8–12 players at level 3 with a hard 40 HP cap. Rooms should pressure players. Lethality is a feature, not a bug. Death is final; gear stays on the body.

#### Rest economy
Maximum 3 short rests total, each 15 real-world minutes, one Hit Die spent per rest. No long rests. Safe spaces are rare and may be traps.

#### Crystal integrity
There are exactly 8 exit Crystal Shards, one for each school of magic: White/Abjuration, Blue/Conjuration, Purple/Divination, Magenta or Pink/Enchantment, Red/Evocation, Yellow/Illusion, Black/Necromancy, and Green/Transmutation. All 8 are required to open the escape portal by placing them in the final star-lock in the correct order. The crystals are dungeon props for color-locked doors and the final exit-lock puzzle only. The Black Crystal is one of the eight exit crystals and has no prize role, no grand-prize gate rule, and no rule keeping it off the main escape route. Crystal placements must match the door and exit puzzle clue chain, not `prizes.md`.

#### H-shape with lava divider
The dungeon is roughly H-shaped. The middle bar is the lava/ruins zone, which separates Caves from Stone Dungeon. The Red Crystal lives in the lava zone.

#### Netheril prop screen aperture (foam border) - 2026-09-20 (via Senshi)
The Netheril prop's 1920x1080 screen sits behind a hand-carved foam border with an irregular cutout. The player UI keeps all content inside a safe rectangle by uniformly scaling and offsetting the whole app, so the school-web geometry never drifts. The single source of truth for the aperture is `config/screen-aperture.json`, read and written through `GET`/`POST /api/aperture`; do not hardcode insets elsewhere. First-pass measured insets (from an overhead grid photo) are top 150, right 195, bottom 165, left 165 screen px, with the full aperture polygon stored in the file. Recalibrate on the native panel whenever the foam is reseated using `/grid.html` (overhead photo), the in-app `Alt+G` tap tool (saves to `/api/aperture`), or `Alt+C` edge nudge.

### Voice

#### Writing style
No em-dashes. No flowery AI fantasy prose. Direct and grounded - the test is whether a real DM would say this out loud at the table. Complete sentences. Concrete nouns and verbs.

#### Xhal'theris voice
Cruel, amused, theatrical, clinical. Treats players as contestants and specimens. Speaks through psychic projection, carved mouths, statues, or dungeon mechanisms - does not need a physical body present.

#### Netheril prop UI rides the existing safe-area inset system - 2026-09-20 (via Senshi)
Advisory review (requested by Ben; no prop code changed). Verdict: confirmed-with-changes. All Netheril prop player-UI work (`props/knoxrpg-netheril-prop/`) must render through the existing safe-area model in `src/public/index.html`. Do NOT add a second, parallel inset system.

- Single source of truth for insets is the `safeArea` object (`top/right/bottom/left`), applied globally by `fitAppToViewport()`, which scales and offsets the whole `#app` (1920x1080). Every view is a child of `#app` and inherits the inset. No per-view CSS padding for foam clearance. Expose values as `--safe-*` from that one source.
- Persistence precedence is fixed: `?safe*` query params > localStorage `netheril-safe-area` > server `/api/aperture`. Venue calibration must persist via `/api/aperture` so it survives power-cycle and applies across displays. `/api/aperture` is the single inset authority.
- Calibration is GM-only and hidden from players: Alt+C nudge overlay and Alt+G grid/aperture mapping. Any new GM nudge control POSTs to `/api/aperture`, not a new store. Keep the debug outline GM-only.
- Corner clearance for the irregular tear uses a corner radius / clip-path on the content region (the diagonal tear bites deeper at corners), not four larger edge insets.
- Edge-anchored copy (e.g. the landing "Seek the crystals..." line) must reserve its own vertical space inside the 1080 design box so it cannot be clipped independent of the global inset. The current clip is a layout-clearance bug (`.preview-message` 56px wrapping and overflowing `body{overflow:hidden}`), not a global-inset problem.
- Prop cautions: foam is not repeatable (recalibrate on reseat); calibrate on the native panel with foam mounted; cutout is asymmetric; legibility-vs-area tradeoff.

#### Read-aloud format locked to TheCaverns C4-C6 template - 2026-10-02 (via Marcille)
The GM-approved read-aloud treatment in `rooms/TheCaverns.md` sections C4, C5, and C6 is the canonical format for all boxed text across the dungeon. Every room, trap/hazard, puzzle moment, and boss/notable-monster reveal carries read-aloud in this form:

- A bold label above the block, e.g. `**Read Aloud (entering)**`, `**Read Aloud (when the trap triggers)**`, `**Read Aloud (when X reveals itself)**`.
- A single `>` blockquote beneath it.
- Present tense, concrete, only what players can see/hear/smell, 2 to 4 sentences.
- Hard rules: no em-dashes, no "not X but Y", no sentence fragments for drama, complete sentences.

Supporting rulings applied this pass:
- Monster/boss reveals are grounded ONLY in the creature's `monsters/*.md` type and attacks. Those files carry no physical appearance, so looks are kept minimal and left to the GM.
- GM notes are concrete only (mechanics, secrets, consequences, what a check reveals). Writing advice and tone coaching are cut.
- Numeric-hash slop image embeds removed; functional handout images converted to plain-text handout cues; intentional named room map banners (`../images/rooms/*.jpg`) retained.

Open flags: several hazards still have no `monsters/` stat block (man-eating plants, Bertha, Mimic) - read-aloud added but stats remain provisional (Chilchuck); R10 Treasure Goblin prize economy and R11 wild-magic disable mechanism remain open (Falin / design).

### Content

#### Markdown only
This repo is content, not code. Rooms in `rooms/`, props in `props/`, handouts in `handouts/`, art in `images/rooms/`. Follow existing filename conventions in each folder.

#### Gob Stopper grenade deck - 2026-09-26 (via Senshi)
`items/decks/gob-stoppers/` now holds the Gob Stopper grenade print deck. The output is a full-page 9-up single-card sheet for printing many identical copies, with 9 fronts and 9 mirrored backs in `items/decks/gob-stoppers/sheet-01.pdf`. The deck reuses existing art from `items/magic-items/images/gob-stopper.png`; no image generation was used. The card source of truth is `items/magic-items/weapons/gob-stopper.md`, and the rebuild command is `node items\gob-stoppers-deck\tools\gob-stopper-render.mjs`.

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
Ben LOCKED the total dungeon coin drop at 2,845 GP (Ben owns the number), superseding the earlier ~1,800 GP estimate by about 1,045 GP. Canon homebrew coin values for the Vault: Copper 1, Silver 5, Gold 10, Platinum 50 GP (non-standard, not 5e defaults). 525 physical coins - 295 copper, 110 silver, 100 gold, 20 platinum - total 2,845 GP. Recomputed kit-out: ~237 GP/player (12 PCs) to ~355 GP/player (8 PCs), about 2-3 items each at the 108 GP catalog average (the 46-card deck totals 4,985 GP for one of each; the pool buys ~57%). Falin's recommended risk-tier distribution (Ben may override with a flat spread): Copper + Silver (845 GP) on the main escape path, Gold (1,000 GP) in optional danger, Platinum (1,000 GP) in the hardest optional rooms, keeping the escape route lean. Superseded 2026-09-06 and clarified 2026-09-20: the Black Crystal is one of eight exit crystals, one per school of magic, and no longer defines a grand-prize area or prize route. prizes.md unchanged (the coin drop is economy, not a crystal prize tier). Handoff to Laios for per-room placement by tier; Senshi for physical coin props (four denominations, 525 coins).

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

#### Statue boss official Sacred Statue chassis and Red Crystal eye - 2026-09-26 (via Chilchuck, Falin, Coordinator QA, logged by Cleric)
The Statue is canon boss content at `monsters/statue.md`. It uses the official 5e Sacred Statue chassis as the fighting body, animated by an Eidolon spirit per Ben's Eidolon lineage note. This is an official-stats policy application: coordinator QA verified that the official Sacred Statue is genuinely CR 12 with only 95 HP, with the threat offset by its resistances, immunities, attacks, and context. Do not "fix" this official CR 12 / 95 HP quirk by changing HP, AC, CR, attacks, damage, traits, or saves.

Placement is the Lava Room in `rooms/floorIsLava.md`, on a stable stone platform beside the Hop Stones. The Statue stays inert until a creature tries to remove the Red Crystal from its eye socket, then initiative starts and the Statue animates. The eye is the Red Crystal Shard, School of Evocation, with the Crystal Burst boon. It is one of the 8 exit Crystal Shards required for the star-lock, not ordinary treasure and not a prize item. The encounter is boss-by-selection: run it with the Lava Room hazard, Hop Stones, possible Lava Elementals, and party positioning, not by inflating the stat block.

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

#### Proxmark3 Kyber Crystal tooling scope - 2026-09-19 (via Senshi)
Senshi added `props/proxmark3-kyber-crystal-tooling.md` as a backstage physical prop tooling setup note for Ben's owned Disney Kyber Crystal RFID/NFC toy props through Proxmark3 on the VDI. Allowed scope is owned Disney Kyber Crystal RFID/NFC toy props only, limited to benign inventory, read, diagnostic, and toy-prop write workflows. Credential cloning, access-card bypass, and any badge, payment card, transit card, hotel key, lock system, or other unauthorized system are explicitly out of scope. Connection observation: `COM6` redirection works through .NET `SerialPort` and cmd mode, but `Win32_SerialPort` did not enumerate the redirected device, so WMI serial-port discovery should not be trusted for this VDI path. Ben will perform CLI installation and Proxmark3 verification directly in the main session.

#### Proxmark3 RRG client pin for Kyber Crystal tooling - 2026-09-19 (via Senshi)
Proxmark3 Kyber Crystal work remains backstage physical prop tooling for Ben's owned Disney Kyber Crystal toy props only. Public online references and working notes should be gathered under the local `.proxmark3/` directory so the prop-hardware documentation stays separate from player-facing prop files. The scope boundary remains strict: do not include access-card cloning, credential cloning, bypass workflows, badge systems, payment cards, transit cards, hotel keys, lock systems, or unauthorized credentials. The installed Proxmark3 client is intentionally pinned to RRG proxmark3 v4.21611 because Ben's device firmware reports capabilities v7. The latest RRG proxmark3 v4.23346 expects capabilities v11 and fails against this device, so do not treat the older client as accidental drift unless Ben updates the device firmware. If the repository owner wants this boundary to become reusable process guidance, update the prop-and-handout skill or a dedicated tooling note through the normal policy path rather than having Senshi edit the skill file directly.

#### Kyber Crystal RFID no-response troubleshooting branch - 2026-09-19 (via Senshi)
For Ben's owned Disney Kyber Crystal toy-prop RFID work, preserve the no-response troubleshooting branch where Proxmark3 connects and antennas tune cleanly, but Kyber crystals return no LF or HF response. Reader connection and antenna tune can be healthy while the crystal still does not couple or answer. Validate the Proxmark3 with a known LF test tag before assuming the crystals are readable in the current setup, try direct EM4x05 reads on the owned Kyber crystals, and test crystal orientation and distance because cylindrical or glass-capsule tags can be sensitive to LF antenna placement. If known LF tags read correctly but Kyber crystals still do not respond, consider a stronger or external 125 kHz LF antenna for the toy-prop bench. This applies only to owned Disney Kyber Crystal toy props and does not authorize credential cloning, access-card bypass, badge systems, payment cards, transit cards, hotel keys, locks, or any third-party tag operation.

#### Kyber Crystal Netheril reader vs Proxmark3 Easy diagnosis - 2026-09-19 (via Senshi)
For Ben's owned Disney Kyber Crystal toy props, the likely explanation for "the Netheril prop reads the crystal, but the Proxmark3 Easy sees nothing" is a mix of frequency, protocol, coupling, and tooling fit. Treat the crystal as likely 125 kHz LF glass-capsule or EM-style until Ben confirms the Netheril reader hardware. Use the correct Proxmark3 LF command family for owned toy diagnostics, such as EM-style or EM4x05 reads, rather than relying only on broad LF or HF searches. The Netheril prop reader may have a coil or slot geometry that couples strongly to the crystal, while the Proxmark3 Easy's small flat LF antenna may tune cleanly and still fail to energize a cylindrical tag in the wrong orientation. Keep the pinned Proxmark3 client matched to the device firmware capabilities until Ben updates the device firmware. This note applies only to Ben's owned Disney Kyber Crystal toy props and Ben's own Netheril prop reader. It does not authorize credential cloning, access-card bypass, payment, transit, hotel, badge, lock-system, or third-party tag work. Source file: `.proxmark3/proxmark3-kyber-crystal-tooling.md`.

#### Kyber Crystal tag-denied troubleshooting branch - 2026-09-19 (via Senshi)
For Ben's owned Disney Kyber Crystal toy-prop RFID work, preserve the new tag-denied troubleshooting branch separately from the older no-response branch. `lf em 4x05 read -a 6` now returns `Tag denied Read operation` instead of no answer. This means coupling is good enough to reach the EM4305, but read access is denied, likely because of password or access configuration. Before any write, safe next steps are limited to `lf em 4x05 info`, read or dump attempts using the local owned-toy Kyber and handheld-writer passwords `00000000`, `F9DCEBA0`, `7686962A`, and `2A968676`, and `lf em 4x05 chk`. If access succeeds, save a dump before changing anything. This applies only to Ben's owned Disney Kyber Crystal toy props and does not authorize credential, access-card, payment, transit, hotel, lock, badge, or third-party tag workflows. Source files: `.proxmark3/proxmark3-kyber-crystal-tooling.md`, `C:\Users\benthebuilder\.proxmark3\kyber-crystals\README.md`, and `C:\Users\benthebuilder\.proxmark3\kyber-crystals\pm3-quick-commands.txt`.

#### Kyber Crystal RFID config/protection state changed - 2026-09-19 (via Senshi)
For Ben's owned official Disney Kyber Crystal toy prop only, preserve the new write-result evidence and changed-protection-state warning. `lf em 4x05 write -a 2 -d 00000000 -p F9DCEBA0` was denied, but `lf em 4x05 write -a 4 -d 0001805F -p 00000000` returned `Data written and verified`. Before that config write, a0 was denied both without a password and with `F9DCEBA0`; after the config write, a14 with `F9DCEBA0` returned no answer and a15 with `F9DCEBA0` was denied. Address 4/config was modified successfully, so the config or protection state likely changed. Stop generic password guessing, avoid further writes, and do not suggest repeated `F9DCEBA0` reads. Next minimal verification is to check whether EM410x broadcast still works, test the crystal in the Netheril prop, then read a4, a5, and a6 with no password or `00000000` only if needed. This applies only to owned Disney Kyber Crystal toy props and does not authorize credential, access-card, payment, transit, hotel, lock, badge, or third-party tag workflows. Source file: `.proxmark3/proxmark3-kyber-crystal-tooling.md`.

#### Kyber Crystal source-grounding correction - 2026-09-19 (via Senshi)
For Ben's owned Disney Kyber Crystal toy-prop RFID work, do not assert that official Disney Kyber crystals are inaccessible unless a source supports that claim. Public makerProjects cached docs identify Disney Kyber crystals as EM4305 / EM4x05 tags configured for EM4100-style output. Address 06 is the base EM4100-style ID family, Series 2-aware behavior depends on address 09, and Proxmark3 Easy is documented as capable of reading and writing individual EM4305 addresses when access allows. Current observed evidence is that PM3 reads EM410x ID `1111000C03`, EM4x05 reads are denied, and address 4/config write with `00000000` succeeded once. EM410x ID `1111000C03` alone is insufficient to prove Series 1 versus Series 2. Next evidence should be address 09 if access allows, or physical packaging / known behavior in a Series 2-aware holocron or wayfinder. Avoid further unsupported claims and avoid further writes unless Ben explicitly decides to recover an already unusable owned toy prop.

#### Kyber RFID online-source standard - 2026-09-19 (via Senshi)
When a Kyber RFID answer asks for evidence, use online, citeable sources directly and quote them. Do not treat local `.proxmark3/` notes or cached references as proof for user-facing claims. Current online source boundary: the public Galaxy's Edge technology spreadsheet says Kyber crystals contain EM4305 RFID tags, default-read address words 5 and 6 simulate EM4100, holocron and lightsaber readers use EM4100, address 6 is the value to use when changing a Kyber crystal with Proxmark3, and the decoded EM4100 ID is the TAG ID field. The RRG Proxmark3 command dump lists `lf em 4x05 dump`, `info`, `read`, and `write` support for EM4205, EM4305, EM4369, and EM4469 tags. WDWNT reports Series 2 crystals work with Series 2 holocrons, Series 1 holocrons, and Galaxy's Edge lightsabers. The online sources found do not prove that an EM410x ID such as `1111000C03` or `0C03` can distinguish Series 1 from Series 2 by itself; the spreadsheet shows address 09 as `00000000` in sample dump rows but does not explain a Series 2 or player-facing meaning for address 9.

#### Kyber RFID v4.21611 diagnostic-only command path - 2026-09-19 (via Senshi)
For Ben's owned Disney Kyber Crystal toy props after the observed address 4 config write, use diagnostic-only Proxmark3 v4.21611 commands unless Ben explicitly decides to recover an already unusable owned toy prop. Senshi's local source review found that `lf em 4x05 read -p` issues a login before read, so no separate login command is needed, but the firmware does not verify the login response before issuing READ. `lf em 4x05 chk` validates password candidates with a login command only, so a found password does not prove that protected reads will succeed. Address 4 is the config block, and `0001805F` is the built-in EM4305 EM/UNIQUE config, RF/64 Manchester, 2 default-read blocks. Useful source paths for future local verification are `C:\Tools\proxmark3-v4.21611\client\src\cmdlfem4x05.c`, `C:\Tools\proxmark3-v4.21611\armsrc\lfops.c`, `C:\Tools\proxmark3-v4.21611\client\src\cmdlfem4x05.h`, and `C:\Tools\proxmark3-v4.21611\include\protocols.h`.

#### Cultist Tomb cryptex symbol set - 2026-09-20 (via Marcille)
For the Black Necromancy Crystal fake-book cryptex near the Ruins, the approved five-symbol set is: scales over skull, crowned skull, bone quill and ledger, bloody dagger, and skull-topped wand. Final art must be original, readable at insert size, and should use simple black silhouettes or two-tone line art. Do not use letter initials, acrostics, readable runes, alphabetic clues, generic built-in icon sets, or direct copies of official Forgotten Realms deity marks such as Kelemvor, Myrkul, Bhaal, Jergal, Vecna, the Raven Queen, or other official symbols. Each symbol should feel like a rough, carved, ritual cult emblem.

#### Cryptex death-insert laser-etch standard - 2026-09-20 (via Senshi)
Senshi confirmed the five-symbol death set for the Cultist Tomb cryptex (Black Necromancy Crystal) is approved and matches `props/cryptex-symbols/README.md` and canon (`scryingstone.md`: Black = Necromancy). Symbols I-V (Kelemvor scales / Myrkul skull / Jergal scroll+quill / Bhaal skull+blood / Orcus skull-rod) each connote "death" and together clue the cryptex answer DEATH. Copyright posture is fine: original redraws of generic death iconography, not copies of official WotC/Forgotten Realms deity art. Laser-etch art standard (applies to all future etch props): (1) negative space (eyes, tooth gaps, scroll lines, feather spine) MUST be true even-odd subtraction inside a single black filled path, never white-fill overlays and never strokes; (2) convert all strokes to filled outlines before export; (3) minimum feature/gap ~0.35 mm at smallest intended size (~12 units in a 512 artboard at 15 mm), and cut a 15 mm AND a 20 mm test tile before any batch run. Action items: #3 Jergal needs rework before etching (it currently uses white fills + white strokes as fake negative space; rebuild as one black compound path with subtracted detail); #4 Bhaal flagged for skull-blur vs #2 Myrkul, recommend bolder/fewer blood drops or a smaller skull so it reads distinct at 15-25 mm; cut inserts to identical outer dims with an orientation notch, keep them captive in the book frame, hold 1-2 spares per symbol, and count 5 out / 5 back at teardown.

#### Hob Gob boss encounter calibration - 2026-09-20 (via Chilchuck)
Boss-tier goblin encounters for this project should not rely on a single high-HP stat block. Against 8 to 12 level 3 PCs with a 40 HP cap, a real boss needs legendary actions, lair actions, minion-command mechanics, and a clear reinforcement cap so the DM can choose between hard pressure and likely TPK pressure.

Applied precedent: `monsters/hob-gob.md` sets Hob Gob at CR 8 with 178 HP, 3 legendary actions, lair actions, minion commands, Royal Guard damage splitting, and goblin reinforcement pressure. Suggested starting minions scale from 8 Goblin Warriors and 1 Goblin Boss for 8 PCs up to 12 Goblin Warriors and 2 Goblin Bosses for 12 PCs. Suggested reinforcement cap is 16 Goblin Warriors and 3 Goblin Bosses unless Ben explicitly wants a likely TPK.

Open handoffs: Laios must confirm Hob Gob's room placement. Falin must confirm any future Crystal Shard assignment. Hob Gob currently guards no assigned crystal.

### Design

#### Netheril prop clue-page Back button - 2026-09-20 (via Senshi)
Keep a visible Back button on the Netheril prop clue page (`#page-view`) as the primary close control, with swipe-down retained as a fallback, because swipe-down close is unreliable on the physical device. The button should reuse the existing `handlePageClose(e)` handler, the same action as swipe-down, so it returns to the crystal page when a crystal is active and to the landing page otherwise.

Confirmed approach: place the control lower-left inside the 1920 by 1080 design box, inset from the extreme corner, and gate visibility through `body.view-page #page-back`. Because the whole `#app` box is uniformly scaled into the measured foam aperture, a properly parented child of `#app` remains inside the visible foam window.

Required follow-up before treating the current implementation as final: fix the duplicate `<div id="page-view">` and div imbalance that can reparent `#page-back` under `#center-col`, enlarge the touch target for the recessed kiosk, and improve contrast for on-device legibility. Hardware test with the locked aperture should confirm the button is visible, not under foam, returns correctly from clue pages, and does not break swipe-down.

### Content

#### Crystal deck output folder spelling - 2026-09-26 (via Ben request)
Ben requested the printable Crystal card deck output under `items/decks/cyrstals/`. Keep that misspelled folder path as the intentional output location for this batch unless Ben later asks to rename or mirror it.

#### Gold Crystal boon card label - 2026-09-26 (via Falin and Coordinator) [SUPERSEDED]
SUPERSEDED 2026-09-26: `crystals.md` now defines the Gold Crystal's canon boon as `Barter Specialist`, with full Treasure Goblin discount power text. This entry is historical only.

`crystals.md` does not give the Gold Crystal boon a canon name. The Crystal deck uses `Golden Tongue` as a plain, player-readable card label only. It is not a canon-named power and does not change the Gold Crystal's power text.

#### Gold Crystal canon boon and power - 2026-09-26 (via Senshi and Coordinator)
`crystals.md` defines the Gold Crystal's canon boon as `Barter Specialist`. The canon power grants Treasure Goblin discounts equal to 5% times the bearer's Charisma modifier, minimum 5% and maximum 25%, applies only to the bearer, and includes the trailing barter line. `items/crystals/gold.md` now matches that canon text exactly, replacing the old `Golden Tongue` placeholder label.

#### Ammunition decks and shared renderer - 2026-09-26 (via Senshi)
`items/decks/arrows/` and `items/decks/crossbow-bolts/` now hold full-page 9-up single-card ammunition deck sheets. Outputs are `items/decks/arrows/sheet-01.pdf` and `items/decks/crossbow-bolts/sheet-01.pdf`, each a 2-page duplex-ready PDF with 9 fronts and 9 backs for one ammunition card type. Both decks reuse existing treasure art from `items/treasure/images/`; no image generation was used. The shared rebuild pattern is the parameterized renderer at `items/ammo-deck/tools/ammo-render.mjs`, with isolated per-deck build folders and output folders. Rebuild commands: `node items\ammo-deck\tools\ammo-render.mjs arrows` and `node items\ammo-deck\tools\ammo-render.mjs crossbow-bolts`.

#### Firearm Ammunition deck and generated art - 2026-09-26 (via Senshi)
`items/decks/firearm-ammunition/` now holds the full-page 9-up single-card Firearm Ammunition deck sheet. Output is `items/decks/firearm-ammunition/sheet-01.pdf`, a 2-page duplex-ready PDF with 9 fronts and 9 mirrored backs for the `Firearm Ammunition (10)` gear card. The source gear item is `items/treasure/firearm-ammunition-10.md`, using the 2024 PHB/free-rules firearm ammunition entry: Adventuring Gear, 3 gp, 2 lb., ammunition for pistol or musket, 10 round balls plus black powder, non-recoverable. Senshi generated real `gpt-image-1` painterly card art at `items/treasure/images/firearm-ammunition-10.png`; no fallback art was used. `items/ammo-deck/tools/firearm-gen.mjs` is the art generator for this card, and `items/ammo-deck/tools/ammo-render.mjs firearm-ammunition` is the shared renderer subcommand for rebuilding the PDF. Rebuild commands: `$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User"); node items\ammo-deck\tools\firearm-gen.mjs` then `node items\ammo-deck\tools\ammo-render.mjs firearm-ammunition`.

#### Goblin Artificer's Scoped Musket magic-item card - 2026-09-26 (via Chilchuck, Falin, Senshi)
`Goblin Artificer's Scoped Musket` is canon Goblin Artificer boss loot and now has a Magic Item Deck card. It is an Uncommon magic weapon, requires no attunement, and is priced at 150 GP, matching the existing flat +1 weapon baseline for `musket-1` and `crossbow-light-1`. Base item: Musket, Martial Ranged, 1d12 Piercing; Ammunition (Range 40/120; Bullet), Loading, Two-Handed; ammunition is firearm ammunition, round ball and black powder; Mastery: Slow. It grants +1 to attack and damage rolls. Scope rule: while making a ranged attack with this musket, you ignore the disadvantage normally imposed for attacking a target at long range. Chilchuck deliberately omitted any stationary aim rider or usage limit because the scope adds no extra damage, control, healing, flight, teleport, or save-or-die effect.

Senshi created `items/magic-items/weapons/goblin-artificers-scoped-musket.md`, generated real `gpt-image-1` art at `items/magic-items/images/goblin-artificers-scoped-musket.png`, added the slug once to `items/magic-items/deck/tools/render-cards-v2.mjs`, rendered front and back PNGs, and rebuilt `items/magic-items/deck/magic-item-deck-printandplay.pdf`. The active Magic Item Deck manifest is now 54 cards and the assembled PDF is 12 pages, 6 sheets. This supersedes stale references to the active magic-item deck as 46 cards. Ben's expected 46 to 47 change was based on an older count; the manifest was already 53 after the named spell-scroll replacement and is now 54. Optional future cleanup: `items/magic-items/deck/build/fronts` currently has 58 PNGs, so a few stale build artifacts exist outside the 54-card active manifest. This is not a deck-count defect.

#### Dagger weapon deck and dedicated renderer - 2026-09-26 (via Senshi)
`items/decks/daggers/` now holds the full-page 9-up single-card Dagger weapon deck sheet. Output is `items/decks/daggers/sheet-01.pdf`, a 2-page duplex-ready PDF with 9 identical fronts and 9 mirrored backs for the `Dagger` weapon card. The source of truth is `items/weapons/dagger.md`. The deck reuses existing art from `items/weapons/images/dagger.png`; no image generation was used. The back is a weapon-stat back, not the ammunition gear-field back, and renders Category, Damage, Properties, Mastery, Weight, and Cost. Senshi created the dedicated renderer at `items/daggers-deck/tools/dagger-render.mjs` plus `items/daggers-deck/README.md`. Rebuild command: `node items\daggers-deck\tools\dagger-render.mjs`.

#### Chilchuck official stat-block policy - 2026-09-26 (via Coordinator, logged by Cleric)
Chilchuck's stat-block policy is now hard canon. Default to official published stats as written, using the 2024 Monster Manual first. If a creature exists only in 2014 rules, present the real numbers in 2024 format without retuning HP, AC, CR, traits, or attacks. If a requested creature is not a 5e monster, convert it faithfully into a proper 5e 2024 stat block using standard 2024 math so it reads like an official Monster Manual entry. Do not create scenario-specific homebrew stat blocks, scenario traits, custom mechanics, or altered numbers for this dungeon. Calibrate the lethal 8 to 12 level-3 party with a 40 HP cap, limited rests, and intended danger by selecting official monsters and adjusting quantity, not by editing stat blocks. TPK warnings may still appear in DM notes. This SUPERSEDES earlier custom-mechanic-design guidance, including swarm, lair, legendary, and environmental effects as homebrew invention, and any calibrate-up-by-changing-stats guidance. Those tools are allowed only when they are official 5e mechanics used as published or when converting a non-5e monster into official-style 5e.

#### Hob Gob official-stat precedent - 2026-09-26 (via Chilchuck and Falin, logged by Cleric)
Hob Gob, the Goblin King, is canon boss content at `monsters/hob-gob.md` and is the first completed stat block built under Chilchuck's new official-stats policy. He uses the official Green Slaad chassis as the rules base, reskinned as Hob Gob, with level 5 Druid spellcasting. The stat block keeps Ben's supplied header numbers and presents the result in 2024 Monster Manual format. This supersedes the earlier bespoke Hob Gob boss mechanics such as custom legendary actions, lair actions, guard-splitting, and reinforcement commands. Hob Gob lives in Goblin Camp Area 7, the Druid Circle. His body loot is Goblin Artificer's Scoped Musket x1, Gob Stopper x2, and Firearm Ammunition (10) x1; Falin verified all three item files exist under `items/` and that the loot does not conflict with prize or crystal canon.

#### Berhan Voss official Flesh Golem mini-boss - 2026-09-26 (via Chilchuck and Falin, logged by Cleric)
Berhan Voss, the Alchemist (Mutant), is canon mini-boss content at `monsters/berhan-voss.md`. He uses the official Flesh Golem chassis as the rules base, reskinned as the mutated alchemist, and remains CR 5 for 1,800 XP. This applies Chilchuck's official-stats policy to Berhan and supersedes any older custom-stat or bespoke-trait treatment of the roaming mutation threat. Berhan is tied to the Green Crystal hunt in the Alchemist Workshop: after the Green Crystal is taken, he appears and focuses the crystal-bearer as DM-note tactics, not as a custom stat-block trait or required guardian gate. Falin confirmed the Green Crystal is Transmutation, grants Burst of Motion once per game hour, is located in the Alchemist Workshop, and is one of the eight exit Crystal Shards. Treasure is None. Official-stat header reconciliations recorded for this application: the supplied Strength save was corrected from +10 to Str +8, and the fake `transmutation` condition immunity was removed in favor of the official Immutable Form trait plus the Flesh Golem condition immunity set.

### Content

#### Drider Priestess of Lloth boss package - 2026-09-26 (via Chilchuck, Falin, Senshi, logged by Cleric)
Drider Priestess of Lloth is canon boss content at `monsters/drider-priestess.md`. She uses the official 2024 Drider chassis as the rules base, reskinned as a Priestess of Lloth, with separate level 4 divine Cleric spellcasting: spell save DC 14, spell attack +6, and 4 first-level slots plus 3 second-level slots. The newest level 4 instruction supersedes the earlier level 5 To-Do note. Placement is `rooms/The Caverns.md` C5 "The Dwarven Forge" and C6 "The Brackish Waters," with the priestess hiding in the C6 webs and treating C5/C6 as her domain.

#### Drider Priestess body loot and Magic Item Deck integration - 2026-09-26 (via Chilchuck, Falin, Senshi, logged by Cleric)
The Drider Priestess of Lloth body loot is Three-Headed Snake Whip and Handbook of Lloth. Three-Headed Snake Whip is a Rare magic whip requiring attunement, priced at 300 GP. Handbook of Lloth is an Uncommon Spellbook Bundle of 5, priced at 210 GP, containing Thorn Whip, Darkness, Spider Climb, Web, and Fear. Senshi created `items/magic-items/weapons/three-headed-snake-whip.md` and `items/magic-items/spellbooks/handbook-of-lloth.md`, generated real gpt-image-1 art for both, added each once to the Magic Item Deck render roster, and rebuilt `items/magic-items/deck/magic-item-deck-printandplay.pdf`. The active Magic Item Deck is now 56 cards and 14 pages.

#### Sysuul Spawn user-authored Medusa rescale - 2026-09-26 (via Chilchuck, Falin, logged by Cleric)
`monsters/sysuul-spawn.md` is canon Sysuul Spawn mini-boss content for the Medusa Room. This entry documents the explicit exception to Chilchuck's official-stat policy: Ben hand-authored the creature's numbers and asked for faithful transcription, so the user's explicit design yields over the default official-stats flow. Preserve Ben's supplied numbers and custom tweaks, including AC 15, HP 85, CR 5, Watchful Heads, and Petrifying Gaze without the standard Medusa fail-by-5 instant-petrify clause.

Placement and crystal hook: Sysuul Spawn is the "3 headed Medusa Creature" guarding the Medusa Room chest. The chest key is worn around its neck. The chest holds the Magenta / Pink Crystal, School of Enchantment, boon Compel. The Magenta / Pink Crystal is one of the eight exit Crystal Shards, not ordinary treasure and not a prize. Follow-up flag: `rooms/medusaLair.md` is currently an empty stub and still needs a room write-up.

#### Giant Slime official Gelatinous Cube mini-boss - 2026-09-26 (via Chilchuck and Falin, logged by Cleric)
`monsters/giant-slime.md` is canon Giant Slime mini-boss content for `rooms/The Caverns.md` C-7 "Slime Time." It uses the official 2024 Gelatinous Cube chassis, CR 2, reskinned by name and flavor only. This follows Chilchuck's official-stat policy. Do not retune its AC, HP, damage, save DCs, escape DC, or CR. Its boss calibration is boss-by-selection and room framing: use C-7 difficult terrain and Door G's Dripping Slime hazard, 2d6 Acid with DC 16 Constitution save for half, to make the fight matter. The official Engulf action keeps the acid damage and escape rules.

Treasure inside the ooze is +1 Dagger, +1 Studded Leather, Gold, and the White Crystal. Falin confirmed the White Crystal is the Abjuration exit Crystal Shard with Ward Against Ruin, one of the eight exit Crystal Shards, not ordinary treasure and not a prize. The separate C-7 room find remains separate from the inside-the-ooze loot: 2x Gob Stoppers near a Goblin Scout on Investigation DC 12.

#### Goblin roster official-chassis variants - 2026-09-26 (via Chilchuck and Falin, logged by Cleric)
`monsters/goblins.md` is the canon Goblin roster for Hob Gob's rank-and-file in the Goblin Camp, Goblin Tunnels, and Goblin Grotto bridge. The requested roster contains eight distinct stat blocks, not nine, so the file records eight official-chassis variants without inventing an extra entry. Feywild Guard, baseline Goblin Warrior, Flying Goblin, Caster Goblin, Goblin Artificer, and Shaman Goblin use Goblin Warrior as their rules chassis. Bombardier Goblin uses Goblin Boss. Goblin Dog uses the official 5e Mastiff CR 1/8 chassis, reskinned as the goblins' war-hound, with no number retuning.

The Goblin Artificer drops the Goblin Artificer's Scoped Musket on death. No goblin in this roster carries a Crystal Shard. Falin confirmed the Yellow Crystal remains the Illusion exit Shard in the Goblin Camp, with the `False Double` boon, and is one of the eight exit Crystal Shards under Hob Gob's domain.

Open design point: the Caster Goblin and Shaman Goblin currently use the base goblin casting ability modifier of -1 plus proficiency, so both sit at spell save DC 9 and spell attack +1. This follows Ben's instruction to compute spellcasting from base goblin ability scores. If Ben wants these casters to be real threats, an optional future pass can raise their casting stats to about 14 for roughly DC 12.

#### Goblin caster DC item closed and Scoped Musket fidelity fix - 2026-09-26 (via Ben and Chilchuck, logged by Cleric)
Ben chose to close the open goblin class-caster design point by raising both goblin class-casters to real caster pressure: Caster Goblin now uses Charisma 14 (+2) and Shaman Goblin now uses Wisdom 14 (+2), giving both spell save DC 12 and +4 to hit with spell attacks. Slots stay unchanged: Caster Goblin remains Sorcerer 3 with 4 first-level slots and 2 second-level slots, and Shaman Goblin remains Cleric 2 with 3 first-level slots and no second-level slots. Shaman Goblin's passive Perception, Cure Wounds, and Healing Word now follow the raised Wisdom modifier.

Chilchuck also corrected the Goblin Artificer's Scoped Musket action for item fidelity. The fabricated Advantage damage rider was removed so the monster action now matches `items/magic-items/weapons/goblin-artificers-scoped-musket.md`: +5 to hit, range 40/120, Hit: 9 (1d12 + 3) Piercing damage, and the scope ignores long-range Disadvantage. The Pistol and Dagger keep the official Goblin Warrior chassis Advantage rider.

#### Monster file convention and Goblin roster split - 2026-09-26 (via Ben and Chilchuck, logged by Cleric)
The `/monsters` convention is now one file per monster. The grouped goblin roster formerly held in `monsters/goblins.md` has been split into eight dedicated files: `monsters/feywild-guard.md`, `monsters/bombardier-goblin.md`, `monsters/goblin-warrior.md`, `monsters/flying-goblin.md`, `monsters/caster-goblin.md`, `monsters/goblin-artificer.md`, `monsters/goblin-dog.md`, and `monsters/goblin-shaman.md`. Each file contains that monster's copied stat block with the monster heading promoted to H1.

`monsters/goblins.md` is now a Goblin Roster link index containing the title, original intro paragraph, and links to the eight dedicated goblin files. It is not a stat-block container. Future references to individual goblins should point at their dedicated monster files rather than `monsters/goblins.md`. This supersedes earlier wording that treated `monsters/goblins.md` as the goblin stat-block roster container.

#### Official-chassis zone creature files - 2026-09-26 (via Chilchuck and Falin, logged by Cleric)
Five new canon zone creatures each have one dedicated file under `monsters/`: Zombie (`monsters/zombie.md`, official Zombie CR 1/4, undead zone), Giant Spider (`monsters/giant-spider.md`, official Giant Spider CR 1, Caverns spider domain), Large Constrictor Snake (`monsters/constrictor-snake.md`, renamed from `monsters/giant-constrictor-snake.md`, official Constrictor Snake CR 1/4, not the Huge Giant Constrictor Snake CR 2), Wraith (`monsters/wraith.md`, official Wraith CR 5, undead zone), and Magma Elemental (`monsters/magma-elemental.md`, official Fire Elemental CR 5 chassis reskinned for the Lava Room). None carry a Crystal Shard. Calibrate all five by creature selection and quantity, not stat retuning.

### Content

#### Lizardfolk and forge official-chassis creature batch - 2026-09-27 (via Chilchuck and Falin, logged by Cleric)
Seven new canon creatures each have one dedicated file under `monsters/`: Lizardfolk Fighter (`monsters/lizardfolk-fighter.md`, official Lizardfolk CR 1/2 with fighter loadout and Hold Breath kept), Baron Kepmak (`monsters/baron-kepmak.md`, official Lizard King/Queen CR 4 reskinned by name, explicitly distinct from Sahuagin Baron), Sahuagin Baron (`monsters/sahuagin-baron.md`, official Sahuagin Baron CR 5), Lizard Mage (`monsters/lizard-mage.md`, official Lizardfolk plus Wizard 4 with INT 16, spell save DC 13, +5 to hit, and legal 4/3 slots), Lizard Shaman (`monsters/lizard-shaman.md`, official Lizardfolk plus Druid 4 with WIS 16, spell save DC 13, +5 to hit, and legal 4/3 slots), Green Slaad (`monsters/green-slaad.md`, official Green Slaad CR 8, deployed as x2 when Ben wants a heavy fight, with acid or fire stopping Regeneration), and Dwarven Iron Golem (`monsters/dwarven-iron-golem.md`, official Iron Golem CR 16 reskinned as a Dwarven Forge guardian NPC ally).

Caster-building standard from this batch: class-leveled NPC casters get class-appropriate casting stats from the start, usually landing around spell save DC 13 and +5 to hit for this tier, rather than deriving spellcasting from weak base-creature mental scores. This applies the caster-stat lesson from the goblin caster cleanup.

Falin confirmed all seven are plausible Caverns or forge-zone creatures/NPCs with no room contradictions. The Dwarven Iron Golem ally is directly supported by `rooms/The Caverns.md` and `thoughts.md`: it aids players in C-5 after they relight Moradin's forge and earn the armored guardians' help, but should defend the forge and hold chokepoints rather than trivialize the rest of the dungeon. None of the seven carries a Crystal Shard. The Blue Crystal remains the fixed Conjuration exit-puzzle crystal in the Dwarven Forge area.

#### Lava, earth, and spider official-chassis reskin batch - 2026-09-27 (via Chilchuck and Falin, logged by Cleric)
Four new canon reskin creatures each have one dedicated file under `monsters/`: Ashari Fire Elemental (`monsters/ashari-fire-elemental.md`, official Fire Elemental CR 5), Magma Landshark (`monsters/magma-landshark.md`, official Bulette CR 5), Demonfeed Spider (`monsters/demonfeed-spider.md`, official Phase Spider CR 3), and Cinderslag Elemental (`monsters/cinderslag-elemental.md`, official Earth Elemental CR 5). Their themes are flavor and DM Notes only. Do not add homebrew fire damage, lava mechanics, custom traits, or altered official numbers.

Chassis overlap map: the Fire Elemental chassis is intentionally used by both `monsters/magma-elemental.md` and `monsters/ashari-fire-elemental.md`, so do not field both as if they were mechanically different stat blocks unless Ben wants duplicate Fire Elementals in the same fight. Cinderslag Elemental uses the Earth Elemental chassis, so it is distinct from the Fire Elemental reskins. Demonfeed Spider uses the Phase Spider chassis, so it is distinct from `monsters/giant-spider.md`, which remains the official Giant Spider CR 1 file.

Falin confirmed all four are plausible Lava Room, earth-lava, or spider-ruins zone creatures with no room contradictions. None carries a Crystal Shard. The Red Crystal remains the Evocation exit Shard in the Statue's eye in the Lava Room, not body loot and not a prize card.

#### Stat blocks no longer include DM Notes - 2026-09-27 (via Chilchuck, logged by Cleric)
Monster stat blocks no longer contain a `### DM Notes` section. Stat-block files now contain only official stat block content, including rules text, inline spell summaries, actions, bonus actions, reactions, traits, senses, languages, challenge, and other monster-facing rules content. Campaign context belongs in room files, not monster stat blocks.

This supersedes the earlier stat-block format that included DM Notes. Placement, treasure, tactics, TPK warnings, room triggers, puzzle links, and other campaign-specific instructions should be recorded in the relevant `rooms/` file instead.

Open follow-up, relocate these captured campaign facts into room files:
- Berhan Voss appears when the Green Crystal is taken, then hunts the carrier.
- Bombardier Goblin carries 10 Gob Stoppers.
- Goblin Artificer drops the Goblin Artificer's Scoped Musket.
- Hob Gob belongs in Goblin Camp Area 7 and drops the Scoped Musket, 2 Gob Stoppers, and Firearm Ammunition (10).
- Drider Priestess is the C5/C6 boss and drops the Three-Headed Snake Whip and Handbook of Lloth.
- Statue has the Red Crystal as its eye, and removing it triggers the statue to animate.
- Sysuul Spawn has the chest key around its neck, and the petrification cure is Greater Restoration.
- Dwarven Iron Golem becomes an ally after Moradin's forge is relit, but stays forge-bound.
- Giant Slime inside-the-ooze loot facts, including +1 Dagger, +1 Studded Leather, and White Crystal, were already gone from `monsters/giant-slime.md`; they remain supported by `rooms/The Caverns.md` and prior decisions.

Anomalies from this batch:
- `monsters/goblins.md`, the Goblin Roster link index, is missing from the repo.
- `monsters/giant-slime.md`, `monsters/ashari-fire-elemental.md`, and `monsters/baron-kepmak.md` had already been regenerated without DM Notes before this batch, likely due to concurrent external activity in the shared environment.

#### Goblin index restored and Giant Slime Ooze Cube fidelity - 2026-09-27 (via Chilchuck, logged by Cleric)
`monsters/goblins.md` is restored as a Goblin Roster link index only. It links the eight dedicated goblin monster files with requested counts: Feywild Guard x3, Bombardier Goblin x1, Goblin Warrior x15, Flying Goblin, Caster Goblin x1, Goblin Artificer x1, Goblin Dog x2, and Goblin Shaman / Medicine Man x1. It contains no duplicated stat blocks and no DM Notes.

`monsters/giant-slime.md` keeps the official 2024 Gelatinous Cube chassis fidelity for the `Ooze Cube` trait. Engulf references the Ooze Cube trait, and a successful DC 12 Strength (Athletics) escape moves the target to the nearest unoccupied space without adding the prone condition. Preserve the existing Giant Slime acid values: 3d6 Acid on a failed Engulf save, 3d6 Acid at the start of the engulfed target's turns, and DC 12 for the relevant saves/checks.

### Content

#### Magic Item Deck 8-card vendor prices - 2026-09-27 (via Falin)
Falin set Treasure Goblin vendor prices for eight curated Magic Item Deck additions, anchored to the existing deflated deck economy.

| Slug | Card | Rarity | Final price | Anchor |
| --- | --- | --- | ---: | --- |
| `sending-stones` | Sending Stones | Uncommon | 100 GP | Anchored to Driftglobe and the 100 GP reusable utility band. |
| `lantern-of-revealing` | Lantern of Revealing | Uncommon | 125 GP | Above Driftglobe because it is reusable detection utility. |
| `goggles-of-night` | Goggles of Night | Uncommon | 100 GP | Anchored to Driftglobe and the 100 GP reusable utility band. |
| `brooch-of-shielding` | Brooch of Shielding | Uncommon | 150 GP | Aligned with the flat +1 weapon defensive band. |
| `gloves-of-swimming-and-climbing` | Gloves of Swimming and Climbing | Uncommon | 125 GP | Between Rope of Climbing and the +1 weapon band for reusable movement utility. |
| `ring-of-protection` | Ring of Protection | Rare | 300 GP | Top of this batch and tied to the current Rare ceiling. |
| `boots-of-elvenkind` | Boots of Elvenkind | Uncommon | 125 GP | Above Driftglobe for reusable stealth utility but below +1 weapons. |
| `cloak-of-protection` | Cloak of Protection | Uncommon | 250 GP | Above Bag of Holding and below the Rare ceiling because it improves AC and all saves. |

#### Magic Item Deck local-art rule and 64-card expansion - 2026-09-27 (via Senshi)
The curated Magic Item Deck now includes these eight additions: Sending Stones, Lantern of Revealing, Goggles of Night, Brooch of Shielding, Gloves of Swimming and Climbing, Ring of Protection, Boots of Elvenkind, and Cloak of Protection. The active deck expanded from 56 to 64 cards, and `items/magic-items/deck/magic-item-deck-printandplay.pdf` was rebuilt as a 16-page print-and-play PDF.

Magic Item Deck card art must be local. Finished in-deck cards use frontmatter `image: ../images/<slug>.png` and a matching PNG under `items/magic-items/images/`. Remote Azure blob URLs are not reliable deck art sources: the tested existing blob URLs returned 404, and remote or missing art falls back to the vector seal instead of rendering finished card art. For this batch, Senshi generated local OpenAI `gpt-image-1` art for all eight slugs and saved it under `items/magic-items/images/`.

#### Vos'sykriss serpentfolk replacement supersedes Sysuul Spawn - 2026-09-27 (via Chilchuck and Falin, logged by Cleric)
`monsters/vos-sykriss.md` supersedes the former `monsters/sysuul-spawn.md` Medusa Room mini-boss file. Sysuul Spawn is replaced by Vos'sykriss, the Serpentfolk. This preserves Ben's hand-authored encounter numbers as the explicit exception to Chilchuck's official-stat policy: AC 15, HP 85 (10d8+40), CR 5 (1,800 XP), PB +3, ability scores, saving throws, skills, senses, languages, speed, resistances, immunities, action math, and Petrifying Gaze remain intact. Petrifying Gaze keeps DC 14 Constitution, Restrained on the first failed save, Petrified on the second failed save, avert-eyes counterplay, and no Medusa fail-by-5 clause.

Trait reflavor map: `Three Heads` is now `Coiled Vigilance`, and `Watchful Heads` is now `Weaving Coils`, with mechanics unchanged. `Serpentine Awareness` remains.

Vos'sykriss is accompanied by two identical serpentfolk duplicates using the official Invisible condition. The duplicates share the stat block and are Invisible until they attack or are revealed by See Invisibility or a similar area reveal. The duplicates cannot use Petrifying Gaze; only the true Vos'sykriss can petrify. A destroyed duplicate does not end or reveal the other duplicate. Identifying the real Vos'sykriss is the encounter puzzle.

The Magenta / Pink Crystal row in `crystals.md` now names Vos'sykriss as the creature past which the chest is found, and the key is worn around Vos'sykriss's neck. Enchantment, `Compel`, one-of-eight exit Shard status, and chest-past-creature location logic remain unchanged.

#### Vos'sykriss Petrifying Gaze range fidelity - 2026-09-27 (via Chilchuck)
Vos'sykriss's Petrifying Gaze range is canonically "within 30 feet" as Ben's hand-authored range, not 15 feet. The 2026-09-27 fix to monsters/vos-sykriss.md was a fidelity correction only; DC 14, Restrained-then-Petrified progression, and avert-eyes counterplay remain unchanged.
### Content

#### Grovlikk's Last Laugh plaque clue and handout - 2026-09-27 (via Marcille and Senshi)
Artificer's Lair Room 2 "Grovlikk's Last Laugh" now has a DC 13 Investigation clue on the brass plaque attached to Grovlikk's pedestal. The canonical plaque text, authored by Marcille, is: "THE GREAT GROVLIKK'S FINAL SET. A crowd may groan, cheer, or spit, so long as it answers. No show is over until the performer gets his due."

Senshi created the canonical player handout image at `images/rooms/GrovliksLastLaugh-handout.png` and the companion handout page at `handouts/grovlikks-last-laugh-plaque.md`. Hand out the image when the party succeeds on the DC 13 Investigation check to read the plaque. Trap mechanics are unchanged.

### Content

#### Grovlikk's Last Laugh replacement verse and recomposed handout - 2026-09-27 (via Marcille and Senshi)
Artificer's Lair Room 2 "Grovlikk's Last Laugh" now supersedes the previous final-set plaque text with this canonical four-line inscription, preserving line breaks:

> Some earn roses. Some earn scorn.
> Both may take their bow.
> But he who earns only silence
> Must never leave the stage.

Design intent: any audience reaction can end the performance, including scorn, a groan, or a bad review. The party does not need to specifically laugh or applaud. The clue remains gated behind a DC 13 Investigation check on the brass plaque attached to Grovlikk's pedestal, and trap mechanics are unchanged.

The room page and handout page now match: `rooms/ArtificersLair.md`, `handouts/grovlikks-last-laugh-plaque.md`, and `images/rooms/GrovliksLastLaugh-handout.png`. Senshi reused the existing handout drawing because no raw pre-text layer was saved. Future text-only edits require recropping the upper illustration from the final composite and rebuilding the plaque band.

### Content

#### Gear 2 Treasure Goblin prices and full-page gear decks - 2026-09-27 (via Falin and Senshi)
Falin set the Treasure Goblin prices for two full-page gear deck items, anchored to the existing equipment economy.

| Item | Uses | Final price | Anchor |
| --- | ---: | ---: | --- |
| Artificer's Toolkit | 10 uses | 25 GP | Matches the existing 25 GP utility gear band: `items/treasure/climber-s-kit.md`, `items/treasure/acid-vial.md`, `items/treasure/holy-water-flask.md`, and `items/treasure/component-pouch.md`. It sits below standard Tinker's Tools at 50 GP, above ammo at 1 to 3 GP, and fits as a consumable advantage toolkit. |
| Smithing Tools | 1 use | 2 GP | Matches existing low-end gear at 2 GP: `items/treasure/crowbar.md`, `items/treasure/shovel.md`, `items/treasure/pick-miner-s.md`, and `items/treasure/grappling-hook.md`. It also tracks as one-tenth of standard Smith's Tools at 20 GP. |

Senshi created the source cards, art, wrappers, and full-page 9-up duplex sheets for both items:

- `items/treasure/artificers-toolkit.md`
- `items/treasure/smithing-tools.md`
- `items/treasure/images/artificers-toolkit.png`
- `items/treasure/images/smithing-tools.png`
- `items/decks/artificers-toolkit/sheet-01.pdf`
- `items/decks/smithing-tools/sheet-01.pdf`

The new shared renderer at `items/gear-deck/tools/gear-render.mjs` is the pattern for future single-item full-page gear decks. Thin wrappers live under each item deck folder and call the shared renderer without duplicating dependencies.

Uses indicators are now a durable gear-deck convention: multi-use cards show `N USES` plus N boxes, while single-use cards show `SINGLE USE` and `1 USE`.

### Content

#### Treasure Goblin Door handout and canonical rune glyphs - 2026-09-27 (via Senshi)
Senshi built the C3-D Treasure Goblin Door player handout and source assets. The canonical final handout is `images/rooms/TreasureGoblinDoor-handout.png`, with companion page `handouts/treasure-goblin-door.md` and a reference from `rooms/The Caverns.md` under C3-D.

The reusable raw door art without runes lives at `images/rooms/TreasureGoblinDoor-art.png`. Use it for future edits instead of repainting from the final handout.

The three canonical Treasure Goblin door rune glyphs live at:

- `images/rooms/runes/treasure-goblin-rune-1-red.png`, deep red angular chevron with a horizontal base, traced from MarkerStone01.
- `images/rooms/runes/treasure-goblin-rune-2-copper.png`, copper dagger cross with an upper crossbar and raised right tick, traced from MarkerStone02.
- `images/rooms/runes/treasure-goblin-rune-3-black.png`, black angular branch arrow with a tail, traced from MarkerStone03.

Reuse these glyph files going forward. Rune meanings are intentionally not shown on the handout or player page because players decode them at the table.

#### C3 pit handout replacement supersedes Treasure Goblin Door handout - 2026-09-27 (via Senshi)
SUPERSEDED: The earlier Treasure Goblin Door handout entry above was the wrong C3 art. Do not use `images/rooms/TreasureGoblinDoor-handout.png`, `images/rooms/TreasureGoblinDoor-art.png`, `handouts/treasure-goblin-door.md`, or the `images/rooms/runes/treasure-goblin-rune-{1-red,2-copper,3-black}.png` glyph files for C3. Those live files have been removed.

The canonical C3 handout is now `images/rooms/C3-handout.png`. The raw user-supplied art copy is `images/rooms/C3-pit-art.png`, and the companion handout page is `handouts/c3-pit.md`. Senshi built this from Ben's supplied top-down C3 pit artwork as-is, with no art regeneration. `rooms/The Caverns.md` now points C3 to `images/rooms/C3-handout.png`. The handout keeps the three floor runes and barred hatch visible and does not print rune meanings.

### Content

#### Accessory magic-item cards and 88-card Magic Item Deck - 2026-09-27 (via Falin, Chilchuck, Senshi, logged by Cleric)
Falin's Phase 1 accessory proposal, Falin's Phase 2 price sheet, Chilchuck's Phase 1 balance vetting, Chilchuck's Phase 2 rules text, and Senshi's Phase 2 deck build are merged and the inbox files are retired. The curated Magic Item Deck now includes 24 new accessory cards, the 21 approved Phase 1 accessories plus 3 new defensive HP, saves, and AC items. The active deck expanded from 64 to 88 cards, and `items/magic-items/deck/magic-item-deck-printandplay.pdf` was rebuilt as a 20-page PDF, 17,253,370 bytes, with 24 real art pieces and 0 fallback art.

Falin's final Treasure Goblin vendor prices for the 24 accessory cards are:

| Slug | Item | Source | Rarity | Price |
| --- | --- | --- | --- | ---: |
| `ring-of-jumping` | Ring of Jumping | SRD | Uncommon | 100 GP |
| `ring-of-swimming` | Ring of Swimming | SRD | Uncommon | 75 GP |
| `ring-of-feather-falling` | Ring of Feather Falling | SRD | Rare | 150 GP |
| `amulet-of-proof-against-detection-and-location` | Amulet of Proof against Detection and Location | SRD | Uncommon | 100 GP |
| `netherese-latch-charm` | Netherese Latch Charm | Homebrew | Common | 40 GP |
| `velvet-maws-patient-charm` | Velvet Maw's Patient Charm | Homebrew | Uncommon | 75 GP |
| `cloak-of-elvenkind` | Cloak of Elvenkind | SRD | Uncommon | 150 GP |
| `cloak-of-the-manta-ray` | Cloak of the Manta Ray | SRD | Uncommon | 100 GP |
| `shroud-of-the-failed-apprentice` | Shroud of the Failed Apprentice | Homebrew | Common | 35 GP |
| `hat-of-disguise` | Hat of Disguise | SRD | Uncommon | 125 GP |
| `eyes-of-minute-seeing` | Eyes of Minute Seeing | SRD | Uncommon | 100 GP |
| `circlet-of-blasting` | Circlet of Blasting | SRD | Uncommon | 100 GP |
| `boots-of-striding-and-springing` | Boots of Striding and Springing | SRD | Uncommon | 125 GP |
| `boots-of-the-winterlands` | Boots of the Winterlands | SRD | Uncommon | 100 GP |
| `grave-dust-softsteps` | Grave-Dust Softsteps | Homebrew | Common | 50 GP |
| `gloves-of-missile-snaring` | Gloves of Missile Snaring | SRD | Uncommon | 125 GP |
| `grave-tender-gloves` | Grave-Tender Gloves | Homebrew | Common | 50 GP |
| `xhaltheris-white-handling-gloves` | Xhal'theris's White Handling Gloves | Homebrew | Common | 60 GP |
| `bracers-of-measured-draw` | Bracers of Measured Draw | Homebrew | Uncommon | 125 GP |
| `bracers-of-the-starving-ward` | Bracers of the Starving Ward | Homebrew | Uncommon | 90 GP |
| `bracers-of-anchor-grip` | Bracers of Anchor Grip | Homebrew | Common | 50 GP |
| `bracers-of-deflection` | Bracers of Deflection | Homebrew | Uncommon | 225 GP |
| `ring-of-the-steadfast` | Ring of the Steadfast | Homebrew | Uncommon | 225 GP |
| `periapt-of-vigor` | Periapt of Vigor | Homebrew | Uncommon | 150 GP |

Chilchuck's balance bar for this accessory batch is now durable guidance: all included items stay at or below a +1 numeric ceiling and avoid recurring healing, flight, teleport, ability-score setting, hard control, save-or-die effects, broad trap bypass, crystal-location power, or premise-breaking divination. The three new defensive items are final as follows: Bracers of Deflection are Uncommon, require attunement, and grant exactly +1 AC; Ring of the Steadfast is Uncommon, requires attunement, and grants exactly +1 to all saving throws with no AC bonus; Periapt of Vigor is Uncommon, requires no attunement, and once per short rest lets the wearer use a Bonus Action to gain 1d6 + 2 temporary hit points. Periapt of Vigor must keep temporary hit point wording, not maximum-HP wording, so it respects the hard 40 HP cap.

DM awareness: Bracers of Deflection can stack with Ring of Protection and Cloak of Protection because they are separate magic items. A character wearing and attuning to all three would spend all three attunement slots and gain +3 AC from those items, plus +2 to saves from the ring and cloak. This is not a blocker because Ben requested HP, saves, and AC boosters, but DMs should know the stack exists.

Excluded and over-bar accessories remain excluded unless Ben explicitly commissions a separate exception. Already-carded duplicates are Ring of Protection, Cloak of Protection, Boots of Elvenkind, Gloves of Swimming and Climbing, Brooch of Shielding, Goggles of Night, Sending Stones, and Lantern of Revealing. Power exclusions include Bracers of Defense, Bracers of Archery, Amulet of Health, Headband of Intellect, Gloves of Thievery, Ring of Mind Shielding, Ring of Free Action, Ring of Evasion, Ring of Regeneration, Ring of Spell Storing, Ring of Spell Turning, Ring of Telekinesis, Ring of Three Wishes, Ring of the Ram, Ring of X-ray Vision, Boots of Levitation, Boots of Speed, Cloak of Arachnida, Eyes of Charming, Helm of Brilliance, Helm of Telepathy, Helm of Teleportation, Scarab of Protection, Periapt of Health, Amulet of the Devout +2 or +3, Ring of Invisibility, Amulet of the Planes, Cloak of Invisibility, Cloak of Displacement, Cloak of the Bat, Gauntlets of Ogre Power, stat-boosting Ioun Stones, and any +2 or +3 gear.

Senshi's build notes are canonical for this deck pass: the 12 SRD items keep their SRD rules text and now use Falin's costs plus local `image: ../images/<slug>.png`; the 12 homebrew items were created under `rings/` or `wondrous-items/` with source `Custom - The Vault of the Starving Mind`, Chilchuck's final rules text, and Falin's costs. All 24 were added exactly once to the Magic Item Deck manifest. The eight accessory cards from the prior 64-card deck were not duplicated. In-deck SRD art must be local because existing remote Azure blob image URLs returned 404 and cause fallback seal art; finished cards require `items/magic-items/images/<slug>.png` and frontmatter pointing to `../images/<slug>.png`.

### Content

#### Official Skeleton stat block canon - 2026-09-27 (via Chilchuck)
`monsters/skeleton.md` is the canonical official CR 1/4 Skeleton trash mob, 50 XP, in 2024 Monster Manual format. Use it for Artificer's Lair Room 5 and the skeleton-guarded stash in `rooms/Dungeon-Left.md`. It intentionally has no Traits section and no DM Notes.

### Content

#### HP 3201dw deck duplex variants - 2026-09-27 (via Senshi)
HP 3201dw print-production variants of every deck PDF live under `items/decks/3201dw/`. These files are copies with only the back pages rotated 180 degrees for that printer's duplex behavior. Originals under `items/decks/` and `items/magic-items/deck/` remain the unchanged HP 3301dw versions.

The reusable generator is `items/decks/tools/rotate-backs-3201dw.mjs`. Regenerate with `node items\decks\tools\rotate-backs-3201dw.mjs`. The script finds every `*.pdf` under `items/decks/` except the `items/decks/3201dw/` output tree, plus `items/magic-items/deck/magic-item-deck-printandplay.pdf`. It writes mirrored relative paths under `items/decks/3201dw/`, including `items/decks/3201dw/all-decks-printandplay.pdf` for the combined deck and `items/decks/3201dw/magic-item-deck-printandplay.pdf` for the magic-item master deck.

Deck PDFs alternate front page, back page. Back pages are the 0-based odd page indices, 1, 3, 5, and so on. The 3201dw copy applies additive rotation only to those back pages: `(existingRotation + 180) % 360`. Front pages are unchanged. Verification for this batch found 34 outputs for 34 sources, matching page counts, 59 rotated back pages, no original-source hash mismatches, and clean rotation spot checks.

### Content

#### A5 new-player character sheet prototype and no-rest doubling rule - 2026-09-27 (via Chilchuck and Senshi, logged by Cleric)
The Phase 1 simplified A5 new-player character sheet prototype covers only Eldric Vaelthorn and Varka Stonefist. The coordinator visually reviewed all six preview pages and verified both prototype PDFs on disk. This prototype is approved-pending for Phase 2. Do not render the other 22 sheets until the coordinator or user approves the Phase 2 run.

Chilchuck's no-rest doubling rule is canon for these sheets. Because this one-shot has no rest, double every per-rest, per-day, and spell-slot resource printed on these character sheets. Do not double at-will, passive, per-turn, or uncapped reaction rules. Spell slots use boxes. Limited-use resources use circles. For Eldric, the doubled counts are Level 1 slots 8, Level 2 slots 4, Sorcery Points 6, Innate Sorcery 4, Tides of Chaos 2, Detect Magic free casts 2, and Guiding Bolt free casts 2. Resourceful is passive and has no use pool. For Varka, the doubled counts are Rage 6, Adrenaline Rush 4, and Relentless Endurance 2. Varka has no spell slots.

The reusable new-player explainer snippets are durable sheet content: ability modifier, saving throw, skill check, action economy, spell slots, and death saves. Keep the language plain and table-facing so a new player can use the sheet without the full D&D Beyond sheet open. Chilchuck's condensed feature and feat summaries for Eldric and Varka are the Phase 1 source for action, bonus action, reaction, special, and passive text.

Senshi's renderer lives at `player_characters/tools/render-sheets.mjs`, with usage notes at `player_characters/tools/README.md`. It parses `player_characters/markdown/*.md`, applies the doubled resource counts, composes three A5 portrait SVG pages, rasterizes preview PNGs at 1748 by 2480 px through the shared `sharp` install, and assembles A5 PDFs at 420 by 595 pt through the shared `pdf-lib` install using `createRequire` from `items/magic-items/deck/tools`. No new package install was used. The `ONLY=` filter renders a subset for review. Output PDFs use `player_characters/sheets/<Name>_<DnDBeyondNumber>.pdf`.

Phase 1 outputs are `player_characters/sheets/Eldric_Vaelthorn_154714847.pdf` and `player_characters/sheets/Varka_Stonefist_154966602.pdf`. Each PDF has exactly three A5 pages. Preview PNGs live under `player_characters/tools/_preview/`. Eldric shows the doubled spell slots, Sorcery Points, Innate Sorcery, Tides of Chaos, and free-cast trackers. Varka shows Rage, Adrenaline Rush, and Relentless Endurance trackers, with the caster area repurposed for notes and tracking. Tracking marks stay empty for dry-erase sleeve use.

### Content

#### A5 new-player character sheets Phase 2 complete - 2026-09-27 (via Chilchuck and Senshi, logged by Cleric)
Phase 2 is complete for the simplified A5 new-player character sheets. All 24 roster characters have generated PDFs at `player_characters/sheets/<Name>_<DnDBeyondNumber>.pdf`, with three A5 pages per character. The combined booklet is `player_characters/sheets/all-characters-a5.pdf` and has 72 pages in roster order.

Chilchuck's Phase 2 content handoff extends the no-rest doubling map and condensed feature summaries to the remaining 22 characters, keyed by character name. The doubling house rule remains canon for these sheets: double per-rest, per-day, and spell-slot resources printed on the sheet. Leave passive, at-will, per-turn, refresh-by-action, and uncapped reaction rules without a doubled tracker.

Per-class Phase 2 handling is canon for these sheets. Warlock Pact Magic slots double, including short-rest Pact slots, and Magical Cunning doubles to 2 uses; Kaelen Duskreign's Hexblade's Curse doubles to 2. Paladin level 1 slots double from 3 to 6, Channel Divinity doubles to 4, Lay On Hands prints as 30 HP plus a dry-erase remaining box, and Divine Smite free casts double to 2; Drakor also has Breath Weapon 4 and Draconic Flight 2. Monk Focus Points double to 6 and Uncanny Metabolism doubles to 2. Tobrin Gearwhistle's Artificer level 1 slots double to 6, Tinker's Magic doubles to 6, and Eldritch Cannon free use doubles to 2. Cleric, Druid, Bard, Fighter, Ranger, Sorcerer, and Wizard rest resources and spell slots use the same doubling rule. Rogues with no rest-resource pool use the freed page-3 space for notes or tracking.

Senshi kept the approved Phase 1 three-page A5 layout and rendered the full batch through `player_characters/tools/render-sheets.mjs`. Large resource pools over the practical circle limit, including Lay On Hands and Arcane Recovery, render as the printed doubled number plus a small dry-erase remaining box. Spell-heavy characters use a compact two-column quick-list to fit the A5 page without clipping. Five page-3 spot-check previews live under `player_characters/tools/_preview/`: Alderachk, Drakor, Bishop, Tobrin Gearwhistle, and Halvar Kolsrud.

Regenerate the full set with `node player_characters/tools/render-sheets.mjs`. Use the renderer's `ONLY=` filter for subset renders. The renderer README at `player_characters/tools/README.md` documents the doubling rule, subset filter, combined booklet output, and regeneration command.

### Content

#### Five Seals player handout from user art - 2026-09-27 (via Senshi, logged by Cleric)
The canonical Five Seals player handout is `images/rooms/FiveSeals-handout.png`. It was built from Ben's supplied wall art at `rooms/image/gauntlet/1789603585630.png`, with a clean raw copy kept at `images/rooms/FiveSeals-wall.png`. The companion handout page is `handouts/five-seals.md`, and the reusable build script is `images/rooms/tools/fiveseals-handout.mjs`.

This handout follows the Grovlikk and C3 pattern: preserve the user's own art, frame it on parchment, and do not use AI regeneration or redraw. The player-facing image shows the six-line riddle only, with no deity names and no answer order. The older `images/rooms/FiveSeals.png` is a superseded AI-generated image kept in the repo, but it is not used for this handout.

### Content

#### Five Seals print-brightness pipeline - 2026-09-27 (via Senshi)
The Five Seals player handout art is brightened in the build pipeline for print legibility. images/rooms/tools/fiveseals-handout.mjs leaves images/rooms/FiveSeals-wall.png raw and untouched, writes a tone-mapped intermediate images/rooms/FiveSeals-wall-print.png, then composites that intermediate into images/rooms/FiveSeals-handout.png.

Tone map: brightness 1.85, saturation 1.14, gamma 2.2, linear contrast 1.2, shadow lift 38. This lifted the wall art's mean luminance from about 19.5 to about 57.6 while preserving the raw source image. Future dark AI or stone handout art should be tone-mapped before framing rather than brightened after compositing.

Coordinator verification for this batch: images/rooms/FiveSeals-handout.png was rebuilt at 2550x3300 with the same parchment frame, title band, riddle-only inscription band, deity-symbol order, five levers, lightning, and rune band. The far-right tragedy mask remains the dimmest seal, but it is discernible at print brightness; a later targeted lift is optional if Ben wants it brighter.

#### Five Seals tragedy-mask local brighten - 2026-09-27 (via Senshi)
The Five Seals handout pipeline applies the global print tone-map plus a feathered local brighten on the far-right tragedy mask symbol region so all five deity signs read on paper. The tragedy mask should read about as clearly as the sword-and-scales and seven-star symbols while still looking like carved dark stone in shadow. Global brightness was not pushed further, so the sun, levers, lightning, rune band, and other four symbols stay visually unchanged.

The raw source art at images/rooms/FiveSeals-wall.png stays untouched. The touch-up is handled entirely in images/rooms/tools/fiveseals-handout.mjs, composited into the print-brightened wall with a soft-edged alpha before the final images/rooms/FiveSeals-handout.png is built. Final verified handout: 2550 by 3300 px, 5,169,251 bytes, same parchment frame, THE FIVE SEALS title band, riddle-only inscription, and no text changes.

### Content

#### Eldric Vaelthorn isolated redesign data specification - 2026-10-02 (via Chilchuck)
`player_characters/markdown/Eldric_Vaelthorn.md` is the source for Eldric Vaelthorn, Human Wild Magic Sorcerer 3, and Chilchuck's complete rules/data specification governed the isolated redesign proof. The source spell extraction is garbled, so the corrected play list preserves every listed spell while grouping them by actual level. `Moment to Think` remains unresolved because the source supplies only Bonus Action, Self, Instantaneous, and V; no mechanical effect may be invented.

Eldric's verified core numbers are AC 12, Initiative +2, Speed 30 ft., PB +2, Max HP 17, Hit Dice 3d6, passive Perception/Investigation/Insight 11, Spell Save DC 13, and Spell Attack +5. Under the no-rest doubling rule, his canonical trackers are Level 1 slots 8, Level 2 slots 4, Sorcery Points 6, Innate Sorcery 4, Tides of Chaos 2, Detect Magic free casts 2, and Guiding Bolt free casts 2. HP, attack bonuses, damage dice, save DCs, proficiency bonus, passives, at-will cantrips, per-turn rules, and passive features are not doubled. Campaign start gear remains separate from source-sheet data; the source lists 28 GP and 0 lb. carried, while campaign canon starts characters without useful gear or coin.

#### Eldric Vaelthorn isolated A5 design proof - 2026-10-02 (via Senshi)
The isolated Eldric design proof lives under `player_characters/design-proof/eldric/`. The renderer is `render-eldric.mjs`; the A5 PDF is `Eldric_Vaelthorn_154714847.pdf`; previews are `preview/page-1.png` through `page-10.png`; the contact sheet is `preview/contact-sheet.png`; the portrait is `art/eldric-portrait.png`; and `README.md` records the source and build notes. The proof uses native `pdf-lib` vector text and shapes for gameplay content and text-free `gpt-image-1` portrait art.

The proof is 10 A5 pages and was validated on-screen against Chilchuck's specification, including all core numbers, attacks, skills, doubled resources, and the single canonical resource-tracker page. It has not been printer-tested in an A5 sleeve. `Moment to Think` remains visibly flagged because its full source effect is missing.

#### Comprehensive monster-source audit and production handoff - 2026-10-02 (via Chilchuck)
`monsters/AUDIT.md` is the authoritative audit and Senshi production handoff for all 31 current monster sources. `monsters/goblins.md` is a link-only roster index; individual goblin files remain authoritative. Monster sheets contain stat-block rules only. Room placement, tactics, treasure, Crystal Shard triggers, and other campaign context belong in room files.

Ashari Fire Elemental and Magma Elemental are separate names for the same official Fire Elemental chassis and must not be presented as mechanically distinct. Production output must show every weapon form and equipment distinction listed in the audit, including one-handed, two-handed, ranged, ammunition, focus, and item-count differences.

Three matters remain open for Ben: Hob Gob's retained custom header conflicts with the exact Green Slaad chassis direction; Berhan Voss uses 76 HP from 9d8 + 36 until a licensed exact source notation or fixed-HP approval is supplied; and Goblin Warrior mixed loadouts need a canonical variant list before extra armor or weapon forms are rendered.

### Content

#### Monster sheet production pipeline and rendered outputs - 2026-10-02 (via Senshi)
Monster sheet production now has its own self-contained tool area at `monsters\tools\sheet\`. Source files remain the authoritative monster rules text in `monsters\*.md`; `monsters\AUDIT.md` is consumed as the production handoff for one-page sheet sections and visible weapon or action options. `monsters\goblins.md` and `monsters\AUDIT.md` are excluded from rendering.

Outputs live at `monsters\sheets\<slug>\<Name>.pdf`, with original generated art at `monsters\art\<slug>.png`. The completed batch has 31 one-page A5 monster PDFs and 31 original monster art PNGs. Verification found every PDF exactly one page, with 0 overflow and 0 failures. The renderer copies the player Character Sheet typography and framing style into `monsters\tools\sheet\`, and reuses the existing Playwright Chromium install from `player_characters\tools\sheet\node_modules`. The art pipeline uses `gpt-image-1`, writes one original 1024 by 1024 PNG per monster, and skips existing art unless `FORCE` is set.

Full rebuild from repo root:

```powershell
$env:OPENAI_API_KEY = [Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User'); npm --prefix .\monsters\tools\sheet run build
```

Known audit blockers for Hob Gob, Berhan Voss, and Goblin Warrior variants remain open and are rendered from the current canonical monster source files until Ben resolves them.

### Content

#### Master GM Guide build + open readiness blockers - 2026-10-02 (via Cleric, from coordinator batch)
A printable Master GM Guide for "The Vault of the Starving Mind" was assembled. Source sections live in `gm-guide/` (Laios: structure-and-runofshow.md; Chilchuck: appendix-bestiary.md; Marcille: xhaltheris-and-puzzles.md; Senshi: maps-props-print.md; Falin: logistics-and-crystals.md; coordinator: 00-front-matter.md, 99-readiness.md). The Markdown-to-PDF pipeline lives in `gm-guide/tools/` (assemble.mjs concatenates sections + 6 room files with image-path fixes into GM-Guide.md; build-pdf.mjs + print.css render via markdown-it and headless Edge print-to-pdf). Final deliverables at repo root: `GM-Guide.md` and `GM-Guide.pdf` (81 pages, Letter portrait, print-ready).

Open readiness blockers (consolidated in `gm-guide/99-readiness.md`, Part 7) needing Ben's rulings:
- Crystal count mismatch: README says 8 Crystal Shards; room files name 10+. Needs a single canonical count.
- Star-lock escape order is not recorded anywhere; needs a sealed answer key.
- `prizes.md` does not exist; prize data was reconstructed from `items/` tokens and logs. Needs an authoritative prize source.
- Grand-prize gp conflict: 150000 vs 15500. Decision: use 15500 (pending Ben confirmation).
- Crypts "cryptex lament" text is still a placeholder.
- Broken crypts image embed in source needs fixing.
- Several built monsters are unplaced in rooms.
- Netheril/Scrying Stone prop is unfinished.

### Content

#### Scrying Stone source map and protected boundaries - 2026-10-02 (via Falin, Senshi, and Laios)
The Scrying Stone player interface has 32 live Markdown surfaces, four directions for each of eight schools. Those pages currently contain generic school lore and remain unchanged. Final clue prose and page assignments are blocked pending the open questions below.

Safe source payloads have been mapped for all eight Key Crystal routes: White in C7 Slime Time; Green in D7 Alchemist Workshop; Yellow in Goblin Camp Area 7; Blue in C5/C6 Dwarven Forge and Brackish Waters; Purple in R5 Ruins; Red in R8 Lava Temple; Black in the five-ring Cryptex near the Ruins; and Magenta or Pink in D9 Serpents Lair beyond Vos'sykriss. Source-supported encounter counters may be used, but no new vulnerabilities or guardian requirements may be invented.

Door H links C8 Cross Roads to C12. Its heavy cage can only be opened by the rune-matched key on the dead guard's large key chain in D10 Old Cells. The door cannot be picked or breached. The exact key, rune, and reward form remain undefined.

The active no-order exit decision controls: all eight Key Crystals open the portal in any order. No Scrying Stone clue may teach an exit order. `README.md` and older prop wording that still describe a correct order are stale and require owner correction.

Key Crystals and lesser boon crystals do not award real-world prizes. Prize Item Cards remain separate. `prizes.md` appears absent from this checkout, so no prize contents were inferred.

### Open Questions

#### Scrying Stone clue mapping blockers - 2026-10-02 (via Falin, Senshi, and Laios)
- Falin's proposed stable mapping is top for Key Crystal routes or guardian counters, right for ingredients, bottom for C12, and left for the Area 5 tree cache. Senshi's physical configuration note in `props/scryingstone.md` records top for the tree cache, left for ingredients, right for crystal and boss leads, and bottom for C12. This conflict must be resolved before any of the 32 clue pages change.
- Active canon says the Scrying Stone does not reveal treasure locations. Ben must approve or reject a narrow exception for the Goblin Tunnels Area 5 tree cache and C12 cage before those clue categories are published.
- The Area 5 tree cache is source-grounded, but its origin is not. Ben must decide whether a long-forgotten adventurer hid it and whether its physical container is the room file's pouch or `crystals.md`'s small chest.
- Named Caverns ingredient placements are not canon. C5, C6, C7, and C11 are survey nodes only until Ben and Laios assign exact ingredients and the related ingredient and Berhan sources are updated.
- Lesser-crystal locations conflict between `crystals.md` and `config/config.yaml` for Necrotic, Wrought Iron, and Copper. Do not publish those locations until Ben resolves the source conflict.
- Divination is Purple and Illusion is Yellow. Stale prop pages or documentation that assign Divination to Yellow or Illusion to Orange require correction before implementation.
- The exact Door H key shape, material, rune, and C12 caged reward are not defined. Do not invent them or name a real-world prize.

## Active Decisions

### Content

#### Scrying crystal breakdown reference - 2026-10-02 (via Senshi)
`props/scrying-crystal-breakdown.md` now exists as the team reference for what the current Scrying Stone prop app shows per configured crystal. It catalogs all 13 crystals from `props/knoxrpg-netheril-prop/apps/dungeon-runner/config/config.yaml`, including the 8 exit Key Crystals and 5 lesser crystals, and records that the prop app chooses four pages by school rather than by the individual RFID tag. The shared page directions are Top = Origins, Bottom = Foundations, Left = Practices, and Right = Risks. The file reproduces the 8 school page sets faithfully from the 32 live Markdown page files, then gives per-crystal records for name, label and color, school, type, location from config, boon, opposing and adjoining schools, and which four pages appear.

This reference records current-source evidence only and does not resolve conflicts. It flags the prop README and live page color labels as stale where they contradict current canon, follows the no-order exit ruling, quotes config locations rather than inventing corroboration, and notes that three lesser crystals use LED color fields that do not match their school's canonical exit color.

#### Scrying crystal config canon audit - 2026-10-02 (via Falin)
Falin audited the active config and confirmed `config.yaml` defines 13 crystals total: 8 exit crystals and 5 lesser crystals. The 8 exit crystals cover exactly one school each and match the active color and school canon: White/Abjuration, Blue/Conjuration, Purple/Divination, Magenta or Pink/Enchantment, Red/Evocation, Yellow/Illusion, Black/Necromancy, and Green/Transmutation. The config contains no crystal-to-prize mapping. The lesser stones are not exit keys and do not award prizes; their `boon` fields are in-game powers, not real-world prize gates.

The prop app README table is subordinate and stale where it lists Yellow as Divination and Orange as Illusion. Canon and config win: Purple is Divination and Yellow is Illusion. The root `prizes.md` file is absent from this checkout even though squad instructions treat it as canon, so it could not corroborate crystal or prize facts in this audit. `README.md` still implies a required final crystal order, but active canon and `crystals.md` supersede that with the no-order exit rule.

## Open Questions

#### Scrying crystal cleanup flags - 2026-10-02 (via Senshi and Falin)
- The live Illusion pages still say orange alignment, and the live Divination pages still say yellow alignment. These conflict with current canon and config.
- The live Evocation pages include apparent draft markers: `BLAH` in `evocation_top.md` and `TEST` in `evocation_bottom.md`.
- Lesser-crystal LED colors can mislead a GM if read as school canon: Silver Stone is `white` with Conjuration, Wrought Iron Stone is `blue` with Transmutation, and Copper Stone is `yellow` with Divination.
- Lesser-crystal locations conflict for Necrotic Stone, Wrought Iron Stone, and Copper Stone between `config.yaml`, `crystals.md`, and relevant room files. Do not publish those locations until Ben resolves the source conflict.
- The Magenta or Pink crystal config still says Medusa Room and three-headed Medusa creature. Current canon uses Vos'sykriss, with the chest key worn around Vos'sykriss's neck.
- `config.yaml` uses `Cryptix` for the Black Crystal location. `crystals.md` and `rooms/crypts.md` use `Cryptex`.
- `README.md` does not list individual crystal locations, so it does not corroborate config locations. Use `crystals.md` and room files for location support until Ben supplies or restores a stronger canon source.
- The Magenta chest key is established in `crystals.md` and the decision ledger as hanging from Vos'sykriss's neck, but the D9 room text does not yet record it.
