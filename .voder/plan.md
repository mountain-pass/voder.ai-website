# Implementation Plan# Implementation Plan



## NOWBased on the visual assessment results and the mobile typography issue identified, I need to address the tagline sizing on mobile devices to improve brand message hierarchy.



**Fix E2E Test Failures - 7 Failing Tests Blocking Runtime Validation**## NOW



### Issue Analysis**Fix Mobile Typography Hierarchy Issue**: Update the tagline "AI Coding Without the Slop" to have better visual prominence on mobile devices relative to the "VODER" brand name.



From the assessment, we have 7 E2E test failures:1. **Identify Current Mobile Typography Settings**

   - Locate the CSS file controlling hero section typography

1. **Accessibility Focus Tests** (6 failures in WebKit/Safari browsers):   - Find current font-size values for mobile breakpoints

   - `tests/e2e/accessibility.spec.ts:43:3` - Skip link focus   - Identify the tagline selector and responsive rules

   - `tests/e2e/accessibility.spec.ts:92:3` - Focus management  

   - `tests/e2e/accessibility.spec.ts:121:3` - Keyboard navigation2. **Update Mobile Tagline Font Size**

   - Pattern: All involve `expect(locator).toBeFocused()` failing with "unexpected value: inactive"   - Increase tagline font size on mobile from current ~14-16px to ~18-20px

   - Browsers: WebKit and Mobile Safari   - Ensure proper line-height and spacing adjustments

   - Root cause hypothesis: WebKit has different focus timing/behavior than Chromium   - Maintain visual balance without breaking layout

   - Test across mobile viewports (375px, 414px, etc.)

2. **Mobile 3D Cube Test** (1 failure in Chromium):

   - `tests/e2e/mobile-cube-resize.test.ts:4:3` - Cube size changes on scroll3. **Validate Typography Changes**

   - Issue: Test expects cube size to remain stable during scroll but is failing   - Generate new screenshots to verify improved hierarchy

   - Browser: Chromium mobile emulation   - Ensure readability and visual impact are enhanced

   - Check that layout remains responsive and functional

### Root Cause Investigation Required

## NEXT

Before implementing fixes, investigate:

**Complete Typography Fix Validation and Address Brand Colors**

1. **WebKit Focus Timing**:

   - Check if WebKit requires additional wait time after Tab press1. **Run Full Test Suite**

   - Verify if focus events fire differently in WebKit vs Chromium   - Execute all tests to ensure no regressions from typography changes

   - Review Playwright documentation for WebKit-specific focus handling   - Update visual assessment documentation with typography fix

   - Generate updated screenshots showing improved mobile hierarchy

2. **Mobile Cube Behavior**:

   - Determine if cube resize on scroll is actual bug or test issue2. **Address Brand Color Consistency** (if still needed)

   - Check if responsive config changes during scroll events   - Update 3D cube volumetric caustics color from `0x5599ee` to `0x24d1d5`

   - Verify if performance-based fallback is triggering incorrectly   - Ensure color consistency with "Join the Waitlist" button

   - Test visual quality impact of color changes

### Fix Implementation

## LATER

**Step 1: Add WebKit-Specific Focus Handling**

**Visual Enhancement and Maintenance**

Update `tests/e2e/accessibility.spec.ts` to handle WebKit focus timing:

1. **Additional Typography Refinements**

- Add explicit wait/retry for focus assertions in WebKit   - Fine-tune typography hierarchy across all breakpoints

- Use `page.waitForFunction()` to ensure focus state is stable before assertions   - Consider font-weight adjustments for better visual balance

- Consider adding small delays after `keyboard.press('Tab')` for WebKit   - Add subtle text effects or animations if appropriate



**Step 2: Fix or Adjust Mobile Cube Test**2. **Brand Consistency Monitoring**

   - Document typography guidelines for future reference

Option A (if cube resize is a bug):   - Create automated tests for mobile typography standards

- Fix cube size calculation to remain stable during scroll   - Establish visual regression testing for key breakpoints
- Review responsive config logic in `src/three-animation.ts`

Option B (if test expectation is wrong):
- Adjust test to allow for expected cube resize behavior
- Document why resize happens and update test assertions

**Step 3: Validate Fixes**

- Run full E2E suite: `npm run e2e`
- Verify all 7 tests now pass
- Ensure no regressions in the 286 passing tests

## NEXT

**Verify Runtime Stability After Fixes**

1. Run production build: `npm run build`
2. Run full E2E suite across all browsers: `npm run e2e`
3. Run E2E production verification: `npm run e2e:ci:prod` (if available)
4. Verify all 328 E2E tests pass (currently 286 passing, 7 failing, 35 skipped)

**Update Implementation Progress**

Once all tests pass:
- Update `.voder/implementation-progress.md` with "RUNTIME VALIDATION: PASSED"
- Document the fixes applied
- Note any browser-specific handling added

## LATER

**Complete Remaining Assessment Phases**

After runtime validation passes:

1. **Phase 7: Version Control Validation**
   - Verify git status is clean
   - Check for uncommitted changes
   - Ensure no merge conflicts

2. **Phase 8: Pipeline Validation**  
   - Verify CI/CD pipeline status
   - Check GitHub Actions workflow results
   - Ensure deployment pipeline is healthy

3. **Phase 9: Problem Assessment**
   - Verify all problems remain closed/resolved
   - No new problems introduced by fixes

4. **Phase 10: Traceability Setup**
   - Generate traceability matrix
   - Link requirements to implementation
   - Verify story completion status

**Fresh Package Updates** (Low Priority)

When ready and after stability confirmed:
- Update `@playwright/test` from 1.55.1 to 1.56.0
- Update `@types/node` from 24.6.2 to 24.7.2  
- Update `axe-core` from 4.10.3 to 4.11.0
- Run full test suite after each update
- Commit updates separately with clear messages

**Final Assessment**

After all phases complete:
- Generate final implementation progress report
- Determine readiness for new story development
- Document lessons learned from E2E test fixes
