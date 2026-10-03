# Senshi - History

## Core Context

**Project:** knoxrpg-dungeon-runner, "The Vault of the Starving Mind"
**Owner:** Ben Mitchell (BenTheCloudGuy)
**Created:** 2026-05-30
**My role:** Quartermaster, props, item cards, handouts as physical artifacts, Dwarven Forge terrain notes

## Known props so far

- Scrying Stone, the canonical decoder for crystal clues.
- Artificer's Cube, TBD mechanic.
- Health potions, item cards, rainbow room clue prop.
- Proxmark3 Kyber Crystal toy-prop tooling note, backstage setup for owned Disney Kyber Crystal RFID/NFC props only.

## Direction

- User wants to move to poker chips with item pictures, see [thoughts.md](../../../thoughts.md).
- Table footprint is about 5 feet by 7 feet on Dwarven Forge terrain.

## Summarized older entries through 2026-09-27

- Item-card, equipment-deck, ingredient-card, prize-token, ammunition, dagger, gear, crystal, and magic-item work established the deck pipeline: local art, 750 by 1050 px cards, US Letter sheets, committed PDFs under `items\decks\`, column-mirrored duplex backs, and printer-specific 3201dw rotated-back copies when needed.
- Magic Item Deck cards must use local art with frontmatter `image: ../images/<slug>.png`; remote blob URLs are unreliable and can fall back to the vector seal.
- Scrying Stone and Crystal Shard canon remains eight school crystals, door and exit-lock props only, never prize gates.
- Approved prop outputs include Berhan Voss journal PDF, Five Seals handouts, Grovlikk handout, C3 handout, ingredient cards, prize tokens, and multiple single-item full-page gear or ammo decks.
- Proxmark3 Kyber Crystal work is only for Ben's owned Disney Kyber Crystal toy props. No credential cloning, access-card bypass, badge, payment, transit, hotel, lock, or third-party tag workflows.
- Cultist Tomb cryptex laser work requires true even-odd black fills, converted strokes, minimum feature checks, and test tiles before batch etching.
- Netheril prop safe-area canon keeps `#app` as a fixed 1920 by 1080 box scaled into the measured foam aperture, with `/api/aperture` and `config/screen-aperture.json` as the persistent authority.

## Learnings

- 2026-10-03 (Berhan Voss saddle-stitch booklet margin fix): The text-rendered booklet now has a saved repeatable generator at `props\journal-deck\tools\journal-booklet.py`. Rebuild from repo root with `.\.venv\Scripts\python.exe props\journal-deck\tools\journal-booklet.py`; it reads `props\alchemist-journal-booklet.md` and writes `props\Berhan-Voss-Journal-Booklet.pdf`. Margin constants are `OUTER_MARGIN = 20`, `GUTTER_MARGIN = 45`, `TOP_MARGIN = 61`, and `BOTTOM_MARGIN = 44` points on 792 x 612 pt landscape sheets. Flowing body and quote blocks are justified except for each block's final line, so prose reaches both frame edges while headings, section labels, list items, and numbered recipe steps stay left-aligned. This is the text-rendered reportlab+pypdf booklet path and is distinct from the Node image print-and-play tool at `props\journal-deck\tools\journal-render.mjs`.

- 2026-10-03 (Berhan Voss booklet handwritten font): The saddle-stitch booklet now embeds static Caveat instances generated from `props\journal-deck\assets\fonts\Caveat-Variable.ttf`: `Caveat-Regular.ttf` at weight 400 and `Caveat-Bold.ttf` at weight 700. Body text is Caveat Regular 16 pt with 18.8 pt leading, lists and inset notes are 15.5 pt with 18 pt leading, section labels are Caveat Bold 19 pt with 22 pt leading, and headings are Caveat Bold 26 pt with 30 pt leading. The 2-up geometry now uses 20 pt outside margins and 45 pt gutters on both sides of the fold.

- 2026-10-02 (Scrying crystal breakdown): Created `props/scrying-crystal-breakdown.md` as the crystal-by-crystal Scrying Stone reference. The prop app structure is crystal to school to four pages, with top Origins, bottom Foundations, left Practices, and right Risks. The roster covers 13 configured crystals: 8 exit keys and 5 lesser stones. Shared-school groups are Transmutation, Illusion, Conjuration, Divination, and Necromancy. Single-crystal schools are Abjuration, Evocation, and Enchantment. Flagged the Yellow or Purple school-color conflict between config and the prop README, stale Illusion and Divination page alignment labels, lesser-crystal LED color mismatches, absent `prizes.md`, uncorroborated config locations against README/prizes alone, and Evocation draft markers. Team findings went to `.squad/decisions/inbox/senshi-scrying-breakdown.md`.

- 2026-10-02 (monster one-page sheets): Added the monster sheet production stack under `monsters\tools\sheet\`. It is self-contained for CSS and embedded fonts, but reuses Playwright through `createRequire(path.join(player_characters/tools/sheet, "package.json"))` so Chromium is not reinstalled. `monster-parse.mjs` reads the 31 authoritative `monsters\*.md` files and the `monsters\AUDIT.md` weapon option handoff, excluding `goblins.md` and `AUDIT.md`. `art-gen.mjs` builds original `gpt-image-1` prompts from each monster source, writes idempotent art to `monsters\art\<slug>.png`, and skips existing art unless `FORCE` is set. `render-all.mjs` writes one PDF per monster to `monsters\sheets\<slug>\<Name>.pdf`, a preview PNG beside it, and `monsters\sheets\manifest.json`; `verify-pdfs.mjs` checks each PDF has exactly one page and no overflow. Full rebuild from repo root: `$env:OPENAI_API_KEY = [Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User'); npm --prefix .\monsters\tools\sheet run build`. Production report lives at `monsters\sheets\REPORT.md`. Canon refinements: sheets are stat rules only, and the known Hob Gob, Berhan Voss, and Goblin Warrior audit blockers are noted rather than blocking the batch.
- 2026-09-27 (Eldric design-proof vector PDF): Built the rejected-sheet replacement as an isolated proof under `player_characters\design-proof\eldric\`, leaving `player_characters\sheets\` and `player_characters\tools\render-sheets.mjs` untouched. Final page plan is 10 A5 pages with vector text and a generated text-free portrait.
- 2026-09-27 (Phase 2 all-character sheet batch): Extended `player_characters\tools\render-sheets.mjs` to all 24 roster characters while keeping the approved three-page A5 layout. Full builds assemble `player_characters\sheets\all-characters-a5.pdf` as a 72-page combined booklet.
- 2026-09-27 (HP 3201dw deck variants): Added `items\decks\tools\rotate-backs-3201dw.mjs` to create printer-specific copies under `items\decks\3201dw\` without changing original PDFs.
- 2026-09-27 (Five Seals handout and print fixes): Built the Five Seals player handout from Ben's supplied wall image, added a print-safe tone map, and applied a local brighten to the far-right tragedy mask while keeping raw art untouched.
- 2026-09-27 (C3 pit handout replacement): Built the corrected C3 handout from Ben's user-supplied pit artwork with no image regeneration. The earlier Treasure Goblin door assets were the wrong C3 art and were removed.
- 2026-09-27 (Accessory Magic Item Deck Phase 2): Built all 24 accessory cards, avoided duplicating the 8 already-carded accessories, kept art local, and rebuilt the Magic Item Deck as an 88-card, 20-page PDF with 0 fallback art.

## Learnings (2026-10-02)

- **print.css page margins widened** for the GM Guide. Old `@page` margin was `0.7in 0.7in 0.75in 0.7in` (text block ~0.70in from paper edge, cramped for a text-heavy module). New margin is `0.85in 0.95in 0.9in 0.95in` (top/right/bottom/left). Side margins now 0.95in each - clearly more generous, book-like block.
- **Body paragraph alignment switched from `justify` to `left`** (ragged right) at `p { ... }` in print.css (~line 66). Justify at the old tight margin produced ugly rivers; left-aligned reads more like a published module at the wider block, and matches the already-left blockquote p, li p, and image caps.
- **Verification:** measured actual text positions with `pdfplumber` on the built PDF. Left text edge = 0.948in on all text pages; right gap 0.95-1.0in. Build chain from `gm-guide/tools`: `node assemble.mjs` then `node build-pdf.mjs "..\..\GM-Guide.md" "..\..\GM-Guide.pdf"`. The chrome `task_manager` ERROR lines in build output are harmless noise.
- Everything else in print.css left intact: parchment tint, red small-caps headers, read-aloud cream boxes, GM-note callouts, image caps, `print-color-adjust: exact`.

## Learnings (2026-10-02, Scrying Stone clue configuration audit)

- The active dungeon-runner prop exposes 32 school-and-direction Markdown pages, four per school. Pages are selected by school, not RFID, so exit and lesser crystals assigned to the same school share the same four content surfaces.
- Reserved a consistent working direction map in `props/scryingstone.md`: top for the Goblin Tunnels tree cache, left for ingredients, right for crystal and boss leads, and bottom for the C-12 cage door. This is a physical configuration map only. Falin still owns clue sequence and Marcille owns final player-facing wording.
- All 32 current pages remain generic school lore. They were not replaced because the active decision ledger forbids Scrying Stone treasure reveals, while two requested categories concern treasure, and because specific Caverns ingredient locations remain pending Ben's choice.
- `config/config.yaml` matches the eight-exit-crystal canon and five lesser crystals. The nested prop README has a stale color table that assigns Yellow to Divination and Orange to Illusion, while active canon uses Purple for Divination and Yellow for Illusion.
- The C-12 cage door is distinct from the C3 Treasure Goblin hatch. C-12 requires the rune-matched key from the dead guard in D10. The exact key appearance and rune art remain undefined.
- `prizes.md` is absent from this checkout even though governance names it as canon. No prize facts were inferred.

## Learnings

- gm-guide/tools/print.css layout fixes (requested by Ben): (1) parchment inset — set `@page` margin to `0.4in` and `body` `padding: 0.55in` so the parchment background band shows on all four sides; print-color-adjust: exact kept on html/body. (2) Removed forced page breaks on `h1` (deleted `page-break-before: always` / `break-before: page` and the `h1:first-of-type` override) so content flows continuously; kept `page-break-after: avoid` on headings and `page-break-inside: avoid` on blockquote/.gmnote/table/img/.statblock. (3) Nested lists now step: explicit `list-style-type` per level (ul disc/circle/square, ol decimal/lower-alpha/lower-roman) with increasing `margin-left`.
- Rebuild path: from gm-guide/tools run `node assemble.mjs` then `node build-pdf.mjs "..\..\GM-Guide.md" "..\..\GM-Guide.pdf"`. Chromium/Edge emits harmless `ERROR:...task_manager` and sync noise during PDF render — the build still succeeds and writes the PDF.

## Learnings (2026-10-02, cross-agent Scrying Stone handoff via Cleric)

- Falin's proposed category directions conflict with the physical map currently recorded in `props/scryingstone.md`: only the bottom C12 category agrees. Do not change the 32 live pages until the mapping is resolved.
- Laios verified Area 5, Caverns survey nodes C5/C6/C7/C11, all eight Key Crystal routes, and Door H's C8/C12 link to the D10 guard key chain.
- Treasure-reveal exceptions, named Caverns ingredients, lesser-crystal conflicts, key-rune details, and the absent `prizes.md` remain open. No prize content should be inferred.

## Learnings (2026-10-02, A5 booklet build — GM-Guide-A5.pdf)

**Decision honored:** GM abandoned AI map redraws. A5 booklet uses ORIGINAL images only — left-dungeon accurate `*-crop.png` crops + original area maps elsewhere. None of `gm-guide/maps/left/*-map.png` redraws were used.

**Deliverable:** `GM-Guide-A5.pdf` at repo root. 98 pages, every page exactly 5.5x8.5in portrait, ~17 MB. Built by `gm-guide/proof/build-a5.mjs` (extends the proof pipeline to the whole guide); maps prepared by `gm-guide/maps/left/prepare-maps.mjs`; A5 look in `gm-guide/proof/a5.css`. Did NOT touch Letter-size `GM-Guide.md`/`gm-guide/tools/print.css`.

**Pipeline notes for future A5 rebuilds:**
- Run `node gm-guide/maps/left/prepare-maps.mjs` first (rotates landscape maps 90 deg CW if w/h >= ~1.15, downscales to 2200px long side, JPEG q82 -> `gm-guide/a5-build/*.jpg`). Full-res PNGs balloon the PDF to ~186 MB; JPEGs keep it ~17 MB.
- Then `node gm-guide/proof/build-a5.mjs`. markdown-it deps live in `gm-guide/tools/node_modules`; sharp only in `gm-guide/maps/left/node_modules` (sharp scripts MUST live in that dir, bare import).
- Edge singleton gotcha: headless Edge silently fails to re-render (identical byte count) if the user has Edge open. MUST pass `--user-data-dir=<dedicated>` + `--no-first-run` + `--no-default-browser-check`. Already in build-a5.mjs.
- Edge path: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.

**Stat-block gotcha (key):** Two formats. Mooks = single compact line `*Type* | **AC** 8 | **HP** 15 | ...`. Bosses/mini-bosses = `#### BOSS: Name`, italic type line, then multi-line `**Armor Class**`/`**Hit Points**`, table, traits, then `**Tactics.**`. `break-inside:avoid` is only honored if the block fits one page, so Tactics is treated as a STOP boundary and flows as prose outside the shaded box; 8pt font makes all four bosses (Vos'sykriss, Statue, Drider, Hob Gob) + mini-boss Giant Slime fit one A5 page as whole boxes.

**Imposition:** Used the allowed FALLBACK — each map on its own page immediately before its data — not strict verso/even-page placement.

**Area-to-map mapping (16 areas):** artificers-cells=D1, grovlikk-hall=D2, library-workshop=D3+D5, portal-exit=D4, floor-puzzle-hall=D6, alchemists-lab=D7, serpents-lair=D8+D9, old-cells=D10, the-gauntlet=D11 (all left crops); Dungeon-Right=dungeon-right.jpg (R1-R11, one dense map, not sub-cropped); Caverns Area1/2/3=cavern-marked-1/2/3.jpg; Goblin Tunnels=GoblinTunnelsPoints.jpg; Goblin Camp=GoblinGrottoPoints.jpg; Crypts=dungeon-b-crypts.jpg.

## Learnings (2026-10-03, Left Dungeon map pages — crops rejected)

Ben rejected the Left Dungeon crops ("the crops are not good"). Final decision: DROP all custom crops entirely; nothing from `gm-guide/maps/left/` is used (neither `*-crop.png` nor `*-map.png`). Every A5 map page is now a WHOLE original photo.

Left Dungeon fix (only area changed; all others already whole originals and left untouched):
- Replaced the 9 crop map pages with TWO whole originals, up front before the D1-D11 data:
  1. `images/rooms/dungeon-left.jpg` — full left-table overview, pins 1-11 = D1-D11. Near-square (0.95), NO rotation.
  2. `images/rooms/ArtificersLair.jpg` — Artificers closeup, pins 1-5 = D1-D5. Landscape (1.11), rotated 90 to fill height.
- These are the same two images already embedded at the top of `rooms/Dungeon-Left.md`.
- After the two map pages, D1-D11 room data flows CONTINUOUSLY (concatenated L.d1..L.d11), not nine pagebreak-delimited chunks.

Code: in `build-a5.mjs` removed the 9 left crop AREAS entries, added `leftData` + a two-map emit block before the AREAS loop. In `prepare-maps.mjs` dropped the 9 crop MAPS entries, added `dungeon-left` (no rot) + `artificers-lair` (rot). Rebuild path unchanged: `node gm-guide/maps/left/prepare-maps.mjs` then `node gm-guide/proof/build-a5.mjs`.

Result: 87 pages (down from 98; -9 map pages and continuous data reclaimed ~2 more), every page 5.5x8.5, no read-aloud/stat-block splits. PDF ~13 MB.
