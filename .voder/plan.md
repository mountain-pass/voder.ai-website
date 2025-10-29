# Implementation Plan# Implementation Plan# Implementation Plan



## NOW



Fix the test failure in `scroll-locked-reveal.test.ts` that is blocking all development.## NOW## NOW



**Issue**: Unhandled error after test teardown - `ReferenceError: window is not defined` at line 93 in `src/scroll-locked-reveal.ts`. The `ScrollLockedReveal` class has a timer that continues running after the test environment is torn down, attempting to access `window` which is no longer available.



**Root Cause**: The `ScrollLockedReveal` class uses `requestAnimationFrame` to schedule updates, but these animation frames are not properly cancelled when tests complete, causing them to execute after the JSDOM environment has been cleaned up.**Execute Overdue Security Update - netlify-cli (BLOCKING - Security)****Implement Comprehensive Animation System (ADR-0037 ACCEPTED)**



**Fix Strategy**:

1. Ensure the `destroy()` method in `ScrollLockedReveal` properly cancels any pending animation frames

2. Update the test file to ensure `destroy()` is called in `afterEach()` for all test instances**Priority**: 🚨 IMMEDIATE (Security incident resolution overdue by 1 day)**Date**: 2025-01-28

3. Verify the fix by running the full test suite

**Status**: READY TO IMPLEMENT

**Expected Outcome**: All 377 tests pass with 0 unhandled errors.

### Background

## NEXT

### Decision Made

After the test fix is verified:

1. Commit the test fix changes with clear descriptionSecurity incident `SECURITY-INCIDENT-2025-10-23-netlify-cli-pino-fast-redact.proposed.md` has a scheduled resolution date of **October 29, 2025** which has now **PASSED** (current date: October 30, 2025).

2. Run a full quality check (lint, format, test)

3. Push the changes to originADR-0037 has been **ACCEPTED**. We will implement a comprehensive animation system to solve the systemic issues with ad-hoc animation coordination.



## LATERThe incident documents:



After test failures are resolved and committed:- 2 LOW severity vulnerabilities (fast-redact prototype pollution, pino transitive)**File**: `docs/decisions/0037-comprehensive-animation-system.accepted.md`

1. Re-run the full assessment process to complete phases 4-10

2. Continue with any other implementation work identified in subsequent assessments- Planned update: netlify-cli 23.9.4 → 23.9.5


- Update reached 7-day maturity on October 29, 2025### Current Animation Issues

- Scheduled for execution on October 29, 2025

- **Status**: OVERDUE by 1 dayStory 026.03-BIZ-MAGIC-PHASE-ANIMATION has these problems:

- Segment 2 animation getting stuck on left side

### Implementation Steps- Complex state management (6 flags) causing coordination issues

- 11 test failures due to fragile timing logic

1. **Execute Security Update**- Multiple fix attempts increased complexity without solving root cause

   ```bash

   npm update netlify-cli**Root Cause**: Ad-hoc animation coordination with scattered state management.

   ```

**Solution**: Build comprehensive animation system per ADR-0037.

2. **Verify Update Applied**

   ```bash### Implementation Plan

   npm list netlify-cli

   # Should show: netlify-cli@23.9.5**Phase 1: Core Animation System** (Week 1 - Starts Now)

   ```

1. **Design Animation Base Interface**

3. **Verify Vulnerabilities Resolved**   - Define animation types: scroll-scrubbed, scroll-triggered, time-based

   ```bash   - Create state lifecycle: idle → triggered → active → completed → reset

   npm audit   - Design dependency declaration API

   # Should show: 0 vulnerabilities (or reduced from 2)   - Plan queuing mechanism

   ```

2. **Implement Core System**

4. **Test Functionality**   - Create `AnimationCoordinator` class

   ```bash   - Implement `BaseAnimation` interface/abstract class

   # Run linting   - Build state management with lifecycle hooks

   npm run lint   - Add dependency resolution system

      - Implement animation queue

   # Run unit tests

   npm test3. **Add Testing Infrastructure**

      - Unit tests for state transitions

   # Verify netlify CLI works   - Tests for dependency resolution

   netlify --version   - Tests for queuing behavior

   ```   - Mock utilities for testing animations



5. **Update Security Incident Status**4. **Documentation**

   - Rename: `SECURITY-INCIDENT-2025-10-23-netlify-cli-pino-fast-redact.proposed.md`   - API documentation

   - To: `SECURITY-INCIDENT-2025-10-23-netlify-cli-pino-fast-redact.resolved.md`   - Usage examples

   - Update status from PROPOSED to RESOLVED   - Migration guide for existing animations

   - Document resolution date: October 30, 2025

   - Add post-resolution verification notes**Phase 2: Migration** (Week 2)



6. **Commit Changes**1. **Migrate SparklerAnimator**

   ```bash   - Refactor to use new animation system

   git add package.json package-lock.json docs/security-incidents/   - Maintain existing visual behavior

   git commit -m "security: resolve netlify-cli vulnerabilities (fast-redact/pino)   - Update tests



   - Update netlify-cli from 23.9.4 to 23.9.52. **Migrate MagicPhaseAnimator Segment 1**

   - Resolves CVE: fast-redact prototype pollution (LOW)   - Refactor bobbing animation to new system

   - Resolves CVE: pino transitive vulnerability (LOW)   - Preserve scroll-scrubbed behavior

   - Closes security incident: SECURITY-INCIDENT-2025-10-23   - Update tests

   - Resolution was scheduled for Oct 29, executed Oct 30"

   ```3. **Migrate MagicPhaseAnimator Segment 2**

   - Refactor to use new system with sparkler dependency

### Success Criteria   - Fix stuck-on-left bug through proper state management

   - Update tests to reflect time-based behavior

- ✅ netlify-cli updated to 23.9.5

- ✅ npm audit shows vulnerabilities reduced (0 or fewer than 2)4. **Remove Old Coordination Code**

- ✅ All tests passing (no breaking changes)   - Delete ad-hoc state management

- ✅ netlify CLI functional   - Clean up complex opacity logic

- ✅ Security incident status updated to RESOLVED   - Simplify animation classes

- ✅ Changes committed to git

**Phase 3: Validation** (Week 3)

### Expected Outcome

1. **End-to-End Testing**

After this update:   - Test all animations together

- Security vulnerabilities resolved (2 LOW → 0)   - Verify sparkler → segment 2 coordination

- Security incident properly closed   - Test edge cases (quick scroll, reverse scroll)

- Development can proceed without security blocking condition

- Assessment can continue from Phase 3 (Code Quality Validation)2. **Fix Test Failures**

   - Address 11 failing tests

## NEXT   - Update test expectations for new system

   - Achieve >90% test coverage target

**Execute Mature Package Updates (After Security Fix)**

3. **Performance Testing**

After completing the security update in NOW section, proceed with these mature package updates that meet the 7-day maturity threshold:   - Measure animation performance

   - Optimize if needed

### Phase 1: Mature Minor/Patch Updates (Ready Now)   - Verify no jank or stuttering



**@axe-core/playwright: 4.10.2 → 4.11.0** (9 days old - SAFE)4. **Documentation Updates**

```bash   - Update developer guide

npm install @axe-core/playwright@4.11.0 --save-dev   - Document animation system usage

npm test   - Add troubleshooting guide

```

### Success Criteria

**@typescript-eslint packages: 8.46.1 → 8.46.2** (10 days old - SAFE)

```bashPer ADR-0037:

npm install @typescript-eslint/eslint-plugin@8.46.2 @typescript-eslint/parser@8.46.2 --save-dev- ✅ Zero animation timing bugs

npm run lint- ✅ >90% test coverage for animation system

npm test- ✅ <1 hour to add new scroll-triggered animation

```- ✅ All existing animations working correctly

- ✅ 11 failing tests fixed

**Success Criteria**:

- All updates applied without errors### Next Actions

- All 257 tests still passing

- Linting clean1. **Start Phase 1**: Design and implement core animation system

- No breaking changes introduced2. **Create feature branch**: `feature/comprehensive-animation-system`

3. **Set up project structure**: Create `src/animations/` directory

### Phase 2: Continue Assessment Process4. **Begin implementation**: Start with AnimationCoordinator class



After dependency updates complete, resume assessment from Phase 3:## NEXT



1. **Phase 3: Code Quality Validation**### If ADR-0037 Accepted: Implement Animation System

   - Run comprehensive linting (ESLint, Stylelint, HTMLHint, Markdownlint)

   - Verify Prettier formatting**Phase 1: Core Animation System** (Week 1)

   - TypeScript type checking1. Design animation base interface/class

   - Production build verification2. Implement state management (idle, triggered, active, completed, reset)

3. Create dependency resolution system

2. **Phase 4: Documentation Validation**4. Build queuing mechanism

   - Verify 103 markdown files current5. Add comprehensive tests

   - Check for broken links

   - Validate npm scripts exist**Phase 2: Migration** (Week 2)

1. Refactor SparklerAnimator to use new system

3. **Phase 5: Testing Validation**2. Refactor MagicPhaseAnimator segment 1 to use new system

   - Run full test suite (unit + E2E)3. Refactor MagicPhaseAnimator segment 2 to use new system

   - Verify coverage thresholds4. Update all animation tests

   - Check for test failures5. Verify zero timing bugs



4. **Phase 6-11: Remaining Assessment Phases****Phase 3: Validation** (Week 3)

   - Runtime, Version Control, Pipeline, Problems, Traceability, Final Report1. End-to-end testing of all animations

2. Performance testing

## LATER3. Test coverage validation (target >90%)

4. Documentation updates

**Monitor Fresh Packages for Maturity (Nov 4, 2025)**

### If ADR-0037 Rejected: Alternative Approaches

The following packages are currently too fresh (<7 days old) and should be monitored:

1. **External Library Evaluation**

### Fresh Packages - Wait Until Nov 4   - Research GSAP ScrollTrigger

   - Research Framer Motion

**happy-dom: 20.0.2 → 20.0.10** (2 days old - WAIT)   - Evaluate bundle size impact

- Release Date: 2025-10-28   - Create POC with one animation

- Eligible: November 4, 2025 (needs 5 more days)

- Update Type: Patch (crosses 8 versions: 20.0.2→20.0.10)2. **Simplified Coordination**

- Note: Multiple rapid patch releases suggest active bug fixing   - Remove sparkler dependency from segment 2

- Action: Wait for stability, monitor for 20.0.11+ releases   - Use simpler trigger conditions

   - Accept some edge case bugs

**@types/node: 24.7.2 → 24.9.2** (2 days old - WAIT)

- Release Date: 2025-10-28## LATER

- Eligible: November 4, 2025 (needs 5 more days)

- Update Type: Patch (crosses multiple versions)### After Animation System Complete

- Action: Wait for maturity before updating

1. **Continue Story 026.03**

### Analyze Remaining Packages   - Implement remaining Act 1 segments

   - Add additional cinematic effects

**vite: 7.1.11 → 7.1.12** (needs release date check)   - Expand animation capabilities

```bash

npm view vite@7.1.12 time2. **Story 026.04 and Beyond**

```   - Implement Act 2 animations

   - Implement Act 3 animations

**jsdom: 27.0.0 → 27.0.1** (needs release date check)   - Build on established animation system

```bash

npm view jsdom@27.0.1 time3. **Test Cleanup**

```   - Fix 10 failing tests in magic-phase-animator.test.ts

   - Fix 2 failing tests in sparkler-animator.test.ts

### Major Version Updates - Requires Migration Analysis   - Achieve 100% test pass rate



**vitest: 3.2.4 → 4.0.5** (MAJOR UPDATE)4. **Optional Dependency Updates**

- Breaking changes expected   - Review and update dependencies per security policy

- Requires changelog review   - Monitor for security vulnerabilities

- May need test updates

- Should update with @vitest/coverage-v8 together## Notes

- Action: Research breaking changes, create migration plan

**Current Blockers**:

**@vitest/coverage-v8: 3.2.4 → 4.0.5** (MAJOR UPDATE - tied to vitest)- Segment 2 animation coordination issues

- Must be updated together with vitest- Complex state management causing bugs

- Same breaking changes apply- Need architectural decision on animation system

- Action: Update simultaneously with vitest

**Test Status**:

**eslint-plugin-unicorn: 61.0.2 → 62.0.0** (MAJOR UPDATE)- 327 passing / 337 total tests (97% pass rate)

- May introduce new linting rules- 10 failures in animation coordination tests

- Requires changelog review

- Action: Research breaking changes, verify lint rules**Decision Required**:

- Accept ADR-0037 and implement comprehensive system

### Future Assessment Cycles- OR choose alternative approach

- Decision needed to unblock development

After all updates complete:

1. Re-run full 11-phase assessment**Gall's Law Violation**:

2. Verify no regressions introducedCurrent animation implementation has become complex without working reliably. Need to step back to simpler working system, then build up correctly.

3. Update security incident tracking

4. Document any new issues discovered

5. Pull next story from backlog for development



## NotesUpdate `index.html` to add the necessary data attributes and classes for Act 1 (Magic Phase) segments:



### Current Project Status- Add `data-act="1"` to Act 1 segments (first ~20% of scroll narrative)



**Quality**: ✅ EXCELLENT- Add `data-segment="1"` and `data-segment="2"` to the first two segments------

- All 257 tests passing (100%)

- All code quality checks passing- Add `.magic-word` class to the word "magic" 

- Production build working

- Zero critical issues- Add `.speed-word` class to "fast" and "exciting" words



**Security**: ⚠️ 1 OVERDUE SECURITY UPDATE

- 2 LOW severity vulnerabilities in netlify-cli dependencies

- Security incident resolution date passed (Oct 29 → now Oct 30)### Step 2: Create CSS Foundation## NOW## NOW

- Must execute planned update immediately



**Dependencies**: 📊 11 OUTDATED PACKAGES

- 1 security update (OVERDUE - execute NOW)Create CSS styles for the magic phase animations in `src/style.css`:

- 3 mature updates (ready for NEXT)

- 2 fresh packages (wait until Nov 4)- Add `.magic-word` styling with text-shadow animation preparation

- 2 need release date analysis

- 3 major version updates (require migration planning)- Add `.speed-word` styling with transform and color transition preparation**Fix Critical Accessibility Issue - Semantic HTML Structure (8 test failures)****Story 026.02 Complete - Ready for Next Assessment**



### Blocking Conditions- Add performance optimizations (`will-change`, `backface-visibility`)



**CRITICAL BLOCKER**: Overdue security update- Ensure hardware-accelerated transforms are used

- Blocks: All assessment phases after Phase 2

- Blocks: New story development

- Action: MUST execute security update in NOW section first

### Step 3: Create MagicPhaseAnimator ClassThe assessment revealed missing semantic HTML elements across all browsers (chromium, webkit, Mobile Chrome, Mobile Safari). This is a WCAG compliance issue affecting screen reader navigation.Story 026.02-BIZ-SCROLL-LOCKED-REVEAL (formerly BIZ-VIEWPORT-FIXED-OVERLAY) has been successfully implemented with position:sticky approach after user correction.

**After Security Fix**: No blockers

- Can proceed with mature package updates

- Can continue assessment from Phase 3

- Can pull new stories from backlogCreate `src/magic-phase-animator.ts` with:



### Gall's Law Compliance- Constructor that accepts the ScrollLockedReveal instance



Current approach follows Gall's Law:- Hook into the progressive reveal system's update cycle### Root Cause**Completed Work**:

- Fix security issue first (simple, focused)

- Update mature packages incrementally (proven stability)- Implement `updateMagicAnimations()` to only animate during 0-20% scroll range

- Wait for fresh packages to mature (avoid premature complexity)

- Analyze major updates carefully (understand breaking changes)- Implement `animateSegment1()` with floating motion and magic word glowCurrent HTML structure lacks proper semantic elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`), making the page inaccessible to screen readers and failing accessibility tests.- ✅ ScrollLockedReveal class implemented (150 lines)

- Test thoroughly after each change (maintain working system)

- Implement `animateSegment2()` with slide-in and speed word energy pulse

### Assessment Process

- Add easing functions: `easeOutQuart()` and `easeOutBack()`- ✅ Scroll-stage + sticky-panel architecture

Following fail-fast methodology:

- Phase 1 identified dependency issues- Add helper: `mapToSegmentProgress()`

- Phase 2 identified overdue security update (BLOCKING)

- Skipped to immediate action (security fix)### Implementation Steps- ✅ Progressive reveal with smoothstep easing

- Will resume from Phase 3 after resolution

### Step 4: Integrate MagicPhaseAnimator into App

### Security Policy Compliance

- ✅ 20 unit tests + 10 E2E tests (all passing)

Per `.github/prompts/processes/SECURITY-POLICY.md`:

- ✅ Checked status of proposed incidentsUpdate `src/app.ts` to:

- ⚠️ Found overdue resolution date (Oct 29 < Oct 30)

- 🚨 MUST execute planned update immediately- Import MagicPhaseAnimator1. **Audit current HTML structure** (`index.html`)- ✅ All 277 tests passing (excellent test coverage)

- ✅ Following documented update plan from incident

- Initialize it after ScrollLockedReveal is created

### Next Full Assessment

- Pass the ScrollLockedReveal instance to the animator   - Identify all non-semantic containers (divs without semantic meaning)- ✅ All code quality gates passing (linting, formatting, type checking)

After completing NOW + NEXT sections:

- Re-run comprehensive 11-phase assessment

- Verify all dependency updates successful

- Check for any new issues introduced### Step 5: Test and Validate   - Map content areas to appropriate semantic elements- ✅ Story document rewritten to describe WHAT not HOW

- Generate updated assessment report

- Determine if ready for new story development


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
