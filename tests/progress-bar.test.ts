import { describe, it, expect } from 'vitest';
import {
  computeProgressBarState,
  getProgressBarAccessibility,
  validateProgressBarProps,
} from '../src/progress-bar.js';

describe('ProgressBar', () => {
  describe('computeProgressBarState', () => {
    it('computes percent correctly', () => {
      const state = computeProgressBarState({ percent: 0.73, isCompleted: false });
      expect(state.displayPercent).toBe(73);
      expect(state.formattedPercent).toBe('73%');
      expect(state.isComplete).toBe(false);
    });

    it('clamps percent below 0', () => {
      const state = computeProgressBarState({ percent: -0.5, isCompleted: false });
      expect(state.displayPercent).toBe(0);
      expect(state.formattedPercent).toBe('0%');
    });

    it('clamps percent above 1', () => {
      const state = computeProgressBarState({ percent: 1.5, isCompleted: false });
      expect(state.displayPercent).toBe(100);
      expect(state.formattedPercent).toBe('100%');
    });

    it('marks complete when isCompleted is true', () => {
      const state = computeProgressBarState({ percent: 0.5, isCompleted: true });
      expect(state.isComplete).toBe(true);
    });

    it('marks complete when percent reaches 100', () => {
      const state = computeProgressBarState({ percent: 1.0, isCompleted: false });
      expect(state.isComplete).toBe(true);
    });

    it('rounds display percent', () => {
      const state = computeProgressBarState({ percent: 0.333, isCompleted: false });
      expect(state.displayPercent).toBe(33);
    });
  });

  describe('getProgressBarAccessibility', () => {
    it('returns progressbar role with values', () => {
      const props = { percent: 0.5, isCompleted: false };
      const state = computeProgressBarState(props);
      const a11y = getProgressBarAccessibility(props, state);

      expect(a11y.role).toBe('progressbar');
      expect(a11y.valueNow).toBe(50);
      expect(a11y.valueMin).toBe(0);
      expect(a11y.valueMax).toBe(100);
      expect(a11y.label).toBe('Progress: 50%');
    });

    it('uses custom label when provided', () => {
      const props = { percent: 0.5, isCompleted: false, label: 'Episode progress' };
      const state = computeProgressBarState(props);
      const a11y = getProgressBarAccessibility(props, state);

      expect(a11y.label).toBe('Episode progress');
    });
  });

  describe('validateProgressBarProps', () => {
    it('accepts valid props', () => {
      expect(validateProgressBarProps({ percent: 0.5, isCompleted: false })).toBe(true);
    });

    it('rejects missing percent', () => {
      expect(validateProgressBarProps({ isCompleted: false })).toBe(false);
    });

    it('rejects non-object', () => {
      expect(validateProgressBarProps(null)).toBe(false);
      expect(validateProgressBarProps('string')).toBe(false);
    });
  });
});
