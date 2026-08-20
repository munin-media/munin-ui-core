/**
 * Shared types for @munin-media/ui-core component contracts.
 * Platform-agnostic accessibility roles and attributes.
 */

/** Platform-agnostic accessibility roles */
export type AccessibilityRole =
  | 'progressbar'
  | 'slider'
  | 'button'
  | 'list'
  | 'listitem'
  | 'group'
  | 'grid'
  | 'gridcell'
  | 'form'
  | 'radiogroup'
  | 'radio'
  | 'none';

/** Base accessibility interface all components extend */
export interface BaseAccessibility {
  role: AccessibilityRole;
  label: string;
}

/** Step state for multi-step flows */
export type StepStatus = 'pending' | 'active' | 'completed' | 'error';
