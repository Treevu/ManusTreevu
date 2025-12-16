import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, Camera, CheckCircle, AlertCircle, Loader2, 
  X, Download, Share2, Edit2, Trash2, Eye
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { ChartHelpButton } from "@/components/ChartExplanationModal";
import { employeeDashboardExplanations } from "@/lib/chartExplanations";
import { TableHeaderTooltip, tableHeaderTooltips } from "@/components/TableHeaderTooltip";

interface ExtractedData {
  merchant: string;
  date: string;
  amount: number;
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  confidence: number;
  paymentMethod: string;
  taxAmount?: number;
}

interface ProcessedReceipt {
  id: string;
  imageUrl: string;
  extractedData: ExtractedData;
  status: "processing" | "success" | "error";
  timestamp: string;
  confidence: number;
}

const SAMPLE_RECEIPTS: ProcessedReceipt[] = [
  {
    id: "receipt-1",
    imageUrl: "https://via.placeholder.com/400x300?text=Receipt+1",
    extractedData: {
      merchant: "Wong Supermercado - Av. Paseo de la República",
      date: "2024-12-12",
      amount: 245.50,
      category: "Groceries",
      items: [
        { name: "Arroz Integral 1kg", quantity: 1, price: 45.00 },
        { name: "Aceite de Oliva", quantity: 1, price: 32.50 },
        { name: "Leche Fresca 1L", quantity: 2, price: 28.00 },
        { name: "Pan Integral", quantity: 1, price: 8.50 },
        { name: "Verduras Variadas", quantity: 1, price: 85.50 },
        { name: "Frutas Frescas", quantity: 1, price: 38.00 }
      ],
      confidence: 94,
      paymentMethod: "Tarjeta Débito",
      taxAmount: 8.00
    },
    status: "success",
    timestamp: "2024-12-12T14:30:00Z",
    confidence: 94
  },
  {
    id: "receipt-2",
    imageUrl: "https://via.placeholder.com/400x300?text=Receipt+2",
    extractedData: {
      merchant: "Starbucks Coffee - Centro Comercial",
      date: "2024-12-11",
      amount: 52.00,
      category: "Food & Beverage",
      items: [
        { name: "Venti Caramel Macchiato", quantity: 1, price: 28.00 },
        { name: "Chocolate Chip Cookie", quantity: 1, price: 12.00 },
        { name: "Venti Iced Coffee", quantity: 1, price: 12.00 }
      ],
      confidence: 88,
      paymentMethod: "Efectivo",
      taxAmount: 0
    },
    status: "success",
    timestamp: "2024-12-11T10:15:00Z",
    confidence: 88
  },
  {
    id: "receipt-3",
    imageUrl: "https://via.placeholder.com/400x300?text=Receipt+3",
    extractedData: {
      merchant: "Claro - Centro de Pago",
      date: "2024-12-10",
      amount: 89.90,
      category: "Utilities",
      items: [
        { name: "Servicio de Telefonía Móvil", quantity: 1, price: 89.90 }
      ],
      confidence: 96,
      paymentMethod: "Transferencia Bancaria",
      taxAmount: 0
    },
    status: "success",
    timestamp: "2024-12-10T16:45:00Z",
    confidence: 96
  }
];

const CATEGORIES = [
  "Groceries", "Food & Beverage", "Transport", "Entertainment",
  "Utilities", "Healthcare", "Shopping", "Other"
];

export function ReceiptOCRScanner() {
  const [receipts, setReceipts] = useState<ProcessedReceipt[]>(SAMPLE_RECEIPTS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ProcessedReceipt | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<ProcessedReceipt | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    toast.loading("Procesando recibo con OCR...");

    // Simulate OCR processing
    setTimeout(() => {
      const newReceipt: ProcessedReceipt = {
        id: `receipt-${Date.now()}`,
        imageUrl: URL.createObjectURL(file),
        extractedData: {
          merchant: "Nuevo Comercio",
          date: new Date().toISOString().split('T')[0],
          amount: 150.00,
          category: "Shopping",
          items: [
            { name: "Producto 1", quantity: 1, price: 75.00 },
            { name: "Producto 2", quantity: 1, price: 75.00 }
          ],
          confidence: 85,
          paymentMethod: "Tarjeta Crédito",
          taxAmount: 0
        },
        status: "success",
        timestamp: new Date().toISOString(),
        confidence: 85
      };

      setReceipts([newReceipt, ...receipts]);
      setIsProcessing(false);
      toast.success("Recibo procesado exitosamente");
    }, 2000);
  };

  const handleDeleteReceipt = (id: string) => {
    setReceipts(receipts.filter(r => r.id !== id));
    if (selectedReceipt?.id === id) setSelectedReceipt(null);
    toast.success("Recibo eliminado");
  };

  const handleSaveEdit = () => {
    if (!editingReceipt) return;
    setReceipts(receipts.map(r => r.id === editingReceipt.id ? editingReceipt : r));
    setEditingReceipt(null);
    toast.success("Recibo actualizado");
  };

  const totalAmount = receipts.reduce((sum, r) => sum + r.extractedData.amount, 0);
  const avgConfidence = receipts.length > 0 
    ? Math.round(receipts.reduce((sum, r) => sum + r.confidence, 0) / receipts.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-500" />
                Escanear Recibos con OCR
              </CardTitle>
              <CardDescription>
                Carga fotos de recibos y deja que la IA extraiga automáticamente los datos
              </CardDescription>
            </div>
            <ChartHelpButton explanation={employeeDashboardExplanations.receiptOCR} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload from File */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-blue-500/50 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-blue-500" />
                <p className="font-semibold text-white">Subir Foto</p>
                <p className="text-sm text-gray-400">PNG, JPG o PDF</p>
              </div>
            </div>

            {/* Capture from Camera */}
            <div
              onClick={() => cameraInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-cyan-500/50 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-pointer"
            >
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-cyan-500" />
                <p className="font-semibold text-white">Tomar Foto</p>
                <p className="text-sm text-gray-400">Con tu cámara</p>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="text-white">Procesando recibo con OCR...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-400 mb-2">Recibos Procesados</p>
            <p className="text-3xl font-bold text-blue-500">{receipts.length}</p>
            <p className="text-xs text-gray-400 mt-2">En los últimos 30 días</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-400 mb-2">Monto Total</p>
            <p className="text-3xl font-bold text-green-500">S/ {totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-2">Gastos capturados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-400 mb-2">Precisión Promedio</p>
            <p className="text-3xl font-bold text-purple-500">{avgConfidence}%</p>
            <p className="text-xs text-gray-400 mt-2">Confianza del OCR</p>
          </CardContent>
        </Card>
      </div>

      {/* Receipts Grid */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recibos Procesados</CardTitle>
              <CardDescription>
                Historial de recibos escaneados y datos extraídos
              </CardDescription>
            </div>
            <ChartHelpButton explanation={employeeDashboardExplanations.receiptOCR} />
          </div>
        </CardHeader>
        <CardContent>
          {receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No hay recibos procesados aún</p>
              <p className="text-sm text-gray-500 mt-2">Comienza subiendo una foto de un recibo</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts.map((receipt) => (
                <div
                  key={receipt.id}
                  onClick={() => setSelectedReceipt(receipt)}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedReceipt?.id === receipt.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 hover:border-white/20 bg-white/5"
                  }`}
                >
                  {/* Receipt Image */}
                  <div className="mb-3 rounded-lg overflow-hidden bg-white/5 h-32">
                    <img
                      src={receipt.imageUrl}
                      alt="Receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Merchant Info */}
                  <div className="mb-2">
                    <TableHeaderTooltip header="Comercio" tooltip={tableHeaderTooltips.receiptMerchant} />
                  </div>
                  <p className="font-semibold text-white text-sm truncate">
                    {receipt.extractedData.merchant}
                  </p>
                  <div className="mt-2 mb-2">
                    <TableHeaderTooltip header="Fecha" tooltip={tableHeaderTooltips.receiptDate} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(receipt.extractedData.date).toLocaleDateString('es-PE')}
                  </p>

                  {/* Amount */}
                  <div className="mt-2 mb-1">
                    <TableHeaderTooltip header="Monto" tooltip={tableHeaderTooltips.receiptAmount} />
                  </div>
                  <p className="text-lg font-bold text-green-500 mt-1">
                    S/ {receipt.extractedData.amount.toFixed(2)}
                  </p>

                  {/* Confidence */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <TableHeaderTooltip header="Precisión" tooltip={tableHeaderTooltips.receiptConfidence} />
                      <span className="text-white">{receipt.confidence}%</span>
                    </div>
                    <Progress value={receipt.confidence} className="h-1" />
                  </div>

                  {/* Category Badge */}
                  <div className="mt-3 mb-2">
                    <TableHeaderTooltip header="Categoría" tooltip={tableHeaderTooltips.receiptCategory} />
                  </div>
                  <Badge className="mt-1 bg-blue-600 text-xs">
                    {receipt.extractedData.category}
                  </Badge>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReceipt(receipt);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingReceipt(receipt);
                      }}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReceipt(receipt.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail View */}
      {selectedReceipt && !editingReceipt && (
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedReceipt.extractedData.merchant}</CardTitle>
                <CardDescription>
                  {new Date(selectedReceipt.extractedData.date).toLocaleDateString('es-PE')}
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedReceipt(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image */}
            <div className="rounded-lg overflow-hidden bg-white/5 h-64">
              <img
                src={selectedReceipt.imageUrl}
                alt="Receipt"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Extracted Data */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Monto Total</p>
                  <p className="text-2xl font-bold text-green-500">
                    S/ {selectedReceipt.extractedData.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Precisión OCR</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {selectedReceipt.confidence}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Categoría</p>
                  <Badge className="mt-1 bg-blue-600">
                    {selectedReceipt.extractedData.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Método de Pago</p>
                  <p className="text-white font-semibold mt-1">
                    {selectedReceipt.extractedData.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm font-semibold text-white mb-3">Artículos</p>
                <div className="space-y-2">
                  {selectedReceipt.extractedData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-white/5 rounded">
                      <div>
                        <p className="text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                      <p className="text-white font-semibold">S/ {item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedReceipt.extractedData.taxAmount && (
                <div className="flex justify-between p-2 bg-white/5 rounded border border-white/10">
                  <p className="text-gray-400">Impuesto</p>
                  <p className="text-white font-semibold">
                    S/ {selectedReceipt.extractedData.taxAmount.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditingReceipt(selectedReceipt)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Editar Datos
              </Button>
              <Button
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button
                variant="outline"
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit View */}
      {editingReceipt && (
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-yellow-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-yellow-500" />
                Editar Datos del Recibo
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingReceipt(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white">Comercio</Label>
              <Input
                value={editingReceipt.extractedData.merchant}
                onChange={(e) =>
                  setEditingReceipt({
                    ...editingReceipt,
                    extractedData: {
                      ...editingReceipt.extractedData,
                      merchant: e.target.value
                    }
                  })
                }
                className="mt-1 bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Monto</Label>
                <Input
                  type="number"
                  value={editingReceipt.extractedData.amount}
                  onChange={(e) =>
                    setEditingReceipt({
                      ...editingReceipt,
                      extractedData: {
                        ...editingReceipt.extractedData,
                        amount: parseFloat(e.target.value)
                      }
                    })
                  }
                  className="mt-1 bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Categoría</Label>
                <select
                  value={editingReceipt.extractedData.category}
                  onChange={(e) =>
                    setEditingReceipt({
                      ...editingReceipt,
                      extractedData: {
                        ...editingReceipt.extractedData,
                        category: e.target.value
                      }
                    })
                  }
                  className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleSaveEdit}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setEditingReceipt(null)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
