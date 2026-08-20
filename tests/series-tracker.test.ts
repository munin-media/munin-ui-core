import { describe, it, expect } from 'vitest';
import {
  computeSeriesTrackerState,
  getSeriesTrackerAccessibility,
  getSeasonAccessibility,
  validateSeriesTrackerProps,
} from '../src/series-tracker.js';
import type { SeriesProgress } from '@munin-media/core';

const mockSeries: SeriesProgress = {
  userId: 'user-1',
  seriesId: 'series-1',
  seasons: [
    {
      seasonId: 's1',
      seasonNumber: 1,
      episodes: [
        { episodeId: 'e1', episodeNumber: 1, currentSeconds: 2700, durationSeconds: 2700, percent: 1.0, isCompleted: true },
        { episodeId: 'e2', episodeNumber: 2, currentSeconds: 1350, durationSeconds: 2700, percent: 0.5, isCompleted: false },
        { episodeId: 'e3', episodeNumber: 3, currentSeconds: 0, durationSeconds: 2700, percent: 0, isCompleted: false },
      ],
      percent: 0.5,
      totalEpisodes: 3,
      completedEpisodes: 1,
    },
    {
      seasonId: 's2',
      seasonNumber: 2,
      episodes: [
        { episodeId: 'e4', episodeNumber: 1, currentSeconds: 0, durationSeconds: 2700, percent: 0, isCompleted: false },
      ],
      percent: 0,
      totalEpisodes: 1,
      completedEpisodes: 0,
    },
  ],
  overallPercent: 0.25,
  totalEpisodes: 4,
  completedEpisodes: 1,
  lastWatchedEpisodeId: 'e2',
  lastUpdated: new Date('2026-08-16'),
};

describe('SeriesTracker', () => {
  describe('computeSeriesTrackerState', () => {
    it('computes overall percent and episode counts', () => {
      const state = computeSeriesTrackerState({ series: mockSeries });
      expect(state.overallPercent).toBe(25);
      expect(state.completedEpisodes).toBe(1);
      expect(state.totalEpisodes).toBe(4);
      expect(state.formattedOverall).toBe('25%');
    });

    it('computes season data correctly', () => {
      const state = computeSeriesTrackerState({ series: mockSeries });
      expect(state.seasons).toHaveLength(2);
      expect(state.seasons[0]!.seasonNumber).toBe(1);
      expect(state.seasons[0]!.percent).toBe(50);
      expect(state.seasons[0]!.isExpanded).toBe(false);
    });

    it('marks expanded season', () => {
      const state = computeSeriesTrackerState({ series: mockSeries, expandedSeason: 2 });
      expect(state.seasons[0]!.isExpanded).toBe(false);
      expect(state.seasons[1]!.isExpanded).toBe(true);
    });

    it('computes episode statuses', () => {
      const state = computeSeriesTrackerState({ series: mockSeries });
      const s1Episodes = state.seasons[0]!.episodes;
      expect(s1Episodes[0]!.status).toBe('completed');
      expect(s1Episodes[1]!.status).toBe('in-progress');
      expect(s1Episodes[2]!.status).toBe('unwatched');
    });
  });

  describe('getSeriesTrackerAccessibility', () => {
    it('returns descriptive label', () => {
      const state = computeSeriesTrackerState({ series: mockSeries });
      const a11y = getSeriesTrackerAccessibility({ series: mockSeries }, state);
      expect(a11y.role).toBe('group');
      expect(a11y.label).toContain('25%');
      expect(a11y.label).toContain('1 of 4');
    });
  });

  describe('getSeasonAccessibility', () => {
    it('returns season info', () => {
      const state = computeSeriesTrackerState({ series: mockSeries, expandedSeason: 1 });
      const a11y = getSeasonAccessibility(state.seasons[0]!);
      expect(a11y.role).toBe('group');
      expect(a11y.label).toContain('Season 1');
      expect(a11y.expanded).toBe(true);
    });
  });

  describe('validateSeriesTrackerProps', () => {
    it('accepts valid props', () => {
      expect(validateSeriesTrackerProps({ series: mockSeries })).toBe(true);
    });

    it('rejects missing series', () => {
      expect(validateSeriesTrackerProps({})).toBe(false);
    });

    it('rejects null', () => {
      expect(validateSeriesTrackerProps(null)).toBe(false);
    });
  });
});
