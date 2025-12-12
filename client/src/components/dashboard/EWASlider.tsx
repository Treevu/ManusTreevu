import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Wallet, Zap, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/locale";
import { toast } from "sonner";

interface EWASliderProps {
  maxAvailable?: number;
  operativeFee?: number;
  onRequest?: (amount: number) => void;
  isLoading?: boolean;
  onLearnMore?: () => void;
}

export function EWASlider({ 
  maxAvailable = 500, 
  operativeFee = 3.99,
  onRequest,
  isLoading = false,
  onLearnMore
}: EWASliderProps) {
  const [amount, setAmount] = useState(100);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const minAmount = 20;
  const netAmount = amount - operativeFee;

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleRequest = () => {
    if (onRequest) {
      onRequest(amount);
    }
    toast.success(`Solicitud de ${formatCurrency(amount)} enviada`);
    setShowConfirmDialog(false);
  };

  // Calcular el porcentaje del slider para el gradiente
  const percentage = ((amount - minAmount) / (maxAvailable - minAmount)) * 100;

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border-blue-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Dispersión de Nómina (EWA)
            </span>
            {onLearnMore && (
              <button
                onClick={onLearnMore}
                className="p-1 rounded-full hover:bg-blue-500/20 transition-colors group"
                title="Aprender sobre EWA"
              >
                <Info className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Monto seleccionado */}
          <div className="text-center">
            <p className="text-5xl font-bold text-white">{formatCurrency(amount)}</p>
            <p className="text-sm text-blue-300 mt-1">Monto a solicitar</p>
          </div>

          {/* Slider interactivo */}
          <div className="space-y-3">
            <Slider
              value={[amount]}
              onValueChange={handleSliderChange}
              min={minAmount}
              max={maxAvailable}
              step={10}
              className="[&_[role=slider]]:bg-blue-500 [&_[role=slider]]:border-blue-400 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-blue-500/50"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatCurrency(minAmount)}</span>
              <span>Disponible: {formatCurrency(maxAvailable)}</span>
            </div>
          </div>

          {/* Desglose transparente */}
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Monto solicitado</span>
              <span className="text-white font-medium">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                Tarifa operativa
                <Info className="h-3 w-3 opacity-50" />
              </span>
              <span className="text-amber-400">- {formatCurrency(operativeFee)}</span>
            </div>
            <div className="border-t border-gray-700 pt-3 flex justify-between">
              <span className="text-gray-300 font-medium">Neto a recibir</span>
              <span className="text-emerald-400 font-bold text-lg">{formatCurrency(netAmount)}</span>
            </div>
          </div>

          {/* Mensaje educativo */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-start gap-2">
            <Zap className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-300">
              <strong>No es deuda, es tu dinero trabajado.</strong> Este adelanto se descuenta automáticamente de tu próxima nómina sin intereses.
            </p>
          </div>

          {/* Botón de solicitud */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
            onClick={() => setShowConfirmDialog(true)}
            disabled={isLoading || amount < minAmount}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Procesando...
              </span>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Solicitar Adelanto
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              Confirmar Solicitud
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Revisa los detalles de tu adelanto de nómina
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Monto solicitado</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Recibirás</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(netAmount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400">
                  El monto será descontado automáticamente de tu próxima nómina. No genera intereses ni afecta tu historial crediticio.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleRequest}
              disabled={isLoading}
            >
              Confirmar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
