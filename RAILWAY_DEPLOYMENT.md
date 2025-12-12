# Guía de Despliegue en Railway

Este documento contiene todos los cambios necesarios para desplegar Treevü en Railway de forma optimizada.

---

## Cambios Necesarios en el Código

### 1. Actualizar `package.json`

**Cambios en scripts**:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit generate && drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "test": "vitest run",
    "check": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

**Agregar en `package.json`**:

```json
{
  "engines": {
    "node": ">=22.13.0",
    "pnpm": ">=10.4.1"
  }
}
```

---

### 2. Crear `railway.json`

Crea un archivo `railway.json` en la raíz del proyecto:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "on_failure",
    "restartPolicyMaxRetries": 5
  }
}
```

---

### 3. Crear `Procfile` (alternativa a railway.json)

Si prefieres usar Procfile en lugar de railway.json:

```
web: pnpm start
release: pnpm db:push
```

---

### 4. Optimizar `server/_core/index.ts`

Actualiza el archivo para mejor manejo de puertos y logging en producción:

```typescript
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { startAlertCron, stopAlertCron } from "../jobs/alertCron";
import { initializeWebSocket } from "../services/websocket";

// Utility: Check if port is available
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

// Utility: Find available port
async function findAvailablePort(startPort: number = 3000): Promise<number> {
  // In production (Railway), use the provided PORT directly
  if (process.env.NODE_ENV === "production") {
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
  console.log('[WebSocket] Real-time metrics server initialized');
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Health check endpoint (required by Railway)
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
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

  if (port !== preferredPort && process.env.NODE_ENV === "development") {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`[Server] Running on http://0.0.0.0:${port}/`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV}`);
    
    // Start alert cron job for automatic monitoring
    console.log('[Server] Starting alert monitoring cron job...');
    startAlertCron();
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('[Server] Shutdown signal received, closing gracefully...');
    stopAlertCron();
    server.close(() => {
      console.log('[Server] Server closed');
      process.exit(0);
    });
    
    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error('[Server] Forced shutdown after 30 seconds');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('[Server] Uncaught Exception:', error);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

startServer().catch(error => {
  console.error('[Server] Failed to start:', error);
  process.exit(1);
});
```

---

### 5. Optimizar Conexión a Base de Datos

Crea `server/_core/db-connection.ts`:

```typescript
import { drizzle } from "drizzle-orm/mysql2/promise";
import mysql from "mysql2/promise";
import * as schema from "../../drizzle/schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDatabase() {
  if (db) return db;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    // Parse DATABASE_URL
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port || "3306"),
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelayMs: 0,
      // SSL for Railway MySQL
      ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
    });

    db = drizzle(connection, { schema });
    console.log("[Database] Connected successfully");
    return db;
  } catch (error) {
    console.error("[Database] Connection failed:", error);
    throw error;
  }
}
```

---

### 6. Crear Archivo de Logging para Producción

Crea `server/_core/logger.ts`:

```typescript
type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLogLevel = LOG_LEVELS[
  (process.env.LOG_LEVEL as LogLevel) || "info"
];

export const logger = {
  debug: (message: string, data?: any) => {
    if (LOG_LEVELS.debug >= currentLogLevel) {
      console.log(`[DEBUG] ${message}`, data || "");
    }
  },
  info: (message: string, data?: any) => {
    if (LOG_LEVELS.info >= currentLogLevel) {
      console.log(`[INFO] ${message}`, data || "");
    }
  },
  warn: (message: string, data?: any) => {
    if (LOG_LEVELS.warn >= currentLogLevel) {
      console.warn(`[WARN] ${message}`, data || "");
    }
  },
  error: (message: string, error?: any) => {
    if (LOG_LEVELS.error >= currentLogLevel) {
      console.error(`[ERROR] ${message}`, error || "");
    }
  },
};
```

---

### 7. Actualizar `.gitignore`

Asegúrate de que `.gitignore` contenga:

```
.env
.env.local
.env.*.local
node_modules/
dist/
build/
.vite/
.next/
out/
.DS_Store
*.log
*.pid
```

---

## Variables de Entorno para Railway

En el dashboard de Railway, configura estas variables:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NODE_ENV` | `production` | Requerido |
| `DATABASE_URL` | MySQL URL | Railway lo proporciona automáticamente |
| `JWT_SECRET` | Secreto aleatorio | Genera con: `openssl rand -base64 32` |
| `VITE_APP_ID` | Tu Manus App ID | Obten de Manus dashboard |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | Manus OAuth |
| `VITE_OAUTH_PORTAL_URL` | `https://portal.manus.im` | Manus portal |
| `BUILT_IN_FORGE_API_URL` | `https://api.manus.im` | Manus APIs |
| `BUILT_IN_FORGE_API_KEY` | Tu API key | Server-side |
| `VITE_FRONTEND_FORGE_API_KEY` | Tu frontend key | Frontend |
| `VITE_FRONTEND_FORGE_API_URL` | `https://api.manus.im` | Frontend APIs |
| `OWNER_OPEN_ID` | Tu Open ID | De Manus |
| `OWNER_NAME` | Tu nombre | Display name |
| `VITE_ANALYTICS_ENDPOINT` | `https://analytics.manus.im` | Analytics |
| `VITE_ANALYTICS_WEBSITE_ID` | Tu website ID | Analytics ID |
| `VITE_APP_TITLE` | `Treevü` | App title |
| `VITE_APP_LOGO` | `/logo.svg` | Logo path |
| `LOG_LEVEL` | `info` | debug, info, warn, error |

---

## Paso a Paso de Despliegue en Railway

### 1. Conectar Repositorio

```bash
# Asegúrate de que todo está commiteado
git add .
git commit -m "Optimize for Railway deployment"
git push origin main
```

### 2. Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click "New Project"
3. Selecciona "Deploy from GitHub"
4. Autoriza Railway con GitHub
5. Selecciona tu repositorio `treevü-backend`

### 3. Agregar Base de Datos

1. En Railway dashboard, click "+ New"
2. Selecciona "MySQL"
3. Railway crea automáticamente `DATABASE_URL`

### 4. Configurar Variables de Entorno

1. En Railway dashboard, ve a "Variables"
2. Agrega todas las variables de la tabla anterior
3. Railway automáticamente las inyecta en el build

### 5. Desplegar

```bash
# Railway automáticamente:
# 1. Detecta que es Node.js (por package.json)
# 2. Instala dependencias: pnpm install
# 3. Construye: pnpm build
# 4. Ejecuta migraciones: pnpm db:push (si está en Procfile)
# 5. Inicia: pnpm start

# Monitorea los logs en Railway dashboard
```

### 6. Verificar Despliegue

```bash
# Railway te proporciona una URL como:
# https://treevü-backend-production.up.railway.app

# Verifica que funciona:
curl https://treevü-backend-production.up.railway.app/health
# Debería retornar: {"status":"ok","timestamp":"..."}
```

---

## Optimizaciones de Rendimiento para Railway

### 1. Connection Pooling

Ya está configurado en `db-connection.ts` con:
- `connectionLimit: 10`
- `enableKeepAlive: true`

### 2. Compresión de Respuestas

Agrega a `server/_core/index.ts`:

```typescript
import compression from "compression";

app.use(compression());
```

Instala: `pnpm add compression`

### 3. Rate Limiting

Agrega a `server/_core/index.ts`:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
});

app.use("/api/", limiter);
```

Instala: `pnpm add express-rate-limit`

### 4. Caching de Respuestas

Para endpoints que no cambian frecuentemente:

```typescript
app.get("/api/static-data", (req, res) => {
  res.set("Cache-Control", "public, max-age=3600"); // 1 hora
  res.json(data);
});
```

---

## Monitoreo en Railway

### Logs

Railway automáticamente captura:
- stdout (console.log)
- stderr (console.error)

Accede desde: Railway Dashboard → Logs

### Métricas

Railway proporciona:
- CPU usage
- Memory usage
- Network I/O
- Deployments history

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Build falla | Revisa logs en Railway → Deployments |
| Database connection error | Verifica `DATABASE_URL` en Variables |
| 502 Bad Gateway | Revisa que `/health` endpoint responde |
| Timeout en migraciones | Aumenta timeout en Procfile: `release: timeout 600 pnpm db:push` |
| WebSocket no funciona | Railway soporta WebSockets nativamente, no hay cambios necesarios |

---

## Próximos Pasos

1. **Configurar dominio personalizado**: Railway → Settings → Domains
2. **Agregar SSL automático**: Railway lo hace por defecto
3. **Configurar backups automáticos**: Railway → MySQL → Backups
4. **Monitorear performance**: Railway Dashboard → Metrics

---

*Documento actualizado: Diciembre 2024*
