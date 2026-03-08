# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (http://localhost:4200)
ng serve

# Production build (output: dist/)
ng build

# Run unit tests (Vitest)
ng test
```

Angular CLI schematics are configured with `skipTests: true` and `style: scss` by default, so `ng generate component` will produce SCSS and no spec file.

## Architecture

This is an **Angular 21 standalone component app** — a Pinterest-like image-pinning UI (no real backend; all data is mock).

### Key technologies
- **PrimeNG** for UI components, themed via a custom `PinterestPreset` (`src/app/core/theme/pinterest.preset.ts`)
- **@ngx-translate** for i18n; translations live in `src/assets/i18n/{pt,en,es}.json`; default language is Portuguese (`pt`)
- **Angular Signals** used throughout services and components instead of RxJS subjects where possible
- Dark mode toggled by adding/removing `.dark` class on `<html>` (PrimeNG `darkModeSelector: '.dark'`)

### Structure

```
src/app/
  app.ts              # Root component (just <router-outlet>)
  app.config.ts       # Application providers (router, PrimeNG, translate, http)
  app.routes.ts       # Route definitions
  core/
    theme/            # PinterestPreset (PrimeNG theme tokens)
  shared/
    components/       # Reusable UI components
      layout/         # Main shell with top nav, search bar, theme/language toggles
      auth-layout/    # Shell for auth pages
      masonry-grid/   # Responsive CSS-columns pin grid (2–6 cols by breakpoint)
      pin-card/       # Individual pin tile
      infinite-scroll/# Scroll-based pagination trigger
      skeleton-loader/# Loading placeholders
      search-bar/     # Search input
      user-avatar/    # Avatar with fallback
      board-card/     # Board thumbnail tile
      follow-button/  # Follow/unfollow toggle
    services/         # Singleton services (providedIn: 'root')
      pin.service.ts      # Pin CRUD — returns mock Observables with delay()
      board.service.ts    # Board data
      user.service.ts     # User/follow state
      notification.service.ts
      theme.service.ts    # Signal-based dark/light, persisted in localStorage
      language.service.ts # Signal-based lang switching, persisted in localStorage
    interfaces/       # TypeScript interfaces: Pin, Board, User, Comment, Notification
    enums/            # Theme, Language enums
    mocks/            # Static mock data + generators
  domain/             # Feature areas, each with pages/ subdirectory
    home/             # Feed of pins via MasonryGrid + InfiniteScroll
    explore/          # Category browsing
    search/           # Query-filtered pins
    create/           # Pin creation form
    pin/              # Pin detail page with related pins and comments
    profile/          # User profile with pins and boards tabs
    board/            # Board detail with its pins
    notifications/    # Activity feed
    auth/             # login, register, forgot-password, reset-password, verify-email, verify-code
```

### Routing pattern
- All main pages nest under `LayoutComponent` (top nav included)
- Auth pages nest under `AuthLayoutComponent`
- All routes use lazy-loaded standalone components (`loadComponent`)
- Catch-all `**` redirects to `/home`

### Data flow
All services are mock-only — they return `of(mockData).pipe(delay(N))` Observables. There is no HTTP backend. When implementing real API calls, replace service methods with `HttpClient` calls; the `HttpClient` is already provided in `app.config.ts`.
