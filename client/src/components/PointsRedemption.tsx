import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Gift, Zap, Heart, Smartphone, BookOpen, ShoppingBag, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface RedemptionOffer {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  category: 'gift' | 'discount' | 'service' | 'education' | 'experience';
  icon: React.ReactNode;
  image?: string;
  available: boolean;
  quantity?: number;
  expiresAt?: string;
}

interface PointsRedemptionProps {
  currentPoints: number;
  onRedemptionSuccess?: () => void;
}

const REDEMPTION_OFFERS: RedemptionOffer[] = [
  {
    id: 1,
    name: 'Amazon Gift Card $10',
    description: 'Tarjeta de regalo de Amazon por $10 USD',
    pointsCost: 500,
    category: 'gift',
    icon: <ShoppingBag className="w-6 h-6" />,
    available: true,
    quantity: 50,
  },
  {
    id: 2,
    name: 'Starbucks Card $5',
    description: 'Tarjeta de regalo de Starbucks por $5 USD',
    pointsCost: 250,
    category: 'gift',
    icon: <Gift className="w-6 h-6" />,
    available: true,
    quantity: 100,
  },
  {
    id: 3,
    name: 'Netflix 1 Month',
    description: 'Suscripción a Netflix por 1 mes',
    pointsCost: 750,
    category: 'service',
    icon: <Smartphone className="w-6 h-6" />,
    available: true,
    quantity: 30,
  },
  {
    id: 4,
    name: 'Financial Course',
    description: 'Acceso a curso de finanzas personales premium',
    pointsCost: 1000,
    category: 'education',
    icon: <BookOpen className="w-6 h-6" />,
    available: true,
    quantity: 20,
  },
  {
    id: 5,
    name: 'Spotify 3 Months',
    description: 'Suscripción a Spotify por 3 meses',
    pointsCost: 1200,
    category: 'service',
    icon: <Zap className="w-6 h-6" />,
    available: true,
    quantity: 25,
  },
  {
    id: 6,
    name: 'Wellness Package',
    description: 'Paquete de bienestar: meditación + fitness',
    pointsCost: 800,
    category: 'experience',
    icon: <Heart className="w-6 h-6" />,
    available: true,
    quantity: 15,
  },
];

export default function PointsRedemption({ currentPoints, onRedemptionSuccess }: PointsRedemptionProps) {
  const [selectedOffer, setSelectedOffer] = useState<RedemptionOffer | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const redeemMutation = (trpc as any).treePoints?.redeem?.useMutation?.({
    onSuccess: () => {
      toast.success('¡Canje exitoso! Tu premio será enviado pronto.');
      setSelectedOffer(null);
      setIsConfirming(false);
      onRedemptionSuccess?.();
    },
    onError: (error: any) => {
      toast.error('Error al canjear puntos: ' + (error?.message || 'Intenta de nuevo'));
    },
  }) as any;

  const handleRedeem = async (offer: RedemptionOffer) => {
    if (currentPoints < offer.pointsCost) {
      toast.error(`No tienes suficientes puntos. Necesitas ${offer.pointsCost - currentPoints} puntos más.`);
      return;
    }

    setSelectedOffer(offer);
    setIsConfirming(true);
  };

  const confirmRedeem = async () => {
    if (!selectedOffer) return;

    try {
      await redeemMutation.mutateAsync({
        offerId: selectedOffer.id,
        pointsAmount: selectedOffer.pointsCost,
      });
    } catch (error) {
      console.error('Redemption error:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gift':
        return 'bg-pink-100 text-pink-800';
      case 'discount':
        return 'bg-green-100 text-green-800';
      case 'service':
        return 'bg-blue-100 text-blue-800';
      case 'education':
        return 'bg-purple-100 text-purple-800';
      case 'experience':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      gift: 'Regalo',
      discount: 'Descuento',
      service: 'Servicio',
      education: 'Educación',
      experience: 'Experiencia',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-primary/20 to-segment-empresa/20 backdrop-blur-sm border border-brand-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Tus TreePoints Disponibles</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-4xl font-bold text-white">{currentPoints}</span>
                <span className="text-lg text-gray-400">puntos</span>
              </div>
            </div>
            <Gift className="h-16 w-16 text-brand-primary/30" />
          </div>
        </CardContent>
      </Card>

      {/* Redemption Offers */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Ofertas Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REDEMPTION_OFFERS.map((offer) => {
            const canRedeem = currentPoints >= offer.pointsCost;
            const pointsNeeded = Math.max(0, offer.pointsCost - currentPoints);

            return (
              <Card
                key={offer.id}
                className={`border-0 shadow-lg backdrop-blur-sm border border-white/10 transition-all ${
                  canRedeem
                    ? 'bg-treevu-surface/80 hover:shadow-xl hover:border-brand-primary/50'
                    : 'bg-treevu-surface/50 opacity-75'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 rounded-lg text-brand-primary">
                        {offer.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base text-white">{offer.name}</CardTitle>
                        <Badge className={`mt-1 ${getCategoryColor(offer.category)}`}>
                          {getCategoryLabel(offer.category)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-gray-400">{offer.description}</p>

                  {/* Quantity */}
                  {offer.quantity && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>Disponibles: {offer.quantity}</span>
                    </div>
                  )}

                  {/* Points Cost */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Costo</span>
                      <span className="text-lg font-bold text-brand-primary">{offer.pointsCost} pts</span>
                    </div>

                    {!canRedeem && pointsNeeded > 0 && (
                      <div className="flex items-center space-x-2 text-xs text-orange-400 bg-orange-500/10 p-2 rounded mb-3">
                        <AlertCircle className="w-4 h-4" />
                        <span>Te faltan {pointsNeeded} puntos</span>
                      </div>
                    )}

                    {/* Redeem Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleRedeem(offer)}
                          disabled={!canRedeem || redeemMutation.isPending}
                          className={`w-full ${
                            canRedeem
                              ? 'bg-brand-primary hover:bg-brand-secondary'
                              : 'bg-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {redeemMutation.isPending ? 'Procesando...' : 'Canjear'}
                        </Button>
                      </DialogTrigger>

                      {/* Confirmation Dialog */}
                      {selectedOffer?.id === offer.id && (
                        <DialogContent className="bg-treevu-surface border border-white/10">
                          <DialogHeader>
                            <DialogTitle className="text-white">Confirmar Canje</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              ¿Deseas canjear {offer.pointsCost} TreePoints por {offer.name}?
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Summary */}
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400">Puntos a usar</span>
                                <span className="font-bold text-white">{offer.pointsCost}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Puntos restantes</span>
                                <span className="font-bold text-brand-primary">
                                  {currentPoints - offer.pointsCost}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                              Tu premio será enviado a tu correo electrónico en 24-48 horas.
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedOffer(null);
                                  setIsConfirming(false);
                                }}
                                className="flex-1 border-white/20 text-white hover:bg-white/10"
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={confirmRedeem}
                                disabled={redeemMutation.isPending}
                                className="flex-1 bg-brand-primary hover:bg-brand-secondary"
                              >
                                {redeemMutation.isPending ? (
                                  <>Procesando...</>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirmar Canje
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Redemption History */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Gift className="h-5 w-5 mr-2 text-brand-primary" />
            Historial de Canjes
          </CardTitle>
          <CardDescription className="text-gray-400">
            Tus canjes recientes y estado de entrega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Amazon Gift Card $10', date: 'Hace 2 días', status: 'Entregado' },
              { name: 'Starbucks Card $5', date: 'Hace 1 semana', status: 'Entregado' },
              { name: 'Netflix 1 Month', date: 'Hace 10 días', status: 'En proceso' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <Badge className={item.status === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Consejos para Ganar Más Puntos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-brand-primary mt-1">•</span>
              <span>Registra tus gastos diariamente para ganar puntos automáticamente</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-brand-primary mt-1">•</span>
              <span>Completa tutoriales educativos para bonificaciones extra</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-brand-primary mt-1">•</span>
              <span>Alcanza metas financieras para desbloquear premios especiales</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-brand-primary mt-1">•</span>
              <span>Participa en encuestas de bienestar para ganar puntos bonus</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
