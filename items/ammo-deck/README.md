# Ammunition Decks

This shared renderer builds one full US Letter duplex sheet with nine identical cards for a single ammunition item.

## Build

From the repository root, run one of these commands:

```powershell
node items\ammo-deck\tools\ammo-render.mjs arrows
node items\ammo-deck\tools\ammo-render.mjs crossbow-bolts
node items\ammo-deck\tools\ammo-render.mjs firearm-ammunition
```

`ammo-render.mjs` writes working PNGs under `items/ammo-deck/build/<deck>/` and writes each print sheet to:

- `items/decks/arrows/sheet-01.pdf`
- `items/decks/crossbow-bolts/sheet-01.pdf`
- `items/decks/firearm-ammunition/sheet-01.pdf`

Print duplex long-edge at Actual Size or 100 percent. The backs are column-mirrored for the established deck sheet layout and use `BACK_DY_MM=-2.5` unless overridden by environment variables.

## Firearm Ammunition art

Generate the Firearm Ammunition art from the repository root:

```powershell
$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User"); node items\ammo-deck\tools\firearm-gen.mjs
```

The generator writes `items/treasure/images/firearm-ammunition-10.png`. It skips existing art unless `FORCE=1` is set. If the key is missing or the API call fails, the renderer still builds the Firearm Ammunition sheet with a vector fallback face.
