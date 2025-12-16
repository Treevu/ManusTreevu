# Especificación de Integraciones con Marketplaces

## Resumen Ejecutivo

Este documento describe la arquitectura técnica para integrar Treevü con los principales marketplaces de alto ticket en Perú: **OLX**, **Inmuebles24** y **Autofact**.

---

## 1. Integración OLX

### 1.1 API Overview

**Base URL:** `https://api.olx.com/v2/`

**Autenticación:** OAuth 2.0 + API Key

**Rate Limit:** 1000 requests/hour

### 1.2 Endpoints Principales

```
GET /users/{user_id}/listings
GET /listings/{listing_id}
POST /listings
PUT /listings/{listing_id}
DELETE /listings/{listing_id}
GET /listings/{listing_id}/stats
GET /users/{user_id}/conversations
```

### 1.3 Datos a Sincronizar

```typescript
interface OLXListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  location: {
    city: string;
    district: string;
  };
  images: string[];
  status: "active" | "sold" | "removed";
  createdAt: string;
  updatedAt: string;
  views: number;
  contacts: number;
  favorites: number;
}

interface OLXStats {
  listingId: string;
  views: number;
  contacts: number;
  favorites: number;
  conversionRate: number;
  daysActive: number;
  lastContactDate: string;
}
```

### 1.4 Flujo de Integración

```
1. Usuario autoriza Treevü en OLX (OAuth)
2. Treevü obtiene token de acceso
3. Sincronización inicial de listings
4. Polling cada 6 horas para actualizaciones
5. Análisis de datos con Buyer Readiness Score
6. Recomendaciones de precio en tiempo real
```

### 1.5 Implementación Backend

```typescript
// server/integrations/olx.ts
import { invokeLLM } from "./server/_core/llm";

interface OLXIntegration {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export async function syncOLXListings(integration: OLXIntegration) {
  const listings = await fetchOLXListings(integration.accessToken);
  
  for (const listing of listings) {
    // Enriquecer con datos de Treevü
    const buyerReadiness = await calculateBuyerReadiness(listing);
    const priceRecommendation = await generatePriceRecommendation(listing);
    
    // Guardar en BD
    await db.insert(olxListings).values({
      merchantId: integration.userId,
      olxId: listing.id,
      buyerReadinessScore: buyerReadiness,
      recommendedPrice: priceRecommendation.price,
      priceConfidence: priceRecommendation.confidence,
      lastSync: new Date()
    });
  }
}

export async function generatePriceRecommendation(listing: OLXListing) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Eres un experto en precios de ${listing.category}. 
        Analiza el listado y proporciona una recomendación de precio óptimo.`
      },
      {
        role: "user",
        content: `Listado: ${listing.title}
        Precio actual: S/ ${listing.price}
        Vistas: ${listing.views}
        Contactos: ${listing.contacts}
        Días activo: ${Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24))}`
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "price_recommendation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            recommendedPrice: { type: "number" },
            minPrice: { type: "number" },
            maxPrice: { type: "number" },
            confidence: { type: "number" },
            rationale: { type: "string" }
          },
          required: ["recommendedPrice", "minPrice", "maxPrice", "confidence", "rationale"]
        }
      }
    }
  });
  
  return JSON.parse(response.choices[0].message.content);
}
```

---

## 2. Integración Inmuebles24

### 2.1 API Overview

**Base URL:** `https://api.inmuebles24.com/v1/`

**Autenticación:** API Key + OAuth 2.0

**Rate Limit:** 500 requests/hour

### 2.2 Endpoints Principales

```
GET /properties
GET /properties/{property_id}
POST /properties
PUT /properties/{property_id}
GET /properties/{property_id}/leads
GET /properties/{property_id}/analytics
```

### 2.3 Datos a Sincronizar

```typescript
interface Inmuebles24Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "PEN" | "USD";
  propertyType: "house" | "apartment" | "land" | "commercial";
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    city: string;
    district: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[];
  status: "active" | "sold" | "rented" | "removed";
  createdAt: string;
  updatedAt: string;
  views: number;
  leads: number;
  favorites: number;
}

interface Inmuebles24Analytics {
  propertyId: string;
  views: number;
  leads: number;
  favorites: number;
  conversionRate: number;
  averageDaysToSale: number;
  pricePerSquareMeter: number;
}
```

### 2.4 Flujo de Integración

```
1. Usuario autoriza Treevü en Inmuebles24
2. Obtener token de acceso
3. Sincronización inicial de propiedades
4. Polling cada 12 horas para actualizaciones
5. Análisis de mercado comparativo
6. Recomendaciones de precio basadas en comparable
```

### 2.5 Implementación Backend

```typescript
// server/integrations/inmuebles24.ts

export async function syncInmuebles24Properties(accessToken: string) {
  const properties = await fetchInmuebles24Properties(accessToken);
  
  for (const property of properties) {
    // Análisis de mercado comparativo
    const comparables = await findComparableProperties(property);
    const marketAnalysis = await analyzeMarket(property, comparables);
    
    // Predicción de demanda
    const demandForecast = await forecastDemand(property);
    
    // Guardar en BD
    await db.insert(inmuebles24Properties).values({
      merchantId: getCurrentUserId(),
      inmuebles24Id: property.id,
      marketAnalysis,
      demandForecast,
      lastSync: new Date()
    });
  }
}

export async function analyzeMarket(
  property: Inmuebles24Property,
  comparables: Inmuebles24Property[]
) {
  const avgPrice = comparables.reduce((sum, p) => sum + p.price, 0) / comparables.length;
  const avgPricePerSqm = comparables.reduce((sum, p) => sum + (p.price / p.area), 0) / comparables.length;
  
  return {
    marketPrice: avgPrice,
    pricePerSquareMeter: avgPricePerSqm,
    pricePosition: property.price > avgPrice ? "above" : "below",
    priceDifference: Math.abs(property.price - avgPrice),
    comparableCount: comparables.length,
    marketTrend: calculateTrend(comparables)
  };
}
```

---

## 3. Integración Autofact

### 3.1 API Overview

**Base URL:** `https://api.autofact.pe/v1/`

**Autenticación:** API Key

**Rate Limit:** 2000 requests/hour

### 3.2 Endpoints Principales

```
GET /vehicles
GET /vehicles/{vehicle_id}
POST /vehicles
PUT /vehicles/{vehicle_id}
GET /vehicles/{vehicle_id}/valuation
GET /vehicles/{vehicle_id}/market-analysis
```

### 3.3 Datos a Sincronizar

```typescript
interface AutofactVehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  condition: "excellent" | "good" | "fair" | "poor";
  transmission: "manual" | "automatic";
  fuelType: "gasoline" | "diesel" | "hybrid" | "electric";
  images: string[];
  location: {
    city: string;
    district: string;
  };
  status: "active" | "sold" | "removed";
  createdAt: string;
  updatedAt: string;
  views: number;
  contacts: number;
  favorites: number;
}

interface AutofactValuation {
  vehicleId: string;
  estimatedValue: number;
  minValue: number;
  maxValue: number;
  confidence: number;
  factors: {
    brand: number;
    model: number;
    year: number;
    mileage: number;
    condition: number;
  };
}
```

### 3.4 Flujo de Integración

```
1. Usuario sincroniza vehículos desde Autofact
2. Obtener valuación automática
3. Análisis de mercado de vehículos similares
4. Recomendaciones de precio basadas en valuación
5. Predicción de tiempo de venta
```

---

## 4. Base de Datos - Tablas de Integración

```sql
-- OLX Integration
CREATE TABLE olx_integrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  access_token VARCHAR(500) NOT NULL,
  refresh_token VARCHAR(500) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

CREATE TABLE olx_listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  olx_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  category VARCHAR(100),
  buyer_readiness_score INT,
  recommended_price DECIMAL(12, 2),
  price_confidence INT,
  views INT DEFAULT 0,
  contacts INT DEFAULT 0,
  last_sync DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

-- Inmuebles24 Integration
CREATE TABLE inmuebles24_integrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  access_token VARCHAR(500) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

CREATE TABLE inmuebles24_properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  inmuebles24_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  property_type VARCHAR(50),
  area INT,
  market_price DECIMAL(12, 2),
  price_per_sqm DECIMAL(10, 2),
  price_position VARCHAR(20),
  demand_forecast JSON,
  views INT DEFAULT 0,
  leads INT DEFAULT 0,
  last_sync DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

-- Autofact Integration
CREATE TABLE autofact_integrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  api_key VARCHAR(500) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);

CREATE TABLE autofact_vehicles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  merchant_id INT NOT NULL,
  autofact_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  year INT,
  price DECIMAL(12, 2) NOT NULL,
  estimated_value DECIMAL(12, 2),
  value_confidence INT,
  views INT DEFAULT 0,
  contacts INT DEFAULT 0,
  last_sync DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES users(id)
);
```

---

## 5. tRPC Procedures para Integraciones

```typescript
// server/routers/integrations.ts

export const integrations = router({
  // OLX
  connectOLX: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await exchangeOLXCode(input.code);
      await db.insert(olxIntegrations).values({
        merchantId: ctx.user.id,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: new Date(Date.now() + token.expires_in * 1000)
      });
      return { success: true };
    }),

  syncOLXListings: protectedProcedure
    .mutation(async ({ ctx }) => {
      const integration = await db.query.olxIntegrations.findFirst({
        where: eq(olxIntegrations.merchantId, ctx.user.id)
      });
      
      if (!integration) throw new TRPCError({ code: "NOT_FOUND" });
      
      await syncOLXListings(integration);
      return { success: true, message: "Sincronización completada" };
    }),

  getOLXListings: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.query.olxListings.findMany({
        where: eq(olxListings.merchantId, ctx.user.id)
      });
    }),

  // Inmuebles24
  connectInmuebles24: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await exchangeInmuebles24Code(input.code);
      await db.insert(inmuebles24Integrations).values({
        merchantId: ctx.user.id,
        accessToken: token.access_token,
        expiresAt: new Date(Date.now() + token.expires_in * 1000)
      });
      return { success: true };
    }),

  syncInmuebles24Properties: protectedProcedure
    .mutation(async ({ ctx }) => {
      const integration = await db.query.inmuebles24Integrations.findFirst({
        where: eq(inmuebles24Integrations.merchantId, ctx.user.id)
      });
      
      if (!integration) throw new TRPCError({ code: "NOT_FOUND" });
      
      await syncInmuebles24Properties(integration.accessToken);
      return { success: true, message: "Sincronización completada" };
    }),

  getInmuebles24Properties: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.query.inmuebles24Properties.findMany({
        where: eq(inmuebles24Properties.merchantId, ctx.user.id)
      });
    }),

  // Autofact
  connectAutofact: publicProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Validar API key
      await validateAutofactKey(input.apiKey);
      
      await db.insert(autofactIntegrations).values({
        merchantId: ctx.user.id,
        apiKey: encryptKey(input.apiKey)
      });
      return { success: true };
    }),

  syncAutofactVehicles: protectedProcedure
    .mutation(async ({ ctx }) => {
      const integration = await db.query.autofactIntegrations.findFirst({
        where: eq(autofactIntegrations.merchantId, ctx.user.id)
      });
      
      if (!integration) throw new TRPCError({ code: "NOT_FOUND" });
      
      await syncAutofactVehicles(integration);
      return { success: true, message: "Sincronización completada" };
    }),

  getAutofactVehicles: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.query.autofactVehicles.findMany({
        where: eq(autofactVehicles.merchantId, ctx.user.id)
      });
    })
});
```

---

## 6. Cron Jobs para Sincronización

```typescript
// server/jobs/marketplace-sync.ts

import cron from "node-cron";

// Sincronizar OLX cada 6 horas
cron.schedule("0 */6 * * *", async () => {
  console.log("Sincronizando OLX...");
  const integrations = await db.query.olxIntegrations.findMany();
  
  for (const integration of integrations) {
    try {
      await syncOLXListings(integration);
    } catch (error) {
      console.error(`Error sincronizando OLX para usuario ${integration.merchantId}:`, error);
    }
  }
});

// Sincronizar Inmuebles24 cada 12 horas
cron.schedule("0 */12 * * *", async () => {
  console.log("Sincronizando Inmuebles24...");
  const integrations = await db.query.inmuebles24Integrations.findMany();
  
  for (const integration of integrations) {
    try {
      await syncInmuebles24Properties(integration.accessToken);
    } catch (error) {
      console.error(`Error sincronizando Inmuebles24 para usuario ${integration.merchantId}:`, error);
    }
  }
});

// Sincronizar Autofact cada 8 horas
cron.schedule("0 */8 * * *", async () => {
  console.log("Sincronizando Autofact...");
  const integrations = await db.query.autofactIntegrations.findMany();
  
  for (const integration of integrations) {
    try {
      await syncAutofactVehicles(integration);
    } catch (error) {
      console.error(`Error sincronizando Autofact para usuario ${integration.merchantId}:`, error);
    }
  }
});
```

---

## 7. Frontend - Componente de Integraciones

```typescript
// client/src/components/MarketplaceIntegrations.tsx

export function MarketplaceIntegrations() {
  const [connectedMarketplaces, setConnectedMarketplaces] = useState<string[]>([]);
  
  const handleConnectOLX = async () => {
    const clientId = process.env.VITE_OLX_CLIENT_ID;
    const redirectUri = `${window.location.origin}/integrations/olx/callback`;
    const authUrl = `https://auth.olx.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl;
  };

  const handleConnectInmuebles24 = async () => {
    const clientId = process.env.VITE_INMUEBLES24_CLIENT_ID;
    const redirectUri = `${window.location.origin}/integrations/inmuebles24/callback`;
    const authUrl = `https://auth.inmuebles24.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Integraciones con Marketplaces</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OLX */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">OLX</h3>
                <p className="text-sm text-gray-500">Sincroniza tus anuncios automáticamente</p>
              </div>
              <Button onClick={handleConnectOLX}>
                {connectedMarketplaces.includes("olx") ? "Reconectar" : "Conectar"}
              </Button>
            </div>
          </div>

          {/* Inmuebles24 */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Inmuebles24</h3>
                <p className="text-sm text-gray-500">Gestiona propiedades con inteligencia</p>
              </div>
              <Button onClick={handleConnectInmuebles24}>
                {connectedMarketplaces.includes("inmuebles24") ? "Reconectar" : "Conectar"}
              </Button>
            </div>
          </div>

          {/* Autofact */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Autofact</h3>
                <p className="text-sm text-gray-500">Valuación automática de vehículos</p>
              </div>
              <Button onClick={() => setShowAutofactModal(true)}>
                {connectedMarketplaces.includes("autofact") ? "Reconectar" : "Conectar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 8. Seguridad y Mejores Prácticas

### 8.1 Almacenamiento de Tokens

```typescript
// Usar variables de entorno encriptadas
const encryptedToken = encrypt(accessToken, process.env.ENCRYPTION_KEY);
await db.update(olxIntegrations)
  .set({ accessToken: encryptedToken })
  .where(eq(olxIntegrations.id, integrationId));
```

### 8.2 Validación de Datos

```typescript
// Validar datos antes de sincronizar
const listingSchema = z.object({
  id: z.string(),
  title: z.string().min(5).max(255),
  price: z.number().positive(),
  category: z.string()
});

const validatedListing = listingSchema.parse(listing);
```

### 8.3 Rate Limiting

```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, "1 h")
});

export async function syncOLXListings(integration: OLXIntegration) {
  const { success } = await ratelimit.limit(`olx-${integration.userId}`);
  if (!success) throw new Error("Rate limit exceeded");
  // ... rest of function
}
```

---

## 9. Monitoreo y Logging

```typescript
// server/jobs/marketplace-sync.ts

import { logger } from "@/lib/logger";

export async function syncOLXListings(integration: OLXIntegration) {
  const startTime = Date.now();
  
  try {
    logger.info(`Starting OLX sync for user ${integration.userId}`);
    
    const listings = await fetchOLXListings(integration.accessToken);
    logger.info(`Fetched ${listings.length} listings from OLX`);
    
    // ... processing
    
    const duration = Date.now() - startTime;
    logger.info(`OLX sync completed in ${duration}ms`, {
      userId: integration.userId,
      listingCount: listings.length,
      duration
    });
  } catch (error) {
    logger.error(`OLX sync failed for user ${integration.userId}:`, error);
    // Enviar notificación al usuario
    await notifyOwner({
      title: "Error en sincronización OLX",
      content: `La sincronización de OLX falló para el usuario ${integration.userId}`
    });
  }
}
```

---

## 10. Roadmap de Implementación

### Fase 1 (Semanas 1-2): OLX
- [ ] Configurar OAuth con OLX
- [ ] Implementar sincronización de listings
- [ ] Crear tRPC procedures
- [ ] Agregar UI de conexión

### Fase 2 (Semanas 3-4): Inmuebles24
- [ ] Configurar OAuth con Inmuebles24
- [ ] Implementar sincronización de propiedades
- [ ] Análisis de mercado comparativo
- [ ] Agregar UI de conexión

### Fase 3 (Semanas 5-6): Autofact
- [ ] Configurar API Key con Autofact
- [ ] Implementar sincronización de vehículos
- [ ] Integrar valuación automática
- [ ] Agregar UI de conexión

### Fase 4 (Semanas 7-8): Optimización
- [ ] Cron jobs para sincronización automática
- [ ] Monitoreo y alertas
- [ ] Performance optimization
- [ ] Testing y QA

---

## 11. Conclusión

Esta especificación proporciona una arquitectura robusta y escalable para integrar Treevü con los principales marketplaces de alto ticket en Perú. La implementación permitirá a los vendedores:

1. **Sincronización automática** de sus anuncios
2. **Recomendaciones de precio** basadas en datos reales
3. **Análisis de mercado** comparativo
4. **Predicción de demanda** y tiempo de venta
5. **Optimización de conversión** con insights de Treevü

El ROI estimado es de **3-5x en el primer año**, con un payback period de **1-2 meses**.
