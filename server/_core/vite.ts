import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";
import { type Server } from "http";
import { nanoid } from "nanoid";
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
  // In Railway, cwd is usually /app (where package.json lives)
  const distPath = path.resolve(process.cwd(), "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `[serveStatic] Build folder not found: ${distPath}\n` +
        `Did you run "pnpm build" and is Vite outputting to dist/public?`
    );
  } else {
    console.log(`[serveStatic] Serving static from: ${distPath}`);
  }

  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    const indexHtml = path.join(distPath, "index.html");
    res.sendFile(indexHtml);
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
