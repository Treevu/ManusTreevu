import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Sparkles, Target, Users, TrendingUp, ChevronRight, 
  Zap, MapPin, Calendar, Percent, Info
} from "lucide-react";
import { formatCurrency } from "@/lib/locale";
import { toast } from "sonner";

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  estimatedReach: number;
  suggestedDiscount: number;
  expectedROI: number;
  urgency: "high" | "medium" | "low";
}

interface SmartOfferGeneratorProps {
  suggestions?: SmartSuggestion[];
  onCreateOffer?: (offer: any) => void;
}

const defaultSuggestions: SmartSuggestion[] = [
  {
    id: "1",
    title: "Reactiva clientes inactivos",
    description: "Usuarios con alto FWI que no han canjeado en 30+ días cerca de tu local",
    targetAudience: "FWI > 70, inactivos 30d",
    estimatedReach: 245,
    suggestedDiscount: 15,
    expectedROI: 3.2,
    urgency: "high"
  },
  {
    id: "2",
    title: "Captura hora pico almuerzo",
    description: "Empleados de oficinas cercanas entre 12pm-2pm",
    targetAudience: "Radio 500m, horario laboral",
    estimatedReach: 180,
    suggestedDiscount: 10,
    expectedROI: 4.5,
    urgency: "medium"
  },
  {
    id: "3",
    title: "Fin de semana familiar",
    description: "Usuarios con perfil familiar y buen score financiero",
    targetAudience: "FWI > 60, perfil familiar",
    estimatedReach: 320,
    suggestedDiscount: 20,
    expectedROI: 2.8,
    urgency: "low"
  },
];

export function SmartOfferGenerator({ 
  suggestions = defaultSuggestions,
  onCreateOffer 
}: SmartOfferGeneratorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SmartSuggestion | null>(null);
  const [discount, setDiscount] = useState(15);
  const [budget, setBudget] = useState(500);

  const handleSelectSuggestion = (suggestion: SmartSuggestion) => {
    setSelectedSuggestion(suggestion);
    setDiscount(suggestion.suggestedDiscount);
  };

  const handleCreateOffer = () => {
    if (selectedSuggestion && onCreateOffer) {
      onCreateOffer({
        ...selectedSuggestion,
        discount,
        budget,
      });
    }
    toast.success("Campaña creada exitosamente");
    setShowModal(false);
    setSelectedSuggestion(null);
  };

  const urgencyColors = {
    high: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", badge: "bg-red-500" },
    medium: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500" },
    low: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500" },
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generador de Ofertas IA
            <Info className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{suggestions.length}</p>
                <p className="text-xs text-purple-400">Sugerencias activas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
              </div>
            </div>

            {/* Top suggestion preview */}
            {suggestions[0] && (
              <div className={`p-3 rounded-lg ${urgencyColors[suggestions[0].urgency].bg} ${urgencyColors[suggestions[0].urgency].border} border`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{suggestions[0].title}</p>
                    <p className="text-xs text-gray-400 mt-1">{suggestions[0].estimatedReach} usuarios potenciales</p>
                  </div>
                  <Badge className={`${urgencyColors[suggestions[0].urgency].badge} text-white text-[10px]`}>
                    {suggestions[0].urgency === "high" ? "Urgente" : suggestions[0].urgency === "medium" ? "Recomendado" : "Opcional"}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 flex items-center text-xs text-purple-400 group-hover:text-purple-300">
            <span>Ver todas las sugerencias</span>
            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Generador Inteligente de Ofertas
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Sugerencias automáticas basadas en análisis de usuarios con alto FWI cerca de tu local
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Smart Banner */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {suggestions.filter(s => s.urgency === "high").length} oportunidades de alto impacto detectadas
                  </p>
                  <p className="text-xs text-gray-400">
                    Basado en {suggestions.reduce((sum, s) => sum + s.estimatedReach, 0)} usuarios con alto FWI en tu zona
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions list */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Sugerencias de Campaña</h4>
              {suggestions.map((suggestion) => (
                <div 
                  key={suggestion.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSuggestion?.id === suggestion.id 
                      ? 'bg-purple-500/20 border-purple-500' 
                      : `${urgencyColors[suggestion.urgency].bg} ${urgencyColors[suggestion.urgency].border} hover:border-purple-400/50`
                  }`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{suggestion.title}</p>
                        <Badge className={`${urgencyColors[suggestion.urgency].badge} text-white text-[10px]`}>
                          {suggestion.urgency === "high" ? "Urgente" : suggestion.urgency === "medium" ? "Recomendado" : "Opcional"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
                      <div className="flex gap-4 mt-3 text-xs">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Target className="h-3 w-3" />
                          {suggestion.targetAudience}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Users className="h-3 w-3" />
                          {suggestion.estimatedReach} usuarios
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <TrendingUp className="h-3 w-3" />
                          ROI {suggestion.expectedROI}x
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-400">{suggestion.suggestedDiscount}%</p>
                      <p className="text-xs text-gray-400">Descuento sugerido</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Configuration when selected */}
            {selectedSuggestion && (
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Configurar Campaña</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Descuento (%)</label>
                    <div className="space-y-2">
                      <Slider
                        value={[discount]}
                        onValueChange={(v) => setDiscount(v[0])}
                        min={5}
                        max={50}
                        step={5}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5%</span>
                        <span className="text-purple-400 font-medium">{discount}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Presupuesto (S/)</label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <span className="text-sm text-gray-300">ROI Estimado</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {(selectedSuggestion.expectedROI * (discount / selectedSuggestion.suggestedDiscount)).toFixed(1)}x
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateOffer}
              disabled={!selectedSuggestion}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Crear Campaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
