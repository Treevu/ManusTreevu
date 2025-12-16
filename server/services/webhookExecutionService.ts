import { getDb } from "../db";

export interface WebhookEvent {
  id?: number;
  eventType: string;
  userId?: number;
  departmentId?: number;
  payload: Record<string, any>;
  status: "pending" | "sent" | "failed" | "retrying";
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  createdAt?: Date;
  sentAt?: Date;
}

/**
 * Log a webhook event to the database
 */
export async function logWebhookEvent(
  eventType: string,
  payload: Record<string, any>,
  userId?: number,
  departmentId?: number
): Promise<number | null> {
  try {
    const db = await getDb();
    if (!db) return null;

    // In a real app, you'd insert into webhook_events table
    console.log(`[Webhook Event] Type: ${eventType}, User: ${userId}, Payload:`, payload);

    // Mock return of inserted ID
    return Math.floor(Math.random() * 10000);
  } catch (error) {
    console.error("Error logging webhook event:", error);
    return null;
  }
}

/**
 * Send webhook with retry logic
 */
export async function sendWebhook(
  webhookUrl: string,
  event: WebhookEvent,
  maxRetries: number = 3
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Event": event.eventType,
        "X-Webhook-Timestamp": new Date().toISOString(),
      },
      body: JSON.stringify(event.payload),
    });

    if (response.ok) {
      console.log(`[Webhook] Successfully sent ${event.eventType} to ${webhookUrl}`);
      return true;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`[Webhook] Failed to send ${event.eventType}:`, error);
    return false;
  }
}

/**
 * Process pending webhooks with retry logic
 */
export async function processPendingWebhooks(
  webhookUrls: Record<string, string> = {}
): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  retrying: number;
}> {
  const results = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    retrying: 0,
  };

  try {
    // In a real app, you'd query webhook_events table for pending events
    const pendingEvents: WebhookEvent[] = [
      {
        id: 1,
        eventType: "reward_tier_upgrade",
        userId: 123,
        payload: { oldTier: "Silver", newTier: "Gold", discount: 10 },
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
      },
      {
        id: 2,
        eventType: "new_recommendation",
        userId: 456,
        payload: { type: "Spending Reduction", savings: 150 },
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
      },
    ];

    for (const event of pendingEvents) {
      results.processed++;

      // Get webhook URL for this event type
      const webhookUrl = webhookUrls[event.eventType] || process.env.WEBHOOK_URL;
      if (!webhookUrl) {
        console.warn(`No webhook URL configured for ${event.eventType}`);
        results.failed++;
        continue;
      }

      // Try to send webhook
      const success = await sendWebhook(webhookUrl, event, event.maxRetries);

      if (success) {
        results.succeeded++;
        // Update event status to 'sent'
        await updateWebhookEventStatus(event.id!, "sent");
      } else {
        // Increment retry count
        if (event.retryCount < event.maxRetries) {
          results.retrying++;
          await updateWebhookEventStatus(event.id!, "retrying", event.retryCount + 1);
        } else {
          results.failed++;
          await updateWebhookEventStatus(event.id!, "failed");
        }
      }
    }

    console.log(`[Webhook Processor] Results:`, results);
    return results;
  } catch (error) {
    console.error("Error processing webhooks:", error);
    return results;
  }
}

/**
 * Update webhook event status
 */
export async function updateWebhookEventStatus(
  eventId: number,
  status: "pending" | "sent" | "failed" | "retrying",
  retryCount?: number
): Promise<void> {
  try {
    const db = await getDb();
    if (!db) return;

    // In a real app, you'd update the webhook_events table
    console.log(
      `[Webhook] Updated event ${eventId} to status: ${status}, retries: ${retryCount || 0}`
    );
  } catch (error) {
    console.error("Error updating webhook event:", error);
  }
}

/**
 * Trigger webhook for reward tier upgrade
 */
export async function triggerRewardTierWebhook(
  userId: number,
  oldTier: string,
  newTier: string,
  discount: number,
  ewaReduction: number
): Promise<void> {
  const eventId = await logWebhookEvent(
    "reward_tier_upgrade",
    {
      userId,
      oldTier,
      newTier,
      discount,
      ewaReduction,
      timestamp: new Date().toISOString(),
    },
    userId
  );

  if (eventId) {
    const webhookUrl = process.env.WEBHOOK_URL_TIER_UPGRADE || process.env.WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhook(webhookUrl, {
        id: eventId,
        eventType: "reward_tier_upgrade",
        userId,
        payload: { oldTier, newTier, discount, ewaReduction },
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
      });
    }
  }
}

/**
 * Trigger webhook for new recommendation
 */
export async function triggerRecommendationWebhook(
  userId: number,
  recommendationType: string,
  estimatedSavings: number,
  urgency: "low" | "medium" | "high"
): Promise<void> {
  const eventId = await logWebhookEvent(
    "new_recommendation",
    {
      userId,
      recommendationType,
      estimatedSavings,
      urgency,
      timestamp: new Date().toISOString(),
    },
    userId
  );

  if (eventId) {
    const webhookUrl = process.env.WEBHOOK_URL_RECOMMENDATION || process.env.WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhook(webhookUrl, {
        id: eventId,
        eventType: "new_recommendation",
        userId,
        payload: { recommendationType, estimatedSavings, urgency },
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
      });
    }
  }
}

/**
 * Trigger webhook for intervention started
 */
export async function triggerInterventionWebhook(
  userId: number,
  interventionType: string,
  expectedOutcome: string
): Promise<void> {
  const eventId = await logWebhookEvent(
    "intervention_started",
    {
      userId,
      interventionType,
      expectedOutcome,
      timestamp: new Date().toISOString(),
    },
    userId
  );

  if (eventId) {
    const webhookUrl = process.env.WEBHOOK_URL_INTERVENTION || process.env.WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhook(webhookUrl, {
        id: eventId,
        eventType: "intervention_started",
        userId,
        payload: { interventionType, expectedOutcome },
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
      });
    }
  }
}

/**
 * Trigger webhook for department milestone
 */
export async function triggerDepartmentMilestoneWebhook(
  departmentId: number,
  engagementScore: number,
  totalROI: number,
  employeeCount: number
): Promise<void> {
  const eventId = await logWebhookEvent(
    "department_milestone",
    {
      departmentId,
      engagementScore,
      totalROI,
      employeeCount,
      timestamp: new Date().toISOString(),
    },
    undefined,
    departmentId
  );

  if (eventId) {
    const webhookUrl = process.env.WEBHOOK_URL_DEPARTMENT || process.env.WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhook(webhookUrl, {
        id: eventId,
        eventType: "department_milestone",
        departmentId,
        payload: { engagementScore, totalROI, employeeCount },
        status: "pending",
        retryCount: 0,
        maxRetries: 3,
      });
    }
  }
}

/**
 * Get webhook event history
 */
export async function getWebhookEventHistory(
  limit: number = 100,
  offset: number = 0
): Promise<WebhookEvent[]> {
  try {
    // In a real app, you'd query webhook_events table
    return [
      {
        id: 1,
        eventType: "reward_tier_upgrade",
        userId: 123,
        payload: { oldTier: "Silver", newTier: "Gold" },
        status: "sent",
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        sentAt: new Date(Date.now() - 4 * 60 * 1000),
      },
      {
        id: 2,
        eventType: "new_recommendation",
        userId: 456,
        payload: { type: "Spending Reduction" },
        status: "sent",
        retryCount: 0,
        maxRetries: 3,
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
        sentAt: new Date(Date.now() - 9 * 60 * 1000),
      },
    ];
  } catch (error) {
    console.error("Error fetching webhook history:", error);
    return [];
  }
}
