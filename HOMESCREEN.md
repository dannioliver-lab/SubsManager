# Homescreen Layout Documentation

## Overview
This document describes the new homescreen layout for the SubsManager application, designed to provide an intuitive and accessible user experience.

## Features Implemented

### 1. Sticky Header
- **Component**: `src/components/Header/Header.tsx`
- **Behavior**: Header sticks to the top of the viewport on scroll
- **Features**:
  - Logo with brand name
  - Main navigation bar (Subscriptions, Analytics, Settings)
  - Theme toggle button for dark/light mode switching
  - Fully accessible with ARIA labels
  - Minimum touch target of 44px for all interactive elements

### 2. Theme Support (Dark & Light Mode)
- **Implementation**: `src/contexts/ThemeContext.tsx`
- **Features**:
  - Automatic detection of system preference
  - Persistent theme selection via localStorage
  - Smooth transitions between themes
  - CSS variables for consistent theming throughout the app
- **Color Scheme**:
  - Meets WCAG AA contrast standards
  - Optimized for readability in both modes

### 3. Quick Actions Widget
- **Component**: `src/components/QuickActions/QuickActions.tsx`
- **Features**:
  - Four primary actions: Add Subscription, View All, Analytics, Reminders
  - Icon-based visual indicators
  - Responsive grid layout
  - Hover effects with smooth transitions
  - Accessible with proper ARIA labels

### 4. Recent Activity Widget
- **Component**: `src/components/RecentActivity/RecentActivity.tsx`
- **Features**:
  - Displays recent subscription activities
  - Loading skeleton while data is being fetched
  - Empty state with call-to-action button when no data
  - Activity type indicators (payment, renewal, cancellation)
  - Timestamp display for each activity

### 5. Loading Skeletons
- **Component**: `src/components/LoadingSkeleton/LoadingSkeleton.tsx`
- **Features**:
  - Shimmer animation effect
  - Multiple variants (card, text, circle)
  - Indicates loading state to users
  - Accessible with ARIA status role

### 6. Responsive Design
- **Desktop** (1280px+): Full layout with side-by-side widgets
- **Tablet** (768px - 1024px): Stacked widgets with maintained spacing
- **Mobile** (< 768px): Single column layout, optimized touch targets
- **Small Mobile** (< 480px): Navigation hidden, simplified layout

### 7. Accessibility Features
- ✅ WCAG AA contrast standards met
- ✅ Minimum 44px touch targets for all interactive elements
- ✅ Proper ARIA labels and roles
- ✅ Semantic HTML (header, main, nav, article, section)
- ✅ Screen reader friendly
- ✅ Keyboard navigation support with visible focus indicators
- ✅ Reduced motion support for accessibility preferences

## Component Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.css
│   ├── QuickActions/
│   │   ├── QuickActions.tsx
│   │   └── QuickActions.css
│   ├── RecentActivity/
│   │   ├── RecentActivity.tsx
│   │   └── RecentActivity.css
│   └── LoadingSkeleton/
│       ├── LoadingSkeleton.tsx
│       └── LoadingSkeleton.css
├── contexts/
│   └── ThemeContext.tsx
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

## Technology Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with CSS Variables for theming
- **State Management**: React Context API (for theme)

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Design Decisions

1. **CSS Variables**: Used for theming to enable seamless dark/light mode switching
2. **Component Isolation**: Each component is self-contained with its own styles
3. **Accessibility First**: All interactive elements meet minimum size requirements
4. **Loading States**: Skeleton loaders provide visual feedback during data fetching
5. **Empty States**: Informative messages and CTAs when no data is available
6. **Responsive Grid**: Auto-fit grid layout adapts to available space

## Future Enhancements
- Add navigation to actual pages (currently using hash links)
- Connect to backend API for real subscription data
- Add animations for route transitions
- Implement settings page for profile management
- Add data visualization for analytics
- Implement notification system for reminders

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports prefers-color-scheme media query
- Supports prefers-reduced-motion for accessibility
