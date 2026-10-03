# A5 Character Sheets — The Vault of the Starving Mind

Printable, D&D-styled A5 character sheets for all 24 pre-generated players, built
directly from each character's **D&D Beyond** data (campaign: *Learn to Play D&D*).
Designed to slide into A5 plastic binder sleeves so players can dry-erase on top.

Each character's folder holds:
- `<Name>_<DDBID>.pdf` — the print file. The visible parchment card is **8.5 in tall** with the A5 width unchanged; the paper box is ~5.83 x 8.99 in (card plus a 6 mm white safe margin so nothing bleeds off the edge). Print at 100% / Actual size.
- `preview/page-N.png` — page-by-page previews.
- `sheet.html` — the rendered source.

## Page order

1. **Main** — identity + portrait, AC / Initiative / Speed / Proficiency, ability scores, saving throws, HP & death saves (with a Hit Dice usage track), passives, On Your Turn (Actions / Bonus Actions / Reactions), and the **House Rules** for this run (Hit Die healing and Spellcasting from found Spell Books).
2. **Skills** — all 18 skills with a plain-language "what it's for" column, plus Attacks & Damaging Cantrips and weapon-math for writing in a weapon.
3. **Who You Are** — ancestry, background, and feats, then **Your Class**, which closes the section with a usage tracker (limited-use boxes) and every class and subclass ability written out with what each one costs (paginates as needed).
4. **Spell Reference** — Spellcasting and Spell Slots trackers, then a full card for every spell (from D&D Beyond). Casters only; a character's usage tracker and class abilities live under Who You Are.

All per-rest and per-day abilities and all spell slots are **doubled**, because this dungeon has no rest.

Every sheet ends with **2 or 3 blank Notes pages** (2 when the content ends on an even page, 3 when it ends on an odd page) so the total page count is always even for double-sided printing.

## Roster

| Character | Ancestry | Class (Subclass) | Pages |
|---|---|---|---|
| Aelar Thorneleaf | Elf | Ranger (Fey Wanderer) | 8 |
| Alderachk | Human | Warlock (Fiend Patron) | 10 |
| Bishop | Kenku | Monk (Way of the Kensei) | 6 |
| Borin Ironfist | Dwarf | Fighter (Champion) | 6 |
| Drakor | Dragonborn | Paladin (Oathbreaker) | 8 |
| Eldric Vaelthorn | Human | Sorcerer (Wild Magic) | 10 |
| Forryane Tamandrua | Elf | Sorcerer (Spellfire) | 12 |
| Geralt Hamlin | Halfling | Bard (College of Lore) | 10 |
| Halvar Kolsrud | Halfling | Wizard (Conjurer) | 12 |
| Kaelen Duskreign | Human | Warlock (Hexblade) | 10 |
| Kael Thorne | Elf | Rogue (Arcane Trickster) | 8 |
| Khalid Chong | Human | Druid (Circle of the Moon) | 10 |
| Rook | Aarakocra | Fighter (Arcane Archer) | 8 |
| Ruse | Tiefling | Bard (College of the Moon) | 10 |
| Ser Aldric Thorn | Human | Paladin (Oath of Devotion) | 8 |
| Shadowpaw | Tabaxi | Ranger (Gloom Stalker) | 8 |
| Ssarth | Lizardfolk | Rogue (Assassin) | 6 |
| Sseris Thorns | Elf | Druid (Circle of the Land) | 12 |
| Taren Solvar | Human | Monk (Drunken Master) | 6 |
| Thane Calder | Goliath | Cleric (War Domain) | 10 |
| Thorn Merriman | Human | Cleric (Life Domain) | 8 |
| Tobrin Gearwhistle | Gnome | Artificer (Artillerist) | 10 |
| Varka Stonefist | Orc | Barbarian (Berserker) | 6 |
| Z'rella Vornshadow | Elf | Wizard (Bladesinger) | 10 |

## Regenerating

From the repo root:

```
node .\player_characters\tools\fetch-all-json.mjs      # refresh D&D Beyond data
node .\player_characters\tools\sheet\render-all.mjs     # render all 24 (reports any overflow)
node .\player_characters\tools\sheet\render-sheet.mjs .\player_characters\data\<Name>_<ID>.json   # one character
```

## Notes and known limits

- **Numbers are computed from D&D Beyond**, not guessed. AC uses each class's Unarmored Defense where it applies.
- **No weapons were loaded** on any D&D Beyond sheet, so the Attacks table lists damaging cantrips and unarmed strikes; a weapon-math line gives the to-hit and damage bonuses to fill a weapon in by hand.
- **Feature text**: ancestry, class, and feature explanations use hand-written plain language where available (currently Human + Sorcerer), and fall back to concise D&D Beyond text otherwise. These can be rewritten in plain language over time in `tools/sheet/content.mjs`.
- A handful of homebrew items are flagged "confirm with your DM" (e.g. the *Dark Bargain* feat), and a very long homebrew spell (Battle Familiar) is trimmed with a "full text on D&D Beyond" note.
