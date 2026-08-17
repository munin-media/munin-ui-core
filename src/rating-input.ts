/**
 * RatingInput component contract.
 * Supports stars, slider, and numeric input variants.
 */

import type { BaseAccessibility } from './types.js';

// --- Props ---

export interface RatingInputProps {
  /** Minimum score (default: 1) */
  min?: number;
  /** Maximum score (default: 10) */
  max?: number;
  /** Current selected value */
  value?: number;
  /** Visual/interaction variant */
  variant?: 'stars' | 'slider' | 'numeric';
  /** Tags suggested for categorization */
  suggestedTags?: string[];
  /** Currently selected tags */
  selectedTags?: string[];
  /** Called when rating is submitted */
  onRate?: (result: RatingResult) => void;
}

export interface RatingResult {
  score: number;
  tags: string[];
}

// --- State ---

export interface RatingInputState {
  /** Current effective value */
  currentValue: number;
  /** Value being hovered over (null if not hovering) */
  hoveredValue: number | null;
  /** Whether user is actively interacting */
  isInteracting: boolean;
  /** Array of all possible step values */
  steps: number[];
  /** Display value — hovered takes priority over current */
  displayValue: number;
  /** Selected tags */
  selectedTags: string[];
}

// --- Accessibility ---

export interface RatingInputAccessibility extends BaseAccessibility {
  role: 'slider';
  valueNow: number;
  valueMin: number;
  valueMax: number;
  label: string;
}

// --- Events ---

export interface RatingInputEvents {
  onRate?: (result: RatingResult) => void;
  onHover?: (value: number | null) => void;
  onChange?: (value: number) => void;
  onTagToggle?: (tag: string) => void;
}

// --- Computation ---

export function computeRatingInputState(props: RatingInputProps): RatingInputState {
  const min = props.min ?? 1;
  const max = props.max ?? 10;
  const currentValue = props.value ?? min;

  const steps: number[] = [];
  for (let i = min; i <= max; i++) {
    steps.push(i);
  }

  return {
    currentValue,
    hoveredValue: null,
    isInteracting: false,
    steps,
    displayValue: currentValue,
    selectedTags: props.selectedTags ?? [],
  };
}

export function getRatingInputAccessibility(
  props: RatingInputProps,
  state: RatingInputState,
): RatingInputAccessibility {
  const min = props.min ?? 1;
  const max = props.max ?? 10;
  const variant = props.variant ?? 'stars';

  return {
    role: 'slider',
    valueNow: state.displayValue,
    valueMin: min,
    valueMax: max,
    label: `Rating: ${state.displayValue} of ${max} (${variant})`,
  };
}

// --- Validation ---

export function validateRatingInputProps(props: unknown): props is RatingInputProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  if (p['min'] !== undefined && typeof p['min'] !== 'number') return false;
  if (p['max'] !== undefined && typeof p['max'] !== 'number') return false;
  if (p['value'] !== undefined && typeof p['value'] !== 'number') return false;
  if (p['variant'] !== undefined) {
    if (!['stars', 'slider', 'numeric'].includes(p['variant'] as string)) return false;
  }
  return true;
}
