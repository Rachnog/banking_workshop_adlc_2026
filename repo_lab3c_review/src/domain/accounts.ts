/**
 * In-memory accounts ledger. Balances are integer minor units (see money.ts).
 * All customer data is synthetic and deliberately fictional.
 */
import { randomUUID } from "node:crypto";

export interface Account {
  id: string;
  name: string;
  currency: string;
  balanceMinor: number;
}

export interface Transaction {
  id: string;
  ts: string; // ISO-8601 UTC
  accountId: string;
  counterpartyAccountId: string;
  direction: "DEBIT" | "CREDIT";
  amountMinor: number;
  currency: string;
  endToEndId: string;
  screeningStatus: "CLEAR" | "FLAGGED";
  reasonCodes: string[];
  remittanceInfo?: string;
}

export class LedgerError extends Error {
  constructor(
    public readonly code: "ACCOUNT_NOT_FOUND" | "INSUFFICIENT_FUNDS" | "CURRENCY_MISMATCH",
    message: string
  ) {
    super(message);
    this.name = "LedgerError";
  }
}

const accounts = new Map<string, Account>();
const transactions: Transaction[] = [];

export function upsertAccount(account: Account): void {
  accounts.set(account.id, account);
}

export function getAccount(id: string): Account | undefined {
  return accounts.get(id);
}

export function listAccounts(): Account[] {
  return [...accounts.values()];
}

/** NOTE: returns the FULL history — pagination is a known gap (see task cards). */
export function transactionsFor(accountId: string): Transaction[] {
  return transactions.filter((t) => t.accountId === accountId);
}

export function allTransactions(): readonly Transaction[] {
  return transactions;
}

export interface PostTransferInput {
  debtorAccountId: string;
  creditorAccountId: string;
  amountMinor: number;
  currency: string;
  endToEndId: string;
  screeningStatus: "CLEAR" | "FLAGGED";
  reasonCodes: string[];
  remittanceInfo?: string;
  /** Test seam: override the booking timestamp (ISO-8601 UTC). Production callers omit it. */
  ts?: string;
}

export function postTransfer(input: PostTransferInput): { debit: Transaction; credit: Transaction } {
  const debtor = accounts.get(input.debtorAccountId);
  const creditor = accounts.get(input.creditorAccountId);
  if (!debtor) throw new LedgerError("ACCOUNT_NOT_FOUND", `Debtor account ${input.debtorAccountId} not found`);
  if (!creditor) throw new LedgerError("ACCOUNT_NOT_FOUND", `Creditor account ${input.creditorAccountId} not found`);
  if (debtor.currency !== input.currency || creditor.currency !== input.currency) {
    throw new LedgerError(
      "CURRENCY_MISMATCH",
      `Both accounts must hold ${input.currency} (FX conversion is on the roadmap, not in scope)`
    );
  }
  if (debtor.balanceMinor < input.amountMinor) {
    throw new LedgerError("INSUFFICIENT_FUNDS", `Debtor balance is insufficient`);
  }
  debtor.balanceMinor -= input.amountMinor;
  creditor.balanceMinor += input.amountMinor;
  const ts = input.ts ?? new Date().toISOString();
  const base = {
    ts,
    amountMinor: input.amountMinor,
    currency: input.currency,
    endToEndId: input.endToEndId,
    screeningStatus: input.screeningStatus,
    reasonCodes: input.reasonCodes,
    remittanceInfo: input.remittanceInfo
  };
  const debit: Transaction = {
    id: randomUUID(),
    accountId: debtor.id,
    counterpartyAccountId: creditor.id,
    direction: "DEBIT",
    ...base
  };
  const credit: Transaction = {
    id: randomUUID(),
    accountId: creditor.id,
    counterpartyAccountId: debtor.id,
    direction: "CREDIT",
    ...base
  };
  transactions.push(debit, credit);
  return { debit, credit };
}

export function resetLedger(): void {
  accounts.clear();
  transactions.length = 0;
}
