import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, Users, AlertCircle, CheckCircle, 
  BarChart3, Activity, Target, Zap 
} from 'lucide-react';

interface MetricsOverviewProps {
  metrics: any;
}

export default function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const getHealthColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-500/10';
    if (score >= 50) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Employees */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Total Employees</span>
            <Users className="w-4 h-4 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalEmployees || 0}</div>
          <p className="text-xs text-slate-600 mt-1">Active users</p>
        </CardContent>
      </Card>

      {/* Average FWI Score */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Avg FWI Score</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getHealthColor(metrics?.avgFwiScore || 0)}`}>
            {metrics?.avgFwiScore?.toFixed(1) || 0}
          </div>
          <p className="text-xs text-slate-600 mt-1">Financial wellness index</p>
        </CardContent>
      </Card>

      {/* Employees at Risk */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>At Risk</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{metrics?.employeesAtRisk || 0}</div>
          <p className="text-xs text-slate-600 mt-1">
            {metrics?.riskPercentage?.toFixed(1) || 0}% of total
          </p>
        </CardContent>
      </Card>

      {/* Intervention Success Rate */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Success Rate</span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics?.interventionSuccessRate?.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-slate-600 mt-1">Intervention effectiveness</p>
        </CardContent>
      </Card>

      {/* Active Interventions */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Active</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.activeInterventions || 0}</div>
          <p className="text-xs text-slate-600 mt-1">Active interventions</p>
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
          <div className="text-2xl font-bold">{metrics?.completedInterventions || 0}</div>
          <p className="text-xs text-slate-600 mt-1">Total completed</p>
        </CardContent>
      </Card>

      {/* Churn Risk Average */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Churn Risk</span>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {(metrics?.churnRiskAverage * 100)?.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-slate-600 mt-1">Average risk level</p>
        </CardContent>
      </Card>

      {/* Engagement Score */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Engagement</span>
            <Zap className="w-4 h-4 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {metrics?.engagementScore || 0}
          </div>
          <p className="text-xs text-slate-600 mt-1">User engagement score</p>
        </CardContent>
      </Card>
    </div>
  );
}
