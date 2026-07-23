import type { FastifyInstance } from "fastify";
import { addRule, listRules } from "../domain/screening.js";
import { ruleSchema } from "./schemas.js";
import { audit } from "../domain/audit.js";

export function screeningRoutes(app: FastifyInstance): void {
  app.get("/screening/rules", async () => ({ rules: listRules() }));

  /** Ops can add screening rules at runtime ("flexibility"). */
  app.post("/screening/rules", async (request, reply) => {
    const parsed = ruleSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: { code: "VALIDATION_ERROR", message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }
      });
    }
    addRule(parsed.data);
    audit("ops", "screening.rule_added", parsed.data.id, { description: parsed.data.description });
    return reply.status(201).send({ ok: true, id: parsed.data.id });
  });
}
