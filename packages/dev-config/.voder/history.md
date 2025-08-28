Summary of work completed so far

- Repository & tooling
  - Initialized the Git repository and developer tooling (Vitest, ESLint flat-config, Prettier, coverage reporting).
  - Configured package.json (peerDependencies, scripts, conditional exports).

- TypeScript migration & cleanup
  - Migrated the entire codebase to strict-mode TypeScript.
  - Removed 107 obsolete files and legacy documentation.
  - Replaced local tsconfig.json with an extends-based config from @voder/dev-config and added multiple tsconfig variants.
  - Committed a missing TypeScript build preset (packages/dev-config/typescript/build.json) in commit 489f818.

- Testing, build & packaging
  - Implemented ~33 Vitest test suites and achieved 100% test coverage.
  - Built ESM/CJS bundles with type declarations and asset copying.
  - Established a Prebuild → Build → Verify pipeline.
  - Refactored vitest.config.ts to use createVitestNodeConfig (39 tests passed locally).

- CI & governance
  - Added a GitHub Actions “verify” workflow running lint, format, type-check, build, and tests.
  - Added import-time checks and audit:ci per ADR-0007.

- Documentation & API changes
  - Renamed package to @voder/dev-config.
  - Expanded README (changelog, migration guide, full API) and added CONTRIBUTING.md.
  - Enforced Markdownlint and published a docs site.
  - Created .eslintignore for dist/, build/, coverage/, node_modules/, typescript/.
  - Simplified ESLint snippet and clarified API.md entries.

- Dependency & security maintenance
  - Audited 450+ dependencies, reduced vulnerabilities to zero, and regenerated the lockfile.
  - Upgraded esbuild and added SECURITY.md.
  - Confirmed zero vulnerabilities in recent checks.

- Major refactorings & cleanup
  - Removed obsolete Vite scripts and unified test helpers.
  - Cleared ESLint warnings; tightened parserOptions and undefined-variable checks.
  - Updated devDependencies and cleaned up lint/build/test scripts and docs.

- Utility & ESLint enhancements
  - Added validateRuntime.ts and jsonLoader.ts with tests.
  - Patched ESLint flat-config for JSON modules and added jiti@^2.5.1 as an ESLint TypeScript loader peer dependency.
  - Patched eslint/index.ts to include src/tests in the `complete` export.

- Config replacements & final patches
  - Modified prettier.config.ts to re-export shared config.
  - Updated tsconfig.build.json to extend the shared preset and set only outDir.
  - Replaced the project-root tsconfig.build.json with an extends-based config that set outDir, rootDir, and an explicit include list.

- Recent fixes & Git activity
  - Fixed jsonLoader resolution (commit a2e7fb0).
  - Patched eslint/index.ts and other small docs/lint updates.

- Most recent build attempts & compiler errors
  - Ran npm run build: prebuild generated Markdown lint config; tsc -p tsconfig.build.json and copy:assets ran. The build failed with TS2209 (ambiguous project root); prebuild Markdown lint config generation had succeeded.
  - Ran npx tsc -p tsconfig.build.json: tsc exited with code 2 and produced multiple TS6059 errors reporting files (eslint.config.ts, scripts/\*, vitest.config.ts, etc.) as "not under 'rootDir' '/.../packages/dev-config/src'". Each error noted the file matched the include and is an ECMAScript module due to package.json "type": "module".
  - Exact first compiler error from the last npx tsc run:
    - error TS6059: File '/.../packages/dev-config/eslint.config.ts' is not under 'rootDir' '/.../packages/dev-config/src'. 'rootDir' is expected to contain all source files.
      The file is in the program because:
      Matched by include pattern 'eslint.config.ts' in 'tsconfig.build.json'
      File is ECMAScript module because '/.../packages/dev-config/package.json' has field "type" with value "module"
    - tsc exited with code 2 and reported additional TS6059 errors for other included files.

- Immediate edits and final file move
  - Edited project-root tsconfig.build.json to add "rootDir": "src" under compilerOptions.
  - Replaced project-root tsconfig.build.json with an extends-based config that set outDir, rootDir, and included ["src", "eslint.config.ts", "prettier.config.ts", "vitest.config.ts", "scripts/**/*"].
  - Executed: git mv eslint.config.ts src/eslint.config.ts
  - Result: File renamed successfully from eslint.config.ts to src/eslint.config.ts.

**Most recently we've executed the following action:**

---

<scratchpad>
We need to run the TypeScript compiler with the build tsconfig to surface the first rootDir-related error. Single command only. Must run from project root. Capture output to console (per console-first policy).
</scratchpad>

Run from the project root (one command):

npx tsc -p tsconfig.build.json

## Goal: compile with the build config and print the first TypeScript error to the console (look for TS6059 / TS2209 referencing a top-level file).

## **This was the result:**

`npx tsc -p tsconfig.build.json` failed.
Error:
npx process exited with code 2
stdout: error TS6059: File '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/scripts/copy-assets.ts' is not under 'rootDir' '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/src'. 'rootDir' is expected to contain all source files.
The file is in the program because:
Matched by include pattern 'scripts/**/\*' in 'tsconfig.build.json'
File is ECMAScript module because '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/package.json' has field "type" with value "module"
error TS6059: File '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/scripts/generate-markdownlint-config.ts' is not under 'rootDir' '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/src'. 'rootDir' is expected to contain all source files.
The file is in the program because:
Matched by include pattern 'scripts/**/\*' in 'tsconfig.build.json'
File is ECMAScript module because '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/package.json' has field "type" with value "module"
error TS6059: File '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/vitest.config.ts' is not under 'rootDir' '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/src'. 'rootDir' is expected to contain all source files.
The file is in the program because:
Matched by include pattern 'vitest.config.ts' in 'tsconfig.build.json'
File is ECMAScript module because '/Users/tomhoward/Projects/voder.ai-website/packages/dev-config/package.json' has field "type" with value "module"

## stderr:
