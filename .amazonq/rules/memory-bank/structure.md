# Project Structure & Architecture

## Directory Organization

### Core Application (`src/`)
```
src/
├── components/          # Reusable UI components organized by feature
├── contexts/           # React Context providers for state management
├── layouts/            # Layout wrapper components
├── pages/              # Route-based page components
├── lib/                # Utility libraries and configurations
├── utils/              # Helper functions and utilities
└── styles/             # Global styles and CSS modules
```

### Component Architecture
- **Feature-Based Organization**: Components grouped by functionality (admin, dashboard, academy, etc.)
- **UI Components**: Reusable design system components in `components/ui/`
- **Page Components**: Route-specific components in `pages/`
- **Layout Components**: Structural wrappers for consistent page layouts

### Key Directories Explained

#### `/components/`
- `admin/` - Administrative interface components
- `dashboard/` - User dashboard widgets and panels
- `academy/` - Course and learning-related components
- `consulting/` - Consultation booking and management
- `layout/` - Header, footer, and navigation components
- `ui/` - Reusable design system components

#### `/pages/`
- Main application routes and page-level components
- `dashboard/` - Protected dashboard pages
- Individual page components for each route

#### `/lib/`
- `supabase.js` - Database client configuration
- `validation.js` - Form validation utilities
- `lessonProgress.js` - Learning progress tracking
- `utils.js` - General utility functions

### Mobile Application (`android/`)
- **Capacitor Integration**: Native Android app wrapper
- **Gradle Build System**: Android-specific build configuration
- **Native Resources**: Icons, splash screens, and Android assets

### Build & Development (`dev-dist/`, `tools/`)
- **Service Worker**: PWA functionality and offline support
- **Build Tools**: Custom plugins and development utilities
- **Asset Generation**: Icon and resource generation scripts

### Database & Configuration
- **SQL Scripts**: Database setup and migration files
- **Configuration Files**: Vite, Tailwind, PostCSS, and Capacitor configs
- **Environment Setup**: Development and production configurations

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: React functional components with hooks
- **Context API**: Centralized state management for authentication and global state
- **Route-Based Code Splitting**: Organized by application routes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Data Flow
- **Supabase Integration**: Real-time database with authentication
- **Context Providers**: Global state management for user sessions
- **Local State**: Component-level state for UI interactions
- **Progress Tracking**: Persistent learning progress storage

### Security & Authentication
- **Supabase Auth**: Secure user authentication and session management
- **Role-Based Access**: Admin, consultant, and student user roles
- **Protected Routes**: Authentication-required page access
- **Data Validation**: Client and server-side input validation