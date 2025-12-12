import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  PieChart,
  Sparkles
} from 'lucide-react';
import { formatPercent, formatDate } from '@/lib/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

const CATEGORY_LABELS: Record<string, string> = {
  financial_stress: 'Estrés Financiero',
  work_life_balance: 'Balance Vida-Trabajo',
  job_satisfaction: 'Satisfacción Laboral',
  financial_confidence: 'Confianza Financiera',
  savings_habits: 'Hábitos de Ahorro',
  overall_wellbeing: 'Bienestar General',
};

const CATEGORY_COLORS: Record<string, string> = {
  financial_stress: '#ef4444',
  work_life_balance: '#f59e0b',
  job_satisfaction: '#10b981',
  financial_confidence: '#3b82f6',
  savings_habits: '#8b5cf6',
  overall_wellbeing: '#06b6d4',
};

const PIE_COLORS = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#10b981'];

export default function SurveyResults() {
  const { user } = useAuth();
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);

  const { data: surveys, isLoading: loadingSurveys } = trpc.surveys.getAll.useQuery({});
  const { data: results, isLoading: loadingResults } = trpc.surveys.getResults.useQuery(
    { surveyId: selectedSurveyId! },
    { enabled: !!selectedSurveyId }
  );

  const sendRemindersMutation = trpc.surveys.sendReminders.useMutation({
    onSuccess: (data) => {
      toast.success(`Se enviaron ${data.sentCount} recordatorios`);
    },
    onError: () => {
      toast.error('Error al enviar recordatorios');
    },
  });

  // Set first survey as default
  if (surveys?.length && !selectedSurveyId) {
    setSelectedSurveyId(surveys[0].id);
  }

  const selectedSurvey = surveys?.find(s => s.id === selectedSurveyId);

  // Transform results for charts
  const categoryData = results?.questionResults?.map((qr: any) => ({
    category: CATEGORY_LABELS[qr.question?.category] || qr.question?.category || 'General',
    value: qr.avgScore || 0,
    fullMark: 5,
  })) || [];

  // Aggregate distribution from all questions
  const aggregatedDistribution: Record<string, number> = {};
  results?.questionResults?.forEach((qr: any) => {
    Object.entries(qr.distribution || {}).forEach(([key, count]) => {
      aggregatedDistribution[key] = (aggregatedDistribution[key] || 0) + (count as number);
    });
  });

  const distributionData = Object.entries(aggregatedDistribution).map(([key, count], index) => ({
    name: key,
    value: count,
    fill: PIE_COLORS[index % PIE_COLORS.length] || '#6b7280',
  }));

  const completionRate = results?.completionRate || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/b2b" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Resultados de Encuestas</h1>
                <p className="text-sm text-gray-400">Análisis de bienestar organizacional</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select 
                value={selectedSurveyId?.toString() || ''} 
                onValueChange={(v) => setSelectedSurveyId(parseInt(v))}
              >
                <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Seleccionar encuesta" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {surveys?.map(survey => (
                    <SelectItem key={survey.id} value={survey.id.toString()}>
                      {survey.title || `Encuesta ${survey.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-700"
                onClick={() => selectedSurveyId && sendRemindersMutation.mutate({ surveyId: selectedSurveyId })}
                disabled={sendRemindersMutation.isPending}
              >
                {sendRemindersMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                Recordatorios
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loadingSurveys || loadingResults ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 bg-gray-800" />
            ))}
          </div>
        ) : !results ? (
          <Card className="bg-gray-900/50 border-gray-800 text-center py-12">
            <CardContent>
              <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Sin resultados</h3>
              <p className="text-gray-400">Selecciona una encuesta para ver los resultados</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Tasa de Completado</p>
                      <p className="text-2xl font-bold text-white">{formatPercent(completionRate)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <Progress value={completionRate} className="mt-3 h-2" />
                  <p className="text-xs text-gray-500 mt-2">
                    {results.totalResponses || 0} respuestas recibidas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Bienestar Promedio</p>
                      <p className="text-2xl font-bold text-white">
                        {(results as any).overallScore?.toFixed(1) || '—'} / 5
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    <span className="text-sm text-gray-500">Basado en {results.totalResponses} respuestas</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Participantes</p>
                      <p className="text-2xl font-bold text-white">{results.totalResponses || 0}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Tasa: {results.completionRate.toFixed(0)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Estado</p>
                      <Badge 
                        variant="outline" 
                        className={selectedSurvey?.status === 'active' 
                          ? 'border-emerald-500/50 text-emerald-400' 
                          : 'border-gray-500/50 text-gray-400'
                        }
                      >
                        {selectedSurvey?.status === 'active' ? 'Activa' : 'Cerrada'}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                  {selectedSurvey?.createdAt && (
                    <p className="text-xs text-gray-500 mt-3">
                      Creada: {formatDate(selectedSurvey.createdAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Radar Chart - Category Scores */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Puntuación por Categoría</CardTitle>
                  <CardDescription className="text-gray-400">
                    Promedio de respuestas por área de bienestar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={categoryData}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis 
                          dataKey="category" 
                          tick={{ fill: '#9ca3af', fontSize: 11 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 5]} 
                          tick={{ fill: '#9ca3af' }}
                        />
                        <Radar
                          name="Puntuación"
                          dataKey="value"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.3}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart - Response Distribution */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Distribución de Respuestas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Frecuencia de puntuaciones (1-5)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {distributionData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Question Results */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Resultados por Pregunta</CardTitle>
                <CardDescription className="text-gray-400">
                  Puntuación promedio por pregunta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.questionResults?.map((qr: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CATEGORY_COLORS[qr.question?.category] || '#6b7280' }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white truncate max-w-[300px]">
                            {qr.question?.questionText || `Pregunta ${index + 1}`}
                          </span>
                          <span className="text-sm font-medium text-white">
                            {qr.avgScore?.toFixed(1) || '—'} / 5
                          </span>
                        </div>
                        <Progress 
                          value={((qr.avgScore || 0) / 5) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
