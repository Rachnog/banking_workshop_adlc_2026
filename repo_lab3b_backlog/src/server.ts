import Fastify from "fastify";
import { accountsRoutes } from "./routes/accounts.js";
import { paymentsRoutes } from "./routes/payments.js";
import { screeningRoutes } from "./routes/screening.js";
import { auditRoutes } from "./routes/audit.js";
import { reportsRoutes } from "./routes/reports.js";
import { seedAccounts } from "./domain/seed.js";

export function buildApp() {
  const app = Fastify({ logger: false });
  app.get("/health", async () => ({ status: "ok", bank: "Meridian Bank (fictional)", bic: "DEMOVNVX" }));
  accountsRoutes(app);
  paymentsRoutes(app);
  screeningRoutes(app);
  auditRoutes(app);
  reportsRoutes(app);
  return app;
}

const isDirectRun = process.argv[1]?.endsWith("server.ts") || process.argv[1]?.endsWith("server.js");
if (isDirectRun) {
  seedAccounts();
  const app = buildApp();
  app
    .listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" })
    .then((address) => console.log(`Meridian Payments (fictional) listening at ${address}`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
