# Session Log: Proxmark3 Kyber Tooling

**Date:** 2026-09-19 18:16
**Agents spawned:** Senshi, Cleric
**Files touched:** `props/proxmark3-kyber-crystal-tooling.md`, `.squad/agents/senshi/history.md`, `.squad/agents/chilchuck/history.md`, `.squad/orchestration-log/2026-09-19-1816-senshi.md`, `.squad/log/2026-09-19-1816-proxmark3-kyber-tooling.md`, `.squad/decisions.md`, `.squad/decisions/inbox/senshi-proxmark3-kyber-tooling.md`, `.squad/identity/now.md`

## What was decided

- Proxmark3 tooling notes are scoped only to Ben's owned Disney Kyber Crystal RFID/NFC toy props.
- Allowed work is benign inventory, read, diagnostic, and toy-prop write workflows.
- Credential cloning, access-card bypass, and unauthorized systems are out of scope.
- VDI `COM6` redirection works through .NET `SerialPort` and cmd mode; `Win32_SerialPort` did not enumerate it.

## What was created or changed

- Senshi created `props/proxmark3-kyber-crystal-tooling.md`.
- Cleric merged the Senshi decision inbox entry and cleared the inbox.
- Cleric summarized oversized Senshi and Chilchuck history files.

## What is open

- Ben will perform CLI installation and Proxmark3 verification directly in the main session.
