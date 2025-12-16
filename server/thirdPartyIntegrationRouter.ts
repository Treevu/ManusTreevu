import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  syncWorkdayEmployees,
  getWorkdayEmployee,
  syncBambooHREmployees,
  getBambooHREmployee,
  linkPlaidAccount,
  getPlaidAccounts,
  getPlaidTransactions,
  unlinkPlaidAccount,
  createStripeCustomer,
  getStripeCustomer,
  createStripePayment,
  getStripePayments,
  syncAllIntegrations,
  getIntegrationStatus,
} from "./services/thirdPartyIntegrationService";

export const thirdPartyIntegrationRouter = router({
  // Workday integration
  workday: router({
    // Sync employees from Workday
    syncEmployees: publicProcedure.mutation(async () => {
      const result = await syncWorkdayEmployees();

      return {
        success: result.failed === 0,
        ...result,
      };
    }),

    // Get employee from Workday
    getEmployee: publicProcedure
      .input(z.object({ employeeId: z.string() }))
      .query(async ({ input }: any) => {
        const employee = await getWorkdayEmployee(input.employeeId);

        if (!employee) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found in Workday",
          });
        }

        return {
          success: true,
          employee,
        };
      }),
  }),

  // BambooHR integration
  bamboohr: router({
    // Sync employees from BambooHR
    syncEmployees: publicProcedure.mutation(async () => {
      const result = await syncBambooHREmployees();

      return {
        success: result.failed === 0,
        ...result,
      };
    }),

    // Get employee from BambooHR
    getEmployee: publicProcedure
      .input(z.object({ employeeId: z.string() }))
      .query(async ({ input }: any) => {
        const employee = await getBambooHREmployee(input.employeeId);

        if (!employee) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Employee not found in BambooHR",
          });
        }

        return {
          success: true,
          employee,
        };
      }),
  }),

  // Plaid integration
  plaid: router({
    // Link Plaid account
    linkAccount: protectedProcedure
      .input(z.object({ publicToken: z.string() }))
      .mutation(async ({ input, ctx }: any) => {
        const result = await linkPlaidAccount(ctx.user.id, input.publicToken);

        if (!result.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: result.error || "Failed to link account",
          });
        }

        return {
          success: true,
          accountId: result.accountId,
          message: "Account linked successfully",
        };
      }),

    // Get linked accounts
    getAccounts: protectedProcedure.query(async ({ ctx }: any) => {
      const accounts = await getPlaidAccounts(ctx.user.id);

      return {
        success: true,
        accounts,
        total: accounts.length,
        totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
      };
    }),

    // Get transactions
    getTransactions: protectedProcedure
      .input(
        z.object({
          accountId: z.string(),
          startDate: z.date(),
          endDate: z.date(),
        })
      )
      .query(async ({ input, ctx }: any) => {
        const transactions = await getPlaidTransactions(
          ctx.user.id,
          input.accountId,
          input.startDate,
          input.endDate
        );

        return {
          success: true,
          transactions,
          total: transactions.length,
          totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        };
      }),

    // Unlink account
    unlinkAccount: protectedProcedure
      .input(z.object({ accountId: z.string() }))
      .mutation(async ({ input, ctx }: any) => {
        const success = await unlinkPlaidAccount(ctx.user.id, input.accountId);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to unlink account",
          });
        }

        return {
          success: true,
          message: "Account unlinked successfully",
        };
      }),
  }),

  // Stripe integration
  stripe: router({
    // Create customer
    createCustomer: protectedProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string(),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        const result = await createStripeCustomer(ctx.user.id, input.email, input.name);

        if (!result.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: result.error || "Failed to create customer",
          });
        }

        return {
          success: true,
          customerId: result.customerId,
          message: "Customer created successfully",
        };
      }),

    // Get customer
    getCustomer: protectedProcedure
      .input(z.object({ customerId: z.string() }))
      .query(async ({ input }: any) => {
        const customer = await getStripeCustomer(input.customerId);

        if (!customer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Customer not found",
          });
        }

        return {
          success: true,
          customer,
        };
      }),

    // Create payment
    createPayment: protectedProcedure
      .input(
        z.object({
          customerId: z.string(),
          amount: z.number(),
          currency: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }: any) => {
        const result = await createStripePayment(
          input.customerId,
          input.amount,
          input.currency,
          input.description
        );

        if (!result.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: result.error || "Failed to create payment",
          });
        }

        return {
          success: true,
          paymentId: result.paymentId,
          message: "Payment created successfully",
        };
      }),

    // Get payments
    getPayments: protectedProcedure
      .input(z.object({ customerId: z.string() }))
      .query(async ({ input }: any) => {
        const payments = await getStripePayments(input.customerId);

        return {
          success: true,
          payments,
          total: payments.length,
          totalAmount: payments
            .filter((p) => p.status === "succeeded")
            .reduce((sum, p) => sum + p.amount, 0),
        };
      }),
  }),

  // General integration management
  management: router({
    // Sync all integrations
    syncAll: publicProcedure.mutation(async () => {
      const result = await syncAllIntegrations();

      return {
        success: result.workday.failed === 0 && result.bamboohr.failed === 0,
        ...result,
      };
    }),

    // Get integration status
    getStatus: publicProcedure.query(async () => {
      const status = getIntegrationStatus();

      return {
        success: true,
        ...status,
      };
    }),

    // Test integration connection
    testConnection: publicProcedure
      .input(z.object({ integrationName: z.enum(["workday", "bamboohr", "plaid", "stripe"]) }))
      .query(async ({ input }: any) => {
        // Mock test - in production, actually test API connection
        const testResults: Record<string, boolean> = {
          workday: true,
          bamboohr: true,
          plaid: true,
          stripe: true,
        };

        return {
          success: true,
          integration: input.integrationName,
          connected: testResults[input.integrationName],
          message: testResults[input.integrationName]
            ? "Connection successful"
            : "Connection failed",
        };
      }),

    // Get integration logs
    getLogs: publicProcedure
      .input(
        z.object({
          integrationName: z.enum(["workday", "bamboohr", "plaid", "stripe"]).optional(),
          limit: z.number().default(50),
        })
      )
      .query(async ({ input }: any) => {
        // Mock logs - in production, query actual logs
        return {
          success: true,
          logs: [
            {
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              integration: input.integrationName || "all",
              action: "sync",
              status: "success",
              details: "Synced 150 employees",
            },
            {
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
              integration: input.integrationName || "all",
              action: "link_account",
              status: "success",
              details: "Linked Plaid account",
            },
            {
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              integration: input.integrationName || "all",
              action: "payment",
              status: "success",
              details: "Processed payment $99.00",
            },
          ],
          total: 3,
        };
      }),
  }),
});
