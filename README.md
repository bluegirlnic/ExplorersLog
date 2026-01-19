# Explorer's Log

A personal goal tracking application that frames life goals as expeditions and discoveries rather than tasks. Built with React, TypeScript, and Tailwind CSS.

## Philosophy

- Goals are explorations, not obligations
- Progress isn't linear - some days are stormy, some are clear
- Rest and basecamp operations are legitimate phases of any expedition
- Insights and learning matter as much as completion
- The six elements framework (vitality, connections, achievement, intellectual engagement, dialogue, provision) underpins everything

## Features

### Quest Types

1. **Summit Attempts** - Big, challenging goals with waypoints
2. **Daily Expeditions** - Regular practices with streak tracking
3. **Reconnaissance** - Low-pressure exploration without failure states
4. **Basecamp Operations** - Essential maintenance activities

### Core Functionality

- **Weather System** - Track your daily capacity and energy levels
- **Discovery Log** - Capture insights, learnings, and observations
- **Quotes System** - Motivational quotes that resonate with the expedition theme
- **Progress Tracking** - Visual waypoints and streaks
- **Data Export** - Own your data with JSON export

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

The app will be available at \`http://localhost:5173\`

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Zustand** for state management
- **React Router** for navigation
- **Lucide React** for icons
- **date-fns** for date handling
- **Framer Motion** for animations

## Project Structure

\`\`\`
src/
├── components/       # Reusable UI components
│   ├── common/      # Buttons, cards, etc.
│   ├── layout/      # Navigation, layout
│   ├── quest/       # Quest-specific components
│   ├── discovery/   # Discovery components
│   └── visualizations/ # Progress trails, charts
├── features/        # Feature modules
│   ├── quests/      # Quest management
│   ├── weather/     # Weather system
│   ├── discoveries/ # Discovery log
│   └── territories/ # Territory overview
├── pages/           # Route pages
├── stores/          # Zustand state stores
├── types/           # TypeScript definitions
├── utils/           # Helper functions
└── data/            # Static data
\`\`\`

## Data Storage

All data is stored locally in your browser using localStorage via Zustand's persist middleware. Your data never leaves your device.

To backup your data:
1. Go to Settings
2. Click "Export Data"
3. Save the JSON file

## Design Principles

- Clean, minimal aesthetic inspired by topographic maps
- Muted, natural color palette (earth tones, forest greens, sky blues)
- Mobile-first responsive design
- No infantilizing language or imagery
- No guilt-inducing metrics or false pressure
- Honest acknowledgment of capacity fluctuations

## Future Enhancements

- Advanced territory visualizations
- Pattern recognition and insights
- Calendar view
- Import/restore from backup
- Voice-to-text for discoveries
- Seasonal focus areas

## License

MIT

## Acknowledgments

Built with care for authentic personal growth tracking.
