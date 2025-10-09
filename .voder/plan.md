# Implementation Plan

## NOW

Fix the failing E2E test in closing-moment.spec.ts that's causing the CI pipeline to fail. The test expects `data-waiting="true"` attribute on the `#interest-form` element, but it's receiving an empty string. This is causing the post-deployment validation to fail in the CI pipeline.

**Root Cause Analysis**: The test failure indicates there's an expectation for a `data-waiting` attribute that should be set to "true" on the interest form, but the form doesn't have this attribute or it's not being set correctly.

**Immediate Action**: 
1. Investigate the actual HTML structure of the form on the live site
2. Either fix the form to include the expected attribute, or update the test to match the current implementation
3. This follows ITIL problem management - identify root cause before implementing fix

## NEXT

After fixing the immediate test failure:

1. **Optimize E2E Test Performance**: The post-deployment tests are still taking 9+ minutes which is excessive for a simple landing page validation. The current approach runs too many comprehensive tests for post-deployment validation.

2. **Replace waitForTimeout Calls**: Remove inefficient `page.waitForTimeout(500)` calls throughout the E2E test suite and replace with proper element waits to improve test reliability and speed.

3. **Implement Proper Test Scope**: Ensure post-deployment tests only validate critical functionality (page loads, form exists, no major JavaScript errors) rather than comprehensive cross-browser testing.

## LATER

Long-term improvements:

1. **Separate Comprehensive Testing**: Move comprehensive cross-browser testing to a separate workflow that runs on a schedule rather than blocking deployments.

2. **Performance Monitoring**: Implement monitoring to ensure the optimized pipeline stays under 10 minutes total execution time.

3. **Test Architecture Review**: Review the overall E2E testing strategy to ensure tests are appropriately scoped for different pipeline stages (pre-deployment critical tests vs post-deployment smoke tests vs comprehensive validation).