import { useState } from 'react';
import { 
  QrCode, 
  Keyboard,
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Sparkles,
  Gift,
  User,
  Clock,
  History,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { QRScanner } from './QRScanner';

interface ValidationResult {
  success: boolean;
  message: string;
  redemption?: {
    id: number;
    pointsSpent: number;
    createdAt: string;
  };
  user?: {
    id: number;
    name: string;
  };
  offer?: {
    id: number;
    title: string;
  };
}

export function CouponValidator() {
  const [couponCode, setCouponCode] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');

  const validateMutation = trpc.merchant.validateCoupon.useMutation({
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      setResult({
        success: false,
        message: error.message || 'Error al validar el cupón',
      });
    },
  });

  const { data: redemptions, isLoading: loadingRedemptions } = trpc.merchant.getRedemptions.useQuery();

  const handleQRScan = async (code: string): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const response = await validateMutation.mutateAsync({ couponCode: code });
      return {
        success: response.success,
        message: response.message,
        data: response.success ? {
          userName: response.user?.name || 'Cliente',
          offerTitle: response.offer?.title || 'Oferta',
          points: response.redemption?.pointsSpent || 0,
        } : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error al validar',
      };
    }
  };

  const handleManualValidation = () => {
    if (!couponCode.trim()) {
      setResult({
        success: false,
        message: 'Por favor, ingresa un código de cupón',
      });
      return;
    }
    
    setResult(null);
    validateMutation.mutate({ couponCode: couponCode.trim().toUpperCase() });
  };

  const handleReset = () => {
    setResult(null);
    setCouponCode('');
  };

  const todayValidations = redemptions?.filter(r => {
    const today = new Date();
    const redemptionDate = new Date(r.validatedAt || r.createdAt);
    return redemptionDate.toDateString() === today.toDateString() && r.status === 'validated';
  }).length || 0;

  const totalPointsValidated = redemptions?.filter(r => r.status === 'validated')
    .reduce((sum, r) => sum + (r.pointsSpent || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Validaciones Hoy</p>
                <p className="text-2xl font-bold text-white">{todayValidations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">TreePoints Canjeados</p>
                <p className="text-2xl font-bold text-white">{totalPointsValidated.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total Validados</p>
                <p className="text-2xl font-bold text-white">
                  {redemptions?.filter(r => r.status === 'validated').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Validator */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="scanner" className="data-[state=active]:bg-emerald-600">
            <QrCode className="h-4 w-4 mr-2" />
            Escanear QR
          </TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-emerald-600">
            <Keyboard className="h-4 w-4 mr-2" />
            Código Manual
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-emerald-600">
            <History className="h-4 w-4 mr-2" />
            Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="mt-4">
          <QRScanner 
            onScan={handleQRScan}
            title="Escanear Cupón TreePoints"
            description="Apunta la cámara al código QR del cupón del cliente"
          />
        </TabsContent>

        <TabsContent value="manual" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Keyboard className="h-5 w-5 text-emerald-400" />
                Ingresar Código Manualmente
              </CardTitle>
              <CardDescription className="text-slate-400">
                Ingresa el código del cupón que aparece debajo del QR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!result ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Código del Cupón
                    </label>
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="TV-XXXXXXXX"
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 text-center text-lg font-mono tracking-wider"
                      maxLength={12}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualValidation()}
                    />
                  </div>
                  <Button
                    onClick={handleManualValidation}
                    disabled={validateMutation.isPending || !couponCode.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {validateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Validar Cupón
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className={`rounded-lg p-6 ${
                  result.success 
                    ? 'bg-emerald-500/20 border border-emerald-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    {result.success ? (
                      <div className="relative">
                        <CheckCircle2 className="h-16 w-16 text-emerald-400" />
                        <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                    ) : (
                      <XCircle className="h-16 w-16 text-red-400" />
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold text-center mb-2 ${
                    result.success ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {result.success ? '¡Cupón Válido!' : 'Cupón Inválido'}
                  </h3>
                  
                  <p className="text-slate-300 text-center mb-4">
                    {result.message}
                  </p>

                  {result.success && result.redemption && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-slate-600/50">
                      {result.user && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Cliente
                          </span>
                          <span className="text-white font-medium">{result.user.name}</span>
                        </div>
                      )}
                      {result.offer && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            Oferta
                          </span>
                          <span className="text-white font-medium">{result.offer.title}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          TreePoints
                        </span>
                        <span className="text-emerald-400 font-medium">
                          {result.redemption.pointsSpent.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Validar Otro Cupón
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <History className="h-5 w-5 text-emerald-400" />
                Historial de Validaciones
              </CardTitle>
              <CardDescription className="text-slate-400">
                Últimas validaciones de cupones en tu comercio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRedemptions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                </div>
              ) : redemptions && redemptions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {redemptions.slice(0, 20).map((redemption) => (
                    <div 
                      key={redemption.id}
                      className={`p-3 rounded-lg border ${
                        redemption.status === 'validated'
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : redemption.status === 'pending'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-slate-800/50 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {redemption.status === 'validated' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : redemption.status === 'pending' ? (
                            <Clock className="h-5 w-5 text-yellow-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-white font-mono">
                              {redemption.couponCode}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(redemption.createdAt).toLocaleString('es-PE')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-emerald-400">
                            {redemption.pointsSpent.toLocaleString()} pts
                          </p>
                          <p className="text-xs text-slate-400 capitalize">
                            {redemption.status === 'validated' ? 'Validado' : 
                             redemption.status === 'pending' ? 'Pendiente' : 
                             redemption.status === 'expired' ? 'Expirado' : 'Cancelado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No hay validaciones aún</p>
                  <p className="text-sm text-slate-500">
                    Los cupones validados aparecerán aquí
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CouponValidator;
