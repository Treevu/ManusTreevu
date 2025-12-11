import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(role: "admin" | "employee" | "merchant" | "b2b_admin" = "employee"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Auth Router", () => {
  it("returns null for unauthenticated user on auth.me", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    
    expect(result).toBeNull();
  });

  it("returns user data for authenticated user on auth.me", async () => {
    const ctx = createMockContext("employee");
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.me();
    
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@example.com");
    expect(result?.role).toBe("employee");
  });

  it("clears cookie on logout", async () => {
    const ctx = createMockContext("employee");
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.auth.logout();
    
    expect(result).toEqual({ success: true });
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

describe("Role-Based Access Control", () => {
  it("allows admin to access b2b.getMetrics", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);
    
    // This should not throw
    await expect(caller.b2b.getMetrics()).resolves.toBeDefined();
  });

  it("allows b2b_admin to access b2b.getMetrics", async () => {
    const ctx = createMockContext("b2b_admin");
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.b2b.getMetrics()).resolves.toBeDefined();
  });

  it("denies employee access to b2b.getMetrics", async () => {
    const ctx = createMockContext("employee");
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.b2b.getMetrics()).rejects.toThrow("B2B Admin access required");
  });

  it("denies merchant access to b2b.getMetrics", async () => {
    const ctx = createMockContext("merchant");
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.b2b.getMetrics()).rejects.toThrow("B2B Admin access required");
  });

  it("allows merchant to access merchant.getStats", async () => {
    const ctx = createMockContext("merchant");
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.merchant.getStats()).resolves.toBeDefined();
  });

  it("denies employee access to merchant.getStats", async () => {
    const ctx = createMockContext("employee");
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.merchant.getStats()).rejects.toThrow("Merchant access required");
  });
});

describe("Protected Procedures", () => {
  it("denies unauthenticated access to users.getProfile", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.users.getProfile()).rejects.toThrow();
  });

  it("denies unauthenticated access to transactions.list", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.transactions.list()).rejects.toThrow();
  });

  it("denies unauthenticated access to fwi.getScore", async () => {
    const ctx = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);
    
    await expect(caller.fwi.getScore()).rejects.toThrow();
  });
});

describe("Contact Router", () => {
  it("validates required fields for demo request", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submitDemoRequest({
        firstName: "",
        lastName: "Test",
        email: "test@example.com",
        company: "Test Corp",
        employeeCount: "1-50",
      })
    ).rejects.toThrow();
  });

  it("validates email format for demo request", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submitDemoRequest({
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        company: "Test Corp",
        employeeCount: "1-50",
      })
    ).rejects.toThrow();
  });
});

describe("Input Validation", () => {
  it("validates EWA request minimum amount", async () => {
    const ctx = createMockContext("employee");
    const caller = appRouter.createCaller(ctx);
    
    // Amount below minimum (1000 cents = $10)
    await expect(
      caller.ewa.request({ amount: 500 })
    ).rejects.toThrow();
  });

  it("validates user role update input", async () => {
    const ctx = createMockContext("admin");
    const caller = appRouter.createCaller(ctx);
    
    // Invalid role should fail validation
    await expect(
      caller.users.updateRole({ userId: 1, role: "invalid_role" as any })
    ).rejects.toThrow();
  });

  it("validates financial goal category", async () => {
    const ctx = createMockContext("employee");
    const caller = appRouter.createCaller(ctx);
    
    // Invalid category should fail validation
    await expect(
      caller.goals.create({
        name: "Test Goal",
        targetAmount: 10000,
        category: "invalid_category" as any,
      })
    ).rejects.toThrow();
  });
});


// ============================================
// NOTIFICATIONS ROUTER TESTS
// ============================================

describe("Notifications Router", () => {
  describe("notifications.list", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.list({ limit: 10 })).rejects.toThrow();
    });

    it("returns notifications for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.list({ limit: 10 });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("notifications.unreadCount", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.unreadCount()).rejects.toThrow();
    });

    it("returns a number for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.unreadCount();
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("notifications.markAsRead", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.markAsRead({ notificationId: 1 })).rejects.toThrow();
    });
  });

  describe("notifications.markAllAsRead", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.markAllAsRead()).rejects.toThrow();
    });

    it("returns success for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.markAllAsRead();
      expect(result).toEqual({ success: true });
    });
  });

  describe("notifications.delete", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.delete({ notificationId: 1 })).rejects.toThrow();
    });
  });

  describe("notifications.deleteAll", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.deleteAll()).rejects.toThrow();
    });

    it("returns success for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.deleteAll();
      expect(result).toEqual({ success: true });
    });
  });

  describe("notifications.getPreferences", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.getPreferences()).rejects.toThrow();
    });

    it("returns preferences object for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.getPreferences();
      expect(result).toBeDefined();
      expect(typeof result.inAppEnabled).toBe("boolean");
    });
  });

  describe("notifications.updatePreferences", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.updatePreferences({ inAppEnabled: false })).rejects.toThrow();
    });

    it("updates preferences for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.updatePreferences({ 
        inAppEnabled: true,
        ewaApproved: true,
        treepointsReceived: false
      });
      expect(result).toEqual({ success: true });
    });
  });
});


// ============================================
// PUSH NOTIFICATIONS TESTS
// ============================================

describe("Push Notifications", () => {
  describe("notifications.getVapidKey", () => {
    it("returns VAPID public key for any user", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.getVapidKey();
      expect(result).toHaveProperty('publicKey');
      expect(typeof result.publicKey).toBe('string');
      expect(result.publicKey.length).toBeGreaterThan(0);
    });
  });

  describe("notifications.subscribePush", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.subscribePush({
        endpoint: 'https://push.example.com/test',
        keys: { p256dh: 'test', auth: 'test' },
      })).rejects.toThrow();
    });

    it("validates endpoint URL format", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.subscribePush({
        endpoint: 'not-a-valid-url',
        keys: { p256dh: 'test', auth: 'test' },
      })).rejects.toThrow();
    });
  });

  describe("notifications.unsubscribePush", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.unsubscribePush({
        endpoint: 'https://push.example.com/test',
      })).rejects.toThrow();
    });
  });

  describe("notifications.getPushStatus", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.getPushStatus()).rejects.toThrow();
    });

    it("returns subscription status for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.getPushStatus();
      expect(result).toHaveProperty('subscribed');
      expect(result).toHaveProperty('deviceCount');
      expect(typeof result.subscribed).toBe('boolean');
      expect(typeof result.deviceCount).toBe('number');
    });
  });

  describe("notifications.testPush", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.testPush()).rejects.toThrow();
    });
  });
});

// ============================================
// EMAIL NOTIFICATIONS TESTS
// ============================================

describe("Email Notifications", () => {
  describe("notifications.testEmail", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthenticatedContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.testEmail()).rejects.toThrow();
    });

    it("returns result for authenticated user", async () => {
      const ctx = createMockContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.testEmail();
      // Will fail without email configured, but should return a result object
      expect(result).toHaveProperty('success');
    });
  });

  describe("notifications.processEmailQueue", () => {
    it("requires admin role", async () => {
      const ctx = createMockContext(); // Regular user
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.notifications.processEmailQueue()).rejects.toThrow();
    });

    it("allows admin to process queue", async () => {
      const ctx = createMockContext('admin');
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.notifications.processEmailQueue();
      expect(result).toHaveProperty('sent');
      expect(result).toHaveProperty('failed');
    });
  });
});
