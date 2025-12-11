import { useState, useEffect, ComponentProps } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Loader2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/hooks/useHaptic';
import { triggerSound } from '@/hooks/useSoundEffect';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

interface AnimatedButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  onClick?: () => Promise<void> | void;
  onSuccess?: () => void;
  onError?: () => void;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  resetDelay?: number;
  children: React.ReactNode;
}

/**
 * AnimatedButton - Botón con micro-animaciones de feedback
 * Muestra estados de loading, success y error con animaciones suaves
 */
export function AnimatedButton({
  onClick,
  onSuccess,
  onError,
  successMessage = '¡Listo!',
  errorMessage = 'Error',
  loadingMessage,
  resetDelay = 2000,
  children,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');

  useEffect(() => {
    if (state === 'success' || state === 'error') {
      const timer = setTimeout(() => {
        setState('idle');
      }, resetDelay);
      return () => clearTimeout(timer);
    }
  }, [state, resetDelay]);

  const handleClick = async () => {
    if (state !== 'idle' || !onClick) return;
    
    setState('loading');
    try {
      await onClick();
      setState('success');
      triggerHaptic('success'); // Haptic feedback en éxito
      triggerSound('success'); // Sound effect en éxito
      onSuccess?.();
    } catch (error) {
      setState('error');
      triggerHaptic('error'); // Haptic feedback en error
      triggerSound('error'); // Sound effect en error
      onError?.();
    }
  };

  const stateStyles = {
    idle: '',
    loading: 'cursor-wait',
    success: 'bg-emerald-500 hover:bg-emerald-500 border-emerald-500',
    error: 'bg-red-500 hover:bg-red-500 border-red-500',
  };

  const iconVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        stateStyles[state],
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.span>
        )}

        {state === 'loading' && (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingMessage || children}
          </motion.span>
        )}

        {state === 'success' && (
          <motion.span
            key="success"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              <Check className="h-4 w-4" />
            </motion.span>
            {successMessage}
          </motion.span>
        )}

        {state === 'error' && (
          <motion.span
            key="error"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-2"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              <X className="h-4 w-4" />
            </motion.span>
            {errorMessage}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple effect on success */}
      {state === 'success' && (
        <motion.span
          className="absolute inset-0 bg-white/20 rounded-md"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </Button>
  );
}

export default AnimatedButton;
