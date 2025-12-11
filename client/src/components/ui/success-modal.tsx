import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Sparkles } from 'lucide-react';
import { Button } from './button';
import { useHaptic } from '@/hooks/useHaptic';
import { useSoundEffect } from '@/hooks/useSoundEffect';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  confetti?: boolean;
}

/**
 * SuccessModal - Modal de éxito con confetti y animaciones
 */
export function SuccessModal({
  open,
  onClose,
  title,
  description,
  primaryAction,
  secondaryAction,
  confetti = true,
}: SuccessModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);
  const { vibrate } = useHaptic();
  const { play: playSuccess } = useSoundEffect();

  useEffect(() => {
    if (open && confetti) {
      // Generar partículas de confetti
      const colors = ['#10B981', '#34D399', '#6EE7B7', '#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);
      
      // Feedback sensorial
      vibrate('success');
      playSuccess('celebration');
    }
  }, [open, confetti, vibrate, playSuccess]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && primaryAction) {
        primaryAction.onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, primaryAction]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Confetti */}
          {confetti && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ 
                    y: -20, 
                    x: `${particle.x}vw`,
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  animate={{ 
                    y: '100vh',
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                    scale: [1, 1.2, 0.8, 1],
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute w-3 h-3 rounded-sm"
                  style={{ backgroundColor: particle.color }}
                />
              ))}
            </div>
          )}

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-b from-treevu-surface to-treevu-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Success icon with animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1, damping: 15 }}
                  className="relative mx-auto w-20 h-20 mb-6"
                >
                  <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping" />
                  <div className="relative w-full h-full bg-gradient-to-br from-brand-primary to-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="h-6 w-6 text-yellow-400" />
                  </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  {title}
                </motion.h2>

                {/* Description */}
                {description && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 mb-6"
                  >
                    {description}
                  </motion.p>
                )}

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  {secondaryAction && (
                    <Button
                      variant="outline"
                      onClick={secondaryAction.onClick}
                      className="border-white/20 text-gray-300 hover:bg-white/10"
                    >
                      {secondaryAction.label}
                    </Button>
                  )}
                  {primaryAction && (
                    <Button
                      onClick={primaryAction.onClick}
                      className="bg-brand-primary hover:bg-brand-primary/90"
                    >
                      {primaryAction.label}
                    </Button>
                  )}
                  {!primaryAction && !secondaryAction && (
                    <Button
                      onClick={onClose}
                      className="bg-brand-primary hover:bg-brand-primary/90"
                    >
                      ¡Entendido!
                    </Button>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook para usar SuccessModal de forma imperativa
 */
export function useSuccessModal() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  }>({
    open: false,
    title: '',
  });

  const show = (options: Omit<typeof state, 'open'>) => {
    setState({ ...options, open: true });
  };

  const hide = () => {
    setState(prev => ({ ...prev, open: false }));
  };

  const SuccessModalComponent = () => (
    <SuccessModal
      open={state.open}
      onClose={hide}
      title={state.title}
      description={state.description}
      primaryAction={state.primaryAction}
      secondaryAction={state.secondaryAction}
    />
  );

  return { show, hide, SuccessModal: SuccessModalComponent };
}
