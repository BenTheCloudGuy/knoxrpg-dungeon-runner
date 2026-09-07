# Decision: Named spell scrolls replace the 4 generic deck cards — 2026-09-06 (via Falin)

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
