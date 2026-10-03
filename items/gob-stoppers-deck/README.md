# Gob Stoppers Deck

This deck prints one full US Letter duplex sheet with nine identical Gob Stopper grenade cards.

## Build

From the repository root, run:

```powershell
node items\gob-stoppers-deck\tools\gob-stopper-render.mjs
```

The script reuses the existing art at `items/magic-items/images/gob-stopper.png`, writes working PNGs under `items/gob-stoppers-deck/build/`, and writes the print sheet to `items/decks/gob-stoppers/sheet-01.pdf`.

Print duplex long-edge at Actual Size or 100 percent. The backs are mirrored for the established deck sheet layout and use the same `BACK_DY_MM=-2.5` registration offset as the sibling decks.
