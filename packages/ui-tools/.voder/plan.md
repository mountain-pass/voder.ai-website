## NOW

git commit -am "chore: record .voder metadata updates" 2>&1 | tee /dev/stderr

## NEXT

1) Push the local commits to remote and capture output:
   - git push origin main 2>&1 | tee /dev/stderr

2) Re-run the full verification pipeline and capture output (this populates .voder/history.md and provides current diagnostics):
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

3) Inspect the verification output in the console/.voder/history.md and act based on results:
   - If the verification run SUCCEEDS:
     - Align jest-axe peer metadata and record an ADR (non-interactive):
       - npm pkg set peerDependencies.jest-axe="^10.0.0" 2>&1 | tee /dev/stderr
       - If package.json changed, create the ADR file and commit it along with package.json/package-lock.json, then re-run verification:
         - cat > docs/decisions/0003-align-jest-axe-version.md <<'ADR'
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
         - git add docs/decisions/0003-align-jest-axe-version.md package.json package-lock.json || true 2>&1 | tee /dev/stderr
         - git commit -m "docs(adr): align jest-axe peer dependency to dev version" 2>&1 | tee /dev/stderr
         - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

   - If the verification run FAILS:
     - Enter the single-change loop. Use the verification stderr to select exactly one highest-priority corrective action (do not modify .voder/ or prompts/ beyond committing metadata already done). After performing exactly one change, re-run the verification pipeline. Example single-file corrective actions (execute ONLY ONE per iteration):
       - If TS5055 overwrite errors indicate tsc is writing into tracked dist/:
         - git rm --cached -r dist/ 2>&1 | tee /dev/stderr && git commit -m "chore: remove tracked dist/ to avoid tsc overwrite" 2>&1 | tee /dev/stderr
       - If tsconfig is missing an exclude for dist:
         - node -e "const fs=require('fs');const p='tsconfig.json';const cfg=JSON.parse(fs.readFileSync(p));cfg.exclude=Array.from(new Set([...(cfg.exclude||[]),'dist']));fs.writeFileSync(p,JSON.stringify(cfg,null,2)+'\n');console.log('updated tsconfig.json');" 2>&1 | tee /dev/stderr && git add tsconfig.json && git commit -m "fix: exclude dist from tsconfig to avoid overwrite errors" 2>&1 | tee /dev/stderr
       - If a missing devDependency causes tests to fail (e.g., jsdom, @testing-library/jest-dom):
         - npm install --no-audit --no-fund --save-dev <package-name> 2>&1 | tee /dev/stderr
         - git add package.json package-lock.json && git commit -m "chore: add devDependency <package-name> required for tests" 2>&1 | tee /dev/stderr
       - After performing exactly one such change, re-run:
         - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr
       - Repeat the single-change loop until verification is green. Always preserve console output with tee.

Notes for NEXT:
- Preserve console-first output for every command (use tee) so .voder/history.md captures results.
- Do NOT modify files under prompts/.
- Keep each commit focused and small; re-run verification after each commit.

## LATER

Once the verification pipeline is reliably passing and the working tree is clean and pushed:

1) Continue incremental feature work — one vertical slice per commit, each followed by verification:
   - a) Add a focused unit test for createPostCSSConfig
     - Add: tests/build/postcss.test.ts
     - git add tests/build/postcss.test.ts && git commit -m "test: add unit tests for createPostCSSConfig"
     - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr
   - b) Implement the Vite library config factory and its tests
     - Add: src/build/vite-library.ts, tests/build/vite-library.test.ts
     - Commit and run verification
   - c) Implement jsdom testing utilities and tests
     - Add: src/testing/vitest-jsdom.ts, src/testing/setup.ts, src/testing/helpers.ts, src/testing/accessibility.ts and tests
     - Commit and run verification
   - d) Add markdown-lint config generator and package scripts
     - Add: scripts/generate-markdownlint-config.ts
     - Update package.json scripts: lint:md, lint:md:fix
     - Commit and run verification
   - e) Add lint/format configs and scripts
     - Add: eslint.config.js, prettier.config.js
     - Update package.json scripts: lint, lint:fix, format, format:check, verify
     - Commit and run verification
   - f) Adopt dual-export pattern and add integration tests
     - Update package.json exports to include dedicated paths (./testing, ./prettier, ./eslint → ./dist/...)
     - Add export-equivalence tests and package-installation integration tests
     - Commit and run verification
   - g) Add README.md (consumer-facing) and CHANGELOG.md (use template)
     - Commit and run verification
   - h) Expand tests and iterate until coverage meets project targets (run npm run test:ci to measure)

2) Governance and metadata:
   - After each substantive dependency change, author and commit the required ADR(s) in docs/decisions/ alongside package.json/package-lock.json changes.

3) Continuous hygiene:
   - Ensure dist/ remains untracked and tsconfig excludes dist.
   - Preserve console-first output for all commands (use tee) and avoid creating repository files for diagnostics.