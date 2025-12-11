import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  User,
  Trophy,
  Star,
  Flame,
  Target,
  Coins,
  TrendingUp,
  Calendar,
  Share2,
  Copy,
  Check,
  Loader2,
  Award,
  Zap,
  Heart,
  Shield,
  Crown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Volume2, VolumeX, Vibrate, Sparkles, Settings } from 'lucide-react';

// Mock user profile data
const mockProfile = {
  id: 1,
  name: 'María García',
  email: 'maria.garcia@empresa.com',
  role: 'employee',
  department: 'Tecnología',
  joinedAt: '2024-03-15',
  level: 12,
  treePoints: 15420,
  fwiScore: 92,
  streakDays: 45,
  goalsCompleted: 8,
  goalsTotal: 10,
  totalTransactions: 156,
  totalSaved: 45000,
  ewaUsed: 3,
  rank: 1,
};

// Mock achievements
const mockAchievements = [
  { id: 1, name: 'Primera Meta', description: 'Completa tu primera meta financiera', icon: '🎯', unlocked: true, unlockedAt: '2024-04-01', rarity: 'common' },
  { id: 2, name: 'Racha de 7 días', description: 'Mantén una racha de 7 días consecutivos', icon: '🔥', unlocked: true, unlockedAt: '2024-04-10', rarity: 'common' },
  { id: 3, name: 'Racha de 30 días', description: 'Mantén una racha de 30 días consecutivos', icon: '⚡', unlocked: true, unlockedAt: '2024-05-15', rarity: 'rare' },
  { id: 4, name: 'Maestro del Ahorro', description: 'Ahorra más de $10,000', icon: '💰', unlocked: true, unlockedAt: '2024-06-01', rarity: 'epic' },
  { id: 5, name: 'FWI Elite', description: 'Alcanza un FWI Score de 90+', icon: '🏆', unlocked: true, unlockedAt: '2024-07-01', rarity: 'legendary' },
  { id: 6, name: 'Social Butterfly', description: 'Refiere a 5 compañeros', icon: '🦋', unlocked: false, rarity: 'rare' },
];

const RARITY_COLORS = {
  common: 'bg-gray-100 text-gray-700 border-gray-300',
  rare: 'bg-blue-100 text-blue-700 border-blue-300',
  epic: 'bg-purple-100 text-purple-700 border-purple-300',
  legendary: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border-amber-300',
};

const RARITY_LABELS = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
};

function StatCard({ icon: Icon, label, value, subValue, color }: { 
  icon: any; 
  label: string; 
  value: string | number; 
  subValue?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 border shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold">{value}</p>
          {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function AchievementBadge({ achievement }: { achievement: typeof mockAchievements[0] }) {
  const rarityClass = RARITY_COLORS[achievement.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative p-4 rounded-xl border-2 ${rarityClass} ${!achievement.unlocked ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{achievement.icon}</div>
        <h4 className="font-semibold text-sm">{achievement.name}</h4>
        <p className="text-xs mt-1 opacity-75">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-xs mt-2 opacity-60">
            {new Date(achievement.unlockedAt).toLocaleDateString('es-MX')}
          </p>
        )}
      </div>
      <Badge 
        variant="outline" 
        className={`absolute -top-2 -right-2 text-xs ${rarityClass}`}
      >
        {RARITY_LABELS[achievement.rarity as keyof typeof RARITY_LABELS]}
      </Badge>
      {!achievement.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
          <Shield className="w-8 h-8 text-gray-400" />
        </div>
      )}
    </motion.div>
  );
}

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Determine if viewing own profile or someone else's
  const isOwnProfile = !userId || (user && String(user.id) === userId);
  const profileUserId = userId ? parseInt(userId) : user?.id;

  // Fetch user profile data (endpoint uses current user from context)
  const { data: profileData, isLoading: profileLoading } = trpc.users.getProfile.useQuery(
    undefined,
    { enabled: Boolean(profileUserId && isOwnProfile) }
  );

  // Fetch user achievements (endpoint doesn't require userId, uses current user)
  const { data: userAchievements, isLoading: achievementsLoading } = trpc.achievements.getUserAchievements.useQuery(
    undefined,
    { enabled: Boolean(profileUserId && isOwnProfile) }
  );

  // Use API data or fallback to mock - cast to any for flexibility
  const profile: any = profileData || mockProfile;
  const achievements: any[] = userAchievements?.length ? userAchievements : mockAchievements;

  const unlockedCount = achievements.filter((a: any) => a.unlocked).length;
  const levelProgress = ((profile.treePoints % 1000) / 1000) * 100;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${profile.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile.name} en Treevü`,
          text: `¡Mira mi progreso en bienestar financiero! FWI Score: ${profile.fwiScore}, Nivel: ${profile.level}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/profile/${profile.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Enlace copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isOwnProfile ? 'Mi Perfil' : `Perfil de ${profile.name}`}
                </h1>
                <p className="text-sm text-gray-500">
                  {isOwnProfile ? 'Tu progreso y logros' : 'Estadísticas públicas'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copiado' : 'Copiar enlace'}
              </Button>
              <Button variant="default" size="sm" onClick={handleShare} className="bg-green-600 hover:bg-green-700">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-white text-green-600 text-2xl font-bold">
                  {profile.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  {profile.rank === 1 && <Crown className="w-6 h-6 text-yellow-300" />}
                </div>
                <p className="text-green-100">{profile.department || 'Sin departamento'}</p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    Nivel {profile.level}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Rank #{profile.rank || 'N/A'}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {unlockedCount} logros
                  </Badge>
                </div>
              </div>

              {/* FWI Score Circle */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">{profile.fwiScore}</span>
                    <span className="text-xs text-gray-500">FWI Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Progreso al nivel {profile.level + 1}</span>
                <span>{profile.treePoints?.toLocaleString()} TreePoints</span>
              </div>
              <Progress value={levelProgress} className="h-2 bg-white/20" />
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Flame} 
            label="Racha" 
            value={`${profile.streakDays} días`}
            color="bg-orange-100 text-orange-600"
          />
          <StatCard 
            icon={Target} 
            label="Metas" 
            value={`${profile.goalsCompleted}/${profile.goalsTotal || 10}`}
            subValue="completadas"
            color="bg-blue-100 text-blue-600"
          />
          <StatCard 
            icon={Coins} 
            label="TreePoints" 
            value={profile.treePoints?.toLocaleString() || 0}
            color="bg-green-100 text-green-600"
          />
          <StatCard 
            icon={Trophy} 
            label="Logros" 
            value={`${unlockedCount}/${achievements.length}`}
            subValue="desbloqueados"
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Logros
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Preferencias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Logros Desbloqueados
                </CardTitle>
                <CardDescription>
                  {unlockedCount} de {achievements.length} logros obtenidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement: any, index: number) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AchievementBadge achievement={achievement} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Resumen Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total ahorrado</span>
                    <span className="font-bold text-green-600">
                      ${(profile.totalSaved / 100)?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Transacciones registradas</span>
                    <span className="font-bold">{profile.totalTransactions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Adelantos EWA usados</span>
                    <span className="font-bold">{profile.ewaUsed || 0}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Información
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Miembro desde</span>
                    <span className="font-bold">
                      {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('es-MX', { 
                        year: 'numeric', 
                        month: 'long' 
                      }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Departamento</span>
                    <span className="font-bold">{profile.department || 'No asignado'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Posición en ranking</span>
                    <span className="font-bold text-green-600">#{profile.rank || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <PreferencesSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Componente de preferencias
function PreferencesSection() {
  const { preferences, toggleSound, toggleHaptic, toggleAnimations } = useUserPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Preferencias de la App
        </CardTitle>
        <CardDescription>
          Personaliza tu experiencia en Treevü
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sonidos */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {preferences.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-green-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <Label htmlFor="sound-toggle" className="font-medium">
                Efectos de sonido
              </Label>
              <p className="text-sm text-gray-500">
                Sonidos al completar acciones y celebraciones
              </p>
            </div>
          </div>
          <Switch
            id="sound-toggle"
            checked={preferences.soundEnabled}
            onCheckedChange={toggleSound}
          />
        </div>

        {/* Haptic */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Vibrate className={`w-5 h-5 ${preferences.hapticEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <Label htmlFor="haptic-toggle" className="font-medium">
                Vibración
              </Label>
              <p className="text-sm text-gray-500">
                Feedback háptico en dispositivos móviles
              </p>
            </div>
          </div>
          <Switch
            id="haptic-toggle"
            checked={preferences.hapticEnabled}
            onCheckedChange={toggleHaptic}
          />
        </div>

        {/* Animaciones */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Sparkles className={`w-5 h-5 ${preferences.animationsEnabled ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <Label htmlFor="animations-toggle" className="font-medium">
                Animaciones
              </Label>
              <p className="text-sm text-gray-500">
                Transiciones y efectos visuales
              </p>
            </div>
          </div>
          <Switch
            id="animations-toggle"
            checked={preferences.animationsEnabled}
            onCheckedChange={toggleAnimations}
          />
        </div>

        <p className="text-xs text-center text-gray-400 pt-4">
          Las preferencias se guardan automáticamente en tu dispositivo
        </p>
      </CardContent>
    </Card>
  );
}
