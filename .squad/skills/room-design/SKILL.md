# Room Design (Layout, Connectivity, Pacing)

**Owner:** Laios
**Confidence:** high

## When to use

Use this skill whenever the user asks to:

- Add a new room to the dungeon
- Change connectivity between rooms (corridors, locked doors, secret passages, shortcuts)
- Audit the H-shape layout, pacing, or balance
- Decide where a crystal lives
- Resolve a conflict between two rooms that claim the same space, the same crystal, or the same gear-gate
- Place a rest-eligible safe room

Hand the read-aloud prose to Marcille, the trap/monster mechanics to Chilchuck, the props to Senshi, and the prize/clue impact to Falin.

## Reference order (read before placing anything)

1. [README.md](../../../README.md) — H-shape, zones, 7-crystal exit lock, philosophy
2. [thoughts.md](../../../thoughts.md) — zone assignments and pre-claimed crystal slots
3. [prizes.md](../../../prizes.md) — crystal-to-prize mapping (constrains where each crystal can sit)
4. Existing files in [rooms/](../../../rooms/) — what is already connected to what
5. [.squad/decisions.md](../../decisions.md) — locked layout and balance decisions
6. [.squad/identity/wisdom.md](../../identity/wisdom.md) — design philosophy

## Layout invariants (non-negotiable unless the user rewrites them)

- The map is roughly 5' x 7' Dwarven Forge, H-shaped, with a lava / ruins zone splitting the two halves
- Caves on one side, Stone Dungeon on the other
- Players start locked in separate rooms (the cells). They have to find each other before they can cooperate.
- The exit requires all 7 crystals in the star-lock, in the correct order
- The safest path must not be the most rewarding. The most rewarding must not be the safest.
- The Black Crystal lives in a high-danger optional area, never on the main escape route
- Maximum 3 short rests across the whole run (15 minutes real-time each, 1 HD per rest). Place rest-eligible safe rooms intentionally and rarely.
- Gear-gates are explicit: "this passage needs the iron key from [goblins_lair.md](../../../rooms/goblins_lair.md)," not vague hand-waves.

## Step-by-step

1. Read the request and identify what changes: a new room, a moved crystal, a new corridor, a balance pass.
2. Pull the affected room files. Read what's already there. Do NOT rewrite content you don't need to touch.
3. Sketch the change in terms of adjacencies: which rooms gain a connection, which lose one, which gear is now required to enter where.
4. Run the **conflict checks** below.
5. Write or update the room file using the format below. Keep read-aloud prose to a short placeholder and tag `→ Marcille` if it needs full prose work.
6. If a crystal moves, drop a note in `.squad/decisions/inbox/laios-{slug}.md` so Falin and Marcille pick it up.
7. Tag handoffs explicitly at the bottom of the room file.

## Conflict checks (always run)

Before locking a change, verify:

1. **Crystal uniqueness:** does any other room file claim the same crystal? (`grep -i "{color} crystal" rooms/`)
2. **Gear-gate reachability:** if a passage needs an item, is that item placed in a room the party can reach from the cells without already having it?
3. **Rest budget:** total rest-eligible rooms across the dungeon stay at or under 3. Count them.
4. **Black Crystal placement:** confirm it is NOT on the main escape route and IS behind real lethality.
5. **Crystal order:** the star-lock order must be satisfiable by the clue chain. Coordinate with Falin if you change a crystal's location.
6. **Single source of truth:** if a room file contradicts [README.md](../../../README.md) or [prizes.md](../../../prizes.md), the canon files win. Surface the conflict to the user.

## Room file format (layout half — prose is Marcille, mechanics are Chilchuck)

```markdown
# [Room Name]

> [One-line placeholder read-aloud. Marcille will own the final prose.]

**Zone:** [Caves / Stone Dungeon / Lava Ruins / Cells]
**Connections:**
- North: [room file] [via: door / corridor / secret passage / gear-gate name]
- South: [room file] [via: …]
- (etc.)

**Gear required to enter:** [none, or "iron key from goblins_lair.md"]
**Gear that lives here:** [none, or "iron key, brass figurine"]
**Crystal:** [none, or "Green Crystal"]
**Rest-eligible:** [yes / no — if yes, justify why this is one of the three]

**Features**
- [Concrete physical contents. Hand to Marcille for final prose.]

**DM Notes**
- [Layout rationale. Why this room exists. Which player choice it tests.]
- [Conflict-spotting notes for the rest of the squad.]

---

**Handoffs**
- Read-aloud and DM Notes prose → Marcille
- Encounter / trap mechanics → Chilchuck
- Props and terrain → Senshi
- Crystal / clue chain impact → Falin
```

## Rules

- Never invent a crystal placement that contradicts [prizes.md](../../../prizes.md) without flagging it.
- Never silently move a crystal. Always drop a decision note in `.squad/decisions/inbox/` so Falin and Marcille can react.
- Never add a fourth rest-eligible room.
- Never put the Black Crystal on the main path.
- When in doubt, calibrate up. This dungeon is supposed to kill people.

## Learned from

- [rooms/thecells.md](../../../rooms/thecells.md) — starting-position pattern (players locked apart)
- [rooms/rainbowroom.md](../../../rooms/rainbowroom.md) — ROYGBIV puzzle room as a connectivity hub
- [thoughts.md](../../../thoughts.md) — pre-claimed crystal slots (Red in lava, Purple in Artificer's Lair)
