import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompetitiveIntelligenceProps {
  isLoading?: boolean;
}

export default function CompetitiveIntelligence({ isLoading = false }: CompetitiveIntelligenceProps) {
  const competitiveData = [
    { metric: 'FWI Score', company: 54, industry: 62, benchmark: 70 },
    { metric: 'Retención', company: 88, industry: 92, benchmark: 95 },
    { metric: 'Satisfacción', company: 72, industry: 78, benchmark: 85 },
    { metric: 'Beneficios', company: 65, industry: 75, benchmark: 80 },
    { metric: 'Desarrollo', company: 58, industry: 70, benchmark: 75 },
  ];

  const gaps = [
    { area: 'FWI Score', gap: -16, priority: 'Crítico', recommendation: 'Aumentar programas de educación financiera' },
    { area: 'Retención', gap: -7, priority: 'Alto', recommendation: 'Mejorar beneficios y compensación' },
    { area: 'Satisfacción', gap: -13, priority: 'Alto', recommendation: 'Implementar encuestas y feedback' },
    { area: 'Beneficios', gap: -15, priority: 'Crítico', recommendation: 'Revisar paquete de beneficios' },
    { area: 'Desarrollo', gap: -17, priority: 'Crítico', recommendation: 'Crear programas de capacitación' },
  ];

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Inteligencia Competitiva</CardTitle>
          <CardDescription>Comparación con industria y benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competitiveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="metric" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              <Legend />
              <Bar dataKey="company" fill="#ef4444" name="Nuestra Empresa" />
              <Bar dataKey="industry" fill="#f97316" name="Promedio Industria" />
              <Bar dataKey="benchmark" fill="#10b981" name="Benchmark" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análisis de Brechas */}
      <Card className="border-0 shadow-lg bg-treevu-surface/80 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Análisis de Brechas</CardTitle>
          <CardDescription>Diferencias vs benchmark y recomendaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gaps.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{item.area}</p>
                  <span className={`text-sm font-bold ${item.gap < -10 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {item.gap}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Prioridad: <span className={item.priority === 'Crítico' ? 'text-red-400' : 'text-yellow-400'}>{item.priority}</span>
                </p>
                <p className="text-sm text-gray-300">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
