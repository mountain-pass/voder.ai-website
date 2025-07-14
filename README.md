## Usage

- `npm run dev`  
  Starts the Vite development server on port 5173.
- `npm run build`  
  Compiles the production bundle into the `dist/` directory.
- `npm run preview`

### Git Hooks

After running `npm install`, Husky hooks are installed automatically via the `prepare` script (`npm run prepare`).  
 Builds (if needed) and serves the production build on port 4173.

## Testing

- **Unit & CI tests**  
  npm run test:ci

- **End-to-end tests**  
  npm run test:e2e

- **Visual regression (Chromium)**  
  npx playwright test tests/visual-regression.spec.ts

<!-- test husky pre-commit hook -->
