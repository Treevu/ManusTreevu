import { describe, it, expect } from 'vitest';
import { 
  isValidSlackWebhook, 
  formatAlertForSlack 
} from './slackService';

describe('Slack Service', () => {
  describe('isValidSlackWebhook', () => {
    it('should return true for valid Slack webhook URLs', () => {
      expect(isValidSlackWebhook('https://dummy.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidSlackWebhook('')).toBe(false);
      expect(isValidSlackWebhook('https://example.com/webhook')).toBe(false);
      expect(isValidSlackWebhook('https://dummy.com/other/path')).toBe(false);
      expect(isValidSlackWebhook('not-a-url')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidSlackWebhook(null as any)).toBe(false);
      expect(isValidSlackWebhook(undefined as any)).toBe(false);
    });
  });

  describe('formatAlertForSlack', () => {
    it('should format critical alert correctly', () => {
      const message = formatAlertForSlack(
        'fwi_department_low',
        'El departamento Ventas tiene un FWI bajo',
        'critical',
        35,
        50,
        { departmentName: 'Ventas' }
      );

      expect(message.text).toContain('Alerta Treevü');
      expect(message.attachments).toBeDefined();
      expect(message.attachments![0].color).toBe('#DC2626'); // Red for critical
    });

    it('should format warning alert correctly', () => {
      const message = formatAlertForSlack(
        'high_risk_percentage',
        '25% de empleados en alto riesgo',
        'warning',
        25,
        20
      );

      expect(message.attachments![0].color).toBe('#F59E0B'); // Amber for warning
    });

    it('should format info alert correctly', () => {
      const message = formatAlertForSlack(
        'ewa_pending_count',
        'Hay 5 solicitudes EWA pendientes',
        'info',
        5,
        10
      );

      expect(message.attachments![0].color).toBe('#3B82F6'); // Blue for info
    });

    it('should include dashboard URL when provided', () => {
      const message = formatAlertForSlack(
        'fwi_department_low',
        'Test alert',
        'warning',
        40,
        50,
        { dashboardUrl: 'https://app.treevu.com/dashboard/alerts' }
      );

      // Check that blocks contain action button
      const blocks = message.attachments![0].blocks;
      const actionBlock = blocks?.find(b => b.type === 'actions');
      expect(actionBlock).toBeDefined();
    });
  });
});
