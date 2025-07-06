# voder.ai Pre-Launch Website

A minimalist, interactive pre-launch site designed to spark intrigue around Voder’s revolutionary approach to software creation and delivery.

[![CI & Playwright multi-browser tests passing](https://github.com/mountain-pass/voder.ai-website/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mountain-pass/voder.ai-website/actions)

## Prerequisites

- Node.js ≥ 18  
- npm ≥ 8  
- `npx playwright install --with-deps` to download required browser binaries for cross-browser end-to-end tests.  
- GitHub Actions caches Playwright browser binaries between runs, speeding up CI.

## Installation

```bash
git clone https://github.com/mountain-pass/voder.ai-website.git
cd voder.ai-website
npm ci
```

> Note: The `dev`, `build`, and `preview` scripts automatically run  
> `npm run sync` (i.e. `svelte-kit sync`) before invoking Vite.

## Available Scripts

> Each script wraps a sync step: it runs `npm run sync` (which calls  
> `svelte-kit sync`) before invoking Vite.

- `npm run dev`  
  Starts the development server with hot reload (http://localhost:5173)

- `npm run build`  
  Bundles the app for production into the `dist/` directory

- `npm run preview`  
  Serves the production build locally for testing on port 4173

- `npm run test:e2e`  
  Runs end-to-end tests and captures full-page screenshots into the `outputs/` directory

- `npm run test:ci`  
  Builds, previews, and runs CI tests (used in GitHub Actions)

## Test Artifacts

Playwright captures full-page screenshots on every run (`screenshot: 'on'`).  
Generated screenshots (and any videos) are stored in the `outputs/` directory at the project root.

## Project Structure

```
.
├── outputs             # Generated artifacts: screenshots, videos, traces, logs
├── public
│   └── assets          # Static assets (images, icons, etc.)
├── src                 # Application code: routes, components, styles
├── tests               # Playwright end-to-end test suites
├── docs
│   └── decisions       # Architectural Decision Records (MADR format)
├── dist                # Production build output
├── .github
│   └── workflows       # CI workflows
├── vite.config.js      # Vite configuration
├── playwright.config.js# Playwright configuration
├── package.json
└── README.md
```

## Architectural Decision Records

- ADR 0001: Use Vite — accepted  
- ADR 0002: Use Playwright — accepted  
- ADR 0003: Cache Playwright browser binaries — accepted  
- ADR 0004: Use Reveal.js for the Pre-launch Deck — deprecated  
- ADR 0005: Adopt Threlte and Three.js for 3D Scenes — accepted  

## Styling & Animations

- **Accent color**  
  - CSS variable: `--color-accent`  
  - Value: `#4f46e5`

- **Enabled animations**  
  - `.fade-in` – content fade-in on scroll  
  - `.typing-animation` – typewriter text effect

## BrandEntry Demo

To preview the rotating 3D hexagon component:

```bash
npm run dev
```

Then visit http://localhost:5173/brandentry to see the live BrandEntry demo.