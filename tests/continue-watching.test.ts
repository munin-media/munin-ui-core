import { describe, it, expect } from 'vitest';
import {
  computeContinueWatchingState,
  getContinueWatchingAccessibility,
  getContinueWatchingItemAccessibility,
  validateContinueWatchingProps,
} from '../src/continue-watching.js';
import type { ProgressEntry } from '@munin-media/core';

function makeEntry(overrides: Partial<ProgressEntry> = {}): ProgressEntry {
  return {
    userId: 'user-1',
    titleId: 'title-1',
    type: 'movie',
    currentSeconds: 1200,
    durationSeconds: 7200,
    percent: 0.5,
    isCompleted: false,
    lastUpdated: new Date('2026-08-16'),
    ...overrides,
  };
}

describe('ContinueWatching', () => {
  describe('computeContinueWatchingState', () => {
    it('returns visible items filtered by not-completed', () => {
      const items = [
        makeEntry({ titleId: 'a', percent: 0.5 }),
        makeEntry({ titleId: 'b', percent: 0.8 }),
        makeEntry({ titleId: 'c', isCompleted: true }),
      ];
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems).toHaveLength(2);
      expect(state.isEmpty).toBe(false);
    });

    it('excludes items with 0 progress', () => {
      const items = [
        makeEntry({ titleId: 'a', percent: 0 }),
        makeEntry({ titleId: 'b', percent: 0.3 }),
      ];
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems).toHaveLength(1);
      expect(state.visibleItems[0]!.titleId).toBe('b');
    });

    it('handles empty input', () => {
      const state = computeContinueWatchingState({ items: [] });
      expect(state.isEmpty).toBe(true);
      expect(state.visibleItems).toHaveLength(0);
      expect(state.hasMore).toBe(false);
    });

    it('respects maxVisible', () => {
      const items = Array.from({ length: 15 }, (_, i) =>
        makeEntry({ titleId: `t${i}`, percent: 0.5, lastUpdated: new Date(2026, 7, i + 1) }),
      );
      const state = computeContinueWatchingState({ items, maxVisible: 5 });
      expect(state.visibleItems).toHaveLength(5);
      expect(state.hasMore).toBe(true);
      expect(state.totalCount).toBe(15);
    });

    it('sorts by lastUpdated descending', () => {
      const items = [
        makeEntry({ titleId: 'old', percent: 0.5, lastUpdated: new Date('2026-08-01') }),
        makeEntry({ titleId: 'new', percent: 0.5, lastUpdated: new Date('2026-08-16') }),
      ];
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems[0]!.titleId).toBe('new');
    });

    it('formats resume time correctly', () => {
      const items = [makeEntry({ currentSeconds: 2057, percent: 0.3 })]; // 34:17
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems[0]!.formattedResumeTime).toBe('34:17');
    });

    it('formats hours correctly', () => {
      const items = [makeEntry({ currentSeconds: 3661, percent: 0.3 })]; // 1:01:01
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems[0]!.formattedResumeTime).toBe('1:01:01');
    });
  });

  describe('getContinueWatchingAccessibility', () => {
    it('indicates empty state', () => {
      const props = { items: [] as ProgressEntry[] };
      const state = computeContinueWatchingState(props);
      const a11y = getContinueWatchingAccessibility(props, state);
      expect(a11y.role).toBe('list');
      expect(a11y.label).toContain('No items');
    });

    it('reports item count', () => {
      const items = [makeEntry({ percent: 0.5 }), makeEntry({ titleId: 'b', percent: 0.3 })];
      const props = { items };
      const state = computeContinueWatchingState(props);
      const a11y = getContinueWatchingAccessibility(props, state);
      expect(a11y.itemCount).toBe(2);
    });
  });

  describe('getContinueWatchingItemAccessibility', () => {
    it('returns item-level accessibility', () => {
      const item = {
        titleId: 'x',
        percent: 45,
        resumeSeconds: 1200,
        formattedResumeTime: '20:00',
        lastUpdated: new Date(),
      };
      const a11y = getContinueWatchingItemAccessibility(item);
      expect(a11y.role).toBe('listitem');
      expect(a11y.label).toContain('20:00');
      expect(a11y.label).toContain('45%');
    });
  });

  describe('validateContinueWatchingProps', () => {
    it('accepts valid props', () => {
      expect(validateContinueWatchingProps({ items: [] })).toBe(true);
    });

    it('rejects non-array items', () => {
      expect(validateContinueWatchingProps({ items: 'not-array' })).toBe(false);
    });

    it('rejects null', () => {
      expect(validateContinueWatchingProps(null)).toBe(false);
    });
  });
});
