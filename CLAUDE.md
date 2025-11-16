# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with React, showcasing projects, experience, and technical skills. The frontend fetches data from a separate backend API hosted on Vercel.

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **UI Libraries**: Material-UI, React Icons
- **Routing**: React Router v6
- **Animations**: React Transition Group, react-vertical-timeline-component
- **Styling**: CSS modules (one CSS file per component/page)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics and Speed Insights

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Run tests
npm test

# Create production build
npm build

# Eject from Create React App (irreversible)
npm run eject
```

## Architecture

### Project Structure

```
src/
├── App.js              # Main app component with routing
├── index.js            # React entry point
├── components/         # Reusable UI components
├── pages/              # Route-level page components
├── styles/             # CSS modules (one per component/page)
└── assets/             # Static files (cv, images)
```

### Routing Architecture

The app uses React Router v6 with page transitions via `react-transition-group`:
- `/` - Home page with technologies section
- `/about` - About page
- `/projects` - Projects gallery with modal details
- `/experience` - Timeline of work/education experience
- `/cv` - CV/resume page

All routes are wrapped in a `<TransitionGroup>` with 500ms CSS transitions.

### Data Fetching Pattern

Pages fetch data from a backend API using the Fetch API:
- API URL is configured via `REACT_APP_API_URL` environment variable
- All data fetching happens in `useEffect` hooks
- Standard pattern: loading state → fetch → error handling → display
- API endpoints:
  - `/technologies` - Returns technologies list
  - `/projects` - Returns projects with images, descriptions, responsibilities
  - `/experience` - Returns work/education timeline items

### API Integration

The frontend connects to a separate backend via Vercel rewrites (see `vercel.json`):
- All `/api/*` requests are proxied to `https://portfolio-backend-lilac.vercel.app/api/*`
- Backend URL should not be hardcoded in components; use `REACT_APP_API_URL` env var

### Component Patterns

1. **Page Components** (`src/pages/`):
   - Fetch data from API
   - Manage loading/error states
   - Compose smaller components
   - Import corresponding CSS from `src/styles/`

2. **Reusable Components** (`src/components/`):
   - Presentational, receive props
   - Self-contained with their own styles
   - Examples: `Modal`, `ProjectItem`, `Navbar`, `Footer`

3. **Styling Convention**:
   - One CSS file per component/page in `src/styles/`
   - CSS imports at top of component: `import "../styles/ComponentName.css"`
   - Class names match component/page names

### Modal System

Projects use a modal overlay pattern:
- Click on `ProjectItem` to open modal
- Modal displays image carousel (with optional video), description, technologies (as icons), and responsibilities
- Technology icons are mapped dynamically using `getIconComponent()` function
- Modal manages its own open/close animation states

### Icon Mapping

Technologies are displayed as icons using a mapping system:
- Home page maps backend technology names to React Icons
- Modal component has similar mapping for project technologies
- Fallback to default icon if technology name not found

## Environment Variables

Required for development:
```
REACT_APP_API_URL=<backend_api_url>
```

## Deployment

- Built with Create React App
- Deployed on Vercel
- API requests proxied via `vercel.json` rewrites
- Includes Vercel Analytics and Speed Insights

## Testing

- Testing library: Jest (via Create React App)
- Run with: `npm test`
- Test files use `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
