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

For a **short-edge** duplex flip (Ben's HP 3201dw), `assemble-deck.mjs` does two things to the back pages: it row-mirrors the positions (`(ROWS-1-r)*COLS + c`) so each back prints behind its own front, and it rotates each back 180 degrees (`sharp(...).rotate(180)`) so the back reads upright when you flip the cut card left-to-right. The back pages therefore look upside-down in the PDF on purpose.

**Print at Actual Size / 100%** (page scaling off), or the front and back will not line up.

**Back-registration offset.** Ben's HP 3201dw lays the back about 1.75 mm high, so the backs are nudged down 1.75 mm by default (`BACK_DY_MM`). To re-measure on another printer, cut a card, compare the back frame to the front frame, and set the env vars in mm: `BACK_DY_MM` (+ down), `BACK_DX_MM` (+ right). Example: `BACK_DY_MM=1.75 node assemble-deck.mjs`. Only the cards shift; the crop marks stay put so the cut lines still match the front.

For a long-edge printer instead: change the mapping to `r*COLS + (COLS-1-c)` (column mirror) and drop the `.rotate(180)` on the back buffers.

## Prices

`apply-prices.mjs` was a one-time pass that wrote the approved Treasure Goblin vendor prices into the 17 SRD loot files that had no `cost:`. It is idempotent (skips files that already have a price). Prices follow Falin's economy table plus three values approved by Ben.

## Superseded

`render-all2.mjs` (old single-sided front renderer) and `make-back.mjs` with `back.png` (old shared card back) are from the first version of the deck and are no longer used. `render-cards-v2.mjs` replaces them.
