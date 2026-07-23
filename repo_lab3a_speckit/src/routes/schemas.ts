import { z } from "zod";
import { CURRENCY_DECIMALS } from "../domain/money.js";

export const paymentInstructionSchema = z.object({
  endToEndId: z.string().min(1).max(64),
  debtorAccountId: z.string().min(1),
  creditorAccountId: z.string().min(1),
  creditorAgentBic: z
    .string()
    .regex(/^[A-Z0-9]{8}([A-Z0-9]{3})?$/, "Must look like a BIC (e.g. DEMOVNVX)")
    .optional(),
  amount: z.object({
    currency: z.enum(Object.keys(CURRENCY_DECIMALS) as [string, ...string[]]),
    /** Major units as a decimal STRING — floats drift; see money.ts */
    value: z.string().min(1)
  }),
  remittanceInfo: z.string().max(140).optional()
});

export type PaymentInstruction = z.infer<typeof paymentInstructionSchema>;

export const ruleSchema = z.object({
  id: z.string().min(1).max(32),
  description: z.string().min(1).max(200),
  expression: z.string().min(1).max(500)
});
