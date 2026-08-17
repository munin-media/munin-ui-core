/**
 * @munin/ui-core — Component contracts and shared logic.
 * Zero runtime dependencies. Pure TypeScript.
 */

// Shared types
export type { AccessibilityRole, BaseAccessibility, StepStatus } from './types.js';

// ProgressBar
export type {
  ProgressBarProps,
  ProgressBarState,
  ProgressBarAccessibility,
  ProgressBarEvents,
} from './progress-bar.js';
export {
  computeProgressBarState,
  getProgressBarAccessibility,
  validateProgressBarProps,
} from './progress-bar.js';

// SeriesTracker
export type {
  SeriesTrackerProps,
  SeriesTrackerState,
  SeasonDisplayState,
  EpisodeDisplayState,
  SeriesTrackerAccessibility,
  SeasonAccessibility,
  SeriesTrackerEvents,
} from './series-tracker.js';
export {
  computeSeriesTrackerState,
  getSeriesTrackerAccessibility,
  getSeasonAccessibility,
  validateSeriesTrackerProps,
} from './series-tracker.js';

// RatingInput
export type {
  RatingInputProps,
  RatingResult,
  RatingInputState,
  RatingInputAccessibility,
  RatingInputEvents,
} from './rating-input.js';
export {
  computeRatingInputState,
  getRatingInputAccessibility,
  validateRatingInputProps,
} from './rating-input.js';

// ContinueWatching
export type {
  ContinueWatchingProps,
  ContinueWatchingState,
  ContinueWatchingItem,
  ContinueWatchingAccessibility,
  ContinueWatchingItemAccessibility,
  ContinueWatchingEvents,
} from './continue-watching.js';
export {
  computeContinueWatchingState,
  getContinueWatchingAccessibility,
  getContinueWatchingItemAccessibility,
  validateContinueWatchingProps,
} from './continue-watching.js';

// CollectionList
export type {
  CollectionListProps,
  CollectionListState,
  CollectionDisplayItem,
  CollectionListAccessibility,
  CollectionItemAccessibility,
  CollectionListEvents,
} from './collection-list.js';
export {
  computeCollectionListState,
  getCollectionListAccessibility,
  getCollectionItemAccessibility,
  validateCollectionListProps,
} from './collection-list.js';

// RecommendationCard
export type {
  RecommendationCardProps,
  RecommendationCardState,
  RecommendationCardAccessibility,
  RecommendationCardEvents,
} from './recommendation-card.js';
export {
  computeRecommendationCardState,
  getRecommendationCardAccessibility,
  validateRecommendationCardProps,
} from './recommendation-card.js';

// ImportWizard
export type {
  ImportWizardProps,
  ImportSource,
  ImportWizardResult,
  ImportWizardState,
  ImportWizardStep,
  ImportWizardAccessibility,
  ImportWizardStepAccessibility,
  ImportWizardEvents,
  ImportWizardInput,
} from './import-wizard.js';
export {
  computeImportWizardState,
  getImportWizardAccessibility,
  getImportWizardStepAccessibility,
  validateImportWizardProps,
} from './import-wizard.js';
