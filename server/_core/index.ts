import "dotenv/config";
import express from "express";
import compression from "compression";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { setupFrontend, setupVite } from "./vite";
import { startAlertCron, stopAlertCron } from "../jobs/alertCron";
import { initializeWebSocket } from "../services/websocket";
import { logger, requestLogger } from "./logger";
import { apiLimiter, trpcLimiter } from "./rate-limit";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, "0.0.0.0", () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  // In production (Railway), use the provided PORT directly
  if (process.env.NODE_ENV === "production") {
    logger.info(`Using PORT from environment: ${process.env.PORT || "3000"}`);
    return parseInt(process.env.PORT || "3000");
  }
  
  // In development, find an available port
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
  
  // Initialize WebSocket server
  const io = initializeWebSocket(server);
  logger.info('WebSocket server initialized');
  
  // Compression middleware (gzip)
  app.use(compression());
  
  // Request logging middleware
  app.use(requestLogger);
  
  // Rate limiting middleware
  app.use("/api/", apiLimiter);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Health check endpoint (required by Railway)
  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  });
  
  // Readiness check endpoint
  app.get("/ready", (req, res) => {
    res.json({ ready: true });
  });
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // tRPC API with rate limiting
  app.use("/api/trpc", trpcLimiter);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  await setupFrontend(app, server);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort && process.env.NODE_ENV === "development") {
    logger.warn(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    logger.info(`Server started on port ${port}`, {
      port,
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      compression: "gzip enabled",
      rateLimiting: "enabled",
    });
    
    // Start alert cron job for automatic monitoring
    logger.info('Starting alert monitoring cron job');
    startAlertCron();
    
    // Log security features
    logger.info('Security features enabled', {
      compression: 'gzip',
      rateLimiting: 'enabled',
      healthChecks: 'enabled',
      logging: 'structured JSON',
    });
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    logger.warn('Shutdown signal received, closing gracefully', {
      timestamp: new Date().toISOString(),
    });
    stopAlertCron();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
    
    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after 30 seconds', {
        timestamp: new Date().toISOString(),
      });
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  
  // Log startup completion
  logger.info('Server initialization complete');
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    setTimeout(() => process.exit(1), 1000);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
    setTimeout(() => process.exit(1), 1000);
  });
}

startServer().catch(error => {
  logger.error('Failed to start server', error);
  setTimeout(() => process.exit(1), 1000);
});
