import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle, AlertCircle, Zap, TrendingUp, Users } from 'lucide-react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: 'engagement' | 'retention' | 'financial' | 'performance' | 'culture';
  priority: number;
  expectedOutcome: string;
  actionItems: string[];
  estimatedROI?: number;
}

interface RecommendationsProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
}

export default function Recommendations({
  recommendations,
  isLoading = false,
}: RecommendationsProps) {
  // Default recommendations
  const defaultRecommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Programa de Asesoría Financiera Intensiva',
      description: 'Implementar sesiones mensuales de asesoría personalizada para empleados con FWI bajo.',
      impact: 'high',
      effort: 'medium',
      category: 'financial',
      priority: 1,
      expectedOutcome: 'Aumentar FWI Score en 12-15 puntos en 6 meses',
      actionItems: [
        'Contratar 2-3 asesores financieros',
        'Crear calendario de sesiones mensuales',
        'Desarrollar materiales educativos personalizados',
        'Medir impacto mensualmente',
      ],
      estimatedROI: 320,
    },
    {
      id: '2',
      title: 'Programa de Retención Proactivo',
      description: 'Identificar empleados en riesgo y ofrecer intervenciones personalizadas antes de que se vayan.',
      impact: 'high',
      effort: 'high',
      category: 'retention',
      priority: 2,
      expectedOutcome: 'Reducir rotación en 8-12% anual',
      actionItems: [
        'Implementar modelo de predicción de churn',
        'Crear equipo de retención dedicado',
        'Diseñar planes de retención personalizados',
        'Monitorear efectividad trimestral',
      ],
      estimatedROI: 450,
    },
    {
      id: '3',
      title: 'Gamificación de Objetivos Financieros',
      description: 'Crear desafíos y recompensas para motivar participación en programas de bienestar.',
      impact: 'medium',
      effort: 'low',
      category: 'engagement',
      priority: 3,
      expectedOutcome: 'Aumentar participación en EWA a 75%',
      actionItems: [
        'Diseñar sistema de puntos y badges',
        'Crear tabla de líderes mensual',
        'Establecer premios atractivos',
        'Comunicar programa a todos',
      ],
      estimatedROI: 280,
    },
    {
      id: '4',
      title: 'Sesiones de Coaching Grupal',
      description: 'Organizar talleres mensuales sobre temas financieros relevantes para diferentes grupos.',
      impact: 'medium',
      effort: 'low',
      category: 'performance',
      priority: 4,
      expectedOutcome: 'Mejorar conocimiento financiero general',
      actionItems: [
        'Identificar temas prioritarios',
        'Contratar facilitadores externos',
        'Programar sesiones mensuales',
        'Recopilar feedback de participantes',
      ],
      estimatedROI: 200,
    },
    {
      id: '5',
      title: 'Integración de Beneficios Complementarios',
      description: 'Ofrecer seguros, fondos de emergencia y otros beneficios para mejorar seguridad financiera.',
      impact: 'high',
      effort: 'high',
      category: 'financial',
      priority: 5,
      expectedOutcome: 'Aumentar FWI Score en 8-10 puntos',
      actionItems: [
        'Investigar opciones de seguros',
        'Negociar precios con proveedores',
        'Comunicar beneficios a empleados',
        'Medir adopción y satisfacción',
      ],
      estimatedROI: 350,
    },
    {
      id: '6',
      title: 'Programa de Mentoring Peer-to-Peer',
      description: 'Emparejar empleados con alto FWI con aquellos que necesitan mejorar.',
      impact: 'medium',
      effort: 'low',
      category: 'culture',
      priority: 6,
      expectedOutcome: 'Crear comunidad de apoyo financiero',
      actionItems: [
        'Identificar mentores potenciales',
        'Crear programa de capacitación',
        'Establecer pares de mentoring',
        'Monitorear progreso trimestralmente',
      ],
      estimatedROI: 180,
    },
  ];

  const displayRecommendations = recommendations || defaultRecommendations;

  // Sort by priority
  const sortedRecommendations = [...displayRecommendations].sort((a, b) => a.priority - b.priority);

  // Calculate impact matrix
  const highImpactHighEffort = displayRecommendations.filter(r => r.impact === 'high' && r.effort === 'high').length;
  const highImpactLowEffort = displayRecommendations.filter(r => r.impact === 'high' && r.effort === 'low').length;
  const avgROI = displayRecommendations.reduce((sum, r) => sum + (r.estimatedROI || 0), 0) / displayRecommendations.length;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return '';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return '💰';
      case 'retention':
        return '👥';
      case 'engagement':
        return '🎯';
      case 'performance':
        return '📈';
      case 'culture':
        return '🤝';
      default:
        return '💡';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Cargando recomendaciones...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Rápidas & Efectivas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{highImpactLowEffort}</div>
            <p className="text-xs text-gray-400 mt-1">Alto impacto, bajo esfuerzo</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              ROI Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{avgROI.toFixed(0)}%</div>
            <p className="text-xs text-gray-400 mt-1">Retorno estimado</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Total Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{displayRecommendations.length}</div>
            <p className="text-xs text-gray-400 mt-1">Acciones sugeridas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {sortedRecommendations.map((rec, idx) => (
          <Card key={rec.id} className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {rec.title}
                      <Badge className="bg-blue-500/20 text-blue-400 border-transparent text-xs">
                        #{rec.priority}
                      </Badge>
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Metrics */}
              <div className="flex gap-2 flex-wrap">
                <Badge className={`${getImpactColor(rec.impact)} border-transparent`}>
                  Impacto: {rec.impact === 'high' ? 'Alto' : rec.impact === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
                <Badge className={`${getEffortColor(rec.effort)} border-transparent`}>
                  Esfuerzo: {rec.effort === 'high' ? 'Alto' : rec.effort === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
                {rec.estimatedROI && (
                  <Badge className="bg-green-500/20 text-green-400 border-transparent">
                    ROI: {rec.estimatedROI}%
                  </Badge>
                )}
              </div>

              {/* Expected Outcome */}
              <div className="p-3 bg-white/5 border border-white/10 rounded">
                <p className="text-xs text-gray-400 mb-1">Resultado Esperado</p>
                <p className="text-sm text-gray-200">{rec.expectedOutcome}</p>
              </div>

              {/* Action Items */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Pasos de Implementación</p>
                <ul className="space-y-1">
                  {rec.actionItems.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white">
                Implementar Recomendación
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Implementation Roadmap */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">Hoja de Ruta de Implementación</CardTitle>
          <CardDescription className="text-gray-400">Orden sugerido para máximo impacto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-green-400">✓ Mes 1-2: Rápidas & Efectivas</p>
            <p className="text-xs text-gray-400">
              Implementar {highImpactLowEffort} recomendaciones de alto impacto y bajo esfuerzo para ganar momentum.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-400">⏳ Mes 3-4: Iniciativas Medianas</p>
            <p className="text-xs text-gray-400">
              Lanzar proyectos de mediano esfuerzo que requieren coordinación departamental.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-400">📊 Mes 5-6: Transformación Profunda</p>
            <p className="text-xs text-gray-400">
              Ejecutar cambios estructurales de alto esfuerzo que generarán impacto a largo plazo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
