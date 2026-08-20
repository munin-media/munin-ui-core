import { describe, it, expect } from 'vitest';
import {
  computeRecommendationCardState,
  getRecommendationCardAccessibility,
  validateRecommendationCardProps,
} from '../src/recommendation-card.js';
import type { Recommendation } from '@munin-media/core';

const mockRecommendation: Recommendation = {
  titleId: 'title-42',
  score: 0.87,
  matchingTags: ['sci-fi', 'thriller', 'dystopian', 'cerebral'],
  reason: 'Based on your high ratings for cerebral sci-fi',
};

describe('RecommendationCard', () => {
  describe('computeRecommendationCardState', () => {
    it('computes display score and formats it', () => {
      const state = computeRecommendationCardState({ recommendation: mockRecommendation });
      expect(state.displayScore).toBe(87);
      expect(state.formattedScore).toBe('87% match');
    });

    it('limits visible tags to maxTags', () => {
      const state = computeRecommendationCardState({ recommendation: mockRecommendation, maxTags: 2 });
      expect(state.visibleTags).toEqual(['sci-fi', 'thriller']);
      expect(state.hasMoreTags).toBe(true);
    });

    it('defaults maxTags to 3', () => {
      const state = computeRecommendationCardState({ recommendation: mockRecommendation });
      expect(state.visibleTags).toHaveLength(3);
      expect(state.hasMoreTags).toBe(true);
    });

    it('shows all tags when fewer than maxTags', () => {
      const rec = { ...mockRecommendation, matchingTags: ['action'] };
      const state = computeRecommendationCardState({ recommendation: rec });
      expect(state.visibleTags).toEqual(['action']);
      expect(state.hasMoreTags).toBe(false);
    });

    it('passes through reason', () => {
      const state = computeRecommendationCardState({ recommendation: mockRecommendation });
      expect(state.reason).toBe('Based on your high ratings for cerebral sci-fi');
    });
  });

  describe('getRecommendationCardAccessibility', () => {
    it('includes score and tags in label', () => {
      const props = { recommendation: mockRecommendation };
      const state = computeRecommendationCardState(props);
      const a11y = getRecommendationCardAccessibility(props, state);

      expect(a11y.role).toBe('button');
      expect(a11y.label).toContain('87% match');
      expect(a11y.label).toContain('sci-fi');
      expect(a11y.label).toContain('Based on your high ratings');
    });
  });

  describe('validateRecommendationCardProps', () => {
    it('accepts valid props', () => {
      expect(validateRecommendationCardProps({ recommendation: mockRecommendation })).toBe(true);
    });

    it('rejects missing recommendation', () => {
      expect(validateRecommendationCardProps({})).toBe(false);
    });

    it('rejects incomplete recommendation', () => {
      expect(validateRecommendationCardProps({
        recommendation: { titleId: 'x' },
      })).toBe(false);
    });
  });
});
