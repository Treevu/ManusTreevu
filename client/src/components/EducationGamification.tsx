import { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Star, 
  CheckCircle2, 
  BookOpen,
  Gift,
  Zap,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { trpc } from '@/lib/trpc';
import confetti from 'canvas-confetti';

interface TutorialStep {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

interface EducationGamificationProps {
  tutorialType: 'fwi' | 'ewa' | 'b2b' | 'merchant';
  steps: TutorialStep[];
  onComplete?: () => void;
  children?: React.ReactNode;
}

const TUTORIAL_POINTS: Record<string, number> = {
  fwi: 50,
  ewa: 50,
  b2b: 100,
  merchant: 100,
};

const TUTORIAL_NAMES: Record<string, string> = {
  fwi: 'FWI Score',
  ewa: 'Adelanto de Sueldo',
  b2b: 'Torre de Control',
  merchant: 'Marketplace',
};

export function EducationGamification({ 
  tutorialType, 
  steps, 
  onComplete,
  children 
}: EducationGamificationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const utils = trpc.useUtils();
  
  const { data: progress } = trpc.education.getProgress.useQuery(
    { tutorialType },
    { enabled: isOpen }
  );

  const updateProgressMutation = trpc.education.updateProgress.useMutation({
    onSuccess: (data) => {
      if (data.justCompleted && data.pointsAwarded > 0) {
        setPointsEarned(data.pointsAwarded);
        setShowCelebration(true);
        triggerConfetti();
        // Invalidate TreePoints query to update balance
        utils.treePoints.getBalance.invalidate();
      }
    },
  });

  const completeTutorialMutation = trpc.education.completeTutorial.useMutation({
    onSuccess: (data) => {
      if (data.justCompleted && data.pointsAwarded > 0) {
        setPointsEarned(data.pointsAwarded);
        setShowCelebration(true);
        triggerConfetti();
        utils.treePoints.getBalance.invalidate();
      }
      onComplete?.();
    },
  });

  // Initialize from saved progress
  useEffect(() => {
    if (progress && progress.stepsCompleted > 0) {
      setCurrentStep(Math.min(progress.stepsCompleted, steps.length - 1));
    }
  }, [progress, steps.length]);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
      });
    }, 250);
  }, []);

  const handleNext = () => {
    const nextStep = currentStep + 1;
    
    if (nextStep >= steps.length) {
      // Complete tutorial
      completeTutorialMutation.mutate({
        tutorialType,
        totalSteps: steps.length,
      });
    } else {
      setCurrentStep(nextStep);
      // Save progress
      updateProgressMutation.mutate({
        tutorialType,
        stepsCompleted: nextStep,
        totalSteps: steps.length,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowCelebration(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowCelebration(false);
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  const isCompleted = progress?.isCompleted || false;
  const potentialPoints = TUTORIAL_POINTS[tutorialType] || 50;

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className={`p-1 h-auto ${isCompleted ? 'text-emerald-400' : 'text-yellow-400 hover:text-yellow-300'}`}
        title={isCompleted ? 'Tutorial completado' : `Aprende sobre ${TUTORIAL_NAMES[tutorialType]} (+${potentialPoints} TreePoints)`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4 animate-pulse" />
        )}
      </Button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-emerald-900/50 to-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <BookOpen className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {TUTORIAL_NAMES[tutorialType]}
                      </h2>
                      <p className="text-sm text-slate-400">
                        Tutorial interactivo
                      </p>
                    </div>
                  </div>
                  {!isCompleted && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <Gift className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">
                        +{potentialPoints} pts
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Paso {currentStep + 1} de {steps.length}</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-slate-700" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {showCelebration ? (
                    <motion.div
                      key="celebration"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 0.5, repeat: 2 }}
                        className="inline-block mb-4"
                      >
                        <Trophy className="h-20 w-20 text-yellow-400 mx-auto" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        ¡Felicitaciones!
                      </h3>
                      <p className="text-slate-300 mb-4">
                        Has completado el tutorial de {TUTORIAL_NAMES[tutorialType]}
                      </p>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30"
                      >
                        <Sparkles className="h-5 w-5 text-emerald-400" />
                        <span className="text-lg font-bold text-emerald-400">
                          +{pointsEarned} TreePoints
                        </span>
                      </motion.div>
                      <p className="text-sm text-slate-400 mt-4">
                        Los puntos han sido agregados a tu cuenta
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentStep}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-emerald-500/20 shrink-0">
                          {steps[currentStep].icon || <Zap className="h-6 w-6 text-emerald-400" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {steps[currentStep].title}
                          </h3>
                          <p className="text-slate-300 leading-relaxed">
                            {steps[currentStep].content}
                          </p>
                        </div>
                      </div>

                      {/* Step Indicators */}
                      <div className="flex justify-center gap-2 mb-6">
                        {steps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentStep
                                ? 'w-6 bg-emerald-400'
                                : index < currentStep
                                ? 'bg-emerald-600'
                                : 'bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                {showCelebration ? (
                  <Button
                    onClick={handleClose}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    ¡Genial!
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {currentStep === steps.length - 1 ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Completar
                        </>
                      ) : (
                        <>
                          Siguiente
                          <TrendingUp className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}

// Hook for tracking education progress
export function useEducationProgress() {
  const { data: allProgress, isLoading } = trpc.education.getAllProgress.useQuery();
  
  const completedTutorials = allProgress?.filter(p => p.isCompleted) || [];
  const totalPointsEarned = completedTutorials.reduce((sum, p) => sum + (p.pointsAwarded || 0), 0);
  
  const getTutorialStatus = (tutorialType: string) => {
    const progress = allProgress?.find(p => p.tutorialType === tutorialType);
    return {
      isCompleted: progress?.isCompleted || false,
      stepsCompleted: progress?.stepsCompleted || 0,
      pointsAwarded: progress?.pointsAwarded || 0,
    };
  };

  return {
    allProgress,
    completedTutorials,
    totalPointsEarned,
    getTutorialStatus,
    isLoading,
  };
}

export default EducationGamification;
