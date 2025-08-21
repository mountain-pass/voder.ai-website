## NOW

Stage and commit the modified .voder metadata files to clean the working tree:

git add .voder && git commit -m "chore: record .voder metadata updates" 2>&1 | tee /dev/stderr

(One command — purpose: make the working tree clean so we can re-run the verification pipeline and diagnose build failures unambiguously. This does not modify .voder content, only records it in git.)

## NEXT

1) Re-run the full verification pipeline and capture console output (this will populate .voder/history.md):

npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

2) If the verification run succeeds, align jest-axe peer metadata and record an ADR (non-interactive sequence):

npm pkg set peerDependencies.jest-axe="^10.0.0" 2>&1 | tee /dev/stderr
# If package.json changed, commit ADR + package.json/package-lock.json and re-run verify
if ! git diff --quiet -- package.json; then
  cat > docs/decisions/0003-align-jest-axe-version.md <<'ADR'
---
status: accepted
date: 2025-08-21
deciders: [voder-dev-team]
packages: '@voder/ui-tools'
---

# Align jest-axe peer dependency to devDependency version

## Decision
Align the `peerDependencies.jest-axe` entry in package.json to `^10.0.0` to match the devDependency version currently used for local testing.

## Rationale
Avoids confusing peer/consumer warnings and ensures local development uses a compatible jest-axe version.

## Consequences
- package.json peerDependencies updated to `^10.0.0`
- No runtime behavior change for consumers; this is metadata alignment.
ADR
  git add docs/decisions/0003-align-jest-axe-version.md package.json package-lock.json || true 2>&1 | tee /dev/stderr
  git commit -m "docs(adr): align jest-axe peer dependency to dev version" 2>&1 | tee /dev/stderr
  npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr
fi

3) If the verification run fails, follow the single-change loop (one minimal file change per iteration). Use the latest verification stderr (captured by the previous command) to pick the single highest-priority fix. Examples of single-file corrective actions you may need to run (execute exactly one such change, then re-run verification):

- If TS5055 overwrite errors still appear (tsc trying to write into tracked dist/): remove tracked dist files from the index and commit that single change:

git rm --cached -r dist/ 2>&1 | tee /dev/stderr && git commit -m "chore: remove tracked dist/ to avoid tsc overwrite" 2>&1 | tee /dev/stderr

- If tsconfig still missing exclude: ensure tsconfig.json excludes dist (single-file update; non-interactive edit):

node -e "const fs=require('fs');const p='tsconfig.json';const cfg=JSON.parse(fs.readFileSync(p));cfg.exclude=Array.from(new Set([...(cfg.exclude||[]),'dist']));fs.writeFileSync(p,JSON.stringify(cfg,null,2)+'\n');console.log('updated tsconfig.json');" 2>&1 | tee /dev/stderr && git add tsconfig.json && git commit -m "fix: exclude dist from tsconfig to avoid overwrite errors" 2>&1 | tee /dev/stderr

- If the failure identifies a missing devDependency required by tests (e.g., @testing-library/jest-dom, jsdom), install it as a devDependency (single command) and commit package-lock.json changes:

npm install --no-audit --no-fund --save-dev <package-name> 2>&1 | tee /dev/stderr
git add package.json package-lock.json && git commit -m "chore: add devDependency <package-name> required for tests" 2>&1 | tee /dev/stderr

After performing exactly one such change, re-run:

npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

Repeat the loop until verification is green.

Notes for the NEXT phase:
- Always preserve console output (use tee) so the history is recorded.
- Do not change files under .voder/ or prompts/.
- Keep each commit to a single, focused change and re-run verification after each commit.

## LATER

Once the verification pipeline is reliably passing and the working tree is clean and pushed:

1) Push changes to remote:

git push origin main 2>&1 | tee /dev/stderr

2) Begin the incremental feature work (one vertical slice per commit — implement, test, verify after each change):

a) Add a unit test for createPostCSSConfig
- File to add: tests/build/postcss.test.ts
- Commit and run verification:
  - git add tests/build/postcss.test.ts && git commit -m "test: add unit tests for createPostCSSConfig" 2>&1 | tee /dev/stderr
  - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

b) Implement Vite library config factory and tests
- Files: src/build/vite-library.ts, tests/build/vite-library.test.ts
- Commit, then run verification

c) Implement jsdom testing utilities and tests
- Files: src/testing/vitest-jsdom.ts, src/testing/setup.ts, src/testing/helpers.ts, src/testing/accessibility.ts and corresponding tests
- Commit, then run verification

d) Add markdown-lint config generator + package scripts
- File: scripts/generate-markdownlint-config.ts
- Update package.json scripts: lint:md, lint:md:fix
- Commit, then run verification

e) Add lint/format configs and scripts
- Files: eslint.config.js, prettier.config.js
- Update package.json scripts: lint, lint:fix, format, format:check, verify
- Commit, then run verification

f) Adopt dual-export pattern and add integration tests
- Update package.json exports to include dedicated paths (./testing, ./prettier, ./eslint → ./dist/...)
- Add export-equivalence tests and package-installation integration tests
- Commit, then run verification

g) Add README.md and CHANGELOG.md (use the README template)
- Commit, then run verification

h) Expand tests and reach coverage targets
- Iterate until npm run test:ci reports coverage ≥90% and required public API coverage

General constraints for LATER work:
- Each change must be a small, self-contained commit.
- Run the verification pipeline after every commit.
- Preserve console-first output for all commands (use tee).
- Do not modify .voder/ or prompts/.
- All commands must be non-interactive.

Rationale summary
- The highest-priority blocker from the assessment was a dirty working tree (.voder files) preventing a clear verification run and making diagnosis ambiguous. Committing those metadata files now will produce a clean workspace so we can re-run verification, capture output, and either finish or iterate the single-change loop to resolve the remaining build/test issues. After verification is green, continue with the metadata alignment ADR, push, and then implement the missing functionality incrementally (tests → implementation → verification).