/**
 * Report Export Service
 * Generates PDF and CSV reports for ecosystem metrics
 */

export interface ReportData {
  title: string;
  generatedAt: Date;
  departmentName?: string;
  metrics: Record<string, any>;
  data: Array<Record<string, any>>;
}

/**
 * Generate CSV content from report data
 */
export function generateCSVContent(report: ReportData): string {
  const lines: string[] = [];

  // Header
  lines.push(`"${report.title}"`);
  lines.push(`"Generated: ${report.generatedAt.toISOString()}"`);
  if (report.departmentName) {
    lines.push(`"Department: ${report.departmentName}"`);
  }
  lines.push(""); // Empty line

  // Metrics summary
  lines.push('"Key Metrics"');
  Object.entries(report.metrics).forEach(([key, value]) => {
    lines.push(`"${key}","${value}"`);
  });
  lines.push(""); // Empty line

  // Data table
  if (report.data.length > 0) {
    const headers = Object.keys(report.data[0]);
    lines.push(`"${headers.join('","')}"`);

    report.data.forEach((row) => {
      const values = headers.map((h) => {
        const val = row[h];
        if (typeof val === "string") {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return `"${val}"`;
      });
      lines.push(values.join(","));
    });
  }

  return lines.join("\n");
}

/**
 * Generate PDF content (mock - in production use a PDF library)
 */
export function generatePDFContent(report: ReportData): Buffer {
  // Mock PDF generation
  // In production, use a library like pdfkit or reportlab
  const content = `
=== ${report.title} ===
Generated: ${report.generatedAt.toISOString()}
${report.departmentName ? `Department: ${report.departmentName}` : ""}

KEY METRICS:
${Object.entries(report.metrics)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

DATA:
${JSON.stringify(report.data, null, 2)}
  `;

  return Buffer.from(content, "utf-8");
}

/**
 * Generate engagement report
 */
export function generateEngagementReport(): ReportData {
  return {
    title: "Engagement Report",
    generatedAt: new Date(),
    metrics: {
      "Average Engagement Score": "84.8%",
      "Total Active Employees": 925,
      "Departments": 5,
      "Period": "Last 30 days",
    },
    data: [
      {
        Department: "Sales",
        "Engagement Score": "85%",
        "Active Employees": 185,
        "ROI": "$125,000",
        "Improvement": "+12%",
      },
      {
        Department: "Marketing",
        "Engagement Score": "78%",
        "Active Employees": 142,
        "ROI": "$98,000",
        "Improvement": "+9%",
      },
      {
        Department: "Engineering",
        "Engagement Score": "92%",
        "Active Employees": 256,
        "ROI": "$156,000",
        "Improvement": "+15%",
      },
      {
        Department: "HR",
        "Engagement Score": "88%",
        "Active Employees": 98,
        "ROI": "$76,000",
        "Improvement": "+8%",
      },
      {
        Department: "Finance",
        "Engagement Score": "81%",
        "Active Employees": 124,
        "ROI": "$112,000",
        "Improvement": "+11%",
      },
    ],
  };
}

/**
 * Generate ROI report
 */
export function generateROIReport(): ReportData {
  return {
    title: "ROI Tracking Report",
    generatedAt: new Date(),
    metrics: {
      "Total Estimated ROI": "$455,100",
      "Total Actual ROI": "$432,100",
      "Accuracy Rate": "94.9%",
      "Completed Interventions": 1235,
      "Period": "6 months",
    },
    data: [
      {
        Month: "January",
        "Estimated ROI": "$45,000",
        "Actual ROI": "$42,000",
        Interventions: 120,
        Completion: "87.5%",
      },
      {
        Month: "February",
        "Estimated ROI": "$52,000",
        "Actual ROI": "$48,500",
        Interventions: 145,
        Completion: "89.2%",
      },
      {
        Month: "March",
        "Estimated ROI": "$58,000",
        "Actual ROI": "$55,200",
        Interventions: 168,
        Completion: "91.1%",
      },
      {
        Month: "April",
        "Estimated ROI": "$65,000",
        "Actual ROI": "$62,100",
        Interventions: 185,
        Completion: "92.3%",
      },
      {
        Month: "May",
        "Estimated ROI": "$72,000",
        "Actual ROI": "$69,800",
        Interventions: 210,
        Completion: "93.5%",
      },
      {
        Month: "June",
        "Estimated ROI": "$78,000",
        "Actual ROI": "$76,500",
        Interventions: 235,
        Completion: "94.2%",
      },
    ],
  };
}

/**
 * Generate intervention report
 */
export function generateInterventionReport(): ReportData {
  return {
    title: "Intervention Performance Report",
    generatedAt: new Date(),
    metrics: {
      "Total Interventions": 1235,
      "Completed": 1162,
      "Completion Rate": "94.1%",
      "Total ROI": "$181,000",
      "Average ROI per Intervention": "$155.68",
    },
    data: [
      {
        "Intervention Type": "Education",
        Started: 120,
        Completed: 95,
        "Completion Rate": "79.2%",
        ROI: "$45,000",
        "Avg ROI": "$473.68",
      },
      {
        "Intervention Type": "Goals",
        Started: 85,
        Completed: 72,
        "Completion Rate": "84.7%",
        ROI: "$32,000",
        "Avg ROI": "$444.44",
      },
      {
        "Intervention Type": "Offers",
        Started: 150,
        Completed: 138,
        "Completion Rate": "92.0%",
        ROI: "$58,000",
        "Avg ROI": "$420.29",
      },
      {
        "Intervention Type": "Counseling",
        Started: 45,
        Completed: 38,
        "Completion Rate": "84.4%",
        ROI: "$28,000",
        "Avg ROI": "$736.84",
      },
      {
        "Intervention Type": "Manager Alert",
        Started: 60,
        Completed: 52,
        "Completion Rate": "86.7%",
        ROI: "$18,000",
        "Avg ROI": "$346.15",
      },
    ],
  };
}

/**
 * Generate FWI trends report
 */
export function generateFWITrendsReport(): ReportData {
  return {
    title: "Financial Wellness Index (FWI) Trends",
    generatedAt: new Date(),
    metrics: {
      "Average FWI Score": 68.4,
      "Improvement (6 months)": "+8.2",
      "Employees with FWI > 70": "58.2%",
      "Employees with FWI < 40": "4.3%",
    },
    data: [
      {
        Month: "January",
        "Average FWI": 60.2,
        "Below 40": "8.5%",
        "40-70": "52.3%",
        "Above 70": "39.2%",
      },
      {
        Month: "February",
        "Average FWI": 61.8,
        "Below 40": "7.9%",
        "40-70": "51.8%",
        "Above 70": "40.3%",
      },
      {
        Month: "March",
        "Average FWI": 63.5,
        "Below 40": "7.2%",
        "40-70": "50.9%",
        "Above 70": "41.9%",
      },
      {
        Month: "April",
        "Average FWI": 65.1,
        "Below 40": "6.4%",
        "40-70": "49.8%",
        "Above 70": "43.8%",
      },
      {
        Month: "May",
        "Average FWI": 66.8,
        "Below 40": "5.7%",
        "40-70": "48.5%",
        "Above 70": "45.8%",
      },
      {
        Month: "June",
        "Average FWI": 68.4,
        "Below 40": "4.3%",
        "40-70": "37.5%",
        "Above 70": "58.2%",
      },
    ],
  };
}

/**
 * Generate tier distribution report
 */
export function generateTierDistributionReport(): ReportData {
  return {
    title: "Reward Tier Distribution Report",
    generatedAt: new Date(),
    metrics: {
      "Total Employees": 925,
      "Bronze": "48.6%",
      "Silver": "30.3%",
      "Gold": "16.2%",
      "Platinum": "4.9%",
    },
    data: [
      {
        Tier: "Bronze",
        Count: 450,
        Percentage: "48.6%",
        "Avg Discount": "0%",
        "Avg EWA Reduction": "0%",
      },
      {
        Tier: "Silver",
        Count: 280,
        Percentage: "30.3%",
        "Avg Discount": "5%",
        "Avg EWA Reduction": "0.5%",
      },
      {
        Tier: "Gold",
        Count: 150,
        Percentage: "16.2%",
        "Avg Discount": "10%",
        "Avg EWA Reduction": "1.0%",
      },
      {
        Tier: "Platinum",
        Count: 45,
        Percentage: "4.9%",
        "Avg Discount": "15%",
        "Avg EWA Reduction": "1.5%",
      },
    ],
  };
}

/**
 * Export report as CSV
 */
export async function exportReportAsCSV(
  reportType: "engagement" | "roi" | "intervention" | "fwi" | "tier"
): Promise<{ filename: string; content: string }> {
  let report: ReportData;

  switch (reportType) {
    case "engagement":
      report = generateEngagementReport();
      break;
    case "roi":
      report = generateROIReport();
      break;
    case "intervention":
      report = generateInterventionReport();
      break;
    case "fwi":
      report = generateFWITrendsReport();
      break;
    case "tier":
      report = generateTierDistributionReport();
      break;
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }

  const content = generateCSVContent(report);
  const filename = `${reportType}-report-${new Date().toISOString().split("T")[0]}.csv`;

  return { filename, content };
}

/**
 * Export report as PDF
 */
export async function exportReportAsPDF(
  reportType: "engagement" | "roi" | "intervention" | "fwi" | "tier"
): Promise<{ filename: string; buffer: Buffer }> {
  let report: ReportData;

  switch (reportType) {
    case "engagement":
      report = generateEngagementReport();
      break;
    case "roi":
      report = generateROIReport();
      break;
    case "intervention":
      report = generateInterventionReport();
      break;
    case "fwi":
      report = generateFWITrendsReport();
      break;
    case "tier":
      report = generateTierDistributionReport();
      break;
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }

  const buffer = generatePDFContent(report);
  const filename = `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`;

  return { filename, buffer };
}

/**
 * Get available report types
 */
export function getAvailableReportTypes(): Array<{
  id: string;
  name: string;
  description: string;
}> {
  return [
    {
      id: "engagement",
      name: "Engagement Report",
      description: "Department engagement scores and employee activity",
    },
    {
      id: "roi",
      name: "ROI Tracking Report",
      description: "Estimated vs actual ROI over time",
    },
    {
      id: "intervention",
      name: "Intervention Performance",
      description: "Intervention completion rates and ROI",
    },
    {
      id: "fwi",
      name: "FWI Trends Report",
      description: "Financial Wellness Index trends and distribution",
    },
    {
      id: "tier",
      name: "Tier Distribution",
      description: "Reward tier distribution and benefits",
    },
  ];
}
