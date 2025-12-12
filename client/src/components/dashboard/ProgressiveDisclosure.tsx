import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, ChevronLeft, CheckCircle2, Lightbulb, 
  TrendingUp, Shield, Target, Sparkles, X
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  color: string;
}

interface ProgressiveDisclosureProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  steps: Step[];
  onComplete?: () => void;
}

export function ProgressiveDisclosure({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onComplete
}: ProgressiveDisclosureProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-white">{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {description && (
            <DialogDescription className="text-gray-400">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index === currentStep 
                    ? 'ring-2 ring-offset-2 ring-offset-gray-900' 
                    : completedSteps.includes(index)
                    ? 'opacity-100'
                    : 'opacity-50'
                }`}
                style={{ backgroundColor: `${step.color}30` }}
              >
                {completedSteps.includes(index) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <span style={{ color: step.color }}>{step.icon}</span>
                )}
              </button>
            ))}
          </div>

          {/* Current step content */}
          <div 
            className="rounded-xl p-6 min-h-[200px]"
            style={{ 
              backgroundColor: `${currentStepData.color}10`,
              borderColor: `${currentStepData.color}30`,
              borderWidth: 1
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${currentStepData.color}30` }}
              >
                <span style={{ color: currentStepData.color }}>{currentStepData.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{currentStepData.title}</h3>
            </div>
            <div className="text-gray-300">
              {currentStepData.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep ? 'bg-white w-6' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="gap-2"
              style={{ backgroundColor: currentStepData.color }}
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Pre-built educational modals
export const FWI_EDUCATION_STEPS: Step[] = [
  {
    id: 1,
    title: "¿Qué es el FWI Score?",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "#8b5cf6",
    content: (
      <div className="space-y-3">
        <p>
          El <strong>Financial Wellness Index (FWI)</strong> es un indicador de 0 a 100 que mide 
          tu salud financiera integral.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-3 rounded-lg bg-red-500/20">
            <p className="text-2xl font-bold text-red-400">0-49</p>
            <p className="text-xs text-gray-400">En riesgo</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-500/20">
            <p className="text-2xl font-bold text-amber-400">50-69</p>
            <p className="text-xs text-gray-400">Moderado</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-500/20">
            <p className="text-2xl font-bold text-emerald-400">70-100</p>
            <p className="text-xs text-gray-400">Saludable</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "¿Cómo se calcula?",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "#10b981",
    content: (
      <div className="space-y-3">
        <p>Tu FWI se calcula considerando múltiples factores:</p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Ratio de ahorro mensual (30%)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Uso de adelantos de sueldo (25%)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Cumplimiento de metas (25%)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Patrones de gasto (20%)</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 3,
    title: "¿Cómo mejorarlo?",
    icon: <Target className="h-6 w-6" />,
    color: "#3b82f6",
    content: (
      <div className="space-y-3">
        <p>Acciones que impactan positivamente tu FWI:</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">+5 puntos</p>
            <p className="text-xs text-gray-400">Crear una meta de ahorro</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">+3 puntos</p>
            <p className="text-xs text-gray-400">Registrar gastos diarios</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">+10 puntos</p>
            <p className="text-xs text-gray-400">Completar una meta</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">+2 puntos</p>
            <p className="text-xs text-gray-400">Mantener racha de 7 días</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Beneficios de un FWI alto",
    icon: <Sparkles className="h-6 w-6" />,
    color: "#f59e0b",
    content: (
      <div className="space-y-3">
        <p>Un FWI alto te da acceso a:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Mayor límite de EWA</p>
              <p className="text-xs text-gray-400">Hasta S/ 1,000 de adelanto disponible</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
            <Sparkles className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Ofertas exclusivas</p>
              <p className="text-xs text-gray-400">Descuentos premium en el marketplace</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
            <TrendingUp className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Asesoría financiera IA</p>
              <p className="text-xs text-gray-400">Recomendaciones personalizadas</p>
            </div>
          </li>
        </ul>
      </div>
    )
  }
];

export const EWA_EDUCATION_STEPS: Step[] = [
  {
    id: 1,
    title: "¿Qué es EWA?",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "#8b5cf6",
    content: (
      <div className="space-y-3">
        <p>
          <strong>Earned Wage Access (EWA)</strong> te permite acceder a una parte de tu salario 
          ya devengado antes del día de pago.
        </p>
        <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30 mt-4">
          <p className="text-sm text-gray-300">
            <strong className="text-white">Importante:</strong> No es un préstamo. Es tu dinero, 
            que ya ganaste trabajando.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "¿Cuánto puedo solicitar?",
    icon: <Target className="h-6 w-6" />,
    color: "#10b981",
    content: (
      <div className="space-y-3">
        <p>Tu límite depende de:</p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Días trabajados en el mes actual</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Tu FWI Score (mayor score = mayor límite)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Política de tu empresa (máximo 50% del devengado)</span>
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-3 rounded-lg bg-emerald-500/20">
            <p className="text-xl font-bold text-emerald-400">S/ 20</p>
            <p className="text-xs text-gray-400">Mínimo</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-500/20">
            <p className="text-xl font-bold text-emerald-400">S/ 1,000</p>
            <p className="text-xs text-gray-400">Máximo</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Costo y transparencia",
    icon: <Shield className="h-6 w-6" />,
    color: "#3b82f6",
    content: (
      <div className="space-y-3">
        <p>Treevü cobra una <strong>tarifa operativa fija</strong>, no intereses:</p>
        <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Tarifa por transacción</span>
            <span className="text-2xl font-bold text-white">S/ 3.99</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-3">
          Sin importar el monto (S/ 20 o S/ 500), la tarifa es la misma. 
          Sin intereses ocultos, sin penalidades.
        </p>
      </div>
    )
  }
];


// B2B Educational Steps
export const B2B_EDUCATION_STEPS: Step[] = [
  {
    id: 1,
    title: "Torre de Control Financiero",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "#8b5cf6",
    content: (
      <div className="space-y-3">
        <p>
          El <strong>Dashboard B2B</strong> te permite monitorear el bienestar financiero 
          de toda tu organización en tiempo real.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <p className="font-medium text-white">FWI Promedio</p>
            <p className="text-xs text-gray-400">Salud financiera de tu equipo</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <p className="font-medium text-white">Empleados en Riesgo</p>
            <p className="text-xs text-gray-400">Requieren atención</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Mapa de Calor de Riesgo",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "#ef4444",
    content: (
      <div className="space-y-3">
        <p>El mapa de calor correlaciona:</p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-red-400" />
            <span><strong>Eje X:</strong> FWI promedio del departamento</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-red-400" />
            <span><strong>Eje Y:</strong> Tasa de rotación</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-red-400" />
            <span><strong>Tamaño:</strong> Cantidad de empleados</span>
          </li>
        </ul>
        <p className="text-sm text-gray-400 mt-3">
          Departamentos en la esquina inferior izquierda (bajo FWI, alta rotación) 
          requieren intervención inmediata.
        </p>
      </div>
    )
  },
  {
    id: 3,
    title: "Flujo de Fondos EWA",
    icon: <Shield className="h-6 w-6" />,
    color: "#10b981",
    content: (
      <div className="space-y-3">
        <p>Treevü garantiza <strong>neutralidad fiscal</strong> para tu empresa:</p>
        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-3 p-2 rounded bg-emerald-500/10">
            <span className="text-emerald-400 font-bold">1</span>
            <span className="text-sm">Empleado solicita adelanto</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded bg-emerald-500/10">
            <span className="text-emerald-400 font-bold">2</span>
            <span className="text-sm">Treevü valida y dispersa fondos</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded bg-emerald-500/10">
            <span className="text-emerald-400 font-bold">3</span>
            <span className="text-sm">Se descuenta en nómina automáticamente</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded bg-emerald-500/10">
            <span className="text-emerald-400 font-bold">4</span>
            <span className="text-sm">Conciliación sin impacto fiscal</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "ROI de Treevü",
    icon: <Sparkles className="h-6 w-6" />,
    color: "#f59e0b",
    content: (
      <div className="space-y-3">
        <p>Beneficios medibles para tu organización:</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <p className="text-2xl font-bold text-amber-400">-23%</p>
            <p className="text-xs text-gray-400">Reducción en rotación</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <p className="text-2xl font-bold text-amber-400">-18%</p>
            <p className="text-xs text-gray-400">Menos ausentismo</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <p className="text-2xl font-bold text-amber-400">+15%</p>
            <p className="text-xs text-gray-400">Aumento productividad</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <p className="text-2xl font-bold text-amber-400">4.2x</p>
            <p className="text-xs text-gray-400">ROI promedio</p>
          </div>
        </div>
      </div>
    )
  }
];

// Merchant Educational Steps
export const MERCHANT_EDUCATION_STEPS: Step[] = [
  {
    id: 1,
    title: "Marketplace Treevü",
    icon: <Lightbulb className="h-6 w-6" />,
    color: "#8b5cf6",
    content: (
      <div className="space-y-3">
        <p>
          Como comercio aliado, accedes a una <strong>audiencia pre-calificada</strong> de 
          usuarios con poder adquisitivo verificado.
        </p>
        <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-500/30 mt-4">
          <p className="text-sm text-gray-300">
            Los usuarios de Treevü tienen un <strong className="text-white">FWI Score</strong> que 
            indica su capacidad de gasto responsable.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "TreePoints como Moneda",
    icon: <Target className="h-6 w-6" />,
    color: "#10b981",
    content: (
      <div className="space-y-3">
        <p>Los usuarios acumulan TreePoints por buenos hábitos financieros:</p>
        <ul className="space-y-2 mt-3">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Registrar gastos diariamente</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Cumplir metas de ahorro</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Mantener un FWI saludable</span>
          </li>
        </ul>
        <p className="text-sm text-gray-400 mt-3">
          Tus ofertas son canjeables con TreePoints, generando tráfico cualificado.
        </p>
      </div>
    )
  },
  {
    id: 3,
    title: "Ofertas Inteligentes",
    icon: <Sparkles className="h-6 w-6" />,
    color: "#3b82f6",
    content: (
      <div className="space-y-3">
        <p>Nuestro <strong>Smart Banner IA</strong> sugiere ofertas basadas en:</p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">FWI de usuarios</p>
            <p className="text-xs text-gray-400">Capacidad de gasto</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">Ubicación</p>
            <p className="text-xs text-gray-400">Usuarios cercanos</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">Historial</p>
            <p className="text-xs text-gray-400">Preferencias de compra</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <p className="font-medium text-white">Temporada</p>
            <p className="text-xs text-gray-400">Fechas especiales</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Métricas de ROI",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "#f59e0b",
    content: (
      <div className="space-y-3">
        <p>Mide el impacto de tus campañas:</p>
        <ul className="space-y-3 mt-3">
          <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">ROAS (Return on Ad Spend)</p>
              <p className="text-xs text-gray-400">Ventas generadas / Inversión en descuentos</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
            <Sparkles className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">CAC (Costo de Adquisición)</p>
              <p className="text-xs text-gray-400">Inversión / Nuevos clientes</p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
            <TrendingUp className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <p className="font-medium text-white">Tasa de Conversión</p>
              <p className="text-xs text-gray-400">Canjes / Impresiones de oferta</p>
            </div>
          </li>
        </ul>
      </div>
    )
  }
];
