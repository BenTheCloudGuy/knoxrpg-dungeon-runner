# Monster Source Audit

**Audit date:** 2026-10-02

This audit covers every current monster source file in `monsters/`. The individual monster files are authoritative for rules text. `goblins.md` is a roster index only.

## Common One-Page Requirements

Every one-page monster sheet should include:

1. Name, size, type, alignment, AC, HP, Speed
2. Ability scores
3. Saves, skills, damage defenses, condition immunities, senses, languages, CR, XP, and PB when present
4. Traits
5. Spellcasting with inline spell summaries when present
6. Actions, including every listed weapon option
7. Bonus Actions and Reactions when present

Do not add room placement, treasure, tactics, Crystal Shard triggers, or other DM Notes to a monster sheet.

## Audit Results and Senshi Handoff

| Monster audited | Authoritative source | Required sheet sections beyond the common header | Weapon and action options to show | Finding and disposition |
| --- | --- | --- | --- | --- |
| Ashari Fire Elemental | `ashari-fire-elemental.md` | Traits, Actions | Touch | Fixed Fire Form dice, removed the invented cold vulnerability, and restored Water Susceptibility damage. |
| Baron Kepmak | `baron-kepmak.md` | Traits, Actions | Bite, Claws, Trident as one-handed melee, two-handed melee, or ranged | Clean. All attack bonuses and averages are internally consistent. |
| Berhan Voss, the Alchemist (Mutant) | `berhan-voss.md` | Traits, Actions | Slam | Removed campaign trigger text, reconciled HP notation to 76 (9d8 + 36), and corrected Slam to 2d8 + 5 for the printed average of 14. See blocker below. |
| Bombardier Goblin | `bombardier-goblin.md` | Actions, Bonus Actions, Reactions | Gob Stopper, Shortsword, Dagger | Restored Goblin Boss chassis HP notation and added the canon Dagger option. |
| Caster Goblin | `caster-goblin.md` | Traits, Spellcasting, Actions, Bonus Actions | Quarterstaff one-handed or two-handed, Scimitar, Shortbow, arcane focus | Added the canon staff option. Spell DC, attack bonus, slots, and spell summaries are consistent with Charisma 14 and PB +2. |
| Cinderslag Elemental | `cinderslag-elemental.md` | Traits, Actions | Slam | Corrected Earth Elemental chassis HP to 126 and Slam dice to 2d8 + 5. |
| Large Snake | `constrictor-snake.md` | Actions | Bite, Constrict | Corrected Constrict escape DC to 12 from Strength +2 and PB +2. |
| Demonfeed Spider | `demonfeed-spider.md` | Traits, Actions | Bite | Clean Phase Spider chassis reskin. |
| Drider Priestess of Lloth | `drider-priestess.md` | Traits, Spellcasting, Actions, Bonus Actions | Foreleg, Three-Headed Snake Whip, divine focus | Corrected Foreleg dice, Multiattack wording, and the 2024 Guidance summary. Keep the separate level 4 Cleric spell block. |
| Dwarven Iron Golem | `dwarven-iron-golem.md` | Traits, Actions | Slam, Sword, Poison Breath | Corrected Slam and Sword dice and restored the missing Poison Breath action. |
| Feywild Guard | `feywild-guard.md` | Traits, Actions, Bonus Actions | Glaive, Dagger | Clean. The Strength-based Glaive and Dexterity-based Dagger bonuses are intentional. |
| Flying Goblin | `flying-goblin.md` | Traits, Actions, Bonus Actions | Gob Stopper, Shortbow, Dagger, Net, glider | Added the canon single Gob Stopper. Show the glider as the source of the 30-foot Fly Speed, not as a separate attack. |
| Giant Slime | `giant-slime.md` | Traits, Actions | Pseudopod, Engulf | Corrected Pseudopod to 3d6 + 2 for the printed average of 12. Ooze Cube escape does not add Prone. |
| Giant Spider | `giant-spider.md` | Traits, Actions | Bite, Web | Clean. |
| Goblin Artificer | `goblin-artificer.md` | Traits, Actions, Bonus Actions | Pistol, Scoped Musket, Dagger | Clean. Show two pistols in the equipment art or loadout, but print one Pistol action because the source grants no extra pistol attack. |
| Goblin Dog | `goblin-dog.md` | Traits, Actions | Bite | Clean Mastiff chassis reskin. |
| Shaman Goblin / Medicine Man | `goblin-shaman.md` | Traits, Spellcasting, Actions, Bonus Actions | Scimitar, Shortbow, divine focus | Corrected the 2024 Guidance summary. Spell DC, attack bonus, healing, and passive Perception match Wisdom 14 and PB +2. |
| Goblin Warrior | `goblin-warrior.md` | Traits, Actions, Bonus Actions | Scimitar, Shortbow | Clean baseline. Other armor and weapon variants remain a blocker because canon does not specify their mechanics. |
| Green Slaad | `green-slaad.md` | Traits, innate spellcasting, Actions | Bite, Claws, Staff, Hurl Flame | Clean. |
| Hob Gob, the Goblin King | `hob-gob.md` | Traits, Spellcasting, Actions | Jagged Bite, Hooked Cleaver, druidic focus | Corrected HP arithmetic to 178, Regeneration suppression, Multiattack count, and Bite dice. See blocker below. |
| Lizard Mage | `lizard-mage.md` | Traits, Spellcasting, Actions | Bite, Heavy Club, Javelin melee or ranged, Spiked Shield, arcane focus | Clean. Spell DC, attack bonus, and slots match Intelligence 16 and PB +2. |
| Lizard Shaman | `lizard-shaman.md` | Traits, Spellcasting, Actions | Bite, Heavy Club, Javelin melee or ranged, Spiked Shield, druidic focus | Corrected the 2024 Guidance summary. Other spell math is consistent with Wisdom 16 and PB +2. |
| Lizardfolk Fighter | `lizardfolk-fighter.md` | Traits, Actions | Bite, Battleaxe, Javelin melee or ranged, Spiked Shield | Clean. |
| Magma Elemental | `magma-elemental.md` | Traits, Actions | Touch | Removed the invented cold vulnerability and restored Water Susceptibility damage. It intentionally shares the Fire Elemental chassis with Ashari Fire Elemental. |
| Magma Landshark | `magma-landshark.md` | Traits, Actions | Bite, Deadly Leap | Restored both missing 3d6 dice expressions and their average damage in Deadly Leap. |
| Sahuagin Baron | `sahuagin-baron.md` | Traits, Actions | Bite, Claws, Trident as one-handed melee, two-handed melee, or ranged | Clean. |
| Skeleton | `skeleton.md` | Actions | Shortsword, Shortbow | Clean official 2024 source. |
| The Statue | `statue.md` | Traits, Actions | Slam | Restored the missing 6d12 Slam dice that produce the printed average of 43. Preserve CR 12 and 95 HP. |
| Vos'sykriss, the Serpentfolk | `vos-sykriss.md` | Traits, Actions | Scimitar, Bite, Constrict, Petrifying Gaze | Removed the contradictory three-failure note, condition glossary, invented Constrict save Disadvantage, and typo. Preserved the canon two-save Petrifying Gaze and 30-foot range. |
| Wraith | `wraith.md` | Traits, Actions | Life Drain, Create Specter | Corrected HP notation, restored official Life Drain maximum-HP reduction, removed the unfinished Constitution-score homebrew, and restored Create Specter. |
| Zombie | `zombie.md` | Traits, Actions | Slam | Corrected HP to 15 (2d8 + 6), matching Constitution 16. |

## Roster and Completeness Findings

- Restored `goblins.md` as the link-only roster index required by the current one-file-per-monster convention.
- All 31 current monsters have a dedicated authoritative source file.
- All spellcasters include inline spell summaries.
- All sources include CR, XP, and Proficiency Bonus.
- No source now contains a DM Note, room trigger, treasure drop, or Crystal Shard placement.
- Multiple weapon forms are explicit where the same weapon supports them, including tridents, javelins, and quarterstaffs.

## Unresolved Blockers

1. **Hob Gob chassis conflict.** `hob-gob.md` still uses Ben's retained custom header and attack package, while the decision ledger also calls it an official Green Slaad chassis reskin. Those statements cannot both be exact. The audit fixed arithmetic and regeneration text without replacing Ben's header. Ben must choose either the retained Hob Gob numbers or the exact Green Slaad header before this source can be called fully official-stat faithful.
2. **Berhan fixed HP conflict.** The incoming source used 75 HP with `14d8 + 42`, which averages 105 and does not match Constitution 18. The audit changed this to 76 (9d8 + 36), the nearest legal average using the retained Constitution. If 75 is a required published fixed value, Ben must provide the licensed source notation or approve fixed HP without a hit-dice formula.
3. **Goblin Warrior loadout variants.** `../thoughts.md` calls for mixed armor and weapon types, but no canonical variant list or altered AC and attack math exists. Senshi should render only Scimitar and Shortbow until Ben specifies additional loadouts.
