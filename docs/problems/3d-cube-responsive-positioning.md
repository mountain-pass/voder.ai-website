# 3D Cube Responsive Positioning Issue

**Date**: 2025-09-27  
**Updated**: 2025-09-28  
**Status**: Known Error - Workaround Implemented  
**Severity**: Medium (mitigated by workaround)  
**Component**: 3D Animation System (`src/three-animation.ts`, `src/style.css`)

## Problem Description

The 3D cube animation appears incorrectly positioned on mobile and tablet viewports:

- **Desktop (>768px)**: Cube renders centered and properly sized ✓
- **Tablet (≤768px)**: Cube appears in bottom-right area, oversized ❌
- **Mobile (≤480px)**: Cube appears in bottom-right corner, oversized ❌

## Root Cause Analysis (5 Whys)

**Why #1: Why is the cube positioned incorrectly on mobile/tablet?**

- Because the canvas appears to be much wider than expected on smaller screens

**Why #2: Why is the canvas wider than the viewport on mobile/tablet?**

- Because there's a CSS media query conflict

**Why #3: Why is there a CSS media query conflict?**

- Because the CSS has responsive rules that override the full viewport styling

**Why #4: Why do these responsive rules override the full viewport approach?**

- Because the media query `@media (width <= 768px)` sets `.hero-animation` to `height: 150px; width: 150px;` which conflicts with the full viewport `width: 100vw; height: 100vh;`

**Why #5: Why wasn't this caught in earlier investigation?**

- Because focus was on JavaScript camera/FOV positioning instead of examining the CSS cascade and responsive overrides

## Technical Root Cause

**CSS Conflict**:

```css
/* Base rule (line 474-479) */
.hero-animation {
  position: relative;
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  margin: 0 0 -100vh 0;
}

/* Conflicting responsive override (line 555-558) */
@media (width <= 768px) {
  .hero-animation {
    height: 150px; /* Forces small container */
    width: 150px; /* Forces small container */
  }
}
```

**Result**:

- **Container**: 150px × 150px (CSS override)
- **Canvas**: Full viewport dimensions (JS: `window.innerWidth` × `window.innerHeight`)
- **Mismatch**: Canvas overflows container, causing cube to appear bottom-right

## Impact

- Mobile/tablet users see broken 3D animation
- Degrades user experience on primary traffic sources
- Contradicts the full viewport background design intention
- Makes the elegant glass cube effect unusable on smaller screens

## Files Affected

1. **`src/style.css`** (lines 555-558): Conflicting responsive rules
2. **`src/three-animation.ts`** (lines 88-89, 143): Canvas sizing logic
3. **`prompts/release-1.0/in-scope/025.0-BIZ-3D-ANIMATION.md`**: Specification assumes full viewport works responsively

## Investigation History

1. **Initial attempts**: Focused on camera positioning and FOV adjustments
2. **Misdiagnosis**: Assumed WebGL/Three.js camera calculation issues
3. **Correct diagnosis**: CSS cascade inspection revealed container size conflict

## Workarounds for Release

While fixing the root cause, consider these temporary solutions to enable release:

### Option 1: Disable 3D on Mobile/Tablet (Recommended)

**Impact**: Low risk, preserves performance
**Implementation**:

```javascript
// In src/three-animation.ts constructor
const isMobileOrTablet = window.innerWidth <= 768;
if (isMobileOrTablet) {
  this.initFallback(); // Use 2D fallback immediately
  return;
}
```

**Pros**: No visual glitches, fast implementation, good UX
**Cons**: Mobile users miss 3D effect (but may prefer performance)

### Option 2: Quick CSS Override

**Impact**: Medium risk, may cause layout shifts
**Implementation**:

```css
/* Add to src/style.css */
@media (width <= 768px) {
  .hero-animation {
    width: 100vw !important;
    height: 100vh !important;
  }
}
```

**Pros**: Maintains 3D on all devices
**Cons**: Uses `!important`, may have side effects

### Option 3: JavaScript Container Sizing

**Impact**: Medium risk, runtime overhead
**Implementation**:

```javascript
// In src/three-animation.ts initThreeJS()
this.container.style.width = '100vw';
this.container.style.height = '100vh';
this.container.style.position = 'fixed';
this.container.style.top = '0';
this.container.style.left = '0';
```

**Pros**: Overrides CSS programmatically
**Cons**: May conflict with other styles

### Option 4: Conditional Full Viewport

**Impact**: Low risk, clean separation
**Implementation**:

```css
/* Replace existing media query */
@media (width <= 768px) {
  .hero-animation.fallback-mode {
    height: 150px;
    width: 150px;
  }

  .hero-animation.fullscreen-mode {
    width: 100vw;
    height: 100vh;
  }
}
```

**Pros**: Clean CSS, explicit control
**Cons**: Requires JS class management

### Recommendation: Option 1 + Option 4

1. **Immediate release**: Use Option 1 to disable 3D on mobile/tablet
2. **Next iteration**: Implement Option 4 for proper responsive 3D
3. **Long term**: Fix root cause by cleaning up CSS architecture

## Workaround Implemented (2025-09-28)

**Solution**: Clean Animation Removal (Option 1 Enhanced)

- **Mobile/Tablet (≤768px)**: Animation completely hidden using `display: none`
- **Desktop (>768px)**: Full 3D animation experience maintained
- **User Experience**: Clean, professional layout with no visual artifacts

**Files Modified**:

- `src/style.css`: Changed media query from sizing constraints to `display: none`
- `src/three-animation.ts`: Updated console logging to reflect clean removal
- `tests/e2e/screenshots.spec.ts`: Updated tests to expect hidden animation

**Test Results**: ✅ All tests passing (142 unit tests, 44 E2E tests)

## Next Steps

### ~~Immediate (for release):~~ ✅ COMPLETED

1. ~~Implement Option 1 workaround to disable 3D on mobile/tablet~~ ✅
2. ~~Test that 2D fallback renders correctly on all viewports~~ ✅ (Now clean removal)
3. ~~Update documentation to reflect temporary mobile limitation~~ ✅

### Short term (next sprint):

1. Remove or modify conflicting CSS media query rules
2. Ensure consistent full viewport approach across all screen sizes
3. Validate fix with viewport screenshot tests
4. Update specification to reflect CSS requirements

### Long term:

1. Refactor CSS responsive architecture
2. Add CSS-JS coordination tests
3. Document viewport canvas patterns

## Lessons Learned

- Always examine CSS cascade and responsive overrides when debugging layout issues
- Full viewport canvas implementations require careful CSS coordination
- Container size must match renderer dimensions for proper positioning
- 5 Whys technique effective for finding root cause vs. symptoms
