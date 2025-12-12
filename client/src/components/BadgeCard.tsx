import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  TrendingUp,
  Wallet,
  Building2,
  Store,
  GraduationCap,
  Heart,
  Crown,
  Target,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  Users,
  UserPlus,
  Award,
  Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Wallet,
  Building2,
  Store,
  GraduationCap,
  Heart,
  Crown,
  Target,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  Users,
  UserPlus,
  Award,
};

// Color mapping for Tailwind classes
const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/20' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-yellow-500/20' },
  green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/20' },
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30', glow: 'shadow-teal-500/20' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'shadow-pink-500/20' },
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', glow: 'shadow-indigo-500/20' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'shadow-violet-500/20' },
};

// Rarity styles
const rarityStyles: Record<string, { label: string; class: string }> = {
  common: { label: 'Común', class: 'bg-gray-500/20 text-gray-400' },
  rare: { label: 'Raro', class: 'bg-blue-500/20 text-blue-400' },
  epic: { label: 'Épico', class: 'bg-purple-500/20 text-purple-400' },
  legendary: { label: 'Legendario', class: 'bg-yellow-500/20 text-yellow-400' },
};

interface BadgeData {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  pointsReward: number;
  rarity: string;
}

interface BadgeCardProps {
  badge: BadgeData;
  earned?: boolean;
  earnedAt?: Date | string;
  showCelebration?: boolean;
  onCelebrationEnd?: () => void;
  compact?: boolean;
}

export function BadgeCard({
  badge,
  earned = false,
  earnedAt,
  showCelebration = false,
  onCelebrationEnd,
  compact = false,
}: BadgeCardProps) {
  const [celebrating, setCelebrating] = useState(showCelebration);
  
  const IconComponent = iconMap[badge.icon] || Award;
  const colors = colorMap[badge.color] || colorMap.emerald;
  const rarity = rarityStyles[badge.rarity] || rarityStyles.common;
  
  useEffect(() => {
    if (showCelebration && earned) {
      setCelebrating(true);
      
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;
      
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setCelebrating(false);
          onCelebrationEnd?.();
        }
      };
      
      frame();
    }
  }, [showCelebration, earned, onCelebrationEnd]);
  
  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          'relative flex items-center gap-3 p-3 rounded-lg border transition-all',
          earned ? colors.bg : 'bg-gray-800/50',
          earned ? colors.border : 'border-gray-700',
          earned && `shadow-lg ${colors.glow}`,
          !earned && 'opacity-50'
        )}
      >
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          earned ? colors.bg : 'bg-gray-700'
        )}>
          {earned ? (
            <IconComponent className={cn('w-5 h-5', colors.text)} />
          ) : (
            <Lock className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium text-sm truncate',
            earned ? 'text-white' : 'text-gray-500'
          )}>
            {badge.name}
          </p>
          {earned && badge.pointsReward > 0 && (
            <p className="text-xs text-emerald-400">+{badge.pointsReward} pts</p>
          )}
        </div>
      </motion.div>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: celebrating ? [1, 1.1, 1] : 1, 
          opacity: 1,
        }}
        transition={{ 
          duration: celebrating ? 0.5 : 0.3,
          repeat: celebrating ? 2 : 0,
        }}
      >
        <Card className={cn(
          'relative overflow-hidden p-4 transition-all duration-300',
          earned ? colors.bg : 'bg-gray-800/50',
          earned ? colors.border : 'border-gray-700',
          earned && `shadow-lg ${colors.glow}`,
          !earned && 'opacity-60 grayscale'
        )}>
          {/* Rarity badge */}
          <Badge className={cn('absolute top-2 right-2 text-xs', rarity.class)}>
            {rarity.label}
          </Badge>
          
          {/* Icon */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={celebrating ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mb-3',
                earned ? colors.bg : 'bg-gray-700',
                earned && 'ring-2 ring-offset-2 ring-offset-gray-900',
                earned && colors.border.replace('border-', 'ring-')
              )}
            >
              {earned ? (
                <IconComponent className={cn('w-8 h-8', colors.text)} />
              ) : (
                <Lock className="w-8 h-8 text-gray-500" />
              )}
            </motion.div>
            
            {/* Name */}
            <h3 className={cn(
              'font-bold text-lg mb-1',
              earned ? 'text-white' : 'text-gray-500'
            )}>
              {badge.name}
            </h3>
            
            {/* Description */}
            <p className={cn(
              'text-sm mb-3 line-clamp-2',
              earned ? 'text-gray-300' : 'text-gray-600'
            )}>
              {badge.description}
            </p>
            
            {/* Points reward */}
            {badge.pointsReward > 0 && (
              <div className={cn(
                'flex items-center gap-1 text-sm font-medium',
                earned ? 'text-emerald-400' : 'text-gray-500'
              )}>
                <Sparkles className="w-4 h-4" />
                <span>+{badge.pointsReward} TreePoints</span>
              </div>
            )}
            
            {/* Earned date */}
            {earned && earnedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Obtenida: {new Date(earnedAt).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>
          
          {/* Celebration overlay */}
          {celebrating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: 2 }}
              className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none"
            />
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Badge showcase component for profile
interface BadgeShowcaseProps {
  badges: (BadgeData & { earnedAt?: Date | string })[];
  maxDisplay?: number;
  onViewAll?: () => void;
}

export function BadgeShowcase({ badges, maxDisplay = 5, onViewAll }: BadgeShowcaseProps) {
  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;
  
  return (
    <div className="flex items-center gap-2">
      {displayBadges.map((badge) => {
        const IconComponent = iconMap[badge.icon] || Award;
        const colors = colorMap[badge.color] || colorMap.emerald;
        
        return (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.1, y: -2 }}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer',
              colors.bg,
              'ring-2 ring-offset-1 ring-offset-gray-900',
              colors.border.replace('border-', 'ring-')
            )}
            title={badge.name}
          >
            <IconComponent className={cn('w-5 h-5', colors.text)} />
          </motion.div>
        );
      })}
      
      {remaining > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onViewAll}
          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm font-medium"
        >
          +{remaining}
        </motion.button>
      )}
    </div>
  );
}
