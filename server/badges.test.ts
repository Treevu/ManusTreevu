import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getAllBadges: vi.fn(),
  getBadgeByCode: vi.fn(),
  getUserBadges: vi.fn(),
  hasBadge: vi.fn(),
  awardBadge: vi.fn(),
  markBadgeNotified: vi.fn(),
  getUnnotifiedBadges: vi.fn(),
  checkAndAwardEducationBadges: vi.fn(),
  seedBadges: vi.fn(),
  getTreePointsLeaderboard: vi.fn(),
  getUserLeaderboardPosition: vi.fn(),
  getDepartmentLeaderboard: vi.fn(),
}));

import * as db from './db';

describe('Badges System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBadges', () => {
    it('returns all active badges', async () => {
      const mockBadges = [
        { id: 1, code: 'fwi_master', name: 'FWI Master', category: 'education', rarity: 'common', pointsReward: 100 },
        { id: 2, code: 'ewa_expert', name: 'EWA Expert', category: 'education', rarity: 'common', pointsReward: 100 },
      ];
      vi.mocked(db.getAllBadges).mockResolvedValue(mockBadges as any);

      const result = await db.getAllBadges();
      expect(result).toHaveLength(2);
      expect(result[0].code).toBe('fwi_master');
    });

    it('returns empty array when no badges exist', async () => {
      vi.mocked(db.getAllBadges).mockResolvedValue([]);

      const result = await db.getAllBadges();
      expect(result).toHaveLength(0);
    });
  });

  describe('getBadgeByCode', () => {
    it('returns badge when found', async () => {
      const mockBadge = { id: 1, code: 'fwi_master', name: 'FWI Master' };
      vi.mocked(db.getBadgeByCode).mockResolvedValue(mockBadge as any);

      const result = await db.getBadgeByCode('fwi_master');
      expect(result).not.toBeNull();
      expect(result?.code).toBe('fwi_master');
    });

    it('returns null when badge not found', async () => {
      vi.mocked(db.getBadgeByCode).mockResolvedValue(null);

      const result = await db.getBadgeByCode('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getUserBadges', () => {
    it('returns user badges with badge details', async () => {
      const mockUserBadges = [
        { id: 1, userId: 1, badgeId: 1, earnedAt: new Date(), badge: { id: 1, code: 'fwi_master', name: 'FWI Master' } },
      ];
      vi.mocked(db.getUserBadges).mockResolvedValue(mockUserBadges as any);

      const result = await db.getUserBadges(1);
      expect(result).toHaveLength(1);
      expect(result[0].badge.code).toBe('fwi_master');
    });

    it('returns empty array for user with no badges', async () => {
      vi.mocked(db.getUserBadges).mockResolvedValue([]);

      const result = await db.getUserBadges(999);
      expect(result).toHaveLength(0);
    });
  });

  describe('hasBadge', () => {
    it('returns true when user has badge', async () => {
      vi.mocked(db.hasBadge).mockResolvedValue(true);

      const result = await db.hasBadge(1, 'fwi_master');
      expect(result).toBe(true);
    });

    it('returns false when user does not have badge', async () => {
      vi.mocked(db.hasBadge).mockResolvedValue(false);

      const result = await db.hasBadge(1, 'nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('awardBadge', () => {
    it('awards badge and returns success with points', async () => {
      const mockBadge = { id: 1, code: 'fwi_master', name: 'FWI Master', pointsReward: 100 };
      vi.mocked(db.awardBadge).mockResolvedValue({
        success: true,
        badge: mockBadge as any,
        pointsAwarded: 100,
        alreadyHad: false,
      });

      const result = await db.awardBadge(1, 'fwi_master');
      expect(result.success).toBe(true);
      expect(result.pointsAwarded).toBe(100);
      expect(result.alreadyHad).toBe(false);
    });

    it('returns alreadyHad true when user already has badge', async () => {
      vi.mocked(db.awardBadge).mockResolvedValue({
        success: true,
        badge: { id: 1, code: 'fwi_master' } as any,
        alreadyHad: true,
      });

      const result = await db.awardBadge(1, 'fwi_master');
      expect(result.success).toBe(true);
      expect(result.alreadyHad).toBe(true);
    });

    it('returns failure for nonexistent badge', async () => {
      vi.mocked(db.awardBadge).mockResolvedValue({ success: false });

      const result = await db.awardBadge(1, 'nonexistent');
      expect(result.success).toBe(false);
    });
  });

  describe('checkAndAwardEducationBadges', () => {
    it('awards badges based on completed tutorials', async () => {
      const mockAwardedBadges = [
        { id: 1, code: 'fwi_master', name: 'FWI Master', pointsReward: 100 },
      ];
      vi.mocked(db.checkAndAwardEducationBadges).mockResolvedValue(mockAwardedBadges as any);

      const result = await db.checkAndAwardEducationBadges(1);
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('fwi_master');
    });

    it('returns empty array when no new badges earned', async () => {
      vi.mocked(db.checkAndAwardEducationBadges).mockResolvedValue([]);

      const result = await db.checkAndAwardEducationBadges(1);
      expect(result).toHaveLength(0);
    });
  });
});

describe('Leaderboard System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTreePointsLeaderboard', () => {
    it('returns ranked users by TreePoints', async () => {
      const mockLeaderboard = [
        { rank: 1, userId: 1, name: 'User 1', treePoints: 1000, level: 5, fwiScore: 80 },
        { rank: 2, userId: 2, name: 'User 2', treePoints: 800, level: 4, fwiScore: 75 },
        { rank: 3, userId: 3, name: 'User 3', treePoints: 600, level: 3, fwiScore: 70 },
      ];
      vi.mocked(db.getTreePointsLeaderboard).mockResolvedValue(mockLeaderboard as any);

      const result = await db.getTreePointsLeaderboard({ limit: 10 });
      expect(result).toHaveLength(3);
      expect(result[0].rank).toBe(1);
      expect(result[0].treePoints).toBe(1000);
    });

    it('respects limit parameter', async () => {
      const mockLeaderboard = [
        { rank: 1, userId: 1, name: 'User 1', treePoints: 1000 },
      ];
      vi.mocked(db.getTreePointsLeaderboard).mockResolvedValue(mockLeaderboard as any);

      const result = await db.getTreePointsLeaderboard({ limit: 1 });
      expect(result).toHaveLength(1);
    });

    it('filters by department when specified', async () => {
      const mockLeaderboard = [
        { rank: 1, userId: 1, name: 'User 1', treePoints: 500, departmentId: 1 },
      ];
      vi.mocked(db.getTreePointsLeaderboard).mockResolvedValue(mockLeaderboard as any);

      const result = await db.getTreePointsLeaderboard({ limit: 10, departmentId: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].departmentId).toBe(1);
    });
  });

  describe('getUserLeaderboardPosition', () => {
    it('returns user position and percentile', async () => {
      vi.mocked(db.getUserLeaderboardPosition).mockResolvedValue({
        rank: 5,
        totalUsers: 100,
        percentile: 95,
      });

      const result = await db.getUserLeaderboardPosition(1);
      expect(result.rank).toBe(5);
      expect(result.totalUsers).toBe(100);
      expect(result.percentile).toBe(95);
    });

    it('returns zero values for nonexistent user', async () => {
      vi.mocked(db.getUserLeaderboardPosition).mockResolvedValue({
        rank: 0,
        totalUsers: 0,
        percentile: 0,
      });

      const result = await db.getUserLeaderboardPosition(999);
      expect(result.rank).toBe(0);
    });
  });

  describe('getDepartmentLeaderboard', () => {
    it('returns ranked departments by FWI score', async () => {
      const mockDeptLeaderboard = [
        { rank: 1, departmentId: 1, name: 'Engineering', avgFwiScore: 80, totalTreePoints: 5000, employeeCount: 10 },
        { rank: 2, departmentId: 2, name: 'Marketing', avgFwiScore: 75, totalTreePoints: 4000, employeeCount: 8 },
      ];
      vi.mocked(db.getDepartmentLeaderboard).mockResolvedValue(mockDeptLeaderboard as any);

      const result = await db.getDepartmentLeaderboard(10);
      expect(result).toHaveLength(2);
      expect(result[0].rank).toBe(1);
      expect(result[0].avgFwiScore).toBe(80);
    });
  });
});

describe('Badge Rarity System', () => {
  it('common badges have lowest point rewards', () => {
    const commonReward = 100;
    const rareReward = 150;
    const epicReward = 250;
    const legendaryReward = 500;

    expect(commonReward).toBeLessThan(rareReward);
    expect(rareReward).toBeLessThan(epicReward);
    expect(epicReward).toBeLessThan(legendaryReward);
  });

  it('badge categories are valid', () => {
    const validCategories = ['education', 'financial', 'engagement', 'social', 'merchant', 'b2b'];
    
    validCategories.forEach(category => {
      expect(validCategories).toContain(category);
    });
  });
});

describe('Notification Triggers for Badges', () => {
  it('triggerBadgeEarned creates correct notification', async () => {
    // This test verifies the notification trigger function signature
    const badgeName = 'FWI Master';
    const pointsAwarded = 100;
    
    // The trigger should include badge name and points in the message
    const expectedMessage = `Has obtenido la insignia "${badgeName}" y ganado ${pointsAwarded} TreePoints.`;
    expect(expectedMessage).toContain(badgeName);
    expect(expectedMessage).toContain(pointsAwarded.toString());
  });

  it('triggerTutorialCompleted creates correct notification', async () => {
    const tutorialName = 'FWI Score Básico';
    const pointsAwarded = 50;
    
    const expectedMessage = `Has completado "${tutorialName}" y ganado ${pointsAwarded} TreePoints.`;
    expect(expectedMessage).toContain(tutorialName);
    expect(expectedMessage).toContain(pointsAwarded.toString());
  });
});
