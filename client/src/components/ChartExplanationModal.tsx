import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, X } from "lucide-react";

export interface ChartExplanation {
  title: string;
  description: string;
  whatIsIt: string;
  whyImportant: string;
  howToInterpret: string;
  examples: Array<{
    scenario: string;
    explanation: string;
  }>;
  actionItems?: Array<{
    action: string;
    benefit: string;
  }>;
  relatedMetrics?: string[];
}

interface ChartExplanationModalProps {
  explanation: ChartExplanation;
  trigger?: React.ReactNode;
}

export function ChartExplanationModal({
  explanation,
  trigger,
}: ChartExplanationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-blue-500/20"
          onClick={() => setOpen(true)}
          title="Más información"
        >
          <HelpCircle className="h-4 w-4 text-blue-400" />
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-treevu-surface/95 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              {explanation.title}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              {explanation.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ¿Qué es? */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                ¿Qué es?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {explanation.whatIsIt}
              </p>
            </section>

            {/* ¿Por qué es importante? */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                ¿Por qué es importante?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {explanation.whyImportant}
              </p>
            </section>

            {/* ¿Cómo interpretar? */}
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                ¿Cómo interpretar?
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {explanation.howToInterpret}
              </p>
            </section>

            {/* Ejemplos */}
            {explanation.examples && explanation.examples.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  Ejemplos
                </h3>
                <div className="space-y-2">
                  {explanation.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <p className="text-xs font-semibold text-blue-400 mb-1">
                        {example.scenario}
                      </p>
                      <p className="text-xs text-gray-300">
                        {example.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Acciones recomendadas */}
            {explanation.actionItems && explanation.actionItems.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Acciones Recomendadas
                </h3>
                <div className="space-y-2">
                  {explanation.actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                    >
                      <p className="text-xs font-semibold text-green-400 mb-1">
                        {item.action}
                      </p>
                      <p className="text-xs text-gray-300">{item.benefit}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Métricas relacionadas */}
            {explanation.relatedMetrics &&
              explanation.relatedMetrics.length > 0 && (
                <section className="space-y-2">
                  <h3 className="text-sm font-semibold text-white">
                    Métricas Relacionadas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {explanation.relatedMetrics.map((metric, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-blue-500/10 border-blue-500/30 text-blue-300"
                      >
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/20 hover:bg-white/10"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Componente auxiliar para botón de ayuda en gráficos
export function ChartHelpButton({
  explanation,
}: {
  explanation: ChartExplanation;
}) {
  return (
    <ChartExplanationModal
      explanation={explanation}
      trigger={
        <button
          className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
          title={explanation.title}
        >
          <HelpCircle className="h-3 w-3 text-blue-400" />
        </button>
      }
    />
  );
}
