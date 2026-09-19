# Alchemy ingredient cards

This deck contains the 20 distinct source cards in `items/ingredients/`, sorted
by filename. Card faces are 750x1050 px (2.5 x 3.5 in at 300 dpi), matching
the `items/equipment-deck` and `items/magic-items/deck` card geometry.

## Two-sided card design

- **Front:** text only. Name banner, category, then the identification clues
  (Appearance, Simple Test, Handling, Found) pulled from each ingredient's
  `.md` source. No recipe or effect text ever appears here; the renderer only
  matches those four fact labels, so a future recipe section added to a
  source file cannot leak onto a player-facing side.
- **Back:** the real ingredient art from `items/ingredients/images/<name>.png`
  feathered into the parchment, plus the ingredient name, the word
  "INGREDIENT," and the category line. Any ingredient still missing art falls
  back to the original vector seal so the deck always builds.

## Build steps

Run both from the repository root:

```powershell
# 1. Generate real card art with gpt-image-1 (OPENAI_API_KEY is User-scope only;
#    set it in the same invocation that launches node).
$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User")
node items/ingredients-deck/tools/ingredient-gen.mjs

# 2. Render fronts/backs and the print sheets.
node items/ingredients-deck/tools/ingredient-render.mjs
```

`ingredient-gen.mjs` is idempotent: it skips any ingredient that already has
`items/ingredients/images/<name>.png` unless `FORCE=1` is set. Use
`ONLY=kingsfoil,moonwater` to regenerate a subset.

`ingredient-render.mjs` writes working card faces to `build/fronts/` and
`build/backs/` in this folder, an `ingredient-card-order.json` pairing/order
manifest in this folder, and the final print sheets to
`items/decks/ingredients/sheet-01.pdf` through `sheet-03.pdf` (9 + 9 + 2
cards), matching the `items/decks/equipment/` and `items/decks/magic-items/`
`sheet-NN.pdf` naming convention. Each `sheet-NN.pdf` is a 2-page US Letter
PDF: page 1 is 9 fronts, page 2 is the matching 9 backs.

## Duplex / printer

Same confirmed HP 3301dw layout as the other decks: **long-edge duplex**,
column-mirrored backs, no rotation, `BACK_DY_MM=-2.5` (override with
`BACK_DX_MM` / `BACK_DY_MM` env vars in mm if printing on a different
printer). Print each `sheet-NN.pdf` duplex at **Actual Size / 100%**. Test one
sheet before printing the full run.

## Asset pipeline

Card art is generated with the OpenAI Images API (`gpt-image-1`), reusing the
`items/equipment-deck/tools/equipment-gen.mjs` STYLE prompt adapted to a raw
alchemical specimen framing instead of an item-on-a-surface framing. The key
is read from `OPENAI_API_KEY` and is never printed, written, or logged by
either tool. If the key or the API call fails, `ingredient-render.mjs` still
builds a complete deck; any ingredient without art uses the vector-seal
fallback described above, and rerunning `ingredient-gen.mjs` later fills in
the missing art without touching ingredients that already have it.

## Superseded

This replaces the prior `items/ingredients/deck/` location and its
`ingredient-deck.mjs` single-file renderer (vector-seal backs only, output
named `ingredient-cards-*.pdf`). That folder has been removed; the tooling
here is its direct successor, relocated next to `items/equipment-deck` for
consistency with the sibling `*-deck` tool folders, and split into a
generation step (`ingredient-gen.mjs`) and a render step
(`ingredient-render.mjs`) to match the equipment deck's gen/render split.