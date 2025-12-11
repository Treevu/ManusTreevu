import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { triggerHaptic } from '@/hooks/useHaptic';
import { triggerSound } from '@/hooks/useSoundEffect';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

const COLORS = [
  '#10B981', // emerald (brand-primary)
  '#34D399', // emerald-400
  '#6EE7B7', // emerald-300
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#F59E0B', // amber
  '#EC4899', // pink
];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));
}

interface CelebrationProps {
  show: boolean;
  onComplete?: () => void;
  message?: string;
  subMessage?: string;
  duration?: number;
}

/**
 * Celebration - Componente de celebración con confetti
 * Uso: <Celebration show={showCelebration} message="¡Meta completada!" />
 */
export function Celebration({ 
  show, 
  onComplete, 
  message = '¡Felicidades!',
  subMessage,
  duration = 3000 
}: CelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setConfetti(generateConfetti(50));
      setIsVisible(true);
      triggerHaptic('success'); // Haptic feedback al mostrar celebración
      triggerSound('celebration'); // Sound effect de celebración
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!show && !isVisible) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
          {/* Confetti */}
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute top-0 w-3 h-3"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `scale(${piece.scale})`,
              }}
              initial={{ 
                y: -20, 
                rotate: 0,
                opacity: 1 
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}

          {/* Center Message */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 15,
              delay: 0.2 
            }}
          >
            <div className="bg-treevu-surface/95 backdrop-blur-xl border border-brand-primary/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-center pointer-events-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {message}
              </motion.h2>
              {subMessage && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-400"
                >
                  {subMessage}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * Hook para manejar celebraciones
 */
export function useCelebration() {
  const [celebrationState, setCelebrationState] = useState<{
    show: boolean;
    message?: string;
    subMessage?: string;
  }>({ show: false });

  const celebrate = useCallback((message?: string, subMessage?: string) => {
    setCelebrationState({ show: true, message, subMessage });
  }, []);

  const hideCelebration = useCallback(() => {
    setCelebrationState({ show: false });
  }, []);

  return {
    celebrationState,
    celebrate,
    hideCelebration,
  };
}

export default Celebration;
