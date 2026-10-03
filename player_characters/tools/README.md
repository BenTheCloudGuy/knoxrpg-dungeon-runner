# Player Character Sheet Renderer

Phase 2 builds simplified 3-page A5 character sheets for all 24 player characters. The renderer reads character markdown files in `player_characters\markdown\`, consumes Chilchuck's Phase 2 tracker and feature summaries, composes each page as SVG, rasterizes to 1748 x 2480 px PNG at 300 dpi, then assembles a 3-page A5 PDF at 420 x 595 pt.

## Build

From the repository root:

```powershell
node player_characters\tools\render-sheets.mjs
```

One-line regenerate command:

```powershell
Get-ChildItem .\player_characters\sheets -Filter *.pdf | Remove-Item; node .\player_characters\tools\render-sheets.mjs
```

The full build renders all 24 character PDFs in roster order and also creates:

- `player_characters\sheets\all-characters-a5.pdf`

The D&D Beyond number comes from the source markdown footer and is kept in the filename and printed on page 1.

## ONLY filter

Render one character or a comma-separated subset:

```powershell
$env:ONLY = "Eldric_Vaelthorn"; node player_characters\tools\render-sheets.mjs
$env:ONLY = "Alderachk"; node player_characters\tools\render-sheets.mjs
$env:ONLY = "Eldric,Varka,Halvar"; node player_characters\tools\render-sheets.mjs
```

`ONLY` matches the config slug, source filename, or D&D Beyond number. A filtered build does not rebuild `all-characters-a5.pdf`.

## Doubling rule

For this one-shot, there is no rest. Limited-use resources and spell slots are doubled from their normal rest-based counts. The renderer follows Chilchuck's Phase 2 file for every character:

- Spell slots are doubled and printed as boxes.
- Most limited resources are doubled and printed as circles.
- Large pools, including Lay On Hands and Arcane Recovery slot-level pools, are printed as a number plus a dry-erase remaining box instead of long rows of circles.
- Passive, at-will, per-turn, and reaction-only traits are not doubled unless they spend a limited pool.

All tracking marks are printed empty for dry-erase use on plastic sleeves.

## Output and previews

PDFs go to `player_characters\sheets\`. The combined booklet goes to `player_characters\sheets\all-characters-a5.pdf`.

Coordinator spot-check previews go to `player_characters\tools\_preview\` as downscaled page 3 PNG files:

- `Alderachk-p3.png`
- `Drakor-p3.png`
- `Bishop-p3.png`
- `Tobrin_Gearwhistle-p3.png`
- `Halvar_Kolsrud-p3.png`

## Dependencies

No new install is required. The script reuses `sharp` and `pdf-lib` from `items\magic-items\deck\tools\node_modules` through `createRequire(path.join(sharedTools, "package.json"))`.
