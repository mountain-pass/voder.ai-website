## Plan (focused on NEXT PRIORITY: make the repo clean and run the verification pipeline)

Rationale: The highest-priority task from the assessment is to get the repository into a clean, verifiable state and run the verification pipeline so we have concrete failure output to iterate on. The NOW action below makes the working tree clean (committing the modified tracked .voder metadata files), so subsequent verification runs will be deterministic and safe.

## NOW
Commit the modified tracked files (persist the .voder metadata changes) so the working tree is clean and we can run verification.

Command to run (single non-interactive command; all output will go to console/stderr and be captured in .voder/history.md):
- git commit -a -m "chore(ui-tools): persist .voder metadata updates"

(signed-off rationale: this commits only tracked changes; do NOT add untracked files. After this completes the working tree will be clean and we can run the dependency/verification steps deterministically.)

## NEXT
After the NOW commit succeeds, run these steps in sequence (each command non-interactive; capture ALL output to console/stderr):

1. Dependency & supply-chain snapshot
   - npm audit --json --no-fund || true
   - npm outdated --json --no-fund || true

2. Inspect jest-axe alignment and print results
   - node -e "const p=require('./package.json'); console.log('peer jest-axe:', p.peerDependencies?.['jest-axe']||'none'); console.log('dev jest-axe:', p.devDependencies?.['jest-axe']||'none');"

3. (Conditional) If the console output shows a major-version mismatch (peer ^9 vs dev ^10) and you choose to align the dev dependency to the peer-compatible range, run:
   - npm install --no-audit --no-fund --save-dev jest-axe@^9.0.0
   - git add -- package.json package-lock.json
   - git commit -m "chore(ui-tools): align jest-axe to peer-compatible range"
   - git push origin main

   Note: Do not perform the above automatic change unless you intentionally reviewed the console output and decided to proceed.

4. Run the verification pipeline (fail-fast)
   - npm run type-check && npm run build && npm test

5. If verification fails, iterate small focused fixes only in source/test/type config:
   - Make minimal code/test fix(s) limited to src/, tests/, or tsconfig.json
   - git add -- <modified-files>
   - git commit -m "fix(ui-tools): <short description>"
   - git push origin main
   - Re-run: npm run type-check && npm run build && npm test
   - Repeat until verification is green

6. After verification is green, re-run supply-chain snapshot and commit lockfile if changed:
   - npm audit --json --no-fund || true
   - npm outdated --json --no-fund || true
   - If package-lock.json or package.json changed:
     - git add -- package-lock.json package.json
     - git commit -m "chore(ui-tools): address audit / update lockfile"
     - git push origin main

Important NEXT notes
- All command outputs must go to stdout/stderr (console-first) so they appear in .voder/history.md.
- Do not modify anything under .voder/ or prompts/.
- Keep all commands POSIX-safe and non-interactive.
- Avoid automatic major dependency upgrades without an explicit decision and ADR.

## LATER
After the repository is clean and the verification pipeline is green, proceed incrementally (small vertical slices; each slice must be implemented, tested, and verified before moving to the next):

1. Implement Vite library factory + tests
   - Add src/build/vite-library.ts (createViteLibraryConfig per design).
   - Add tests: tests/build/vite-library.test.ts asserting ESM-only formats and css.postcss presence.
   - Commit & run verification.

2. Implement jsdom testing utilities & accessibility helpers
   - Add src/testing/{vitest-jsdom.ts, helpers.ts, accessibility.ts, setup.ts}.
   - Add unit/integration tests for helpers and accessibility utilities (jsdom + jest-axe).
   - Add a test enforcing vitest + @vitest/coverage-v8 alignment per ADR.
   - Commit & run verification.

3. Add linting factories & markdown lint integration
   - Add src/linting/{html.ts, css.ts, accessibility.ts}.
   - Add helper to generate .markdownlint.json (consume @voder/dev-config) and add lint:md / lint:md:fix scripts to package.json.
   - Commit & run verification.

4. Implement packaging/exports & package-structure tests
   - Add build asset copy steps, update package.json exports to point to ./dist/*, add prebuild/postbuild hooks to scripts.
   - Add tests: tests/package-structure.test.ts, tests/export-equivalence.test.ts, tests/package-installation.test.ts.
   - Ensure tsc output and declaration files are validated by tests.
   - Commit & run verification.

5. Add README & housekeeping
   - Add self-contained README.md (UNLICENSED, quick-start, Node engine note, peer deps, security posture).
   - Add CHANGELOG.md template, eslint.config.js / prettier config, and lint/format scripts.
   - Commit & run verification.

6. Supply-chain hardening & ADRs
   - Remediate audit findings, commit lockfile, add ADRs for any major dependency changes; bundle ADRs with package.json/lockfile changes.
   - Add tests that assert required version alignment constraints (e.g., vitest/provider).

7. Expand tests & coverage toward policy targets
   - Incrementally increase test coverage to ≥90% (with 100% public API coverage), enforce thresholds in Vitest config, and make verify the single-source quality gate.

LATER notes
- Keep each change the smallest vertical slice that yields verifiable value and tests.
- Always run the verification pipeline after each slice.
- Do not modify .voder/ or prompts/ files.
- Maintain console-first outputs and POSIX-safe commands.

---

If you want, I can produce the exact sequence of shell commands (ready to paste/run) for the NEXT steps (after the NOW commit), or I can prepare the minimal focused test/code fixes to make verification pass once you run the verification and share its console output. Which would you like next?