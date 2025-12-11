import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, ArrowLeft, Gift, Tag, Sparkles, 
  ShoppingBag, Heart, Zap, PiggyBank
} from "lucide-react";
import { PulsingBadge } from "@/components/ui/pulsing-badge";
import { OfferGridSkeleton, Skeleton } from "@/components/ui/skeletons";
import { AnimatedButton } from "@/components/ui/animated-button";
import { StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SuccessModal } from "@/components/ui/success-modal";

export default function Offers() {
  const { user } = useAuth();
  const [selectedOffer, setSelectedOffer] = useState<{ id: number; name: string; points: number } | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redeemedOffer, setRedeemedOffer] = useState<{ name: string; points: number } | null>(null);

  // Queries
  const { data: treePoints } = trpc.treePoints.getBalance.useQuery();
  const { data: allOffers, isLoading } = trpc.offers.list.useQuery({});
  const { data: pointsHistory } = trpc.treePoints.getHistory.useQuery({ limit: 10 });

  // Mutations
  const redeemPoints = trpc.treePoints.redeem.useMutation({
    onSuccess: () => {
      toast.success("Oferta canjeada exitosamente");
    },
    onError: (error) => toast.error(error.message || "Error al canjear"),
  });

  const handleRedeemClick = (offerId: number, name: string, points: number) => {
    if ((treePoints?.balance || 0) < points) {
      toast.error("No tienes suficientes puntos");
      return;
    }
    setSelectedOffer({ id: offerId, name, points });
  };

  const handleConfirmRedeem = async () => {
    if (!selectedOffer) return;
    setIsRedeeming(true);
    try {
      await redeemPoints.mutateAsync({ offerId: selectedOffer.id, points: selectedOffer.points });
      setRedeemedOffer({ name: selectedOffer.name, points: selectedOffer.points });
      setSelectedOffer(null);
      setShowSuccessModal(true);
    } finally {
      setIsRedeeming(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial': return <PiggyBank className="h-5 w-5" />;
      case 'lifestyle': return <Heart className="h-5 w-5" />;
      case 'emergency': return <Zap className="h-5 w-5" />;
      case 'investment': return <Sparkles className="h-5 w-5" />;
      default: return <ShoppingBag className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-green-100 text-green-600';
      case 'lifestyle': return 'bg-pink-100 text-pink-600';
      case 'emergency': return 'bg-orange-100 text-orange-600';
      case 'investment': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48 bg-purple-200" />
            <Skeleton className="h-10 w-24 rounded-full bg-purple-200" />
          </div>
          {/* Balance Card Skeleton */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
            <Skeleton className="h-4 w-32 bg-white/30 mb-2" />
            <Skeleton className="h-12 w-24 bg-white/30 mb-2" />
            <Skeleton className="h-4 w-40 bg-white/30" />
          </div>
          {/* Offers Grid Skeleton */}
          <OfferGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
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
            <h1 className="text-xl font-bold text-gray-900">TreePoints & Ofertas</h1>
          </div>
          <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
            <Gift className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-purple-600">{treePoints?.balance || 0} pts</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tu Balance de TreePoints</p>
                <p className="text-5xl font-bold my-2">{treePoints?.balance || 0}</p>
                <p className="text-purple-100 text-sm">puntos disponibles</p>
              </div>
              <div className="text-right">
                <Gift className="h-20 w-20 text-white/20" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="offers" className="relative">
              Ofertas
              {allOffers && allOffers.length > 0 && (
                <span className="absolute -top-1 -right-1">
                  <PulsingBadge variant="primary" size="sm" className="px-1.5 py-0">
                    {allOffers.length}
                  </PulsingBadge>
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            {allOffers && allOffers.length > 0 ? (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allOffers.map((offer) => (
                  <StaggerItem key={offer.id}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${getCategoryColor(offer.category)}`}>
                          {getCategoryIcon(offer.category)}
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          {offer.costPoints} pts
                        </span>
                      </div>
                      <CardTitle className="text-lg mt-2">{offer.title}</CardTitle>
                      {offer.description && (
                        <CardDescription className="line-clamp-2">
                          {offer.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {offer.discountValue && (
                        <div className="flex items-center space-x-2 mb-4">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-semibold">{offer.discountValue}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500 capitalize">
                          Categoría: {offer.category}
                        </span>
                        {offer.targetFwiSegment !== 'all' && (
                          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                            FWI {offer.targetFwiSegment}
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleRedeemClick(offer.id, offer.title, offer.costPoints)}
                        disabled={(treePoints?.balance || 0) < offer.costPoints}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        {(treePoints?.balance || 0) < offer.costPoints ? 'Puntos insuficientes' : 'Canjear'}
                      </Button>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">¡Estamos preparando ofertas increíbles!</h3>
                    <p className="text-sm">Nuestros comercios aliados están creando descuentos exclusivos para ti</p>
                    <p className="text-xs text-gray-400 mt-2">Mientras tanto, sigue ganando TreePoints</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Historial de TreePoints</CardTitle>
                <CardDescription>
                  Tus últimas transacciones de puntos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pointsHistory && pointsHistory.length > 0 ? (
                  <div className="space-y-3">
                    {pointsHistory.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {tx.amount > 0 ? (
                              <Sparkles className="h-4 w-4 text-green-600" />
                            ) : (
                              <Gift className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.type === 'issued' ? 'Puntos recibidos' :
                               tx.type === 'redeemed' ? 'Canje de oferta' :
                               tx.type === 'bonus' ? 'Bonificación' :
                               'Transacción'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tx.reason || new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-bold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} pts
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No tienes transacciones de puntos</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How to Earn */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">¿Cómo ganar más TreePoints?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Sparkles className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-semibold text-green-900">+10 pts</span>
                    </div>
                    <p className="text-sm text-green-700">Registra tus gastos diariamente</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-blue-900">+50 pts</span>
                    </div>
                    <p className="text-sm text-blue-700">Mantén una racha de 7 días</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-semibold text-purple-900">+100 pts</span>
                    </div>
                    <p className="text-sm text-purple-700">Alcanza una meta de ahorro</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Sparkles className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="font-semibold text-orange-900">+25 pts</span>
                    </div>
                    <p className="text-sm text-orange-700">Mejora tu FWI Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Confirm Redeem Dialog */}
      <ConfirmDialog
        open={!!selectedOffer}
        onOpenChange={(open) => !open && setSelectedOffer(null)}
        title="Confirmar Canje"
        description={selectedOffer ? `¿Deseas canjear "${selectedOffer.name}" por ${selectedOffer.points} TreePoints? Tu balance después del canje será ${(treePoints?.balance || 0) - selectedOffer.points} puntos.` : ''}
        confirmText="Canjear Ahora"
        cancelText="Cancelar"
        variant="success"
        onConfirm={handleConfirmRedeem}
        loading={isRedeeming}
      />

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Oferta Canjeada!"
        description={redeemedOffer ? `Has canjeado "${redeemedOffer.name}" por ${redeemedOffer.points} TreePoints. Revisa tu email para obtener el código de descuento.` : ''}
        primaryAction={{
          label: "Ver Mis Canjes",
          onClick: () => {
            setShowSuccessModal(false);
            // Switch to history tab
            const historyTab = document.querySelector('[value="history"]') as HTMLButtonElement;
            historyTab?.click();
          }
        }}
        secondaryAction={{
          label: "Seguir Explorando",
          onClick: () => setShowSuccessModal(false)
        }}
      />
    </div>
  );
}
