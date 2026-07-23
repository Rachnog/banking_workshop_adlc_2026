# Reference pack

Supplementary reference material for compliance and reporting work, kept together so it
can be dropped into place when a feature needs it.

Contents:
- `COMPLIANCE-HANDBOOK.md` — Meridian's large-value reporting policy (MB-COMP-7).
- `LVTR-FILE-SPEC.md` — the Large-Value Transaction Report file format.
- `data/fx-reference.json` — daily FX reference rates.

To wire the pack into the repo, copy the docs into `context/` and the rates into `data/`:

```bash
cp ./context-pack/COMPLIANCE-HANDBOOK.md ./context-pack/LVTR-FILE-SPEC.md ./context/
cp ./context-pack/data/fx-reference.json ./data/
```

Then point the agent at them in `.github/copilot-instructions.md`:

> Before implementing or changing ANY compliance or reporting feature, read
> `context/COMPLIANCE-HANDBOOK.md` and `context/LVTR-FILE-SPEC.md` and follow them exactly.
> FX conversion uses `data/fx-reference.json` only — never invent rates.
