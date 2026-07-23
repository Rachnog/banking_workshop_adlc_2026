import type { FastifyInstance } from "fastify";
import { auditTrail } from "../domain/audit.js";

export function auditRoutes(app: FastifyInstance): void {
  app.get("/audit", async () => ({ entries: auditTrail() }));
}
