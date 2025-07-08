# Hints

1. Project uses Vite + Vanilla TypeScript (migrated from SvelteKit per ADR 0006)
2. Build and preview using standard Vite commands: `npm run dev`, `npm run build`, `npm run preview`
3. Components are implemented as TypeScript classes and functions, not framework components
4. Three.js is used directly for 3D content (no Threlte wrapper)
5. GSAP provides animation capabilities with scroll triggers
6. The current version of three and @types/three is 0.178.0
7. The `gh` CLI can be used to get the pipeline status
8. DO NOT USE ONLINE ISSUE TRACKERS. Use a local file (or files) instead
9. Image analysis is EXPENSIVE. Only generate screenshots in tests when they will have a specific benefit
10. Only test on Chromium initially. Once everything is working and the software meets the specification, then expand to firefox and webkit
11. ESLint configuration:
    1. Uses flat config format in `eslint.config.js` (not `.eslintrc.*`)
    2. Current version: eslint ^9.30.1 with typescript-eslint ^8.35.1
    3. YOU MUST NOT USE eslint's FlatCompat
    4. Extends: eslint:recommended, typescript-eslint:recommended
    5. The `eslint.config.js` file is extremely fragile. Avoid modifying it unless absolutely necessary
12. WORKING CODE THAT MEETS THE SPECIFICATION IS FAR MORE IMPORTANT THAN LINTING
13. The site is static. DO NOT CREATE POST, PATCH, PUT, or DELETE OPERATIONS
14. YOU MUST RUN `npm run build` before `vite preview`
15. Vite serves static files from the `public/` folder
16. Component architecture follows TypeScript class patterns (see examples in `examples/` directory)
17. Use semantic HTML with proper ARIA attributes for accessibility
18. `@axe-core/playwright` only exports `AxeBuilder`, not `injectAxe` or `getViolations`
