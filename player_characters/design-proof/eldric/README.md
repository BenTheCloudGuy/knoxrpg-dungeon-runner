# Eldric Vaelthorn Design Proof

Source rules data: `.squad/decisions/inbox/chilchuck-eldric-datASPEC.md`.

Build command from repo root:

```powershell
node .\player_characters\design-proof\eldric\render-eldric.mjs
```

Outputs:

- `Eldric_Vaelthorn_154714847.pdf`, native A5 pages at 419.53 by 595.28 pt.
- `preview\page-1.png` through `preview\page-10.png`.
- `preview\contact-sheet.png`.
- `art\eldric-portrait.png`, generated with `gpt-image-1` from a minimal text-free character art prompt.

Gameplay text is drawn as PDF vector text with `pdf-lib` StandardFonts. The portrait is the only gameplay-page image.
