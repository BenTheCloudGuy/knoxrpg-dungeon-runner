# Sphere of Annihilation Trap

**Room Type:** Lethal Puzzle Room / Minesweeper-in-the-Dark
**Reward:** TBD (suggested: Black Crystal — fits "highly dangerous optional area")
**Primary Threat:** Anchored Spheres of Annihilation, push-traps, and the spheres' tendency to double in size when touched
**Solution:** Find the single safe path through the room without being shoved into a sphere

## The Setup

A sealed room, ~30 ft × 40 ft, divided into a 5 ft grid. The whole room is filled with magical Darkness — darkvision does not work, normal light dies a foot from its source. Inside, multiple anchored Spheres of Annihilation occupy most of the grid squares. One winding safe path runs from the entrance to the exit. The spheres do not move on their own.

Players have to cross blind, find the path, and survive the traps embedded in it.

## Room Description (Read Aloud)

> Your torches light about a foot ahead — past that, nothing. The floor under your boots is flat, black slate. The air is cold and still.

Do not describe the spheres, the runes, the path, or anything else. Let the players investigate.

## Finding the Path

Three layered detection methods. Let players combine them however they like.

### 1. Probing

Anything thrown or pushed into a sphere is annihilated with a soft *pop*. A 10 ft pole, coins, pebbles, torches, rations — all valid. Each probe maps one square. Slow but reliable. Encourage scavenging cheap consumables from earlier rooms.

### 2. Minesweeper Runes

Every safe square has a hidden glyph on the floor showing the number of spheres in its 8 adjacent squares. Players can:

- Feel the glyph by touch — Investigation DC 12, costs an action, requires being on the square.
- Reveal it with a *Light* cantrip cast directly on the floor (light dies in the air but touches the rune).
- Sense it with *Detect Magic* (faint ping per rune).

Once a number is known, players can deduce adjacent squares like real Minesweeper. Smart parties triangulate.

### 3. The Hum

Each sphere emits a low arcane hum. Perception DC 14 to pinpoint a sphere within 5 ft. With clusters of spheres, the hum becomes a wash — DC 18.

## The Push-Traps

Along the safe path are pressure plates and rune triggers. They are unavoidable — the path goes through them. Each forces a save to resist being shoved sideways. Pick 3-5 of the following to place along the path:

- **Gust Plate:** DC 14 Strength save or shoved 5 ft in a fixed direction.
- **Telekinetic Pulse:** DC 14 Dexterity save or shoved 5 ft toward the nearest creature.
- **Grasping Hand:** DC 15 Strength save or dragged 5 ft in a chosen direction.
- **Tilt Tile:** DC 14 Dexterity save or slide 10 ft along the tilt.
- **Whisper:** DC 14 Wisdom save or take an extra 5 ft step in a random direction on your next turn (delayed trigger).

Some plates are obvious (a faint visible rune on the safe tile — players can see it once they're on the square and choose to step or stop). Some are hidden — Investigation DC 15 to spot before stepping.

If shoved sideways, the destination is almost certainly a sphere.

## The Doubling Mechanic

Spheres start as 5 ft diameter — one grid square.

Any time anything contacts a sphere — a probe, a creature, a thrown object, a spell, anything:

1. **The sphere doubles in diameter.** Its footprint on the grid quadruples:
   - **First doubling:** 5 ft → 10 ft. Footprint goes from 1 square (1×1) to **4 squares (2×2)**.
   - **Second doubling:** 10 ft → 20 ft. Footprint goes to **16 squares (4×4)**.
   - **Third doubling:** 20 ft → 40 ft. Footprint goes to **64 squares (8×8)**. At this size a single sphere can swallow most of the room.

2. **Position the new footprint** centered on the original anchor square, biased toward the direction of contact. If a creature touched the sphere from the north, the 2×2 (or 4×4) extends northward — the sphere grows *into* the thing that touched it.

3. **Anything inside the new footprint is annihilated** — creatures, items, light sources, the rune glyphs underfoot. No save. No damage roll. Partial annihilation rules apply (see *Death and Annihilation* below).

4. **Spheres cannot consume other spheres.** If the new footprint overlaps another sphere's square, that sphere is **pushed** 1 square directly away from the doubling sphere's center per square of overlap.
   - If the pushed sphere's destination is empty, it relocates there.
   - If the destination contains another sphere, that sphere is pushed too. The push **cascades** in a row until a pushed sphere lands in an empty square.
   - **Pushed spheres do NOT double.** They just move. Only spheres that are *directly contacted* double.
   - Any creature or object in the path of a sliding sphere is annihilated as the sphere passes through their square.

5. **Doubled spheres stay doubled.** They never shrink back. The room only gets worse.

One bad shove can wipe a 2×2 chunk of clustered players, invalidate the rune-numbers nearby, and shove a row of spheres across what used to be the safe path. A second doubling on an already-grown sphere is catastrophic — the 4×4 footprint can eat a quarter of the room in a single moment.

## The Weave Pulse

Every time a sphere doubles, every creature in the room feels the pulse. No save. No damage. It is a sensory signal only — the DM's tool for communicating that the room state has changed.

> You feel it more than hear it. A deep, bone-rattling toll struck through your chest, the way a great bell would feel if you were close to it. It has your hair standing on end. The Darkness grows darker for a heartbeat, then snaps back. A taste like old copper rises in your mouth.

Only the sphere that was directly touched produces a pulse. Spheres that are merely *pushed* by another sphere's growth do not trigger pulses — they are mechanically displaced, not contacted. So a single doubling that shoves five spheres across the room is still only **one** pulse.

If multiple spheres are touched in the same round (two probes at once, a push-trap that shoves several PCs into different spheres simultaneously, etc.), multiple pulses fire in quick succession. Just let each one land — "Again." "Again." "Again."

Casters specifically also feel a "tear" — a thread they didn't know they were holding goes slack. They know, instantly, that a piece of the Weave has just come undone.

### Outside the Room

Other PCs in other parts of the dungeon feel a fainter version. Xhal'theris uses it as a narrative beat:

> *"Ahh. The Pattern just lost a stitch. How careless of you."*

On a chain:

> *"Oh. Oh, my. So many threads. Plucked all at once. Tell me, little morsels — is anyone still standing?"*

## Death and Annihilation

This is a permadeath dungeon. The room respects that.

**Anything that touches a sphere is annihilated. No save. No damage roll. It just ceases to exist.**

This applies to whatever crosses into the sphere — not the whole creature, just the part that touched it.

- A hand goes in → the hand is gone.
- An arm goes in → the arm is gone.
- A leg, a foot, a torso, a head → gone. If it was load-bearing or vital (head, torso, both legs), the character is dead and fully annihilated.
- An object held or worn on the lost part — also gone.

The sphere takes the part cleanly, but the body it was attached to is not clean. The flesh, blood, and bone that used to connect to the missing part are still there, raw and exposed.

### Whole-Body Annihilation

If the character is destroyed entirely (full body contact, full body caught in a doubling, etc.):

- **Annihilated characters cannot be raised.** *Revivify, Raise Dead, Resurrection, True Resurrection* — none of it works. The Weave does not remember them.
- There is no body to loot. No gear to recover. Everything they were carrying is un-made.
- *Speak with Dead* targeting an annihilated PC fails — there is no soul to call.

### Partial Annihilation

If only a body part is lost, the character lives — but they are bleeding badly from the exposed wound.

- The character takes **1d4+1 damage at the start of each of their turns** from blood loss.
- The bleed continues until the wound is treated. Treatment options:
  - **Healer's Kit:** action to apply, stops the bleed.
  - **Medicine check:** DC 13, action to perform, stops the bleed.
  - **Any healing spell** (including *Cure Wounds, Healing Word,* even *Spare the Dying*): heals normally AND stops the bleed.
  - **Improvised:** cloth, rope, belt as a tourniquet — DC 15 Survival or Medicine, stops the bleed but does not heal.
- A character at 0 HP from bleed-out goes unconscious normally and starts death saves. If they bleed again on their next turn, they take 1d4+1 damage instead of rolling — which counts as taking damage at 0 HP (one automatic death save failure, two if it was a critical-range result of 4-5).
- *Regenerate, Heal,* and similar restorative magic stops the bleeding and stabilizes the wound, but **does not restore the missing part.** The Weave has no record of it ever existing — there is nothing to restore.
- Mundane and magical prosthetics still work (peg leg, hook, etc.), but the dungeon does not provide these. Players have to improvise.

Mechanical effects of permanent loss are left to GM discretion. Suggested defaults:

- **Lost hand:** cannot wield a two-handed weapon, cannot use a shield on that side, somatic components only possible if another hand is free.
- **Lost arm:** as above, plus disadvantage on Athletics checks involving climbing or grappling.
- **Lost foot or leg:** speed halved, disadvantage on Acrobatics and Dex saves involving balance.

### Other Deaths in the Room

This room can also kill characters by ordinary means — a missed spell hits an ally, a push-trap shoves someone into a wall at speed, the party turns on each other in a panic, a partial-annihilation victim bleeds out before they can be patched up. Characters who die in this room **without their body being annihilated** are normal corpses. They can be looted. They can be raised, if the party has the resources.

Only sphere contact triggers annihilation. Everything else — including bleeding to death from a sphere wound — leaves a body behind.

## Solving the Room

Reach the exit on the far side. The Darkness lifts as the door closes behind the party. They can look back at the carnage — which spheres grew, where the path used to be, what is left of anyone who didn't make it. Bodies of the annihilated are simply gone.

## Reward

Whatever sits at the exit should justify the run. Strong candidates:

- **Black Crystal** — fits the README's "highly dangerous optional area" criteria.
- A magic item the dungeon was hiding here precisely because the room is unsurvivable.
- A scroll of *Daylight* or *Dispel Magic* — ironic given the room, useful elsewhere.

## Running for 8-12 Players

- The party will move single file. Bottlenecks are natural.
- Lead PC takes all the discovery risk.
- Trailing PCs have to remember the path exactly — a misstep deletes them.
- Communication in the dark is hard. Players will yell positions across the table. That is the room working as intended.
- A push-trap that catches a cluster of PCs can wipe multiple characters in one save.
- Encourage splitting up only if they can communicate — otherwise nobody behind the lead knows the path.

## GM Notes

- This room should kill someone. Probably more than one. Do not soften it.
- The Weave Pulse is your most important tool — use it every time a sphere is touched, so the players always know the map has changed.
- Counterspell, Dispel Magic, and Antimagic Field do **not** stop the spheres or the doubling. The spheres are not a spell — they are physical objects. The Darkness *is* a spell, but it was cast at high enough level (or by Xhal'theris directly) that dispelling it requires DC 19+ checks at minimum, and dispelling it doesn't help — see below.
- If the party dispels the Darkness, they can finally see the spheres. But the rune glyphs vanish with the magic. They lose their navigation system. The path is still there, but they have to eyeball it the rest of the way. Some parties will take the trade; some won't.
- **The Darkness is the gift.** Make sure that lands when they figure it out.
- Strongly recommend pre-designing the grid before the session: place spheres, mark the path, place push-traps, and pre-calculate the rune numbers. Do not try to design it at the table.

## Xhal'theris Flavor (Drop in as Needed)

On entry:

> *"Walk softly, little morsels. The dark is full of teeth, and I have given them no eyes to see you with — only patience."*

On the first probe:

> *"Mmm. Yes. That one was hungry."*

On a sphere doubling:

> *"Oh, very good. Make it grow. The Weave does so enjoy losing its threads."*

When a PC is annihilated:

> *"And now there are fewer of you. The Pattern won't even know to miss them."*
