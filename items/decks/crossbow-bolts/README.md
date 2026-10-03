# Crossbow Bolts Deck

This deck prints one full US Letter duplex sheet with nine identical Crossbow bolts (20) cards.

## Build

From the repository root, run:

```powershell
node items\ammo-deck\tools\ammo-render.mjs crossbow-bolts
```

The script reuses the existing art at `items/treasure/images/crossbow-bolts-20.png`, writes working PNGs under `items/ammo-deck/build/crossbow-bolts/`, and writes the print sheet to `items/decks/crossbow-bolts/sheet-01.pdf`.

Print duplex long-edge at Actual Size or 100 percent. The backs are mirrored for the established deck sheet layout and use `BACK_DY_MM=-2.5`.
