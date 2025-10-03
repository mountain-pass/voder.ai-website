# Implementation Plan - October 3, 2025

## NOW

**Fix Critical Runtime Failures Causing E2E Test Failures**

We have 7 E2E test failures across multiple browsers that are blocking all development. These appear to be regressions of previously "closed" problems:

1. **Button Overlap Issue (4 test failures)**
   - Tests: `P003: Coming Soon Button Overlapping 3D Cube › should not have button overlapping 3D cube`
   - Browsers: Chromium, WebKit, Mobile Chrome, Mobile Safari
   - Problem: Button positioned -237 to -276px instead of proper separation (minimum 16px required)
   - Previous Fix: Problem 003 was marked CLOSED but appears to have regressed

2. **Engagement Tracking Timeouts (3 test failures)**
   - Tests: `engagement tracking works on user interaction`
   - Issue: `<header role="banner" class="brand-header">` intercepts pointer events preventing h1 clicks
   - This is similar to Problem 008 (canvas pointer events) but affecting header element instead

**Root Cause Investigation Steps**:
1. Examine CSS changes that may have caused P003 regression (button positioning)
2. Check if header element pointer-events CSS got modified/removed
3. Verify z-index stacking context hasn't been disrupted
4. Test if recent dependency updates affected layout calculations

**Immediate Fix Actions**:
1. **Fix Button Positioning**:
   - Inspect current CSS for `.hero-animation` and button positioning
   - Restore proper spacing between 3D animation container and "Coming Soon" button
   - Ensure minimum 16px vertical separation is maintained
   - Verify fix works across all viewport sizes

2. **Fix Header Pointer Events**:
   - Add `pointer-events: none` to header element or specific child elements blocking h1
   - Ensure h1 element remains clickable for engagement tracking
   - Test click functionality across all browsers

3. **Run Verification Tests**:
   - Execute `npm run e2e` to verify all 7 failing tests now pass
   - Ensure no regressions in the 159 currently passing tests
   - Test on multiple browsers and device types

## NEXT

**Complete Runtime Stabilization and Quality Verification**

1. **Security Dependencies Resolution**
   - Run `npm audit fix` to resolve the 2 low severity vulnerabilities
   - Verify netlify-cli functionality still works after dependency updates
   - Commit security fixes

2. **Full E2E Test Suite Validation**
   - Run complete E2E test suite: `npm run e2e`
   - Verify all 188 tests pass with zero failures
   - Check screenshot comparisons for visual regression testing
   - Validate form submission functionality end-to-end

3. **Performance and Build Verification**
   - Run production build: `npm run build`
   - Test preview deployment: `npm run preview`
   - Verify 3D animation performance hasn't degraded
   - Check bundle size and loading times

4. **Update Problem Documentation**
   - If P003 truly regressed, reopen problem with current findings
   - Document new engagement tracking issue if not covered by existing problems
   - Update problem status to reflect current state

## LATER

**System Hardening and Monitoring Enhancement**

1. **Regression Prevention**
   - Add additional E2E tests to catch button positioning regressions earlier
   - Implement visual regression testing for layout stability
   - Add CSS unit tests for critical layout components

2. **Monitoring and Alerting**
   - Set up automated E2E test runs on main branch
   - Configure alerts for test failures in CI/CD pipeline
   - Add performance monitoring for 3D animation rendering

3. **Technical Debt Reduction**
   - Review and consolidate CSS positioning strategy for 3D/content overlay
   - Implement design system patterns for consistent z-index management
   - Optimize Three.js initialization and event handling

4. **User Experience Enhancements**
   - Add loading states for better perceived performance
   - Implement graceful degradation for users without WebGL support
   - Enhance mobile touch interaction responsiveness