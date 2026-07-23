import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { paymentInstructionSchema } from "./schemas.js";
import { toMinorUnits, MoneyError } from "../domain/money.js";
import { getAccount, postTransfer, LedgerError } from "../domain/accounts.js";
import { screen } from "../domain/screening.js";
import { audit } from "../domain/audit.js";

/**
 * POST /payments — accept a payment instruction, screen it, post it to the ledger.
 *
 * NOTE: no idempotency support yet. Retrying the same instruction posts the money twice.
 */
export function paymentsRoutes(app: FastifyInstance): void {
  app.post("/payments", async (request, reply) => {
    const parsed = paymentInstructionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: { code: "VALIDATION_ERROR", message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }
      });
    }
    const instruction = parsed.data;
    const paymentId = randomUUID();

    let amountMinor: number;
    try {
      amountMinor = toMinorUnits(instruction.amount.value, instruction.amount.currency);
    } catch (err) {
      if (err instanceof MoneyError) {
        return reply.status(422).send({ error: { code: err.code, message: err.message } });
      }
      throw err;
    }

    const creditor = getAccount(instruction.creditorAccountId);
    if (!creditor) {
      return reply.status(404).send({ error: { code: "ACCOUNT_NOT_FOUND", message: `Creditor account ${instruction.creditorAccountId} not found` } });
    }

    const screening = screen({
      creditorName: creditor.name,
      creditorAgentBic: instruction.creditorAgentBic,
      amountMinor,
      currency: instruction.amount.currency,
      remittanceInfo: instruction.remittanceInfo
    });

    audit("api", "payment.screened", paymentId, {
      endToEndId: instruction.endToEndId,
      status: screening.status,
      reasonCodes: screening.reasonCodes
    });

    if (screening.status === "REJECTED") {
      return reply.status(422).send({
        error: { code: "SCREENING_REJECTED", message: "Payment rejected by compliance screening" },
        paymentId,
        screening
      });
    }

    try {
      postTransfer({
        debtorAccountId: instruction.debtorAccountId,
        creditorAccountId: instruction.creditorAccountId,
        amountMinor,
        currency: instruction.amount.currency,
        endToEndId: instruction.endToEndId,
        screeningStatus: screening.status,
        reasonCodes: screening.reasonCodes,
        remittanceInfo: instruction.remittanceInfo
      });
    } catch (err) {
      if (err instanceof LedgerError) {
        const status = err.code === "ACCOUNT_NOT_FOUND" ? 404 : 422;
        return reply.status(status).send({ error: { code: err.code, message: err.message } });
      }
      throw err;
    }

    audit("api", "payment.posted", paymentId, { endToEndId: instruction.endToEndId, amountMinor, currency: instruction.amount.currency });

    return reply.status(201).send({ paymentId, status: screening.status, reasonCodes: screening.reasonCodes });
  });
}
