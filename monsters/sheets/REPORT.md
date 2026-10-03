# Monster Sheet Production Report

**Build date:** 2026-10-02

## Verification

- Rendered 31 monster PDFs.
- Art generation: first run generated 31 original images, 0 failed. Final idempotent rebuild skipped 31 existing images, 0 failed.
- Page count method: `node .\monsters\tools\sheet\verify-pdfs.mjs`, which counts `/Type /Page` entries in each generated PDF.
- Result: 31 checked, 0 missing, 0 wrong page count. Every PDF is exactly one page.
- Overflow method: `node .\monsters\tools\sheet\render-all.mjs`, which checks the rendered Playwright page frame before writing the manifest.
- Result: 0 overflow reports.

## Monster files

| Monster | PDF | Art |
| --- | --- | --- |
| Ashari Fire Elemental | `monsters\sheets\ashari-fire-elemental\Ashari Fire Elemental.pdf` | `monsters\art\ashari-fire-elemental.png` |
| Baron Kepmak | `monsters\sheets\baron-kepmak\Baron Kepmak.pdf` | `monsters\art\baron-kepmak.png` |
| Berhan Voss, the Alchemist (Mutant) | `monsters\sheets\berhan-voss\Berhan Voss, the Alchemist (Mutant).pdf` | `monsters\art\berhan-voss.png` |
| Bombardier Goblin (x1) | `monsters\sheets\bombardier-goblin\Bombardier Goblin (x1).pdf` | `monsters\art\bombardier-goblin.png` |
| Caster Goblin (x1) | `monsters\sheets\caster-goblin\Caster Goblin (x1).pdf` | `monsters\art\caster-goblin.png` |
| Cinderslag Elemental | `monsters\sheets\cinderslag-elemental\Cinderslag Elemental.pdf` | `monsters\art\cinderslag-elemental.png` |
| Large Snake (Constrictor Snake Chassis) | `monsters\sheets\constrictor-snake\Large Snake (Constrictor Snake Chassis).pdf` | `monsters\art\constrictor-snake.png` |
| Demonfeed Spider | `monsters\sheets\demonfeed-spider\Demonfeed Spider.pdf` | `monsters\art\demonfeed-spider.png` |
| Drider Priestess of Lloth (Boss) | `monsters\sheets\drider-priestess\Drider Priestess of Lloth (Boss).pdf` | `monsters\art\drider-priestess.png` |
| Dwarven Iron Golem | `monsters\sheets\dwarven-iron-golem\Dwarven Iron Golem.pdf` | `monsters\art\dwarven-iron-golem.png` |
| Feywild Guard (x3) | `monsters\sheets\feywild-guard\Feywild Guard (x3).pdf` | `monsters\art\feywild-guard.png` |
| Flying Goblin | `monsters\sheets\flying-goblin\Flying Goblin.pdf` | `monsters\art\flying-goblin.png` |
| Giant Slime (Mini-Boss) | `monsters\sheets\giant-slime\Giant Slime (Mini-Boss).pdf` | `monsters\art\giant-slime.png` |
| Giant Spider | `monsters\sheets\giant-spider\Giant Spider.pdf` | `monsters\art\giant-spider.png` |
| Goblin Artificer (x1, Goblin Camp) | `monsters\sheets\goblin-artificer\Goblin Artificer (x1, Goblin Camp).pdf` | `monsters\art\goblin-artificer.png` |
| Goblin Dog (x2, patrol and Goblin Camp) | `monsters\sheets\goblin-dog\Goblin Dog (x2, patrol and Goblin Camp).pdf` | `monsters\art\goblin-dog.png` |
| Shaman Goblin / Medicine Man (Healer) (x1, Goblin Camp) | `monsters\sheets\goblin-shaman\Shaman Goblin Medicine Man (Healer) (x1, Goblin Camp).pdf` | `monsters\art\goblin-shaman.png` |
| Goblin Warrior (x15) | `monsters\sheets\goblin-warrior\Goblin Warrior (x15).pdf` | `monsters\art\goblin-warrior.png` |
| Green Slaad | `monsters\sheets\green-slaad\Green Slaad.pdf` | `monsters\art\green-slaad.png` |
| Hob Gob, the Goblin King (Boss) | `monsters\sheets\hob-gob\Hob Gob, the Goblin King (Boss).pdf` | `monsters\art\hob-gob.png` |
| Lizard Mage | `monsters\sheets\lizard-mage\Lizard Mage.pdf` | `monsters\art\lizard-mage.png` |
| Lizard Shaman | `monsters\sheets\lizard-shaman\Lizard Shaman.pdf` | `monsters\art\lizard-shaman.png` |
| Lizardfolk Fighter | `monsters\sheets\lizardfolk-fighter\Lizardfolk Fighter.pdf` | `monsters\art\lizardfolk-fighter.png` |
| Magma Elemental (Fire Elemental Chassis) | `monsters\sheets\magma-elemental\Magma Elemental (Fire Elemental Chassis).pdf` | `monsters\art\magma-elemental.png` |
| Magma Landshark | `monsters\sheets\magma-landshark\Magma Landshark.pdf` | `monsters\art\magma-landshark.png` |
| Sahuagin Baron | `monsters\sheets\sahuagin-baron\Sahuagin Baron.pdf` | `monsters\art\sahuagin-baron.png` |
| Skeleton | `monsters\sheets\skeleton\Skeleton.pdf` | `monsters\art\skeleton.png` |
| The Statue (Boss) | `monsters\sheets\statue\The Statue (Boss).pdf` | `monsters\art\statue.png` |
| Vos'sykriss, the Serpentfolk | `monsters\sheets\vos-sykriss\Vos'sykriss, the Serpentfolk.pdf` | `monsters\art\vos-sykriss.png` |
| Wraith | `monsters\sheets\wraith\Wraith.pdf` | `monsters\art\wraith.png` |
| Zombie | `monsters\sheets\zombie\Zombie.pdf` | `monsters\art\zombie.png` |

## Failures and blockers

- Art generation failures: none.
- Render failures: none.
- Canon blockers from `monsters\AUDIT.md` remain Hob Gob chassis conflict, Berhan Voss fixed HP question, and Goblin Warrior variant mechanics. Current canonical monster source files were rendered as requested.

## Rebuild command

```powershell
$env:OPENAI_API_KEY = [Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User'); npm --prefix .\monsters\tools\sheet run build
```
