import { getDb } from "../db";

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  fwiScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  treePoints: number;
  tier: string;
  activeInterventions: number;
  lastActivityDate: Date;
}

export interface TeamPerformance {
  totalMembers: number;
  averageFWI: number;
  averageEngagement: number;
  totalROI: number;
  interventionsCompleted: number;
  atRiskCount: number;
  improvingCount: number;
}

export interface InterventionOversight {
  interventionId: number;
  employeeId: number;
  employeeName: string;
  type: string;
  status: "active" | "completed" | "abandoned";
  startDate: Date;
  expectedCompletion: Date;
  progress: number;
  estimatedROI: number;
  actualROI?: number;
}

export interface ManagerMessage {
  id: number;
  managerId: number;
  employeeId: number;
  subject: string;
  message: string;
  sentAt: Date;
  readAt?: Date;
}

/**
 * Get team members for a manager
 */
export async function getTeamMembers(managerId: number): Promise<TeamMember[]> {
  try {
    // Mock data - in production, query users table with manager_id
    return [
      {
        id: 101,
        name: "John Doe",
        email: "john@company.com",
        fwiScore: 35,
        riskLevel: "high",
        treePoints: 800,
        tier: "Silver",
        activeInterventions: 2,
        lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 102,
        name: "Jane Smith",
        email: "jane@company.com",
        fwiScore: 72,
        riskLevel: "low",
        treePoints: 2500,
        tier: "Gold",
        activeInterventions: 0,
        lastActivityDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 103,
        name: "Bob Johnson",
        email: "bob@company.com",
        fwiScore: 45,
        riskLevel: "medium",
        treePoints: 1200,
        tier: "Silver",
        activeInterventions: 1,
        lastActivityDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: 104,
        name: "Alice Williams",
        email: "alice@company.com",
        fwiScore: 28,
        riskLevel: "critical",
        treePoints: 400,
        tier: "Bronze",
        activeInterventions: 3,
        lastActivityDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 105,
        name: "Charlie Brown",
        email: "charlie@company.com",
        fwiScore: 65,
        riskLevel: "low",
        treePoints: 2100,
        tier: "Gold",
        activeInterventions: 0,
        lastActivityDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ];
  } catch (error) {
    console.error("Error getting team members:", error);
    return [];
  }
}

/**
 * Get team performance metrics
 */
export async function getTeamPerformance(managerId: number): Promise<TeamPerformance> {
  try {
    const teamMembers = await getTeamMembers(managerId);

    const averageFWI = teamMembers.reduce((sum, m) => sum + m.fwiScore, 0) / teamMembers.length;
    const atRiskCount = teamMembers.filter((m) => m.riskLevel === "high" || m.riskLevel === "critical").length;
    const improvingCount = teamMembers.filter((m) => m.riskLevel === "low").length;

    return {
      totalMembers: teamMembers.length,
      averageFWI: Math.round(averageFWI * 10) / 10,
      averageEngagement: 82.5,
      totalROI: 245000,
      interventionsCompleted: 34,
      atRiskCount,
      improvingCount,
    };
  } catch (error) {
    console.error("Error getting team performance:", error);
    return {
      totalMembers: 0,
      averageFWI: 0,
      averageEngagement: 0,
      totalROI: 0,
      interventionsCompleted: 0,
      atRiskCount: 0,
      improvingCount: 0,
    };
  }
}

/**
 * Get active interventions for team
 */
export async function getTeamInterventions(managerId: number): Promise<InterventionOversight[]> {
  try {
    // Mock data - in production, query risk_intervention_plans table
    return [
      {
        interventionId: 1,
        employeeId: 101,
        employeeName: "John Doe",
        type: "education",
        status: "active",
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        progress: 60,
        estimatedROI: 45000,
      },
      {
        interventionId: 2,
        employeeId: 101,
        employeeName: "John Doe",
        type: "counseling",
        status: "active",
        startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        progress: 35,
        estimatedROI: 65000,
      },
      {
        interventionId: 3,
        employeeId: 103,
        employeeName: "Bob Johnson",
        type: "goals",
        status: "active",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        progress: 25,
        estimatedROI: 32000,
      },
      {
        interventionId: 4,
        employeeId: 104,
        employeeName: "Alice Williams",
        type: "education",
        status: "active",
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        progress: 75,
        estimatedROI: 55000,
      },
      {
        interventionId: 5,
        employeeId: 104,
        employeeName: "Alice Williams",
        type: "counseling",
        status: "active",
        startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        progress: 50,
        estimatedROI: 75000,
      },
      {
        interventionId: 6,
        employeeId: 104,
        employeeName: "Alice Williams",
        type: "offers",
        status: "active",
        startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expectedCompletion: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
        progress: 10,
        estimatedROI: 28000,
      },
    ];
  } catch (error) {
    console.error("Error getting team interventions:", error);
    return [];
  }
}

/**
 * Send support message to employee
 */
export async function sendSupportMessage(
  managerId: number,
  employeeId: number,
  subject: string,
  message: string
): Promise<{ success: boolean; messageId?: number }> {
  try {
    const db = await getDb();
    if (!db) return { success: false };

    // In a real app, you'd insert into manager_messages table
    console.log(`[Manager Message] Manager ${managerId} sent message to employee ${employeeId}: "${subject}"`);

    return {
      success: true,
      messageId: Math.floor(Math.random() * 10000),
    };
  } catch (error) {
    console.error("Error sending support message:", error);
    return { success: false };
  }
}

/**
 * Get employee detail view
 */
export async function getEmployeeDetail(employeeId: number): Promise<{
  id: number;
  name: string;
  email: string;
  department: string;
  fwiScore: number;
  riskLevel: string;
  treePoints: number;
  tier: string;
  joinDate: Date;
  lastActivity: Date;
  interventions: InterventionOversight[];
  recommendations: Array<{ type: string; estimatedSavings: number }>;
  fwiTrend: Array<{ month: string; score: number }>;
} | null> {
  try {
    // Mock data - in production, query users and related tables
    return {
      id: employeeId,
      name: "John Doe",
      email: "john@company.com",
      department: "Sales",
      fwiScore: 35,
      riskLevel: "high",
      treePoints: 800,
      tier: "Silver",
      joinDate: new Date(2023, 0, 15),
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      interventions: [
        {
          interventionId: 1,
          employeeId,
          employeeName: "John Doe",
          type: "education",
          status: "active",
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          expectedCompletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          progress: 60,
          estimatedROI: 45000,
        },
      ],
      recommendations: [
        { type: "Spending Reduction", estimatedSavings: 150 },
        { type: "Refinance Loan", estimatedSavings: 200 },
      ],
      fwiTrend: [
        { month: "January", score: 28 },
        { month: "February", score: 30 },
        { month: "March", score: 32 },
        { month: "April", score: 35 },
      ],
    };
  } catch (error) {
    console.error("Error getting employee detail:", error);
    return null;
  }
}

/**
 * Get manager dashboard summary
 */
export async function getManagerDashboardSummary(managerId: number): Promise<{
  teamSize: number;
  averageFWI: number;
  atRiskEmployees: number;
  activeInterventions: number;
  completedInterventions: number;
  totalROI: number;
  thisMonthROI: number;
}> {
  try {
    const performance = await getTeamPerformance(managerId);
    const interventions = await getTeamInterventions(managerId);

    return {
      teamSize: performance.totalMembers,
      averageFWI: performance.averageFWI,
      atRiskEmployees: performance.atRiskCount,
      activeInterventions: interventions.filter((i) => i.status === "active").length,
      completedInterventions: performance.interventionsCompleted,
      totalROI: performance.totalROI,
      thisMonthROI: 45000,
    };
  } catch (error) {
    console.error("Error getting manager dashboard summary:", error);
    return {
      teamSize: 0,
      averageFWI: 0,
      atRiskEmployees: 0,
      activeInterventions: 0,
      completedInterventions: 0,
      totalROI: 0,
      thisMonthROI: 0,
    };
  }
}
