The previous plan was incorrect. Here is the corrected plan.

## NOW
Stage all changes while excluding the package-internal .voder metadata (single non-interactive command):
git add -A -- . ':(exclude)packages/ui-tools/.voder/*'

## NEXT
After the NOW command succeeds, perform these steps in order (stop on any failure and fix before continuing):

1. Commit the staged changes with a clear hygiene message:
   - git commit -m "chore: repository hygiene — commit source changes (exclude .voder)" || true

2. Detect and untrack tracked build outputs (idempotent):
   - git ls-files --error-unmatch dist >/dev/null 2>&1 && git rm --cached -r dist || true

3. Ensure .gitignore contains dist/ and commit if it changed:
   - git add .gitignore
   - git commit -m "chore: ensure dist/ is gitignored" || true

4. Add the idempotent pretest build guard to package.json and commit:
   - node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.scripts=p.scripts||{};if(p.scripts.pretest!=='npm run build'){p.scripts.pretest='npm run build';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');console.error('pretest script added');}else{console.error('pretest already present');}"
   - git add package.json
   - git commit -m "chore: add pretest build guard" || true

5. Push housekeeping commits:
   - git push origin main || true

6. Run the verification pre-check and fix any failures before feature work:
   - npm run type-check
   - npm run build
   - npm test

Do not proceed to feature development until all verification commands succeed.

## LATER
Once the repository is clean, verification passes, and housekeeping is pushed, proceed with the TDD-driven Vite-factory work and follow-ups:

1. TDD: add tests for Vite library config (tests/build/vite-library.test.ts) asserting:
   - config.build.lib.formats === ['es']
   - config.build.lib.name === 'TestLib'
   - config.css?.postcss is defined

2. Implement createViteLibraryConfig (test-first):
   - Add src/build/vite-library.ts implementing the factory per spec.
   - Export it from src/index.ts:
     export { createViteLibraryConfig, type ViteLibraryOptions } from './build/vite-library.js';

3. Iterate verification until green:
   - npm run type-check
   - npm run build
   - npm test

4. Commit & push the TDD slice:
   - git add src/build/vite-library.ts src/index.ts tests/build/vite-library.test.ts
   - git commit -m "feat: add Vite library config factory (TDD) and tests"
   - git push origin main

5. Continue incremental TDD slices (vitest-jsdom config, testing helpers & setup, linting factories), add required scripts (lint, format, lint:md, verify), implement integration/export tests, and add README/CHANGELOG per the implementation guide — only after version-control hygiene and the Vite-factory TDD slice are green.

Notes / constraints reminders:
- Do NOT modify, remove, revert, or commit files under packages/ui-tools/.voder — they must remain untouched.
- All git commands are non-interactive and scoped to the current working directory.
- If any step in NEXT fails, stop and fix the failure before continuing.