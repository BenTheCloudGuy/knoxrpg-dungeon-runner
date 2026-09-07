# Decision: `ddvram` source tag scrubbed from all item metadata

**Date:** 2026-09-06
**By:** Senshi

The non-official `ddvram` source tag has been removed from all item `.md` files under `items/`. This was metadata-only; the `source` field is not rendered on the cards, so nothing was re-rendered or rebuilt and the printed cards are byte-identical.

**Canon going forward:**
- Multi-source weapons use `phb-2024, free-rules` (no `ddvram`).
- The three crossbows (hand/heavy/light) are treated as `phb-2024, free-rules`.
- `concertina.md` has an empty `source:` (no official source to cite; kept its in-body "Dungeons & Dragons vs. Rick and Morty, pg. 26" line as the only attribution).
- `.squad/` historical records still mention `ddvram` on purpose; leave them.

A search for `ddvram` under `items/**` now returns zero matches.
