# Text Flash Before 3D Render Issue

**Date**: 2025-09-29  
**Updated**: 2025-09-29  
**Status**: 🟡 KNOWN ERROR (Workaround Implemented)  
**Severity**: Medium  
**Impact**: High (3) - Affects 100% of page views (all devices on first load, per MS Clarity Data Export API)  
**Likelihood**: High (3) - Occurs consistently on first page load  
**Priority**: 9 (High×High) - Critical priority, immediate workaround required  
**Component**: 3D Animation System (`src/three-animation.ts`, `src/app.ts`, HTML structure)

## Problem Description

On first page load, there is a visual flash where text content ("Keep Shipping Fast" and "Coming Soon") appears briefly before disappearing and being replaced by the 3D cube animation. This entire sequence happens within less than 1 second, creating a jarring user experience.

**Symptoms**:

- Text content renders first (visible for ~500-800ms)
- Text suddenly disappears
- 3D cube animation appears in its place
- Total flash duration: <1 second
- Occurs consistently on first page load
- More noticeable on slower devices/connections

## Root Cause Analysis (COMPLETED)

### 5 Whys Analysis

1. **Why does text flash occur?**
   - Text is visible before CSS hides it

2. **Why is text visible before CSS hides it?**
   - CSS rules for hiding text depend on `.js-loaded` class

3. **Why does the `.js-loaded` class timing cause issues?**
   - The class is added after JavaScript loads and 3D initialization begins

4. **Why is there a gap between text visibility and `.js-loaded` class?**
   - HTML renders immediately, but JavaScript execution has delay

5. **Why does JavaScript execution delay cause the flash?**
   - **ROOT CAUSE**: Even with inline critical CSS, CSS transitions and browser rendering create intermediate opacity values during the transition from hidden to visible state, making text appear during the animation

### Timeline Analysis

1. **HTML loads and renders**: Static text content displays with initial CSS
2. **Inline CSS applies**: Text elements get `opacity: 0` from critical CSS
3. **JavaScript loads**: App initialization begins
4. **`js-loaded` class added**: Triggers CSS transition
5. **CSS transition animates**: Creates intermediate opacity values (0.1, 0.3, 0.7, etc.)
6. **Text becomes fully visible**: Transition completes

**Problem Window**: Step 5 - CSS transition creates visible intermediate states

## Failing Test Created ✅

Created comprehensive E2E test in `tests/e2e/text-flash-prevention.test.ts` that:

- ✅ Reproduces the issue consistently across all browsers
- ✅ Tests network throttling scenarios
- ✅ Verifies both opacity and visibility states
- ✅ Captures exact timing of the flash behavior

## Targeted Workaround Implemented ✅

**Strategy**: Complete element hiding using `display: none` until JS is ready

### Implementation Details

**File**: `index.html` (lines 36-72)
**Approach**:

- Use `display: none` for complete hiding (no partial opacity states)
- Apply CSS animations instead of transitions for smoother appearance
- Staggered animations for more professional loading sequence

```css
/* WORKAROUND: Aggressive hiding to prevent text flash */
.hero-title,
.hero-description,
.status-indicator {
  display: none;
}

.js-loaded .hero-title,
.js-loaded .status-indicator {
  display: block;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.js-loaded .hero-description {
  display: block;
  opacity: 0;
  animation: fadeInUp 0.6s ease 0.2s forwards;
}
```

### Workaround Characteristics

**Effectiveness**: ✅ Eliminates flash completely (verified by E2E tests)
**Trade-offs**:

- Shows blank space until JavaScript loads (acceptable per ITIL - service stability over features)
- Slightly delayed content appearance on slow connections
- Loss of progressive enhancement for no-JS users

**Rollback Procedure**: Remove `display: none` rules and revert to opacity-based approach

## Exemptions Tracking

_No exemptions requested - workaround applied project-wide_

## Permanent Fix Story

**Created**: TBD (will be created as INVEST-compliant story)
**Approach**: Implement sophisticated loading orchestration:

- Preload 3D system during page lifecycle
- Coordinate content appearance with 3D readiness
- Add proper loading states with skeleton UI
- Optimize JavaScript execution timing

## Files Likely Affected

1. **`index.html`**: Static HTML structure and text content
2. **`src/app.ts`**: Application initialization and rendering logic
3. **`src/three-animation.ts`**: 3D animation initialization timing
4. **`src/style.css`**: CSS loading and initial state styling

## Investigation Tasks

### High Priority

- [ ] **Trace render sequence**: Document exact order of content appearance
- [ ] **Measure timing**: Record precise durations of each render phase
- [ ] **Identify trigger point**: Find where text gets hidden/replaced
- [ ] **Check loading states**: Verify if there are loading/ready state handlers

### Medium Priority

- [ ] **HTML structure analysis**: Review static content vs. dynamic content
- [ ] **CSS cascade timing**: Check if styles load before JavaScript
- [ ] **JavaScript execution order**: Verify initialization sequence
- [ ] **WebGL context timing**: Measure 3D initialization duration

### Low Priority

- [ ] **Browser differences**: Test across different browsers/devices
- [ ] **Network condition impact**: Test on slow connections
- [ ] **Performance profiling**: Detailed timing analysis

## Potential Solutions

### Option 1: Hide Text Content Initially (Quick Fix)

**Implementation**: Add CSS to hide text content until 3D is ready

```css
.hero-text-content {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.hero-text-content.show {
  opacity: 1;
}
```

**Pros**: Simple implementation, immediate fix
**Cons**: May show blank space initially

### Option 2: Smooth Transition Animation

**Implementation**: Fade out text as 3D fades in

```css
.content-transition {
  transition: opacity 0.5s ease-in-out;
}
```

**Pros**: Professional appearance, smooth UX
**Cons**: More complex implementation

### Option 3: Loading State Management

**Implementation**: Show loading indicator until 3D is ready
**Pros**: Clear user feedback, professional approach
**Cons**: Adds complexity, may slow perceived performance

### Option 4: Preload 3D System

**Implementation**: Initialize 3D system earlier in page lifecycle
**Pros**: Reduces flash duration
**Cons**: May impact initial page load performance

## Recommended Approach

1. **Immediate**: Implement Option 1 (hide text initially)
2. **Short term**: Upgrade to Option 2 (smooth transitions)
3. **Long term**: Consider Option 4 (preload optimization)

## Workaround Implementation ✅ IMPLEMENTED (2025-09-29)

**Status**: ✅ WORKAROUND ACTIVE  
**Strategy**: Option 1 - Hide Text Content Initially (CSS-based solution)  
**Implementation Date**: 2025-09-29

### Implementation Details

**Files Modified**:

- `src/style.css`: Added CSS rules to hide hero content until JavaScript is loaded

**CSS Changes**:

```css
/* Text flash prevention - hide hero content until 3D system is ready */
.hero-title,
.hero-description,
.status-indicator {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.js-loaded .hero-title,
.js-loaded .status-indicator {
  opacity: 1;
}

.js-loaded .hero-description {
  opacity: 0.9; /* Preserve original opacity */
}
```

### Workaround Behavior

**Before**: Text content flashes briefly before 3D cube appears  
**After**: Text content remains hidden until JavaScript marks page as loaded (`.js-loaded` class)  
**Transition**: Smooth 0.3s opacity fade-in when content appears

### Limitations

- **Blank space during loading**: Users see empty hero section until JavaScript loads
- **Progressive enhancement**: Content invisible if JavaScript is disabled (requires future fix)
- **Dependency on JavaScript timing**: Relies on existing `js-loaded` class mechanism

### Business Impact

✅ **Positive**: Eliminates jarring text flash on first impression  
✅ **Positive**: Provides smooth loading experience  
⚠️ **Limitation**: Brief blank period during initial load

### Rollback Procedure

To disable the workaround:

1. Remove the CSS rules added to `src/style.css`
2. Text will immediately be visible on page load (reverting to original flash behavior)

### Monitoring Requirements

- **Visual regression testing**: Verify no text flash in E2E tests
- **Performance impact**: Monitor Core Web Vitals for loading impact
- **User feedback**: Monitor for complaints about blank loading state

### Next Steps

- **Root cause analysis**: Conduct 5 Whys analysis on render timing
- **Create failing test**: E2E test that detects text flash behavior
- **Transition to known-error**: When root cause is identified and permanent fix story created

## Testing Strategy

### Manual Testing

- [ ] Test on various devices (desktop, tablet, mobile)
- [ ] Test on different network speeds
- [ ] Test with browser dev tools throttling
- [ ] Test across major browsers (Chrome, Safari, Firefox)

### Automated Testing

- [ ] Add E2E test to verify no text flash occurs
- [ ] Add timing assertions for render sequence
- [ ] Add visual regression tests for loading states

## Success Criteria

- [ ] No visible text content before 3D cube appears
- [ ] Smooth visual transition (if transition is implemented)
- [ ] Consistent behavior across all browsers and devices
- [ ] Page load performance not significantly impacted
- [ ] All existing functionality remains intact

## Related Issues

- **3D Cube Responsive Positioning**: Previously resolved positioning issues
- **Performance optimization**: May be related to overall loading performance
- **Mobile experience**: Flash may be more noticeable on mobile devices

## Investigation Notes

_To be filled during investigation_

## Resolution Steps

### Investigation Phase

- [ ] Document current render sequence
- [ ] Identify root cause of text flash
- [ ] Measure performance impact of potential solutions

### Implementation Phase

- [ ] Choose and implement solution approach
- [ ] Add appropriate tests
- [ ] Verify fix across all browsers/devices

### Validation Phase

- [ ] Run full test suite
- [ ] Manual testing across devices
- [ ] Performance impact assessment
- [ ] User experience validation
