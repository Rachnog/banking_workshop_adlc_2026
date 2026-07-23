---
mode: agent
description: Draft a feature spec from the spec template — no implementation.
---
Using `templates/spec-template.md` as the structure, draft a spec for the feature I describe.

Number every functional requirement and make each independently testable. Cover user
scenarios, edge cases (empty / boundary / unconfigured inputs), error codes per the house
error contract, and acceptance criteria a test-writer could turn into failing tests verbatim.
Mark anything my description does not decide as `[NEEDS CLARIFICATION]` — ask, don't assume.
Write the spec to `docs/specs/<feature-slug>.md` and change nothing else.
