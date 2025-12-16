import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  Treemap,
  ComposedChart,
  Bar,
  Line,
} from "recharts";

/**
 * Heatmap data for engagement by department and month
 */
const engagementHeatmapData = [
  { department: "Sales", jan: 75, feb: 78, mar: 82, apr: 85, may: 87, jun: 85 },
  { department: "Marketing", jan: 68, feb: 70, mar: 73, apr: 76, may: 77, jun: 78 },
  { department: "Engineering", jan: 88, feb: 89, mar: 90, apr: 91, may: 92, jun: 92 },
  { department: "HR", jan: 82, feb: 84, mar: 85, apr: 87, may: 88, jun: 88 },
  { department: "Finance", jan: 72, feb: 74, mar: 76, apr: 79, may: 80, jun: 81 },
];

/**
 * Treemap data for ROI by intervention type
 */
const roiTreemapData = [
  {
    name: "Offers",
    value: 58000,
    fill: "#10b981",
    children: [
      { name: "Offers", value: 58000, fill: "#10b981" },
    ],
  },
  {
    name: "Education",
    value: 45000,
    fill: "#3b82f6",
    children: [
      { name: "Education", value: 45000, fill: "#3b82f6" },
    ],
  },
  {
    name: "Goals",
    value: 32000,
    fill: "#f59e0b",
    children: [
      { name: "Goals", value: 32000, fill: "#f59e0b" },
    ],
  },
  {
    name: "Counseling",
    value: 28000,
    fill: "#8b5cf6",
    children: [
      { name: "Counseling", value: 28000, fill: "#8b5cf6" },
    ],
  },
  {
    name: "Manager Alert",
    value: 18000,
    fill: "#ec4899",
    children: [
      { name: "Manager Alert", value: 18000, fill: "#ec4899" },
    ],
  },
];

/**
 * Funnel data for intervention completion
 */
const interventionFunnelData = [
  { name: "Started", value: 1235, fill: "#3b82f6" },
  { name: "In Progress", value: 1050, fill: "#f59e0b" },
  { name: "Near Completion", value: 890, fill: "#8b5cf6" },
  { name: "Completed", value: 1162, fill: "#10b981" },
];

/**
 * Scatter plot data: FWI vs Spending
 */
const fwiVsSpendingData = [
  { fwi: 25, spending: 8500, department: "Sales", employees: 45 },
  { fwi: 35, spending: 6200, department: "Marketing", employees: 32 },
  { fwi: 45, spending: 4100, department: "Engineering", employees: 58 },
  { fwi: 55, spending: 3200, department: "HR", employees: 28 },
  { fwi: 65, spending: 2100, department: "Finance", employees: 35 },
  { fwi: 75, spending: 1200, department: "Sales", employees: 42 },
  { fwi: 85, spending: 600, department: "Marketing", employees: 38 },
  { fwi: 92, spending: 300, department: "Engineering", employees: 52 },
];

/**
 * Gauge chart data (using bar chart as approximation)
 */
const gaugeData = [
  { name: "Engagement", value: 84.8, max: 100, fill: "#10b981" },
  { name: "ROI Accuracy", value: 94.9, max: 100, fill: "#3b82f6" },
  { name: "Completion Rate", value: 94.1, max: 100, fill: "#f59e0b" },
  { name: "Satisfaction", value: 88.5, max: 100, fill: "#8b5cf6" },
];

/**
 * Component for Heatmap visualization
 */
export function EngagementHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Heatmap</CardTitle>
        <CardDescription>Department engagement scores by month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {engagementHeatmapData.map((row) => (
            <div key={row.department} className="space-y-2">
              <h4 className="font-semibold text-sm">{row.department}</h4>
              <div className="flex gap-1">
                {[row.jan, row.feb, row.mar, row.apr, row.may, row.jun].map(
                  (value, idx) => {
                    const intensity = value / 100;
                    const hue = 120 + (1 - intensity) * 60; // Green to Red
                    return (
                      <div
                        key={idx}
                        className="flex-1 h-12 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor: `hsl(${hue}, 70%, 50%)`,
                        }}
                        title={`${value}%`}
                      >
                        {value}%
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Component for Treemap visualization
 */
export function ROITreemap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI by Intervention Type</CardTitle>
        <CardDescription>Treemap visualization of ROI distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={roiTreemapData}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
          >
            {roiTreemapData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <Tooltip
              formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
            />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Component for Funnel visualization
 */
export function InterventionFunnel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Intervention Funnel</CardTitle>
        <CardDescription>Intervention completion flow</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <FunnelChart margin={{ top: 20, right: 160, bottom: 20, left: 20 }}>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={interventionFunnelData}
            >
              {interventionFunnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {interventionFunnelData.map((item) => (
            <div key={item.name} className="border rounded p-3">
              <p className="text-sm text-gray-600">{item.name}</p>
              <p className="text-2xl font-bold" style={{ color: item.fill }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Component for Scatter plot visualization
 */
export function FWIVsSpendingScatter() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FWI Score vs Spending</CardTitle>
        <CardDescription>
          Correlation between financial wellness and spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fwi"
              name="FWI Score"
              type="number"
              label={{ value: "FWI Score", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              dataKey="spending"
              name="Monthly Spending"
              type="number"
              label={{ value: "Spending ($)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value: any) => {
                if (typeof value === "number" && value > 100) {
                  return `$${(value / 1000).toFixed(1)}K`;
                }
                return value;
              }}
            />
            <Legend />
            <Scatter
              name="Employees"
              data={fwiVsSpendingData}
              fill="#8b5cf6"
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Component for KPI Gauges
 */
export function KPIGauges() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Indicators</CardTitle>
        <CardDescription>Current KPI status and targets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {gaugeData.map((kpi) => (
            <div key={kpi.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm">{kpi.name}</h4>
                <span className="text-lg font-bold text-gray-900">
                  {kpi.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${kpi.value}%`,
                    backgroundColor: kpi.fill,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>Target: 100%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Component for Composed chart (Bar + Line)
 */
export function EngagementTrendComposed() {
  const data = [
    {
      month: "Jan",
      engagement: 75,
      roi: 45000,
      interventions: 120,
    },
    {
      month: "Feb",
      engagement: 78,
      roi: 52000,
      interventions: 145,
    },
    {
      month: "Mar",
      engagement: 82,
      roi: 58000,
      interventions: 168,
    },
    {
      month: "Apr",
      engagement: 85,
      roi: 65000,
      interventions: 185,
    },
    {
      month: "May",
      engagement: 87,
      roi: 72000,
      interventions: 210,
    },
    {
      month: "Jun",
      engagement: 85,
      roi: 78000,
      interventions: 235,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement & ROI Trend</CardTitle>
        <CardDescription>Combined view of engagement and ROI growth</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: "Engagement %", angle: -90, position: "insideLeft" }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "ROI ($)", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="engagement" fill="#8b5cf6" name="Engagement %" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roi"
              stroke="#10b981"
              name="ROI ($)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/**
 * Main component combining all advanced visualizations
 */
export function AdvancedVisualizationsDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive visualization suite for ecosystem performance analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementHeatmap />
        <KPIGauges />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ROITreemap />
        <InterventionFunnel />
      </div>

      <FWIVsSpendingScatter />
      <EngagementTrendComposed />
    </div>
  );
}
