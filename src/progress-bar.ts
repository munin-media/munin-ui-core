/**
 * ProgressBar component contract.
 * Displays media consumption progress for a single title.
 */

import type { BaseAccessibility } from './types.js';

// --- Props ---

export interface ProgressBarProps {
  /** Progress value 0.0–1.0 */
  percent: number;
  /** Whether the content is marked as completed */
  isCompleted: boolean;
  /** Accessible label for the progress bar */
  label?: string;
  /** Visual variant */
  variant?: 'linear' | 'circular';
  /** Whether to show the percent label visually */
  showLabel?: boolean;
}

// --- State ---

export interface ProgressBarState {
  /** Clamped display percent 0–100 */
  displayPercent: number;
  /** Human-readable percent string, e.g. "73%" */
  formattedPercent: string;
  /** Whether the progress is considered complete */
  isComplete: boolean;
}

// --- Accessibility ---

export interface ProgressBarAccessibility extends BaseAccessibility {
  role: 'progressbar';
  valueNow: number;
  valueMin: number;
  valueMax: number;
  label: string;
}

// --- Events ---

export interface ProgressBarEvents {
  onPress?: () => void;
}

// --- Computation ---

export function computeProgressBarState(props: ProgressBarProps): ProgressBarState {
  const clamped = Math.max(0, Math.min(1, props.percent));
  const displayPercent = Math.round(clamped * 100);

  return {
    displayPercent,
    formattedPercent: `${displayPercent}%`,
    isComplete: props.isCompleted || displayPercent >= 100,
  };
}

export function getProgressBarAccessibility(
  props: ProgressBarProps,
  state: ProgressBarState,
): ProgressBarAccessibility {
  return {
    role: 'progressbar',
    valueNow: state.displayPercent,
    valueMin: 0,
    valueMax: 100,
    label: props.label ?? `Progress: ${state.formattedPercent}`,
  };
}

// --- Validation ---

export function validateProgressBarProps(props: unknown): props is ProgressBarProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  return (
    typeof p['percent'] === 'number' &&
    typeof p['isCompleted'] === 'boolean'
  );
}
