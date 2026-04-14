# Allos Parakletos - Bible Learning Platform

A Duolingo-style Bible learning web application built with React, TypeScript, Vite, and the Bible API. Features include reading plans, quizzes, children's content, study materials, sermon planning, prayer points, and an AI-powered Bible assistant.

## 🎨 Design System

This app follows the "Sacred Playful" design system with:
- **Organic layering** with soft, breathing colors
- **No-line design rule** - boundaries created through colors, not borders
- **Glass and gradient effects** for depth and elevation
- **Gamification elements** with XP, streaks, and levels
- **Typography**: Plus Jakarta Sans (headlines), Be Vietnam Pro (body)

### Color Palette
- **Surface**: `#e4ffce` - Main background
- **Primary**: `#006093` - "Heavenly Blue"
- **Primary Container**: `#32abfa` - Light blue accents
- **Secondary Container**: `#ffd709` - "Graceful Gold"
- **Tertiary**: `#6bfe9c` - "Spiritual Green"

## ✨ Features

- 📖 **Bible Reader** - Read any book with multiple version support
- 📅 **Reading Plans** - Structured Bible reading schedules
- 🎯 **Quizzes** - Interactive Bible knowledge tests with XP rewards
- 👶 **Children's Zone** - Fun, age-appropriate Bible activities
- 📚 **Study Materials** - In-depth theological resources
- 🎤 **Sermons** - Curated messages and teachings
- 🙏 **Prayer Points** - Daily intercession guides
- 🤖 **Bible Assistant** - AI-powered chat for Bible questions
- 👤 **User Profile** - Track progress, levels, and streaks
- 🎮 **Gamification** - XP, levels, streaks, and achievements

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. The `.env` file is pre-configured with:
```
VITE_BIBLE_API_KEY=1vAn6rhCOeXENEvuepR02
VITE_BIBLE_API_BASE_URL=https://rest.api.bible
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Bible Assistant Backend (Express + Embeddings)

The Bible Assistant now has a real backend service using:
- Express (Node)
- Local embeddings model: `all-MiniLM-L6-v2` via `@xenova/transformers`
- Primary source: `api.bible`
- Automatic backup source: `wldeh/bible-api` (free)

Run the backend in a second terminal:
```bash
npm run dev:assistant
```

Backend health check:
```bash
http://localhost:8787/health
```

Required env values:
```env
VITE_BIBLE_API_KEY=...
VITE_BIBLE_API_BASE_URL=https://rest.api.bible
VITE_ASSISTANT_API_URL=http://localhost:8787
ASSISTANT_PORT=8787
```

### Build

Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with header & nav
│   ├── Header.tsx      # Top navigation bar
│   ├── Navigation.tsx   # Bottom nav bar
│   ├── Button.tsx      # Styled button component
│   ├── Card.tsx        # Card component
│   ├── VerseDisplay.tsx # Bible verse display
│   ├── ExperienceBar.tsx # Gamification XP bar
│   └── StreakBadge.tsx # Streak counter
├── pages/              # Page components
│   ├── Home.tsx        # Dashboard
│   ├── BibleReader.tsx # Scripture reading
│   ├── ReadingPlans.tsx # Reading schedules
│   ├── Quizzes.tsx     # Quiz interface
│   ├── ChildrenZone.tsx # Kids activities
│   ├── StudyMaterials.tsx # Study resources
│   ├── SermonPlanner.tsx # Sermons & teachings
│   ├── PrayerPoints.tsx # Prayer guides
│   ├── BibleAssistant.tsx # AI chat assistant
│   └── Profile.tsx     # User profile
├── services/           # API services
│   └── bibleService.ts # Bible API integration
├── store/              # State management (Zustand)
│   └── index.ts        # Global app store
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── utils/              # Utility functions (expand as needed)
├── hooks/              # Custom React hooks (expand as needed)
├── App.tsx             # Main app with routing
├── main.tsx            # React entry point
└── index.css           # Global styles & design tokens

```

## 🔧 Technologies

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API**: Bible API (rest.api.bible)

## 📖 Bible API Integration

The app uses the **Bible API** (https://api.bible) for Scripture content:

- Get all Bible versions
- Fetch books and chapters
- Retrieve verses with multiple translations
- Search functionality
- Support for multiple languages

Example API endpoints being used:
```
GET /v1/bibles                              - List versions
GET /v1/bibles/{bibleId}/books              - Get books
GET /v1/bibles/{bibleId}/chapters/{id}      - Get chapter content
GET /v1/bibles/{bibleId}/verses/{id}        - Get specific verse
GET /v1/bibles/{bibleId}/search?query=...   - Search verses
```

## 🎯 Next Steps & Enhancements

### Immediate Tasks
- [ ] Connect quiz functionality to backend
- [ ] Implement user authentication (Firebase/Auth0)
- [ ] Build actual verse search and reading interface
- [ ] Create sermon PDF download functionality
- [ ] Implement prayer point generation with AI

### Backend Integration
- [ ] User auth & profile persistence
- [ ] Save reading plans and progress
- [ ] Store quiz results and scores
- [ ] Prayer points generation API
- [ ] Sermon content management

### Advanced Features
- [ ] AI-powered Bible Assistant using OpenAI/Claude
- [ ] Voice-to-text Bible search
- [ ] Offline Bible content support
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Social features (share, community)
- [ ] Mobile app (React Native)

## 📝 Notes

- The design system strictly follows the "Sacred Playful" guidelines
- All components use the Sacred Playful color palette
- No sharp corners (minimum 0.5rem radius)
- No 1px solid borders - use color shifts instead
- Animations use natural, playful transitions

## 🤝 Contributing

Feel free to expand the features and customize according to your needs!

## 📄 License

This project is part of the Allos Parakletos initiative.

---

**Happy coding! May this platform help many discover and understand God's Word! 🙏**
