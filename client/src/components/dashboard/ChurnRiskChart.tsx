import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

interface ChurnRiskChartProps {
  metrics: any[];
}

export default function ChurnRiskChart({ metrics }: ChurnRiskChartProps) {
  const chartData = useMemo(() => {
    if (!metrics || metrics.length === 0) {
      return [];
    }

    return metrics.map((m: any) => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      churnRisk: Math.round((m.churnRiskAverage || 0) * 100),
      atRisk: m.employeesAtRisk || 0,
      fwiScore: m.avgFwiScore || 0,
    })).slice(-30); // Last 30 days
  }, [metrics]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
          label={{ value: 'Churn Risk %', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="churnRisk"
          stroke="#ef4444"
          fillOpacity={1}
          fill="url(#colorChurn)"
          name="Churn Risk %"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
