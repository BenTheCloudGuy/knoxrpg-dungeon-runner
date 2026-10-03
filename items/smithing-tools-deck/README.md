# Smithing Tools Deck

This deck prints one full US Letter duplex sheet with nine identical Smithing Tools cards. Each card is a single use.

## Build

From the repository root, run:

```powershell
node items\smithing-tools-deck\tools\smithing-tools-render.mjs
```

The script reads `items/treasure/smithing-tools.md`, uses art at `items/treasure/images/smithing-tools.png` when present, writes working PNGs under `items/gear-deck/build/smithing-tools/`, and writes the print sheet to `items/decks/smithing-tools/sheet-01.pdf`.

Print duplex long-edge at Actual Size or 100 percent. The backs are column-mirrored for the established deck sheet layout and use `BACK_DY_MM=-2.5` unless overridden by environment variables.

## Art

Generate the art from the repository root:

```powershell
$env:OPENAI_API_KEY = [System.Environment]::GetEnvironmentVariable("OPENAI_API_KEY","User"); node items\gear-deck\tools\gear-gen.mjs smithing-tools
```

If the key is missing or the API call fails, the renderer still builds the sheet with a vector fallback face.
