import type { Weather, QuestType, FrameworkElement } from '../types';

export const WEATHER_CONFIG: Record<
  Weather,
  { label: string; description: string; icon: string; color: string }
> = {
  sunny: {
    label: 'Sunny',
    description: 'High energy, clear focus',
    icon: '☀️',
    color: 'text-sky-500',
  },
  cloudy: {
    label: 'Cloudy',
    description: 'Moderate energy, some uncertainty',
    icon: '⛅',
    color: 'text-sky-400',
  },
  foggy: {
    label: 'Foggy',
    description: 'Low clarity, need for rest',
    icon: '🌫️',
    color: 'text-trail-400',
  },
  stormy: {
    label: 'Stormy',
    description: 'Difficult day, survival mode',
    icon: '⛈️',
    color: 'text-trail-600',
  },
};

export const QUEST_TYPE_CONFIG: Record<
  QuestType,
  { label: string; description: string; icon: string; color: string }
> = {
  summit: {
    label: 'Summit Attempt',
    description: 'Big, challenging goal with waypoints',
    icon: '🏔️',
    color: 'text-forest-600',
  },
  expedition: {
    label: 'Daily Expedition',
    description: 'Regular practice that builds over time',
    icon: '🥾',
    color: 'text-sky-600',
  },
  reconnaissance: {
    label: 'Reconnaissance',
    description: 'Low-pressure exploration and learning',
    icon: '🧭',
    color: 'text-trail-600',
  },
  basecamp: {
    label: 'Basecamp Operations',
    description: 'Provision and maintenance activities',
    icon: '⛺',
    color: 'text-earth-600',
  },
};

export const FRAMEWORK_ELEMENTS_CONFIG: Record<
  FrameworkElement,
  { label: string; description: string; icon: string; color: string }
> = {
  vitality: {
    label: 'Vitality',
    description: 'Physical health, energy, movement',
    icon: '💪',
    color: 'text-green-600',
  },
  connections: {
    label: 'Connections',
    description: 'Relationships, community',
    icon: '🤝',
    color: 'text-blue-600',
  },
  achievement: {
    label: 'Achievement',
    description: 'Goals, accomplishments',
    icon: '🎯',
    color: 'text-purple-600',
  },
  intellectual: {
    label: 'Intellectual',
    description: 'Learning, growth, curiosity',
    icon: '📚',
    color: 'text-amber-600',
  },
  dialogue: {
    label: 'Dialogue',
    description: 'Self-reflection, internal conversation',
    icon: '💭',
    color: 'text-pink-600',
  },
  provision: {
    label: 'Provision',
    description: 'Resources, finances, preparation',
    icon: '🏪',
    color: 'text-orange-600',
  },
};

export const DIFFICULTY_LABELS = {
  1: 'Easy Trail',
  2: 'Moderate',
  3: 'Challenging',
  4: 'Difficult',
  5: 'Expert',
} as const;
