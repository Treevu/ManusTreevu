import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, CheckCircle2, Shield, FileText, Building2, 
  Wallet, ChevronRight, Info, Zap, Lock, Scale
} from "lucide-react";

interface FundsFlowVisualizerProps {
  className?: string;
}

const flowSteps = [
  {
    id: 1,
    title: "Solicitud",
    description: "El empleado solicita un adelanto desde la app",
    icon: <Wallet className="h-6 w-6" />,
    color: "#3b82f6",
    detail: "El colaborador selecciona el monto (S/ 20 - S/ 500) y confirma la solicitud. La tarifa operativa de S/ 3.99 se muestra de forma transparente."
  },
  {
    id: 2,
    title: "Validación",
    description: "Treevü valida elegibilidad y saldo disponible",
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: "#10b981",
    detail: "Se verifica: días trabajados, límite mensual disponible, historial de uso. Todo en tiempo real sin consultar buró de crédito."
  },
  {
    id: 3,
    title: "Instrucción",
    description: "Se genera instrucción de pago al banco",
    icon: <FileText className="h-6 w-6" />,
    color: "#8b5cf6",
    detail: "Treevü envía una instrucción segura al banco de nómina. No se transfieren fondos de la empresa, solo información."
  },
  {
    id: 4,
    title: "Depósito",
    description: "El empleado recibe el dinero en su cuenta",
    icon: <Building2 className="h-6 w-6" />,
    color: "#f59e0b",
    detail: "El banco procesa el depósito directo a la cuenta del empleado. Tiempo promedio: 15 minutos en horario bancario."
  },
];

export function FundsFlowVisualizer({ className }: FundsFlowVisualizerProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <Card 
        className={`bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/30 hover:border-violet-400/50 transition-all cursor-pointer group ${className}`}
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-violet-300 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Flujo de Fondos
            <Info className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Cómo Treevü mueve <strong className="text-white">información</strong>, no dinero de tu empresa
            </p>

            {/* Mini flow preview */}
            <div className="flex items-center justify-between">
              {flowSteps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: `${step.color}30` }}
                  >
                    <span style={{ color: step.color }} className="scale-75">{step.icon}</span>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-600 mx-1" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px]">
                <Lock className="h-3 w-3 mr-1" />
                Sin riesgo de balance
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 text-blue-400 text-[10px]">
                <Scale className="h-3 w-3 mr-1" />
                Neutral fiscal
              </Badge>
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-violet-400 group-hover:text-violet-300">
            <span>Ver diagrama completo</span>
            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-400" />
              Visualizador de Flujo de Fondos
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Diagrama educativo: cómo funciona el proceso de EWA paso a paso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Flow diagram */}
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 via-violet-500 to-amber-500 rounded-full" />
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {flowSteps.map((step, i) => (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center cursor-pointer transition-all ${activeStep === i ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setActiveStep(i)}
                  >
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${activeStep === i ? 'ring-4 ring-offset-2 ring-offset-gray-900' : ''}`}
                      style={{ backgroundColor: step.color }}
                    >
                      {step.icon}
                    </div>
                    <p className="text-sm font-medium text-white mt-3">{step.title}</p>
                    <p className="text-xs text-gray-400 text-center max-w-[100px] mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step detail */}
            <div 
              className="rounded-xl p-6 transition-all"
              style={{ backgroundColor: `${flowSteps[activeStep].color}15`, borderColor: `${flowSteps[activeStep].color}50`, borderWidth: 1 }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${flowSteps[activeStep].color}30` }}
                >
                  <span style={{ color: flowSteps[activeStep].color }}>{flowSteps[activeStep].icon}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Paso {flowSteps[activeStep].id}: {flowSteps[activeStep].title}
                  </h4>
                  <p className="text-gray-300 mt-2">{flowSteps[activeStep].detail}</p>
                </div>
              </div>
            </div>

            {/* Legal shields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <h5 className="font-medium text-emerald-300">Blindaje Legal</h5>
                </div>
                <p className="text-sm text-gray-400">
                  Treevü no es un prestamista. Facilitamos el acceso anticipado al salario ya devengado. 
                  Sin intereses, sin afectación crediticia.
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-blue-400" />
                  <h5 className="font-medium text-blue-300">Neutralidad Fiscal</h5>
                </div>
                <p className="text-sm text-gray-400">
                  La conciliación automática en nómina no genera impacto fiscal ni contable adicional. 
                  El proceso es transparente para tu área de finanzas.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
              >
                Anterior
              </Button>
              <div className="flex gap-2">
                {flowSteps.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${activeStep === i ? 'bg-violet-500 w-6' : 'bg-gray-600'}`}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveStep(prev => Math.min(flowSteps.length - 1, prev + 1))}
                disabled={activeStep === flowSteps.length - 1}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
