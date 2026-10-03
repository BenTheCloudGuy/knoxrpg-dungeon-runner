# Artificer's Toolkit Deck

This deck prints one full US Letter duplex sheet with nine identical Artificer's Toolkit cards. Each card is one toolkit with 10 uses.

## Build

From the repository root, run:

```powershell
node items\artificers-toolkit-deck\tools\artificers-toolkit-render.mjs
```

The script reads `items/treasure/artificers-toolkit.md`, uses art at `items/treasure/images/artificers-toolkit.png` when present, writes working PNGs under `items/gear-deck/build/artificers-toolkit/`, and writes the print sheet to `items/decks/artificers-toolkit/sheet-01.pdf`.

Print duplex long-edge at Actual Size or 100 percent. The backs are column-mirrored for the established deck sheet layout and use `BACK_DY_MM=-2.5` unless overridden by environment variables.

## Art

Generate the art from the repository root:

```powershell
$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User"); node items\gear-deck\tools\gear-gen.mjs artificers-toolkit
```

If the key is missing or the API call fails, the renderer still builds the sheet with a vector fallback face.
