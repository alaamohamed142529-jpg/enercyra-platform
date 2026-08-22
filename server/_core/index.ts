import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { energyForecastConfig, forecastEnergy } from "../energyForecast";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.post("/api/forecast", (request, response) => {
    try {
      const values = request.body?.values;
      if (!Array.isArray(values)) return response.status(400).json({ error: "Send a JSON body with a values array." });
      if (values.length !== energyForecastConfig.lookback) return response.status(400).json({ error: `Exactly ${energyForecastConfig.lookback} daily kWh values are required.` });
      if (values.some((value: unknown) => typeof value !== "number" || !Number.isFinite(value) || value < 0)) return response.status(400).json({ error: "Daily kWh values must be finite non-negative numbers." });
      return response.json({ predictions: forecastEnergy(values), lookback: energyForecastConfig.lookback, horizon: energyForecastConfig.horizon, unit: "kWh" });
    } catch (error) {
      console.error("[Forecast] Request failed", error);
      return response.status(500).json({ error: "Energy forecast is temporarily unavailable." });
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
