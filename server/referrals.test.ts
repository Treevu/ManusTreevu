import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createEmployeeContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `employee-${userId}`,
    email: `employee${userId}@company.com`,
    name: `Employee ${userId}`,
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

describe("referrals.getMyCode", () => {
  it("returns a referral code for authenticated users", async () => {
    const { ctx } = createEmployeeContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referrals.getMyCode();

    expect(result).toHaveProperty("code");
    expect(typeof result.code).toBe("string");
    expect(result.code.length).toBeGreaterThan(0);
  });
});

describe("referrals.getMyStats", () => {
  it("returns referral statistics for authenticated users", async () => {
    const { ctx } = createEmployeeContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referrals.getMyStats();

    // API returns totalInvited, totalRegistered, totalRewarded, totalPointsEarned
    expect(result).toHaveProperty("totalInvited");
    expect(result).toHaveProperty("totalRegistered");
    expect(result).toHaveProperty("totalRewarded");
    expect(result).toHaveProperty("totalPointsEarned");
    expect(typeof result.totalInvited).toBe("number");
    expect(typeof result.totalRegistered).toBe("number");
    expect(typeof result.totalRewarded).toBe("number");
    expect(typeof result.totalPointsEarned).toBe("number");
  });
});

describe("referrals.validateCode", () => {
  it("validates a referral code format", async () => {
    const { ctx } = createEmployeeContext(1);
    const caller = appRouter.createCaller(ctx);

    // Test with a valid format code (even if not in DB)
    const result = await caller.referrals.validateCode({ code: "TESTCODE123" });

    expect(result).toHaveProperty("valid");
    expect(result).toHaveProperty("referrerName");
    expect(typeof result.valid).toBe("boolean");
  });

  it("returns invalid for empty code", async () => {
    const { ctx } = createEmployeeContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referrals.validateCode({ code: "" });

    expect(result.valid).toBe(false);
  });
});

describe("referrals.processRegistration", () => {
  it("returns success false for invalid referral code", async () => {
    const { ctx } = createEmployeeContext(999);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.referrals.processRegistration({ code: "INVALID_CODE_123" });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(false);
  });
});
