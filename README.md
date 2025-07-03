# voder.ai

![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg?branch=main)

## Continuous Integration

All pushes and pull requests targeting the `main` branch trigger our GitHub Actions workflow defined in `.github/workflows/ci.yml`.  
The CI pipeline runs linting, builds the project, and executes unit and integration tests to ensure that every change remains stable.

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

Run `npm run test:ci` to build the site, start a preview server, and execute end-to-end tests in one command.

## Tests

- npm run test:ci – Builds the site, starts a preview server on port 4173, waits for it to respond, then runs the Playwright end-to-end tests.

## Directory Structure

.  
├── package.json  
├── vite.config.js  
├── README.md  
├── src/          # source files (HTML, CSS, JS)  
├── tests/        # Playwright test specs  
└── dist/         # production build output