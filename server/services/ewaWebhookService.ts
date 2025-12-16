import { getDb } from '../db';
import { ewaRequests } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function handleEwaDisburseWebhook(payload: {
  requestId: number;
  status: 'success' | 'failed' | 'pending';
  error?: string;
  timestamp?: string;
}) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const ewaRequest = await db.query.ewaRequests.findFirst({
      where: eq(ewaRequests, { id: payload.requestId }),
    });

    if (!ewaRequest) {
      throw new Error(`EWA request ${payload.requestId} not found`);
    }

    if (payload.status === 'success') {
      await db
        .update(ewaRequests)
        .set({
          status: 'disbursed',
          disbursedAt: new Date(payload.timestamp || Date.now()),
          updatedAt: new Date(),
        })
        .where(eq(ewaRequests, { id: payload.requestId }));
      console.log(`✅ EWA ${payload.requestId} marked as disbursed`);
    } else if (payload.status === 'failed') {
      await db
        .update(ewaRequests)
        .set({
          status: 'rejected',
          rejectionReason: `Fallo en transferencia: ${payload.error || 'Error desconocido'}`,
          updatedAt: new Date(),
        })
        .where(eq(ewaRequests, { id: payload.requestId }));
      console.log(`❌ EWA ${payload.requestId} marked as failed`);
    } else if (payload.status === 'pending') {
      await db
        .update(ewaRequests)
        .set({
          status: 'processing_transfer',
          updatedAt: new Date(),
        })
        .where(eq(ewaRequests, { id: payload.requestId }));
      console.log(`⏳ EWA ${payload.requestId} still processing`);
    }

    return { success: true, requestId: payload.requestId, newStatus: payload.status };
  } catch (error) {
    console.error('Error handling EWA webhook:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error', requestId: payload.requestId };
  }
}

export function validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const crypto = require('crypto');
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return hash === signature;
}

export async function getEwaDisburseStatus(requestId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const ewaRequest = await db.query.ewaRequests.findFirst({
      where: eq(ewaRequests, { id: requestId }),
    });

    if (!ewaRequest) return { found: false, error: 'EWA request not found' };

    return {
      found: true,
      id: ewaRequest.id,
      status: ewaRequest.status,
      amount: ewaRequest.amount,
      fee: ewaRequest.fee,
      createdAt: ewaRequest.createdAt,
      approvedAt: ewaRequest.approvedAt,
      disbursedAt: ewaRequest.disbursedAt,
    };
  } catch (error) {
    console.error('Error getting EWA status:', error);
    return { found: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function retryEwaDisburse(requestId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error('Database connection failed');

    const ewaRequest = await db.query.ewaRequests.findFirst({
      where: eq(ewaRequests, { id: requestId }),
    });

    if (!ewaRequest) throw new Error(`EWA request ${requestId} not found`);
    if (ewaRequest.status !== 'rejected') throw new Error(`Cannot retry EWA with status: ${ewaRequest.status}`);

    await db
      .update(ewaRequests)
      .set({
        status: 'processing_transfer',
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(ewaRequests, { id: requestId }));

    console.log(`🔄 EWA ${requestId} retry initiated`);
    return { success: true, message: 'EWA disburse retry initiated', requestId };
  } catch (error) {
    console.error('Error retrying EWA:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error', requestId };
  }
}
