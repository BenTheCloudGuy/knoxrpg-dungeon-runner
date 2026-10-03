# Character Portraits (from D&D Beyond)

Real player-chosen character art pulled directly from D&D Beyond, keyed by the
character ID in each sheet filename (`Name_<CharacterID>.pdf`).

Source per character:
`https://character-service.dndbeyond.com/character/v5/character/<CharacterID>`
then `data.decorations.avatarUrl` downloaded at full resolution (query string stripped).

Files are named `Name_<CharacterID>.png`.

## Extracted (24 of 24)

All 24 character portraits are present. Most are 700 to 1024 px.

Four were private on the first pass (HTTP 403) and were pulled after the owner
made them public. Their uploads are lower resolution than the rest, so they will
look softer if enlarged:

- Forryane Tamandrua (170827155) — 256x256
- Halvar Kolsrud (170789571) — 256x256
- Khalid Chong (170827129) — 256x256
- Ruse (170827173) — 150x150 (smallest; this is the native upload size)

## Re-run

```powershell
node .\player_characters\tools\extract-portraits.mjs
```
