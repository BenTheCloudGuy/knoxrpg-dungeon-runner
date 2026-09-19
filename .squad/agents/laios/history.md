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
- 7 crystals required to open the exit (ROYGBIV + Black grand prize)
- Black Crystal in a high-danger optional area, off the main escape route
- H-shaped layout with lava/ruins divider between Caves and Stone Dungeon

## Learnings

### 2026-09-04 — Cross-agent: coin economy + loot placement land on you (via Cleric)

- **Coin drop LOCKED at 2,845 GP** (Falin, Ben-owned total). Homebrew coin values are canon: Copper 1, Silver 5, Gold 10, Platinum 50 GP. 525 physical coins total (295 copper, 110 silver, 100 gold, 20 platinum).
- **Placement is yours.** Falin's recommended risk-tier distribution: Copper + Silver (845 GP) on the main escape path, Gold (1,000 GP) in optional/danger rooms, Platinum (1,000 GP) only in the Black Crystal area and the hardest optional rooms. Keeps the escape route lean and the Black Crystal grand prize off it. Ben may override with a flat spread; if he does, expect faster kit-out and a less-lean escape path.
- **Survival loot cap** (Chilchuck) governs what curated items you place: +1 gear only, single-use healing potions only, consumable scrolls only, bounded utility. Suggested placement rhythm: potions early/mid, protection scrolls before boss rooms, utility in hazard-matching rooms.
- The curated loot is now a real 46-card deck (Senshi) with `cost:` prices applied, so treasure you place can reference actual priced items.

### 2026-09-06 - Cross-agent: locked loot model affects flow (via Cleric)

- Ben locked the empty-sheet start. The Room 1 Cells supply pile in `rooms/ArtificersLair.md` is now the party's first equipment deck and must support 8-12 characters from nothing. Treat it as a required kit-out point before lethal pressure.
- Room 4 Portal Room is deliberately bare: Crystal Sphere prop plus blank seven-socket diagram only, no crystal, coin, or magic.
- Open: the 7-clue-to-treasure mapping does not exist yet, and Scrying Stone crystal ratification remains pending with Ben.

### 2026-09-06 - Cross-agent: crystals decoupled from prizes (via Cleric)

- Ben decoupled the 7 Crystal Shards from real-world prizes. Treat crystals as dungeon props for color-locked doors and the final exit-lock puzzle only.
- The Scrying Stone now reveals color-locked door clues and the correct final exit-lock order. It should not point to treasure locations, bigger Treasure Items, prize tiers, prize cards, or real-world prizes.
- Real-world prizes are separate prize Item Cards from Treasure Goblins. Audit older crystal-to-prize language before reusing it.

### 2026-09-16 — Replaced potion-puzzle revision

- Replaced the rejected potion-puzzle revision in `alchemists_workshop.md`.
- Expanded `## Ingredients` with 20 sensory-test ingredients and rewrote all 10 existing potion formulas in the requested structured form while preserving their original outcomes.
- Validation reported 6–8 distinct quantified ingredients per formula, 68 ingredient references resolving to the inventory, and descriptive brewing clues.

### 2026-09-16 — Cross-agent: Five Seals room image asset refreshed (via Cleric)

- Senshi regenerated `images/rooms/FiveSeals.png` for the Five Seals wall in `rooms/gauntlet.md` by using the approved canon image as the edit reference and restaging it as a richer medallion-wall scene.
- Preserve the room's five-seal order, the five heavy levers, and illegible inscription surfaces. No room prose or layout changed in this pass.
