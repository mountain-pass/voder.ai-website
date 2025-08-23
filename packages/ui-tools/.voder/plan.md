## NOW  
Run a single commit to clear the uncommitted changes:  
```bash
git add . && git commit -m "chore: commit all pending configuration and source updates to restore repository hygiene"
```

## NEXT  
- Run `npm run verify` to ensure type-checking, linting, build, markdownlint, format, and tests all pass.  
- If any verification step fails, address the errors immediately (fix type errors, adjust configs, correct test imports).  
- Break this large commit into smaller logical commits on a feature branch if further granular history is needed (e.g., separate config updates vs. source changes vs. test additions).  
- Remove any accidentally committed build artifacts (e.g., `src/index.js`) with `git rm`, then re-commit to keep the working tree clean.

## LATER  
- Consolidate duplicate JS/TS test files into single TypeScript suites and refactor shared test utilities.  
- Expand test coverage to hit the ≥ 90% threshold by writing missing unit and integration tests for untested branches and error paths.  
- Review and sync peer/dev dependencies (e.g., align Vite versions, add missing markdownlint-cli2 devDependency).  
- Prune any stale or obsolete files and ensure `.gitignore`/`.voderignore` remain accurate.