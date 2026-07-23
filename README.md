# Banking Workshop — Agentic Development Lifecycle (ADLC) 2026

Hands-on workshop on **agentic software development with GitHub Copilot**, built around a fictional cross-border payments service: **Meridian Payments**.

> **Everything here is fictional.** Meridian Bank does not exist (BIC `DEMOVNVX` is fake). There is no real bank code, customer data, or production business rules.

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
| [`repo_lab2a_context`](repo_lab2a_context/) | **2a — Context** | Add a durable context pack (`COMPLIANCE-HANDBOOK`, `LVTR-FILE-SPEC`) so the agent grounds answers in repo docs, not guesses. |
| [`repo_lab2b_harness`](repo_lab2b_harness/) | **2b — Harness** | Guardrails: git hooks, Copilot instructions, prompt files, and agent personas (planner, payments-reviewer). |
| [`repo_lab2c_loop`](repo_lab2c_loop/) | **2c — Loop** | Bounded implement–test loop for the LVTR feature (`PLAN.md`, success kit, test-writer persona, `/loop` prompt). |
| [`repo_lab3a_speckit`](repo_lab3a_speckit/) | **3a — Spec Kit** | Spec-driven development with GitHub Spec Kit: specify → clarify → plan → tasks → implement **per-currency threshold screening**. |
| [`repo_lab3b_backlog`](repo_lab3b_backlog/) | **3b — Backlog** | Decompose work into GitHub issues, delegate to the Copilot coding agent, and run the same CI/branch-protection gates as humans. |
| [`repo_lab3c_review`](repo_lab3c_review/) | **3c — Review** | Three review loops: editor `/loop`, PR Code Review + `@copilot` follow-ups, and the agent/CI pipeline loop — with a human verdict. |

Lab-specific task cards (where present) live under each folder’s `docs/task-cards/`.

## Getting started

```bash
git clone https://github.com/Rachnog/banking_workshop_adlc_2026.git
cd banking_workshop_adlc_2026

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
- GitHub Copilot (editor +, for later labs, Code Review / coding agent where available)

## Repository layout

```
banking_workshop_adlc_2026/
├── README.md                 ← you are here
├── repo_lab1_vibe/           ← Lab 1 starting state
├── repo_lab2a_context/       ← Lab 2a (+ context-pack)
├── repo_lab2b_harness/       ← Lab 2b (+ hooks, prompts, templates)
├── repo_lab2c_loop/          ← Lab 2c (+ loop prompt, LVTR plan)
├── repo_lab3a_speckit/       ← Lab 3a (+ Spec Kit, LVTR already green)
├── repo_lab3b_backlog/       ← Lab 3b (+ threshold screening, issue seeds)
└── repo_lab3c_review/        ← Lab 3c (+ review scenarios)
```

Each lab is a self-contained Node project (`package.json`, `src/`, `tests/`). Run `npm install` inside the folder you are using; `node_modules` is gitignored.

## License / disclaimer

Workshop material only. Synthetic domain. Not financial advice, not a real payments system, not affiliated with any bank.
