# Berhan Voss journal deck tools

1. Set the key only in the current PowerShell process, then generate sketches:
   `$env:OPENAI_API_KEY = [Environment]::GetEnvironmentVariable('OPENAI_API_KEY','User'); node props\journal-deck\tools\journal-sketch-gen.mjs`
2. Render the journal PDF:
   `node props\journal-deck\tools\journal-render.mjs`

The renderer reads `props\alchemist-journal-draft.md` and emits one US Letter page per approved Journal Page block. Production notes are converted to generated sketch placement and are not printed as instruction text. Margin and correction annotations remain visible as side notes. Print the combined PDF duplex, long-edge flip, Actual Size / 100%, US Letter, with binding on the left.
