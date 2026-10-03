# Falin - History

## Core Context

**Project:** knoxrpg-dungeon-runner - "The Vault of the Starving Mind"
**Owner:** Ben Mitchell (BenTheCloudGuy)
**Created:** 2026-05-30
**My role:** Prize Steward - crystal economy, Scrying Stone clue chain, table logistics

## Canon I must protect

- 8 Crystal Shards total, one per school of magic, all required to open the exit.
- Crystal clues support color-locked doors, star-lock order, and navigation, not prizes.
- Black Crystal is one of the eight exit crystals and has no prize role.
- Crystal Shards are decoupled from real-world prizes.
- Real-world prizes are prize Item Cards found in the dungeon or bought from Treasure Goblins.
- 3 short rests max, 15 real-time minutes each, 1 HD per rest, no long rests.
- Death is final. Gear and crystals stay on the body.

## Summarized older entries through 2026-09-27

- Prize and crystal canon stays separate: crystals are dungeon progress props, while real-world prize cards come from dungeon finds or Treasure Goblin purchases.
- Curated magic-item loot remains Common or Uncommon by default, consumable-heavy, and avoids flight, teleport, major healing, HP-max boosts, hard control, save-or-die effects, and crystal-location divination.
- Treasure Goblin economy notes remain durable: prize tokens use the 1 GP = $0.10 conversion, ordinary gear has a 1 gp floor, and permanent magic items normally live in vendor stock.
- Falin verified multiple monster and crystal placements without prize conflicts: Statue and Red Crystal, Sysuul or Vos'sykriss and Magenta Crystal, Giant Slime and White Crystal, Goblin roster and Yellow Crystal, forge creatures and Blue Crystal, plus zone pressure creatures with no crystals.
- Falin priced several deck additions, including Deck 8 utility items, Gear 2 tools, and the 24-card accessory expansion.
- Kyber RFID notes remain backstage owned-toy prop work only and do not change dungeon crystal canon.

## Learnings

- 2026-10-02: Audited the Netheril prop crystal config for Senshi in `.squad/decisions/inbox/falin-scrying-canon-audit.md`. `props\knoxrpg-netheril-prop\apps\dungeon-runner\config\config.yaml` has the correct 8 exit and 5 lesser split, and the exit crystals match canon color and school pairings. Conflicts to surface as GM notes: the prop README still maps Yellow to Divination and Orange to Illusion, lesser-crystal LED colors do not always match their schools, lesser locations conflict for Necrotic, Wrought Iron, and Copper, and the Magenta location still uses older Medusa wording instead of the current Vos'sykriss key detail.
- 2026-10-02: Reviewed the Scrying Stone's 32 directional Markdown pages and mapped stable slots for four clue categories in `.squad/decisions/inbox/falin-scrying-clue-chain.md`: top for Key crystal routes or guardian counters, right for ingredients, bottom for the C-12 cage key, and left for the Goblin Tunnels tree cache. The tree clue is blocked because active canon forbids Scrying Stone treasure-location reveals and no source attributes the cache to a forgotten adventurer. Caverns ingredient clues are also blocked because current ingredient tables place nineteen ingredients only in the Alchemist Chamber and do not name Caverns locations. Prop config conflicts also need resolution: Divination pages call Purple-aligned Divination yellow, stale files still promise an exit order after Ben removed it, and three lesser-crystal locations disagree between `crystals.md` and `config/config.yaml`. No prop-owned clue page was edited.
- 2026-10-02: Senshi's monster sheets now exist as 31 original-art PNGs under `monsters\art\` and 31 one-page A5 PDFs under `monsters\sheets\`. This is print logistics and does not change crystal or prize economy.
- 2026-09-27: Accessory Magic Item Deck Phase 2 finalized 24 accessory cards and prices, expanding the Magic Item Deck to 88 cards. The expansion changes vendor stock only, not prize-card or crystal economy.
- 2026-09-27: The canonical C3 handout is `images\rooms\C3-handout.png`, with raw user art at `images\rooms\C3-pit-art.png`. This supersedes the earlier Treasure Goblin Door handout for C3 and does not change prize or crystal economy.
- 2026-09-27: Gear 2 prices were merged: Artificer's Toolkit is 25 GP and Smithing Tools are 2 GP.
- 2026-09-27: Vos'sykriss replaced Sysuul Spawn as the Magenta Crystal guard. The key remains on the creature's neck, and Enchantment, Compel, and one-of-eight exit Shard status remain unchanged.
- 2026-09-27: Lava, earth, spider, lizardfolk, forge, undead, and slime creature batches were checked as zone pressure or boss content. None created a prize-card or crystal conflict beyond the already recorded crystal placements.

### 2026-10-02 - Cross-agent Scrying Stone handoff (via Cleric)

- Laios verified the Area 5 tree cache, Caverns survey nodes C5, C6, C7, and C11, all eight Key Crystal routes, and Door H's C8/C12 link to the D10 guard key chain.
- Senshi recorded a physical direction map in `props/scryingstone.md`, but it conflicts with Falin's proposed category directions. Do not finalize sequencing until Ben or the owning agents resolve that mapping.
- All 32 live clue pages remain unchanged. Treasure-reveal exceptions, ingredient placements, lesser-crystal conflicts, key-rune details, and the absent `prizes.md` remain open.
