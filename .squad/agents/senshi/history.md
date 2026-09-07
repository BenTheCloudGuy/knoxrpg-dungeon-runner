# Senshi — History

## Core Context

**Project:** knoxrpg-dungeon-runner — "The Vault of the Starving Mind"
**Owner:** Ben Mitchell (BenTheCloudGuy)
**Created:** 2026-05-30
**My role:** Quartermaster — props, item cards, handouts as physical artifacts, Dwarven Forge terrain notes

## Known props so far

- Scrying Stone — the canonical decoder for crystal clues
- Artificer's Cube — TBD mechanic
- Health potions, item cards, rainbow room clue prop

## Direction

- User wants to move to poker chips with item pictures (see [thoughts.md](../../../thoughts.md))
- Table footprint is ~5' x 7' on Dwarven Forge terrain

## Learnings

- 2026-06-26 (cross-agent, from Cleric): Falin produced a curated magic-item loot list and Chilchuck a balance review. Rule of thumb for item cards: Common/Uncommon consumables (potions, scrolls, oils, dusts, beads) are the loot spine; Rare items only appear in the Black Crystal grand-prize area. When item cards/chips are built, draw from that curated list, not the full magic-items compendium dump. See decisions.md "Content" section.
- 2026-06-27 (cross-agent, from Cleric): Falin created prize token item files at `items/tokens/` (15 files, one per prizes.md row), in the standard item-file format. Each carries a GP cost (canon rate 1 GP = $0.10, price rounded up to the whole dollar then x10). For item-card / poker-chip builds tied to the prize table, draw from these token files rather than re-deriving prices. prizes.md remains the source of truth.
- 2026-09-03 (magic-item loot deck): Built the 46-card two-sided print-and-play deck at `items/magic-items/deck/magic-item-deck-printandplay.pdf`. Design Ben approved: FRONT is text only (name, rarity/type, price at top, then full rules); BACK is the item art feathered into the parchment plus item name, a big item-type label, a short description, and price. Card art is resized and given a radial alpha feather so it blends into the parchment with no hard rectangle (no need for new transparent art). Cards are 750x1050 px (2.5x3.5 in at 300 dpi). Deck is laid out for SHORT-edge duplex (Ben's HP 3201dw): back pages are row-mirrored AND each back is rotated 180 degrees, so each back prints behind its front and reads upright under a normal left-to-right card flip (a short-edge flip otherwise inverts the back). For a long-edge printer, column-mirror and drop the rotation. Registration (2026-09-04): the 3201dw prints the back about 1.75 mm high, so assemble-deck.mjs nudges the backs DOWN 1.75 mm by default (env BACK_DY_MM; positive = down on the print, verified on Ben's hardware; the sign is NOT inverted for this short-edge + rotated-back workflow, my first guess was backwards). Only the cards shift, not the crop marks. Print at Actual Size / 100%. Build tools and README live in `items/magic-items/deck/tools/` (render-cards-v2 then assemble-deck; apply-prices was a one-time price pass). Old render-all2.mjs, make-back.mjs, and back.png are superseded. Prop spec is in [props/itemcards.md](../../../props/itemcards.md).

- 2026-09-06 (Scrying Stone count): Canon is 7 total Crystal Shards: Green, White, Yellow, Blue, Purple, Red, and Black. README.md says the final exit puzzle requires all 7 Crystal Shards; .squad/decisions.md confirms Black counts among the seven and also serves as the grand-prize gate. Updated props/scryingstone.md from 8 colored crystals to the 7 canon colors, changing Pink to Purple and removing Orange. prizes.md currently contains the prize table but no crystal color chain, so no conflict was found there.

### 2026-09-06 - Cross-agent: locked loot model and Item Cards (via Cleric)

- Ben locked the empty-sheet model. Character sheets start empty except clothing; all weapons, armor, and gear are Item Cards found in the dungeon, starting with the Room 1 Cells supply pile in `rooms/ArtificersLair.md`. That pile should be able to arm 8-12 players from nothing.
- Room loot is consumables, mundane gear, and coin only. Permanent magic items, including +1 weapons, wondrous items, and spellbooks, come only from Treasure Goblin vendors.
- Open: Scrying Stone crystal ratification is still pending with Ben. Falin did not touch crystal or Scrying Stone files.

- 2026-09-06 (Scrying Stone prize decoupling): Ben decoupled the 7 Crystal Shards from real-world prizes. Crystals are dungeon props for color-locked doors and the final exit-lock puzzle only. The Scrying Stone now reveals crystal door clues and exit-lock order clues only, with no treasure or prize-card clues. Touched `props/scryingstone.md` and `.squad/agents/senshi/charter.md`. User preference reinforced: no em-dashes, plainspoken and direct.
