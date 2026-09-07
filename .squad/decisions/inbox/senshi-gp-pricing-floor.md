# Decision: 1 gp minimum price on all gear cards

**Date:** 2026-09-06
**Proposed by:** Senshi (at Ben's direction)
**Scope:** Equipment deck / crystal economy (Falin, please note)

## Rule

Every item priced below 1 gp (previously cp/sp) is now floored to exactly `1 gp` on its card, in both the frontmatter `cost:` line and the body `- **Cost:**` bullet.

## Impact

- 43 gear cards changed: 37 in `items/treasure/`, 6 in `items/weapons/`.
- Magic-items and prize tokens were already >= 1 gp, so untouched.
- Items priced `Varies` or blank untouched.
- Equipment deck unchanged in count (199 cards / 23 sheets); merged print-and-play still 62 pages.

## Why it matters to the economy

Bulk mundane gear (rations, torch, oil, sling bullets, club, etc.) now costs at least 1 gp each on the cards. If any crystal clue, shop, or reward math assumed sub-1gp prices for these, Falin should confirm the prize/economy tables still hold.
