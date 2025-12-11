import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, Gift, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EwaIcon } from '@/components/ui/ewa-icon';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido a Treevü!',
    description: 'Te guiaremos por las funcionalidades principales para que aproveches al máximo tu bienestar financiero.',
    icon: <Sparkles className="h-8 w-8 text-brand-primary" />,
    position: 'center',
  },
  {
    id: 'fwi',
    title: 'Tu FWI Score',
    description: 'El Índice de Bienestar Financiero mide tu salud financiera de 0 a 100. Mientras más alto, mejor preparado estás para imprevistos.',
    icon: <TrendingUp className="h-8 w-8 text-brand-primary" />,
    targetSelector: '[data-tour="fwi-score"]',
    position: 'bottom',
  },
  {
    id: 'ewa',
    title: 'Adelanto de Salario (EWA)',
    description: 'Accede a parte de tu salario ya trabajado cuando lo necesites. Sin intereses, solo una pequeña comisión fija.',
    icon: <EwaIcon className="h-8 w-8 text-segment-empleado" />,
    targetSelector: '[data-tour="ewa"]',
    position: 'bottom',
  },
  {
    id: 'treepoints',
    title: 'TreePoints',
    description: 'Gana puntos por registrar gastos, mantener rachas y mejorar tu FWI. Canjéalos por descuentos exclusivos.',
    icon: <Gift className="h-8 w-8 text-purple-500" />,
    targetSelector: '[data-tour="treepoints"]',
    position: 'left',
  },
  {
    id: 'goals',
    title: 'Metas Financieras',
    description: 'Establece objetivos de ahorro y recibe 100 TreePoints cada vez que completes una meta.',
    icon: <Target className="h-8 w-8 text-blue-500" />,
    targetSelector: '[data-tour="goals"]',
    position: 'top',
  },
  {
    id: 'complete',
    title: '¡Listo para comenzar!',
    description: 'Explora tu dashboard, registra tus gastos y comienza a mejorar tu bienestar financiero. ¡Estamos contigo!',
    icon: <Sparkles className="h-8 w-8 text-brand-primary" />,
    position: 'center',
  },
];

const STORAGE_KEY = 'treevu_tour_completed';

interface ProductTourProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function ProductTour({ onComplete, forceShow = false }: ProductTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Check if tour should show
  useEffect(() => {
    if (forceShow) {
      setIsActive(true);
      return;
    }
    
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // Delay tour start to let page render
      const timer = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  // Update target element position
  useEffect(() => {
    if (!isActive) return;
    
    const step = TOUR_STEPS[currentStep];
    if (step.targetSelector) {
      const element = document.querySelector(step.targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isActive]);

  const handleNext = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsActive(false);
    onComplete?.();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsActive(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleNext, handlePrev, handleSkip]);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isCentered = step.position === 'center' || !targetRect;

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (isCentered) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    if (!targetRect) return {};

    const padding = 16;
    const tooltipWidth = 360;
    const tooltipHeight = 200;

    switch (step.position) {
      case 'bottom':
        return {
          position: 'fixed',
          top: targetRect.bottom + padding,
          left: Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
        };
      case 'top':
        return {
          position: 'fixed',
          top: targetRect.top - tooltipHeight - padding,
          left: Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
        };
      case 'left':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - padding,
        };
      case 'right':
        return {
          position: 'fixed',
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + padding,
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100]"
            onClick={handleSkip}
          />

          {/* Highlight target element */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed z-[101] pointer-events-none"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                borderRadius: '12px',
                border: '2px solid #10B981',
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="z-[102] w-[360px]"
            style={getTooltipStyle()}
          >
            <div className="bg-gradient-to-b from-treevu-surface to-treevu-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>

              {/* Content */}
              <div className="p-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  {step.icon}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-center text-sm mb-6">
                  {step.description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-4">
                  {TOUR_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-brand-primary'
                          : index < currentStep
                          ? 'bg-brand-primary/50'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrev}
                    disabled={isFirstStep}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>

                  <span className="text-xs text-gray-500">
                    {currentStep + 1} / {TOUR_STEPS.length}
                  </span>

                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-brand-primary hover:bg-brand-primary/90"
                  >
                    {isLastStep ? '¡Comenzar!' : 'Siguiente'}
                    {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook para controlar el tour programáticamente
 */
export function useProductTour() {
  const [showTour, setShowTour] = useState(false);

  const startTour = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowTour(true);
  };

  const resetTour = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const isTourCompleted = () => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  };

  return { showTour, startTour, resetTour, isTourCompleted, setShowTour };
}

export default ProductTour;
