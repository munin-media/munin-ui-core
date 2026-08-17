/**
 * ImportWizard component contract.
 * Multi-step state machine for importing data from external sources.
 */

import type { BaseAccessibility, StepStatus } from './types.js';

// --- Props ---

export interface ImportWizardProps {
  /** Available import sources */
  availableSources: ImportSource[];
  /** Called when import completes successfully */
  onComplete?: (result: ImportWizardResult) => void;
  /** Called when wizard is cancelled */
  onCancel?: () => void;
}

export interface ImportSource {
  id: string;
  name: string;
  description: string;
  acceptedFormats: string[];
}

export interface ImportWizardResult {
  sourceId: string;
  itemsImported: number;
  itemsSkipped: number;
  errors: number;
}

// --- State ---

export interface ImportWizardState {
  /** Current step index (0-based) */
  currentStep: number;
  /** All step definitions with their status */
  steps: ImportWizardStep[];
  /** Whether the wizard can proceed to next step */
  canProceed: boolean;
  /** Whether back navigation is available */
  canGoBack: boolean;
  /** Whether the wizard is in a final state */
  isComplete: boolean;
  /** Selected source (set after step 0) */
  selectedSource: ImportSource | null;
  /** Validation errors for the current step */
  validationErrors: string[];
}

export interface ImportWizardStep {
  index: number;
  name: string;
  status: StepStatus;
}

// --- Accessibility ---

export interface ImportWizardAccessibility extends BaseAccessibility {
  role: 'form';
  label: string;
  stepLabel: string;
}

export interface ImportWizardStepAccessibility extends BaseAccessibility {
  role: 'group';
  label: string;
  current: boolean;
}

// --- Events ---

export interface ImportWizardEvents {
  onNext?: () => void;
  onBack?: () => void;
  onSourceSelect?: (sourceId: string) => void;
  onFileSelect?: (file: { name: string; size: number }) => void;
  onComplete?: (result: ImportWizardResult) => void;
  onCancel?: () => void;
}

// --- Step definitions ---

const WIZARD_STEPS = [
  'Select Source',
  'Upload File',
  'Preview & Map',
  'Confirm Import',
] as const;

// --- Computation ---

export interface ImportWizardInput {
  props: ImportWizardProps;
  currentStep: number;
  selectedSourceId: string | null;
  hasFile: boolean;
  hasMappingConfirmed: boolean;
}

export function computeImportWizardState(input: ImportWizardInput): ImportWizardState {
  const { props, currentStep, selectedSourceId, hasFile, hasMappingConfirmed } = input;

  const selectedSource = selectedSourceId
    ? props.availableSources.find((s) => s.id === selectedSourceId) ?? null
    : null;

  const validationErrors = validateCurrentStep(currentStep, {
    selectedSource,
    hasFile,
    hasMappingConfirmed,
  });

  const steps: ImportWizardStep[] = WIZARD_STEPS.map((name, index) => ({
    index,
    name,
    status: getStepStatus(index, currentStep, validationErrors.length > 0),
  }));

  const isComplete = currentStep >= WIZARD_STEPS.length;

  return {
    currentStep,
    steps,
    canProceed: validationErrors.length === 0 && !isComplete,
    canGoBack: currentStep > 0 && !isComplete,
    isComplete,
    selectedSource,
    validationErrors,
  };
}

function getStepStatus(
  stepIndex: number,
  currentStep: number,
  hasErrors: boolean,
): StepStatus {
  if (stepIndex < currentStep) return 'completed';
  if (stepIndex === currentStep) return hasErrors ? 'error' : 'active';
  return 'pending';
}

function validateCurrentStep(
  step: number,
  context: { selectedSource: ImportSource | null; hasFile: boolean; hasMappingConfirmed: boolean },
): string[] {
  const errors: string[] = [];

  switch (step) {
    case 0:
      if (!context.selectedSource) errors.push('Please select an import source');
      break;
    case 1:
      if (!context.hasFile) errors.push('Please upload a file');
      break;
    case 2:
      if (!context.hasMappingConfirmed) errors.push('Please confirm field mapping');
      break;
    case 3:
      // Final confirmation step — no validation needed
      break;
  }

  return errors;
}

export function getImportWizardAccessibility(
  _input: ImportWizardInput,
  state: ImportWizardState,
): ImportWizardAccessibility {
  const currentStepDef = state.steps[state.currentStep];
  const stepLabel = currentStepDef
    ? `Step ${state.currentStep + 1} of ${state.steps.length}: ${currentStepDef.name}`
    : 'Import complete';

  return {
    role: 'form',
    label: 'Import Wizard',
    stepLabel,
  };
}

export function getImportWizardStepAccessibility(
  step: ImportWizardStep,
  currentStep: number,
): ImportWizardStepAccessibility {
  return {
    role: 'group',
    label: `${step.name}: ${step.status}`,
    current: step.index === currentStep,
  };
}

// --- Validation ---

export function validateImportWizardProps(props: unknown): props is ImportWizardProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  if (!Array.isArray(p['availableSources'])) return false;
  return p['availableSources'].every((s: unknown) => {
    if (typeof s !== 'object' || s === null) return false;
    const src = s as Record<string, unknown>;
    return (
      typeof src['id'] === 'string' &&
      typeof src['name'] === 'string' &&
      typeof src['description'] === 'string' &&
      Array.isArray(src['acceptedFormats'])
    );
  });
}
