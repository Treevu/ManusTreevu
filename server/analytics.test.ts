import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@treevu.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createB2BAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "b2b-admin-user",
    email: "b2b@company.com",
    name: "B2B Admin",
    loginMethod: "manus",
    role: "b2b_admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createEmployeeContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 3,
    openId: "employee-user",
    email: "employee@company.com",
    name: "Employee User",
    loginMethod: "manus",
    role: "employee",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("analytics.getUserStats", () => {
  it("returns user statistics for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getUserStats({});

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("activeToday");
    expect(result).toHaveProperty("newThisWeek");
    expect(result).toHaveProperty("byRole");
    expect(typeof result.total).toBe("number");
    expect(typeof result.activeToday).toBe("number");
    expect(typeof result.newThisWeek).toBe("number");
    expect(typeof result.byRole).toBe("object");
  });

  it("accepts date filter parameter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await caller.legacyAnalytics.getUserStats({ startDate: thirtyDaysAgo.toISOString() });

    expect(result).toHaveProperty("total");
    expect(typeof result.total).toBe("number");
  });

  it("returns user statistics for b2b_admin users", async () => {
    const { ctx } = createB2BAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getUserStats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("activeToday");
    expect(result).toHaveProperty("newThisWeek");
    expect(result).toHaveProperty("byRole");
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getUserStats()).rejects.toThrow("Solo administradores pueden ver analytics");
  });
});
describe("analytics.getEwaStats", () => {
  it("returns EWA statistics for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getEwaStats({});

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("pending");
    expect(result).toHaveProperty("approved");
    expect(result).toHaveProperty("rejected");
    expect(result).toHaveProperty("totalAmount");
    expect(result).toHaveProperty("approvedAmount");
    expect(typeof result.total).toBe("number");
    expect(typeof result.pending).toBe("number");
    expect(typeof result.approved).toBe("number");
    expect(typeof result.rejected).toBe("number");
    expect(typeof result.totalAmount).toBe("number");
    expect(typeof result.approvedAmount).toBe("number");
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getEwaStats()).rejects.toThrow("Solo administradores pueden ver analytics");
  });
});

describe("analytics.getEngagementStats", () => {
  it("returns engagement statistics for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getEngagementStats({});

    expect(result).toHaveProperty("achievements");
    expect(result).toHaveProperty("goals");
    expect(result).toHaveProperty("transactions");
    expect(result).toHaveProperty("referrals");
    expect(result).toHaveProperty("treePoints");
    expect(result.treePoints).toHaveProperty("emitted");
    expect(result.treePoints).toHaveProperty("redeemed");
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getEngagementStats()).rejects.toThrow("Solo administradores pueden ver analytics");
  });
});

describe("analytics.getDepartmentStats", () => {
  it("returns department statistics for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getDepartmentStats({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getDepartmentStats()).rejects.toThrow("Solo administradores pueden ver analytics");
  });
});

describe("analytics.getMonthlyTrends", () => {
  it("returns monthly trends for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getMonthlyTrends({});

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("month");
      expect(result[0]).toHaveProperty("users");
      expect(result[0]).toHaveProperty("active");
      expect(result[0]).toHaveProperty("ewaRequests");
    }
  });

  it("accepts months parameter for custom range", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getMonthlyTrends({ months: 3 });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getMonthlyTrends()).rejects.toThrow("Solo administradores pueden ver analytics");
  });
});


describe("analytics.getAlertThresholds", () => {
  it("returns alert thresholds for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getAlertThresholds();

    expect(Array.isArray(result)).toBe(true);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getAlertThresholds()).rejects.toThrow("Solo administradores pueden configurar alertas");
  });
});

describe("analytics.setAlertThreshold", () => {
  it("sets alert threshold for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.setAlertThreshold({
      departmentId: 1,
      fwiThreshold: 50,
      highRiskThreshold: 3,
      isEnabled: true,
      notifyAdmins: true,
      notifyB2BAdmin: true
    });

    expect(result).toBeDefined();
    expect(result?.departmentId).toBe(1);
    expect(result?.fwiThreshold).toBe(50);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.setAlertThreshold({
      departmentId: 1,
      fwiThreshold: 50,
      highRiskThreshold: 3,
      isEnabled: true,
      notifyAdmins: true,
      notifyB2BAdmin: true
    })).rejects.toThrow("Solo administradores pueden configurar alertas");
  });
});

describe("analytics.getAlertHistory", () => {
  it("returns alert history for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getAlertHistory({});

    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts departmentId filter", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getAlertHistory({ departmentId: 1 });

    expect(Array.isArray(result)).toBe(true);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getAlertHistory()).rejects.toThrow("Solo administradores pueden ver historial de alertas");
  });
});

describe("analytics.getDepartmentDetail", () => {
  it("returns department detail for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.getDepartmentDetail({ departmentId: 1 });

    expect(result).toHaveProperty("department");
    expect(result).toHaveProperty("employees");
    expect(result).toHaveProperty("fwiHistory");
    expect(result).toHaveProperty("tpHistory");
    expect(result).toHaveProperty("stats");
    expect(result.stats).toHaveProperty("avgFwi");
    expect(result.stats).toHaveProperty("highRiskCount");
    expect(result.stats).toHaveProperty("totalEmployees");
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.getDepartmentDetail({ departmentId: 1 })).rejects.toThrow("Solo administradores pueden ver detalles de departamento");
  });
});

describe("analytics.checkAlerts", () => {
  it("checks and returns alerts for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.legacyAnalytics.checkAlerts();

    expect(result).toHaveProperty("alertsTriggered");
    expect(result).toHaveProperty("alerts");
    expect(typeof result.alertsTriggered).toBe("number");
    expect(Array.isArray(result.alerts)).toBe(true);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createEmployeeContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.legacyAnalytics.checkAlerts()).rejects.toThrow("Solo administradores pueden verificar alertas");
  });
});
