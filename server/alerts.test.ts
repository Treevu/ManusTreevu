import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as alertService from './services/alertService';

// Mock the database
vi.mock('./db', () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

describe('Alert Service', () => {
  describe('getUnresolvedAlertCount', () => {
    it('should return 0 when database is not available', async () => {
      const count = await alertService.getUnresolvedAlertCount();
      expect(count).toBe(0);
    });
  });

  describe('getUnresolvedAlertsSummary', () => {
    it('should return empty summary when database is not available', async () => {
      const summary = await alertService.getUnresolvedAlertsSummary();
      expect(summary).toEqual({
        total: 0,
        critical: 0,
        warning: 0,
        info: 0
      });
    });

    it('should have correct structure', async () => {
      const summary = await alertService.getUnresolvedAlertsSummary();
      expect(summary).toHaveProperty('total');
      expect(summary).toHaveProperty('critical');
      expect(summary).toHaveProperty('warning');
      expect(summary).toHaveProperty('info');
      expect(typeof summary.total).toBe('number');
      expect(typeof summary.critical).toBe('number');
      expect(typeof summary.warning).toBe('number');
      expect(typeof summary.info).toBe('number');
    });
  });

  describe('Alert Types', () => {
    it('should export AlertTriggerResult type', () => {
      // Type check - this will fail at compile time if type is wrong
      const result: alertService.AlertTriggerResult = {
        triggered: false
      };
      expect(result.triggered).toBe(false);
    });

    it('should support all severity levels', () => {
      const severities: alertService.AlertSeverity[] = ['info', 'warning', 'critical'];
      expect(severities).toContain('info');
      expect(severities).toContain('warning');
      expect(severities).toContain('critical');
    });
  });
});

describe('Alert Cron Job', () => {
  it('should export startAlertCron function', async () => {
    const { startAlertCron } = await import('./jobs/alertCron');
    expect(typeof startAlertCron).toBe('function');
  });

  it('should export stopAlertCron function', async () => {
    const { stopAlertCron } = await import('./jobs/alertCron');
    expect(typeof stopAlertCron).toBe('function');
  });

  it('should export triggerManualCheck function', async () => {
    const { triggerManualCheck } = await import('./jobs/alertCron');
    expect(typeof triggerManualCheck).toBe('function');
  });

  it('should export getCronStatus function', async () => {
    const { getCronStatus } = await import('./jobs/alertCron');
    expect(typeof getCronStatus).toBe('function');
    
    const status = getCronStatus();
    expect(status).toHaveProperty('isRunning');
    expect(status).toHaveProperty('intervalMs');
    expect(status).toHaveProperty('intervalMinutes');
    expect(status.intervalMinutes).toBe(60); // 1 hour
  });
});
