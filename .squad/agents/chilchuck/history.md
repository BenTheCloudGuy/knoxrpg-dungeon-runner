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
