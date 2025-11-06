# Implementation Plan# Implementation Plan# Implementation Plan# Implementation Plan# Implementation Plan



## NOW



**Fix Security Vulnerabilities and Update Dependencies**## NOW



Based on the assessment completed on 2025-11-06, we have BLOCKING security and dependency issues that must be resolved before any new development work.



### 1. Fix Moderate Security Vulnerability in `tar`**Fix E2E Test Failures (21 failures blocking Phase 6 Runtime Validation)**## NOW



The assessment identified a moderate severity vulnerability in `tar@7.5.1` (CVE: GHSA-29xp-372q-xqph - Race condition leading to uninitialized memory exposure) which is a transitive dependency via `netlify-cli`.



**Actions:**The E2E test suite shows 21 failures across multiple categories that need to be addressed:

1. Update `netlify-cli` which should bring in the fixed version of `tar`:

   ```bash

   npm update netlify-cli@23.10.0

   ```### Priority 1: P003 Button Overlap Issues (6 failures)Fix the test failure in `scroll-locked-reveal.test.ts` that is blocking all development.## NOW## NOW



2. If that doesn't resolve it, try audit fix:- 2 chromium failures: button overlapping 3D cube, z-index stacking

   ```bash

   npm audit fix- 2 webkit failures: same issues

   ```

- 2 Mobile Chrome failures: same issues

3. Verify the fix:

   ```bash**Issue**: Unhandled error after test teardown - `ReferenceError: window is not defined` at line 93 in `src/scroll-locked-reveal.ts`. The `ScrollLockedReveal` class has a timer that continues running after the test environment is torn down, attempting to access `window` which is no longer available.

   npm audit

   ```**Root Cause**: Tests expect canvas z-index: 0, but actual z-index: 1

   Expected: No moderate or higher severity vulnerabilities



4. Run quality checks:

   ```bash**Fix Strategy**:

   npm run lint

   npm test1. Review `src/style.css` for `.hero-animation` canvas z-index**Root Cause**: The `ScrollLockedReveal` class uses `requestAnimationFrame` to schedule updates, but these animation frames are not properly cancelled when tests complete, causing them to execute after the JSDOM environment has been cleaned up.**Execute Overdue Security Update - netlify-cli (BLOCKING - Security)****Implement Comprehensive Animation System (ADR-0037 ACCEPTED)**

   npm run build

   ```2. Update to `z-index: 0` to ensure canvas stays in background



5. Commit the security fix:3. Verify button elements have higher z-index (auto or 1+)

   ```bash

   git add package.json package-lock.json

   git commit -m "fix: update netlify-cli to resolve tar CVE-2025-XXXXX

### Priority 2: Functional Layout Issues (4 failures)**Fix Strategy**:

- Update netlify-cli@23.10.0 to fix moderate severity CVE

- Resolves tar race condition vulnerability (GHSA-29xp-372q-xqph)- Layout integrity failing at 320px breakpoint across browsers

- All tests passing after update"

   git push origin main- Horizontal overflow detected at narrow viewport1. Ensure the `destroy()` method in `ScrollLockedReveal` properly cancels any pending animation frames

   ```



### 2. Update Mature Dependencies (>= 7 days old)

**Root Cause**: Responsive CSS not handling very narrow viewports properly2. Update the test file to ensure `destroy()` is called in `afterEach()` for all test instances**Priority**: 🚨 IMMEDIATE (Security incident resolution overdue by 1 day)**Date**: 2025-01-28

Apply the 10 mature package updates identified by the Smart Version Selection Algorithm:



```bash

npm update @axe-core/playwright@4.11.0**Fix Strategy**:3. Verify the fix by running the full test suite

npm update @types/node@24.10.0

npm update @typescript-eslint/eslint-plugin@8.46.31. Review media queries for 320px breakpoint handling

npm update @typescript-eslint/parser@8.46.3

npm update happy-dom@20.0.102. Add proper overflow constraints for mobile viewports**Status**: READY TO IMPLEMENT

npm update jsdom@27.1.0

npm update three@0.181.03. Test layout at exact 320px width

npm update @types/three@0.181.0

```**Expected Outcome**: All 377 tests pass with 0 unhandled errors.



**Verification:**### Priority 3: FOUC Prevention (1 failure)

```bash

npm run lint- CLS (Cumulative Layout Shift) score of 1 (expected < 0.1)### Background

npm test

npm run build

npm run test:e2e

```**Root Cause**: Content shifting during page load## NEXT



**Commit:**

```bash

git add package.json package-lock.json**Fix Strategy**:### Decision Made

git commit -m "chore: update mature dependencies

1. Review critical CSS loading strategy

- Update @axe-core/playwright@4.11.0 (accessibility testing)

- Update @types/node@24.10.0 (type definitions)2. Consider inlining critical above-the-fold stylesAfter the test fix is verified:

- Update @typescript-eslint/* @8.46.3 (linting)

- Update happy-dom@20.0.10 (test environment)3. Ensure fonts load without causing layout shift

- Update jsdom@27.1.0 (test environment)

- Update three@0.181.0 and @types/three@0.181.0 (3D library)1. Commit the test fix changes with clear descriptionSecurity incident `SECURITY-INCIDENT-2025-10-23-netlify-cli-pino-fast-redact.proposed.md` has a scheduled resolution date of **October 29, 2025** which has now **PASSED** (current date: October 30, 2025).



All packages >= 7 days old per Smart Version Selection Algorithm### Priority 4: Scroll Narrative Detection (3 failures)

All tests passing after updates"

git push origin main- Tests expecting console logs not being generated2. Run a full quality check (lint, format, test)

```

- Viewport detection not triggering properly

### 3. Verify Clean State

3. Push the changes to originADR-0037 has been **ACCEPTED**. We will implement a comprehensive animation system to solve the systemic issues with ad-hoc animation coordination.

After all updates:

```bash**Root Cause**: Scroll detection logic or test expectations need adjustment

npm audit          # Should show 0 moderate+ vulnerabilities

npm outdated       # Check remaining outdated packages

npm test           # All tests must pass

npm run test:e2e   # E2E tests must pass**Fix Strategy**:

```

1. Review `src/scroll-narrative-detector.ts` viewport boundaries## LATERThe incident documents:

## NEXT

2. Verify IntersectionObserver thresholds

**Monitor Fresh Packages and Plan Major Upgrades**

3. Update test expectations if behavior is correct

After resolving the blocking security and dependency issues, the following work can be scheduled:



### 1. Monitor Fresh Packages (< 7 days old)

### Priority 5: Scroll-Locked Reveal (4 failures - webkit/Mobile Safari)After test failures are resolved and committed:- 2 LOW severity vulnerabilities (fast-redact prototype pollution, pino transitive)**File**: `docs/decisions/0037-comprehensive-animation-system.accepted.md`

Set calendar reminders to revisit these packages after they reach maturity (7 days):

- Initial opacity issues (elements showing too early)

- **November 13, 2025**: Re-assess `eslint@9.39.1` and `@eslint/js@9.39.1` (released Nov 3)

- **November 13, 2025**: Re-assess `vite@7.2.0` (released Nov 5)- Progressive reveal timing problems1. Re-run the full assessment process to complete phases 4-10



When these become mature, update them following the same process:

```bash

npm update eslint@9.39.1**Root Cause**: WebKit-specific timing or opacity calculation differences2. Continue with any other implementation work identified in subsequent assessments- Planned update: netlify-cli 23.9.4 → 23.9.5

npm update @eslint/js@9.39.1

npm update vite@7.2.0

# Run full quality checks

# Commit and push**Fix Strategy**:

```

1. Review `src/scroll-locked-reveal.ts` opacity calculations- Update reached 7-day maturity on October 29, 2025### Current Animation Issues

### 2. Plan Major Version Upgrades

2. Add webkit-specific timing adjustments if needed

Three packages have major version updates available that require careful analysis:

3. Consider browser-specific test expectations- Scheduled for execution on October 29, 2025

**A. vitest and @vitest/coverage-v8: 3.2.4 → 4.0.7**



1. Review the vitest 4.0 changelog for breaking changes:

   - Check migration guide### Priority 6: Performance Issues (3 failures)- **Status**: OVERDUE by 1 dayStory 026.03-BIZ-MAGIC-PHASE-ANIMATION has these problems:

   - Identify API changes affecting our test suite

   - Review coverage reporting changes- Mobile Chrome scroll detection across viewports



2. Create feature branch for upgrade:- Rapid scrolling performance- Segment 2 animation getting stuck on left side

   ```bash

   git checkout -b chore/upgrade-vitest-4

   ```

**Root Cause**: Performance timing in mobile test environment### Implementation Steps- Complex state management (6 flags) causing coordination issues

3. Update packages:

   ```bash

   npm install --save-dev vitest@4.0.7 @vitest/coverage-v8@4.0.7

   ```**Fix Strategy**:- 11 test failures due to fragile timing logic



4. Fix any breaking changes in test files1. Review test timeout thresholds for mobile



5. Verify all tests and coverage:2. Optimize scroll event handling if needed1. **Execute Security Update**- Multiple fix attempts increased complexity without solving root cause

   ```bash

   npm test3. Consider test environment limitations

   npm run test:coverage

   ```   ```bash



6. Commit, push, and merge if successful## NEXT



**B. eslint-plugin-unicorn: 61.0.2 → 62.0.0**   npm update netlify-cli**Root Cause**: Ad-hoc animation coordination with scattered state management.



1. Review changelog for new rules and breaking changesAfter E2E test fixes are complete and all tests passing:

2. Update package and run linting to see what fails

3. Fix any new linting errors or disable problematic rules   ```

4. Commit changes

1. **Run full quality checks**:

**C. @types/three: 0.180.0 → 0.181.0**

   ```bash**Solution**: Build comprehensive animation system per ADR-0037.

1. Coordinate with `three@0.181.0` update (already in mature list)

2. Review type definition changes   npm run lint

3. Fix any TypeScript errors

4. Verify 3D animation still works correctly   npm run format:check2. **Verify Update Applied**



### 3. Address Test Cleanup Issue (Non-blocking)   npm run type-check



The assessment noted an unhandled error in `scroll-locked-reveal.test.ts`:   npm test   ```bash### Implementation Plan

```

ReferenceError: window is not defined   npm run e2e

  at ScrollLockedReveal.getProgress src/scroll-locked-reveal.ts:93:45

```   ```   npm list netlify-cli



This is a test quality issue where timers aren't being cleaned up properly:



1. Review `src/scroll-locked-reveal.ts` - ensure all timers/intervals are cleared in `destroy()` method2. **Update history.md**:   # Should show: netlify-cli@23.9.5**Phase 1: Core Animation System** (Week 1 - Starts Now)

2. Review `tests/scroll-locked-reveal.test.ts` - ensure proper cleanup in `afterEach()` hooks

3. Add explicit `destroy()` calls for all test instances   - Summarize E2E test fixes

4. Verify fix: `npm test` should show no unhandled errors

   - Document root causes and solutions   ```

## LATER

   - Record test pass rates

**Future Dependency Maintenance and Monitoring**

1. **Design Animation Base Interface**

### 1. Establish Dependency Update Cadence

3. **Commit and push changes**:

Create a regular schedule for dependency maintenance:

- **Weekly**: Check `npm outdated` for new updates   - Clear commit message describing fixes3. **Verify Vulnerabilities Resolved**   - Define animation types: scroll-scrubbed, scroll-triggered, time-based

- **Monthly**: Review and apply mature updates

- **Quarterly**: Evaluate major version upgrades   - Reference test failures resolved



### 2. Security Monitoring   - Verify CI/CD pipeline passes   ```bash   - Create state lifecycle: idle → triggered → active → completed → reset



Set up automated security monitoring:

- Enable GitHub Dependabot alerts

- Review `npm audit` results weekly4. **Re-run assessment**:   npm audit   - Design dependency declaration API

- Track security incident resolution timelines

- Document all security updates in `docs/security-incidents/`   - Complete Phase 6 (Runtime Validation)



### 3. Smart Version Selection Documentation   - Continue through remaining phases   # Should show: 0 vulnerabilities (or reduced from 2)   - Plan queuing mechanism



Document the Smart Version Selection Algorithm application:   - Generate final assessment report

- Create decision log for when packages were upgraded vs. deferred

- Track false positives from security scanners   ```

- Maintain maturity timeline for fresh packages

- Document major version upgrade decisions## LATER



### 4. Dependency Health Metrics2. **Implement Core System**



Track dependency health over time:After all E2E tests passing and assessment complete:

- Number of outdated packages

- Average age of dependencies4. **Test Functionality**   - Create `AnimationCoordinator` class

- Security vulnerability count

- Time to apply security updates1. **Optional Dependency Updates** (when packages mature):

- Major version upgrade frequency

   - Monitor package maturity dates   ```bash   - Implement `BaseAnimation` interface/abstract class

### 5. Future Major Upgrades

   - Update packages as they cross 7-day threshold

Monitor for upcoming major versions:

- Keep watching for stable releases   - Follow Smart Version Selection Algorithm   # Run linting   - Build state management with lifecycle hooks

- Review community feedback before upgrading

- Test in separate branch before merging

- Document migration experiences for team knowledge

2. **Performance Optimization**:   npm run lint   - Add dependency resolution system

---

   - Bundle size optimization

**Note**: This plan follows the principle of resolving blocking issues first (security + dependencies) before proceeding with any new feature development or story implementation. The assessment identified that we are "NOT READY FOR NEW STORY DEVELOPMENT" until these dependency issues are resolved.

   - Code splitting for Three.js      - Implement animation queue

   - Consider lazy loading strategies

   # Run unit tests

3. **Visual Enhancements** (from previous assessments):

   - Mobile typography fine-tuning   npm test3. **Add Testing Infrastructure**

   - Landscape mobile padding optimization

      - Unit tests for state transitions

4. **Documentation Updates**:

   - Update architecture decision records if needed   # Verify netlify CLI works   - Tests for dependency resolution

   - Document test patterns discovered

   - Enhance troubleshooting guides   netlify --version   - Tests for queuing behavior



## Notes   ```   - Mock utilities for testing animations



**Current Test Status**:

- 404 passed / 460 total (87.8% pass rate)

- 35 skipped (10 development mode, 8 performance optimization, 17 text flash)5. **Update Security Incident Status**4. **Documentation**

- 21 failed (4.6% failure rate)

   - Rename: `SECURITY-INCIDENT-2025-10-23-netlify-cli-pino-fast-redact.proposed.md`   - API documentation

**Test Categories**:

- P003 Button Overlap: 6 failures (critical UX issue)   - To: `SECURITY-INCIDENT-2025-10-23-netlify-cli-pino-fast-redact.resolved.md`   - Usage examples

- Functional Layout: 4 failures (responsive design)

- FOUC Prevention: 1 failure (page load experience)   - Update status from PROPOSED to RESOLVED   - Migration guide for existing animations

- Scroll Detection: 3 failures (narrative tracking)

- Scroll-Locked Reveal: 4 failures (webkit-specific)   - Document resolution date: October 30, 2025

- Performance: 3 failures (mobile optimization)

   - Add post-resolution verification notes**Phase 2: Migration** (Week 2)

**Quality Gates**:

- ✅ Unit tests: 377/377 passing (100%)

- ✅ Linting: Clean

- ✅ Type checking: Clean6. **Commit Changes**1. **Migrate SparklerAnimator**

- ⚠️ E2E tests: 21 failures to fix

   ```bash   - Refactor to use new animation system

**Gall's Law Compliance**:

- Fix one test category at a time   git add package.json package-lock.json docs/security-incidents/   - Maintain existing visual behavior

- Start with P003 (clear CSS fix)

- Move to layout issues (responsive CSS)   git commit -m "security: resolve netlify-cli vulnerabilities (fast-redact/pino)   - Update tests

- Test after each fix

- Don't try to fix all issues at once


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
