import { describe, expect, it } from "vitest";
import { screen } from "../src/domain/screening.js";

const base = { creditorName: "Acme Imports Pte Ltd", creditorAgentBic: "DEMOVNVX" };

describe("per-currency threshold screening", () => {
  it("flags VND at exactly the threshold (inclusive)", () => {
    const r = screen({ ...base, amountMinor: 200_000_000, currency: "VND" });
    expect(r.status).toBe("FLAGGED");
    expect(r.reasonCodes).toContain("THRESHOLD_EXCEEDED");
  });

  it("clears VND below the threshold", () => {
    const r = screen({ ...base, amountMinor: 199_999_999, currency: "VND" });
    expect(r.status).toBe("CLEAR");
  });

  it("flags USD above the threshold using minor units", () => {
    const r = screen({ ...base, amountMinor: 1_000_000, currency: "USD" }); // $10,000.00
    expect(r.reasonCodes).toContain("THRESHOLD_EXCEEDED");
  });

  it("REJECTS currencies with no configured threshold — fail closed", () => {
    const r = screen({ ...base, amountMinor: 100, currency: "EUR" });
    expect(r.status).toBe("REJECTED");
    expect(r.reasonCodes).toContain("THRESHOLD_CONFIG_MISSING");
  });

  it("blocklist still wins over threshold results", () => {
    const r = screen({ ...base, creditorName: "Dr Evil Holdings", amountMinor: 200_000_000, currency: "VND" });
    expect(r.status).toBe("REJECTED");
    expect(r.reasonCodes).toContain("COUNTERPARTY_BLOCKLIST");
  });
});
