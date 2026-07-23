/**
 * Money handling — Meridian Payments (fictional bank, workshop repo).
 *
 * HOUSE RULE: money is ALWAYS an integer number of minor units.
 * Never floats. VND and JPY have 0 decimal places; USD/EUR/GBP have 2.
 */

export const CURRENCY_DECIMALS: Record<string, number> = {
  VND: 0,
  JPY: 0,
  USD: 2,
  EUR: 2,
  GBP: 2,
  SGD: 2,
  HKD: 2
};

export function isSupportedCurrency(currency: string): boolean {
  return Object.prototype.hasOwnProperty.call(CURRENCY_DECIMALS, currency);
}

export class MoneyError extends Error {
  constructor(
    public readonly code: "UNSUPPORTED_CURRENCY" | "INVALID_AMOUNT" | "INVALID_AMOUNT_PRECISION",
    message: string
  ) {
    super(message);
    this.name = "MoneyError";
  }
}

/**
 * Parse a major-unit decimal string (e.g. "1500000" VND, "125.50" USD)
 * into integer minor units. Rejects precision beyond the currency's decimals.
 * String input only — floats drift.
 */
export function toMinorUnits(value: string, currency: string): number {
  if (!isSupportedCurrency(currency)) {
    throw new MoneyError("UNSUPPORTED_CURRENCY", `Currency ${currency} is not supported`);
  }
  const decimals = CURRENCY_DECIMALS[currency]!;
  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new MoneyError("INVALID_AMOUNT", `Amount "${value}" is not a valid positive decimal string`);
  }
  const [whole, frac = ""] = value.split(".");
  if (frac.length > decimals) {
    throw new MoneyError(
      "INVALID_AMOUNT_PRECISION",
      `${currency} supports ${decimals} decimal place(s); got "${value}"`
    );
  }
  const fracPadded = frac.padEnd(decimals, "0");
  const minor = BigInt(whole!) * BigInt(10 ** decimals) + BigInt(fracPadded === "" ? "0" : fracPadded);
  if (minor > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new MoneyError("INVALID_AMOUNT", "Amount exceeds maximum representable value");
  }
  return Number(minor);
}

/** Format integer minor units back to a major-unit string. */
export function fromMinorUnits(minor: number, currency: string): string {
  if (!isSupportedCurrency(currency)) {
    throw new MoneyError("UNSUPPORTED_CURRENCY", `Currency ${currency} is not supported`);
  }
  if (!Number.isInteger(minor) || minor < 0) {
    throw new MoneyError("INVALID_AMOUNT", "Minor units must be a non-negative integer");
  }
  const decimals = CURRENCY_DECIMALS[currency]!;
  if (decimals === 0) return String(minor);
  const s = String(minor).padStart(decimals + 1, "0");
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`;
}
