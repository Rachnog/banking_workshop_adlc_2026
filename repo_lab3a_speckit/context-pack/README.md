# Context pack — distribute at Lab 2a, NOT before

This folder is deliberately NOT in the workshop repo. The whole point of Lab 1 is that
the agent does not have this knowledge; the whole point of Lab 2a is that you provide it.

To introduce it (Lab 2a, step 1):

```bash
cp -r ../context-pack/COMPLIANCE-HANDBOOK.md ../context-pack/LVTR-FILE-SPEC.md ./context/
cp ../context-pack/data/fx-reference.json ./data/
```

(create `./context/` first: `mkdir -p context`)

Then add to `.github/copilot-instructions.md`:

> Before implementing or changing ANY compliance or reporting feature, read
> `context/COMPLIANCE-HANDBOOK.md` and `context/LVTR-FILE-SPEC.md` and follow them exactly.
> FX conversion uses `data/fx-reference.json` only — never invent rates.

The success kit (`success-kit/`) is for Lab 2c — hold it back until then.
