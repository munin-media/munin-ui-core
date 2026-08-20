/**
 * CollectionList component contract.
 * Displays user-organized content groupings.
 */

import type { Collection } from '@munin-media/core';
import type { BaseAccessibility } from './types.js';

// --- Props ---

export interface CollectionListProps {
  /** User's collections */
  collections: Collection[];
  /** Called when a collection is selected */
  onSelect?: (collectionId: string) => void;
  /** Called when a collection should be deleted */
  onDelete?: (collectionId: string) => void;
  /** Message when list is empty */
  emptyMessage?: string;
}

// --- State ---

export interface CollectionListState {
  /** Display items for each collection */
  items: CollectionDisplayItem[];
  /** Whether the list is empty */
  isEmpty: boolean;
  /** Total count */
  totalCount: number;
}

export interface CollectionDisplayItem {
  collectionId: string;
  name: string;
  type: 'manual' | 'smart';
  itemCount: number;
  formattedCount: string;
}

// --- Accessibility ---

export interface CollectionListAccessibility extends BaseAccessibility {
  role: 'list';
  label: string;
  itemCount: number;
}

export interface CollectionItemAccessibility extends BaseAccessibility {
  role: 'listitem';
  label: string;
}

// --- Events ---

export interface CollectionListEvents {
  onSelect?: (collectionId: string) => void;
  onDelete?: (collectionId: string) => void;
  onCreate?: () => void;
}

// --- Computation ---

export function computeCollectionListState(props: CollectionListProps): CollectionListState {
  const items: CollectionDisplayItem[] = props.collections.map((col) => ({
    collectionId: col.collectionId,
    name: col.name,
    type: col.type,
    itemCount: col.items.length,
    formattedCount: `${col.items.length} item${col.items.length === 1 ? '' : 's'}`,
  }));

  return {
    items,
    isEmpty: items.length === 0,
    totalCount: items.length,
  };
}

export function getCollectionListAccessibility(
  _props: CollectionListProps,
  state: CollectionListState,
): CollectionListAccessibility {
  return {
    role: 'list',
    label: state.isEmpty
      ? 'No collections'
      : `Collections: ${state.totalCount} total`,
    itemCount: state.totalCount,
  };
}

export function getCollectionItemAccessibility(
  item: CollectionDisplayItem,
): CollectionItemAccessibility {
  return {
    role: 'listitem',
    label: `${item.name} (${item.type}): ${item.formattedCount}`,
  };
}

// --- Validation ---

export function validateCollectionListProps(props: unknown): props is CollectionListProps {
  if (typeof props !== 'object' || props === null) return false;
  const p = props as Record<string, unknown>;
  return Array.isArray(p['collections']);
}
