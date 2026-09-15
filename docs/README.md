# Documentation

Written for a reader who was not present for the conversation that produced
them. No shorthand, no references to a chat, no bare ticket ids.

| Document                 | What it covers                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| [engine.md](engine.md)   | The execution engine: how a run produces steps, how algorithms and structure operations are authored, and what the renderer receives. |
| [porting.md](porting.md) | The plan for porting the twelve algorithms and three structures that v1 has and the v2 engine does not yet run.                       |

## Conventions

Two kinds of document live here, and they are maintained differently.

**Living docs** — `engine.md` and anything beside it — describe how the code
works today. They are updated in the same commit as the behavior they
describe, so a stale living doc is a defect in that commit rather than a
follow-up task.

**Decisions** — `decisions/` — is an append-only log of the reasoning behind a
choice, written at the time it was made. An entry is never edited to reflect a
later change of mind; a new entry supersedes it and says so. The point is to
preserve why something looked right then, which a living doc deliberately
discards.
