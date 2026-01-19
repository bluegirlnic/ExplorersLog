import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Discovery, CreateDiscoveryInput, DiscoveryType } from '../types';

interface DiscoveryStore {
  discoveries: Discovery[];

  // Discovery CRUD
  addDiscovery: (discovery: CreateDiscoveryInput) => Discovery;
  updateDiscovery: (id: string, updates: Partial<Discovery>) => void;
  deleteDiscovery: (id: string) => void;
  getDiscovery: (id: string) => Discovery | undefined;

  // Queries
  getDiscoveriesByQuest: (questId: string) => Discovery[];
  getDiscoveriesByType: (type: DiscoveryType) => Discovery[];
  getDiscoveriesByTag: (tag: string) => Discovery[];
  getRecentDiscoveries: (limit?: number) => Discovery[];
  searchDiscoveries: (query: string) => Discovery[];
}

export const useDiscoveryStore = create<DiscoveryStore>()(
  persist(
    (set, get) => ({
      discoveries: [],

      addDiscovery: (discoveryInput: CreateDiscoveryInput) => {
        const newDiscovery: Discovery = {
          ...discoveryInput,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          discoveries: [newDiscovery, ...state.discoveries],
        }));

        return newDiscovery;
      },

      updateDiscovery: (id: string, updates: Partial<Discovery>) => {
        set((state) => ({
          discoveries: state.discoveries.map((discovery) =>
            discovery.id === id ? { ...discovery, ...updates } : discovery
          ),
        }));
      },

      deleteDiscovery: (id: string) => {
        set((state) => ({
          discoveries: state.discoveries.filter((discovery) => discovery.id !== id),
        }));
      },

      getDiscovery: (id: string) => {
        return get().discoveries.find((discovery) => discovery.id === id);
      },

      getDiscoveriesByQuest: (questId: string) => {
        return get().discoveries.filter((discovery) =>
          discovery.relatedQuests.includes(questId)
        );
      },

      getDiscoveriesByType: (type: DiscoveryType) => {
        return get().discoveries.filter((discovery) => discovery.type === type);
      },

      getDiscoveriesByTag: (tag: string) => {
        return get().discoveries.filter((discovery) => discovery.tags.includes(tag));
      },

      getRecentDiscoveries: (limit: number = 10) => {
        return get()
          .discoveries.slice(0, limit);
      },

      searchDiscoveries: (query: string) => {
        const lowerQuery = query.toLowerCase();
        return get().discoveries.filter(
          (discovery) =>
            discovery.content.toLowerCase().includes(lowerQuery) ||
            discovery.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'explorer-log-discoveries',
    }
  )
);
