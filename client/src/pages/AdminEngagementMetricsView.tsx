import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Award } from "lucide-react";

export function AdminEngagementMetricsView() {
  const { data: metrics, isLoading } = (trpc as any).ecosystem.metrics.getAll.useQuery();

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-200 rounded" />;
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-600">No metrics available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ecosystem Engagement Metrics</CardTitle>
          <CardDescription>Monitor department-level engagement and ROI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric: any) => (
              <div
                key={metric.id}
                className="p-4 border rounded-lg hover:bg-gray-50 space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Department {metric.departmentId}</h3>
                    <p className="text-sm text-gray-600">
                      {metric.month}/{metric.year}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-900">
                    Engagement: {metric.engagementScore}%
                  </Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-600">Active Employees</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {metric.activeEmployees}/{metric.totalEmployees}
                    </p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-600">Avg TreePoints</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {metric.avgTreePointsPerEmployee}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-600">FWI Improvement</p>
                    </div>
                    <p className="text-lg font-bold text-purple-600">
                      +{metric.avgFwiScoreImprovement}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-600">Estimated ROI</p>
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      ${metric.estimatedROI}
                    </p>
                  </div>
                </div>

                {/* EWA & Interventions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">EWA Requests</p>
                    <p className="text-lg font-bold">{metric.ewaRequestsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Approval Rate</p>
                    <p className="text-lg font-bold text-green-600">
                      {parseFloat(metric.ewaApprovalRate.toString()).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Interventions Started</p>
                    <p className="text-lg font-bold">{metric.interventionPlansStarted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Interventions Completed</p>
                    <p className="text-lg font-bold text-green-600">
                      {metric.interventionPlansCompleted}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
