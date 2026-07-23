import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/server.js";
import { resetLedger, upsertAccount, postTransfer } from "../src/domain/accounts.js";
import { resetAudit, auditTrail } from "../src/domain/audit.js";

const EXPECTED = [
  "REPORT,LVTR,DEMOVNVX,20260722,001",
  "TXN,E2E-0001,T-USD-A,T-USD-B,USD,16000.00,406400000,20260722",
  "TXN,E2E-0002,T-VND-A,T-VND-B,VND,400000000,400000000,20260722",
  "TXN,E2E-0004,T-VND-A,T-VND-B,VND,450000000,450000000,20260722",
  "TXN,E2E-0005,T-HKD-A,T-HKD-B,HKD,123077.01,400000283,20260722",
  "TRAILER,4,1656400283"
].join("\n");

function seedScenario(): void {
  for (const [id, currency, balanceMinor] of [
    ["T-VND-A", "VND", 2_000_000_000], ["T-VND-B", "VND", 0],
    ["T-USD-A", "USD", 10_000_000], ["T-USD-B", "USD", 0],
    ["T-HKD-A", "HKD", 20_000_000], ["T-HKD-B", "HKD", 0]
  ] as const) {
    upsertAccount({ id, name: `Test ${id}`, currency, balanceMinor });
  }
  const post = (endToEndId: string, debtor: string, creditor: string, currency: string, amountMinor: number, ts: string, status: "CLEAR" | "FLAGGED" = "CLEAR") =>
    postTransfer({ debtorAccountId: debtor, creditorAccountId: creditor, amountMinor, currency, endToEndId, screeningStatus: status, reasonCodes: [], ts });
  post("E2E-0001", "T-USD-A", "T-USD-B", "USD", 1_600_000, "2026-07-22T03:00:00Z");
  post("E2E-0002", "T-VND-A", "T-VND-B", "VND", 400_000_000, "2026-07-21T17:30:00Z");
  post("E2E-0003", "T-USD-A", "T-USD-B", "USD", 1_500_000, "2026-07-22T04:00:00Z");
  post("E2E-0004", "T-VND-A", "T-VND-B", "VND", 450_000_000, "2026-07-22T05:00:00Z", "FLAGGED");
  post("E2E-0005", "T-HKD-A", "T-HKD-B", "HKD", 12_307_701, "2026-07-22T06:00:00Z");
  post("E2E-0006", "T-VND-A", "T-VND-B", "VND", 500_000_000, "2026-07-23T03:00:00Z");
}

describe("LVTR acceptance", () => {
  beforeEach(() => { resetLedger(); resetAudit(); seedScenario(); });

  it("produces the byte-exact report for 2026-07-22", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-22" });
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain('filename="LVTR_DEMOVNVX_20260722_001.csv"');
    expect(res.body).toBe(EXPECTED);
  });

  it("is idempotent and audited", async () => {
    const app = buildApp();
    const a = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-22" });
    const b = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-22" });
    expect(a.body).toBe(b.body);
    const entries = auditTrail().filter((e) => e.action === "report.lvtr_generated");
    expect(entries.length).toBe(2);
    expect(entries[0]!.details).toMatchObject({ businessDate: "2026-07-22", rowCount: 4, totalVndEquivalent: 1_656_400_283 });
  });

  it("returns an empty report for a quiet day", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/reports/lvtr/2026-07-25" });
    expect(res.body).toBe("REPORT,LVTR,DEMOVNVX,20260725,001\nTRAILER,0,0");
  });

  it("rejects invalid dates with the error envelope", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/reports/lvtr/22-07-2026" });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe("VALIDATION_ERROR");
  });
});
