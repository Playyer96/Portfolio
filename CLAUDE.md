# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for a game developer built with React, showcasing projects, experience, and technical skills. The frontend fetches data from a separate backend API hosted on Vercel. Focused on modern, refined UI/UX with smooth animations and mobile-first design.

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Animations**: Framer Motion (primary), React Transition Group, react-vertical-timeline-component
- **Routing**: React Router v6 with page transitions
- **Styling**: SCSS with modular architecture (one SCSS file per component/page)
- **UI Libraries**: React Icons (primary icon set), Material-UI
- **Deployment**: Vercel with Analytics and Speed Insights
- **SEO**: React Helmet Async for meta tag management

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

## SCSS Architecture

### File Organization
```
src/styles/scss/
├── index.scss                    # Main entry point, imports all
├── _variables.scss              # Colors, spacing, typography, z-index
├── _mixins.scss                 # Reusable utility mixins
├── _utilities.scss              # Utility classes
├── _base.scss                   # Base element styles
├── _animations.scss             # Keyframe animations
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _functions.scss
│   └── _animations.scss
```

### Key SCSS Features
- **CSS Variables**: All colors, spacing, typography in `_variables.scss`
- **Mixins**: `flex-center`, `flex-column`, `flex-between`, `text-gradient`, `glow`, `liquid-glass`, `respond-to` (breakpoints)
- **Responsive Design**: Mobile-first approach using `@include respond-to(md/lg/xl)` breakpoints
- **Color System**: Primary/secondary colors, gradients, glassmorphism effects
- **Spacing Scale**: `$spacing-xs` through `$spacing-5xl` for consistent whitespace

### Styling Patterns
- BEM naming convention: `.component__element--modifier`
- One SCSS file per component/page
- Import variables and mixins at top of each file
- Use CSS Grid and Flexbox for layouts (no floats)
- Modern animations use Framer Motion, not CSS keyframes

## Animation Architecture

### Framer Motion Usage
- **Motion components**: Use `<motion.div>`, `<motion.button>`, etc. for animated elements
- **Variants**: Define animation states as objects passed to `variants` prop
- **Common patterns**:
  ```jsx
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
  />
  ```

### Animation Components (`src/components/animations/`)
1. **FadeIn**: Fade in with optional direction (up/down/left/right)
2. **StaggerContainer**: Stagger animations for child elements
3. **SlideIn**: Slide animation with direction
4. **ScaleIn**: Scale animation with fade
5. **AnimatedText**: Character-by-character text animation

### Page Transitions
- Pages wrapped in `<PageTransition>` component
- Uses `react-transition-group` for 500ms route transitions
- Smooth fade in/out between routes

### Effects
- **ParticleBackground**: Decorative animated particles (configurable count)
- **ScrollAnimation**: Elements animate when scrolled into view

## Custom Hooks

- `useMousePosition`: Track mouse position for cursor effects
- `useParallax`: Parallax scroll effect on elements
- `useScrollAnimation`: Trigger animations on scroll into viewport

## SEO & Meta Tags

- Uses **React Helmet Async** for dynamic meta tag management
- **SEO component** (`src/components/SEO.js`) with props for:
  - `title`: Page title for browser tab and search results
  - `description`: Meta description
  - `keywords`: Meta keywords
  - `canonicalUrl`: Canonical URL to prevent duplicates
- Each page should include SEO component with relevant metadata
- Open Graph and Twitter Card tags recommended for social sharing

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
- Automatic deployments on merge to main branch

## Performance Considerations

- Lazy load images with proper sizing
- Use Vercel Speed Insights to monitor performance
- Framer Motion animations are GPU-accelerated (transform/opacity only)
- Minimize reflows: use `will-change` CSS sparingly
- Code splitting via React Router for page components

## Testing

- Testing library: Jest (via Create React App)
- Run with: `npm test`
- Test files use `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

## Current Design Direction (2026-04-12)

**Modern Tech Minimalism** - Refined dark theme focusing on:
- Compact, modern component design (no bulky elements)
- Typography-driven layouts
- Selective accent colors (not everything glowing)
- Smooth, purposeful animations
- Mobile-first responsive approach
- Auto-preview content (no unnecessary toggle buttons)
- Grid-based layouts for proper reflow and organization
