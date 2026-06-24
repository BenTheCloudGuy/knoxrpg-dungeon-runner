# Crystal Economy & Clue Chain

**Owner:** Falin
**Confidence:** high

## When to use

Use this skill whenever the user asks to:

- Set or change a crystal's prize tier in [prizes.md](../../../prizes.md)
- Move a crystal from one room to another (always coordinate with Laios)
- Write or revise a Scrying Stone clue
- Audit the clue chain end-to-end (does every clue point to a real, placed crystal?)
- Set the gift card budget or rebalance prize values
- Define rest tracking and death-out flow at the table
- Onboard players (the pre-game briefing about death, rest, and the prize system)

Hand the read-aloud text of a clue to Marcille for final voice. Hand the physical Scrying Stone prop spec to Senshi. Hand crystal *placement on the map* to Laios. Hand the encounter guarding a crystal to Chilchuck.

## The crystal system (canon — do not contradict)

- Seven crystals total: **Green, White, Yellow, Blue, Purple, Red, Black**
- All seven must be placed in the star-lock in the correct order to open the exit
- **Green Crystal:** $40 Potato Head Beholder (locked in canon, [prizes.md](../../../prizes.md))
- **Black Crystal:** $150 GOB Gaming Store gift card (grand prize, locked). MUST sit in a high-danger optional area, NEVER on the main escape route.
- **White, Yellow, Blue, Purple, Red:** `$$$ ???` placeholders in [prizes.md](../../../prizes.md). Resolving these is Falin's job, in conversation with the user.
- Dead PCs leave crystals on their bodies. Survivors can loot them. This is intentional and visible to players from the start.
- No long rests. Three short rests total. 15 real-time minutes each. 1 HD per rest.

## Reference order

1. [prizes.md](../../../prizes.md) — the canonical crystal table and prize tiers
2. [README.md](../../../README.md) — death rules, rest rules, prize philosophy
3. [thoughts.md](../../../thoughts.md) — pre-claimed crystal slots (Red in lava, Purple in Artificer's Lair)
4. Room files in [rooms/](../../../rooms/) — confirm crystals are actually placed where prizes.md says they are
5. [.squad/decisions.md](../../decisions.md) — locked economy decisions
6. [props/scryingstone.md](../../../props/scryingstone.md) — the decoder prop spec

## Clue chain integrity rule

Every Scrying Stone clue must point unambiguously to the **room** (or a distinctive feature in a room) where the next crystal lives. The chain is the spine of the dungeon — break it and players grind aimlessly.

The audit procedure:

1. Open [prizes.md](../../../prizes.md). For each crystal, copy the clue text.
2. For each clue, open the target room file. Confirm the crystal actually lives there.
3. Confirm the clue points to a feature that is actually in the room (a door, a statue, a body, a brand). Marcille writes that feature in the read-aloud — coordinate.
4. Confirm the room is *reachable* without the crystal it contains (gear-gates, locked doors). If not, raise to Laios.
5. If any link is broken, write a `.squad/decisions/inbox/falin-clue-chain-{slug}.md` and tag Laios + Marcille.

## Step-by-step (for any crystal-touching change)

1. Read the change request. Identify which crystal(s) are affected.
2. Pull [prizes.md](../../../prizes.md), the affected room file(s), and the Scrying Stone clue for that crystal.
3. Apply the change to [prizes.md](../../../prizes.md).
4. If the crystal moved rooms, drop a decision note tagging Laios (the room layout) and Marcille (the new room's read-aloud needs the clue feature).
5. If the clue text changed, drop a decision note tagging Marcille for final voice pass.
6. Run the **clue chain integrity** audit (above) on at least the affected crystal and its neighbors in the chain.
7. Recompute the **prize budget** (below) if a tier value changed.

## Prize budget format

Track the budget per event. Update when a tier changes.

```markdown
## Prize Budget (Vault of the Starving Mind — Event YYYY-MM-DD)

| Crystal | Prize | Value (USD) | Source | Status |
| --- | --- | --- | --- | --- |
| Green  | Potato Head Beholder | $40  | already purchased | locked |
| White  | ??? | ??? | ??? | unresolved |
| Yellow | ??? | ??? | ??? | unresolved |
| Blue   | ??? | ??? | ??? | unresolved |
| Purple | ??? | ??? | ??? | unresolved |
| Red    | ??? | ??? | ??? | unresolved |
| Black  | GOB Gaming Store gift card | $150 | to purchase | locked |
| **Total** | | $190 + 5 unresolved | | |
```

## Rest tracking (table-time procedure)

The DM enforces this; Falin defines it. Per event:

- **Long rest:** none. Players cannot trigger a long rest in this dungeon, period.
- **Short rest:** maximum three per table for the whole run. Each is 15 real-time minutes (not in-fiction time). Each PC may spend 1 HD per rest.
- **Where:** only in rest-eligible rooms (Laios marks these in room files). If the party tries to rest elsewhere, Xhal'theris interrupts.
- **Tracking:** the DM checks a box on a printed rest card (Senshi prop) when one is taken. When three are gone, the party is on its own.

## Death-out flow (player onboarding)

Brief the players on this BEFORE the dungeon starts. Honest expectations are the contract.

1. PCs are level 3, 40 HP cap, no resurrection in-dungeon.
2. At 0 HP, normal death saves apply. If the PC dies, the player is **out of the dungeon** for the rest of the event.
3. Crystals stay on the body. The body stays where it falls. Other PCs can loot.
4. Dead players keep their crystal share if their team escapes — only if their team escapes. Confirm this rule with the user before each event.
5. Prizes are awarded after the run, based on which crystals exited the dungeon with the surviving party.

## Rules

- Never change Green or Black Crystal prize tiers without the user's explicit OK.
- Never silently move a crystal between rooms. Always drop a decision note for Laios and Marcille.
- Never write in-world clue text yourself (final voice). Stub the clue, tag Marcille.
- Never set the encounter that guards a crystal. Tag Chilchuck.
- Always run the clue chain audit after any crystal-touching change. Always.

## Learned from

- [prizes.md](../../../prizes.md) — canonical crystal table
- [props/scryingstone.md](../../../props/scryingstone.md) — the decoder prop
- [README.md](../../../README.md) — death and rest rules
