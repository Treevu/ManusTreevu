import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, CheckCircle2, XCircle, Loader2, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRScannerProps {
  onScan: (code: string) => Promise<{ success: boolean; message: string; data?: any }>;
  title?: string;
  description?: string;
}

export function QRScanner({ onScan, title = "Escanear Cupón", description = "Apunta la cámara al código QR del cupón" }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    setError(null);
    setScanResult(null);
    
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Pausar escaneo mientras procesamos
          await scannerRef.current?.pause();
          setIsProcessing(true);
          
          try {
            const result = await onScan(decodedText);
            setScanResult(result);
            
            // Si fue exitoso, detener el escáner
            if (result.success) {
              await stopScanning();
            } else {
              // Si falló, reanudar escaneo después de 2 segundos
              setTimeout(async () => {
                setScanResult(null);
                await scannerRef.current?.resume();
              }, 2000);
            }
          } catch (err) {
            setScanResult({ success: false, message: "Error al procesar el código" });
            setTimeout(async () => {
              setScanResult(null);
              await scannerRef.current?.resume();
            }, 2000);
          } finally {
            setIsProcessing(false);
          }
        },
        () => {} // Ignorar errores de escaneo (no encontró QR)
      );
      
      setIsScanning(true);
    } catch (err: any) {
      setError(err.message || "No se pudo acceder a la cámara");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {}
    }
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
  };

  return (
    <Card className="border-0 shadow-xl bg-treevu-surface/90 backdrop-blur-sm border border-white/10 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <QrCode className="h-6 w-6 text-segment-comercio" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Container */}
        <div 
          ref={containerRef}
          className="relative aspect-square max-w-sm mx-auto bg-black/50 rounded-xl overflow-hidden"
        >
          <div id="qr-reader" className="w-full h-full" />
          
          {/* Overlay cuando no está escaneando */}
          {!isScanning && !scanResult && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <Camera className="h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-400 text-sm text-center px-4">
                Presiona el botón para activar la cámara
              </p>
            </div>
          )}

          {/* Overlay de procesamiento */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80"
              >
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-brand-primary animate-spin mx-auto mb-2" />
                  <p className="text-white">Validando cupón...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resultado del escaneo */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`absolute inset-0 flex items-center justify-center ${
                  scanResult.success ? "bg-green-900/90" : "bg-red-900/90"
                }`}
              >
                <div className="text-center p-6">
                  {scanResult.success ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="h-20 w-20 text-green-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">¡Cupón Válido!</h3>
                      <p className="text-green-200">{scanResult.message}</p>
                      {scanResult.data && (
                        <div className="mt-4 p-3 bg-white/10 rounded-lg text-left">
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-400">Cliente:</span> {scanResult.data.userName}
                          </p>
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-400">Oferta:</span> {scanResult.data.offerTitle}
                          </p>
                          <p className="text-sm text-gray-300">
                            <span className="text-gray-400">Puntos:</span> {scanResult.data.points} TreePoints
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <XCircle className="h-20 w-20 text-red-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">Cupón Inválido</h3>
                      <p className="text-red-200">{scanResult.message}</p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Marco de escaneo */}
          {isScanning && !scanResult && !isProcessing && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                {/* Esquinas animadas */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-primary rounded-br-lg" />
                
                {/* Línea de escaneo animada */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Controles */}
        <div className="flex gap-3 justify-center">
          {!isScanning && !scanResult && (
            <Button
              onClick={startScanning}
              className="bg-segment-comercio hover:bg-segment-comercio/90"
            >
              <Camera className="h-4 w-4 mr-2" />
              Activar Cámara
            </Button>
          )}
          
          {isScanning && !scanResult && (
            <Button
              onClick={stopScanning}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              Detener
            </Button>
          )}
          
          {scanResult && (
            <Button
              onClick={resetScanner}
              className="bg-segment-comercio hover:bg-segment-comercio/90"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Escanear Otro
            </Button>
          )}
        </div>

        {/* Instrucciones */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <p>Asegúrate de tener buena iluminación y que el código QR esté centrado</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default QRScanner;
