import { describe, it, expect } from 'vitest';
import { 
  generateSecret, 
  verifyToken, 
  generateBackupCodes, 
  hashBackupCode 
} from './mfaService';

describe('MFA Service', () => {
  describe('generateSecret', () => {
    it('should generate a valid TOTP secret', () => {
      const secret = generateSecret();
      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThanOrEqual(16);
    });

    it('should generate unique secrets each time', () => {
      const secret1 = generateSecret();
      const secret2 = generateSecret();
      expect(secret1).not.toBe(secret2);
    });
  });

  describe('verifyToken', () => {
    it('should return false for invalid token format', () => {
      const secret = generateSecret();
      expect(verifyToken(secret, 'invalid')).toBe(false);
      expect(verifyToken(secret, '12345')).toBe(false);
      expect(verifyToken(secret, 'abcdef')).toBe(false);
    });

    it('should return false for wrong token', () => {
      const secret = generateSecret();
      expect(verifyToken(secret, '000000')).toBe(false);
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate the specified number of backup codes', () => {
      const codes = generateBackupCodes(8);
      expect(codes).toHaveLength(8);
    });

    it('should generate 8 character alphanumeric codes', () => {
      const codes = generateBackupCodes();
      codes.forEach(code => {
        expect(code).toMatch(/^[A-F0-9]{8}$/);
      });
    });

    it('should generate unique codes', () => {
      const codes = generateBackupCodes(10);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(10);
    });
  });

  describe('hashBackupCode', () => {
    it('should hash backup codes consistently', () => {
      const code = 'ABCD1234';
      const hash1 = hashBackupCode(code);
      const hash2 = hashBackupCode(code);
      expect(hash1).toBe(hash2);
    });

    it('should be case insensitive', () => {
      const hash1 = hashBackupCode('abcd1234');
      const hash2 = hashBackupCode('ABCD1234');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different codes', () => {
      const hash1 = hashBackupCode('ABCD1234');
      const hash2 = hashBackupCode('EFGH5678');
      expect(hash1).not.toBe(hash2);
    });
  });
});
