## NOW

Update the `lint` script in `package.json` to drop the explicit `--config .eslintrc.cjs` flag so ESLint will load the legacy config automatically.  
- Edit `package.json`, under `"scripts"`, change  
  ```json
  "lint": "eslint --config .eslintrc.cjs \"src/**/*.{js,ts,svelte}\""
  ```  
  to  
  ```json
  "lint": "eslint \"src/**/*.{js,ts,svelte}\""
  ```

## NEXT

- Run `npm run lint` to see all remaining lint errors under `src/`.  
- Fix each reported issue in the code (e.g. replace invalid `href="#"`, remove redundant roles, correct accessibility violations) until `npm run lint` exits with status 0.  
- Once lint is clean, add Prettier support:  
  - Create `prettier.config.cjs` with your preferred rules.  
  - Update `.eslintrc.cjs` to extend `"plugin:prettier/recommended"`.  
  - Install `prettier` and `eslint-plugin-prettier`.  
  - Add a `"format"` script in `package.json` (e.g. `prettier --write "src/**/*.{js,ts,svelte,css,md,json}"`).  

## LATER

- Integrate lint and format checks into the CI workflow (`.github/workflows/ci.yml`).  
- Add pre-commit hooks (e.g. Husky + lint-staged) to auto-format and lint on staged files.  
- Finalize and accept ADR-0006 (manual chunk splitting) and ADR-0007 (ESLint & Prettier).  
- Expand test coverage with unit/component tests and enforce quality gates.