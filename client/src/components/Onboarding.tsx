import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Wallet,
  Target,
  Gift,
  Shield,
  MessageCircle,
  Bell,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { EwaIcon } from '@/components/ui/ewa-icon';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tips: string[];
  highlight?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: '¡Bienvenido a Treevü!',
    description: 'Tu plataforma de bienestar financiero. Te guiaremos por las funcionalidades principales para que aproveches al máximo tu experiencia.',
    icon: <Sparkles className="w-12 h-12 text-green-500" />,
    tips: [
      'Treevü te ayuda a mejorar tu salud financiera',
      'Gana TreePoints por buenos hábitos financieros',
      'Accede a adelantos de salario cuando lo necesites',
    ],
  },
  {
    id: 2,
    title: 'Tu FWI Score',
    description: 'El Financial Wellness Index (FWI) es tu indicador de bienestar financiero. Va de 0 a 100 y refleja tu salud financiera general.',
    icon: <TrendingUp className="w-12 h-12 text-blue-500" />,
    tips: [
      '0-40: Necesitas mejorar tus hábitos financieros',
      '41-70: Vas por buen camino, sigue así',
      '71-100: Excelente salud financiera',
    ],
    highlight: 'Mejora tu score registrando gastos y alcanzando metas',
  },
  {
    id: 3,
    title: 'Registro de Gastos',
    description: 'Registra tus gastos diarios y nuestra IA los clasificará automáticamente. Esto te ayuda a entender en qué gastas tu dinero.',
    icon: <Wallet className="w-12 h-12 text-purple-500" />,
    tips: [
      'Escribe tu gasto de forma natural: "Café $5.50"',
      'La IA detecta la categoría automáticamente',
      'Revisa tus patrones de gasto en el dashboard',
    ],
    highlight: 'Gana 10 TreePoints por cada gasto registrado',
  },
  {
    id: 4,
    title: 'Metas Financieras',
    description: 'Establece metas de ahorro y sigue tu progreso. Treevü te ayuda a alcanzar tus objetivos financieros.',
    icon: <Target className="w-12 h-12 text-green-500" />,
    tips: [
      'Crea metas para emergencias, viajes o compras',
      'Establece fechas límite realistas',
      'Recibe recordatorios y consejos personalizados',
    ],
    highlight: 'Gana 100 TreePoints al completar una meta',
  },
  {
    id: 5,
    title: 'TreePoints',
    description: 'Gana puntos por buenos hábitos financieros y canjéalos por ofertas exclusivas de nuestros comercios aliados.',
    icon: <Gift className="w-12 h-12 text-pink-500" />,
    tips: [
      'Registrar gastos: +10 pts',
      'Racha de 7 días: +50 pts',
      'Completar meta: +100 pts',
      'Mejorar FWI Score: +25 pts',
    ],
    highlight: 'Explora el marketplace de ofertas',
  },
  {
    id: 6,
    title: 'Adelanto de Salario (EWA)',
    description: 'Accede a una parte de tu salario antes de la fecha de pago. Sin intereses, solo una pequeña comisión fija.',
    icon: <EwaIcon className="w-12 h-12 text-emerald-500" />,
    tips: [
      'Solicita hasta el 50% de tu salario devengado',
      'Aprobación en minutos',
      'Se descuenta automáticamente de tu próxima nómina',
    ],
    highlight: 'Disponible según tu FWI Score y antigüedad',
  },
  {
    id: 7,
    title: 'Treevü Brain',
    description: 'Tu asesor financiero con IA. Chatea para recibir consejos personalizados basados en tu situación financiera.',
    icon: <MessageCircle className="w-12 h-12 text-brand-primary" />,
    tips: [
      'Pregunta sobre tus gastos y cómo reducirlos',
      'Pide consejos para mejorar tu FWI Score',
      'Obtén recomendaciones de ahorro personalizadas',
    ],
    highlight: 'Disponible 24/7 en tu dashboard',
  },
  {
    id: 8,
    title: 'Notificaciones',
    description: 'Mantente informado sobre tu progreso, ofertas especiales y alertas importantes.',
    icon: <Bell className="w-12 h-12 text-amber-500" />,
    tips: [
      'Configura qué notificaciones quieres recibir',
      'Activa las notificaciones push del navegador',
      'Recibe alertas de seguridad importantes',
    ],
    highlight: 'Personaliza tus preferencias en Configuración',
  },
  {
    id: 9,
    title: '¡Estás listo!',
    description: 'Has completado el tour de Treevü. Ahora puedes comenzar a mejorar tu bienestar financiero.',
    icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    tips: [
      'Comienza registrando tu primer gasto',
      'Establece tu primera meta de ahorro',
      'Explora las ofertas disponibles en el marketplace',
    ],
    highlight: '¡Gana 50 TreePoints de bienvenida!',
  },
];

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('treevü_onboarding_completed', 'true');
    setTimeout(onComplete, 300);
  };

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('treevü_onboarding_completed', 'true');
    setTimeout(onSkip, 300);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <CardHeader className="relative pb-2">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                onClick={handleSkip}
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Paso {currentStep + 1} de {onboardingSteps.length}</span>
                <Button variant="link" size="sm" onClick={handleSkip} className="text-gray-500">
                  Saltar tour
                </Button>
              </div>

              <motion.div
                key={step.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full">
                  {step.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-4">
              <motion.div
                key={`tips-${step.id}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                {step.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{tip}</span>
                  </div>
                ))}
              </motion.div>

              {step.highlight && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {step.highlight}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <div className="flex gap-1">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-green-500'
                          : index < currentStep
                          ? 'bg-green-300'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="gap-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    <>
                      Comenzar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('treevü_onboarding_completed');
    if (!completed) {
      setShowOnboarding(true);
    }
    setHasChecked(true);
  }, []);

  const resetOnboarding = () => {
    localStorage.removeItem('treevü_onboarding_completed');
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    localStorage.setItem('treevü_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    hasChecked,
    resetOnboarding,
    completeOnboarding,
  };
}

export default Onboarding;
