# Item Cards

As the players find supplies, they get an item card describing each thing.

## The Magic-Item Loot Deck

A 46-card print-and-play deck covering the curated loot for the vault: the six themed spellbooks, the custom potions and grenades, the standard potions and scrolls, the wondrous items, and the +1 weapons and armor. One card per item.

Every card is two-sided:

- **Back (the show side):** the item's picture blended into the parchment, the item name, the item type in large letters (WEAPON, POTION, SCROLL, SPELLBOOK, ARMOR, WONDROUS ITEM, and so on), a one-line description, and the price in gold.
- **Front (the rules side):** the name, rarity and type, and price at the top, then the full rules text for the item. No picture, so there is room for the whole write-up.

Card size is standard poker (2.5 by 3.5 inches), so they drop into normal card sleeves.

## What it does at the table

These are the goods the Treasure Goblin vendors sell and the loot players pull off bodies and out of chests. Hand a player the card when they buy or find the item. The back tells them at a glance what it is and what it costs; the front has the rules when they use it. Prices are the deflated Treasure Goblin scale, not book price.

## How the DM uses it

- Sort the deck by type or keep it as a vendor stack. Deal cards as players spend gold or loot rooms.
- When a player dies, their item cards go back in the pile or to whoever loots the body. Gear stays on the body.
- Sleeve the cards if they will get handled all night. A dry-erase note can ride in the sleeve for charges or spent scroll pages.

## How to print it

The print sheets for all three decks live together under `items/decks/`: `items/decks/magic-items/` (6 sheets), `items/decks/prizes/` (2 sheets), and `items/decks/equipment/` (23 sheets). Each `sheet-NN.pdf` is a 2-page PDF: page 1 is 9 fronts (3x3), page 2 is the 9 matching backs.

To print the player-facing gear at once, use the single combined file at `items/decks/all-decks-printandplay.pdf`. It holds the equipment and magic-items decks only, not the prizes. It is 58 pages: 29 sheets in order (equipment sheets 1 to 23, then magic-items sheets 1 to 6), with each back interleaved directly behind its own front. Print it with the same settings as a single sheet: long-edge duplex, Actual Size / 100% (or Fit / 96% if your driver forces scaling). The prizes deck prints separately from its per-sheet PDFs in `items/decks/prizes/`, or from the legacy combined prize PDF at `items/tokens/deck/prize-deck-printandplay.pdf`. Keep the per-deck folders for printing one deck by itself. Rebuild the combined file anytime with `items/magic-items/deck/tools/merge-decks.mjs`.

1. Print duplex on cardstock (110 lb cover or similar). White or cream stock; the card art already carries the parchment look.
2. **Duplex setting: flip on the LONG edge.** The PDF is built for the HP 3301dw long-edge flip. Each back is column-mirrored but not rotated, so both PDF pages read upright on screen. The printer flips the back left-to-right while keeping the content upright, so the long-edge flip lands each back behind its own front, right-side up.
3. **Print at Actual Size / 100% (page scaling OFF).** If the printer scales the page to fit, the crop marks drift toward the corners and the front and back stop lining up. Actual Size keeps the cut marks on the card edges.
4. **Test one sheet first.** Print a single sheet PDF duplex, cut one card, and check the back is the right item and lands right-side up behind its front before running the rest. Printer drivers vary; if the back comes out wrong, say so and I will adjust.
5. Cut on the light crop marks in the page margins. Nine cards per sheet, 3 by 3.
6. Sleeve if desired. 46 cards total.

The back is nudged 2.5 mm down (`BACK_DY_MM=-2.5`) to correct the HP 3301dw front/back drift. If the back still drifts on your printer, retune the nudge; see `items/magic-items/deck/tools/README.md`.

Rebuild from source anytime: see `items/magic-items/deck/tools/README.md`.

