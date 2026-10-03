# Firearm Ammunition Deck

This deck prints one full US Letter duplex sheet with nine identical Firearm Ammunition (10) cards.

## Build

From the repository root, run:

```powershell
$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User"); node items\ammo-deck\tools\firearm-gen.mjs
node items\ammo-deck\tools\ammo-render.mjs firearm-ammunition
```

The art generator writes `items/treasure/images/firearm-ammunition-10.png`. The renderer writes working PNGs under `items/ammo-deck/build/firearm-ammunition/` and writes the print sheet to `items/decks/firearm-ammunition/sheet-01.pdf`.

Print duplex long-edge at Actual Size or 100 percent. The backs are mirrored for the established deck sheet layout and use `BACK_DY_MM=-2.5`.
