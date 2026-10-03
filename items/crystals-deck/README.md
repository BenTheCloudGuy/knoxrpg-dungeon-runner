# Crystal cards

This deck contains the 13 crystal source cards in `items/crystals/`, in the
same order as `crystals.md`: 8 Exit Crystal Shards followed by 5 Lesser Boon
Crystals. Card faces are 750x1050 px (2.5 x 3.5 in at 300 dpi), matching the
ingredient, equipment, and magic-item deck geometry.

## Two-sided card design

- **Front:** crystal art from `items/crystals/images/<slug>.png`, feathered into
  the parchment, plus the crystal name banner and a small "CRYSTAL" label.
- **Back:** text only. The School of magic is prominent, followed by the boon
  name and the Power text copied from `crystals.md`.

## Build steps

Run both from the repository root:

```powershell
# 1. Generate real card art with gpt-image-1 (OPENAI_API_KEY is User-scope only;
#    set it in the same invocation that launches node).
$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User")
node items/crystals-deck/tools/crystal-gen.mjs

# 2. Render fronts/backs and the print sheets.
node items/crystals-deck/tools/crystal-render.mjs
```

`crystal-gen.mjs` is idempotent: it skips any crystal that already has
`items/crystals/images/<slug>.png` unless `FORCE=1` is set. Use
`ONLY=green,white` to regenerate a subset.

`crystal-render.mjs` writes working card faces to `build/fronts/` and
`build/backs/` in this folder, a `crystal-card-order.json` pairing/order
manifest in this folder, and the final print sheets to
`items/decks/cyrstals/sheet-01.pdf` and `sheet-02.pdf`. The folder name keeps
Ben's requested spelling. Each `sheet-NN.pdf` is a 2-page US Letter PDF: page 1
is fronts, page 2 is the matching column-mirrored backs.

## Duplex / printer

Same confirmed HP 3301dw layout as the other decks: **long-edge duplex**,
column-mirrored backs, no rotation, `BACK_DY_MM=-2.5` (override with
`BACK_DX_MM` / `BACK_DY_MM` env vars in mm if printing on a different
printer). Print each `sheet-NN.pdf` duplex at **Actual Size / 100%**. Test one
sheet before printing the full run.

## Asset pipeline

Card art is generated with the OpenAI Images API (`gpt-image-1`), reusing the
ingredient deck's painterly parchment style. The key is read from
`OPENAI_API_KEY` and is never printed, written, or logged by either tool. If
the key is missing or the API call fails, `crystal-render.mjs` still builds a
complete deck; any crystal without art uses the vector-crystal fallback, and
rerunning `crystal-gen.mjs` later fills in missing art without touching files
that already exist.
