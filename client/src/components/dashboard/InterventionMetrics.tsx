import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, CheckCircle, TrendingUp, Target, 
  AlertCircle, Zap, DollarSign 
} from 'lucide-react';

interface InterventionMetricsProps {
  metrics: any;
}

export default function InterventionMetrics({ metrics }: InterventionMetricsProps) {
  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No intervention data available</p>
      </div>
    );
  }

  const successRate = metrics?.interventionSuccessRate || 0;
  const activeCount = metrics?.activeInterventions || 0;
  const completedCount = metrics?.completedInterventions || 0;
  const totalInterventions = activeCount + completedCount;
  const estimatedROI = metrics?.estimatedROI || 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Interventions */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Active</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
            <p className="text-xs text-slate-600 mt-1">In progress</p>
          </CardContent>
        </Card>

        {/* Completed Interventions */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Completed</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-slate-600 mt-1">Total finished</p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Success Rate</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{successRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-600 mt-1">Effectiveness</p>
          </CardContent>
        </Card>

        {/* Estimated ROI */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Est. ROI</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(estimatedROI / 100).toFixed(0)}</div>
            <p className="text-xs text-slate-600 mt-1">Estimated savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Intervention Types Breakdown */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            Intervention Types Performance
          </CardTitle>
          <CardDescription>
            Success rates by intervention type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { name: 'Counseling', rate: 85, count: 12 },
              { name: 'Education', rate: 72, count: 8 },
              { name: 'Personalized Offer', rate: 78, count: 15 },
              { name: 'Manager Alert', rate: 90, count: 5 },
              { name: 'EWA Support', rate: 68, count: 10 },
            ].map((type) => (
              <div key={type.name}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900">{type.name}</p>
                    <p className="text-xs text-slate-600">{type.count} interventions</p>
                  </div>
                  <Badge variant="outline">{type.rate}%</Badge>
                </div>
                <Progress value={type.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Segments */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Top Performing Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { segment: 'High Engagement', success: 92, improvement: '+18 FWI' },
                { segment: 'At-Risk', success: 78, improvement: '+12 FWI' },
                { segment: 'New Users', success: 85, improvement: '+15 FWI' },
              ].map((item) => (
                <div key={item.segment} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{item.segment}</p>
                    <p className="text-xs text-slate-600">{item.improvement}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{item.success}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Reduction Impact */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Churn Risk Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'Avg Risk Before', value: '68%', color: 'text-red-600' },
                { metric: 'Avg Risk After', value: '32%', color: 'text-green-600' },
                { metric: 'Total Risk Reduced', value: '36%', color: 'text-blue-600' },
              ].map((item) => (
                <div key={item.metric} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">{item.metric}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Impact */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Engagement Impact
          </CardTitle>
          <CardDescription>
            How interventions affect user engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">App Opens</p>
              <p className="text-2xl font-bold text-blue-600">+34%</p>
              <p className="text-xs text-slate-600 mt-1">Post-intervention</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Feature Usage</p>
              <p className="text-2xl font-bold text-purple-600">+28%</p>
              <p className="text-xs text-slate-600 mt-1">Post-intervention</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">Session Duration</p>
              <p className="text-2xl font-bold text-green-600">+42%</p>
              <p className="text-xs text-slate-600 mt-1">Post-intervention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
