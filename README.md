# voder.ai

## Project Overview
A minimalist, single-page pre-launch site signaling a new paradigm: “The Compiler for Prompts.”

## Tech Stack
- Vite (ESM)
- Plain HTML, CSS, and JavaScript
- Playwright for end-to-end tests

## Setup & Development
1. Install dependencies  
   npm install
2. Start development server  
   npm run dev

## Build & Preview
1. Build for production  
   npm run build
2. Preview the production build  
   npm run preview -- --port=4173

## Tests
Run end-to-end tests with Playwright:  
npm run test:e2e

## Directory Structure
.  
├── package.json  
├── vite.config.js  
├── README.md  
├── src/          # source files (HTML, CSS, JS)  
├── tests/        # Playwright test specs  
├── dist/         # production build output  
└── test-results/ # E2E test reports