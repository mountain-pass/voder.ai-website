---
status: 'accepted'
date: 2024-08-07
decision-makers: voder.ai website team
packages:
  - dev-config
---

# ADR-0003: Adopt ESLint and Prettier for code quality

## Context and Problem Statement

Our codebase exhibits inconsistent style, varied formatting, and no unified linting rules. This leads to subjective formatting debates in code reviews, missed errors (unused variables, undefined references), and slower onboarding for new contributors.

## Decision Drivers

- Enforce a consistent code style across the entire repository
- Catch common errors and anti-patterns early via static analysis
- Automate formatting to eliminate “bikeshedding” on whitespace and styling
- Integrate seamlessly with editors, pre-commit hooks, and CI pipelines

## Considered Options

1. **ESLint only**
   - Pros: Flexible rule configuration, can catch many error patterns
   - Cons: Requires manual configuration of formatting rules, potential conflicts between lint rules
2. **Prettier only**
   - Pros: Zero-configuration code formatter, extremely consistent output
   - Cons: No static analysis for code quality, doesn’t catch errors
3. **ESLint & Prettier (separate tools, coordinated)**
   - Pros: Combines automated formatting with rich linting and error detection; clear separation of concerns
   - Cons: Requires coordination to avoid rule overlap (solved by `eslint-config-prettier`)

## Decision Outcome

Chosen option: "ESLint & Prettier (separate tools, coordinated)"  
The solution uses ESLint for static analysis and rule enforcement, and Prettier as the single, standalone code formatter. ESLint will disable formatting rules that conflict with Prettier by extending `eslint-config-prettier`.

Policy clarifications for this package:

- Use classic ESLint configuration files (`.eslintrc.cjs`/`.eslintrc.json`) with `extends`.
- Do NOT use ESLint Flat Config or FlatCompat.
- Do NOT run Prettier via ESLint (avoid `eslint-plugin-prettier` and `plugin:prettier/recommended`).
- Run Prettier directly (scripts and editor integration) as the only formatter.

### Implementation Steps

1. Install dev dependencies:

   ```bash
   npm install --save-dev eslint prettier eslint-config-prettier
   ```

2. Create or update `.eslintrc.cjs` (classic extends). Example for consumers of this package:

   ```js
   // .eslintrc.cjs
   module.exports = {
     root: true,
     extends: [
       '@voder/dev-config/eslint/base',
       '@voder/dev-config/eslint/dx',
       '@voder/dev-config/eslint/accessibility',
       '@voder/dev-config/eslint/performance',
       'eslint-config-prettier', // must be last to disable conflicting formatting rules
     ],
   };
   ```

3. Add a `prettier.config.js` (or `.prettierrc`) file, or use this package’s exported config.
4. Add separate `lint` and `format` scripts to `package.json`:

   ```jsonc
   {
     "scripts": {
       "lint": "eslint .",
       "lint:fix": "eslint . --fix",
       "format": "prettier \"**/*.{ts,tsx,js,jsx,json,md,css}\" --write",
       "format:check": "prettier \"**/*.{ts,tsx,js,jsx,json,md,css}\" --check",
     },
   }
   ```

5. In CI, run `npm run format:check` and `npm run lint` separately. Optionally gate merges on both.

### Consequences

- **Positive**
  - Automated formatting eliminates style debates and ensures consistency.
  - ESLint catches common bugs and enforces best practices.
  - Clear separation of concerns avoids duplicated/contradictory formatting rules.
  - Simpler ESLint setup (no prettier-as-lint-plugin wiring).

- **Negative**
  - Two tools must be run independently (lint + format) in scripts/CI.
  - Initial effort required to fix formatting and lint errors.

### Confirmation

- `npm run format:check` passes on a freshly formatted codebase.
- `npm run lint` reports zero lint errors with the classic extends stack.
- Editor default formatter is Prettier; no competing formatters enabled.
- No use of ESLint Flat Config/FlatCompat or `eslint-plugin-prettier` in the repo.
