# Especificación Técnica: OCR para Registro de Gastos

## 1. VISIÓN GENERAL

### 1.1 Objetivo

Implementar un sistema de captura automática de recibos y facturas mediante OCR (Optical Character Recognition) que permita a los colaboradores registrar gastos de forma rápida y precisa, eliminando la fricción del registro manual.

### 1.2 Beneficios Esperados

```
Métrica                          | Baseline | Target (6m)
---------------------------------|----------|----------
Tiempo de registro               | 30s      | 3s
Tasa de abandono                 | 70%      | 20%
Gastos registrados via OCR       | 0%       | 50%
Precisión de categorización      | -        | 92%+
Cobertura de gastos              | 40%      | 80%
Engagement de usuarios           | 100%     | 160%
```

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Flujo General

```
┌──────────────────────────────────────────────────────────────┐
│                    OCR RECEIPT SYSTEM                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. CAPTURA                                          │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ • Cámara (móvil/web)                               │    │
│  │ • Galería (foto existente)                         │    │
│  │ • Upload (archivo)                                 │    │
│  │ • Validación de calidad                            │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │ 2. PROCESAMIENTO                                   │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ • Compresión de imagen                             │    │
│  │ • Envío a Google Vision API                        │    │
│  │ • Extracción de texto (OCR)                        │    │
│  │ • Parsing de datos estructurados                   │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │ 3. ENRIQUECIMIENTO                                 │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ • Clasificación de categoría (ML)                  │    │
│  │ • Detección de duplicados                          │    │
│  │ • Análisis de items                                │    │
│  │ • Validación de datos                              │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │ 4. CONFIRMACIÓN                                    │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ • Mostrar datos extraídos                          │    │
│  │ • Permitir edición                                 │    │
│  │ • Validación final                                 │    │
│  │ • Guardado en BD                                   │    │
│  └──────────────────┬──────────────────────────────────┘    │
│                     │                                        │
│  ┌──────────────────▼──────────────────────────────────┐    │
│  │ 5. ANÁLISIS                                        │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ • Actualización de FWI Score                       │    │
│  │ • Detección de patrones                            │    │
│  │ • Alertas si aplica                                │    │
│  │ • Recomendaciones                                  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES TÉCNICOS

### 3.1 Frontend - Captura de Recibo

#### 3.1.1 Componente: ReceiptCapture.tsx

```typescript
// client/src/components/dashboard/ReceiptCapture.tsx

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ReceiptCaptureProps {
  onSuccess?: (transactionId: number) => void;
}

export function ReceiptCapture({ onSuccess }: ReceiptCaptureProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
      setMode('camera');
    } catch (error) {
      toast.error('No se pudo acceder a la cámara');
    }
  };

  // Capturar foto
  const capturePhoto = () => {
    if (cameraRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = cameraRef.current.videoWidth;
      canvas.height = cameraRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(cameraRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setImage(imageData);
        
        // Detener cámara
        const stream = cameraRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        
        setMode(null);
        processImage(imageData);
      }
    }
  };

  // Manejar upload de archivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setImage(imageData);
        setMode(null);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Procesar imagen con OCR
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/ocr/process-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) throw new Error('Error al procesar recibo');

      const data = await response.json();
      setExtractedData(data);
    } catch (error) {
      toast.error('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        Capturar Recibo
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Capturar Recibo</DialogTitle>
        </DialogHeader>

        {!image && !mode && (
          <div className="space-y-3">
            <Button
              onClick={startCamera}
              className="w-full gap-2"
              variant="default"
            >
              <Camera className="h-4 w-4" />
              Usar Cámara
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Subir Archivo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {mode === 'camera' && (
          <div className="space-y-3">
            <video
              ref={cameraRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-black"
            />
            <div className="flex gap-2">
              <Button
                onClick={capturePhoto}
                className="flex-1"
              >
                Capturar
              </Button>
              <Button
                onClick={() => {
                  const stream = cameraRef.current?.srcObject as MediaStream;
                  stream?.getTracks().forEach(track => track.stop());
                  setMode(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Procesando recibo...</p>
          </div>
        )}

        {extractedData && (
          <ReceiptPreview
            data={extractedData}
            image={image}
            onConfirm={async (confirmedData) => {
              // Guardar transacción
              const result = await saveReceiptTransaction(confirmedData);
              toast.success('Gasto registrado exitosamente');
              onSuccess?.(result.transactionId);
              setOpen(false);
            }}
            onCancel={() => {
              setImage(null);
              setExtractedData(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
```

#### 3.1.2 Componente: ReceiptPreview.tsx

```typescript
// client/src/components/dashboard/ReceiptPreview.tsx

interface ReceiptPreviewProps {
  data: ExtractedReceiptData;
  image: string | null;
  onConfirm: (data: ExtractedReceiptData) => void;
  onCancel: () => void;
}

export function ReceiptPreview({
  data,
  image,
  onConfirm,
  onCancel,
}: ReceiptPreviewProps) {
  const [editedData, setEditedData] = useState(data);

  return (
    <div className="space-y-4">
      {/* Vista previa de imagen */}
      {image && (
        <div className="relative">
          <img src={image} alt="Recibo" className="w-full rounded-lg" />
          <div className="mt-2 text-xs text-gray-500">
            Confianza OCR: {(data.ocrConfidence * 100).toFixed(0)}%
          </div>
        </div>
      )}

      {/* Datos extraídos editables */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Monto</label>
          <input
            type="number"
            value={editedData.amount}
            onChange={(e) =>
              setEditedData({ ...editedData, amount: parseFloat(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-lg"
            step="0.01"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Comerciante</label>
          <input
            type="text"
            value={editedData.merchant}
            onChange={(e) =>
              setEditedData({ ...editedData, merchant: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Fecha</label>
          <input
            type="date"
            value={editedData.date.toISOString().split('T')[0]}
            onChange={(e) =>
              setEditedData({ ...editedData, date: new Date(e.target.value) })
            }
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Categoría</label>
          <select
            value={editedData.category}
            onChange={(e) =>
              setEditedData({ ...editedData, category: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="food">Alimentos</option>
            <option value="transport">Transporte</option>
            <option value="entertainment">Entretenimiento</option>
            <option value="services">Servicios</option>
            <option value="health">Salud</option>
            <option value="shopping">Compras</option>
            <option value="other">Otro</option>
          </select>
        </div>

        {/* Items detectados */}
        {editedData.items && editedData.items.length > 0 && (
          <div>
            <label className="text-sm font-medium">Items</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {editedData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span>{item.name}</span>
                  <span>S/ {item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <Button
          onClick={() => onConfirm(editedData)}
          className="flex-1 gap-2"
        >
          <Check className="h-4 w-4" />
          Confirmar
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 gap-2"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </div>
  );
}
```

---

## 4. BACKEND - PROCESAMIENTO OCR

### 4.1 Endpoint: /api/ocr/process-receipt

```typescript
// server/routes/ocr.ts

import { Router } from 'express';
import vision from '@google-cloud/vision';
import { protectedRoute } from '../middleware/auth';

const router = Router();
const visionClient = new vision.ImageAnnotatorClient();

interface ExtractedReceiptData {
  amount: number;
  merchant: string;
  date: Date;
  category: string;
  items: Array<{ name: string; price: number }>;
  ocrConfidence: number;
  requiresManualReview: boolean;
}

router.post('/ocr/process-receipt', protectedRoute, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convertir base64 a buffer
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Llamar a Google Vision API
    const request = {
      image: { content: imageBuffer },
      features: [
        { type: 'TEXT_DETECTION' },
        { type: 'DOCUMENT_TEXT_DETECTION' },
      ],
    };

    const [result] = await visionClient.annotateImage(request);
    const textAnnotations = result.textAnnotations || [];

    // Extraer texto
    const fullText = textAnnotations[0]?.description || '';

    // Parsear datos del recibo
    const extractedData = parseReceiptText(fullText);

    // Enriquecer con ML
    const enrichedData = await enrichReceiptData(extractedData);

    // Guardar en BD
    await db.saveReceiptExtraction(req.user.id, {
      imageUrl: image,
      extractedData,
      enrichedData,
      ocrConfidence: calculateConfidence(textAnnotations),
    });

    res.json(enrichedData);
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: 'Failed to process receipt' });
  }
});

function parseReceiptText(text: string): ExtractedReceiptData {
  // Regex patterns para extraer información
  const amountPattern = /(?:total|subtotal|monto|s\/\s*)([\d,.]+)/i;
  const datePattern = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/;
  const merchantPattern = /^(.+?)(?:\n|$)/m;

  const amountMatch = text.match(amountPattern);
  const dateMatch = text.match(datePattern);
  const merchantMatch = text.match(merchantPattern);

  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(/,/, '.'))
    : 0;
  const date = dateMatch ? new Date(dateMatch[1]) : new Date();
  const merchant = merchantMatch ? merchantMatch[1].trim() : 'Unknown';

  // Extraer items (líneas con precio)
  const itemPattern = /(.+?)\s+([\d,.]+)\s*$/gm;
  const items: Array<{ name: string; price: number }> = [];
  let match;

  while ((match = itemPattern.exec(text)) !== null) {
    items.push({
      name: match[1].trim(),
      price: parseFloat(match[2].replace(/,/, '.')),
    });
  }

  return {
    amount,
    merchant,
    date,
    category: 'other', // Se enriquece después
    items,
    ocrConfidence: 0.85, // Placeholder
    requiresManualReview: amount === 0 || merchant === 'Unknown',
  };
}

async function enrichReceiptData(data: ExtractedReceiptData) {
  // Clasificar categoría con ML
  const category = await classifyReceiptCategory(data.merchant, data.items);

  // Detectar si es gasto hormiga
  const isAntExpense = detectAntExpense(data.merchant, data.amount);

  // Validar datos
  const requiresReview = data.amount === 0 || data.requiresManualReview;

  return {
    ...data,
    category,
    isAntExpense,
    requiresManualReview: requiresReview,
    suggestedDescription: generateDescription(data.merchant, data.items),
  };
}

async function classifyReceiptCategory(
  merchant: string,
  items: Array<{ name: string; price: number }>
): Promise<string> {
  // Usar modelo ML pre-entrenado
  const features = {
    merchant_keywords: extractKeywords(merchant),
    item_keywords: items.flatMap(i => extractKeywords(i.name)),
  };

  const model = await loadModel('receipt_category_classifier');
  const prediction = model.predict(features);

  return prediction.category;
}

function detectAntExpense(merchant: string, amount: number): boolean {
  // Detectar si es un gasto hormiga típico
  const antExpenseKeywords = [
    'café', 'starbucks', 'delivery', 'uber eats', 'spotify',
    'netflix', 'amazon prime', 'snacks', 'bebidas'
  ];

  const isLowAmount = amount < 50;
  const hasKeyword = antExpenseKeywords.some(kw =>
    merchant.toLowerCase().includes(kw)
  );

  return isLowAmount && hasKeyword;
}

function calculateConfidence(textAnnotations: any[]): number {
  // Calcular confianza basada en cantidad y claridad de texto
  if (!textAnnotations || textAnnotations.length === 0) return 0;

  const mainAnnotation = textAnnotations[0];
  const confidence = mainAnnotation.confidence || 0.85;

  return Math.min(confidence, 0.99);
}

export default router;
```

---

## 5. MODELOS DE DATOS

### 5.1 Tabla: receipt_images

```sql
CREATE TABLE receipt_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  
  -- Imagen
  imageUrl VARCHAR(500) NOT NULL,
  imageName VARCHAR(200),
  imageSize INT, -- bytes
  imageFormat VARCHAR(20), -- jpeg, png, etc.
  
  -- Metadatos de captura
  captureMethod VARCHAR(20), -- camera, upload, scan
  captureDeviceType VARCHAR(20), -- mobile, web, scanner
  captureQuality VARCHAR(20), -- good, fair, poor
  
  -- Auditoría
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processedAt TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_userId (userId),
  INDEX idx_uploadedAt (uploadedAt)
);
```

### 5.2 Tabla: receipt_extractions

```sql
CREATE TABLE receipt_extractions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  receiptImageId INT,
  
  -- Datos extraídos por OCR
  extractedAmount DECIMAL(10,2),
  extractedDate DATETIME,
  extractedMerchant VARCHAR(200),
  extractedCategory VARCHAR(50),
  extractedItems JSON, -- [{"name": "...", "price": ...}]
  extractedDescription TEXT,
  
  -- Confianza
  ocrConfidence FLOAT, -- 0-1
  requiresManualReview BOOLEAN DEFAULT FALSE,
  
  -- Enriquecimiento
  suggestedCategory VARCHAR(50),
  suggestedDescription TEXT,
  detectedAntExpense BOOLEAN,
  detectedDuplicate BOOLEAN,
  duplicateTransactionId INT,
  
  -- Confirmación usuario
  isConfirmed BOOLEAN DEFAULT FALSE,
  confirmedAmount DECIMAL(10,2),
  confirmedCategory VARCHAR(50),
  confirmedDescription TEXT,
  confirmedAt TIMESTAMP,
  
  -- Linked transaction
  linkedTransactionId INT,
  
  -- Auditoría
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (receiptImageId) REFERENCES receipt_images(id),
  FOREIGN KEY (linkedTransactionId) REFERENCES transactions(id),
  INDEX idx_userId (userId),
  INDEX idx_requiresReview (requiresManualReview),
  INDEX idx_isConfirmed (isConfirmed)
);
```

---

## 6. VALIDACIÓN Y CONTROL DE CALIDAD

### 6.1 Validación de Imagen

```typescript
function validateReceiptImage(image: string): ValidationResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;

      if (!data) {
        resolve({ valid: false, reason: 'Cannot read image data' });
        return;
      }

      // Validar brillo (no muy oscuro ni muy claro)
      const brightness = calculateBrightness(data);
      if (brightness < 50 || brightness > 200) {
        resolve({ valid: false, reason: 'Image too dark or too bright' });
        return;
      }

      // Validar contraste
      const contrast = calculateContrast(data);
      if (contrast < 20) {
        resolve({ valid: false, reason: 'Image has low contrast' });
        return;
      }

      // Validar tamaño
      const size = image.length;
      if (size > 5 * 1024 * 1024) {
        resolve({ valid: false, reason: 'Image too large (>5MB)' });
        return;
      }

      resolve({ valid: true });
    };

    img.src = image;
  });
}

function calculateBrightness(data: Uint8ClampedArray): number {
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sum += (r + g + b) / 3;
  }
  return sum / (data.length / 4);
}

function calculateContrast(data: Uint8ClampedArray): number {
  const brightness = calculateBrightness(data);
  let variance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const pixelBrightness = (r + g + b) / 3;
    variance += Math.pow(pixelBrightness - brightness, 2);
  }
  return Math.sqrt(variance / (data.length / 4));
}
```

---

## 7. DETECCIÓN DE DUPLICADOS

```typescript
async function detectDuplicateReceipt(
  userId: number,
  extractedData: ExtractedReceiptData
): Promise<number | null> {
  // Buscar transacciones similares en últimos 7 días
  const recentTransactions = await db.getTransactions(userId, {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  for (const tx of recentTransactions) {
    // Comparar monto (dentro de 5%)
    const amountDiff = Math.abs(tx.amount - extractedData.amount) / tx.amount;
    if (amountDiff > 0.05) continue;

    // Comparar comerciante (similitud de strings)
    const merchantSimilarity = stringSimilarity(
      tx.merchant.toLowerCase(),
      extractedData.merchant.toLowerCase()
    );
    if (merchantSimilarity < 0.8) continue;

    // Comparar fecha (mismo día)
    const sameDayDate = isSameDay(tx.transactionDate, extractedData.date);
    if (!sameDayDate) continue;

    // Es probable que sea duplicado
    return tx.id;
  }

  return null;
}

function stringSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}
```

---

## 8. INTEGRACIÓN CON INSIGHTS

```typescript
async function processConfirmedReceipt(
  userId: number,
  receiptData: ExtractedReceiptData
) {
  // 1. Crear transacción
  const transaction = await db.createTransaction({
    userId,
    amount: receiptData.amount,
    merchant: receiptData.merchant,
    category: receiptData.category,
    description: receiptData.suggestedDescription,
    transactionDate: receiptData.date,
    source: 'ocr_receipt',
  });

  // 2. Actualizar insights
  await updateUserInsights(userId);

  // 3. Detectar patrones
  const patterns = await detectUserPatterns(userId);
  for (const pattern of patterns) {
    await db.saveUserPattern(userId, pattern);
  }

  // 4. Generar recomendaciones
  const recommendations = await generateRecommendations(userId);
  for (const rec of recommendations) {
    await db.saveRecommendation(userId, rec);
  }

  // 5. Generar alertas si aplica
  const alerts = await generateAlerts(userId);
  for (const alert of alerts) {
    if (shouldSendAlert(alert, userId)) {
      await sendAlert(alert, userId);
    }
  }

  return transaction;
}
```

---

## 9. MÉTRICAS Y MONITOREO

### 9.1 Métricas de OCR

```typescript
interface OCRMetrics {
  totalReceipts: number;
  successfulExtractions: number;
  failedExtractions: number;
  averageConfidence: number;
  averageProcessingTime: number; // ms
  duplicateDetectionRate: number;
  manualReviewRate: number;
  confirmationRate: number; // % de usuarios que confirman
}

async function trackOCRMetrics(userId: number, result: OCRResult) {
  await db.saveOCRMetric({
    userId,
    receiptId: result.receiptId,
    processingTime: result.processingTime,
    confidence: result.confidence,
    requiresReview: result.requiresManualReview,
    isDuplicate: result.isDuplicate,
    wasConfirmed: result.wasConfirmed,
    timestamp: new Date(),
  });
}
```

---

## 10. ROADMAP DE IMPLEMENTACIÓN

### Fase 1 (Semanas 1-2): MVP
- [ ] Integración Google Vision API
- [ ] Componente de captura (cámara + upload)
- [ ] Parsing básico de recibos
- [ ] Guardado en BD

### Fase 2 (Semanas 3-4): Enriquecimiento
- [ ] Clasificación de categoría (ML)
- [ ] Detección de duplicados
- [ ] Validación de imagen
- [ ] Preview y edición

### Fase 3 (Semanas 5-6): Integración
- [ ] Integración con insights
- [ ] Detección de patrones
- [ ] Generación de alertas
- [ ] Análisis de items

### Fase 4 (Semanas 7-8): Optimización
- [ ] Mejora de precisión OCR
- [ ] Caching inteligente
- [ ] Análisis de errores
- [ ] A/B testing

---

## 11. COSTOS Y CONSIDERACIONES

### 11.1 Costos de Google Vision API

```
Pricing (USD):
- Primeras 1,000 requests/mes: Gratis
- Requests adicionales: $1.50 por 1,000 requests

Estimación para 10,000 usuarios:
- Promedio 2 recibos/usuario/mes = 20,000 requests
- Costo mensual: (20,000 - 1,000) / 1,000 × $1.50 = $28.50

Muy económico para el valor generado
```

### 11.2 Consideraciones de Privacidad

```
GDPR/Privacidad:
- Encriptar imágenes en tránsito (HTTPS)
- Encriptar imágenes en reposo (AES-256)
- Permitir eliminación de imágenes
- Cumplir con GDPR Art. 17 (derecho al olvido)
- Usar Google Cloud con Data Processing Agreement
```

---

Esta especificación proporciona la base técnica completa para implementar OCR de recibos de forma robusta y escalable.
