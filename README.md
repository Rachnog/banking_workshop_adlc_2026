# Banking Workshop — Agentic Software Development Lifecycle (ASDLC) 2026

Hands-on workshop on **agentic software development with GitHub Copilot**, built around a fictional cross-border payments service: **Meridian Payments**.

> **Everything here is fictional.** Meridian Bank does not exist (BIC `DEMOVNVX` is fake). There is no real bank code, customer data, or production business rules. Do not put bank code, customer data, secrets, or credentials in any Copilot prompt.

## Materials

| Item | Path |
| --- | --- |
| **Slide deck** | [`ASDLC Workshop — Deck.html`](./ASDLC%20Workshop%20%E2%80%94%20Deck.html) — open in a browser |
| **Lab snapshots** | `repo_lab*/` — catch-up starting states for each lab |

## Day arc

Turn unconstrained vibe coding into disciplined agentic engineering:

1. **Vibe** (Lab 1) — ship fast with no plan; see where it breaks on a system that matters.
2. **Context** (Lab 2a) — control what the model can see (`context-pack` + instructions).
3. **Harness** (Lab 2b) — control what it can do and who checks (hooks, prompts, personas).
4. **Loop + evals** (Lab 2c) — close the implement→test loop with bounds and success criteria.
5. **Spec-driven lifecycle** (Labs 3a–3c) — Spec Kit → backlog/delegation → review loops.

## What you will build on

Each lab folder is a **starting snapshot** of the same TypeScript / Node service:

| Endpoint | Purpose |
| --- | --- |
| `POST /payments` | Accept a payment instruction → validate → screen → ledger → audit |
| `GET /accounts/:id` | Account summary |
| `GET /accounts/:id/transactions` | Transaction history |
| `GET /screening/rules`, `POST /screening/rules` | List or add screening rules |
| `GET /audit` | Append-only audit trail |
| `GET /health` | Liveness |
| `GET /reports/lvtr/:date` | Large-Value Transaction Report (from Lab 2c onward) |

### House rules (agents break these often)

1. Money is always an **integer number of minor units** — never floats. `VND` / `JPY` have 0 decimals; `USD` / `EUR` have 2.
2. All timestamps are **ISO-8601 UTC**.
3. Every business action writes to the **audit trail**.
4. Errors use `{ "error": { "code", "message" } }` with stable `SCREAMING_SNAKE` codes.
5. **zod** for all input validation. No `any`.

## Labs

Work **in order**. Later folders are catch-up snapshots — if you already finished the previous lab in your own clone, **keep using that clone**.

| Folder | Lab | Focus |
| --- | --- | --- |
| [`repo_lab1_vibe`](repo_lab1_vibe/) | **1 — Vibe** | Baseline Meridian Payments. Explore the codebase, run tests, and ship a change with the agent unconstrained. |
| [`repo_lab2a_context`](repo_lab2a_context/) | **2a — Context** | Install a context pack (`COMPLIANCE-HANDBOOK`, `LVTR-FILE-SPEC`) and write durable agent instructions. |
| [`repo_lab2b_harness`](repo_lab2b_harness/) | **2b — Harness** | Guardrails: git hooks, Copilot instructions, prompt files, and agent personas (planner, payments-reviewer). |
| [`repo_lab2c_loop`](repo_lab2c_loop/) | **2c — Loop** | Bounded implement–test loop for LVTR (`PLAN.md`, success kit, test-writer persona, `/loop` prompt). |
| [`repo_lab3a_speckit`](repo_lab3a_speckit/) | **3a — Spec Kit** | Spec-driven development with GitHub Spec Kit: specify → clarify → plan → tasks → implement **per-currency threshold screening**. |
| [`repo_lab3b_backlog`](repo_lab3b_backlog/) | **3b — Backlog** | Decompose work into GitHub issues, delegate to the Copilot coding agent, same CI/branch-protection gates as humans. |
| [`repo_lab3c_review`](repo_lab3c_review/) | **3c — Review** | Three review loops: editor `/loop`, PR Code Review + `@copilot` follow-ups, and the agent/CI pipeline loop — with a human verdict. |

Lab-specific task cards (Labs 3a–3c) live under each folder’s `docs/task-cards/`.

## Getting started

```bash
git clone https://github.com/Rachnog/banking_workshop_adlc_2026.git
cd banking_workshop_adlc_2026

# Slides (optional)
open "ASDLC Workshop — Deck.html"   # macOS; or open the file in any browser

# Start at Lab 1 (or jump to a catch-up folder if joining mid-day)
cd repo_lab1_vibe
npm install
npm test
npm run dev    # http://localhost:3000
```

From Lab 2b onward, activate commit guardrails when instructed:

```bash
git config core.hooksPath .githooks
```

Work on a personal branch:

```bash
git checkout -b work/<your-name>
```

## Prerequisites

- Node.js 20+ (or the version used on workshop machines)
- npm
- GitHub Copilot (editor; for later labs also Code Review / coding agent where available)
- A modern browser (for the HTML slide deck)

## Repository layout

```
banking_workshop_adlc_2026/
├── README.md
├── ASDLC Workshop — Deck.html          # full-day slide deck (open in browser)
│
├── repo_lab1_vibe/                          # Lab 1 — baseline service
│   ├── .github/workflows/                   # CI
│   ├── data/                                # blocklist + screening rules
│   ├── src/domain/                          # money, accounts, screening, audit, seed
│   ├── src/routes/                          # HTTP handlers + zod schemas
│   ├── src/server.ts
│   └── tests/
│
├── repo_lab2a_context/                      # Lab 2a — + context engineering
│   ├── context-pack/                        # COMPLIANCE-HANDBOOK, LVTR-FILE-SPEC, FX data
│   └── … (same service layout as Lab 1)
│
├── repo_lab2b_harness/                      # Lab 2b — + harness
│   ├── .githooks/                           # commit guardrails (protect files)
│   ├── .github/
│   │   ├── copilot-instructions.md
│   │   ├── hooks/
│   │   └── prompts/                         # plan / review prompts
│   ├── context/                             # installed context (handbook + LVTR spec)
│   ├── context-pack/                        # pack to install from
│   ├── scripts/hooks/
│   ├── templates/                           # planner, payments-reviewer personas
│   └── …
│
├── repo_lab2c_loop/                         # Lab 2c — + loop + LVTR plan
│   ├── PLAN.md                              # LVTR implementation plan
│   ├── .github/prompts/loop.prompt.md
│   ├── context-pack/success-kit/            # acceptance criteria for LVTR
│   ├── templates/test-writer.md
│   └── …
│
├── repo_lab3a_speckit/                      # Lab 3a — Spec Kit (LVTR already green)
│   ├── .specify/                            # Spec Kit constitution, templates, workflows
│   ├── .github/agents/                      # /speckit.* agent definitions
│   ├── .github/prompts/                     # speckit + workshop prompts
│   ├── docs/task-cards/LAB-3a-speckit.md
│   ├── docs/SPEC-threshold-screening.md     # reference / trainer material
│   └── …
│
├── repo_lab3b_backlog/                      # Lab 3b — backlog + delegation
│   ├── specs/001-threshold-screening/       # spec / plan / tasks (feed taskstoissues)
│   ├── docs/issues/                         # well-specified vs vague issue seeds
│   ├── docs/task-cards/LAB-3b-backlog.md
│   └── … (+ threshold screening already implemented)
│
└── repo_lab3c_review/                       # Lab 3c — review loops
    ├── docs/task-cards/LAB-3c-review.md
    ├── docs/issues/
    └── … (same mature snapshot; review scenarios in the lab card / deck)
```

### Shared layout inside every lab

| Path | Role |
| --- | --- |
| `package.json` / `package-lock.json` | Node project; run `npm install` in the lab folder |
| `src/domain/` | Business logic (money, screening, ledger helpers, …) |
| `src/routes/` | HTTP API + zod validation |
| `tests/` | Vitest suite — must be green before you start |
| `data/` | JSON config (blocklist, rules, FX, thresholds as labs progress) |
| `.github/workflows/ci.yml` | Same CI shape humans and agents are expected to pass |

`node_modules/` is gitignored everywhere — install locally (or use vendored modules on locked-down workshop machines if provided).

## License / disclaimer

Workshop material only. Synthetic domain. Not financial advice, not a real payments system, not affiliated with any bank.
