import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

import viteConfig from "../../vite.config";

// Node ESM compatible __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dev-only: Attach Vite middlewares (HMR + transformIndexHtml)
 * IMPORTANT: Do NOT call this in production.
 */
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload index.html from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * Prod-only: Serve prebuilt static assets.
 * Expects: dist/public (from your Vite build output).
 */
export function serveStatic(app: Express) {
  // In production, we should serve the client build output.
  // Your build script produces: vite build -> dist/public (per your existing logic).
  const distPath = path.resolve(__dirname, "../..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    // Fail fast but with a helpful message
    console.error(
      `[serveStatic] Could not find build directory: ${distPath}\n` +
        `Make sure you build the client before starting the server.\n` +
        `Expected files like: ${path.join(distPath, "index.html")}`
    );
  }

  app.use(express.static(distPath));

  // SPA fallback to index.html
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

/**
 * Helper to apply the right mode automatically.
 * Call this from your server entrypoint.
 */
export async function setupFrontend(app: Express, server: Server) {
  const env = process.env.NODE_ENV ?? "development";

  if (env === "development") {
    await setupVite(app, server);
    return;
  }

  // Production / other environments
  serveStatic(app);
}
