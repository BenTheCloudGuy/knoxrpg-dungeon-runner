# Session Log: Netheril prop safe-area inset system

**Date:** 2026-09-20 21:09
**Agents spawned:** Senshi (advisory only), Cleric
**Files touched:** `.squad/agents/senshi/history.md`, `.squad/decisions/inbox/senshi-netheril-safe-area.md` (merged + deleted), `.squad/decisions.md`, `.squad/orchestration-log/2026-09-20-2109-senshi.md`, `.squad/log/2026-09-20-2109-netheril-safe-area.md`

## What was decided

- Netheril prop player-UI work must render through the existing safe-area model in `src/public/index.html`; do not add a second parallel inset system.
- Single source of truth for insets is the `safeArea` object applied globally by `fitAppToViewport()`; every view is a child of `#app` and inherits the inset — no per-view CSS padding for foam clearance.
- Persistence precedence is fixed: `?safe*` query params > localStorage `netheril-safe-area` > server `/api/aperture`. Venue calibration persists via `/api/aperture` so it survives power-cycle and applies across displays.
- Calibration is GM-only and hidden from players (Alt+C nudge, Alt+G grid/aperture map); any new GM nudge control POSTs to `/api/aperture`.
- Corner clearance for the irregular tear uses a corner radius / clip-path on the content region, not four larger edge insets.
- Edge-anchored copy (e.g. the "Seek the crystals..." line) must reserve its own vertical space inside the 1080 design box so it cannot clip independent of the global inset.

## What was created or changed

- No prop code changed (advisory review). Decision merged into `.squad/decisions.md`.

## What is open

- Implementation of the confirmed-with-changes advice (fix `.preview-message` clearance bug, expose `--safe-*` from the single source, add corner clip-path, wire GM nudge to `/api/aperture`) is not yet built — awaits Ben's go-ahead.
- Prop-side venue recalibration required whenever the foam border is reseated.
