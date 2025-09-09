# Application Hints

## Build System & Framework

1. Project uses Vite + Vanilla TypeScript (migrated from SvelteKit per ADR 0006)
2. Applications use Vite for build tooling (packages use Rollup)
3. Main application entry point should be clean and focused on initialization

## Testing Strategy

4. Image analysis is EXPENSIVE. Only generate screenshots in tests when they will have a specific benefit
5. Only test on Chromium initially. Once everything is working and the software meets the specification, then expand to firefox and webkit

## Application Architecture

6. The site is static. DO NOT CREATE POST, PATCH, PUT, or DELETE OPERATIONS
