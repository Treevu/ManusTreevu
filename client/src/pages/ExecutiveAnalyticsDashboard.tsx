import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Users, Target, AlertTriangle, CheckCircle } from "lucide-react";

export function ExecutiveAnalyticsDashboard() {
  const { user } = useAuth();

  // Sample data - in production, this would come from the backend
  const roiData = [
    { month: "Jan", estimated: 45000, actual: 42000, interventions: 120 },
    { month: "Feb", estimated: 52000, actual: 48500, interventions: 145 },
    { month: "Mar", estimated: 58000, actual: 55200, interventions: 168 },
    { month: "Apr", estimated: 65000, actual: 62100, interventions: 185 },
    { month: "May", estimated: 72000, actual: 69800, interventions: 210 },
    { month: "Jun", estimated: 78000, actual: 76500, interventions: 235 },
  ];

  const departmentMetrics = [
    { name: "Sales", engagement: 85, roi: 125000, interventions: 45, improvement: 12 },
    { name: "Marketing", engagement: 78, roi: 98000, interventions: 38, improvement: 9 },
    { name: "Engineering", engagement: 92, roi: 156000, interventions: 52, improvement: 15 },
    { name: "HR", engagement: 88, roi: 76000, interventions: 28, improvement: 8 },
    { name: "Finance", engagement: 81, roi: 112000, interventions: 42, improvement: 11 },
  ];

  const rewardTierDistribution = [
    { name: "Bronze", value: 450, fill: "#CD7F32" },
    { name: "Silver", value: 280, fill: "#C0C0C0" },
    { name: "Gold", value: 150, fill: "#FFD700" },
    { name: "Platinum", value: 45, fill: "#E5E4E2" },
  ];

  const interventionROI = [
    { type: "Education", started: 120, completed: 95, roi: 45000 },
    { type: "Goals", started: 85, completed: 72, roi: 32000 },
    { type: "Offers", started: 150, completed: 138, roi: 58000 },
    { type: "Counseling", started: 45, completed: 38, roi: 28000 },
    { type: "Manager Alert", started: 60, completed: 52, roi: 18000 },
  ];

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600 font-semibold">Access Denied: Admin only</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Executive Analytics Dashboard</h1>
          <p className="text-gray-600">ROI Tracking, Engagement Metrics & Intervention Performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total ROI (6 months)</p>
                  <p className="text-2xl font-bold text-green-600">$455.1K</p>
                  <p className="text-xs text-green-600 mt-1">+8.2% vs last period</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Employees</p>
                  <p className="text-2xl font-bold text-blue-600">925</p>
                  <p className="text-xs text-blue-600 mt-1">Engaged in ecosystem</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Engagement</p>
                  <p className="text-2xl font-bold text-purple-600">84.8%</p>
                  <p className="text-xs text-purple-600 mt-1">Across departments</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interventions</p>
                  <p className="text-2xl font-bold text-orange-600">1,235</p>
                  <p className="text-xs text-orange-600 mt-1">Completed this period</p>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">At-Risk Employees</p>
                  <p className="text-2xl font-bold text-red-600">42</p>
                  <p className="text-xs text-red-600 mt-1">Requiring intervention</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="roi" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="roi">ROI Trend</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="tiers">Tier Distribution</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          {/* ROI Trend Chart */}
          <TabsContent value="roi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI Trend - Estimated vs Actual</CardTitle>
                <CardDescription>6-month performance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="estimated"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Estimated ROI"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Actual ROI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* ROI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Estimated ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">$455.1K</p>
                  <p className="text-sm text-gray-600 mt-2">Sum of all estimated values</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Actual ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">$432.1K</p>
                  <p className="text-sm text-gray-600 mt-2">Verified achievements</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Accuracy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">94.9%</p>
                  <p className="text-sm text-gray-600 mt-2">Actual vs Estimated</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Department Performance */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance Metrics</CardTitle>
                <CardDescription>Engagement, ROI, and improvement by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentMetrics.map((dept) => (
                    <div key={dept.name} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{dept.name}</h3>
                        <Badge className="bg-blue-100 text-blue-900">
                          {dept.engagement}% Engagement
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">ROI</p>
                          <p className="text-lg font-bold text-green-600">
                            ${(dept.roi / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Interventions</p>
                          <p className="text-lg font-bold text-orange-600">
                            {dept.interventions}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">FWI Improvement</p>
                          <p className="text-lg font-bold text-purple-600">
                            +{dept.improvement}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tier Distribution */}
          <TabsContent value="tiers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reward Tier Distribution</CardTitle>
                <CardDescription>Employee distribution across reward tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={rewardTierDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rewardTierDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tier Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rewardTierDistribution.map((tier) => (
                <Card key={tier.name}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: tier.fill }}
                      />
                      <p className="font-semibold">{tier.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{tier.value}</p>
                      <p className="text-xs text-gray-600">
                        {((tier.value / 925) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Intervention ROI */}
          <TabsContent value="interventions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Type Performance</CardTitle>
                <CardDescription>ROI by intervention type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={interventionROI}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="completed"
                      fill="#10b981"
                      name="Completed"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="roi"
                      fill="#8b5cf6"
                      name="ROI ($)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Intervention Details */}
            <div className="space-y-4">
              {interventionROI.map((intervention) => (
                <Card key={intervention.type}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{intervention.type}</h3>
                        <p className="text-sm text-gray-600">
                          {intervention.completed} of {intervention.started} completed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${(intervention.roi / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-gray-600">
                          {((intervention.completed / intervention.started) * 100).toFixed(0)}% completion
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Insights Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Key Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 space-y-3">
            <p>
              ✅ <span className="font-semibold">Strong ROI Performance:</span> Actual ROI is tracking at 94.9% of estimates, indicating accurate forecasting and effective intervention execution.
            </p>
            <p>
              ✅ <span className="font-semibold">High Engagement Across Departments:</span> Average engagement of 84.8% shows strong adoption of the ecosystem reinforcements.
            </p>
            <p>
              ⚠️ <span className="font-semibold">Opportunity:</span> Engineering department shows highest ROI ($156K) - consider replicating their intervention strategies across other departments.
            </p>
            <p>
              💡 <span className="font-semibold">Recommendation:</span> Increase focus on "Offers" intervention type, which shows highest ROI ($58K) with 92% completion rate.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
