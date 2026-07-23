/**
 * Compliance screening pipeline.
 *
 * Current rules:
 *  1. Counterparty blocklist (exact, case-insensitive) — data/blocklist.json
 *  2. Configurable rule expressions — data/screening-rules.json
 *  3. Per-currency threshold screening (integer minor units) — data/screening-thresholds.json,
 *     per docs/SPEC-threshold-screening.md (spec artifacts: specs/001-threshold-screening/).
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
const thresholds: Record<string, number> = JSON.parse(
  readFileSync(path.join(dataDir, "screening-thresholds.json"), "utf-8")
);
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

  // 3. Per-currency threshold screening (internal risk appetite — NOT the LVTR statutory threshold)
  const threshold = thresholds[input.currency];
  if (threshold === undefined) {
    reasonCodes.push("THRESHOLD_CONFIG_MISSING"); // fail closed, never fail open
  } else if (input.amountMinor >= threshold) {
    reasonCodes.push("THRESHOLD_EXCEEDED"); // inclusive
  }

  if (reasonCodes.includes("COUNTERPARTY_BLOCKLIST") || reasonCodes.includes("THRESHOLD_CONFIG_MISSING")) {
    return { status: "REJECTED", reasonCodes };
  }
  return { status: reasonCodes.length > 0 ? "FLAGGED" : "CLEAR", reasonCodes };
}
