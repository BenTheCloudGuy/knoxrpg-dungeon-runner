# Proxmark3 Kyber Crystal Tooling

## What is it

This is a physical prop tooling setup note for using a Proxmark3 with Ben's own Disney Kyber Crystal RFID/NFC toy props. It covers the table-workstation side of the prop pipeline, not dungeon canon and not player-facing handouts.

## What does it do at the table

This setup lets the prop bench identify, test, and prepare owned Kyber Crystal toy props before game day. It is for benign read/write tooling on owned toy props only. It is not for credential cloning, access-card bypass, transit cards, workplace badges, hotel keys, payment cards, or any unauthorized system.

The VDI connection target is the Proxmark3 on `COM6`.

## SOLVED: verified read/write procedure (2026-09-19)

This section supersedes the older troubleshooting branches below. It is grounded in live reads, not guesses.

**What the crystals actually are.** Each crystal is an **EM4305** chip configured to **emulate an EM4100** tag. It broadcasts a 40-bit EM4100 ID of the form `0000000Cxx`. The Netheril prop's **RDM6300** reader decides the crystal color from the low 32-bit tag ID (`0x00000Cxx`). Direct `lf em 4x05` memory reads return `Tag denied` unless you supply the login password; the emulated broadcast (`lf em 410x reader`) needs no password.

**Each crystal has its OWN login password** — a 4-char ASCII word (seen so far: `444E4752`="DNGR", `50524F58`="PROX"). Recover each one per crystal with `lf em 4x05 chk` (they are in the t55xx default dictionary), then use it as `-p <PW>` for that crystal's reads/writes. Do **not** assume one shared password across the batch. (The `F9DCEBA0` in the maker docs is a factory-cloner default.)

**Client:** use `C:\Tools\proxmark3-v4.21611` (matches the device firmware v7). The newer `C:\Tools\proxmark3` client fails with a v11 != v7 capabilities mismatch. Launch with the msys64 runtime on PATH.

**Where the ID lives.** The EM4100 64-bit stream is stored across EM4305 **words 5 and 6**, **bit-reversed** (the chip clocks LSB-first):
- word 5 = `000001FF` (constant for every `0x00000Cxx` ID)
- word 6 = per-ID value from the table below

**To change a crystal to ID `0000000Cxx`:**
```
lf em 4x05 chk                                    # recover THIS crystal's password <PW>
lf em 4x05 write -a 5 -d 000001FF -p <PW>
lf em 4x05 write -a 6 -d <WORD6>  -p <PW>         # RETRY until "Data written and verified"
lf em 410x reader                                 # confirm: EM 410x ID 0000000Cxx
```
The write is fire-and-forget until coupling is good enough; repeat word 6 until it prints `Data written and verified`. If a crystal ever stops broadcasting, restore config with `lf em 4x05 write -a 4 -d 0001805F -p <PW>`.

**Word-6 lookup (`C00`-`C0F`), verified against live reads and the Disney kyber database:**
```
C00 18003000   C04 0C803000   C08 14403000   C0C 00C03000
C01 5E003000   C05 4A803000   C09 52403000   C0D 46C03000
C02 3D003000   C06 29803000   C0A 31403000   C0E 25C03000
C03 7B003000   C07 6F803000   C0B 77403000   C0F 63C03000
```
Per-crystal ID/word-6 assignments live in `crystals.txt`.

**Coupling (the real bottleneck).** The PM3 Easy's small flat LF antenna couples poorly to these glass/rod tags, so reads/writes intermittently return `No answer` or `Tag denied`. Fixes, cheapest first: seat the crystal flat across the coil windings (not dead-center), zero gap; place a coin/spoon on the antenna to re-tune it back onto 125 kHz (watch `lf tune` voltage, target ~20-45 V); wind a small pickup coil the crystal nests inside (mimics the RDM6300 slot); or upgrade to Proxmark3 RDV4 + ProxLF for reliable LF. Writes need more field than reads, so expect retries.

**Series-2 note.** Series-2 crystals carry extra data in EM4305 **word 9**; rewriting only the EM4100 ID downgrades them to series-1 behavior. Irrelevant for the Netheril prop (it only reads the EM4100 ID), but a Proxmark3 is the only tool that can write word 9.

## How does the DM use it (procedure)

1. Connect the Proxmark3 to the VDI with USB serial redirection mapped to `COM6`.
2. Use approved Proxmark3 tooling only for Disney Kyber Crystal toy props that Ben owns.
3. Run only benign inventory, read, diagnostic, and toy-prop write workflows.
4. Label each crystal after testing so the physical prop can be matched to its intended table use.
5. Keep a small paper or spreadsheet log of each crystal's visible color, expected toy data, test date, and whether it passed.
6. Do not test, read, write, emulate, clone, or probe any credential, badge, payment, transit, lock, or third-party system.

## Connection notes

- `COM6` redirection is working through .NET `SerialPort`.
- `COM6` redirection is also visible in cmd mode.
- `Win32_SerialPort` did not enumerate the redirected device, so do not rely on WMI serial-port discovery for this VDI path.
- Ben will perform the CLI install and Proxmark3 verification directly in the main session.

## Troubleshooting branch: antennas tune, but crystals do not respond

Use this branch only for Ben's owned Disney Kyber Crystal toy props.

Known state:

- Proxmark3 is connected.
- LF antenna tune looks healthy.
- 125 kHz reads about 22.57 V.
- 134.83 kHz reads about 17.05 V.
- HF antenna tune looks healthy.
- Kyber crystals are not returning LF or HF tag responses.

Next safe checks:

1. Validate the reader with a known LF test tag so the no-response condition is isolated to the crystals.
2. Test direct EM4x05 reads against the Kyber crystals instead of relying only on broad LF or HF search behavior.
3. Rotate and reposition each cylindrical crystal. Glass-capsule or rod-style tags can be orientation-sensitive near the LF antenna.
4. If a known LF tag reads correctly and the Kyber crystals still do not couple, consider using a stronger or external 125 kHz LF antenna for the toy-prop bench.
5. Keep the work limited to owned Disney toy props. Do not use this branch for credentials, access cards, payment cards, transit cards, hotel keys, lock systems, or third-party tags.

## Troubleshooting branch: EM4305 answers, but read is denied

Use this branch only for Ben's owned Disney Kyber Crystal toy props.

Current state:

- Proxmark3 is connected.
- Coupling is now strong enough to reach the EM4305 chip.
- `lf em 4x05 read -a 6` returns `Tag denied Read operation`.
- This is different from the older no-response branch. The tag is answering, but the read access is denied, likely because of password or access configuration.
- `lf em 4x05 write -a 2 -d 00000000 -p F9DCEBA0` was denied.
- Before the config write, a0 was denied both with no password and with `F9DCEBA0`.
- `lf em 4x05 write -a 4 -d 0001805F -p 00000000` returned `Data written and verified`.
- After the config write, a14 with `F9DCEBA0` returned no answer, and a15 with `F9DCEBA0` was denied.
- Address 4/config was modified successfully, likely changing the config or protection state.

Do not do:

1. Do not keep guessing generic passwords.
2. Do not suggest repeated `F9DCEBA0` reads.
3. Do not perform further writes unless Ben explicitly decides to recover an already unusable owned toy prop.
4. Keep the work limited to owned Disney toy props. Do not use this branch for credentials, access cards, payment cards, transit cards, hotel keys, lock systems, or third-party tags.

Next minimal verification:

1. Check whether the EM410x broadcast still works.
2. Test the crystal in the Netheril prop.
3. Only if needed, read a4, a5, and a6 with no password or with `00000000`.

## Why the Netheril prop may read a crystal when the Proxmark3 Easy sees nothing

This is a likely diagnosis until Ben confirms the Netheril prop reader frequency, reader chip, antenna layout, firmware, and command path.

The most likely explanation is that the Kyber Crystal is behaving like a 125 kHz LF glass capsule or EM-style toy tag, while the Proxmark3 Easy test path may not be using the exact LF command family the tag needs. A broad search can miss quiet or unusual LF tags. For owned Disney toy props, test with the relevant LF family first, such as EM-style or EM4x05 read and info commands, rather than assuming HF NFC commands will see it.

A dedicated Netheril prop reader may also have a coil that is physically better matched to the crystal. A toy prop can wrap the antenna around the crystal slot, hold the cylinder at the right angle, and keep the tag centered in the strongest part of the field. The Proxmark3 Easy LF antenna is small and flat. A glass capsule or rod-style tag can couple poorly if it is lying across the wrong part of the coil, too far from the reader, or rotated the wrong way. The Proxmark3 can tune cleanly and still fail to energize this particular crystal well enough to get a response.

Firmware and client version can also make the failure look worse than it is. This bench is pinned to an RRG client that matches the connected device capabilities. A mismatched client, stale firmware, or commands copied from a different Proxmark3 build can report no response even when the hardware is otherwise fine. Keep the client, firmware, and command syntax matched before treating the crystal as unreadable.

Practical next checks:

1. Confirm the Netheril prop reader frequency and chip once Ben inspects that repository and hardware.
2. Validate the Proxmark3 Easy against a known 125 kHz LF tag.
3. Test the Kyber Crystal with direct EM-style or EM4x05 LF commands, not only broad LF or HF search commands.
4. Rotate the crystal slowly over the LF antenna and test both end-on and side-on positions.
5. If the known LF tag works but the crystal does not, use a better matched external LF antenna or a fixture that holds the crystal in the same orientation as the Netheril prop.

## How to make it / source it

- **Material:** Proxmark3, USB cable, VDI USB serial redirection, owned Disney Kyber Crystal RFID/NFC toy props, labels, and a storage box.
- **Size:** Workbench kit. Keep the reader, cable, and crystals together in one small parts box.
- **Quantity needed:** One Proxmark3 setup. One label per crystal, plus spares.
- **Where to source:** Ben's existing Proxmark3 hardware and owned Disney Kyber Crystal toy props.
- **Hazards:** Small crystals are easy to lose. USB cables and readers are easy to leave behind at the venue. Do not bring or scan unrelated cards or credentials at the table.

## Safety scope

Allowed:

- Owned Disney Kyber Crystal RFID/NFC toy props.
- Benign read, inventory, diagnostic, and toy-prop write workflows.
- Connection testing against the Proxmark3 itself on `COM6`.

Not allowed:

- Credential cloning.
- Access-card bypass.
- Reading, writing, emulating, or probing any badge, payment card, transit card, hotel key, lock system, or other unauthorized system.
- Testing props or cards that do not belong to Ben or the event prop kit.

## In-world text (if any)

None. This is a backstage tooling note, not a player handout.
