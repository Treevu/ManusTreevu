import { useState, useEffect, createContext, useContext } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import { Button } from '@/components/ui/button';
import { 
  X, ChevronLeft, ChevronRight, Sparkles, 
  Wallet, TrendingUp, Gift, GraduationCap, Target
} from 'lucide-react';

// Tour steps for Employee Dashboard
export const employeeTourSteps = [
  {
    selector: '[data-tour="welcome"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">¡Bienvenido a Treevü!</span>
        </div>
        <p className="text-sm text-gray-300">
          Te guiaremos por las principales funcionalidades de tu dashboard de bienestar financiero.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="fwi-score"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-400">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">Tu FWI Score</span>
        </div>
        <p className="text-sm text-gray-300">
          El Financial Wellness Index mide tu salud financiera de 0 a 100. 
          Mientras más alto, mejor preparado estás para imprevistos.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="ewa"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-400">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Adelanto de Nómina (EWA)</span>
        </div>
        <p className="text-sm text-gray-300">
          Accede a tu salario ya trabajado cuando lo necesites. 
          Sin intereses, solo una pequeña comisión transparente.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="treepoints"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-yellow-400">
          <Gift className="w-5 h-5" />
          <span className="font-semibold">TreePoints</span>
        </div>
        <p className="text-sm text-gray-300">
          Gana puntos por mejorar tu salud financiera. 
          Canjéalos por descuentos exclusivos en el Marketplace.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="goals"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-400">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Metas de Ahorro</span>
        </div>
        <p className="text-sm text-gray-300">
          Crea metas personalizadas y visualiza tu progreso. 
          Te ayudamos a alcanzar tus objetivos financieros.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="education"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-pink-400">
          <GraduationCap className="w-5 h-5" />
          <span className="font-semibold">Centro de Educación</span>
        </div>
        <p className="text-sm text-gray-300">
          Aprende sobre finanzas personales con tutoriales interactivos. 
          ¡Gana TreePoints por cada tutorial completado!
        </p>
      </div>
    ),
  },
];

// Tour steps for B2B Dashboard
export const b2bTourSteps = [
  {
    selector: '[data-tour="welcome"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Torre de Control B2B</span>
        </div>
        <p className="text-sm text-gray-300">
          Bienvenido al panel de administración. Aquí podrás monitorear 
          el bienestar financiero de toda tu organización.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="metrics"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-400">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">Métricas de Impacto</span>
        </div>
        <p className="text-sm text-gray-300">
          Visualiza el FWI promedio, reducción de ausentismo y ROI 
          de tu programa de bienestar financiero.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="departments"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-400">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Análisis por Departamento</span>
        </div>
        <p className="text-sm text-gray-300">
          Identifica qué departamentos necesitan más apoyo y 
          configura alertas personalizadas.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="ewa-approvals"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-400">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Aprobación de EWA</span>
        </div>
        <p className="text-sm text-gray-300">
          Revisa y aprueba solicitudes de adelanto de nómina. 
          Configura límites y políticas por departamento.
        </p>
      </div>
    ),
  },
];

// Tour steps for Merchant Dashboard
export const merchantTourSteps = [
  {
    selector: '[data-tour="welcome"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Panel de Comerciante</span>
        </div>
        <p className="text-sm text-gray-300">
          Gestiona tus ofertas y conecta con miles de empleados 
          que buscan descuentos exclusivos.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="offers"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-blue-400">
          <Gift className="w-5 h-5" />
          <span className="font-semibold">Gestión de Ofertas</span>
        </div>
        <p className="text-sm text-gray-300">
          Crea y administra ofertas exclusivas para usuarios de Treevü. 
          Define descuentos, vigencia y límites de canje.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="qr-validation"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-400">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Validación QR</span>
        </div>
        <p className="text-sm text-gray-300">
          Escanea códigos QR de cupones para validar canjes en tu establecimiento. 
          Proceso rápido y seguro.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="analytics"]',
    content: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-400">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">Analíticas</span>
        </div>
        <p className="text-sm text-gray-300">
          Monitorea el rendimiento de tus ofertas, canjes realizados 
          y engagement de los usuarios.
        </p>
      </div>
    ),
  },
];

// Custom navigation component for the tour
function TourNavigation() {
  const { currentStep, steps, setCurrentStep, setIsOpen } = useTour();
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentStep 
                ? 'bg-emerald-400 w-4' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {!isFirst && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
        )}
        {isLast ? (
          <Button
            size="sm"
            onClick={() => setIsOpen(false)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            ¡Comenzar!
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Context for tour control
interface TourControlContextType {
  startTour: () => void;
  tourKey: string;
}

const TourControlContext = createContext<TourControlContextType | null>(null);

export function useTourControl() {
  const context = useContext(TourControlContext);
  if (!context) {
    throw new Error('useTourControl must be used within OnboardingTourProvider');
  }
  return context;
}

// Tour provider wrapper
interface OnboardingTourProviderProps {
  children: React.ReactNode;
  steps: typeof employeeTourSteps;
  tourKey: string;
}

export function OnboardingTourProvider({ children, steps, tourKey }: OnboardingTourProviderProps) {
  const [shouldOpen, setShouldOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen this tour
    const hasSeenTour = localStorage.getItem(`tour_${tourKey}_completed`);
    if (!hasSeenTour) {
      // Delay to allow page to render
      const timer = setTimeout(() => setShouldOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const handleTourClose = () => {
    localStorage.setItem(`tour_${tourKey}_completed`, 'true');
    setShouldOpen(false);
  };

  const startTour = () => {
    localStorage.removeItem(`tour_${tourKey}_completed`);
    setShouldOpen(true);
  };

  return (
    <TourControlContext.Provider value={{ startTour, tourKey }}>
      <TourProvider
        steps={steps}
        defaultOpen={shouldOpen}
        onClickClose={() => handleTourClose()}
        styles={{
          popover: (base) => ({
            ...base,
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            border: '1px solid #374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            padding: '20px',
            maxWidth: '360px',
          }),
          maskArea: (base) => ({
            ...base,
            rx: 8,
          }),
          highlightedArea: (base) => ({
            ...base,
            stroke: '#10b981',
            strokeWidth: 2,
          }),
          badge: (base) => ({
            ...base,
            backgroundColor: '#10b981',
          }),
          close: (base) => ({
            ...base,
            color: '#9ca3af',
            right: 12,
            top: 12,
          }),
        }}
        components={{
          Close: ({ onClick }) => (
            <button
              onClick={onClick}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ),
          Content: ({ content }) => (
            <div>
              {content}
              <TourNavigation />
            </div>
          ),
        }}
        onClickMask={() => {}}
        padding={{ mask: 8, popover: [16, 12] }}
        position="bottom"
      >
        {children}
      </TourProvider>
    </TourControlContext.Provider>
  );
}

// Button to restart tour
interface RestartTourButtonProps {
  className?: string;
}

export function RestartTourButton({ className }: RestartTourButtonProps) {
  const { startTour } = useTourControl();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startTour}
      className={className}
    >
      <Sparkles className="w-4 h-4 mr-2" />
      Ver tour de nuevo
    </Button>
  );
}
