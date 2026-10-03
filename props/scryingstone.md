# Scrying Stone

The Scrying Stone is the physical crystal reader and touchscreen prop for the eight exit Crystal Shards and the five lesser boon crystals. This is the single reference for both the prop and the clues it reveals. Crystal facts come from [`crystals.md`](../crystals.md); the live clue pages are in [`knoxrpg-netheril-prop/apps/dungeon-runner/src/public/pages/`](knoxrpg-netheril-prop/apps/dungeon-runner/src/public/pages/).

## What is it

A crystal placed on the reader selects a school of magic. A hand held over the motion sensor reveals the crystal's boon and lights the crystal's three related school symbols as touch targets. Tapping a lit symbol opens one clue page.

## What it does at the table

- The first Scrying Stone is in the Portal Room. A second reader is described on the table in D6-A.
- The reader identifies the inserted crystal and shows its name, school, location field, and boon.
- When a hand is present, the crystal's opposing and adjoining school symbols glow and become buttons. Tapping one opens that slot's clue page. The page stays up while the crystal is active; removing the crystal returns the display to idle.
- All eight exit Crystal Shards are required to force the exit Portal open. There is no required placement order.
- Crystal Shards are exit, door, and dungeon-information props. They do not award real-world prizes.

## How the DM uses it

1. Place a configured crystal on the RFID reader.
2. Confirm the screen shows the expected crystal name, school, location field, and boon.
3. Have a player hold a hand over the motion sensor to reveal the boon and the three lit symbols.
4. Let the player tap one of the three lit school symbols to read its clue.
5. Use the GM console to inspect or revise clue pages before the session. The player app refetches a page when tapped, so a text edit does not require a server restart. A change to `server.js` does require a restart.
6. Track each crystal's once-per-game-hour power in the admin app or on a visible table tracker.

## Which symbols each crystal lights

Each crystal lights its opposing school on top and its two adjoining schools on the left and right. The clue in each slot concerns that school's crystal.

| Held crystal (school) | Top symbol (opposing) | Left symbol (adjoining 1) | Right symbol (adjoining 2) |
| --- | --- | --- | --- |
| White (abjuration) | Green Stone | Pink Stone | Red Stone |
| Green (transmutation) | White Stone | Pink Stone | Red Stone |
| Yellow (illusion) | Black Stone | Blue Stone | Purple Stone |
| Blue (conjuration) | Purple Stone | Yellow Stone | Black Stone |
| Purple (divination) | Blue Stone | Yellow Stone | Black Stone |
| Red (evocation) | Pink Stone | Green Stone | White Stone |
| Black (necromancy) | Yellow Stone | Purple Stone | Blue Stone |
| Pink (enchantment) | Red Stone | White Stone | Green Stone |
## How the clues are organized

- A crystal is placed on the reader, and a hand over the sensor reveals the crystal's boon and lights its three related school symbols.
- The three symbols are the crystal's opposing school (shown on top) and its two adjoining schools (left and right). Each symbol concerns that school's crystal.
- Tapping a symbol opens one clue page. Each of the 24 slots holds a different clue, so no clue is ever repeated on another crystal.
- Exactly one clue per crystal is a location clue. There are eight location clues, one for each exit crystal. The other sixteen clues solve puzzles, warn of hazards, or explain how to beat a boss or enemy.
- A clue about a crystal is spread across the three crystals that show its symbol. To learn everything about one stone, you read the three crystals that point to it.

## Crystal index

| Crystal | Color | School | Type | RFID | Where it is found | Boon |
| --- | --- | --- | --- | --- | --- | --- |
| Kyber of Warding | White | Abjuration | Exit key | `00000C00` | Slime Room | Ward Against Ruin |
| Kyber of Shaping | Green | Transmutation | Exit key | `00000C04` | Alchemist Workshop | Burst of Motion |
| Kyber of the Painted Veil | Yellow | Illusion | Exit key | `11000C0A` | Goblin Camp | False Double |
| Kyber of Calling | Blue | Conjuration | Exit key | `00000C0E` | Dwarven Forge / Spider Priestess | Blink Step |
| Kyber of Fate | Purple | Divination | Exit key | `00000C07` | Small Lava/Ruins Room | Twist Fate |
| Kyber of the Striking Hand | Red | Evocation | Exit key | `00000C09` | Eye of the Statue, Lava Room | Crystal Burst |
| Kyber of the Final Door | Black | Necromancy | Exit key | `11000C33` | Cryptex in a book outside the Ruins | Graveward |
| Kyber of the Whispered Word | Pink | Enchantment | Exit key | `00000C05` | Medusa Room, chest past Vos'sykriss | Compel |
| Necrotic Stone | Necrotic | Necromancy | Lesser | `11000C03` | Upper Goblin Tunnels, hidden small chest | Life Siphon |
| Silver Stone | Silver | Conjuration | Lesser | `11000C00` | Treasure chest at the end of the Gauntlet | Crystal Bulwark |
| Wrought Iron Stone | Wrought Iron | Transmutation | Lesser | `11000C06` | R10 Treasure Room | Ironhide |
| Copper Stone | Copper | Divination | Lesser | `00000C0F` | Inside the Man-Eating Plant | Spot the Opening |
| Gold Stone | Gold | Illusion | Lesser | `11000C0B` | Cavern small room, locked chest | Barter Specialist |

## Clues by crystal

Each crystal lists its power, then the three clues it reveals. A clue is the full text shown on the touchscreen, with a short source and what it tells the table.

### White crystal (Abjuration), RFID `00000C00`

**Power, Ward Against Ruin:** When you or a creature within 30 feet makes a saving throw, use your reaction to give that creature advantage on the roll. Usable once per game hour.

1. **Green symbol, location:** "The green stone is in the Alchemist's Workshop."
   - Source: `crystals.md`, "Alchemist Workshop."
   - Meaning: where the green exit crystal is. Retrieving it from the acid is the puzzle clue on the Pink crystal.
2. **Pink symbol, location:** "The pink stone is in a chest in the Medusa Room, in the room past Vos'sykriss the Serpentfolk."
   - Source: `crystals.md`, "Medusa Room. The Chest in the room past Vos'sykriss the Serpentfolk."
   - Meaning: where the pink exit crystal is. Opening the chest is the Serpent's Key clue on the Green crystal.
3. **Red symbol, location:** "The red stone is in the eye of the statue in the Lava Room."
   - Source: `crystals.md`, "Eye of the Statue, Lava Room."
   - Meaning: where the red exit crystal is. The statue fight and lava hazard are on other crystals.

### Green crystal (Transmutation), RFID `00000C04`

**Power, Burst of Motion:** As a bonus action, choose yourself or one willing creature you can see within 30 feet. The target can immediately move up to its Speed without provoking Opportunity Attacks, or immediately make one weapon attack. Usable once per game hour.

1. **Abjuration symbol, location:** "The white stone is in the Slime Room."
   - Source: `crystals.md`, "Slime Room."
   - Meaning: where the white exit crystal is. Dealing with the Giant Slime is the boss clue on the Pink crystal.
2. **Enchantment symbol, puzzle:** "The key to the pink stone's chest hangs around Vos'sykriss's neck. Take it from the serpent to open the chest."
   - Source: `crystals.md`, "The Key is worn around Vos'sykriss's neck."
   - Meaning: solves the pink crystal's locked chest. The key is on the boss, so defeat or pickpocket Vos'sykriss.
3. **Evocation symbol, boss:** "The statue resists acid, fire, lightning, and plain steel, and is immune to cold, poison, and necrotic. It has no simple weakness, so wear it down with magic."
   - Source: `monsters/statue.md`.
   - Meaning: how to fight the statue guarding the red crystal. Bring magic damage; do not hunt for a one-hit weakness.

### Yellow crystal (Illusion), RFID `11000C0A`

**Power, False Double:** When a creature you can see hits you with an attack, use your reaction to create a duplicate of yourself. The attack automatically misses. Usable once per game hour.

1. **Necromancy symbol, location:** "The black stone is inside a cryptex, hidden in a book in the long hall just outside the Ruins."
   - Source: `crystals.md`, "hidden in a book in the long hall just outside the Ruins," inside a cryptex.
   - Meaning: where the black exit crystal is and that it is sealed in a cryptex. The code is on the Blue crystal.
2. **Conjuration symbol, location:** "The blue stone is at the Dwarven Forge, held by the Drider Priestess."
   - Source: `crystals.md`, "Dwarven Forge / Spider Priestess." Statblock in `monsters/drider-priestess.md`.
   - Meaning: where the blue exit crystal is and who guards it. The Drider's weaknesses are on the Purple and Black crystals.
3. **Divination symbol, location:** "The purple stone is in the small lava and ruins room."
   - Source: `crystals.md`, "Small Lava/Ruins Room. Clue with hanging corpse."
   - Meaning: where the purple exit crystal is. Pinpointing it through the hanging corpse is on the Blue crystal.

### Blue crystal (Conjuration), RFID `00000C0E`

**Power, Blink Step:** As a bonus action, teleport yourself or one willing creature within 30 feet to an unoccupied space you can see within 30 feet of the target. Usable once per game hour.

1. **Divination symbol, clue:** "A corpse hangs in the small lava ruins as a marker. Search it, for the clue to the purple stone is left on the body."
   - Source: `crystals.md`, "Clue with hanging corpse."
   - Meaning: the method for finding the purple stone in the ruins. Search the corpse.
2. **Illusion symbol, location:** "The yellow stone is in the Goblin Camp."
   - Source: `crystals.md`, "Goblin Camp."
   - Meaning: where the yellow exit crystal is. The camp boss and defenders are on the Purple and Black crystals.
3. **Necromancy symbol, puzzle:** "The cryptex that holds the black stone opens on five letters. Spell out the word DEATH."
   - Source: `crystals.md`, fixed code "DEATH."
   - Meaning: solves the cryptex holding the black crystal. The cryptex location is on the Yellow crystal.

### Purple crystal (Divination), RFID `00000C07`

**Power, Twist Fate:** When a creature within 30 feet is hit by an attack, use your reaction to make the attacker reroll the attack and use the new roll. Usable once per game hour.

1. **Conjuration symbol, boss:** "The Drider Priestess dreads sunlight. Bright light will blunt her, so bring a daylight source to the Forge."
   - Source: `monsters/drider-priestess.md`, Sunlight Sensitivity.
   - Meaning: a boss weakness for the blue crystal fight. Use a daylight source.
2. **Illusion symbol, boss:** "The goblin king Hob Gob mends his wounds even as you cut him, but acid or fire stops that healing for a round."
   - Source: `monsters/hob-gob.md`, Regeneration halted by acid or fire.
   - Meaning: how to defeat Hob Gob, who holds the yellow crystal's camp. Use acid or fire, then finish him.
3. **Necromancy symbol, cache:** "A lesser necrotic stone is hidden in a small chest at the great tree in the Upper Goblin Tunnels, left by a long-dead wanderer. Look closely to find it."
   - Source: `crystals.md`, "Upper Goblin Tunnels located in a small chest. The chest is hidden," plus Ben's tree and wanderer direction.
   - Meaning: points to the hidden Necrotic lesser stone. A reward clue, not an exit crystal. The `config.yaml` Treasure Goblin entry conflicts with crystals.md; crystals.md is canon.

### Red crystal (Evocation), RFID `00000C09`

**Power, Crystal Burst:** As an action, choose a point within 60 feet. Creatures in a 10-foot-radius sphere make a DC 13 Dexterity save, taking 2d6 fire damage on a failure, or half as much on a success. The bearer chooses which creatures are affected. Usable once per game hour.

1. **Enchantment symbol, boss:** "The mirror trick in the serpent's lair is meant for the snake-head beam weapon, not for Vos'sykriss. Do not rely on it against the boss."
   - Source: `rooms/Dungeon-Left.md`, the mirror applies to the snake-head beam weapon.
   - Meaning: corrects a likely misconception before the Vos'sykriss fight that guards the pink crystal.
2. **Transmutation symbol, method:** "The Alchemist's recipes brew more than one potion. Gather reagents from the cavern goblins and from where the caverns run wet, then carry them back to the tables."
   - Source: `alchemists_workshop.md`, and Berhan's trade with the cavern goblins for reagents.
   - Meaning: how to find ingredients to brew potions. Points at the goblins and the wet caverns without naming exact rooms.
3. **Abjuration symbol, door:** "A barred door cages a hoard in the caverns. It cannot be forced. Match the rune above its keyhole to the key on the dead guard's ring in the cells."
   - Source: Door H at C-12 in `rooms/TheCaverns.md`, and the dead guard's key chain in D10 in `rooms/Dungeon-Left.md`.
   - Meaning: how to open the caged treasure door. Find the rune-matched key on the dead guard.

### Black crystal (Necromancy), RFID `11000C33`

**Power, Graveward:** As a bonus action, give yourself or a creature within 30 feet 1d8 + 2 temporary hit points. They last until the end of combat or until depleted. Usable once per game hour.

1. **Illusion symbol, enemies:** "The Goblin Camp holds a gun-toting artificer and a medicine man who heals the others. Drop the healer first."
   - Source: `thoughts.md` Goblin Camp roster, the Goblin Artificer and the Medicine Man healer.
   - Meaning: a tactical warning for the camp that holds the yellow crystal. Kill the healer first.
2. **Divination symbol, hazard:** "The small lava ruins are old and unstable. Watch for collapsing floor and pockets of flame as you recover the purple stone."
   - Source: `crystals.md` room, "Small Lava/Ruins Room." Atmosphere cue, not a statted trap. Replace if a trap is authored.
   - Meaning: move carefully in the purple crystal's room. Guidance, not a rules trap.
3. **Conjuration symbol, boss:** "The Drider Priestess feels every creature that touches her webs. Burn the strands or step wide of them."
   - Source: `monsters/drider-priestess.md`, the shared-web sense.
   - Meaning: how to approach the Drider at the Forge without being detected.

### Pink crystal (Enchantment), RFID `00000C05`

**Power, Compel:** When a creature within 30 feet starts its turn, use your reaction. It makes a DC 13 Wisdom save. On a failure, the creature must obey a one-word command you give it until the command is complete. It will not harm itself. Usable once per game hour.

1. **Evocation symbol, hazard:** "The lava room's heat and molten channels punish the careless. Keep to solid stone as you pry the red stone from the statue's eye."
   - Source: `crystals.md` room, "Lava Room." Atmosphere cue, not a statted trap. Replace if a trap is authored.
   - Meaning: mind the lava while retrieving the red crystal. Guidance, not a rules trap.
2. **Abjuration symbol, boss:** "The Giant Slime is slow and easy to strike once you have seen it, but never let it engulf you, or it will dissolve you whole."
   - Source: `monsters/giant-slime.md`, slow with Engulf as the danger.
   - Meaning: how to fight the slime that holds the white crystal. Hit it freely but avoid engulf.
3. **Transmutation symbol, puzzle:** "Do not reach into the acid for the green stone. The recipe book on the Alchemist's tables teaches how to drain or neutralize the vat first."
   - Source: `thoughts.md`, the acid-tank puzzle solved with the recipe book.
   - Meaning: the puzzle for safely retrieving the green crystal. The acid is a trap; the recipe book is the solution.
## Lesser crystals

The five lesser crystals share a school with an exit crystal, and the engine keys clue pages by school, so each lesser crystal currently lights the same three symbols and shows the same three clues as the exit crystal of its school:

- Necrotic Stone, necromancy, mirrors the Black crystal.
- Silver Stone, conjuration, mirrors the Blue crystal.
- Wrought Iron Stone, transmutation, mirrors the Green crystal.
- Copper Stone, divination, mirrors the Purple crystal.
- Gold Stone, illusion, mirrors the Yellow crystal.

Making lesser crystals show their own distinct clues requires per-crystal keying by RFID, which is a deeper code change.

## Derivation sources and confidence

- Crystal locations come from the Location column of [`crystals.md`](../crystals.md). Where `config.yaml` disagrees, for example listing the Necrotic, Wrought Iron, and Copper lesser stones as Treasure Goblin purchases, crystals.md is treated as canon.
- Boss and enemy facts come from the relevant files in [`monsters/`](../monsters/) and the Goblin Camp roster in [`thoughts.md`](../thoughts.md). These are canon.
- Puzzle facts, the cryptex word DEATH, the acid-vat recipe book, the serpent's key, the Vos'sykriss mirror, and the caged door key, come from [`crystals.md`](../crystals.md), [`thoughts.md`](../thoughts.md), [`rooms/TheCaverns.md`](../rooms/TheCaverns.md), and [`rooms/Dungeon-Left.md`](../rooms/Dungeon-Left.md). These are canon.
- The tree cache and the long-dead wanderer come from [`To-Do.md`](../To-Do.md), with the wanderer confirmed canon by Ben.
- The two hazard clues, "The Lava Room" and "The Crumbling Ruins," are atmosphere cues reasoned from each room's lava theme in [`crystals.md`](../crystals.md). They are the only clues not tied to a specific statted source, and they should be replaced if real traps are authored for those rooms.

## GM background

### Hidden tree cache, the Necrotic lesser stone

- Located in a hidden small chest at the great tree in the Upper Goblin Tunnels, per [`crystals.md`](../crystals.md).
- A DC 12 Perception check is the current find.
- Left by a long-dead wanderer, canon by Ben's direction.
- Holds the Necrotic lesser crystal and coin. The `config.yaml` entry listing it as a Treasure Goblin purchase conflicts with crystals.md; crystals.md is canon.

### Ingredient trail

- The Alchemist's recipe book brews potions. Reagents are traded by the cavern goblins and gathered where the caverns run wet.
- Berhan traded with the cavern goblins for rare reagents.
- No source assigns harvestable ingredients to specific Caverns rooms. Do not turn webs, slime, moss, water, or fungi into ingredient nodes without a canon ruling.

### Caged Caverns treasure door

- The relevant door is Door H at C-12, not the C3 rune hatch to the Treasure Goblin.
- Door H cannot be picked or breached under the current room rule.
- A rune above its keyhole matches one key on the dead guard's ring in the Dungeon Cell Area. D10 holds the dead guard with a large key chain.
- The specific key's appearance and rune artwork are undefined.

### Boss and hazard facts

- Hob Gob's Regeneration stops for a round after acid or fire damage. [`monsters/hob-gob.md`](../monsters/hob-gob.md)
- The Giant Slime in the Slime Room is slow and easy to hit once noticed, but Engulf is the danger. [`monsters/giant-slime.md`](../monsters/giant-slime.md)
- The Drider Priestess has Sunlight Sensitivity and senses creatures touching her webs. [`monsters/drider-priestess.md`](../monsters/drider-priestess.md)
- The Statue resists acid, fire, lightning, and nonmagical weapons, and is immune to cold, necrotic, and poison. No source gives it a simple vulnerability. [`monsters/statue.md`](../monsters/statue.md)
- The mirror countermeasure in the Serpent Lair applies to the snake-head beam weapon, not to Vos'sykriss. [`rooms/Dungeon-Left.md`](../rooms/Dungeon-Left.md)

## Prop build and setup

- **Material:** Existing Raspberry Pi reader assembly, RFID crystal props, motion sensor, LED ring, and 1920 by 1080 touchscreen behind the carved foam face.
- **Content surfaces:** 24 Markdown clue pages under `apps/dungeon-runner/src/public/pages/`, three per crystal, one for each lit symbol.
- **Quantity needed:** Two reader stations are described in room sources. Confirm whether both are complete hardware units or whether the second is a scenic duplicate before setup.
- **Setup:** Calibrate the foam aperture on the native panel after transport. Test every exit crystal, every lesser crystal, all three lit symbols per crystal, hand detection, removal behavior, and the GM console before doors open.
- **Hazards:** Secure the screen and reader against tipping. Tape or strain-relieve power and sensor cables. Count every small crystal at setup and teardown. Do not place drinks near the reader.
- **Content legibility:** Keep each clue short enough to read without scrolling inside the calibrated safe area.

## Configuration notes and conflicts

- The runtime uses a crystal record's explicit `school` value before its color fallback, so the `config.yaml` school field is the practical authority for which symbols a crystal lights.
- The legacy four-button cross view was removed. The prop uses the crystal view only, and the page lookup keys on the tapped symbol's slot in [`index.html`](knoxrpg-netheril-prop/apps/dungeon-runner/src/public/index.html). The server validates the three slot locations in [`server.js`](knoxrpg-netheril-prop/apps/dungeon-runner/src/server.js).
- [`knoxrpg-netheril-prop/README.md`](knoxrpg-netheril-prop/README.md) still documents an older color table with Yellow as Divination and Orange as Illusion. The active canon and `config.yaml` use Purple as Divination and Yellow as Illusion.
- Some `config.yaml` lesser-crystal locations list Treasure Goblin purchases that conflict with crystals.md. crystals.md is canon.
- `prizes.md` is named as a canon source in team governance but is absent from this checkout. No prize mapping was inferred.

## Resolved by Ben's direction

1. The Scrying Stone reveals dungeon clues, including the tree cache and the C-12 caged door. Each crystal imparts where the other crystals are, how to beat the guarding bosses, and standalone dungeon clues. This overrides the earlier ledger note that the Stone does not reveal treasure.
2. The long-forgotten adventurer who left the tree cache is canon.
3. The ingredient clue is a method hint only. It names the Alchemist's tables and the caverns as sources without assigning harvestable ingredients to specific Caverns rooms.

## Remaining ownership notes

1. Falin owns any later re-sequencing of which clue a crystal reveals in which slot.
2. Marcille owns final polish of the clue pages.
3. Chilchuck owns any new activation cost, check, limited use, failure state, or clue-unlock mechanic, and any real trap that would replace the two hazard clues.
4. Laios owns any change to room placement, door geography, or route.
5. The specific cage key's appearance and rune artwork are still undefined.

