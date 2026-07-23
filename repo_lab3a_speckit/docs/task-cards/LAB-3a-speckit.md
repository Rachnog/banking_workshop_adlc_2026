# LAB-3a — Spec-driven development with GitHub Spec Kit

This repo is pre-initialized with **GitHub Spec Kit** (`.specify/`, `/speckit.*` commands —
no installs needed). The constitution (`.specify/memory/constitution.md`) already encodes the
house rules: minor-units money, compliance-docs-are-law, test-first, audited actions.

Feature: **per-currency threshold screening** — you have only the Product Owner's intent, not a spec.

1. `/speckit.specify` + the PO paragraph:
   > Flag large payments over a configurable per-currency threshold with a reason code, so
   > large movements always get compliance eyes. Payments in currencies we haven't configured
   > must not slip through. Screening thresholds are internal risk appetite — not the LVTR
   > statutory threshold.
   Spec Kit creates the feature branch + `spec.md`. READ it.
2. **Quality gate** (pick at least one): `/speckit.clarify` — focus it on: fail-open vs
   fail-closed for unconfigured currencies; minor units vs major; precedence vs blocklist.
   Or `/speckit.checklist`.
3. `/speckit.plan` — constraints: extend `screen()` in `src/domain/screening.ts`; config in
   `data/screening-thresholds.json` (minor units); no new dependencies; do not change the
   `POST /payments` response shape.
4. `/speckit.tasks` → then `/speckit.analyze` (cross-artifact consistency — read its findings).
5. `/speckit.implement` — the constitution forces test-first; watch it write failing tests
   before code. If it stalls, `/loop` finishes the red→green cycle.
6. **Read your `spec.md`.** What did the PO paragraph *lose* that Spec Kit had to pin down?
   Look hard at *dispositions*: what happens, exactly — and with which reason code, in which
   precedence order — when a rule cannot be evaluated? The model cannot *decide* REJECT-vs-FLAG;
   that ruling is injected by a human at `/speckit.clarify`. That is the whole point of the gate.

**Success check:** spec + plan + tasks artifacts on your feature branch, suite green, PR open.
**Fallback (no speckit commands):** the manual path still works — acceptance criteria →
failing tests (test-writer persona) → "implement, don't touch tests" → green.
