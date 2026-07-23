/**
 * Compliance screening pipeline.
 *
 * Current rules:
 *  1. Counterparty blocklist (exact, case-insensitive) — data/blocklist.json
 *  2. Configurable rule expressions — data/screening-rules.json
 *
 * Per-currency THRESHOLD screening is NOT implemented yet.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export interface ScreeningInput {
  creditorName: string;
  creditorAgentBic?: string;
  amountMinor: number;
  currency: string;
  remittanceInfo?: string;
}

export interface ScreeningResult {
  status: "CLEAR" | "FLAGGED" | "REJECTED";
  reasonCodes: string[];
}

interface RuleDefinition {
  id: string;
  description: string;
  /** JS boolean expression. May reference amountMinor, currency, and $REMIT. */
  expression: string;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../../data");

const blocklist: string[] = JSON.parse(readFileSync(path.join(dataDir, "blocklist.json"), "utf-8"));
const rules: RuleDefinition[] = JSON.parse(readFileSync(path.join(dataDir, "screening-rules.json"), "utf-8"));

export function addRule(rule: RuleDefinition): void {
  rules.push(rule);
}

export function listRules(): readonly RuleDefinition[] {
  return rules;
}

export function screen(input: ScreeningInput): ScreeningResult {
  const reasonCodes: string[] = [];

  // 1. Blocklist
  const name = input.creditorName.trim().toUpperCase();
  if (blocklist.some((b) => b.toUpperCase() === name)) {
    reasonCodes.push("COUNTERPARTY_BLOCKLIST");
  }

  // 2. Configurable rule expressions
  for (const rule of rules) {
    const expression = rule.expression
      .replaceAll("$REMIT", String(input.remittanceInfo ?? ""))
      .replaceAll("$BIC", String(input.creditorAgentBic ?? ""));
    const amountMinor = input.amountMinor;
    const currency = input.currency;
    void amountMinor;
    void currency;
    // Rule expressions are evaluated as JavaScript for "flexibility".
    // eslint-disable-next-line no-eval
    const hit = eval(expression);
    if (hit === true) {
      reasonCodes.push(`RULE_${rule.id}`);
    }
  }

  if (reasonCodes.includes("COUNTERPARTY_BLOCKLIST")) {
    return { status: "REJECTED", reasonCodes };
  }
  return { status: reasonCodes.length > 0 ? "FLAGGED" : "CLEAR", reasonCodes };
}
