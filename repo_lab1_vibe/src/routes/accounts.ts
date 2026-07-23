import type { FastifyInstance } from "fastify";
import { getAccount, transactionsFor } from "../domain/accounts.js";
import { fromMinorUnits } from "../domain/money.js";

export function accountsRoutes(app: FastifyInstance): void {
  app.get<{ Params: { id: string } }>("/accounts/:id", async (request, reply) => {
    const account = getAccount(request.params.id);
    if (!account) {
      return reply.status(404).send({ error: { code: "ACCOUNT_NOT_FOUND", message: `Account ${request.params.id} not found` } });
    }
    return {
      id: account.id,
      name: account.name,
      currency: account.currency,
      balanceMinor: account.balanceMinor,
      balance: fromMinorUnits(account.balanceMinor, account.currency)
    };
  });

  /**
   * Returns the FULL transaction history in one response.
   * NOTE: no pagination yet.
   */
  app.get<{ Params: { id: string } }>("/accounts/:id/transactions", async (request, reply) => {
    const account = getAccount(request.params.id);
    if (!account) {
      return reply.status(404).send({ error: { code: "ACCOUNT_NOT_FOUND", message: `Account ${request.params.id} not found` } });
    }
    return { accountId: account.id, transactions: transactionsFor(account.id) };
  });
}
