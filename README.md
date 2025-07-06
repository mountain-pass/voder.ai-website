# voder.ai Pre-Launch Website

A minimalist, single-page, pre-launch site designed to spark intrigue around Voder’s revolutionary approach to software creation and delivery.

[![CI & Playwright multi-browser tests passing](https://github.com/mountain-pass/voder.ai-website/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mountain-pass/voder.ai-website/actions)

## Prerequisites

- Node.js ≥ 18  
- npm ≥ 8  
- Running `npm run test:ci` (or `npx playwright install --with-deps`) will automatically download and install the Playwright browser binaries required for cross-browser end-to-end tests.  
- GitHub Actions now caches Playwright browser binaries between runs, speeding up CI.  

## Installation

```bash
git clone https://github.com/mountain-pass/voder.ai-website.git
cd voder.ai-website
npm ci
```

## Available Scripts

- `npm run dev`  
  Starts the development server with hot reload (http://localhost:5173).  
- `npm run build`  
  Bundles the app for production into `dist/`.  
- `npm run preview`  
  Serves the production build locally for testing.  
- `npm run test:e2e`  
  Runs end-to-end tests with Playwright:  
  - Includes navigation tests for keyboard controls (Arrow keys) and deep-linking via URL hash.  
  - Verifies slide transitions, URL hashes, and the “present” slide selection.  
- `npm run test:ci`  
  Builds, previews, and runs CI tests (used in GitHub Actions).

## Test Artifacts

After running end-to-end tests, all screenshots, videos, traces, logs, and test result summaries are generated in the `outputs/` directory.

## Project Structure

```
.
├── outputs             # Generated artifacts: screenshots, videos, traces, logs
├── public
│   └── assets           # Static assets (images, icons, etc.)
├── src                  # Application entry point, styles, and markup
├── tests                # Playwright end-to-end test suites
├── docs
│   └── decisions        # Architectural Decision Records (MADR format)
├── dist                 # Production build output
├── .github
│   └── workflows        # CI workflows
├── vite.config.js       # Vite configuration
├── playwright.config.js # Playwright configuration
├── package.json
└── README.md
```

## Architectural Decision Records

- ADR 0001: Use Vite — accepted  
- ADR 0002: Use Playwright — accepted  
- ADR 0003: Cache Playwright browser binaries — accepted  
- ADR 0004: Use Reveal.js for the Pre-launch Deck — deprecated  

## Styling & Animations

• Accent color  
  • CSS variable: `--color-accent`  
  • Value: `#4f46e5`

• Enabled animations  
  • `.fade-in` – content fade-in on load  
  • `.typing-animation` – typewriter text effect

## BrandEntry Demo

To preview the new 3D rotating hexagon component:

1. Start the development server:
   ```bash
   npm run dev
   ```
2. In your browser, navigate to http://localhost:5173/brandentry

This will display the live BrandEntry demo with the rotating hexagon.