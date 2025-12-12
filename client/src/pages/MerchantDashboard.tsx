import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Loader2, ArrowLeft, Store, TrendingUp, Gift, 
  Plus, Sparkles, Target, BarChart3, Percent, Settings, QrCode
} from "lucide-react";
import NotificationCenter from "@/components/NotificationCenter";
import ThemeToggle from "@/components/ThemeToggle";
import { SmartOfferGenerator } from "@/components/dashboard/SmartOfferGenerator";
import { ROICalculator } from "@/components/dashboard/ROICalculator";
import { ProgressiveDisclosure, MERCHANT_EDUCATION_STEPS } from "@/components/dashboard/ProgressiveDisclosure";
import { EducationGamification } from "@/components/EducationGamification";
import { allTutorials } from "@/lib/educationalContent";
import { Link } from "wouter";
import { useState } from "react";
import { CouponValidator } from "@/components/CouponValidator";
import { toast } from "sonner";

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [showMerchantEducation, setShowMerchantEducation] = useState(false);
  const [newOffer, setNewOffer] = useState<{
    title: string;
    description: string;
    costPoints: number;
    discountValue: string;
    category: "financial" | "lifestyle" | "emergency" | "investment";
    targetFwiSegment: "low" | "mid" | "high" | "all";
  }>({
    title: "",
    description: "",
    costPoints: 100,
    discountValue: "",
    category: "lifestyle",
    targetFwiSegment: "all",
  });

  // Queries
  const { data: stats, isLoading: statsLoading } = trpc.merchant.getStats.useQuery();
  const { data: offers, refetch: refetchOffers } = trpc.merchant.getOffers.useQuery();

  // Mutations
  const createOffer = trpc.merchant.createOffer.useMutation({
    onSuccess: () => {
      toast.success("Oferta creada exitosamente");
      refetchOffers();
      setNewOffer({
        title: "",
        description: "",
        costPoints: 100,
        discountValue: "",
        category: "lifestyle",
        targetFwiSegment: "all",
      });
    },
    onError: () => toast.error("Error al crear la oferta"),
  });

  const generateSmartOffer = trpc.merchant.generateSmartOffer.useMutation({
    onSuccess: (data) => {
      setNewOffer({
        ...newOffer,
        title: data.suggestedTitle,
        discountValue: data.suggestedDiscount,
        targetFwiSegment: data.targetSegment,
      });
      toast.success("Sugerencia generada por IA");
    },
    onError: () => toast.error("Error al generar sugerencia"),
  });

  const handleCreateOffer = () => {
    if (!newOffer.title) {
      toast.error("El título es requerido");
      return;
    }
    createOffer.mutate(newOffer);
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-segment-comercio" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white relative">
      {/* Background Effects - Same as Landing */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-segment-comercio/10 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      
      {/* Header */}
      <header className="bg-treevu-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <h1 className="text-xl font-display font-bold text-white">Panel Comerciante</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-segment-comercio" />
              <span className="font-semibold text-segment-comercio">Merchant</span>
            </div>
            <ThemeToggle />
            <NotificationCenter />
            <Link href="/settings/notifications">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Settings className="h-5 w-5 text-gray-400" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    Ofertas Activas
                    <EducationGamification
                      tutorialType="merchant"
                      steps={allTutorials.merchant.marketplace.basic.steps}
                      onComplete={() => toast.success('¡Felicidades! Has ganado 100 TreePoints por completar el tutorial del Marketplace')}
                    />
                  </p>
                  <p className="text-3xl font-bold text-segment-comercio">{stats?.activeOffers || 0}</p>
                </div>
                <Gift className="h-8 w-8 text-segment-comercio" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Redenciones</p>
                  <p className="text-3xl font-bold text-brand-primary">{stats?.totalRedemptions || 0}</p>
                </div>
                <Target className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversiones</p>
                  <p className="text-3xl font-bold text-brand-primary">{stats?.totalConversions || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-brand-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Tasa Conversión</p>
                  <p className="text-3xl font-bold text-segment-comercio">{stats?.conversionRate || 0}%</p>
                </div>
                <Percent className="h-8 w-8 text-segment-comercio" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Herramientas Premium de Comercio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <SmartOfferGenerator 
            onCreateOffer={(offer) => {
              console.log('Creating offer:', offer);
              toast.success(`Campaña "${offer.title}" creada con ${offer.discount}% de descuento`);
            }}
          />
          <ROICalculator 
            currentROI={3.8}
            totalRedemptions={stats?.totalRedemptions || 0}
            totalRevenue={45680}
          />
        </div>

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg bg-treevu-surface/50 border border-white/10">
            <TabsTrigger value="offers">Mis Ofertas</TabsTrigger>
            <TabsTrigger value="validate">Validar QR</TabsTrigger>
            <TabsTrigger value="create">Crear Oferta</TabsTrigger>
            <TabsTrigger value="analytics">Analítica</TabsTrigger>
          </TabsList>

          {/* Validate QR Tab */}
          <TabsContent value="validate" className="space-y-4">
            <CouponValidator />
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <Gift className="h-5 w-5 mr-2 text-segment-comercio" />
                  Mis Ofertas
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Gestiona tus ofertas activas en el marketplace de TreePoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {offers && offers.length > 0 ? (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-white">{offer.title}</h3>
                              {offer.isActive ? (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  Activa
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  Inactiva
                                </span>
                              )}
                            </div>
                            {offer.description && (
                              <p className="text-sm text-gray-400 mt-1">{offer.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-brand-primary font-semibold">
                                {offer.costPoints} pts
                              </span>
                              {offer.discountValue && (
                                <span className="text-brand-primary">{offer.discountValue}</span>
                              )}
                              <span className="text-gray-400">
                                Segmento: {offer.targetFwiSegment}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Redenciones</p>
                            <p className="text-xl font-bold text-brand-primary">{offer.totalRedemptions || 0}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                          <div>
                            <p className="text-xs text-gray-400">Conversiones</p>
                            <p className="font-semibold text-white">{offer.totalConversions || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Tasa</p>
                            <p className="font-semibold text-white">
                              {(offer.totalRedemptions || 0) > 0 
                                ? Math.round(((offer.totalConversions || 0) / (offer.totalRedemptions || 1)) * 100)
                                : 0}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Categoría</p>
                            <p className="font-semibold text-white capitalize">{offer.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                    <p className="text-gray-400">No tienes ofertas creadas</p>
                    <p className="text-sm text-gray-500">Crea tu primera oferta para aparecer en el marketplace</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Offer Tab */}
          <TabsContent value="create" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center text-white">
                      <Plus className="h-5 w-5 mr-2 text-segment-comercio" />
                      Crear Nueva Oferta
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Configura una nueva oferta para el marketplace de TreePoints
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => generateSmartOffer.mutate()}
                    disabled={generateSmartOffer.isPending}
                    className="border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10"
                  >
                    {generateSmartOffer.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Sugerir con IA
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">Título de la Oferta *</Label>
                    <Input
                      id="title"
                      placeholder="Ej: 20% OFF en tu próxima compra"
                      value={newOffer.title}
                      onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount" className="text-gray-300">Valor del Descuento</Label>
                    <Input
                      id="discount"
                      placeholder="Ej: 20% OFF, 2x1, $50 descuento"
                      value={newOffer.discountValue}
                      onChange={(e) => setNewOffer({ ...newOffer, discountValue: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">Descripción</Label>
                  <Input
                    id="description"
                    placeholder="Describe los términos y condiciones de la oferta"
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points" className="text-gray-300">Costo en TreePoints *</Label>
                    <Input
                      id="points"
                      type="number"
                      min={1}
                      value={newOffer.costPoints}
                      onChange={(e) => setNewOffer({ ...newOffer, costPoints: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Categoría</Label>
                    <Select
                      value={newOffer.category}
                      onValueChange={(value: any) => setNewOffer({ ...newOffer, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financiero</SelectItem>
                        <SelectItem value="lifestyle">Estilo de Vida</SelectItem>
                        <SelectItem value="emergency">Emergencia</SelectItem>
                        <SelectItem value="investment">Inversión</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Segmento FWI</Label>
                    <Select
                      value={newOffer.targetFwiSegment}
                      onValueChange={(value: any) => setNewOffer({ ...newOffer, targetFwiSegment: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="low">Bajo (0-40)</SelectItem>
                        <SelectItem value="mid">Medio (41-70)</SelectItem>
                        <SelectItem value="high">Alto (71-100)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-segment-comercio hover:bg-segment-comercio/90"
                  onClick={handleCreateOffer}
                  disabled={createOffer.isPending}
                >
                  {createOffer.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Crear Oferta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-white">
                  <BarChart3 className="h-5 w-5 mr-2 text-segment-comercio" />
                  Analítica de Rendimiento
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Métricas detalladas de tus ofertas y conversiones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Performance Summary */}
                  <div className="p-4 bg-segment-comercio/10 rounded-lg border border-segment-comercio/20">
                    <h3 className="font-semibold text-white mb-4">Resumen de Rendimiento</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Ofertas</span>
                        <span className="font-semibold text-white">{stats?.totalOffers || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Ofertas Activas</span>
                        <span className="font-semibold text-brand-primary">{stats?.activeOffers || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Redenciones Totales</span>
                        <span className="font-semibold text-brand-primary">{stats?.totalRedemptions || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Conversiones</span>
                        <span className="font-semibold text-segment-comercio">{stats?.totalConversions || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* ROI Estimation */}
                  <div className="p-4 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
                    <h3 className="font-semibold text-white mb-4">Estimación de ROI</h3>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-brand-primary">
                        {stats?.conversionRate || 0}%
                      </p>
                      <p className="text-gray-400 mt-2">Tasa de Conversión</p>
                      <p className="text-sm text-gray-500 mt-4">
                        Por cada 100 redenciones, {stats?.conversionRate || 0} se convierten en compras reales.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">Tips para mejorar conversiones</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Ofrece descuentos más atractivos para segmentos de FWI bajo</li>
                    <li>• Usa la IA para generar ofertas basadas en tendencias</li>
                    <li>• Mantén ofertas activas durante periodos de pago</li>
                    <li>• Segmenta por categoría para mejor targeting</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Merchant Education Modal */}
      <ProgressiveDisclosure
        isOpen={showMerchantEducation}
        onClose={() => setShowMerchantEducation(false)}
        title="Marketplace Treevü"
        description="Aprende a maximizar tus ventas con el marketplace de Treevü"
        steps={MERCHANT_EDUCATION_STEPS}
        onComplete={() => toast.success('¡Excelente! Ya conoces todas las funcionalidades del marketplace')}
      />
    </div>
  );
}
