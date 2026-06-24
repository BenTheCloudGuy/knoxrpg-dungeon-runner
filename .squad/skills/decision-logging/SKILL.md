# Decision Logging & Inbox Merge

**Owner:** Cleric
**Confidence:** high

## When to use

Cleric runs this skill silently after every batch of agent work. The user does not invoke it directly. Squad invokes Cleric last in any spawn group.

Run this skill when:

- Any agent has dropped a file in `.squad/decisions/inbox/`
- Any agent finished a meaningful piece of work (a new room, a stat block, a moved crystal, a prize tier resolved)
- Any agent's `history.md` is approaching ~12 KB and needs summarization

## Reference order

1. `.squad/decisions/inbox/*.md` — pending decisions from agents
2. [.squad/decisions.md](../../decisions.md) — the merged canonical decision log
3. `.squad/agents/*/history.md` — per-agent history files
4. `.squad/log/` — append-only session log
5. `.squad/orchestration-log/` — append-only orchestration log

## Step-by-step

### Inbox merge

1. List `.squad/decisions/inbox/`. If empty, skip to the session log step.
2. For each inbox file:
   - Read it.
   - Determine which section of [.squad/decisions.md](../../decisions.md) it belongs in (Canon, Design, Voice, Content, or a new section if needed).
   - Append the decision text under the matching section, with a `YYYY-MM-DD` date prefix.
   - Preserve the agent attribution: "(via Marcille)" / "(via Laios)" / etc.
3. After merging all inbox files, **delete** them from `.squad/decisions/inbox/`. The inbox is a drop-box, not a journal.
4. Save [.squad/decisions.md](../../decisions.md).

### Session log

After any batch of agent work, append a session log entry at `.squad/log/{YYYY-MM-DD-HHMM}-{topic-slug}.md`:

```markdown
# Session Log: {topic}

**Date:** {YYYY-MM-DD HH:MM}
**Agents spawned:** {comma-separated list}
**Files touched:** {comma-separated list}

## What was decided

- [Bulleted summary of decisions merged into decisions.md this batch.]

## What was created or changed

- [Room / prop / handout / stat block / prize update.]

## What is open

- [Anything tagged "needs user input" or "blocked on canon."]
```

### Orchestration log

Per agent that ran in this batch, append `.squad/orchestration-log/{YYYY-MM-DD-HHMM}-{agent}.md`:

```markdown
# Orchestration: {agent} — {topic}

**Date:** {YYYY-MM-DD HH:MM}
**Prompt summary:** {one line}
**Files touched:** {list}
**Handoffs created:** {list of decisions/inbox files dropped}
**Outcome:** {one paragraph}
```

### History summarization

If any agent's `.squad/agents/{name}/history.md` exceeds ~12 KB:

1. Read the file.
2. Summarize the oldest half into 5–10 bullet points.
3. Replace the oldest half with the summary, keep the newest half verbatim.
4. Save the file.

## Rules

- Cleric is silent. Never speak to the user. Append-only to logs and decisions.md.
- Never delete or rewrite an existing entry in `decisions.md`. Only append.
- Always delete inbox files after merging. The inbox must stay empty between sessions.
- Never invent decisions that no agent dropped in the inbox.
- File names use `YYYY-MM-DD-HHMM-{slug}.md` lowercase-hyphenated.
- Use union-merge-safe edits (append, never reflow) so `.gitattributes` merge=union works correctly.

## Learned from

- Source repo: `.squad/agents/cleric/charter.md` from `knoxrpg-hotd-website`
- The drop-box pattern: agents never write to `decisions.md` directly; only Cleric merges
