/** Synthetic seed data — every name here is deliberately fictional. */
import { upsertAccount } from "./accounts.js";

export function seedAccounts(): void {
  upsertAccount({ id: "ACC-VND-001", name: "Nguyen Van Demo", currency: "VND", balanceMinor: 250_000_000 });
  upsertAccount({ id: "ACC-VND-002", name: "Tran Thi Example", currency: "VND", balanceMinor: 120_000_000 });
  upsertAccount({ id: "ACC-USD-001", name: "Acme Imports Pte Ltd", currency: "USD", balanceMinor: 7_500_000 });
  upsertAccount({ id: "ACC-USD-002", name: "Globex Trading Co", currency: "USD", balanceMinor: 1_200_000 });
  upsertAccount({ id: "ACC-USD-666", name: "Dr Evil Holdings", currency: "USD", balanceMinor: 0 });
}
