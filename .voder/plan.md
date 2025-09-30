# Implementation Plan# Implementation Plan



Based on the assessment report findings, this plan addresses the 6 unresolved problems blocking new story development, following Gall's Law principle: start with the simplest possible implementation that works, then iterate and improve.## NOW

Fix Mobile Chrome E2E test timeout in screenshots.spec.ts:176

## NOW- Replace networkidle with domcontentloaded for Mobile Chrome

- Add explicit element waiting instead of network silence

**Implement permanent fixes for all 6 known-error problems in priority order**

## NEXT  

Start with **P003 (Priority 9 - Critical)**: Coming Soon Button Overlapping 3D CubeValidate complete E2E test suite passes 134/134

- Root cause analysis completed: CSS negative margin causing overlay- Test across all browsers to ensure no regression

- Failing test exists and passes with current workaround  - Verify screenshot quality remains consistent

- **Simple permanent fix**: Replace negative margin approach with proper CSS Grid or Flexbox layout

  - Remove `margin: 0 0 -100vh` from `.hero-animation`## LATER

  - Implement clean separation between 3D canvas background and content overlayOptimize test reliability with browser-specific strategies

  - Maintain visual design but with proper z-index stacking- Add retry logic for screenshot operations

  - Verify E2E test `tests/e2e/p003-button-overlap.test.ts` continues passing- Document Mobile Chrome specific behaviors

- Update problem status from `.known-error.md` to `.closed.md`

This follows Gall's Law by implementing the simplest CSS layout solution that eliminates the overlap problem while maintaining the existing visual design.

## NEXT

**Fix remaining Priority 9 problem: Three.js Canvas Blocks Form Interaction**
- Root cause: Canvas intercepting pointer events  
- Current workaround: `pointer-events: none` on canvas
- **Permanent fix**: Implement selective pointer event management
  - Allow pointer events on canvas for 3D interaction (mouse/touch rotation)
  - Ensure form areas have proper event bubbling
  - Test form submission works while preserving 3D interactivity
- Update to `.closed.md` status

**Then address Priority 6 problems in order:**

1. **Mobile 3D Cube Size Jump on Scroll** - Implement smooth scaling transitions instead of discrete jumps
2. **E2E Tests Expect Dev Server Port 3000** - Update test configuration to use dynamic port detection  
3. **Text Elements Visible Before JS Loaded** - Add CSS-only loading state with proper progressive enhancement
4. **Text Flash Before 3D Render** - Implement coordinated loading sequence between text and 3D systems

Each fix follows the simple-first approach: address the immediate problem with minimal changes, verify with existing tests, then close the problem.

## LATER

**Project completion and enhancement work** (after all problems are closed):

**System Optimization**:
- Refactor 3D animation system for better performance and maintainability
- Implement advanced loading strategies for smoother user experience  
- Add comprehensive error handling and fallback systems

**Enhanced Features**:
- Advanced 3D interactions and animations
- Progressive web app capabilities
- Enhanced analytics and user tracking
- Performance optimizations for mobile devices

**Process Improvements**:
- Automated problem detection and alerting
- Enhanced E2E test stability and coverage
- Continuous integration optimizations

This later work builds on the simple, working foundation established in NOW and NEXT phases, following Gall's Law by evolving the simple system into a more complex, feature-rich system only after the basic functionality is solid and all blocking problems are resolved.