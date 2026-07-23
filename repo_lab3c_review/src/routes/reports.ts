import type { FastifyInstance } from "fastify";
import { generateLvtr } from "../domain/lvtr.js";

export function reportsRoutes(app: FastifyInstance): void {
  app.get<{ Params: { date: string } }>("/reports/lvtr/:date", async (request, reply) => {
    const { date } = request.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return reply.status(400).send({
        error: { code: "VALIDATION_ERROR", message: "date must be YYYY-MM-DD" }
      });
    }
    const { filename, content } = generateLvtr(date);
    return reply
      .type("text/csv")
      .header("content-disposition", `attachment; filename="${filename}"`)
      .send(content);
  });
}
