# Implementation Plan# Implementation Plan# Implementation Plan



## NOW



**Implement Story 026.03-BIZ-MAGIC-PHASE-ANIMATION: Act 1 Magic Phase Cinematic Effects****Date**: October 25, 2025  **Date**: 2025-12-20  



Following Gall's Law, start with the simplest implementation that works, then iterate.**Status**: BLOCKED BY E2E TEST FAILURES  **Status**: STORY 026.02 COMPLETE  



### Step 1: Add HTML Structure and Data Attributes**Assessment**: Phase 6 Runtime Validation failed with 54 E2E test failures**Assessment**: Story 026.02-BIZ-SCROLL-LOCKED-REVEAL implemented successfully



Update `index.html` to add the necessary data attributes and classes for Act 1 (Magic Phase) segments:

- Add `data-act="1"` to Act 1 segments (first ~20% of scroll narrative)

- Add `data-segment="1"` and `data-segment="2"` to the first two segments------

- Add `.magic-word` class to the word "magic" 

- Add `.speed-word` class to "fast" and "exciting" words



### Step 2: Create CSS Foundation## NOW## NOW



Create CSS styles for the magic phase animations in `src/style.css`:

- Add `.magic-word` styling with text-shadow animation preparation

- Add `.speed-word` styling with transform and color transition preparation**Fix Critical Accessibility Issue - Semantic HTML Structure (8 test failures)****Story 026.02 Complete - Ready for Next Assessment**

- Add performance optimizations (`will-change`, `backface-visibility`)

- Ensure hardware-accelerated transforms are used



### Step 3: Create MagicPhaseAnimator ClassThe assessment revealed missing semantic HTML elements across all browsers (chromium, webkit, Mobile Chrome, Mobile Safari). This is a WCAG compliance issue affecting screen reader navigation.Story 026.02-BIZ-SCROLL-LOCKED-REVEAL (formerly BIZ-VIEWPORT-FIXED-OVERLAY) has been successfully implemented with position:sticky approach after user correction.



Create `src/magic-phase-animator.ts` with:

- Constructor that accepts the ScrollLockedReveal instance

- Hook into the progressive reveal system's update cycle### Root Cause**Completed Work**:

- Implement `updateMagicAnimations()` to only animate during 0-20% scroll range

- Implement `animateSegment1()` with floating motion and magic word glowCurrent HTML structure lacks proper semantic elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`), making the page inaccessible to screen readers and failing accessibility tests.- ✅ ScrollLockedReveal class implemented (150 lines)

- Implement `animateSegment2()` with slide-in and speed word energy pulse

- Add easing functions: `easeOutQuart()` and `easeOutBack()`- ✅ Scroll-stage + sticky-panel architecture

- Add helper: `mapToSegmentProgress()`

### Implementation Steps- ✅ Progressive reveal with smoothstep easing

### Step 4: Integrate MagicPhaseAnimator into App

- ✅ 20 unit tests + 10 E2E tests (all passing)

Update `src/app.ts` to:

- Import MagicPhaseAnimator1. **Audit current HTML structure** (`index.html`)- ✅ All 277 tests passing (excellent test coverage)

- Initialize it after ScrollLockedReveal is created

- Pass the ScrollLockedReveal instance to the animator   - Identify all non-semantic containers (divs without semantic meaning)- ✅ All code quality gates passing (linting, formatting, type checking)



### Step 5: Test and Validate   - Map content areas to appropriate semantic elements- ✅ Story document rewritten to describe WHAT not HOW



Run tests and manually verify:   - Review WCAG 2.1 requirements for semantic structure- ✅ Committed to git (commit 8a01b3b)

- All 277 existing tests still pass

- Animations work during 0-20% scroll range

- Bidirectional scrolling works correctly

- Performance remains at 60fps2. **Add semantic HTML elements****Next Action**: Re-run traceability assessment to validate all remaining stories and determine overall project readiness.

- Mobile/touch devices work properly

   - Wrap site header in `<header>` element

## NEXT

   - Wrap main content in `<main>` element  ### Implementation Steps

### Fix Test Cleanup Issues (Non-blocking)

   - Wrap navigation in `<nav>` element

Fix the uncaught exceptions in `tests/scroll-locked-reveal.test.ts`:

- Add proper timer cleanup in test teardown hooks   - Use `<section>` for narrative segments### Implementation Summary

- Clear any active `requestAnimationFrame` calls

- Ensure no references to `window` exist after test environment destruction   - Use `<article>` for standalone content pieces

- Verify the 3 uncaught exceptions are resolved

   - Add `<footer>` if footer content existsStory 026.02 was initially implemented with position:fixed approach but user testing revealed critical issues (content "jiggling" and blocking scrolling). After user provided working HTML demo showing position:sticky pattern, the implementation was completely redesigned.

### Update Dependencies (Low priority, non-blocking)



After story completion, consider updating:

- `netlify-cli`: 23.9.4 → 23.9.5 (fixes 2 low-severity security vulnerabilities)3. **Update CSS selectors** (`src/style.css`)**Final Implementation** (position:sticky approach):

- Other patch/minor updates as identified in assessment Phase 1

   - Replace div-based selectors with semantic element selectors where appropriate1. ✅ ScrollLockedReveal class (`src/scroll-locked-reveal.ts`) - 150 lines

## LATER

   - Ensure styling remains consistent after HTML changes   - Scroll-stage container creates scroll distance

### Story 026.04 and Beyond

   - Test responsive behavior with new semantic structure   - Sticky-panel uses CSS position:sticky (no JS position switching)

Continue implementing the remaining interactivity stories from Release 1.0 MVP Problem Validation:

- Story 026.04 and subsequent animation phases for other acts   - Progressive reveal with smoothstep easing

- Additional cinematic effects building on the MagicPhaseAnimator foundation

- Expand the animation system established here to other narrative segments4. **Update JavaScript selectors** (if any rely on specific HTML structure)   - ResizeObserver for responsive updates



### Bundle Size Optimization   - Review all querySelector/querySelectorAll calls



Address the build warning about large bundle size (513 KB):   - Update selectors to work with new semantic structure2. ✅ CSS styling (`src/style.css`)

- Consider code splitting strategies

- Evaluate lazy loading for Three.js and other large dependencies   - Ensure no hard-coded assumptions about HTML hierarchy   - `.scroll-stage` with dynamic height calculation

- Use dynamic imports for non-critical features

   - `.sticky-panel` with position: sticky; top: 0

5. **Verify accessibility**   - `[data-reveal-start]` for progressive element reveal

   - Run `npm run e2e -- tests/e2e/accessibility.spec.ts` to confirm fixes   - `@media (prefers-reduced-motion)` support

   - Use browser DevTools to verify semantic structure

   - Test with screen reader (VoiceOver on macOS) if available3. ✅ HTML structure (`index.html`)

   - Wrapped narrative in `.scroll-stage` container

### Success Criteria   - Added `.sticky-panel` wrapper

- ✅ All 8 accessibility E2E tests passing   - Data attributes for reveal timing

- ✅ Semantic HTML elements present: header, main, nav, sections

- ✅ No regressions in visual styling or functionality4. ✅ Integration (`src/main.ts`)

- ✅ Screen reader can navigate page structure   - Import and instantiate ScrollLockedReveal

   - No scrollDetector dependency needed

---

5. ✅ Tests

## NEXT   - 20 unit tests (`tests/scroll-locked-reveal.test.ts`)

   - 10 E2E tests (`tests/e2e/scroll-locked-reveal.spec.ts`)

### 1. Fix Narrative Layout - Height & Positioning (20 test failures)   - All 277 tests passing



**Issue**: Narrative content height/positioning requirements failing across all device types6. ✅ Story documentation updated

   - Title changed to "Scroll-Locked Narrative Reveal"

**Root Cause**: CSS calculations not meeting exact requirements:   - Requirements focus on WHAT (outcome) not HOW (implementation)

- 80vh height requirement not met on mobile (375x667), tablet (768x1024), desktop (1920x1080)   - Implementation notes provide guidance without prescribing approach

- 10vh top/bottom margin requirement failing

- Flex layout implementation incorrect## NEXT



**Implementation**:**Re-run Complete Assessment**

1. Review narrative content CSS in `src/style.css`

2. Fix height calculation to exactly 80vh for narrative content areaAfter story 026.02 is complete:

3. Fix positioning to maintain 10vh top and bottom margins

4. Fix flex layout implementation for proper content distribution1. **Re-run Traceability Validation**

5. Test across all three viewport sizes   - Validate remaining 50 traceability files (fail-fast approach)

6. Verify with: `npm run e2e -- tests/e2e/narrative-height-validation.spec.ts`   - Identify any other incomplete stories

   - Generate updated implementation-progress.md

**Files to modify**: `src/style.css`, possibly `index.html` if structure needs adjustment

2. **Verify Quality Gates**

---   - Ensure all 257+ tests still passing

   - Verify linting, formatting, type checking clean

### 2. Resolve Problem P003 - Button Overlapping 3D Cube (12 test failures)   - Confirm no new problems introduced



**Issue**: "Coming Soon" button overlapping 3D cube across all browsers3. **Assessment Decision Point**

   - If all stories PASS: ✅ **READY FOR NEW STORY DEVELOPMENT**

**Root Cause**: Z-index stacking context issue - button not properly layered above 3D canvas   - If any story FAILS: ⚠️ **BLOCKED BY STORIES** (repeat completion cycle)



**Implementation**:---

1. Check `docs/problems/003-coming-soon-overlapping-3d-cube.closed.md` for context

2. Review z-index stacking in `src/style.css`## LATER

3. Ensure button has higher z-index than 3D canvas

4. Verify stacking context isn't broken by parent elements**Future work (after story 026.02 complete and all stories validated)**

5. Maintain button readability over 3D background

6. Test across chromium, webkit, and mobile browsers### 1. Continue Narrative Enhancement

7. Verify with: `npm run e2e -- tests/e2e/p003-button-overlap.test.ts`If all traceability validation passes:

- Pull next story from backlog (likely related to cinematic effects)

**Files to modify**: `src/style.css`, possibly button HTML structure- Implement scroll-driven animation effects

- Add dynamic content reveals based on scroll position

**Note**: Problem marked as "closed" but tests still failing - may need to reopen or verify fix was reverted- Enhance user engagement tracking



---### 2. Optional Dependency Updates (when packages mature)

After story work is unblocked, consider optional updates:

### 3. Fix Scroll-Locked Reveal - Opacity Issues (4 test failures - webkit/Mobile Safari)- **Oct 25**: jsdom@27.0.1 (currently 5 days old)

- **Oct 27**: @typescript-eslint packages (currently 3 days old)

**Issue**: Story 026.02 acceptance criteria failing - elements visible too early- **Oct 28**: @axe-core/playwright, @types/node, happy-dom (currently 2 days old)

- **Oct 29**: Netlify-cli security update per SECURITY-INCIDENT-2025-10-23

**Root Cause**: Initial opacity and progressive reveal opacity calculations incorrect:- **Oct 30**: vite, vitest (major version - requires review)

- Elements start at opacity 0.5 (expected ≤ 0.1)

- Progressive reveal at opacity 0.5 (expected ≤ 0.2 before scroll)### 3. Performance Monitoring

- Monitor viewport-fixed positioning performance

**Implementation**:- Track scroll event handling efficiency

1. Review `src/scroll-locked-reveal.ts` opacity calculations- Optimize requestAnimationFrame usage if needed

2. Fix initial element opacity to be ≤ 0.1 (nearly invisible)- Document any performance characteristics

3. Fix progressive reveal opacity to be ≤ 0.2 before scroll threshold

4. Ensure webkit/Mobile Safari compatibility (may need vendor prefixes or polyfills)### 4. Documentation Updates

5. Review CSS transitions in `src/style.css` for `[data-reveal-start]` elements- Document ViewportFixedOverlay architecture

6. Test specifically on webkit: `npm run e2e -- tests/e2e/scroll-locked-reveal.spec.ts --project=webkit`- Update library usage guides if needed

- Record lessons learned from cinematic implementation

**Files to modify**: `src/scroll-locked-reveal.ts`, `src/style.css`

---

**Story reference**: Check `prompts/release-1.0/in-scope/026.02-BIZ-SCROLL-LOCKED-REVEAL.md` for acceptance criteria

## Notes

---

**Story Completion Priority**: Story 026.02 must be completed before any new story development per assessment policy. Dependency updates are optional and can wait.

### 4. Fix FOUC Prevention - Visual Flicker (1 test failure - chromium)

**Technical Foundation**: Excellent foundation already in place:

**Issue**: Visual flicker detected during page load- ✅ ScrollNarrativeDetector working perfectly (dependency satisfied)

- ✅ All 257 tests passing (strong quality foundation)

**Root Cause**: CSS loading timing - critical CSS not loaded before content renders- ✅ All code quality gates passing (professional standards)

- ✅ Zero unresolved problems (clean issue tracker)

**Implementation**:

1. Review CSS loading strategy in `index.html`**Assessment Framework**: Using fail-fast traceability validation to efficiently identify incomplete stories. Only 1 file checked before finding 026.02 incomplete (efficient process).

2. Consider inlining critical CSS (above-the-fold styles)

3. Add `preload` link for main stylesheet if not present**Gall's Law Compliance**: Building sophisticated cinematic storytelling incrementally. Story 026.01 (scroll detection) working; now adding 026.02 (viewport-fixed overlay) as next layer.

4. Ensure fonts load without FOUT/FOIT

5. Review class application timing in JavaScript**Next Full Assessment**: After story 026.02 complete, re-run traceability validation to check remaining 50 stories.

6. Verify with: `npm run e2e -- tests/e2e/fouc-prevention.test.ts`

**Files to modify**: `index.html`, possibly `src/style.css` for critical CSS extraction

**Approach**: Start simple - inline critical CSS first, then optimize if needed (Gall's Law)

---

### 5. Fix Responsive Breakpoint Integrity (4 test failures)

**Issue**: Layout integrity failing during breakpoint transitions

**Root Cause**: Media query transitions causing layout shifts or broken styling

**Implementation**:
1. Review responsive CSS in `src/style.css`
2. Identify breakpoint transition points
3. Test layout at exact breakpoint boundaries (where media queries activate)
4. Ensure smooth transitions without layout jumps
5. Verify container queries if used
6. Verify with: `npm run e2e -- tests/e2e/functional-layout.test.ts`

**Files to modify**: `src/style.css`

---

## LATER

### 1. Fix Screenshot Validation Failures (4 tests - LOW priority)

**Issue**: Business area screenshot validation failing on desktop-landscape

**Root Cause**: Visual regression - screenshot baseline may be outdated or layout changed

**Implementation**:
- Review screenshot baseline images
- Verify current layout is correct
- Update baseline if layout changes are intentional
- Investigate if layout issue causing visual difference

**Files affected**: Screenshot baseline images, possibly layout CSS

---

### 2. Fix Scroll Narrative Detection Issues (3 tests - LOW priority)

**Issue**: Viewport detection logging issues, cross-viewport consistency failing

**Root Cause**: Scroll narrative detector logging when it shouldn't or inconsistent across viewports

**Implementation**:
- Review `src/scroll-narrative-detector.ts` logic
- Fix viewport detection boundaries
- Ensure consistent behavior across device sizes
- Review test expectations - may be too strict

**Files to modify**: `src/scroll-narrative-detector.ts`

---

### 3. Fix Mobile 3D Cube Resize (1 test - LOW priority)

**Issue**: Cube size jump prevention on mobile scroll failing

**Root Cause**: ResizeObserver or scroll event handling causing cube resize during scroll

**Implementation**:
- Review `src/three-animation.ts` resize logic
- Check if Problem 005 solution was reverted (`docs/problems/005-mobile-3d-cube-size-jump-scroll.closed.md`)
- Prevent resize calculations during active scroll
- Debounce resize handler if needed

**Files to modify**: `src/three-animation.ts`

---

### 4. Fix 3D Cube Performance Validation (1 test - LOW priority)

**Issue**: Performance mode improvement validation failing on Mobile Chrome

**Root Cause**: Test expects performance improvement between normal/performance modes, not being detected

**Implementation**:
- Review `src/three-animation.ts` performance mode logic
- Ensure performance mode actually reduces complexity
- Verify FPS measurement is working correctly
- May need to adjust test thresholds for CI environment

**Files to modify**: `src/three-animation.ts` or test expectations

**Note**: Low priority as this is test environment specific, not affecting production users

---

### 5. Optional Dependency Updates (Non-blocking)

After E2E tests are all passing, consider these optional updates:

**Immediate** (meets 7-day maturity):
- `jsdom` 27.0.0 → 27.0.1 (published Oct 18, 7 days old)

**Scheduled Updates**:
- **Oct 27** (2 days): @typescript-eslint/eslint-plugin, @typescript-eslint/parser
- **Oct 28** (3 days): @axe-core/playwright, @types/node, happy-dom  
- **Oct 30** (5 days): vite
- **Oct 31** (6 days): netlify-cli, vitest 4.0.3*, @vitest/coverage-v8 4.0.3*

*Major version updates - review breaking changes before upgrading

**Process**:
1. Wait for each maturity date
2. Review changelogs for breaking changes (especially vitest 3.x → 4.x)
3. Upgrade packages
4. Run full test suite to verify compatibility
5. Commit with descriptive message

---

## Notes

**Priority Order Rationale**:
- **NOW**: Accessibility is WCAG compliance requirement, affects all users with disabilities
- **NEXT 1-3**: Critical story acceptance criteria and known problems (blocks new development)
- **NEXT 4-5**: Medium priority UX issues (FOUC, responsive design)
- **LATER**: Low priority issues that don't block users or development

**Gall's Law Compliance**:
- Fix one critical issue at a time
- Test after each fix to ensure no regressions
- Start with simplest solutions (e.g., inline critical CSS before complex optimization)
- Iterate and improve based on test results

**Testing Strategy**:
- Run specific E2E test file after each fix to verify
- Run full E2E suite (`npm run e2e`) after each major fix
- Run unit tests (`npm test`) frequently to catch regressions
- Keep all 277 unit tests passing throughout

**Definition of Done** (for NOW section):
- All 8 accessibility E2E tests passing
- No regressions in other test suites
- Code linting, formatting, type-checking still clean
- Changes committed to git with descriptive message

**Next Full Assessment**:
After all 54 E2E test failures are resolved, re-run comprehensive assessment to verify project is ready for new story development.
