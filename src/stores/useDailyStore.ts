import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyEntry, WeatherState, Weather } from '../types';

interface DailyStore {
  dailyEntries: DailyEntry[];
  currentWeather: WeatherState;

  // Weather
  setWeather: (weather: Weather, energyLevel: number, notes?: string) => void;
  getCurrentWeather: () => WeatherState;

  // Daily Entry CRUD
  getTodayEntry: () => DailyEntry | undefined;
  getEntryByDate: (date: string) => DailyEntry | undefined;
  createOrUpdateTodayEntry: (updates: Partial<DailyEntry>) => void;
  addQuestToToday: (questId: string) => void;
  addDiscoveryToToday: (discoveryId: string) => void;

  // Queries
  getEntriesInRange: (startDate: string, endDate: string) => DailyEntry[];
  getWeatherHistory: (days: number) => { date: string; weather: Weather; energy: number }[];
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useDailyStore = create<DailyStore>()(
  persist(
    (set, get) => ({
      dailyEntries: [],
      currentWeather: {
        current: 'sunny',
        energyLevel: 7,
      },

      setWeather: (weather: Weather, energyLevel: number, notes?: string) => {
        const newWeather: WeatherState = {
          current: weather,
          energyLevel,
          notes,
        };

        set({ currentWeather: newWeather });

        // Also update today's entry
        const today = getTodayDateString();
        const existingEntry = get().getEntryByDate(today);

        if (existingEntry) {
          set((state) => ({
            dailyEntries: state.dailyEntries.map((entry) =>
              entry.date === today ? { ...entry, weather: newWeather } : entry
            ),
          }));
        } else {
          const newEntry: DailyEntry = {
            date: today,
            weather: newWeather,
            completedQuests: [],
            discoveries: [],
          };
          set((state) => ({
            dailyEntries: [newEntry, ...state.dailyEntries],
          }));
        }
      },

      getCurrentWeather: () => {
        return get().currentWeather;
      },

      getTodayEntry: () => {
        const today = getTodayDateString();
        return get().dailyEntries.find((entry) => entry.date === today);
      },

      getEntryByDate: (date: string) => {
        return get().dailyEntries.find((entry) => entry.date === date);
      },

      createOrUpdateTodayEntry: (updates: Partial<DailyEntry>) => {
        const today = getTodayDateString();
        const existingEntry = get().getEntryByDate(today);

        if (existingEntry) {
          set((state) => ({
            dailyEntries: state.dailyEntries.map((entry) =>
              entry.date === today ? { ...entry, ...updates } : entry
            ),
          }));
        } else {
          const newEntry: DailyEntry = {
            date: today,
            weather: get().currentWeather,
            completedQuests: [],
            discoveries: [],
            ...updates,
          };
          set((state) => ({
            dailyEntries: [newEntry, ...state.dailyEntries],
          }));
        }
      },

      addQuestToToday: (questId: string) => {
        const today = getTodayDateString();
        const existingEntry = get().getEntryByDate(today);

        if (existingEntry) {
          if (!existingEntry.completedQuests.includes(questId)) {
            set((state) => ({
              dailyEntries: state.dailyEntries.map((entry) =>
                entry.date === today
                  ? {
                      ...entry,
                      completedQuests: [...entry.completedQuests, questId],
                    }
                  : entry
              ),
            }));
          }
        } else {
          const newEntry: DailyEntry = {
            date: today,
            weather: get().currentWeather,
            completedQuests: [questId],
            discoveries: [],
          };
          set((state) => ({
            dailyEntries: [newEntry, ...state.dailyEntries],
          }));
        }
      },

      addDiscoveryToToday: (discoveryId: string) => {
        const today = getTodayDateString();
        const existingEntry = get().getEntryByDate(today);

        if (existingEntry) {
          if (!existingEntry.discoveries.includes(discoveryId)) {
            set((state) => ({
              dailyEntries: state.dailyEntries.map((entry) =>
                entry.date === today
                  ? {
                      ...entry,
                      discoveries: [...entry.discoveries, discoveryId],
                    }
                  : entry
              ),
            }));
          }
        } else {
          const newEntry: DailyEntry = {
            date: today,
            weather: get().currentWeather,
            completedQuests: [],
            discoveries: [discoveryId],
          };
          set((state) => ({
            dailyEntries: [newEntry, ...state.dailyEntries],
          }));
        }
      },

      getEntriesInRange: (startDate: string, endDate: string) => {
        return get().dailyEntries.filter((entry) => {
          return entry.date >= startDate && entry.date <= endDate;
        });
      },

      getWeatherHistory: (days: number) => {
        const entries = get().dailyEntries.slice(0, days);
        return entries.map((entry) => ({
          date: entry.date,
          weather: entry.weather.current,
          energy: entry.weather.energyLevel,
        }));
      },
    }),
    {
      name: 'explorer-log-daily',
    }
  )
);
