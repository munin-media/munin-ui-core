/**
 * RecommendationCard component contract.
 * Displays a single content recommendation with score, tags, and reason.
 */

import type { Recommendation } from '@munin-media/core';
import type { BaseAccessibility } from './types.js';

// --- Props ---

export interface RecommendationCardProps {
  /** Recommendation data */
  recommendation: Recommendation;
  /** Maximum number of matching tags to display */
  maxTags?: number;
  /** Called when the card is pressed */
  onPress?: (titleId: string) => void;
  /** Called when dismissed */
  onDismiss?: (titleId: string) => void;
}

// --- State ---

export interface RecommendationCardState {
  /** Title ID for the recommendation */
  titleId: string;
  /** Display score (0–100) */
  displayScore: number;
  /** Formatted score string, e.g. "87% match" */
  formattedScore: string;
  /** Tags to display (limited by maxTags) */
  visibleTags: string[];
  /** Whether there are more tags than shown */
  hasMoreTags: boolean;
  /** Human-readable reason */
  reason: string;
}

// --- Accessibility ---

export interface RecommendationCardAccessibility extends BaseAccessibility {
  role: 'button';
  label: string;
}

// --- Events ---

export interface RecommendationCardEvents {
  onPress?: (titleId: string) => void;
  onDismiss?: (titleId: string) => void;
}

// --- Computation ---

export function computeRecommendationCardState(
  props: RecommendationCardProps,
): RecommendationCardState {
  const { recommendation, maxTags = 3 } = props;
  const displayScore = Math.round(recommendation.score * 100);
  const visibleTags = recommendation.matchingTags.slice(0, maxTags);

  return {
    titleId: recommendation.titleId,
    displayScore,
    formattedScore: `${displayScore}% match`,
    visibleTags,
    hasMoreTags: recommendation.matchingTags.length > maxTags,
    reason: recommendation.reason,
  };
}

export function getRecommendationCardAccessibility(
  _props: RecommendationCardProps,
  state: RecommendationCardState,
): RecommendationCardAccessibility {
  const tagList = state.visibleTags.length > 0
    ? `, tags: ${state.visibleTags.join(', ')}`
    : '';

  return {
    role: 'button',
    label: `Recommendation: ${state.formattedScore}${tagList}. ${state.reason}`,
  };
}

// --- Validation ---

export function validateRecommendationCardProps(props: unknown): props is RecommendationCardProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  if (typeof p['recommendation'] !== 'object' || p['recommendation'] === null) return false;
  const r = p['recommendation'] as Record<string, unknown>;
  return (
    typeof r['titleId'] === 'string' &&
    typeof r['score'] === 'number' &&
    Array.isArray(r['matchingTags']) &&
    typeof r['reason'] === 'string'
  );
}
