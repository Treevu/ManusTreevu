# Especificación: Expansión a Mobile con React Native

## Resumen Ejecutivo

Este documento describe la estrategia técnica para expandir Treevü a plataformas móviles (iOS y Android) utilizando **React Native** y **Expo**, manteniendo la máxima reutilización de código con la versión web.

---

## 1. Visión General

### 1.1 Objetivos

- **Reutilizar código:** Compartir lógica de negocio entre web y mobile
- **Experiencia nativa:** Aprovechar capacidades nativas del dispositivo (cámara, GPS, biometría)
- **Rendimiento:** Optimizar para conexiones móviles y batería
- **Escalabilidad:** Soportar iOS y Android con un único codebase

### 1.2 Tecnología Stack

```
Frontend Mobile:
├─ React Native 0.73+
├─ Expo SDK 50+
├─ React Navigation 6+
├─ Redux Toolkit (state management)
├─ tRPC Client (API calls)
├─ NativeWind (Tailwind para RN)
└─ Expo Camera (OCR)

Backend:
├─ Node.js Express (sin cambios)
├─ tRPC (compatible con RN)
├─ Drizzle ORM (sin cambios)
└─ MySQL (sin cambios)

DevOps:
├─ EAS Build (Expo Application Services)
├─ EAS Submit (App Store & Play Store)
├─ GitHub Actions (CI/CD)
└─ Sentry (Error tracking)
```

### 1.3 Estructura del Proyecto

```
treevü-mobile/
├─ app/
│  ├─ (auth)/
│  │  ├─ login.tsx
│  │  └─ signup.tsx
│  ├─ (tabs)/
│  │  ├─ dashboard.tsx
│  │  ├─ expenses.tsx
│  │  ├─ ocr.tsx
│  │  ├─ marketplace.tsx
│  │  └─ profile.tsx
│  ├─ _layout.tsx
│  └─ index.tsx
├─ components/
│  ├─ ui/
│  ├─ dashboard/
│  ├─ forms/
│  └─ common/
├─ hooks/
│  ├─ useAuth.ts
│  ├─ useTRPC.ts
│  └─ useOfflineData.ts
├─ lib/
│  ├─ trpc.ts
│  ├─ storage.ts
│  └─ camera.ts
├─ store/
│  └─ redux/
├─ app.json
├─ eas.json
└─ package.json
```

---

## 2. Arquitectura de Compartición de Código

### 2.1 Código Compartido (Monorepo)

```
treevü/
├─ packages/
│  ├─ shared/
│  │  ├─ types/
│  │  │  ├─ user.ts
│  │  │  ├─ transaction.ts
│  │  │  ├─ merchant.ts
│  │  │  └─ index.ts
│  │  ├─ utils/
│  │  │  ├─ fwi.ts
│  │  │  ├─ validation.ts
│  │  │  └─ formatting.ts
│  │  ├─ hooks/
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useFWI.ts
│  │  │  └─ useOfflineData.ts
│  │  └─ package.json
│  ├─ web/
│  │  ├─ src/
│  │  ├─ package.json
│  │  └─ vite.config.ts
│  └─ mobile/
│     ├─ app/
│     ├─ package.json
│     ├─ app.json
│     └─ eas.json
├─ server/
│  ├─ src/
│  ├─ package.json
│  └─ tsconfig.json
└─ pnpm-workspace.yaml
```

### 2.2 Ejemplo: Hook Compartido

```typescript
// packages/shared/hooks/useAuth.ts
import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Obtener usuario actual
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) return null;
      return response.json();
    }
  });

  // Logout
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
    },
    onSuccess: () => {
      setAuthState({ user: null, isLoading: false, isAuthenticated: false });
    }
  });

  useEffect(() => {
    setAuthState({
      user: user || null,
      isLoading,
      isAuthenticated: !!user
    });
  }, [user, isLoading]);

  return {
    ...authState,
    logout
  };
}
```

---

## 3. Configuración de Expo

### 3.1 app.json

```json
{
  "expo": {
    "name": "Treevü",
    "slug": "treevu",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0B0B0C"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.treevu.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0B0B0C"
      },
      "package": "com.treevu.app",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Treevü to access your camera for receipt scanning"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Treevü to access your location"
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      }
    }
  }
}
```

### 3.2 eas.json

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      },
      "ios": {
        "buildType": "archive"
      }
    },
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease"
      },
      "ios": {
        "buildType": "archive"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccount": "google-play-service-account.json",
        "track": "production"
      },
      "ios": {
        "appleId": "YOUR_APPLE_ID",
        "appleTeamId": "YOUR_TEAM_ID",
        "ascAppId": "YOUR_APP_ID"
      }
    }
  }
}
```

---

## 4. Componentes Móviles Clave

### 4.1 Pantalla de Dashboard

```typescript
// app/(tabs)/dashboard.tsx
import { View, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useFWI } from "@/hooks/useFWI";
import { FWICard } from "@/components/dashboard/FWICard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function DashboardScreen() {
  const { user } = useAuth();
  const { fwiScore, isLoading } = useFWI();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          ¡Hola, {user?.name}!
        </Text>
      </View>

      <FWICard score={fwiScore} isLoading={isLoading} />
      <QuickActions />
      <RecentTransactions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C"
  },
  header: {
    padding: 16
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF"
  }
});
```

### 4.2 Pantalla de OCR

```typescript
// app/(tabs)/ocr.tsx
import { useState, useRef } from "react";
import { View, StyleSheet, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { extractReceiptData } from "@/lib/ocr";
import { ReceiptPreview } from "@/components/ocr/ReceiptPreview";

export default function OCRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState(null);
  const cameraRef = useRef<CameraView>(null);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
      
      // Procesar con OCR
      const data = await extractReceiptData(photo.uri);
      setExtractedData(data);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Button title="Permitir acceso a cámara" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView ref={cameraRef} style={styles.camera}>
          <View style={styles.buttonContainer}>
            <Button title="Tomar Foto" onPress={handleTakePhoto} />
          </View>
        </CameraView>
      ) : (
        <ReceiptPreview
          imageUri={photo}
          extractedData={extractedData}
          onRetake={() => setPhoto(null)}
          onConfirm={() => {
            // Guardar gasto
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C"
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 64
  }
});
```

### 4.3 Pantalla de Gastos

```typescript
// app/(tabs)/expenses.tsx
import { useState } from "react";
import { View, ScrollView, StyleSheet, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { TransactionItem } from "@/components/expenses/TransactionItem";
import { AntExpenseDetector } from "@/components/expenses/AntExpenseDetector";

export default function ExpensesScreen() {
  const [showForm, setShowForm] = useState(false);
  
  const { data: transactions, isLoading } = trpc.transactions.list.useQuery({
    limit: 50
  });

  const { data: antExpenses } = trpc.expenses.detectAntExpenses.useQuery();

  return (
    <ScrollView style={styles.container}>
      {showForm && (
        <ExpenseForm
          onSubmit={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      <AntExpenseDetector expenses={antExpenses} />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
    padding: 16
  }
});
```

---

## 5. Integración de tRPC

### 5.1 Configuración del Cliente tRPC

```typescript
// lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { getToken } from "@/lib/auth";
import type { AppRouter } from "@/server/routers";

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api/trpc",
        async headers() {
          const token = await getToken();
          return {
            authorization: token ? `Bearer ${token}` : ""
          };
        }
      })
    ]
  });
}
```

### 5.2 Provider Setup

```typescript
// app/_layout.tsx
import { TRPCProvider } from "@/lib/trpc";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function RootLayout() {
  return (
    <TRPCProvider>
      <AuthProvider>
        <NotificationProvider>
          {/* Navigation */}
        </NotificationProvider>
      </AuthProvider>
    </TRPCProvider>
  );
}
```

---

## 6. Características Nativas

### 6.1 Cámara y OCR

```typescript
// lib/camera.ts
import { CameraView } from "expo-camera";
import { Vision } from "@google-cloud/vision";

export async function extractReceiptDataFromCamera(imageUri: string) {
  // Convertir URI a base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64
  });

  // Llamar a Google Vision API
  const visionClient = new Vision({
    projectId: process.env.EXPO_PUBLIC_GCP_PROJECT_ID
  });

  const request = {
    image: {
      content: base64
    },
    features: [
      { type: "TEXT_DETECTION" },
      { type: "DOCUMENT_TEXT_DETECTION" }
    ]
  };

  const response = await visionClient.annotateImage(request);
  
  // Parsear respuesta
  return parseReceiptText(response.textAnnotations);
}
```

### 6.2 Notificaciones Push

```typescript
// lib/notifications.ts
import * as Notifications from "expo-notifications";

export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== "granted") {
    console.log("Notification permission not granted");
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID
  });

  // Guardar token en backend
  await trpc.notifications.registerDevice.mutate({
    token: token.data,
    platform: "mobile"
  });
}

// Configurar manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    };
  }
});
```

### 6.3 Almacenamiento Local

```typescript
// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveOfflineData(key: string, data: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving offline data:", error);
  }
}

export async function getOfflineData(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading offline data:", error);
    return null;
  }
}
```

---

## 7. Optimizaciones Móviles

### 7.1 Lazy Loading

```typescript
// Cargar componentes bajo demanda
import { lazy, Suspense } from "react";

const BuyerReadinessScoring = lazy(() =>
  import("@/components/dashboard/BuyerReadinessScoring")
);

export function MerchantDashboard() {
  return (
    <Suspense fallback={<LoadingSkeletonMobile />}>
      <BuyerReadinessScoring />
    </Suspense>
  );
}
```

### 7.2 Image Optimization

```typescript
// Optimizar imágenes para móvil
import { Image } from "react-native";

export function OptimizedImage({ uri, width, height }: Props) {
  return (
    <Image
      source={{ uri }}
      style={{ width, height }}
      resizeMode="contain"
      progressiveRenderingEnabled={true}
    />
  );
}
```

### 7.3 Memory Management

```typescript
// Limpiar memoria en componentes
import { useEffect } from "react";

export function useMemoryOptimization() {
  useEffect(() => {
    return () => {
      // Limpiar recursos
      clearCache();
      clearImages();
    };
  }, []);
}
```

---

## 8. CI/CD Pipeline

### 8.1 GitHub Actions

```yaml
# .github/workflows/build-mobile.yml
name: Build Mobile App

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      
      - run: npm install -g eas-cli
      
      - run: pnpm install
      
      - run: eas build --platform android --non-interactive
        env:
          EAS_TOKEN: ${{ secrets.EAS_TOKEN }}
      
      - run: eas build --platform ios --non-interactive
        env:
          EAS_TOKEN: ${{ secrets.EAS_TOKEN }}
      
      - run: eas submit --platform android --non-interactive
        env:
          EAS_TOKEN: ${{ secrets.EAS_TOKEN }}
          GOOGLE_PLAY_SERVICE_ACCOUNT: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
```

---

## 9. Testing

### 9.1 Unit Tests

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from "@testing-library/react-native";
import { useAuth } from "@/hooks/useAuth";

describe("useAuth", () => {
  it("should return user after login", async () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    
    await act(async () => {
      await result.current.login("user@example.com", "password");
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### 9.2 E2E Tests

```typescript
// e2e/dashboard.e2e.ts
import { device, element, by, expect as detoxExpect } from "detox";

describe("Dashboard E2E", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should display FWI score", async () => {
    await expect(element(by.id("fwi-score"))).toBeVisible();
    await expect(element(by.text(/FWI Score/))).toBeVisible();
  });

  it("should navigate to expenses", async () => {
    await element(by.id("tab-expenses")).multiTap();
    await expect(element(by.text(/Mis Gastos/))).toBeVisible();
  });
});
```

---

## 10. Roadmap de Implementación

### Fase 1 (Semanas 1-4): MVP
- [ ] Configurar Expo y estructura base
- [ ] Implementar autenticación
- [ ] Dashboard básico
- [ ] Listado de gastos
- [ ] Build para iOS y Android

### Fase 2 (Semanas 5-8): Características Clave
- [ ] OCR con cámara
- [ ] Notificaciones push
- [ ] Almacenamiento offline
- [ ] Sincronización de datos
- [ ] Testing y QA

### Fase 3 (Semanas 9-12): Optimización
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Crash reporting (Sentry)
- [ ] App Store & Play Store submission
- [ ] Monitoreo en producción

### Fase 4 (Semanas 13-16): Expansión
- [ ] Merchant dashboard mobile
- [ ] Marketplace integrations
- [ ] Advanced features
- [ ] A/B testing
- [ ] Iteración basada en feedback

---

## 11. Presupuesto Estimado

| Concepto | Costo |
|----------|-------|
| Desarrollo (4 engineers, 16 semanas) | S/ 320,000 |
| Infraestructura (EAS, Sentry, etc.) | S/ 5,000 |
| Testing y QA | S/ 20,000 |
| App Store & Play Store fees | S/ 500 |
| **Total** | **S/ 345,500** |

**Payback Period:** 2-3 meses (basado en 20% incremento en engagement)

---

## 12. Conclusión

La expansión a mobile con React Native permitirá a Treevü:

1. **Alcanzar más usuarios** con experiencia nativa
2. **Mejorar engagement** con notificaciones push
3. **Capturar gastos en tiempo real** con OCR
4. **Funcionar offline** con sincronización automática
5. **Mantener código compartido** entre web y mobile

El ROI estimado es de **3-4x en el primer año**, con un payback period de **2-3 meses**.
