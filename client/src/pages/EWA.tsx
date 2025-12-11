import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Loader2, ArrowLeft, Wallet, TrendingUp, Clock, 
  CheckCircle2, AlertCircle, DollarSign
} from "lucide-react";
import { EwaIcon } from "@/components/ui/ewa-icon";
import { PulsingBadge } from "@/components/ui/pulsing-badge";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SuccessModal } from "@/components/ui/success-modal";

export default function EWA() {
  const { user } = useAuth();
  const [requestAmount, setRequestAmount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Queries
  const { data: available, isLoading: availableLoading, refetch } = trpc.ewa.getAvailable.useQuery();
  const { data: history } = trpc.ewa.list.useQuery();

  // Mutations
  const requestEwa = trpc.ewa.request.useMutation({
    onSuccess: (data) => {
      toast.success(`Solicitud enviada. Fee: $${(data.fee / 100).toFixed(2)}`);
      setRequestAmount(0);
      refetch();
    },
    onError: (error) => toast.error(error.message || "Error al procesar la solicitud"),
  });

  const handleRequestClick = () => {
    if (requestAmount < 1000) {
      toast.error("El monto mínimo es $10.00");
      return;
    }
    if (requestAmount > (available?.available || 0)) {
      toast.error("El monto excede tu disponible");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmRequest = async () => {
    setIsProcessing(true);
    try {
      await requestEwa.mutateAsync({ amount: requestAmount });
      setShowConfirmDialog(false);
      setApprovedAmount(requestAmount);
      setShowSuccessModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (availableLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  const maxAvailable = available?.available || 0;
  const hasPending = available?.reason === 'pending_request';
  const fee = Math.floor(requestAmount * 0.025);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Adelanto de Salario</h1>
          </div>
          <div className="flex items-center space-x-2">
            <EwaIcon className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-600">EWA</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Available Amount Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-green-100 text-sm">Disponible para adelanto</p>
                {maxAvailable > 0 && (
                  <PulsingBadge variant="success" className="bg-white/20 border-white/30 text-white">
                    Disponible
                  </PulsingBadge>
                )}
              </div>
              <p className="text-5xl font-bold my-2">
                ${(maxAvailable / 100).toFixed(2)}
              </p>
              <p className="text-green-100 text-sm">
                {available?.daysWorked} días trabajados este mes
              </p>
            </div>
            {available?.fwiScore && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span>Tu FWI Score</span>
                  <span className="font-semibold">{available.fwiScore}/100</span>
                </div>
                <Progress value={available.fwiScore} className="mt-2 bg-white/20" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Section */}
        {hasPending ? (
          <Card className="mb-8 border-0 shadow-md bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900">Solicitud en proceso</h3>
                  <p className="text-sm text-yellow-700">
                    Tienes una solicitud pendiente de ${((available?.pendingAmount || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : maxAvailable > 0 ? (
          <Card className="mb-8 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Solicitar Adelanto</CardTitle>
              <CardDescription>
                Selecciona el monto que deseas adelantar. Fee: 2.5%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Slider */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monto a solicitar</span>
                  <span className="font-semibold text-green-600">
                    ${(requestAmount / 100).toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[requestAmount]}
                  onValueChange={(value) => setRequestAmount(value[0])}
                  max={maxAvailable}
                  min={0}
                  step={100}
                  className="[&>span:first-child]:bg-green-100 [&_[role=slider]]:bg-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>$0</span>
                  <span>${(maxAvailable / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((percent) => (
                  <Button
                    key={percent}
                    variant="outline"
                    size="sm"
                    onClick={() => setRequestAmount(Math.floor(maxAvailable * (percent / 100)))}
                    className={requestAmount === Math.floor(maxAvailable * (percent / 100)) 
                      ? "border-green-500 bg-green-50 text-green-700" 
                      : ""
                    }
                  >
                    {percent}%
                  </Button>
                ))}
              </div>

              {/* Summary */}
              {requestAmount > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto solicitado</span>
                    <span className="font-semibold">${(requestAmount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Fee (2.5%)</span>
                    <span>-${(fee / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Recibirás</span>
                    <span className="font-bold text-green-600">
                      ${((requestAmount - fee) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleRequestClick}
                disabled={requestAmount < 1000}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Solicitar Adelanto
              </Button>

              <p className="text-xs text-center text-gray-500">
                El monto será descontado de tu próximo pago de nómina
              </p>

              {/* Confirm Dialog */}
              <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Confirmar Solicitud de Adelanto"
                description={`Estás a punto de solicitar un adelanto de $${(requestAmount / 100).toFixed(2)}. Se descontará $${(fee / 100).toFixed(2)} de comisión (2.5%) y recibirás $${((requestAmount - fee) / 100).toFixed(2)} en tu cuenta. El monto total será descontado de tu próximo pago de nómina.`}
                confirmText="Confirmar Adelanto"
                cancelText="Cancelar"
                variant="success"
                onConfirm={handleConfirmRequest}
                loading={isProcessing}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-0 shadow-md bg-gray-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sin disponible</h3>
                  <p className="text-sm text-gray-600">
                    {(available?.fwiScore || 0) < 40 
                      ? `¡Estás a ${40 - (available?.fwiScore || 0)} puntos de desbloquear adelantos! Mejora tu FWI registrando gastos y cumpliendo metas.`
                      : "Tu monto disponible se actualiza cada quincena según tu salario devengado"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How it Works */}
        <Card className="mb-8 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">¿Cómo funciona?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium">Solicita tu adelanto</p>
                  <p className="text-sm text-gray-500">
                    Elige el monto que necesitas (hasta 50% de lo ganado)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium">Aprobación automática</p>
                  <p className="text-sm text-gray-500">
                    Si tu FWI Score es 40+, la aprobación es instantánea
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium">Recibe tu dinero</p>
                  <p className="text-sm text-gray-500">
                    El monto se deposita en tu cuenta en menos de 2 horas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Historial de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            {history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        request.status === 'disbursed' ? 'bg-green-100' :
                        request.status === 'rejected' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        {request.status === 'disbursed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : request.status === 'rejected' ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">${(request.amount / 100).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'disbursed' ? 'bg-green-100 text-green-700' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      request.status === 'processing_transfer' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {request.status === 'disbursed' ? 'Depositado' :
                       request.status === 'rejected' ? 'Rechazado' :
                       request.status === 'processing_transfer' ? 'Procesando' :
                       'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Wallet className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>¡Aún no has usado tu adelanto!</p>
                <p className="text-sm text-gray-400 mt-1">Cuando lo necesites, estará disponible para ti</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Adelanto Aprobado!"
        description={`Tu adelanto de $${(approvedAmount / 100).toFixed(2)} ha sido aprobado. El dinero estará en tu cuenta en menos de 2 horas.`}
        primaryAction={{
          label: "Ver Historial",
          onClick: () => {
            setShowSuccessModal(false);
            // Scroll to history section
            document.querySelector('[class*="Historial"]')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        secondaryAction={{
          label: "Cerrar",
          onClick: () => setShowSuccessModal(false)
        }}
      />
    </div>
  );
}
