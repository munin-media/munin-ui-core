import { describe, it, expect } from 'vitest';
import {
  computeImportWizardState,
  getImportWizardAccessibility,
  getImportWizardStepAccessibility,
  validateImportWizardProps,
} from '../src/import-wizard.js';
import type { ImportWizardInput, ImportSource } from '../src/import-wizard.js';

const sources: ImportSource[] = [
  { id: 'trakt', name: 'Trakt', description: 'Import from Trakt.tv', acceptedFormats: ['json', 'csv'] },
  { id: 'letterboxd', name: 'Letterboxd', description: 'Import from Letterboxd', acceptedFormats: ['csv'] },
];

function makeInput(overrides: Partial<ImportWizardInput> = {}): ImportWizardInput {
  return {
    props: { availableSources: sources },
    currentStep: 0,
    selectedSourceId: null,
    hasFile: false,
    hasMappingConfirmed: false,
    ...overrides,
  };
}

describe('ImportWizard', () => {
  describe('computeImportWizardState', () => {
    it('starts at step 0 with validation error (no source selected)', () => {
      const state = computeImportWizardState(makeInput());
      expect(state.currentStep).toBe(0);
      expect(state.canProceed).toBe(false);
      expect(state.canGoBack).toBe(false);
      expect(state.validationErrors).toContain('Please select an import source');
    });

    it('allows proceeding when source is selected', () => {
      const state = computeImportWizardState(makeInput({ selectedSourceId: 'trakt' }));
      expect(state.canProceed).toBe(true);
      expect(state.validationErrors).toHaveLength(0);
      expect(state.selectedSource).not.toBeNull();
      expect(state.selectedSource!.id).toBe('trakt');
    });

    it('step 1 requires file', () => {
      const state = computeImportWizardState(makeInput({
        currentStep: 1,
        selectedSourceId: 'trakt',
        hasFile: false,
      }));
      expect(state.canProceed).toBe(false);
      expect(state.validationErrors).toContain('Please upload a file');
    });

    it('step 1 allows proceed with file', () => {
      const state = computeImportWizardState(makeInput({
        currentStep: 1,
        selectedSourceId: 'trakt',
        hasFile: true,
      }));
      expect(state.canProceed).toBe(true);
    });

    it('step 2 requires mapping confirmed', () => {
      const state = computeImportWizardState(makeInput({
        currentStep: 2,
        selectedSourceId: 'trakt',
        hasFile: true,
        hasMappingConfirmed: false,
      }));
      expect(state.canProceed).toBe(false);
    });

    it('step 3 (confirm) always valid', () => {
      const state = computeImportWizardState(makeInput({
        currentStep: 3,
        selectedSourceId: 'trakt',
        hasFile: true,
        hasMappingConfirmed: true,
      }));
      expect(state.canProceed).toBe(true);
      expect(state.canGoBack).toBe(true);
    });

    it('marks steps before current as completed', () => {
      const state = computeImportWizardState(makeInput({
        currentStep: 2,
        selectedSourceId: 'trakt',
        hasFile: true,
        hasMappingConfirmed: true,
      }));
      expect(state.steps[0]!.status).toBe('completed');
      expect(state.steps[1]!.status).toBe('completed');
      expect(state.steps[2]!.status).toBe('active');
      expect(state.steps[3]!.status).toBe('pending');
    });

    it('marks isComplete when past last step', () => {
      const state = computeImportWizardState(makeInput({
        currentStep: 4,
        selectedSourceId: 'trakt',
        hasFile: true,
        hasMappingConfirmed: true,
      }));
      expect(state.isComplete).toBe(true);
      expect(state.canProceed).toBe(false);
    });
  });

  describe('getImportWizardAccessibility', () => {
    it('describes current step', () => {
      const input = makeInput({ currentStep: 1, selectedSourceId: 'trakt' });
      const state = computeImportWizardState(input);
      const a11y = getImportWizardAccessibility(input, state);
      expect(a11y.role).toBe('form');
      expect(a11y.stepLabel).toContain('Step 2 of 4');
      expect(a11y.stepLabel).toContain('Upload File');
    });
  });

  describe('getImportWizardStepAccessibility', () => {
    it('marks current step', () => {
      const state = computeImportWizardState(makeInput({ selectedSourceId: 'trakt' }));
      const a11y = getImportWizardStepAccessibility(state.steps[0]!, 0);
      expect(a11y.current).toBe(true);
      expect(a11y.label).toContain('Select Source');
    });
  });

  describe('validateImportWizardProps', () => {
    it('accepts valid props', () => {
      expect(validateImportWizardProps({ availableSources: sources })).toBe(true);
    });

    it('rejects missing sources', () => {
      expect(validateImportWizardProps({})).toBe(false);
    });

    it('rejects invalid source structure', () => {
      expect(validateImportWizardProps({
        availableSources: [{ id: 'x' }],
      })).toBe(false);
    });
  });
});
