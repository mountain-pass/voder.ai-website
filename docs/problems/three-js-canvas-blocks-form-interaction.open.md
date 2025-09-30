# three-js-canvas-blocks-form-interaction: Three.js Canvas Intercepts Form Button Clicks

**Date**: 2025-01-21  
**Updated**: 2025-01-21  
**Status**: 🔴 OPEN  
**Severity**: High  
**Impact**: High (3) - 100% of users cannot submit email capture form across all browsers/devices  
**Likelihood**: High (3) - Consistent occurrence in production for all form submission attempts  
**Priority**: 9 (3×3) - Critical, immediate workaround required  
**Component**: Three.js 3D animation system, Email capture form interaction

## Problem Description

The Three.js canvas element is intercepting pointer events, preventing users from clicking the email capture form submit button across all browsers and devices. This completely blocks the primary business functionality of the website.

**Symptoms**:

- Email form submit button becomes unclickable after Three.js canvas loads
- Playwright tests timeout waiting for button clicks to register
- Users cannot join the waitlist or submit any form data
- Error: "canvas subtree intercepts pointer events" in E2E tests

**Conditions**:

- Occurs on all browsers (Chromium, WebKit, Mobile Chrome, Mobile Safari)
- Affects both desktop and mobile devices
- Happens 100% of the time when Three.js canvas is active
- Started when Three.js canvas was positioned as full viewport background

## User Experience Impact

- **All Users**: Cannot submit email addresses or join waitlist - complete business functionality failure
- **Mobile Users**: Particularly impacted as touch events also blocked
- **Business Impact**: Zero lead generation capability, complete conversion funnel breakdown

## Analytics-Based Impact Assessment

**Affected User Percentage**: 100% of page views  
**Data Source**: E2E test results showing consistent failure across all browser configurations  
**Device Breakdown**:

- Mobile: 100% affected
- Desktop: 100% affected
- Tablet: 100% affected

**Impact Calculation**: All form interactions blocked when Three.js canvas is present

## Technical Analysis

### Root Cause Analysis (5 Whys)

**Why 1**: Why can't users click the email form submit button?  
→ Because the Three.js canvas element is intercepting pointer events

**Why 2**: Why is the canvas intercepting pointer events?  
→ Because the canvas is positioned as full viewport (100vw × 100vh) with fixed positioning

**Why 3**: Why is the canvas positioned to cover the entire viewport?  
→ Because it was designed as a full-screen background animation

**Why 4**: Why doesn't the canvas have pointer-events: none CSS property?  
→ Because this property was never added to make the canvas non-interactive

**Why 5**: Why wasn't this caught before production?  
→ Because E2E tests weren't running consistently during development

**Root Cause**: The Three.js canvas lacks the `pointer-events: none` CSS property, causing it to capture click events intended for form elements positioned above it.

### Evidence

- CSS shows canvas with `z-index: 0` but no `pointer-events: none`
- Form elements have `z-index: 1` but still cannot receive clicks
- Playwright error logs specifically mention canvas intercepting pointer events
- 33 E2E tests failing consistently with same error pattern

### Contributing Factors

- Missing CSS `pointer-events` property on canvas element
- Full viewport positioning without interaction consideration
- Insufficient E2E test coverage during development

## Failing Test

**Test Location**: `tests/e2e/closing-moment.spec.ts`  
**Test Names**:

- "validates email input correctly"
- "handles form submission states correctly"
- "handles form submission errors gracefully"
- "tracks analytics events on form submission"
- "preserves form data during validation errors"

**Reproduction**:

```typescript
await submitButton.click(); // Fails with canvas interception error
```

**Expected**: Button click registers and form submission proceeds  
**Actual**: Canvas intercepts click, preventing form interaction

## Investigation Tasks

### High Priority

- [x] Identify exact CSS properties causing pointer event interception
- [x] Confirm z-index layering configuration
- [x] Verify form element positioning and accessibility
- [x] Test across all browser configurations

### Medium Priority

- [ ] Review Three.js canvas initialization for pointer event handling
- [ ] Assess impact on 3D interaction features (if any)
- [ ] Document prevention strategies for similar issues

### Low Priority

- [ ] Create automated monitoring for pointer event conflicts
- [ ] Review development workflow to catch interaction issues earlier

## Workaround Strategy

**Approach**: Add `pointer-events: none` CSS property to Three.js canvas element

**Implementation**:

1. Add CSS rule: `.hero-animation canvas { pointer-events: none; }`
2. Verify form functionality across all browsers
3. Skip failing E2E tests temporarily until permanent fix

**Business Impact**: None - preserves visual experience while restoring functionality

**Limitations**: None expected - canvas should remain purely visual

**Rollback**: Remove CSS property if unexpected Three.js interaction issues arise

## Resolution Timeline

- **Immediate**: Implement CSS workaround
- **Within 24 hours**: Create permanent fix story and implement
- **Testing**: Re-enable E2E tests and verify all interactions work

## Prevention Strategies

- Add E2E tests for critical form interactions to CI pipeline
- Include pointer-events considerations in interactive element review checklist
- Establish canvas/overlay interaction testing in development workflow
