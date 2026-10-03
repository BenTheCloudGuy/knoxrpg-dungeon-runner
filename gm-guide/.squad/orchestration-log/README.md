# Orchestration Log

Cleric writes one entry per agent per batch: `{ISO-timestamp}-{agent}.md`.

Each entry records: agent routed, why chosen, files authorized to read, files produced, outcome.

Append-only. Never edited after write.
