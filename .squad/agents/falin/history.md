# Falin — History

## Core Context

**Project:** knoxrpg-dungeon-runner — "The Vault of the Starving Mind"
**Owner:** Ben Mitchell (BenTheCloudGuy)
**Created:** 2026-05-30
**My role:** Prize Steward — crystal economy, Scrying Stone clue chain, table logistics

## Canon I must protect

- 7 crystals total, all required to open the exit
- Crystal → clue → next crystal chain (see [prizes.md](../../../prizes.md))
- Black Crystal = $150 grand prize, off the main path, high-danger area
- Green = $40 Potato Head Beholder (locked)
- White / Yellow / Blue / Purple / Red prize tiers are `$$$ ???` (open)
- 3 short rests max, 15 real-time minutes each, 1 HD per rest, no long rests
- Death is final; gear and crystals stay on the body

## Learnings

### 2026-06-26 — Magic item curation pass (items/magic-items/)

- The `items/magic-items/` folder is a full 5e compendium dump, not a hand-picked loot list. Subfolders: `armor/`, `potions/`, `rings/`, `rods/`, `scrolls/`, `staffs/`, `wands/`, `weapons/`, `wondrous-items/`, plus `images/`. Hundreds of files each in armor/weapons. Do NOT treat the folder as "the loot table" — it is a catalog to curate FROM.
- File format: YAML frontmatter with `title`, `category`, `rarity` (Common / Uncommon / Rare / Very Rare / Legendary), `type`, `requires_attunement`, `source`, optional `image`. The `rarity` field is the fastest fit filter.
- My curation criteria for THIS dungeon (level 3, 40 HP cap, lethal one-shot, no campaign past one night):
  1. Rarity gate: Common and Uncommon are the bread and butter. Rare is grand-prize-area / Black Crystal gating only. Very Rare+ is skip (action economy or raw numbers break a level-3 table, and there's no campaign to grow into).
  2. Consumables win. Potions, scrolls, oils, dusts, single-use beads reward greed without permanently warping a one-shot. Attunement-gated permanent items are weaker picks because attunement is a real cost in a short run and only 3 PCs can hold 3 each anyway.
  3. Theme bonus: Mind Flayer host (Xhal'theris) + Netheril vault makes psychic/mind items thematic. Confirmed in-folder: `potion-of-mind-reading` (Rare), `potion-of-psionic-fortitude` (Uncommon, anti-charm/stun — directly counters the illithid), `ring-of-mind-shielding` (Uncommon), `mindblasting-cap` (Very Rare — skip, but flavor-perfect as a corpse trophy if ever needed).
  4. Risk-vs-reward: juicier items belong behind the harder optional rooms; corridor/common loot stays low-impact.
- Flagged Rare as grand-prize-area-only (NOT general loot): `potion-of-heroism`, `potion-of-mind-reading`, `necklace-of-fireballs`. Flagged Very Rare+ as skip entirely: `mindblasting-cap`, `armor-of-invulnerability`, `vorpal-*`, `holy-avenger-*`, `staff-of-power`, `sphere-of-annihilation` (note: a Sphere of Annihilation room already exists at [rooms/sphere_anniliation.md](../../../rooms/sphere_anniliation.md) as a hazard, not loot — keep it that way).
- Did NOT edit prizes.md or any room file. This was review/recommendation only. If Ben wants any of these tied to a specific crystal or room, that triggers a real clue-chain audit and a Laios/Chilchuck coordination note.

### 2026-06-27 — Prize token files (items/tokens/)

- Built one markdown item file per prize row in [prizes.md](../../../prizes.md). 15 prizes, 15 files, all under `items/tokens/`.
- **GP conversion rate (canon for prize tokens):** 1 GP = $0.10 (a dime). Round each USD price UP to the nearest whole dollar, then multiply by 10. So $7.59 → $8 → 80 GP, $154.95 → $155 → 1550 GP.
- File format matches the existing item-file pattern (see [items/treasure/crystal.md](../../../items/treasure/crystal.md)): YAML frontmatter (`title`, `category: Token`, `type: Prize`, `cost: <N> GP`, `weight:` blank, `source: prizes.md`), then an H1, then a bullet list with **Category**, **Cost**, **Value (USD)**, **Description** (verbatim from prizes.md), **Source**.
- Filenames are lowercase, hyphen-separated, apostrophes/`&`/`+` stripped sensibly (e.g. `dnd-2024-core-rulebook-set-gm-screen.md`, `young-adventurers-collection-box-set-1.md`).
- Did NOT modify prizes.md. These token files are a derived view of the prize table for in-game item handling.

### 2026-09-04 — Dungeon coin drop LOCKED at 2,845 GP (homebrew denominations)

- Ben locked the total dungeon coin drop at **2,845 GP**, about 1,045 GP over my earlier ~1,800 GP Treasure Goblin budget. The 2,845 is canon; I reconciled the economy note to it.
- **Homebrew coin values (canon for this dungeon):** Copper 1 GP, Silver 5 GP, Gold 10 GP, Platinum 50 GP. Drop is 295 Copper (295) + 110 Silver (550) + 100 Gold (1,000) + 20 Platinum (1,000) = 2,845 GP across 525 physical coins.
- **Per-player kit-out:** pooled and split, that is ~237 GP (12 PCs) to ~355 GP (8 PCs) each. At the 108 GP catalog average that is roughly 2-3 items per player, up from the old one-item plan. A party pooling all of it could buy about 57% of the 46-card, 4,985 GP deck.
- **My recommendation (Ben owns the total):** map the denominations onto risk tiers so the escape path stays lean. Copper + Silver (845 GP) on the main path, Gold (1,000 GP) in optional danger, Platinum (1,000 GP) in the Black Crystal grand-prize area. Safe play still gets ~1 item each; diving deep earns the full 2-3. Since gear stays on the body, the richest hauls strand on corpses and feed the survivor-loot loop.
- Updated the economy note ([.squad/decisions/inbox/falin-treasure-goblin-economy.md](../../decisions/inbox/falin-treasure-goblin-economy.md)) and my repo memory canon file. Did NOT touch prizes.md; the coin drop lives in the economy note, not the crystal/prize table.


### 2026-09-06: Locked room loot and Item Card start model

- Ben locked the loot model: room loot is consumables, coin, and mundane gear only. Permanent magic items, including +1 weapons, Bag of Holding, Rope of Climbing, and permanent spellbooks, come only from Treasure Goblin vendors.
- Character sheets start empty except the clothes worn by the characters. Equipment, weapons, armor, and spellcasting tools are Item Cards found in the dungeon, starting with the supply pile in Room 1 of `rooms/ArtificersLair.md`.
- Key paths touched: `rooms/ArtificersLair.md`, `README.md`, `.squad/agents/falin/history.md`. Referenced `prizes.md` but did not edit it.

### 2026-09-06 - Cross-agent: crystals decoupled from prizes (via Cleric)

- Ben decoupled the 7 Crystal Shards from real-world prizes. Treat crystals as dungeon props for color-locked doors and the final exit-lock puzzle only.
- The Scrying Stone now reveals color-locked door clues and the correct final exit-lock order. It should not point to treasure locations, bigger Treasure Items, prize tiers, prize cards, or real-world prizes.
- Real-world prizes are separate prize Item Cards from Treasure Goblins. Audit older crystal-to-prize language before reusing it.

### 2026-09-06 - Crystal and prize economies decoupled

- Ben decoupled crystals from real-world prizes. Crystals are now pure dungeon props for escape routing: all 7 Crystal Shards go into the final star-lock in the correct order, and Crystal Shards also gate color-locked doors.
- The Black Crystal is one of the seven exit crystals. It has no prize role, no grand-prize gate role, and no rule keeping it off the main escape route.
- Real-world prizes are now represented by prize Item Cards. Players either find a prize Item Card in the dungeon or buy it from a Treasure Goblin with in-dungeon gold at the listed price in `prizes.md`.
- The 2024 Core Rulebook Set + GM Screen is the highest-value prize card. It is not a crystal grand prize.
- Key paths: `prizes.md`, `.squad/skills/crystal-economy/SKILL.md`, `.squad/agents/falin/charter.md`, `.squad/decisions/inbox/falin-crystal-prize-decoupling.md`.