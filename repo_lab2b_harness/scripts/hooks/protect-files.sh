#!/usr/bin/env bash
# Copilot PreToolUse hook (VS Code format) — real-time agent gate.
# Denies the agent WRITING protected files (audit/ledger invariants, the seeded test
# contract, and the guardrails themselves) the instant it reaches for them; reads pass.
# The agent-layer twin of .githooks/pre-commit (which gates the commit).
#
# Reads the tool payload on stdin; writes a hookSpecificOutput permission decision on stdout.
payload="$(cat)"
protected_re='src/domain/audit\.ts|data/blocklist\.json|tests/(money|payments|accounts)\.test\.ts|\.githooks/|\.github/hooks/'
read_tool_re='read|get|search|list|find|fetch|grep|view|open|cat'

# tool-name field differs by surface: "toolName" (GitHub CLI) or "tool_name" (VS Code)
tool="$(printf '%s' "$payload" | sed -n 's/.*"tool_*[Nn]ame"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

if printf '%s' "$payload" | grep -qE "$protected_re" && ! printf '%s' "$tool" | grep -qiE "$read_tool_re"; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Protected file (audit/ledger invariant, seeded test contract, or a guardrail). A human must lift the protection consciously."}}\n'
  exit 0
fi
printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}\n'
exit 0
