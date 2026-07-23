import { describe, expect, it } from "vitest";
import { toMinorUnits, fromMinorUnits, MoneyError } from "../src/domain/money.js";

describe("money — integer minor units house rule", () => {
  it("parses USD with 2 decimal places", () => {
    expect(toMinorUnits("125.50", "USD")).toBe(12550);
    expect(toMinorUnits("0.01", "USD")).toBe(1);
  });

  it("parses VND with 0 decimal places", () => {
    expect(toMinorUnits("250000", "VND")).toBe(250000);
  });

  it("rejects fractional VND — VND has no minor unit", () => {
    expect(() => toMinorUnits("100.5", "VND")).toThrowError(MoneyError);
    try {
      toMinorUnits("100.5", "VND");
    } catch (e) {
      expect((e as MoneyError).code).toBe("INVALID_AMOUNT_PRECISION");
    }
  });

  it("rejects sub-cent USD precision", () => {
    expect(() => toMinorUnits("10.005", "USD")).toThrowError(MoneyError);
  });

  it("rejects unsupported currencies", () => {
    try {
      toMinorUnits("10", "XAU");
    } catch (e) {
      expect((e as MoneyError).code).toBe("UNSUPPORTED_CURRENCY");
    }
  });

  it("round-trips minor units back to display strings", () => {
    expect(fromMinorUnits(12550, "USD")).toBe("125.50");
    expect(fromMinorUnits(250000, "VND")).toBe("250000");
    expect(fromMinorUnits(5, "USD")).toBe("0.05");
  });
});
