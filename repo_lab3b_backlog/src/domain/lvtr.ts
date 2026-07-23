/**
 * Large-Value Transaction Report (LVTR) — MB-COMP-7 §2/§4 + LVTR-FILE-SPEC v1.3.
 * Canonical workshop solution: the Lab 2c loop converges here.
 */
import { allTransactions } from "./accounts.js";
import { fromMinorUnits } from "./money.js";
import { vndEquivalentMinor } from "./fx.js";
import { businessDateICT, compactDate } from "./business-date.js";
import { audit } from "./audit.js";

const LVTR_THRESHOLD_VND = 400_000_000; // MB-COMP-7 §2, inclusive

export interface LvtrFile {
  filename: string;
  content: string;
}

export function generateLvtr(businessDate: string): LvtrFile {
  const yyyymmdd = compactDate(businessDate);

  const reportable = allTransactions()
    .filter((t) => t.direction === "DEBIT") // one row per payment, not per ledger leg (§4)
    .filter((t) => businessDateICT(t.ts) === businessDate)
    .map((t) => ({ t, vnd: vndEquivalentMinor(t.amountMinor, t.currency) }))
    .filter((x) => x.vnd >= LVTR_THRESHOLD_VND)
    .sort((a, b) => (a.t.endToEndId < b.t.endToEndId ? -1 : a.t.endToEndId > b.t.endToEndId ? 1 : 0));

  const lines: string[] = [`REPORT,LVTR,DEMOVNVX,${yyyymmdd},001`];
  let totalVnd = 0;
  for (const { t, vnd } of reportable) {
    totalVnd += vnd;
    lines.push(
      `TXN,${t.endToEndId},${t.accountId},${t.counterpartyAccountId},${t.currency},` +
        `${fromMinorUnits(t.amountMinor, t.currency)},${vnd},${compactDate(businessDateICT(t.ts))}`
    );
  }
  lines.push(`TRAILER,${reportable.length},${totalVnd}`);

  const filename = `LVTR_DEMOVNVX_${yyyymmdd}_001.csv`;
  audit("system", "report.lvtr_generated", filename, {
    businessDate,
    rowCount: reportable.length,
    totalVndEquivalent: totalVnd
  });

  return { filename, content: lines.join("\n") };
}
