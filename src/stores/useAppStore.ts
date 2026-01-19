import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote, UserPreferences } from '../types';

interface AppStore {
  quotes: Quote[];
  preferences: UserPreferences;

  // Quotes
  addQuote: (quote: Omit<Quote, 'id' | 'isUserAdded'>) => void;
  deleteQuote: (id: string) => void;
  getRandomQuote: (tags?: string[]) => Quote | undefined;
  getAllQuotes: () => Quote[];

  // Preferences
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

// Built-in quotes from the brief
const defaultQuotes: Quote[] = [
  {
    id: 'default-1',
    text: 'Pain is inevitable. Suffering is optional.',
    author: 'Haruki Murakami',
    source: 'What I Talk About When I Talk About Running',
    tags: ['resilience', 'perspective'],
    isUserAdded: false,
  },
  {
    id: 'default-2',
    text: "You don't need perfect clarity to see the shape of things.",
    tags: ['uncertainty', 'action'],
    isUserAdded: false,
  },
  {
    id: 'default-3',
    text: 'Rest is not idleness, and to lie sometimes on the grass under trees on a summer\'s day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time.',
    author: 'John Lubbock',
    tags: ['rest', 'basecamp'],
    isUserAdded: false,
  },
  {
    id: 'default-4',
    text: 'The summit is what drives us, but the climb itself is what matters.',
    author: 'Conrad Anker',
    tags: ['journey', 'summit'],
    isUserAdded: false,
  },
  {
    id: 'default-5',
    text: "It's not the mountain we conquer, but ourselves.",
    author: 'Sir Edmund Hillary',
    tags: ['growth', 'summit'],
    isUserAdded: false,
  },
];

const defaultPreferences: UserPreferences = {
  defaultView: 'dashboard',
  theme: 'light',
  notifications: false,
  weekStartsOn: 1, // Monday
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      quotes: defaultQuotes,
      preferences: defaultPreferences,

      addQuote: (quoteInput: Omit<Quote, 'id' | 'isUserAdded'>) => {
        const newQuote: Quote = {
          ...quoteInput,
          id: crypto.randomUUID(),
          isUserAdded: true,
        };

        set((state) => ({
          quotes: [...state.quotes, newQuote],
        }));
      },

      deleteQuote: (id: string) => {
        // Only allow deletion of user-added quotes
        const quote = get().quotes.find((q) => q.id === id);
        if (quote?.isUserAdded) {
          set((state) => ({
            quotes: state.quotes.filter((q) => q.id !== id),
          }));
        }
      },

      getRandomQuote: (tags?: string[]) => {
        const quotes = get().quotes;
        let filteredQuotes = quotes;

        if (tags && tags.length > 0) {
          filteredQuotes = quotes.filter((quote) =>
            quote.tags?.some((tag) => tags.includes(tag))
          );
        }

        if (filteredQuotes.length === 0) return undefined;

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        return filteredQuotes[randomIndex];
      },

      getAllQuotes: () => {
        return get().quotes;
      },

      updatePreferences: (updates: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },
    }),
    {
      name: 'explorer-log-app',
    }
  )
);
