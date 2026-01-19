// Quest Types
export type QuestType = 'summit' | 'expedition' | 'reconnaissance' | 'basecamp';

export type QuestStatus = 'active' | 'on-ice' | 'completed' | 'archived';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

// Framework Elements (Six Elements)
export type FrameworkElement =
  | 'vitality'           // Physical health, energy, movement
  | 'connections'        // Relationships, community
  | 'achievement'        // Goals, accomplishments
  | 'intellectual'       // Learning, growth, curiosity
  | 'dialogue'          // Self-reflection, internal conversation
  | 'provision';        // Resources, finances, preparation

// Weather System
export type Weather = 'sunny' | 'cloudy' | 'stormy' | 'foggy';

export interface WeatherState {
  current: Weather;
  energyLevel: number; // 1-10
  notes?: string;
}

// Waypoint (for Summit Attempts)
export interface Waypoint {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  order: number;
}

// Quest
export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  difficulty: Difficulty;
  frameworkElements: FrameworkElement[];
  status: QuestStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // Type-specific fields
  waypoints?: Waypoint[];           // For summit attempts
  progress?: number;                 // For summit attempts (0-100)
  frequency?: 'daily' | 'weekly' | 'custom';  // For daily expeditions
  streak?: number;                   // For daily expeditions
  lastCompletedDate?: string;        // For daily expeditions
  discoveries?: string[];            // Related discovery IDs

  // Metadata
  tags?: string[];
  color?: string;                    // For visual organization
  onIceReason?: string;             // Why it's paused
}

// Discovery
export type DiscoveryType = 'insight' | 'learning' | 'connection' | 'observation';

export interface Discovery {
  id: string;
  timestamp: string;
  content: string;
  type: DiscoveryType;
  tags: string[];
  relatedQuests: string[];          // Quest IDs
  frameworkElements?: FrameworkElement[];
  attachments?: {
    type: 'link' | 'quote' | 'voice-note';
    content: string;
  }[];
}

// Daily Entry
export interface DailyEntry {
  date: string;                      // ISO date string (YYYY-MM-DD)
  weather: WeatherState;
  completedQuests: string[];         // Quest IDs
  discoveries: string[];             // Discovery IDs
  reflectionNotes?: string;
  energyLog?: {
    morning?: number;
    afternoon?: number;
    evening?: number;
  };
}

// Quote
export interface Quote {
  id: string;
  text: string;
  author?: string;
  source?: string;
  tags?: string[];
  isUserAdded: boolean;
}

// User Preferences
export interface UserPreferences {
  displayName?: string;
  defaultView: 'dashboard' | 'quests' | 'discoveries';
  theme: 'light' | 'auto';
  notifications: boolean;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
}

// Store State Interfaces
export interface AppState {
  quests: Quest[];
  discoveries: Discovery[];
  dailyEntries: DailyEntry[];
  quotes: Quote[];
  preferences: UserPreferences;
  currentWeather: WeatherState;
}

// Helper type for quest creation
export type CreateQuestInput = Omit<Quest, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;

// Helper type for discovery creation
export type CreateDiscoveryInput = Omit<Discovery, 'id' | 'timestamp'>;
