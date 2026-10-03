# Laios — History

## Core Context

**Project:** knoxrpg-dungeon-runner — "The Vault of the Starving Mind"
**Owner:** Ben Mitchell (BenTheCloudGuy)
**Created:** 2026-05-30
**Stack:** Markdown only, no build pipeline
**My role:** Dungeon Architect — layout, flow, pacing, balance for the H-shaped 5'x7' Dwarven Forge dungeon

## Known constraints (canon)

- 8–12 players, all level 3, 40 HP cap
- Max 3 short rests (15 min real-time each, 1 HD per rest), no long rests
- 8 Crystal Shards required to open the exit, one per school of magic
- Black Crystal is one of the eight exit crystals and has no prize role
- H-shaped layout with lava/ruins divider between Caves and Stone Dungeon

## Learnings

### 2026-09-04 — Cross-agent: coin economy + loot placement land on you (via Cleric)

- **Coin drop LOCKED at 2,845 GP** (Falin, Ben-owned total). Homebrew coin values are canon: Copper 1, Silver 5, Gold 10, Platinum 50 GP. 525 physical coins total (295 copper, 110 silver, 100 gold, 20 platinum).
- **Placement is yours.** Falin's recommended risk-tier distribution: Copper + Silver (845 GP) on the main escape path, Gold (1,000 GP) in optional/danger rooms, Platinum (1,000 GP) only in the hardest optional rooms. Keeps the escape route lean. Ben may override with a flat spread; if he does, expect faster kit-out and a less-lean escape path. The Black Crystal is an exit crystal, not a grand-prize route.
- **Survival loot cap** (Chilchuck) governs what curated items you place: +1 gear only, single-use healing potions only, consumable scrolls only, bounded utility. Suggested placement rhythm: potions early/mid, protection scrolls before boss rooms, utility in hazard-matching rooms.
- The curated loot is now a real 46-card deck (Senshi) with `cost:` prices applied, so treasure you place can reference actual priced items.

### 2026-09-06 - Cross-agent: locked loot model affects flow (via Cleric)

- Ben locked the empty-sheet start. The Room 1 Cells supply pile in `rooms/ArtificersLair.md` is now the party's first equipment deck and must support 8-12 characters from nothing. Treat it as a required kit-out point before lethal pressure.
- Room 4 Portal Room is deliberately bare: Crystal Sphere prop plus blank seven-socket diagram only, no crystal, coin, or magic.
- Open: the 7-clue-to-treasure mapping does not exist yet, and Scrying Stone crystal ratification remains pending with Ben.

### 2026-09-06 - Cross-agent: crystals decoupled from prizes (via Cleric)

- Ben decoupled the 8 Crystal Shards from real-world prizes. Treat crystals as dungeon props for color-locked doors and the final exit-lock puzzle only.
- The Scrying Stone now reveals color-locked door clues and the correct final exit-lock order. It should not point to treasure locations, bigger Treasure Items, prize tiers, prize cards, or real-world prizes.
- Real-world prizes are separate prize Item Cards from Treasure Goblins. Audit older crystal-to-prize language before reusing it.

### 2026-09-16 — Replaced potion-puzzle revision

- Replaced the rejected potion-puzzle revision in `alchemists_workshop.md`.
- Expanded `## Ingredients` with 20 sensory-test ingredients and rewrote all 10 existing potion formulas in the requested structured form while preserving their original outcomes.
- Validation reported 6–8 distinct quantified ingredients per formula, 68 ingredient references resolving to the inventory, and descriptive brewing clues.

### 2026-09-16 — Cross-agent: Five Seals room image asset refreshed (via Cleric)

- Senshi regenerated `images/rooms/FiveSeals.png` for the Five Seals wall in `rooms/gauntlet.md` by using the approved canon image as the edit reference and restaging it as a richer medallion-wall scene.
- Preserve the room's five-seal order, the five heavy levers, and illegible inscription surfaces. No room prose or layout changed in this pass.

### 2026-09-20 - Cross-agent: Hob Gob placement pending (via Cleric)

- `monsters/hob-gob.md` now exists for Hob Gob, the Hobgoblin Goblin King, as a CR 8 boss-tier goblin encounter.
- Placement is unconfirmed. Laios owns room placement, route pressure, and whether Hob Gob belongs at the Goblin Gate or another goblin territory.
- Hob Gob currently guards no assigned Crystal Shard.

### 2026-09-27 - Cross-agent: Treasure Goblin Door handout location (via Cleric)

- Senshi built the C3-D Treasure Goblin Door handout at `images/rooms/TreasureGoblinDoor-handout.png` with companion page `handouts/treasure-goblin-door.md`.
- `rooms/The Caverns.md` now references the handout under the C3-D door. Treat this as the visual aid for that door location.
- Rune meanings are intentionally not shown on the handout or player page, so room flow should preserve player decoding at the table.

### 2026-09-27 - Cross-agent: C3 handout replacement supersedes Treasure Goblin Door art (via Cleric)

- The prior C3-D Treasure Goblin Door handout note above is superseded. Those assets were the wrong C3 art and have been removed from live files.
- Use `images/rooms/C3-handout.png` as the canonical C3 visual aid. It was built from Ben's supplied top-down pit art, preserved at `images/rooms/C3-pit-art.png`.
- `rooms/The Caverns.md` now points C3 to the corrected handout. Keep route and room references aligned to the C3 pit handout, not the old Treasure Goblin Door assets.

### 2026-10-02 - Scrying Stone clue geography audit

- The 32 live school-position pages under `props/knoxrpg-netheril-prop/apps/dungeon-runner/src/public/pages/` are generic school lore. No Laios-owned clue mapping file exists, so no Senshi surface was edited.
- The Goblin Tunnels tree cache is fixed at Area 5 above the Area 4 incline. It contains coin and the Necrotic lesser boon crystal. The long-forgotten adventurer origin and pouch-versus-chest container conflict remain unresolved.
- Caverns ingredient placement is still open canon. The only fixed ingredient location is the Alchemist Chamber. C5, C6, C7, and C11 are distinct survey nodes for a future user-approved placement pass.
- C12's cage door is Door H from C8 and opens only with the rune-matched key on the dead guard's key chain in D10 Old Cells. The key's appearance and the exact room-by-room route from Caverns to D10 are not documented.
- Exit Crystal Shard geography is recorded in `.squad/decisions/inbox/laios-scrying-geography.md`, with supported encounter counters and all conflicts flagged.
- The request for Scrying Stone treasure clues conflicts with the prior decision that the Stone does not reveal treasure locations. Falin and Senshi should not lock clue text until Ben resolves that scope exception.

### 2026-10-02 - Cross-agent Scrying Stone handoff (via Cleric)

- Falin mapped source-supported clue payloads for all eight Key Crystal routes and encounter counters while preserving the no-order exit rule.
- Senshi recorded a physical direction map in `props/scryingstone.md`, but it conflicts with Falin's proposed category directions. Keep the live pages unchanged until that mapping is resolved.
- The geography handoff remains conditional on Ben's rulings for treasure-reveal exceptions, ingredient assignments, lesser-crystal conflicts, the Door H key rune, the caged reward, and the absent `prizes.md`.

### 2026-10-02 - Cross-agent: Scrying crystal reference and location flags (via Cleric)

- Senshi created `props/scrying-crystal-breakdown.md` as the source-grounded reference for all 13 configured Scrying Stone crystals and their school page sets.
- Falin confirmed the 8 exit crystals in config match the active color and school canon and have no prize mapping.
- For layout work, keep treating `README.md` as insufficient for individual crystal locations. Use `crystals.md` and room files for corroboration, and keep Necrotic, Wrought Iron, Copper, and Magenta location wording flagged until Ben resolves the source conflicts.
