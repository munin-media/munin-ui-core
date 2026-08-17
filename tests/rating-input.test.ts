import { describe, it, expect } from 'vitest';
import {
  computeRatingInputState,
  getRatingInputAccessibility,
  validateRatingInputProps,
} from '../src/rating-input.js';

describe('RatingInput', () => {
  describe('computeRatingInputState', () => {
    it('uses defaults when no props specified', () => {
      const state = computeRatingInputState({});
      expect(state.currentValue).toBe(1);
      expect(state.hoveredValue).toBeNull();
      expect(state.isInteracting).toBe(false);
      expect(state.steps).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(state.displayValue).toBe(1);
    });

    it('respects custom min/max', () => {
      const state = computeRatingInputState({ min: 1, max: 5 });
      expect(state.steps).toEqual([1, 2, 3, 4, 5]);
    });

    it('uses provided value', () => {
      const state = computeRatingInputState({ value: 7 });
      expect(state.currentValue).toBe(7);
      expect(state.displayValue).toBe(7);
    });

    it('preserves selected tags', () => {
      const state = computeRatingInputState({ selectedTags: ['action', 'thriller'] });
      expect(state.selectedTags).toEqual(['action', 'thriller']);
    });

    it('defaults selectedTags to empty array', () => {
      const state = computeRatingInputState({});
      expect(state.selectedTags).toEqual([]);
    });
  });

  describe('getRatingInputAccessibility', () => {
    it('returns slider role with correct values', () => {
      const props = { min: 1, max: 5, value: 3, variant: 'stars' as const };
      const state = computeRatingInputState(props);
      const a11y = getRatingInputAccessibility(props, state);

      expect(a11y.role).toBe('slider');
      expect(a11y.valueNow).toBe(3);
      expect(a11y.valueMin).toBe(1);
      expect(a11y.valueMax).toBe(5);
      expect(a11y.label).toContain('stars');
    });

    it('uses default variant in label', () => {
      const props = {};
      const state = computeRatingInputState(props);
      const a11y = getRatingInputAccessibility(props, state);
      expect(a11y.label).toContain('stars');
    });
  });

  describe('validateRatingInputProps', () => {
    it('accepts empty object (all optional)', () => {
      expect(validateRatingInputProps({})).toBe(true);
    });

    it('accepts full props', () => {
      expect(validateRatingInputProps({
        min: 1, max: 5, value: 3, variant: 'slider',
      })).toBe(true);
    });

    it('rejects invalid variant', () => {
      expect(validateRatingInputProps({ variant: 'invalid' })).toBe(false);
    });

    it('rejects non-object', () => {
      expect(validateRatingInputProps(null)).toBe(false);
    });
  });
});
