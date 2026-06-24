# The Chess Hall (Légal's Mate)

**Room Type:** Puzzle / Combat Encounter
**Reward:** *(crystal/treasure TBD — slot for whichever crystal this room is gated by)*
**Primary Threat:** A live-action chess match where every captured square is a real fight, and a wrong move pulls the entire board against the party
**Solution:** Recognize Légal's Mate, sacrifice the Queen, and force checkmate in 3 moves

![Chess Hall](../images/rooms/chess_puzzle.png)

## Physical Setup

The board is built from **64 individual floor tiles, painted in alternating black and white** to form a standard 8×8 chessboard.

- **Tile count:** 64 tiles total — 32 black, 32 white.
- **Tile size:** Each tile is one **standard 1" combat grid square** (or 5 ft in-fiction). Sized so that any 3D-printed mini sits cleanly inside a single square.
- **Orientation:** Standard chess orientation — **the bottom-right corner square (from each player's view) must be white** ("white on right"). Verify before play.
- **Color scheme:** Flat matte black and matte white work best — glossy paints catch table lights and obscure pieces. A thin dark border around each tile (sharpie or fineliner) helps the grid read clearly on camera/photo.
- **Optional:** Etch or paint algebraic notation along the edges (a–h along one side, 1–8 along the other) on the GM's side only. This lets the GM call moves out loud without having to count squares.
- **Storage:** Tiles can be magnetized or velcroed to a backing board for transport, or laid loose on the table during play.
- **Reuse:** Once built, the same tile set can be used for any future chess-puzzle room or for any encounter that wants a clean gridded floor.

## Room Description

A vaulted hall whose floor is a **massive 8×8 chessboard**, each square roughly **5 ft × 5 ft** (standard combat grid — one square = one move on the board, one space in combat). The squares are polished obsidian and bone-white marble. The walls and ceiling are lost in darkness above; only the board is lit, from below, by a cold green glow seeping up through the cracks between squares.

At the far end (the White side, rank 1) stand the **enemy pieces** — fully arrayed, motionless, eyes glittering. At the near end (the Black side, rank 8) stand the **friendly pieces**, also motionless, but with several **empty squares** waiting.

**Read Aloud (on entry):**

> The chamber opens into a great hall, and the floor *is* a chessboard. Each square is wide enough to stand on, each rank a battle line. At the far end, an army waits — pale knights on pale horses, a crowned king and queen in alabaster, bishops with their hands folded in prayer, and pikemen in white tabards staring across at you with eyes that do not blink.
> Your own side of the board is set the same — but several squares are empty. The pieces that should stand there are missing.
> A voice slides through the air like oil on water.
> *"Ah. Pieces. I am missing pieces. Stand on the empty squares, little morsels, and the game may begin. I do so love an opening. So full of promise. So full of mistakes."*
> Behind you, stone slabs grind across the doorway. The exit is sealed until the match ends.

## The Setup

The board is set to **move 5 of Légal's Mate**, with both sides having already played. **It is now White's turn.** Every piece except the ones listed under *Player Roles* is present.

**Position (standard algebraic):**

| | a | b | c | d | e | f | g | h |
|---|---|---|---|---|---|---|---|---|
| **8** | ♜ | ♞ | . | ♛ | ♚ | ♝ | . | ♜ |
| **7** | ♟ | ♟ | ♟ | . | . | ♟ | ♟ | ♟ |
| **6** | . | . | ♞ | ♟ | . | . | . | . |
| **5** | . | . | . | . | ♟ | . | . | ♝ |
| **4** | . | . | ♗ | . | ♙ | . | . | . |
| **3** | . | . | ♘ | . | . | ♘ | . | ♙ |
| **2** | ♙ | ♙ | ♙ | ♙ | . | ♙ | ♙ | . |
| **1** | ♖ | . | ♗ | ♕ | ♔ | . | . | ♖ |

**How the position was reached (for the GM):**
`1.e4 e5  2.Nf3 Nc6  3.Bc4 d6  4.Nc3 Bg4  5.h3 Bh5??`

Black's last move (Bh5) was the fatal mistake. White is about to crush.

## The Trap: Légal's Mate (the forced solution)

White must play this exact 3-move sequence to win:

1. **White: Nxe5!** — The Knight on f3 captures the pawn on e5. *Looks insane* — it appears to lose the Queen to `...Bxd1`. It does not.
2. **Black: Bxd1??** — Black greedily captures the White Queen on d1. (Black's only "principled" alternative, `...Nxe5`, also loses to `6.Qxh5` — see *Alternate Black Responses* below.)
3. **White: Bxf7+** — The Bishop on c4 captures the f7 pawn with check. The Black King is forced to e7 (only legal square).
4. **Black: Ke7** — forced.
5. **White: Nd5#** — The Knight on c3 hops to d5. **Smothered checkmate.** The King has no escape — his own pieces seal his fate.

**The Queen sacrifice is the soul of the puzzle.** Players must *trust* that giving up their Queen wins the game.

## Player Roles

The players are the **missing White pieces.** Assign one PC per square. With 8–12 players, use these slots (the four starred roles are *mandatory* — they execute the solution):

| Slot | Square | Piece Type | Role in Solution | Mini |
|------|--------|------------|------------------|------|
| **★ Knight (f3)** | f3 | Knight | **Plays Nxe5 and Nd5#** — the hero of the puzzle | Mounted Knight |
| **★ Bishop (c4)** | c4 | Bishop | **Plays Bxf7+** — the second strike | Cleric |
| **★ Knight (c3)** | c3 | Knight | **Delivers checkmate at d5** | Mounted Knight |
| **★ Queen (d1)** | d1 | Queen | **Dies for the win** — the noble sacrifice | Warrior Queen |
| King (e1) | e1 | King | Commands the board. If killed, game over. | Warrior King |
| Bishop (f1) | f1 | Bishop | Cleric, backline support | Cleric |
| Rook (a1) | a1 | Rook | Castellan with tower shield | Tower-shield Castellan |
| Rook (h1) | h1 | Rook | Castellan with tower shield | Tower-shield Castellan |
| Pawn (e4) | e4 | Pawn | Forward — exposed but key center | Pike Man-at-Arms |
| Pawn (d2 / f2 / etc.) | as needed | Pawn | Backline | Pike Man-at-Arms |

**For groups of 8:** Use the four starred roles plus the King, both Rooks, and one Pawn.
**For groups of 12:** Use all of the above plus three additional Pawns.

The remaining White pieces are **NPC-controlled by Xhal'theris,** but they will only move when the position demands it (they do not act on their own initiative).

## Turn Structure

The game alternates: **White (players) → Black (Xhal'theris) → White → Black.** Each chess move resolves in three steps:

1. **Decision Phase.** The party huddles and proposes White's move. They have **60 seconds** to declare (use a real timer at the table — pressure is the point). If they fail to declare in time, treat it as the worst legal move and Xhal'theris cackles.
2. **Move Phase.** The PC playing the chosen piece physically walks to the new square. If that square is occupied by an enemy piece, it triggers **Capture Combat** (see below).
3. **Response Phase.** Xhal'theris plays Black's reply *immediately* from the script. If Black's move captures a White piece (whether NPC or PC), it triggers Capture Combat in the opposite direction.

## Capture Combat

When a piece captures another, they fight a **single round of real combat on that square.** This is not abstract — dice are rolled.

- **Initiative:** The attacker (the piece making the capture) goes first.
- **Attacker wins** (reduces defender to 0 HP within that round): the capture stands, the defender is killed/removed from the board, the attacker takes that square.
- **Defender survives the round:** The capture is *blocked*. The attacker is shoved back to its original square, the defender lives, and the chess move is *undone.* This counts as an illegal move — see *Wrong Moves Have Teeth*.

**Stat blocks (suggested, scale to party):**

| Piece | AC | HP | Attack | Damage |
|-------|----|----|--------|--------|
| White/Black Pawn | 14 | 18 | Pike +4 | 1d8+2 piercing |
| White/Black Knight (mounted) | 16 | 45 | Lance +6 | 2d6+3 piercing, **trample** 1d6 bludgeoning |
| White/Black Bishop (cleric) | 15 | 38 | Mace +5 | 1d8+3 + 1d6 radiant; **Bless** 1/encounter |
| White/Black Rook (castellan) | 18 | 60 | Warhammer +6 | 1d10+4 bludgeoning; **Sentinel** reaction |
| White/Black Queen | 17 | 75 | Greatsword +7 | 2d10+4 slashing, attacks twice |
| White/Black King | 18 | 90 | Greatsword +7 | 2d10+5; **Royal Guard** (allies adjacent get +2 AC) |

**Important:** When the script calls for the **White Queen to be captured at d1**, the player playing the Queen *must lose that combat* for the puzzle to resolve. Brief the player privately ahead of time, or let them fight honestly — losing here is the *correct* outcome. (If they win, the puzzle breaks; Xhal'theris recovers by playing `6.Qxh5` instead and the party fights on with a much harder position. See *If the Queen Survives*.)

## Wrong Moves Have Teeth

If the party plays *any move other than the one in the script* on their turn:

- **First wrong move:** Xhal'theris responds with a **punishing tactical reply** — the strongest Black move from that position. One White piece is captured (Capture Combat triggers, defender is at disadvantage on the round). Xhal'theris purrs: *"Hmm. Not the move I was hoping for. Try again."*
- **Second wrong move:** Two Black pieces activate and **attack the nearest PCs** out of turn — free actions, no chess movement, just violence. *"You're embarrassing yourselves, little morsels."*
- **Third wrong move:** **The entire Black army animates.** Every remaining Black piece moves and attacks freely each round. This is effectively a TPK scenario; the puzzle is lost.

**The GM hint mechanic:** Once per puzzle, any PC may spend an Action to make an **Intelligence (chess or strategy) check, DC 15.** On success, Xhal'theris (forced by his own arrogance) reveals whether their *proposed* move is the book solution. *"Oh, very well. The pieces know. Yes — that is the move. Pity it won't save you."*

## Alternate Black Responses (for the GM if Black "wakes up")

If a player has chess knowledge and recognizes the trap, they may try to play *as Black* against the script. Xhal'theris always plays the book line above. But for completeness, here is what Black *should* do at move 5 to survive (the party will never see this — it's only here in case the GM wants to handle a creative twist):

- **`5...Bxf3?`** (Black takes the Knight first) — this avoids the mate but loses material. White plays `6.Qxf3` and is simply up a piece.
- **`5...Nxe5??`** (Black takes the Knight back after Nxe5) — loses to `6.Qxh5` winning the Bishop.
- **`5...Qf6`** (defending) — Black survives but is positionally crushed.

**These do not happen in the script.** Xhal'theris plays the losing line because *he wants the spectacle.* Flavor it as arrogance: he *enjoys* watching the trap close.

## If the Queen Survives

If the player playing the White Queen wins their Capture Combat against the Black Bishop on d1, the puzzle script breaks. Recover by having Xhal'theris play `6.Qxh5` (Black's Queen captures White's central Knight) and continue the game as a normal chess match with both sides down material. The party can still win, but it will be a longer, bloodier fight. **Recommended:** brief the Queen player privately before the room starts that their death is *the* victory condition.

## Victory and Exit

When **Nd5#** lands and the Black King is checkmated:

> Every Black piece freezes mid-motion. The green light beneath the board flickers, dims, and dies. A long sigh from the dark above — half irritation, half delight.
> *"Beautiful. The classic. I do so love the classics. Go on then, little morsels — your prize waits beyond. The board will remember you."*
> The stone slabs across the exit grind back. The squares dim to plain stone.

- **Reward placement:** The crystal/treasure for this room sits in a stone alcove behind the Black side of the board. PCs must walk *through* the (now frozen) enemy pieces to claim it — a deliberate roleplay beat.
- **Surviving Black pieces remain on the board, frozen.** If the party is foolish enough to come back through this room later, the GM may reactivate them for a final fight. *("The board will remember you" is not just flavor.)*

## Failure / TPK Handling

If the party is wiped:

- **Permadeath applies** as with the rest of the dungeon.
- Xhal'theris's voice closes the scene: *"Pity. Such promising openings. So very few of you understood the middlegame."*
- The board resets for the next group.

## GM Notes

- **Pre-game prep:** Print the position on a reference card for yourself. Pre-write the 3-move script on an index card so you don't have to think during play. Memorize the move order: **Nxe5 → Bxf7+ → Nd5#.**
- **Brief the Queen player privately** before the room. Their "death" is the win. Make it feel heroic — the rest of the party should *not* know in advance.
- **Use a real chess clock or 60-second timer** for the Decision Phase. The pressure transforms the room.
- **Encourage debate.** The puzzle is solvable by reasoning even without chess knowledge: "the knight capture looks crazy, but follow the lines."
- **Capture Combat should be fast.** One round, decisive. Don't let any single capture turn into a 20-minute slog or the room loses momentum.
- **Visual payoff:** When Nd5# lands, *describe the smothered mate.* The Black King is surrounded by his own pieces — his Bishop, his Knight, his pawns — and the White Knight stands on d5 untouchable. He is killed by his own court. This is the iconic image.

## Xhal'theris Flavor

Lines to drop during the room:

- **On entry:** *"Pieces. I am missing pieces. Stand on the empty squares, little morsels, and the game may begin. I do so love an opening. So full of promise. So full of mistakes."*
- **When the players propose Nxe5:** *"Ohhh. Bold. Bold and stupid, or bold and brilliant — I cannot yet tell. Play it, then. Show me which."*
- **When Black takes the Queen:** *"Mmm. The queen falls. They always think the queen falling means they've won. Charming."*
- **When Bxf7+ lands:** *"Ah. There it is. The king runs. The king always runs."*
- **When Nd5# lands:** *"Mate. Smothered. Killed by his own household. My favorite ending — the king dies surrounded by the very pieces sworn to protect him. So apt. So very apt."*
- **If the party plays a wrong move:** *"Hmm. Not the move I was hoping for. Try again — I have all the time in the world. You do not."*
- **If the party TPKs:** *"Pity. Such promising openings. So very few of you understood the middlegame."*

## Adjacent Areas

- **Entry corridor:** Stone-cut, plain. Sealed by a slab when the puzzle begins.
- **Exit alcove:** Behind Black's back rank. Contains the room's reward. Walking through the frozen Black pieces is required.
- **Above the board:** Lost in darkness. Xhal'theris's voice comes from up there, but he is never visible.
