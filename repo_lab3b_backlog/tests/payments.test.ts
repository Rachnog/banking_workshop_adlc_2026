import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/server.js";
import { seedAccounts } from "../src/domain/seed.js";
import { resetLedger } from "../src/domain/accounts.js";
import { resetAudit, auditTrail } from "../src/domain/audit.js";

function instruction(overrides: Record<string, unknown> = {}) {
  return {
    endToEndId: "E2E-TEST-001",
    debtorAccountId: "ACC-VND-001",
    creditorAccountId: "ACC-VND-002",
    creditorAgentBic: "DEMOVNVX",
    amount: { currency: "VND", value: "500000" },
    remittanceInfo: "Invoice 42",
    ...overrides
  };
}

describe("POST /payments", () => {
  beforeEach(() => {
    resetLedger();
    resetAudit();
    seedAccounts();
  });

  it("posts a clear payment and moves the money", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/payments", payload: instruction() });
    expect(res.statusCode).toBe(201);
    expect(res.json().status).toBe("CLEAR");

    const debtor = await app.inject({ method: "GET", url: "/accounts/ACC-VND-001" });
    expect(debtor.json().balanceMinor).toBe(250_000_000 - 500_000);
  });

  it("writes screening and posting to the audit trail", async () => {
    const app = buildApp();
    await app.inject({ method: "POST", url: "/payments", payload: instruction() });
    const actions = auditTrail().map((e) => e.action);
    expect(actions).toContain("payment.screened");
    expect(actions).toContain("payment.posted");
  });

  it("rejects blocklisted counterparties with SCREENING_REJECTED", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/payments",
      payload: instruction({ creditorAccountId: "ACC-USD-666", debtorAccountId: "ACC-USD-001", amount: { currency: "USD", value: "10.00" } })
    });
    expect(res.statusCode).toBe(422);
    expect(res.json().error.code).toBe("SCREENING_REJECTED");
    expect(res.json().screening.reasonCodes).toContain("COUNTERPARTY_BLOCKLIST");
  });

  it("flags urgent-remittance payments but still posts them", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/payments",
      payload: instruction({ remittanceInfo: "URGENT please pay now" })
    });
    expect(res.statusCode).toBe(201);
    expect(res.json().status).toBe("FLAGGED");
    expect(res.json().reasonCodes).toContain("RULE_URGENT-REMIT");
  });

  it("rejects fractional VND amounts with a precision error", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/payments",
      payload: instruction({ amount: { currency: "VND", value: "1000.50" } })
    });
    expect(res.statusCode).toBe(422);
    expect(res.json().error.code).toBe("INVALID_AMOUNT_PRECISION");
  });

  it("rejects transfers the debtor cannot fund", async () => {
    const app = buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/payments",
      payload: instruction({ amount: { currency: "VND", value: "999999999" } })
    });
    expect(res.statusCode).toBe(422);
    expect(res.json().error.code).toBe("INSUFFICIENT_FUNDS");
  });

  it("KNOWN GAP: the same instruction posts twice (no idempotency)", async () => {
    const app = buildApp();
    await app.inject({ method: "POST", url: "/payments", payload: instruction() });
    await app.inject({ method: "POST", url: "/payments", payload: instruction() });
    const debtor = await app.inject({ method: "GET", url: "/accounts/ACC-VND-001" });
    // Documents current (wrong) behaviour — the idempotency issue fixes this.
    expect(debtor.json().balanceMinor).toBe(250_000_000 - 1_000_000);
  });
});
