# Kyber Prop RFID

Owner: Senshi

Use this skill when working on Disney Kyber Crystal toy-prop RFID/NFC tooling, Proxmark3 setup, Kyber code references, or local `.proxmark3` documentation.

## Scope

- This is for owned Disney Kyber Crystal toy props and tabletop prop experiments only.
- Do not use this workflow for access badges, payment cards, transit credentials, hotel keys, employee badges, or any system the user does not own or have explicit permission to test.
- Keep the work practical: install, connect, identify, back up, document, and write toy-prop codes.

## Current local setup

- Proxmark3 is exposed to the VDI as `COM6` through AVD COM-port redirection.
- Local launcher:
  - `C:\Tools\pm3.cmd`
  - `C:\Tools\pm3.ps1`
- Correct client target:
  - `C:\Tools\proxmark3-v4.21611\client\proxmark3.exe`
- Do not repoint `pm3` to `C:\Tools\proxmark3\client\proxmark3.exe` unless the Proxmark firmware has been flashed to match that newer client.
- Reason: the device firmware reports capabilities version 7. RRG/Iceman v4.21611 matches it. Newer v4.23346 expects capabilities version 11 and cannot communicate with the current firmware.

## Local reference files

The working Kyber documentation is outside the repo, under the user's Proxmark profile:

- `C:\Users\benthebuilder\.proxmark3\kyber-crystals\README.md`
- `C:\Users\benthebuilder\.proxmark3\kyber-crystals\codes-series1.csv`
- `C:\Users\benthebuilder\.proxmark3\kyber-crystals\codes-series2.csv`
- `C:\Users\benthebuilder\.proxmark3\kyber-crystals\pm3-quick-commands.txt`
- `C:\Users\benthebuilder\.proxmark3\kyber-crystals\sources\makerProjects\`

Load those files before advising on exact Kyber write values.

## Known Kyber facts

- Public maker notes identify Disney Kyber crystals as LF EM4305 / EM4x05 tags configured to emulate EM4100.
- Address 06 controls the base EM4100-style crystal ID family, which affects color and Series 1 behavior.
- Address 09 carries Series 2-specific voice/location behavior for Series 2-aware holocrons and wayfinders.
- Address 01 should be treated as serial-like and not user-changeable.

## Correct command syntax for this client

Connect:

```powershell
pm3 -p COM6 -i
```

Read first:

```text
lf search
lf em 4x05 info
lf em 4x05 dump -f kyber-before-change
lf em 4x05 read -a 6
lf em 4x05 read -a 9
```

Write syntax for v4.21611:

```text
lf em 4x05 write -a 6 -d 0C803000
lf em 4x05 write -a 9 -d 050D0000
```

If a password is needed:

```text
lf em 4x05 write -a 6 -d 0C803000 -p F9DCEBA0
```

Do not use the older online syntax directly:

```text
lf em 4x05writeword a 6 d 0C803000
```

It appears in older public notes, but the installed v4.21611 client uses the subcommand form `lf em 4x05 write`.

## Procedure

1. Confirm the user is working with their own toy prop.
2. Confirm `pm3 --version` reports v4.21611 unless firmware was intentionally upgraded.
3. Confirm `pm3 -p COM6 -c "hw status"` works.
4. Read and dump the crystal before writing.
5. Use the local CSV files for code selection.
6. Write only the needed addresses.
7. Read back the written addresses.
8. Tell the user to test in the Disney toy device.
9. Keep logs and dumps in `C:\Users\benthebuilder\.proxmark3`.

## Source references

Primary cached sources come from:

- `BenTheCloudGuy/makerProjects/KYBER-CRYSTALS`
- The local source cache in `C:\Users\benthebuilder\.proxmark3\kyber-crystals\sources\makerProjects\`

If online research changes the workflow, update the local `.proxmark3\kyber-crystals` guide first, then update this skill.
