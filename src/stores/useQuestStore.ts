import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quest, CreateQuestInput, Waypoint } from '../types';

interface QuestStore {
  quests: Quest[];

  // Quest CRUD
  addQuest: (quest: CreateQuestInput) => Quest;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  getQuest: (id: string) => Quest | undefined;
  getActiveQuests: () => Quest[];
  getQuestsByType: (type: Quest['type']) => Quest[];

  // Quest actions
  completeQuest: (id: string) => void;
  putQuestOnIce: (id: string, reason?: string) => void;
  reactivateQuest: (id: string) => void;

  // Waypoint management (for summit attempts)
  addWaypoint: (questId: string, waypoint: Omit<Waypoint, 'id'>) => void;
  completeWaypoint: (questId: string, waypointId: string) => void;
  updateWaypoint: (questId: string, waypointId: string, updates: Partial<Waypoint>) => void;

  // Daily expedition tracking
  logExpeditionCompletion: (questId: string) => void;
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      quests: [],

      addQuest: (questInput: CreateQuestInput) => {
        const newQuest: Quest = {
          ...questInput,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          quests: [...state.quests, newQuest],
        }));

        return newQuest;
      },

      updateQuest: (id: string, updates: Partial<Quest>) => {
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === id
              ? { ...quest, ...updates, updatedAt: new Date().toISOString() }
              : quest
          ),
        }));
      },

      deleteQuest: (id: string) => {
        set((state) => ({
          quests: state.quests.filter((quest) => quest.id !== id),
        }));
      },

      getQuest: (id: string) => {
        return get().quests.find((quest) => quest.id === id);
      },

      getActiveQuests: () => {
        return get().quests.filter((quest) => quest.status === 'active');
      },

      getQuestsByType: (type: Quest['type']) => {
        return get().quests.filter((quest) => quest.type === type);
      },

      completeQuest: (id: string) => {
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === id
              ? {
                  ...quest,
                  status: 'completed' as const,
                  completedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : quest
          ),
        }));
      },

      putQuestOnIce: (id: string, reason?: string) => {
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === id
              ? {
                  ...quest,
                  status: 'on-ice' as const,
                  onIceReason: reason,
                  updatedAt: new Date().toISOString(),
                }
              : quest
          ),
        }));
      },

      reactivateQuest: (id: string) => {
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === id
              ? {
                  ...quest,
                  status: 'active' as const,
                  onIceReason: undefined,
                  updatedAt: new Date().toISOString(),
                }
              : quest
          ),
        }));
      },

      addWaypoint: (questId: string, waypointInput: Omit<Waypoint, 'id'>) => {
        const quest = get().getQuest(questId);
        if (!quest || quest.type !== 'summit') return;

        const newWaypoint: Waypoint = {
          ...waypointInput,
          id: crypto.randomUUID(),
        };

        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  waypoints: [...(q.waypoints || []), newWaypoint],
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },

      completeWaypoint: (questId: string, waypointId: string) => {
        set((state) => ({
          quests: state.quests.map((quest) => {
            if (quest.id !== questId) return quest;

            const updatedWaypoints = quest.waypoints?.map((wp) =>
              wp.id === waypointId
                ? { ...wp, completed: true, completedAt: new Date().toISOString() }
                : wp
            );

            // Calculate progress based on completed waypoints
            const totalWaypoints = updatedWaypoints?.length || 0;
            const completedWaypoints = updatedWaypoints?.filter((wp) => wp.completed).length || 0;
            const progress = totalWaypoints > 0 ? (completedWaypoints / totalWaypoints) * 100 : 0;

            return {
              ...quest,
              waypoints: updatedWaypoints,
              progress,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      updateWaypoint: (questId: string, waypointId: string, updates: Partial<Waypoint>) => {
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === questId
              ? {
                  ...quest,
                  waypoints: quest.waypoints?.map((wp) =>
                    wp.id === waypointId ? { ...wp, ...updates } : wp
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : quest
          ),
        }));
      },

      logExpeditionCompletion: (questId: string) => {
        const quest = get().getQuest(questId);
        if (!quest || quest.type !== 'expedition') return;

        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = quest.lastCompletedDate?.split('T')[0];

        let newStreak = quest.streak || 0;

        // Only increment streak if last completion was yesterday
        if (lastCompleted) {
          const lastDate = new Date(lastCompleted);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            newStreak += 1;
          } else if (lastCompleted !== today) {
            // Reset streak if gap is more than one day
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  lastCompletedDate: new Date().toISOString(),
                  streak: newStreak,
                  updatedAt: new Date().toISOString(),
                }
              : q
          ),
        }));
      },
    }),
    {
      name: 'explorer-log-quests',
    }
  )
);
