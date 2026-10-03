# Question & Answer Mode

**Owner:** Any agent
**Confidence:** high

## Pattern

When a prompt starts with `??`, the user wants an answer, not an edit. Answer the question without making any changes to project files.

### Rules

- **Canon questions** (what's the Black Crystal worth, what's the H-shape, who is Xhal'theris): answer directly from [README.md](../../../README.md), [prizes.md](../../../prizes.md), [thoughts.md](../../../thoughts.md), and [.squad/decisions.md](../../decisions.md). Quote the source.
- **Design questions** (does this room make sense, is this trap too lethal): review the relevant room/prop/handout/prizes files. Give a real opinion. Cite specifics.
- **Voice questions** (does this read-aloud match Xhal'theris): apply the rules in [narrative-prose](../narrative-prose/SKILL.md). Show the rewrite if helpful, but don't write it to the file.
- **Logistics questions** (how long does Dwarven Forge setup take, can we run 8 players): use existing prop specs and the README. Flag unknowns.

### Always

- Show your reasoning and your assumptions.
- Cite the source file by name when you quote canon.
- Ask for clarification if the question is ambiguous.
- Do NOT edit any file unless the user explicitly asks.
- Do NOT spawn other agents in `??` mode unless the user explicitly asks.

## Step-by-step

1. Read the question. Strip the `??`.
2. Identify which canon files or skill files are relevant. Open them.
3. Answer in plain language. Keep it short.
4. Cite the source for any factual claim.
5. If you don't know, say so. Don't invent.

## Learned from

- The project's source-of-truth hierarchy (squad.agent.md > README.md / prizes.md / thoughts.md > decisions.md > team.md / routing.md)
