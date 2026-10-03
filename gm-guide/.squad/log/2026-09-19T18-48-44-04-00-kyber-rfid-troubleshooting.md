# Session Log: Kyber RFID troubleshooting

**Date:** 2026-09-19 18:48
**Agents spawned:** Senshi, Cleric
**Files touched:** `.squad/agents/senshi/history.md`, `.proxmark3/proxmark3-kyber-crystal-tooling.md`, `.squad/decisions/inbox/senshi-kyber-rfid-troubleshooting.md`, `.squad/decisions.md`, `.squad/orchestration-log/2026-09-19T18-48-44-04-00-senshi.md`, `.squad/log/2026-09-19T18-48-44-04-00-kyber-rfid-troubleshooting.md`, `.squad/identity/now.md`

## What was decided

- Preserved the Kyber Crystal no-response troubleshooting branch for Ben's owned Disney toy props: Proxmark3 connection and antenna tune can be healthy while the crystals still return no LF or HF response.
- Kept the safety boundary explicit: no credential cloning, access-card bypass, badge, payment, transit, hotel key, lock, or third-party tag workflows.

## What was created or changed

- Merged Senshi's decision inbox entry into `.squad/decisions.md`.
- Recorded Senshi's orchestration log for the Kyber RFID troubleshooting branch.
- Updated current team focus with the no-response troubleshooting branch.

## What is open

- Ben can validate the reader with a known LF tag, try direct EM4x05 reads, test Kyber Crystal orientation and distance, and consider a stronger or external 125 kHz LF antenna if known LF tags read but the crystals do not.
