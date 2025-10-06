# End-to-End Testing Guide

## Overview

This directory contains end-to-end (E2E) tests for the voder.ai website using Playwright. Tests are organized by functionality and focus on user-facing behavior and functional layout validation.

## Test Categories

### Functional Layout Tests (`functional-layout.test.ts`)

Comprehensive functional layout validation that replaces visual regression testing. Tests focus on layout behavior that affects user experience rather than visual appearance.

**Test Coverage:**

1. **Viewport Boundary Validation**
   - No horizontal overflow across all target viewports (desktop, tablet, mobile)
   - Layout adapts correctly when resizing viewports
   - Content stays within viewport boundaries at all breakpoints

2. **Critical Element Positioning**
   - 3D animation container positioned within viewport
   - Hero section content fits within viewport
   - Interactive elements (buttons, forms) positioned accessibly
   - Minimum touch target sizes met on mobile (32px - WCAG 2.1 Level AA+)

3. **Responsive Behavior Validation**
   - Layout adapts when viewport changes desktop → mobile
   - Layout adapts when viewport changes mobile → desktop
   - Layout maintains integrity through all breakpoints (320px - 1920px)

4. **Element Visibility and Accessibility**
   - All critical sections visible and in viewport
   - Interactive elements not obscured by other content
   - Elements have valid bounding boxes and positioning

5. **CSS Property Validation**
   - Proper box-sizing on layout containers
   - Appropriate overflow handling
   - Responsive width constraints

6. **Typography Overflow Detection**
   - No unintended text overflow across all viewports
   - Long words handled correctly without breaking layout
   - Accessibility elements (`.sr-only`) excluded from overflow checks

**Test Helpers:**

- `checkViewportOverflow()` - Detects horizontal/vertical overflow
- `validateCSSProperties()` - Validates layout-critical CSS properties
- `checkTextOverflow()` - Identifies text content overflow issues

**Target Viewports:**

- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

### Problem-Specific Tests

Tests targeting specific issues identified during development:

- `p003-button-overlap.test.ts` - Button positioning relative to 3D cube
- `fouc-prevention.test.ts` - Flash of Unstyled Content prevention
- `mobile-cube-resize.test.ts` - Mobile cube responsiveness

### Visual Testing (Deprecated)

⚠️ **`screenshots.spec.ts` - DEPRECATED** ⚠️

Visual regression testing via screenshot comparison is being replaced by functional layout tests. See ADR-0035 for rationale.

## Running Tests

```bash
# Run all E2E tests
npm run e2e

# Run all E2E tests with visible browser
npm run e2e:headed

# Run specific test file
npx playwright test tests/e2e/functional-layout.test.ts

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=webkit
npx playwright test --project='Mobile Chrome'
```

## Test Philosophy

### Functional Over Visual

Tests validate **how the layout behaves**, not **how it looks**:

- ✅ Element stays within viewport
- ✅ No horizontal scroll
- ✅ Buttons reachable and clickable
- ✅ Text doesn't overflow container
- ❌ Element is exactly 50px from top
- ❌ Font is exactly #333333
- ❌ Background is perfect gradient

This approach:

- Supports continuous design iteration
- Prevents actual layout failures
- Reduces test brittleness
- Focuses on user experience impact

### Fast Feedback Loop

Tests organized for fast execution:

1. **Viewport tests** - Quick boundary checks
2. **Element positioning** - Critical interactive elements
3. **Responsive behavior** - Layout adaptation
4. **Detailed validation** - CSS properties, typography

Future enhancement: Fast pre-commit subset focusing on most critical tests.

## Test Structure

Each test file follows consistent structure:

```typescript
// 1. Imports
import { expect, test } from '@playwright/test';

// 2. Constants (viewports, selectors, thresholds)
const VIEWPORTS = [...];

// 3. Helper functions
async function helperFunction(page) { ... }

// 4. Test suites
test.describe('Feature Area', () => {
  test.describe('Sub-area', () => {
    test('specific behavior', async ({ page }) => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Adding New Tests

When adding functional layout tests:

1. **Identify the behavior** - What layout behavior affects users?
2. **Choose target viewports** - Which viewports need testing?
3. **Write clear assertions** - What's the measurable outcome?
4. **Add helpful error messages** - Include actual vs expected values
5. **Consider helper functions** - Can logic be reused?

Example:

```typescript
test('should position footer within viewport', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const footer = page.locator('footer');
  const box = await footer.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  if (box && viewport) {
    expect(
      box.x + box.width,
      `Footer (${box.width}px) should fit within viewport (${viewport.width}px)`,
    ).toBeLessThanOrEqual(viewport.width);
  }
});
```

## Debugging Failed Tests

When tests fail:

1. **Check the error message** - Includes actual vs expected values
2. **Review screenshots** - Saved in `test-results/`
3. **Watch videos** - Video recordings capture full test execution
4. **Run with headed browser** - `npm run e2e:headed`
5. **Use Playwright Inspector** - `npx playwright test --debug`

## CI/CD Integration

Tests run automatically on:

- Pull requests
- Commits to main branch
- Pre-deployment validation

Configuration in `.github/workflows/` and `playwright.config.ts`.

## Related Documentation

- [ADR-0035: Use Functional Layout Testing Instead of Visual Regression](../../docs/decisions/0035-use-functional-layout-testing-instead-of-visual-regression.accepted.md)
- [E2E Testing Strategy](../../docs/E2E-TESTING.md)
- [E2E Reproduction Guide](../../docs/E2E-REPRO.md)

## Maintenance

### Updating Viewport Targets

If target viewports change, update the `VIEWPORTS` constant in `functional-layout.test.ts`:

```typescript
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
] as const;
```

### Touch Target Size Guidelines

Current minimum: **32px** (between WCAG 2.1 Level AA [24px] and AAA [44px])

Update in test if standards change:

```typescript
const MINIMUM_TOUCH_TARGET = 32; // WCAG 2.1 Level AA+
```

### Excluding Elements from Overflow Detection

Add class names to skip list in `checkTextOverflow()`:

```typescript
if (
  classList.some(
    (cls) =>
      cls.includes('sr-only') ||
      cls.includes('visually-hidden') ||
      cls.includes('intentional-overflow'), // Add new exclusions here
  )
) {
  return;
}
```
