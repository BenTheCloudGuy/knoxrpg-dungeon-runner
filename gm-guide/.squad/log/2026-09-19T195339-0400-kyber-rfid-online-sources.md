# Session Log: Kyber RFID online sources

**Date:** 2026-09-19 19:53 -04:00
**Agents spawned:** Senshi
**Files touched:** `.squad/agents/senshi/history.md`, `.squad/decisions/inbox/senshi-kyber-rfid-online-sources.md`, `.squad/decisions.md`, `.squad/orchestration-log/2026-09-19T195339-0400-senshi.md`, `.squad/agents/falin/history.md`, `.squad/identity/now.md`

## What was decided

- Use online, citeable sources directly for Kyber RFID evidence when Ben asks for proof; do not rely on local `.proxmark3/` notes or cached files as user-facing proof.
- Current online sources support EM4305 Kyber tags, EM4100-style default output from address words 5 and 6, Proxmark3 EM4x05 command support, and Series 2 compatibility reporting.
- Online sources found do not prove EM410x IDs such as `1111000C03` or `0C03` distinguish Series 1 from Series 2 by themselves.

## What was created or changed

- Merged Senshi's inbox handoff into `.squad/decisions.md` and cleared the inbox file.
- Added this session log and a Senshi orchestration log.
- Added a Falin cross-agent note that this RFID source boundary does not change the seven-crystal puzzle or prize economy.
- Refreshed `.squad/identity/now.md` to the current Kyber RFID source-grounding focus.

## What is open

- Address 09 remains the useful next evidence target only if readable, or use physical packaging / known behavior in a Series 2-aware holocron or wayfinder.
- Keep all Proxmark3 work limited to Ben's owned toy props and benign table-prop workflows.
