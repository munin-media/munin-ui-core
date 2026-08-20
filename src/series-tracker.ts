/**
 * SeriesTracker component contract.
 * Displays season/episode grid with progress and expansion logic.
 */

import type { SeriesProgress } from '@munin-media/core';
import type { BaseAccessibility } from './types.js';

// --- Props ---

export interface SeriesTrackerProps {
  /** Full series progress data */
  series: SeriesProgress;
  /** Called when an episode is selected */
  onEpisodeSelect?: (episodeId: string) => void;
  /** Which season number is expanded (undefined = all collapsed) */
  expandedSeason?: number;
}

// --- State ---

export interface SeriesTrackerState {
  seasons: SeasonDisplayState[];
  overallPercent: number;
  completedEpisodes: number;
  totalEpisodes: number;
  formattedOverall: string;
}

export interface SeasonDisplayState {
  seasonNumber: number;
  percent: number;
  episodes: EpisodeDisplayState[];
  isExpanded: boolean;
  completedEpisodes: number;
  totalEpisodes: number;
}

export interface EpisodeDisplayState {
  episodeId: string;
  episodeNumber: number;
  status: 'unwatched' | 'in-progress' | 'completed';
  percent: number;
}

// --- Accessibility ---

export interface SeriesTrackerAccessibility extends BaseAccessibility {
  role: 'group';
  label: string;
}

export interface SeasonAccessibility extends BaseAccessibility {
  role: 'group';
  label: string;
  expanded: boolean;
}

// --- Events ---

export interface SeriesTrackerEvents {
  onEpisodeSelect?: (episodeId: string) => void;
  onSeasonToggle?: (seasonNumber: number) => void;
}

// --- Computation ---

function computeEpisodeStatus(percent: number, isCompleted: boolean): 'unwatched' | 'in-progress' | 'completed' {
  if (isCompleted || percent >= 1) return 'completed';
  if (percent > 0) return 'in-progress';
  return 'unwatched';
}

export function computeSeriesTrackerState(props: SeriesTrackerProps): SeriesTrackerState {
  const { series, expandedSeason } = props;

  const seasons: SeasonDisplayState[] = series.seasons.map((season) => {
    const episodes: EpisodeDisplayState[] = season.episodes.map((ep) => ({
      episodeId: ep.episodeId,
      episodeNumber: ep.episodeNumber,
      status: computeEpisodeStatus(ep.percent, ep.isCompleted),
      percent: Math.round(ep.percent * 100),
    }));

    return {
      seasonNumber: season.seasonNumber,
      percent: Math.round(season.percent * 100),
      episodes,
      isExpanded: expandedSeason === season.seasonNumber,
      completedEpisodes: season.completedEpisodes,
      totalEpisodes: season.totalEpisodes,
    };
  });

  const overallPercent = Math.round(series.overallPercent * 100);

  return {
    seasons,
    overallPercent,
    completedEpisodes: series.completedEpisodes,
    totalEpisodes: series.totalEpisodes,
    formattedOverall: `${overallPercent}%`,
  };
}

export function getSeriesTrackerAccessibility(
  props: SeriesTrackerProps,
  state: SeriesTrackerState,
): SeriesTrackerAccessibility {
  return {
    role: 'group',
    label: `Series progress: ${state.formattedOverall}, ${state.completedEpisodes} of ${state.totalEpisodes} episodes`,
  };
}

export function getSeasonAccessibility(season: SeasonDisplayState): SeasonAccessibility {
  return {
    role: 'group',
    label: `Season ${season.seasonNumber}: ${season.percent}%, ${season.completedEpisodes} of ${season.totalEpisodes} episodes`,
    expanded: season.isExpanded,
  };
}

// --- Validation ---

export function validateSeriesTrackerProps(props: unknown): props is SeriesTrackerProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  if (typeof p['series'] !== 'object' || p['series'] === null) return false;
  const s = p['series'] as Record<string, unknown>;
  return (
    typeof s['seriesId'] === 'string' &&
    Array.isArray(s['seasons']) &&
    typeof s['overallPercent'] === 'number'
  );
}
