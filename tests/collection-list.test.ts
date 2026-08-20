import { describe, it, expect } from 'vitest';
import {
  computeCollectionListState,
  getCollectionListAccessibility,
  getCollectionItemAccessibility,
  validateCollectionListProps,
} from '../src/collection-list.js';
import type { Collection } from '@munin-media/core';

function makeCollection(overrides: Partial<Collection> = {}): Collection {
  return {
    collectionId: 'col-1',
    userId: 'user-1',
    name: 'Favorites',
    type: 'manual',
    items: ['title-1', 'title-2', 'title-3'],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-08-16'),
    ...overrides,
  };
}

describe('CollectionList', () => {
  describe('computeCollectionListState', () => {
    it('maps collections to display items', () => {
      const collections = [
        makeCollection({ collectionId: 'c1', name: 'Favorites', items: ['a', 'b'] }),
        makeCollection({ collectionId: 'c2', name: 'Watch Later', type: 'smart', items: ['x'] }),
      ];
      const state = computeCollectionListState({ collections });
      expect(state.items).toHaveLength(2);
      expect(state.items[0]!.name).toBe('Favorites');
      expect(state.items[0]!.itemCount).toBe(2);
      expect(state.items[0]!.formattedCount).toBe('2 items');
      expect(state.items[1]!.type).toBe('smart');
      expect(state.items[1]!.formattedCount).toBe('1 item');
    });

    it('handles empty list', () => {
      const state = computeCollectionListState({ collections: [] });
      expect(state.isEmpty).toBe(true);
      expect(state.totalCount).toBe(0);
    });
  });

  describe('getCollectionListAccessibility', () => {
    it('reports total count', () => {
      const collections = [makeCollection(), makeCollection({ collectionId: 'c2' })];
      const props = { collections };
      const state = computeCollectionListState(props);
      const a11y = getCollectionListAccessibility(props, state);
      expect(a11y.role).toBe('list');
      expect(a11y.label).toContain('2 total');
    });

    it('handles empty state', () => {
      const props = { collections: [] as Collection[] };
      const state = computeCollectionListState(props);
      const a11y = getCollectionListAccessibility(props, state);
      expect(a11y.label).toContain('No collections');
    });
  });

  describe('getCollectionItemAccessibility', () => {
    it('returns descriptive label', () => {
      const item = {
        collectionId: 'c1',
        name: 'Horror',
        type: 'smart' as const,
        itemCount: 5,
        formattedCount: '5 items',
      };
      const a11y = getCollectionItemAccessibility(item);
      expect(a11y.role).toBe('listitem');
      expect(a11y.label).toContain('Horror');
      expect(a11y.label).toContain('smart');
      expect(a11y.label).toContain('5 items');
    });
  });

  describe('validateCollectionListProps', () => {
    it('accepts valid props', () => {
      expect(validateCollectionListProps({ collections: [] })).toBe(true);
    });

    it('rejects non-array', () => {
      expect(validateCollectionListProps({ collections: 'nope' })).toBe(false);
    });
  });
});
