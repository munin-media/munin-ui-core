/**
 * ContinueWatching component contract.
 * Displays a list of in-progress items the user can resume.
 */

import type { ProgressEntry } from '@munin/core';
import type { BaseAccessibility } from './types.js';

// --- Props ---

export interface ContinueWatchingProps {
  /** Progress entries to display, sorted by lastUpdated desc */
  items: ProgressEntry[];
  /** Called when user wants to resume a title */
  onResume?: (titleId: string) => void;
  /** Message when list is empty */
  emptyMessage?: string;
  /** Maximum items to show before "show more" */
  maxVisible?: number;
}

// --- State ---

export interface ContinueWatchingState {
  /** Items ready for display */
  visibleItems: ContinueWatchingItem[];
  /** Whether there are no items at all */
  isEmpty: boolean;
  /** Whether there are more items beyond maxVisible */
  hasMore: boolean;
  /** Total number of items */
  totalCount: number;
}

export interface ContinueWatchingItem {
  titleId: string;
  percent: number;
  resumeSeconds: number;
  formattedResumeTime: string;
  lastUpdated: Date;
}

// --- Accessibility ---

export interface ContinueWatchingAccessibility extends BaseAccessibility {
  role: 'list';
  label: string;
  itemCount: number;
}

export interface ContinueWatchingItemAccessibility extends BaseAccessibility {
  role: 'listitem';
  label: string;
}

// --- Events ---

export interface ContinueWatchingEvents {
  onResume?: (titleId: string) => void;
  onShowMore?: () => void;
}

// --- Helpers ---

function formatSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

// --- Computation ---

export function computeContinueWatchingState(props: ContinueWatchingProps): ContinueWatchingState {
  const maxVisible = props.maxVisible ?? 10;

  // Filter out completed items and sort by lastUpdated descending
  const eligible = props.items
    .filter((item) => !item.isCompleted && item.percent > 0)
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

  const visibleItems: ContinueWatchingItem[] = eligible
    .slice(0, maxVisible)
    .map((item) => ({
      titleId: item.titleId,
      percent: Math.round(item.percent * 100),
      resumeSeconds: item.currentSeconds,
      formattedResumeTime: formatSeconds(item.currentSeconds),
      lastUpdated: item.lastUpdated,
    }));

  return {
    visibleItems,
    isEmpty: eligible.length === 0,
    hasMore: eligible.length > maxVisible,
    totalCount: eligible.length,
  };
}

export function getContinueWatchingAccessibility(
  _props: ContinueWatchingProps,
  state: ContinueWatchingState,
): ContinueWatchingAccessibility {
  return {
    role: 'list',
    label: state.isEmpty
      ? 'No items to continue watching'
      : `Continue watching: ${state.visibleItems.length} items`,
    itemCount: state.visibleItems.length,
  };
}

export function getContinueWatchingItemAccessibility(
  item: ContinueWatchingItem,
): ContinueWatchingItemAccessibility {
  return {
    role: 'listitem',
    label: `Resume at ${item.formattedResumeTime}, ${item.percent}% complete`,
  };
}

// --- Validation ---

export function validateContinueWatchingProps(props: unknown): props is ContinueWatchingProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  return Array.isArray(p['items']);
}
