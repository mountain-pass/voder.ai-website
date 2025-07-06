---
status: "proposed"
date: 2024-08-07
decision-makers: voder.ai website team
---

# ADR 0007: Adopt ESLint & Prettier for Code Quality and Formatting

## Context and Problem Statement

Our codebase currently exhibits inconsistent style, varied formatting, and no unified linting rules. This leads to subjective formatting debates in code reviews, missed errors (unused variables, undefined references), and slower onboarding for new contributors.

## Decision Drivers

* Enforce a consistent code style across the entire repository  
* Catch common errors and anti-patterns early via static analysis  
* Automate formatting to eliminate “bikeshedding” on whitespace and styling  
* Integrate seamlessly with editors, pre-commit hooks, and CI pipelines  

## Considered Options

1. **ESLint only**  
   - Pros: Flexible rule configuration, can catch many error patterns  
   - Cons: Requires manual configuration of formatting rules, potential conflicts between lint rules  
2. **Prettier only**  
   - Pros: Zero-configuration code formatter, extremely consistent output  
   - Cons: No static analysis for code quality, doesn’t catch errors  
3. **ESLint & Prettier**  
   - Pros: Combines automated formatting with rich linting and error detection  
   - Cons: Slight overhead to configure integrations (`eslint-config-prettier`, `eslint-plugin-prettier`)  

## Decision Outcome

Chosen option: "ESLint & Prettier"  
We will use ESLint for static analysis and rule enforcement, and Prettier for unambiguous code formatting. ESLint will be configured to disable formatting rules that conflict with Prettier, and Prettier will run as an ESLint plugin to surface formatting issues as lint errors.

### Implementation Steps

1. Install dev dependencies:  
   ```bash
   npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
   ```  
2. Create or update `.eslintrc.cjs` with recommended rules and enable `plugin:prettier/recommended`.  
3. Add a `prettier.config.cjs` (or `.prettierrc`) file to define any overrides (e.g., print width, tab width).  
4. Add `lint` and `format` scripts to `package.json`:  
   ```json
   {
     "scripts": {
       "lint": "eslint \"src/**/*.{js,ts,svelte}\"",
       "format": "prettier --write \"src/**/*.{js,ts,svelte,css,md,json}\""
     }
   }
   ```  
5. Integrate lint checks into CI (`npm run lint`) and optionally add a pre-commit hook (e.g., via Husky) to run `npm run format` and `npm run lint --fix`.

### Consequences

* **Positive**  
  * Automated formatting eliminates style debates and ensures consistency.  
  * ESLint catches common bugs and enforces best practices.  
  * Prettier’s integration with ESLint surfaces formatting issues as lint errors.

* **Negative**  
  * Initial effort required to fix existing formatting and lint errors.  
  * Contributors must adopt editor integrations or run scripts to comply.  

### Confirmation

* Verify that `npm run lint` reports zero errors on a freshly formatted codebase.  
* Verify that `npm run format` applies consistent styling to all tracked files.  
* Confirm CI pipeline fails on lint errors if code does not adhere to rules.  
* Ensure new code contributions are formatted and pass lint checks before merging.