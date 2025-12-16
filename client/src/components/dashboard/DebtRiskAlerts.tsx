import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingDown, Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DebtRiskAlertsProps {
  isLoading?: boolean;
}

export default function DebtRiskAlerts({ isLoading = false }: DebtRiskAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // FWI Score trend
  const fwiTrend = [
    { week: 'Sem 1', score: 75, trend: 'stable' },
    { week: 'Sem 2', score: 73, trend: 'down' },
    { week: 'Sem 3', score: 70, trend: 'down' },
    { week: 'Sem 4', score: 68, trend: 'down' },
    { week: 'Sem 5', score: 65, trend: 'down' },
    { week: 'Sem 6', score: 62, trend: 'critical' },
  ];

  // Risk alerts
  const alerts = [
    {
      id: 'fwi-decline',
      severity: 'high',
      title: 'Declive de FWI Score',
      description: 'Tu FWI Score bajó 13 puntos en 6 semanas. Esto indica riesgo de acudir a deuda.',
      recommendation: 'Usa dispersión de salario para estabilizar tus finanzas.',
      action: 'Ver Calculadora de Ahorro',
      icon: TrendingDown,
    },
    {
      id: 'spending-increase',
      severity: 'medium',
      title: 'Aumento de Gastos',
      description: 'Tus gastos aumentaron 18% comparado al mes anterior ($450 más).',
      recommendation: 'Revisa tus gastos y considera usar dispersión para necesidades futuras.',
      action: 'Analizar Gastos',
      icon: AlertCircle,
    },
    {
      id: 'savings-depleted',
      severity: 'high',
      title: 'Ahorros Agotados',
      description: 'Tu fondo de emergencia está bajo ($250). Riesgo alto de acudir a deuda.',
      recommendation: 'Usa dispersión de salario para reconstruir tu fondo de emergencia.',
      action: 'Crear Plan de Ahorro',
      icon: AlertCircle,
    },
    {
      id: 'debt-pattern',
      severity: 'medium',
      title: 'Patrón de Deuda Detectado',
      description: 'Notamos que acudes a deuda cada mes para gastos inesperados.',
      recommendation: 'Usa dispersión de salario para cubrir estos gastos y evitar deuda.',
      action: 'Configurar Dispersión',
      icon: Lightbulb,
    },
  ];

  const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/10 border-blue-500/50';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-4">
      {/* FWI Score Trend */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Tendencia de FWI Score</CardTitle>
          <CardDescription>Monitoreo de últimas 6 semanas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={fwiTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="week" stroke="#999" />
              <YAxis stroke="#999" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-sm text-red-300">
              <strong>⚠ Alerta:</strong> Tu FWI Score está en tendencia bajista. Esto indica riesgo creciente de acudir a deuda.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <Card className="border-0 shadow-lg bg-green-500/10 border border-green-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-green-400">¡Sin Alertas!</p>
                  <p className="text-sm text-green-300">Tu situación financiera está bajo control.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          activeAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <Card
                key={alert.id}
                className={`border-0 shadow-lg border ${getSeverityColor(alert.severity)}`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                        <div>
                          <p className="font-bold text-white">{alert.title}</p>
                          <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(alert.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✕
                      </Button>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-white/5 rounded border border-white/10">
                      <p className="text-xs text-gray-400 mb-2">Recomendación</p>
                      <p className="text-sm text-white">{alert.recommendation}</p>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                      {alert.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Risk Factors */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Factores de Riesgo Detectados</CardTitle>
          <CardDescription>Indicadores que sugieren riesgo de deuda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Gastos Mensuales</p>
                <p className="text-sm text-gray-400">$3,200 (85% de ingresos)</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Fondo de Emergencia</p>
                <p className="text-sm text-gray-400">$250 (Crítico: bajo $1,000)</p>
              </div>
              <span className="text-2xl">⚠️</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Gastos Inesperados</p>
                <p className="text-sm text-gray-400">Promedio $400/mes</p>
              </div>
              <span className="text-2xl">💸</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Deuda Actual</p>
                <p className="text-sm text-gray-400">$800 (Tarjeta de crédito)</p>
              </div>
              <span className="text-2xl">💳</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded">
              <div>
                <p className="font-bold text-white">Frecuencia de Deuda</p>
                <p className="text-sm text-gray-400">Cada mes para gastos inesperados</p>
              </div>
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card className="border-0 shadow-lg bg-blue-500/10 border border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400">Acciones Recomendadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-xl">1️⃣</span>
            <div>
              <p className="font-bold text-white">Usa Dispersión de Salario</p>
              <p className="text-sm text-blue-300">Cubre tus gastos inesperados sin deuda. Accede a $400-500 cuando los necesites.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">2️⃣</span>
            <div>
              <p className="font-bold text-white">Reconstruye tu Fondo de Emergencia</p>
              <p className="text-sm text-blue-300">Objetivo: $1,000. Usa dispersión para ahorrar sin esfuerzo.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">3️⃣</span>
            <div>
              <p className="font-bold text-white">Paga tu Deuda Actual</p>
              <p className="text-sm text-blue-300">Los $800 de tarjeta de crédito te cuestan $100/mes en intereses.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-xl">4️⃣</span>
            <div>
              <p className="font-bold text-white">Monitorea tu FWI Score</p>
              <p className="text-sm text-blue-300">Revisa semanalmente. Objetivo: volver a 75+ puntos en 8 semanas.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prevention Tips */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Consejos para Prevenir Deuda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-300">
          <p>✓ Usa dispersión de salario para gastos inesperados (medicina, reparaciones)</p>
          <p>✓ Mantén un fondo de emergencia de al menos 3 meses de gastos</p>
          <p>✓ Evita tarjetas de crédito para gastos del día a día</p>
          <p>✓ Planifica gastos grandes con dispersión de salario</p>
          <p>✓ Revisa tu FWI Score semanalmente para detectar problemas temprano</p>
        </CardContent>
      </Card>
    </div>
  );
}
