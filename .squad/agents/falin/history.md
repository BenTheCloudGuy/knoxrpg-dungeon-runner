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

