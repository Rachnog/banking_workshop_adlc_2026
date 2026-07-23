import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/server.js";
import { seedAccounts } from "../src/domain/seed.js";
import { resetLedger } from "../src/domain/accounts.js";

describe("GET /accounts", () => {
  beforeEach(() => {
    resetLedger();
    seedAccounts();
  });

  it("returns account summaries with display balances", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/accounts/ACC-USD-001" });
    expect(res.statusCode).toBe(200);
    expect(res.json().balance).toBe("75000.00");
  });

  it("404s unknown accounts with the error envelope", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/accounts/NOPE" });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe("ACCOUNT_NOT_FOUND");
  });

  it("returns full transaction history (pagination is a known gap)", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/accounts/ACC-VND-001/transactions" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json().transactions)).toBe(true);
  });
});
