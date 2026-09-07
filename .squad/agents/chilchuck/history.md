# Chilchuck — History

## Core Context

**Project:** knoxrpg-dungeon-runner — "The Vault of the Starving Mind"
**Owner:** Ben Mitchell (BenTheCloudGuy)
**Created:** 2026-05-30
**My role:** Encounter & Stat Block Designer — 5e 2024 stat blocks, trap mechanics, encounter math

## Party assumptions

- 8–12 PCs at level 3, 40 HP cap, no long rests, max 3 short rests at 1 HD each
- Action economy is heavily skewed toward the players at this scale
- Lethality is intended

## Known encounters (from canon)

- Fire Elementals + Imps in the Lava/Ruins zone (Red Crystal)
- Sentry construct guarding the Artificer's Lair (Purple Crystal)
- Mirror Trap creature (per [thoughts.md](../../../thoughts.md))
- Sphere of Annihilation hazard, Mimic Lake, Goblin's Lair, Chess Puzzle, Color-Coded Trap, Rainbow Room

## Learnings

### Magic item balance review (items/magic-items/) — 2026-06-26

The `items/magic-items/` folder is the FULL SRD/5e-2024 compendium (thousands of files), not a curated loot list. Files match standard DMG 2024 mechanics verbatim (spot-checked: wand-of-paralysis, ring-of-regeneration, broom-of-flying, helm-of-teleportation, wand-of-orcus, staff-of-healing, potion-of-healing, wand-of-fireballs, nine-lives-stealer, sphere-of-annihilation, ring-of-free-action, ring-of-mind-shielding, potion-of-invulnerability, ring-of-three-wishes). Treat the filenames as the authority for "exists"; don't invent items.

Balance verdicts for this dungeon (8-12 PCs, lvl 3, 40 HP cap, no long rest, 3 short rests, Mind Flayer host, gated crystal paths):

- **Category: at-will/recharging healing = BANNED as permanent items.** Ring of Regeneration (1d6/10 min passive) and Staff of Healing (10 charges, Mass Cure Wounds) defeat the no-long-rest attrition that makes this a grinder. Same for ring-of-regeneration, gloves-of-healing, periapt-of-wound-closure, rod-of-resurrection, cauldron-of-rebirth, potion-of-vitality. Healing should stay as single-use potions only (potion-of-healing 2d4+2, common).
- **Category: at-will hard CC = BANNED.** Wand of Paralysis (DC 15 paralyze, 7 charges + recharge), staff-of-charming, wand-of-binding, wand-of-fear, wand-of-web, wand-of-entangle, wand-of-polymorph. With 8-12 PCs the action economy already lets the party focus-fire; adding free paralysis lets them lock the Sentry or any boss out of the fight entirely.
- **Category: flight/teleport = BANNED (breaks gated layout).** broom-of-flying, winged-boots, wings-of-flying, carpet-of-flying, boots-of-levitation, helm-of-teleportation, cube-of-teleportation, conch-of-teleportation, cubic-gate, well-of-many-worlds, ring-of-djinni-summoning, portable-hole/instant-fortress. These bypass the crystal-locked doors, the Rainbow Room ROYGBIV gate, and the lava divider, and can skip straight to the exit.
- **Category: save-or-die / instant-kill = BANNED (can be turned on the dungeon's own bosses or the host).** vorpal swords, nine-lives-stealer (crit = DC 15 CON or die under 100 HP — Sentry, Fire Elementals, even Xhal'theris are all under 100), sword-of-sharpness, sphere-of-annihilation (already a placed HAZARD per sphere_anniliation.md; must never be a lootable carry item), wand-of-orcus, ring-of-three-wishes, talisman-of-ultimate-evil.
- **Category: anti-Mind-Flayer counters = GM-CURATED ONLY.** ring-of-mind-shielding (immune to thought-reading, nullifies Xhal'theris's psychic schtick) and ring-of-free-action (immune to paralysis/restrain — neuters the iconic illithid stun + grapple) gut the host's threat. Fine as a deliberate, telegraphed reward; dangerous as random loot.
- **SAFE baseline:** single-use consumables (spell-scroll-*, oils, feather-tokens, single resistance/utility potions), flat +X weapons/armor (weapon-1/2/3, armor-1/2/3, +1 shields), and bounded-charge utility (immovable-rod, rope-of-climbing, driftglobe, bag-of-holding). Limited charges + finite uses keep attrition intact.
- **Rule of thumb I'm applying:** permanent recurring power (passive heal, recharging CC, at-will flight) erodes the grinder; finite consumables preserve it. When in doubt, hand it out as a potion/scroll, not an attuned permanent.

### Survival loot curation — 39-item pick (2026-09-02)

Ben asked for the specific loot to place for a 12-PC level-3 table. Built a curated list within the "max +1, scrolls, spellbooks-as-scrolls, utility only" cap (extends the 2026-06-26 verdicts). All files verified to exist.

- **+1 weapons** (from `weapons/*-1.md`, base types only): `longsword-1`, `rapier-1`, `shortbow-1`, `dagger-1`, `mace-1`, `greatsword-1`, `handaxe-1`, `spear-1`, `warhammer-1`, `crossbow-light-1`. Avoid the named riders `monster-hunter-s-*`, `true-name-*`, `vicious-rapier-1` unless a fancier find is wanted.
- **+1 armor + shields** (from `armor/*-1.md`): `leather-1`, `studded-leather-1`, `hide-1`, `chain-shirt-1`, `breastplate-1`, `half-plate-1`, `plate-1`, `shield-1`. Avoid `mithral-half-plate-1`, `shield-of-marius-renathyr-1` unless intended as premium.
- **Scrolls** (`scrolls/`): `spell-scroll-cantrip`, `spell-scroll-level-1/2/3`, `spell-scroll-of-fireball`, `scroll-of-protection-<type>`. Note duplicate naming: `spell-scroll-1st-level` vs `spell-scroll-level-1`. (Ben cut `scroll-of-mapping` from the loot list on 2026-09-02.)
- **Spellbook:** `wondrous-items/enduring-spellbook` (common, indestructible), framed as a package of scrolls.
- **Potions** (`potions/`): `potion-of-healing` (+`-greater`/`-superior` for later zones), `potion-of-resistance` + typed resistances, `potion-of-climbing`, `potion-of-water-breathing`, `potion-of-heroism`.
- **Wondrous utility** (`wondrous-items/`): `bag-of-holding`, `rope-of-climbing`, `driftglobe`, `feather-token-feather-fall`.
- **Banned scrolls reaffirmed:** `scroll-of-tarrasque-summoning`, `scroll-of-titan-summoning`, `nether-scroll-of-azumar`, `scroll-of-the-comet`, `scroll-of-spell-power`, `scroll-of-nightmares`.

### Vial of Poison rework (items/magic-items/potions/vial-of-poison.md) — 2026-09-04

Ben respec'd the Vial of Poison (Uncommon, 40 GP, injury). Final rule:

- **Application:** Action to coat one weapon or up to three pieces of ammunition. **One application per vial.** Coating lasts **1 minute.**
- **On-hit:** For that minute, **every** creature that takes damage from the coated weapon takes an extra **2d4 Poison** on that hit (changed from "first creature struck only"). This 2d4 is automatic, no save.
- **Ongoing DoT:** A creature that takes the 2d4 then takes **1d4 Poison at the start of each of its turns.** It repeats a **DC 12 Constitution** save at the **end of each of its turns**, ending the ongoing damage on a success (so it eats at least one 1d4 tick).
- **No-reapply clause:** Once a creature succeeds on the save, it **can't be affected by this poison again** — kills stacking/perma-DoT abuse.
- **DC call:** kept at **DC 12.** The 2d4 on-hit is guaranteed; the save only governs the minor 1d4 trickle with a re-save every turn, so the DC is low-stakes. DC 12 sits in the standard 5e injury-poison band (11-14) and matches the item's prior tuning. Dropped the old "Poisoned condition" clause entirely.
- **Canon check:** ongoing 1d4 DoT does NOT trip the 2026-06-26 balance bans (no passive healing, hard CC, flight/teleport, save-or-die). It's finite consumable offense in the players' hands. Front-matter (Uncommon / Poison / 40 GP / source / image) unchanged.

### 11 named spell-scroll rules audit (2024 PHB) — 2026-09-06

Audited Falin's 11 curated scrolls against 2024 PHB / SRD 5.2 so Senshi can print verbatim. Verified against dnd2024.wikidot.com (2024 text; DDB free pages return the "Legacy" 2014 versions when not signed in, so they are useless for this).

- **Scroll table (2024 DMG, unchanged from 2014):** Cantrip DC 13 / +5; 1st DC 13 / +5; 2nd DC 13 / +5; 3rd **DC 15 / +7**. Falin's "DC 13 / +5 for cantrip through 3rd" is WRONG at 3rd level. The two 3rd-level scrolls (Mass Healing Word, Dispel Magic) print DC 15 / +7, though neither actually consumes the scroll save/attack (one heals, one uses a DC 10 + spell level ability check). Scroll save/attack that DO matter: Fire Bolt +5 attack, Scorching Ray +5 attack, Mind Sliver DC 13 Int save.
- **Guidance — Falin's flag #1 is WRONG.** The Reaction / Instantaneous version was the 2023 UA playtest and was DROPPED. Final 2024 PHB Guidance is still **Action, Touch, Concentration up to 1 minute**, but reworded: you choose a skill at cast and the target adds 1d4 to ability checks using that chosen skill for the duration (2014 was "one ability check of its choice," single use). Do not print the reaction wording.
- **Cure Wounds — Falin's flag #2 confirmed.** 2024 = **2d8 + spellcasting mod** at 1st level (was 1d8), school moved **Evocation to Abjuration**, upcast +2d8.
- **Mass Healing Word — Falin's flag #3 confirmed and refined.** 2024 = **2d4 + mod** (was 1d4), Bonus Action, 60 ft, up to six creatures, Duration Instantaneous, Components V only, school moved **Evocation to Abjuration**, dropped the "no effect on undead or constructs" clause.
- **Mind Sliver — Falin's flag #4 confirmed.** Enchantment cantrip (2024 PHB, not SRD 5.1), Action, 60 ft, **V only**, Duration 1 round. Int save or 1d6 Psychic and subtract 1d4 from the target's **next** saving throw made before the end of your next turn (single save; wasted if it makes none in that window).
- **Other 2024 deltas that matter on a card:** Lesser Restoration ends Blinded/Deafened/Paralyzed/Poisoned (school Abjuration, unchanged). Fire Bolt, Magic Missile (3 darts 1d4+1 Force auto-hit), Shield (+5 AC reaction), Scorching Ray (3 rays 2d6 Fire), See Invisibility (1 hour, no concentration), Dispel Magic (auto-ends level 3 and lower; DC 10 + spell level check for 4th+) are mechanically unchanged from 2014.
- **Fireball note (out of scope card):** 2024 Fireball is still 8d6 Fire, Dex save, 20-ft radius, but as a **3rd-level** scroll its save is **DC 15**, not 13. If the existing Fireball card prints DC 13, fix it.
- **Encounter-math flags for Ben (no roster change, Falin already ban-checked):** Mass Healing Word (2d4+mod to six as a bonus action, up to ~42 party HP from one card) and Dispel Magic (auto-kills the dungeon's own level-3-and-lower magical effects and traps, and can strip Xhal'theris's lower spells) are the two strongest attrition-breakers in the set. Both are legal single-use consumables under the survival loot cap; flagging for awareness only. Both healing scrolls only function for a user who has the spell on their class list, and the "+ mod" uses that caster's own spellcasting modifier.
