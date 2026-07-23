# Context pack

Canonical source bundle for the compliance reference material this service is built
against. Its contents are mirrored into the working tree:

```bash
cp -r COMPLIANCE-HANDBOOK.md LVTR-FILE-SPEC.md ../context/
cp data/fx-reference.json ../data/
```

These are the documents the agent instructions require before any compliance or
reporting work (`.github/copilot-instructions.md`):

> Before implementing or changing ANY compliance or reporting feature, read
> `context/COMPLIANCE-HANDBOOK.md` and `context/LVTR-FILE-SPEC.md` and follow them exactly.
> FX conversion uses `data/fx-reference.json` only — never invent rates.

`success-kit/` holds the executable acceptance criteria for the LVTR feature.
