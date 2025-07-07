# Hints

1. sveltekit projects are built and previewed using vite.
2. The `svelte-kit` command ONLY has a `sync` option. You MUST not try to run (or configure package.json to run) `svelte-kit dev` or `svelte-kit preview` or `svelte-kit build`
3. DON'T FORGET TO RUN `svelte-kit sync`
4. DON'T COMMIT FILES IN THE `.svelte-kit/` directory
5. The current version of @threlte/core is 8.0.5
6. The current version of @sveltejs/kit is 2.22.2
7. @sveltejs/kit 2.22.2 supports
   1. typescript "^5.3.3"
   2. svelte "^5.23.1"
   3. @sveltejs/vite-plugin-svelte "^3.0.0 || ^4.0.0-next.1 || ^5.0.0 || ^6.0.0-next.0"
   4. vite "^5.0.3 || ^6.0.0 || ^7.0.0-beta.0"
8. The current version of three and @types/three is 0.178.0
9. The `gh` CLI can be used to get the pipeline status.
10. DO NOT USE ONLINE ISSUE TRACKERS. Use a local file (or files) instead
11. Image analysis is EXPENSIVE. Only generate screenshots in tests when they will have a specific benefit.
12. ESLint configuration:
    1. Uses flat config format in `eslint.config.js` (not `.eslintrc.*`)
    2. Current version: eslint ^9.30.1 with typescript-eslint ^8.35.1
    3. Uses `tseslint.config()` helper function for TypeScript integration
    4. Svelte linting via eslint-plugin-svelte ^3.10.1 and svelte-eslint-parser ^1.2.0
    5. YOU MUST NOT USE eslint's FlatCompat
    6. Extends: eslint:recommended, typescript-eslint:recommended, svelte:recommended
    7. The `eslint.config.js` file is extremely fragile. Avoid modifying it unless absolutely necessary.
13. WORKING CODE THAT MEETS THE SPECIFICATION IS FAR MORE IMPORTANT THAN LINTING.
