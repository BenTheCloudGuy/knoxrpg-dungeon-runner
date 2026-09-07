# Prize Item Card & Crystal Exit Economy

**Owner:** Falin
**Confidence:** high

## When to use

Use this skill whenever the user asks to:

- Set or change the real-world prize list in [prizes.md](../../../prizes.md)
- Price prize Item Cards for Treasure Goblin purchases
- Place, move, or audit a prize Item Card in the dungeon
- Audit whether prize cards, coins, and Treasure Goblin prices match the event budget
- Move a Crystal Shard from one room to another, always coordinate with Laios
- Audit the seven Crystal Shards needed for the star-lock exit puzzle
- Check color-locked door logic that depends on Crystal Shards
- Define rest tracking and death-out flow at the table
- Onboard players about death, rest, prize cards, Treasure Goblins, and the exit crystals

Hand read-aloud text to Marcille for final voice. Hand physical prize cards, crystal props, and Scrying Stone prop details to Senshi. Hand crystal placement on the map to Laios. Hand the encounter guarding a crystal or prize card to Chilchuck.

## The crystal system (canon - do not contradict)

There are two separate economies now. Keep them separate in every file.

### Prize Item Card economy

- [prizes.md](../../../prizes.md) is the source of truth for the real-world prize list and listed prices.
- Each real-world prize is represented by a prize Item Card.
- Players claim a real-world prize by finding its prize Item Card in the dungeon or buying it from a Treasure Goblin with in-dungeon gold at the listed price.
- No prize is tied to any crystal.
- The 2024 Core Rulebook Set + GM Screen is the highest-value prize card. It has no crystal role.
- Treasure Goblin stock, exact card placement, and any event-specific buyout limits stay TBD until Ben locks them.

### Crystal exit-prop economy

- Seven Crystal Shards total: **Green, White, Yellow, Blue, Purple, Red, Black**.
- All seven Crystal Shards must be placed in the star-lock in the correct order to open the escape portal.
- Crystal Shards also gate color-locked doors.
- Crystal Shards are dungeon props for escape routing, door access, and the final exit puzzle.
- Crystal Shards are never prize gates.
- The Black Crystal is one of the seven exit crystals. It has no prize role and no grand-prize rule.
- Dead PCs leave crystals, prize cards, coins, and gear on their bodies. Survivors can loot them if they can reach the body.
- No long rests. Three short rests total. 15 real-time minutes each. 1 HD per rest.

## Reference order

1. [prizes.md](../../../prizes.md) - real-world prize table and listed prices
2. [README.md](../../../README.md) - death rules, rest rules, event premise, exit puzzle context
3. [thoughts.md](../../../thoughts.md) - Treasure Goblin notes, coin pool, crystal door notes, rough prize-card pricing notes
4. Room files in [rooms/](../../../rooms/) - confirm prize cards and Crystal Shards are actually placed where the table plan says they are
5. [.squad/decisions.md](../../decisions.md) - locked economy decisions, unless superseded by a newer Ben decision note
6. [props/scryingstone.md](../../../props/scryingstone.md) - prop spec only. Do not use it to create a crystal-to-prize mapping.

## Integrity rules

Run the right audit for the thing being changed.

### Prize Item Card audit

1. Open [prizes.md](../../../prizes.md). Confirm every prize card points to one existing table row.
2. Confirm the listed price, prize name, and description stay intact unless Ben directly changes them.
3. Confirm each prize card is either placed in the dungeon or available from a Treasure Goblin, if Ben has locked that event plan.
4. Confirm no prize card requires a Crystal Shard to claim.
5. If the Treasure Goblin price or stock is unclear, mark it TBD and ask Ben before locking it.

### Crystal exit audit

1. Confirm there are exactly seven Crystal Shards: Green, White, Yellow, Blue, Purple, Red, Black.
2. Confirm all seven are reachable before the final star-lock.
3. Confirm the final star-lock ordering is recorded in the relevant puzzle file or decision note once Ben locks it.
4. Confirm color-locked doors name the correct Crystal Shard color and do not imply prize ownership.
5. If a crystal move breaks room flow, write a `.squad/decisions/inbox/falin-crystal-exit-{slug}.md` note and tag Laios.
6. If Scrying Stone text is involved, it may point to door logic, navigation, or star-lock information. It must never reveal a prize tied to a crystal.

## Step-by-step (for any economy or crystal change)

1. Read the change request. Identify whether it affects prize Item Cards, Treasure Goblin pricing, Crystal Shards, color-locked doors, or rest/death rules.
2. Pull [prizes.md](../../../prizes.md) for prize-card changes, and pull the affected room file for placement changes.
3. Apply only the requested change. Keep prize cards and Crystal Shards decoupled.
4. If a prize card moves rooms, drop a decision note tagging Laios for room placement and Chilchuck if an encounter guards it.
5. If a Crystal Shard moves rooms, drop a decision note tagging Laios for route flow and Marcille if read-aloud text must change.
6. If Scrying Stone wording changes, drop a decision note tagging Senshi for the prop and Marcille for final voice.
7. Run the matching integrity audit above.
8. Recompute the prize budget if a listed price, purchase quantity, or Treasure Goblin buyout rule changes.

## Prize budget format

Track the real-world prize budget per event. Update when listed prices, quantities, or buyout rules change.

```markdown
## Prize Budget (Vault of the Starving Mind - Event YYYY-MM-DD)

| Prize Item Card | Listed Price | Quantity | Source | Status |
| --- | ---: | ---: | --- | --- |
| 4pcs Fantasy Sword Bookmarks | $7.59 | 1 | prizes.md | locked |
| Dungeons & Dragons 2024 Core Rulebook Set + GM Screen | $154.95 | 1 | prizes.md | locked |
| **Total** | **TBD** | **TBD** | | recompute from prizes.md |
```

If Ben wants a separate in-dungeon GP display for cards, record the conversion rule before printing or editing cards.

## Rest tracking (table-time procedure)

The DM enforces this; Falin defines it. Per event:

- **Long rest:** none. Players cannot trigger a long rest in this dungeon, period.
- **Short rest:** maximum three per table for the whole run. Each is 15 real-time minutes, not in-fiction time. Each PC may spend 1 HD per rest.
- **Where:** only in rest-eligible rooms. Laios marks these in room files. If the party tries to rest elsewhere, Xhal'theris interrupts.
- **Tracking:** the DM checks a box on a printed rest card when one is taken. Senshi owns the physical prop. When three are gone, the party is on its own.

## Death-out flow (player onboarding)

Brief the players on this before the dungeon starts. Honest expectations are the contract.

1. PCs are level 3, 40 HP cap, no resurrection in-dungeon.
2. At 0 HP, normal death saves apply. If the PC dies, the player is **out of the dungeon** for the rest of the event.
3. Gear, coins, prize Item Cards, and Crystal Shards stay on the body. The body stays where it falls. Other PCs can loot it if they can reach it.
4. Real-world prizes are awarded from prize Item Cards that exit with the surviving party or are bought under the Treasure Goblin rules Ben locked for that event.
5. Crystal Shards matter for escape only. They never award real-world prizes.

## Rules

- Never tie a prize to a crystal.
- Never describe the Black Crystal as a grand prize.
- Never change a prize table row, listed price, or quantity without Ben's explicit OK.
- Never silently move a Crystal Shard between rooms. Always drop a decision note for Laios, and Marcille if room text must change.
- Never write final in-world clue text yourself. Stub the mechanic, then tag Marcille.
- Never set the encounter that guards a crystal or prize card. Tag Chilchuck.
- Always run the matching integrity audit after any prize-card or crystal change.

## Learned from

- [prizes.md](../../../prizes.md) - real-world prize table and listed prices
- [README.md](../../../README.md) - exit puzzle, death, and rest rules
- [thoughts.md](../../../thoughts.md) - Treasure Goblin, coin, and color-lock notes
- [props/scryingstone.md](../../../props/scryingstone.md) - decoder prop, with no crystal-to-prize mapping