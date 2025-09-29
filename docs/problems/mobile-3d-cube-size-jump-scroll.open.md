# Mobile 3D Cube Size Jump on Scroll Issue

**Date**: 2025-09-29  
**Updated**: 2025-09-29  
**Status**: 🔴 OPEN  
**Severity**: High  
**Impact**: Medium (2) - Affects 51.9% of page views (mobile users only, per MS Clarity Data Export API)  
**Likelihood**: High (3) - Occurs consistently on mobile scroll  
**Priority**: 6 (Medium×High) - High priority, workaround within 24 hours  
**Component**: 3D Animation System (`src/three-animation.ts`, mobile viewport handling)

## Problem Description

On mobile devices, the 3D cube exhibits an unexpected size behavior during scroll interactions:

**Initial State**: Cube appears small/normal sized
**On Scroll**: Cube suddenly becomes large/oversized
**Trigger**: Any scroll action on mobile viewport
**Persistence**: Size change appears to be permanent during the session

## User Experience Impact

- **Jarring visual jump**: Sudden size change is disorienting
- **Broken mobile experience**: Primary interaction (scrolling) triggers visual bug
- **High severity**: Affects core mobile usability
- **Professional appearance**: Makes the site appear broken on mobile

## Technical Analysis

### Symptoms Detail

- Cube starts with correct proportions
- First scroll action triggers size jump
- Size change appears to be a significant increase (exact scale unknown)
- Issue appears specific to mobile viewport
- Desktop and tablet likely unaffected

### Root Cause Hypothesis

This suggests an issue with:

1. **Scroll event handlers**: 3D animation system may be responding to scroll events
2. **Viewport resize calculations**: Mobile browsers often resize viewport on scroll (address bar hiding)
3. **Canvas/WebGL sizing**: Canvas dimensions may be recalculated incorrectly
4. **Mobile browser behavior**: iOS Safari/Chrome mobile viewport changes on scroll

### Expected Behavior

The 3D cube should maintain consistent size and proportions regardless of scroll position or scroll actions on mobile devices.

## Technical Investigation Areas

### High Priority

- [ ] **Scroll event listeners**: Check if `three-animation.ts` has scroll handlers
- [ ] **Viewport resize handling**: Review resize event listeners and calculations
- [ ] **Mobile viewport behavior**: Test viewport changes when mobile browsers hide/show UI
- [ ] **Canvas sizing logic**: Review canvas dimension calculations on scroll

### Medium Priority

- [ ] **WebGL context handling**: Check if WebGL context changes on scroll
- [ ] **Camera positioning**: Verify camera FOV/position recalculations
- [ ] **CSS viewport units**: Check if `vw`/`vh` units cause issues on mobile scroll
- [ ] **Touch event conflicts**: Verify no touch/scroll event conflicts

### Low Priority

- [ ] **Browser-specific behavior**: Test across mobile browsers (Safari, Chrome, Firefox)
- [ ] **Device-specific testing**: Test on various mobile devices and screen sizes
- [ ] **Performance profiling**: Check if scroll performance impacts sizing

## Files Likely Affected

1. **`src/three-animation.ts`**: Primary 3D system with potential scroll/resize handlers
2. **`src/style.css`**: CSS viewport units and responsive rules
3. **`src/app.ts`**: App-level event handling that might affect 3D system

## Browser Context

### Mobile Browser Viewport Behavior

Mobile browsers (especially iOS Safari) change viewport dimensions when:

- Address bar hides/shows during scroll
- Orientation changes
- Zoom level changes
- Virtual keyboard appears/disappears

This could trigger:

- Window resize events
- Canvas dimension recalculations
- Camera FOV adjustments
- WebGL context changes

## Potential Solutions

### Option 1: Disable Resize Handling on Mobile (Quick Fix)

**Implementation**: Prevent 3D system from responding to resize events on mobile

```javascript
// In three-animation.ts
if (this.isMobile()) {
  // Skip resize handling on mobile
  return;
}
```

**Pros**: Immediate fix, low risk
**Cons**: May not handle legitimate orientation changes

### Option 2: Debounce Resize Events

**Implementation**: Add debouncing to resize event handlers

```javascript
const debouncedResize = debounce(() => {
  this.handleResize();
}, 150);
```

**Pros**: Reduces unnecessary recalculations
**Cons**: May not address root cause

### Option 3: Fixed Dimensions on Mobile

**Implementation**: Use fixed canvas dimensions instead of viewport calculations
**Pros**: Consistent sizing
**Cons**: May not be responsive to orientation changes

### Option 4: Viewport Meta Tag Adjustment

**Implementation**: Modify viewport meta tag to prevent browser UI changes

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

**Pros**: May prevent browser UI size changes
**Cons**: Could affect overall mobile experience

### Option 5: Scroll-Independent Sizing

**Implementation**: Ensure 3D system sizing is completely independent of scroll state
**Pros**: Addresses root cause
**Cons**: Requires thorough understanding of current implementation

## Workaround Implementation ✅ IMPLEMENTED (2025-09-29)

**Status**: ✅ WORKAROUND ACTIVE  
**Strategy**: Option 1 - Disable Resize Handling on Mobile  
**Implementation Date**: 2025-09-29

### Implementation Details

**Files Modified**:

- `src/three-animation.ts`: Modified `handleResize()` method to skip processing on mobile devices

**Code Changes**:

```typescript
private handleResize(): void {
  if (!this.camera || !this.renderer) return;

  // Skip resize handling on mobile to prevent size jumps (workaround for mobile viewport issue)
  if (this.getDeviceType() === 'mobile') {
    return;
  }

  // ... rest of resize logic for desktop/tablet
}
```

### Workaround Behavior

**Before**: Mobile scroll triggers resize events causing cube size jumps  
**After**: Mobile devices skip resize handling entirely, preventing size changes during scroll  
**Scope**: Only affects mobile devices (tablet and desktop resize handling preserved)

### Limitations

- **No orientation change handling**: Mobile devices won't respond to orientation changes
- **Fixed initial sizing**: Cube size determined at initial load and won't adjust
- **Potential layout issues**: If mobile viewport changes significantly, cube may appear incorrectly sized

### Business Impact

✅ **Positive**: Eliminates jarring size jumps during scroll on mobile  
✅ **Positive**: Maintains 3D functionality on mobile devices  
⚠️ **Limitation**: Mobile orientation changes not handled  
⚠️ **Limitation**: May not adapt to dynamic viewport changes

### Rollback Procedure

To disable the workaround:

1. Remove the mobile device check in `handleResize()` method
2. Mobile devices will resume normal resize handling (reverting to original size jump behavior)

### Monitoring Requirements

- **Mobile scroll testing**: Verify no size jumps occur during scroll
- **Orientation testing**: Monitor for layout issues during orientation changes
- **Performance impact**: Ensure workaround doesn't affect mobile performance

### Test Impact

**Tests Affected**: Mobile resize behavior tests may need to be skipped temporarily
**Coverage Impact**: Mobile resize code excluded from coverage reports during workaround period

### Next Steps

- **Root cause analysis**: Investigate mobile browser viewport behavior during scroll
- **Create failing test**: E2E test that reproduces mobile size jump behavior
- **Transition to known-error**: When root cause is identified and permanent fix story created

## Investigation Plan

### Phase 1: Reproduce and Document

- [ ] **Reproduce consistently**: Document exact steps to trigger the issue
- [ ] **Measure size change**: Record before/after dimensions
- [ ] **Test multiple devices**: Verify across different mobile devices
- [ ] **Browser comparison**: Test mobile Safari vs. Chrome vs. Firefox

### Phase 2: Code Analysis

- [ ] **Review scroll handlers**: Audit all scroll event listeners
- [ ] **Review resize handlers**: Audit all resize event listeners
- [ ] **Canvas sizing logic**: Trace canvas dimension calculations
- [ ] **Camera calculations**: Review FOV and positioning logic

### Phase 3: Browser Behavior Analysis

- [ ] **Viewport change monitoring**: Log viewport dimensions during scroll
- [ ] **Event sequence tracking**: Log order of events during scroll
- [ ] **WebGL context monitoring**: Check for context changes

## Testing Strategy

### Manual Testing Checklist

- [ ] iPhone Safari (multiple models)
- [ ] iPhone Chrome
- [ ] Android Chrome
- [ ] Android Firefox
- [ ] Different screen sizes (iPhone SE, iPhone Pro Max, etc.)
- [ ] Different orientations (portrait, landscape)

### Automated Testing

- [ ] Add E2E test for mobile scroll behavior
- [ ] Add assertions for consistent cube sizing
- [ ] Add mobile-specific visual regression tests

### Test Scenarios

- [ ] Initial page load → scroll immediately
- [ ] Page load → wait → scroll
- [ ] Multiple scroll actions
- [ ] Scroll up and down
- [ ] Fast vs. slow scrolling
- [ ] Orientation change during scroll

## Success Criteria

- [ ] 3D cube maintains consistent size during scroll on mobile
- [ ] No visual jumps or size changes on any scroll action
- [ ] Behavior consistent across all mobile browsers
- [ ] Performance not significantly impacted
- [ ] Orientation changes handled gracefully
- [ ] All existing functionality preserved

## Risk Assessment

**High Risk Areas**:

- Mobile browser viewport behavior is complex and browser-specific
- Changes to 3D system could affect desktop/tablet experience
- WebGL/Canvas sizing is intricate and error-prone

**Mitigation Strategies**:

- Comprehensive testing across devices and browsers
- Feature flags for mobile-specific fixes
- Gradual rollout with monitoring

## Related Issues

- **3D Cube Responsive Positioning**: Previously resolved - may share similar root causes
- **Text Flash Before 3D Render**: May be related to overall 3D initialization timing
- **Mobile performance**: Size jumps could indicate performance issues

## Implementation Priority

**Critical**: This issue severely impacts mobile user experience, which is likely a significant portion of traffic. Should be prioritized for immediate investigation and resolution.

## Investigation Notes

_To be filled during investigation_

## Resolution Steps

### Immediate (Investigation)

- [ ] Reproduce issue consistently
- [ ] Identify specific scroll event triggers
- [ ] Document exact size change measurements

### Short Term (Fix)

- [ ] Implement chosen solution approach
- [ ] Add comprehensive mobile testing
- [ ] Deploy with feature flag for safety

### Long Term (Prevention)

- [ ] Add automated mobile scroll testing
- [ ] Document mobile 3D best practices
- [ ] Consider mobile-first 3D architecture
