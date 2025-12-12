import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { getDb } from '../db';
import { mfaSettings, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const APP_NAME = 'Treevü';

// Generate a new TOTP secret for a user
export function generateSecret(): string {
  return authenticator.generateSecret();
}

// Generate QR code data URL for authenticator app
export async function generateQRCode(email: string, secret: string): Promise<string> {
  const otpauth = authenticator.keyuri(email, APP_NAME, secret);
  return await QRCode.toDataURL(otpauth);
}

// Verify a TOTP token
export function verifyToken(secret: string, token: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

// Generate backup codes
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  return codes;
}

// Hash a backup code for storage
export function hashBackupCode(code: string): string {
  return crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
}

// Setup MFA for a user
export async function setupMFA(userId: number): Promise<{
  secret: string;
  qrCode: string;
  backupCodes: string[];
} | null> {
  const db = await getDb();
  if (!db) return null;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user.length || !user[0].email) return null;

  const existing = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  
  const secret = generateSecret();
  const qrCode = await generateQRCode(user[0].email, secret);
  const backupCodes = generateBackupCodes();
  const hashedBackupCodes = backupCodes.map(hashBackupCode);

  if (existing.length) {
    await db.update(mfaSettings).set({
      secret,
      enabled: false,
      verifiedAt: null,
      backupCodes: JSON.stringify(hashedBackupCodes),
      backupCodesUsed: 0,
      updatedAt: new Date(),
    }).where(eq(mfaSettings.userId, userId));
  } else {
    await db.insert(mfaSettings).values({
      userId,
      secret,
      enabled: false,
      backupCodes: JSON.stringify(hashedBackupCodes),
    });
  }

  return { secret, qrCode, backupCodes };
}

// Verify and enable MFA
export async function verifyAndEnableMFA(userId: number, token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const mfa = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  if (!mfa.length) return false;

  const isValid = verifyToken(mfa[0].secret, token);
  if (!isValid) return false;

  await db.update(mfaSettings).set({
    enabled: true,
    verifiedAt: new Date(),
    lastUsedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(mfaSettings.userId, userId));

  return true;
}

// Verify MFA token during login
export async function verifyMFAToken(userId: number, token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const mfa = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  if (!mfa.length || !mfa[0].enabled) return false;

  if (verifyToken(mfa[0].secret, token)) {
    await db.update(mfaSettings).set({ lastUsedAt: new Date() }).where(eq(mfaSettings.userId, userId));
    return true;
  }

  const hashedToken = hashBackupCode(token);
  const backupCodes: string[] = mfa[0].backupCodes ? JSON.parse(mfa[0].backupCodes) : [];
  const codeIndex = backupCodes.indexOf(hashedToken);
  
  if (codeIndex !== -1) {
    backupCodes.splice(codeIndex, 1);
    await db.update(mfaSettings).set({
      backupCodes: JSON.stringify(backupCodes),
      backupCodesUsed: (mfa[0].backupCodesUsed || 0) + 1,
      lastUsedAt: new Date(),
    }).where(eq(mfaSettings.userId, userId));
    return true;
  }

  return false;
}

// Disable MFA
export async function disableMFA(userId: number, token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const mfa = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  if (!mfa.length || !mfa[0].enabled) return false;

  if (!verifyToken(mfa[0].secret, token)) return false;

  await db.update(mfaSettings).set({
    enabled: false,
    updatedAt: new Date(),
  }).where(eq(mfaSettings.userId, userId));

  return true;
}

// Check if user has MFA enabled
export async function isMFAEnabled(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const mfa = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  return mfa.length > 0 && mfa[0].enabled;
}

// Get MFA status
export async function getMFAStatus(userId: number): Promise<{
  enabled: boolean;
  verifiedAt: Date | null;
  backupCodesRemaining: number;
} | null> {
  const db = await getDb();
  if (!db) return null;

  const mfa = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  if (!mfa.length) {
    return { enabled: false, verifiedAt: null, backupCodesRemaining: 0 };
  }

  const backupCodes: string[] = mfa[0].backupCodes ? JSON.parse(mfa[0].backupCodes) : [];
  
  return {
    enabled: mfa[0].enabled,
    verifiedAt: mfa[0].verifiedAt,
    backupCodesRemaining: backupCodes.length,
  };
}

// Regenerate backup codes
export async function regenerateBackupCodes(userId: number, token: string): Promise<string[] | null> {
  const db = await getDb();
  if (!db) return null;

  const mfa = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
  if (!mfa.length || !mfa[0].enabled) return null;

  if (!verifyToken(mfa[0].secret, token)) return null;

  const newBackupCodes = generateBackupCodes();
  const hashedBackupCodes = newBackupCodes.map(hashBackupCode);

  await db.update(mfaSettings).set({
    backupCodes: JSON.stringify(hashedBackupCodes),
    backupCodesUsed: 0,
    updatedAt: new Date(),
  }).where(eq(mfaSettings.userId, userId));

  return newBackupCodes;
}
