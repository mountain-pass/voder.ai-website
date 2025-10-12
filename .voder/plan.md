# Implementation Plan

## NOW

Fix Playwright configuration warning about HTML reporter output folder clashing with test artifacts directory.

**Problem**: Playwright warns that the HTML reporter `outputFolder` ('test-results/html') clashes with the test artifacts `outputDir` ('test-results/'). This can cause conflicts during test cleanup and artifact organization.

**Root Cause**: The HTML reporter writes to a subdirectory of the test artifacts directory, which Playwright considers a configuration error because test cleanup operations could remove the HTML report before it's been viewed or archived.

**Solution**: Move HTML reporter output to a separate top-level directory 'playwright-report' to avoid conflicts with test artifacts directory.

**Implementation**:
1. Update `playwright.config.ts` line 24:
   - Change `['html', { outputFolder: 'test-results/html', open: 'never' }]`
   - To `['html', { outputFolder: 'playwright-report', open: 'never' }]`
2. Add 'playwright-report/' to `.gitignore` if not already present
3. Run tests to verify configuration works correctly: `npm run test:e2e`
4. Verify HTML report generates in new location
5. Run full quality checks (lint, format, type-check, tests)
6. Commit and push changes

**Expected Outcome**: Playwright configuration warning eliminated, HTML reports generated in separate directory from test artifacts, no functional changes to test execution.

## NEXT

Nothing planned - project is feature complete and all quality checks passing.

## LATER

Nothing planned - project is feature complete and all quality checks passing.
