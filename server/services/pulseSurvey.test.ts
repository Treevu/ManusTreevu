import { describe, it, expect } from 'vitest';
import { DEFAULT_QUESTIONS } from './pulseSurveyService';

describe('Pulse Survey Service', () => {
  describe('DEFAULT_QUESTIONS', () => {
    it('should have 6 default questions', () => {
      expect(DEFAULT_QUESTIONS).toHaveLength(6);
    });

    it('should have valid question types', () => {
      const validTypes = ['scale', 'emoji', 'text', 'choice'];
      DEFAULT_QUESTIONS.forEach(q => {
        expect(validTypes).toContain(q.questionType);
      });
    });

    it('should have valid categories', () => {
      const validCategories = [
        'financial_stress',
        'work_life_balance',
        'job_satisfaction',
        'financial_confidence',
        'savings_habits',
        'overall_wellbeing'
      ];
      DEFAULT_QUESTIONS.forEach(q => {
        expect(validCategories).toContain(q.category);
      });
    });

    it('should have questionText for all questions', () => {
      DEFAULT_QUESTIONS.forEach(q => {
        expect(q.questionText).toBeDefined();
        expect(q.questionText.length).toBeGreaterThan(10);
      });
    });

    it('should have options for choice type questions', () => {
      const choiceQuestions = DEFAULT_QUESTIONS.filter(q => q.questionType === 'choice');
      choiceQuestions.forEach(q => {
        expect((q as any).options).toBeDefined();
        const options = JSON.parse((q as any).options);
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBeGreaterThan(0);
      });
    });

    it('should cover financial stress category', () => {
      const financialStress = DEFAULT_QUESTIONS.find(q => q.category === 'financial_stress');
      expect(financialStress).toBeDefined();
    });

    it('should cover overall wellbeing category', () => {
      const wellbeing = DEFAULT_QUESTIONS.find(q => q.category === 'overall_wellbeing');
      expect(wellbeing).toBeDefined();
    });
  });

  describe('Question Categories Coverage', () => {
    it('should have at least one question per category', () => {
      const categories = new Set(DEFAULT_QUESTIONS.map(q => q.category));
      expect(categories.size).toBeGreaterThanOrEqual(5);
    });

    it('should have emoji type for emotional questions', () => {
      const emojiQuestions = DEFAULT_QUESTIONS.filter(q => q.questionType === 'emoji');
      expect(emojiQuestions.length).toBeGreaterThanOrEqual(1);
    });

    it('should have scale type for rating questions', () => {
      const scaleQuestions = DEFAULT_QUESTIONS.filter(q => q.questionType === 'scale');
      expect(scaleQuestions.length).toBeGreaterThanOrEqual(2);
    });
  });
});
