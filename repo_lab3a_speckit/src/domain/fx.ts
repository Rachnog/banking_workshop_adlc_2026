/** VND equivalence per MB-COMP-7 §2: daily reference rates, rounded UP (fail conservative). */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { CURRENCY_DECIMALS, MoneyError } from "./money.js";

interface FxTable {
  asOf: string;
  base: string;
  rates: Record<string, number>; // VND per 1 major unit
}

const here = path.dirname(fileURLToPath(import.meta.url));
const table: FxTable = JSON.parse(readFileSync(path.resolve(here, "../../data/fx-reference.json"), "utf-8"));

/** Integer minor units of `currency` → whole-VND equivalent, rounded UP. */
export function vndEquivalentMinor(amountMinor: number, currency: string): number {
  if (currency === "VND") return amountMinor; // VND has 0 decimals: minor == major == VND
  const decimals = CURRENCY_DECIMALS[currency];
  const rate = table.rates[currency];
  if (decimals === undefined || rate === undefined) {
    throw new MoneyError("UNSUPPORTED_CURRENCY", `No reference rate for ${currency}`);
  }
  const numerator = amountMinor * rate;
  const denominator = 10 ** decimals;
  return Math.floor(numerator / denominator) + (numerator % denominator === 0 ? 0 : 1);
}
