import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users,
  Gift,
  Copy,
  Check,
  Share2,
  Mail,
  Loader2,
  Coins,
  UserPlus,
  Trophy,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Referrals() {
  const { user, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Get referral code
  const { data: codeData, isLoading: codeLoading } = trpc.referrals.getMyCode.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Get referral stats
  const { data: stats, isLoading: statsLoading } = trpc.referrals.getMyStats.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Get referral history
  const { data: referrals, isLoading: referralsLoading } = trpc.referrals.getMyReferrals.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Create invite mutation
  const createInvite = trpc.referrals.createInvite.useMutation({
    onSuccess: () => {
      toast.success('Invitación enviada correctamente');
      setInviteEmail('');
    },
    onError: (error) => {
      toast.error(error.message || 'Error al enviar invitación');
    },
  });

  const referralCode = codeData?.code || '';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Únete a Treevü',
          text: `¡Únete a Treevü y mejora tu bienestar financiero! Usa mi código de referido: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendInvite = () => {
    if (!inviteEmail) {
      toast.error('Ingresa un email válido');
      return;
    }
    createInvite.mutate({ email: inviteEmail });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Inicia sesión</h2>
            <p className="text-gray-500 mb-4">Necesitas iniciar sesión para ver tu programa de referidos</p>
            <Link href="/app">
              <Button>Ir al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/app">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Programa de Referidos</h1>
              <p className="text-sm text-gray-500">Invita amigos y gana TreePoints</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">¡Gana 500 TreePoints!</h2>
                  <p className="text-green-100">Por cada amigo que se registre con tu código</p>
                </div>
              </div>

              {/* Referral Code */}
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-sm text-green-100 mb-2">Tu código de referido:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-lg px-4 py-3 text-2xl font-mono font-bold text-green-600 text-center tracking-widest">
                    {codeLoading ? '...' : referralCode}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={handleCopyCode}
                    className="h-12 w-12"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar enlace
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <UserPlus className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{stats?.totalInvited || 0}</p>
                <p className="text-sm text-gray-500">Invitados</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{stats?.totalRegistered || 0}</p>
                <p className="text-sm text-gray-500">Registrados</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{stats?.totalRewarded || 0}</p>
                <p className="text-sm text-gray-500">Recompensados</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6 text-center">
                <Coins className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                <p className="text-2xl font-bold">{(stats?.totalPointsEarned || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">TreePoints ganados</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Send Invite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Enviar invitación por email
              </CardTitle>
              <CardDescription>
                Envía una invitación directa a un amigo o compañero
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendInvite}
                  disabled={createInvite.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createInvite.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Historial de referidos
              </CardTitle>
              <CardDescription>
                Tus invitaciones y su estado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referralsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                </div>
              ) : referrals && referrals.length > 0 ? (
                <div className="space-y-3">
                  {referrals.map((referral: any) => (
                    <div 
                      key={referral.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {referral.referredEmail || `Código: ${referral.referralCode}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(referral.createdAt).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          referral.status === 'rewarded' ? 'default' :
                          referral.status === 'registered' ? 'secondary' :
                          'outline'
                        }
                        className={
                          referral.status === 'rewarded' ? 'bg-green-500' :
                          referral.status === 'registered' ? 'bg-blue-500 text-white' :
                          ''
                        }
                      >
                        {referral.status === 'rewarded' ? 'Recompensado' :
                         referral.status === 'registered' ? 'Registrado' :
                         referral.status === 'expired' ? 'Expirado' :
                         'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Aún no has invitado a nadie</p>
                  <p className="text-sm text-gray-400">Comparte tu código y gana TreePoints</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo funciona?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-green-600">1</span>
                  </div>
                  <h4 className="font-semibold mb-1">Comparte tu código</h4>
                  <p className="text-sm text-gray-500">Envía tu código único a amigos y compañeros</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold mb-1">Ellos se registran</h4>
                  <p className="text-sm text-gray-500">Cuando se registren con tu código, ambos ganan</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-green-600">3</span>
                  </div>
                  <h4 className="font-semibold mb-1">Ganan TreePoints</h4>
                  <p className="text-sm text-gray-500">Tú ganas 500 y tu amigo 250 TreePoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
