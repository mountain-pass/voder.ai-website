---
status: 'accepted'
date: 2025-08-21
deciders: [voder-dev-team]
packages: '@voder/ui-tools'
---

# Add development tooling for @voder/ui-tools

Decision: Add TypeScript and test tooling as devDependencies (typescript, vitest, @types/node, postcss, autoprefixer, @testing-library/dom, jest-axe) to enable local development, type-checking and unit tests.

Rationale: Required to author and validate the package implementation and tests locally and in CI. These will be added as devDependencies and documented here.
