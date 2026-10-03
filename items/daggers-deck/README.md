# Daggers Deck

This deck prints one full US Letter duplex sheet with nine identical Dagger weapon cards.

## Build

From the repository root, run:

```powershell
node items\daggers-deck\tools\dagger-render.mjs
```

The script reads `items/weapons/dagger.md`, reuses the existing art at `items/weapons/images/dagger.png`, writes working PNGs under `items/daggers-deck/build/`, and writes the print sheet to `items/decks/daggers/sheet-01.pdf`.

Print duplex long-edge at Actual Size or 100 percent. The backs are column-mirrored for the established deck sheet layout and use `BACK_DY_MM=-2.5` unless overridden by environment variables.
