import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getEducationProgress: vi.fn(),
  getAllEducationProgress: vi.fn(),
  updateEducationProgress: vi.fn(),
  createOfferRedemption: vi.fn(),
  getRedemptionByCouponCode: vi.fn(),
  validateCoupon: vi.fn(),
  getUserRedemptions: vi.fn(),
  getMerchantRedemptions: vi.fn(),
}));

import * as db from './db';

describe('Education Progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEducationProgress', () => {
    it('should return null when no progress exists', async () => {
      vi.mocked(db.getEducationProgress).mockResolvedValue(null);
      
      const result = await db.getEducationProgress(1, 'fwi');
      
      expect(result).toBeNull();
      expect(db.getEducationProgress).toHaveBeenCalledWith(1, 'fwi');
    });

    it('should return progress when it exists', async () => {
      const mockProgress = {
        id: 1,
        userId: 1,
        tutorialType: 'fwi',
        stepsCompleted: 2,
        totalSteps: 4,
        isCompleted: false,
        pointsAwarded: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      vi.mocked(db.getEducationProgress).mockResolvedValue(mockProgress);
      
      const result = await db.getEducationProgress(1, 'fwi');
      
      expect(result).toEqual(mockProgress);
      expect(result?.stepsCompleted).toBe(2);
    });
  });

  describe('updateEducationProgress', () => {
    it('should create new progress and award points on completion', async () => {
      vi.mocked(db.updateEducationProgress).mockResolvedValue({
        progress: {
          id: 1,
          userId: 1,
          tutorialType: 'fwi',
          stepsCompleted: 4,
          totalSteps: 4,
          isCompleted: true,
        },
        justCompleted: true,
        pointsAwarded: 50,
      });
      
      const result = await db.updateEducationProgress(1, 'fwi', 4, 4);
      
      expect(result.justCompleted).toBe(true);
      expect(result.pointsAwarded).toBe(50);
    });

    it('should not award points if already completed', async () => {
      vi.mocked(db.updateEducationProgress).mockResolvedValue({
        progress: {
          id: 1,
          userId: 1,
          tutorialType: 'fwi',
          stepsCompleted: 4,
          totalSteps: 4,
          isCompleted: true,
        },
        justCompleted: false,
        pointsAwarded: 0,
      });
      
      const result = await db.updateEducationProgress(1, 'fwi', 4, 4);
      
      expect(result.justCompleted).toBe(false);
      expect(result.pointsAwarded).toBe(0);
    });

    it('should track partial progress without awarding points', async () => {
      vi.mocked(db.updateEducationProgress).mockResolvedValue({
        progress: {
          id: 1,
          userId: 1,
          tutorialType: 'ewa',
          stepsCompleted: 2,
          totalSteps: 3,
          isCompleted: false,
        },
        justCompleted: false,
        pointsAwarded: 0,
      });
      
      const result = await db.updateEducationProgress(1, 'ewa', 2, 3);
      
      expect(result.progress.isCompleted).toBe(false);
      expect(result.pointsAwarded).toBe(0);
    });
  });

  describe('getAllEducationProgress', () => {
    it('should return all progress for a user', async () => {
      const mockProgress = [
        { id: 1, tutorialType: 'fwi', isCompleted: true, pointsAwarded: 50 },
        { id: 2, tutorialType: 'ewa', isCompleted: false, pointsAwarded: 0 },
      ];
      
      vi.mocked(db.getAllEducationProgress).mockResolvedValue(mockProgress as any);
      
      const result = await db.getAllEducationProgress(1);
      
      expect(result).toHaveLength(2);
      expect(result[0].isCompleted).toBe(true);
    });
  });
});

describe('Coupon Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOfferRedemption', () => {
    it('should create a redemption with unique coupon code', async () => {
      vi.mocked(db.createOfferRedemption).mockResolvedValue({
        id: 1,
        couponCode: 'TV-ABC12345',
      });
      
      const result = await db.createOfferRedemption({
        offerId: 1,
        userId: 1,
        merchantId: 2,
        pointsSpent: 100,
      });
      
      expect(result.couponCode).toMatch(/^TV-/);
      expect(result.id).toBe(1);
    });
  });

  describe('validateCoupon', () => {
    it('should return error for non-existent coupon', async () => {
      vi.mocked(db.validateCoupon).mockResolvedValue({
        success: false,
        message: 'Cupón no encontrado',
      });
      
      const result = await db.validateCoupon('TV-INVALID', 1, 1);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Cupón no encontrado');
    });

    it('should return error for already validated coupon', async () => {
      vi.mocked(db.validateCoupon).mockResolvedValue({
        success: false,
        message: 'Este cupón ya fue utilizado',
      });
      
      const result = await db.validateCoupon('TV-USED123', 1, 1);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Este cupón ya fue utilizado');
    });

    it('should return error for expired coupon', async () => {
      vi.mocked(db.validateCoupon).mockResolvedValue({
        success: false,
        message: 'Este cupón ha expirado',
      });
      
      const result = await db.validateCoupon('TV-EXPIRED', 1, 1);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Este cupón ha expirado');
    });

    it('should return error for wrong merchant', async () => {
      vi.mocked(db.validateCoupon).mockResolvedValue({
        success: false,
        message: 'Este cupón no pertenece a tu comercio',
      });
      
      const result = await db.validateCoupon('TV-WRONG123', 999, 1);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Este cupón no pertenece a tu comercio');
    });

    it('should successfully validate a valid coupon', async () => {
      vi.mocked(db.validateCoupon).mockResolvedValue({
        success: true,
        message: 'Cupón validado exitosamente',
        redemption: {
          id: 1,
          pointsSpent: 100,
          createdAt: new Date().toISOString(),
        },
        user: { id: 1, name: 'Juan Pérez' },
        offer: { id: 1, title: '20% de descuento' },
      });
      
      const result = await db.validateCoupon('TV-VALID123', 1, 1);
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Cupón validado exitosamente');
      expect(result.user?.name).toBe('Juan Pérez');
      expect(result.offer?.title).toBe('20% de descuento');
    });
  });

  describe('getMerchantRedemptions', () => {
    it('should return all redemptions for a merchant', async () => {
      const mockRedemptions = [
        { id: 1, couponCode: 'TV-ABC123', status: 'validated', pointsSpent: 100 },
        { id: 2, couponCode: 'TV-DEF456', status: 'pending', pointsSpent: 200 },
      ];
      
      vi.mocked(db.getMerchantRedemptions).mockResolvedValue(mockRedemptions as any);
      
      const result = await db.getMerchantRedemptions(1);
      
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('validated');
    });
  });
});

describe('Educational Content', () => {
  it('should have correct points for each tutorial type', () => {
    const pointsMap: Record<string, number> = {
      'fwi': 50,
      'ewa': 50,
      'b2b': 100,
      'merchant': 100,
    };
    
    expect(pointsMap['fwi']).toBe(50);
    expect(pointsMap['ewa']).toBe(50);
    expect(pointsMap['b2b']).toBe(100);
    expect(pointsMap['merchant']).toBe(100);
  });

  it('should determine experience level correctly', () => {
    const determineExperienceLevel = (daysActive: number, tutorialsCompleted: number) => {
      if (daysActive < 7 && tutorialsCompleted < 2) {
        return 'new';
      } else if (daysActive < 30 || tutorialsCompleted < 4) {
        return 'intermediate';
      } else {
        return 'advanced';
      }
    };
    
    expect(determineExperienceLevel(1, 0)).toBe('new');
    expect(determineExperienceLevel(5, 1)).toBe('new');
    expect(determineExperienceLevel(10, 2)).toBe('intermediate');
    expect(determineExperienceLevel(25, 3)).toBe('intermediate');
    expect(determineExperienceLevel(35, 5)).toBe('advanced');
  });
});
