# Magic-item deck build tools

Rebuilds the 46-card magic-item print-and-play deck from repo content. Node.js only (no Python). The `node_modules/` here has `sharp` and `pdf-lib`.

## Two-sided card design

- **Front:** text only. Name, rarity/type, and price at the top; full rules text below.
- **Back:** the item image feathered into the parchment, the item name, the item type in large letters, a short description, and the price.

Cards are 750x1050 px (2.5x3.5 in at 300 dpi), poker size.

## Build steps

1. `node render-cards-v2.mjs` reads the 46 item `.md` files under `items/magic-items/`, renders `build/fronts/<name>.png` and `build/backs/<name>.png`. Card art comes from `items/magic-items/images/`.
2. `node assemble-deck.mjs` lays the fronts and backs 3x3 per US Letter page with crop marks and writes `../magic-item-deck-printandplay.pdf` (12 pages).

Preview specific cards:

- `ONLY=longsword-1,bag-of-holding node render-cards-v2.mjs`
- `ONLY=longsword-1,bag-of-holding node preview-pairs.mjs` stitches a front|back preview into `build/preview/`.

## Duplex / printer

For Ben's HP 3301dw **long-edge** duplex flip, `assemble-deck.mjs` column-mirrors the back positions (`r*COLS + (COLS-1-c)`) but does not rotate the backs, so both PDF pages read upright on screen. The printer flips the back left-to-right while keeping the content upright, so each back stays in its own row and only its column flips, which lands the correct back right-side up behind its own front.

**Print at Actual Size / 100%** (page scaling off), or the crop marks drift toward the corners and the front and back will not line up.

**Back-registration offset.** The default back nudge is `BACK_DY_MM=-2.5` (`BACK_DX_MM=0`), tuned to Ben's HP 3301dw. A negative page-space dy pushes the printed back down 2.5 mm, which cancels the printer's vertical drift so the back lands on the front. The env-var overrides are still there if another printer drifts: cut a card, compare the back frame to the front frame, and set the env vars in mm. `BACK_DY_MM` negative moves the printed back down and `BACK_DX_MM` positive moves it right. Example: `BACK_DY_MM=-3 node assemble-deck.mjs`. The crop marks shift by the same offset as the cards on each page, so the cut lines stay on the card corners on both pages.

For a short-edge printer instead: change the mapping to `(ROWS-1-r)*COLS + c` (row mirror) and leave the backs unrotated.

## Prices

`apply-prices.mjs` was a one-time pass that wrote the approved Treasure Goblin vendor prices into the 17 SRD loot files that had no `cost:`. It is idempotent (skips files that already have a price). Prices follow Falin's economy table plus three values approved by Ben.

## Superseded

`render-all2.mjs` (old single-sided front renderer) and `make-back.mjs` with `back.png` (old shared card back) are from the first version of the deck and are no longer used. `render-cards-v2.mjs` replaces them.
