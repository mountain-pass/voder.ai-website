## NOW

Implement the BIZ-VIEWPORT-LAYOUT story specifications that were identified as non-compliant during the assessment. The current CSS implementation uses generic responsive design patterns rather than the precise mathematical viewport specifications required by the story.

**Critical Implementation Tasks:**

1. **Replace fixed pixel sizing with viewport-relative units** - Update CSS to use vh/vw units as specified in REQ-CSS-VIEWPORT-UNITS
2. **Implement precise viewport percentage allocations** - Apply the exact percentages specified in the story:
   - Desktop (1920x1080): Logo 15%, Cube 35%, Headline 15%, Description 15%, CTA 20%
   - Tablet (768x1024): Logo 12%, Cube 30%, Headline+Description 25%, CTA+margin 33%
   - Mobile (375x667): Logo 10%, Cube 25%, Headline 15%, Description 20%, CTA 15%, Margin 15%
3. **Establish mathematical spacing relationships** - Implement REQ-VERTICAL-RHYTHM base unit scaling (desktop 1x, tablet 0.75x, mobile 0.6x)
4. **Update CSS architecture** to follow ADR-0034 specifications that were documented but not implemented

**Files to Modify:**
- `src/style.css` - Replace current responsive breakpoints with precise viewport-relative measurements
- Update media queries to implement exact spacing mathematics per viewport

## NEXT

After implementing the viewport layout specifications:

1. **Run screenshot tests** to verify visual compliance with new mathematical layout
2. **Validate measurements** against story requirements using browser developer tools
3. **Update test expectations** if any visual regression tests need adjustment
4. **Verify accessibility compliance** is maintained after layout changes

## LATER

Once BIZ-VIEWPORT-LAYOUT implementation is complete and verified:

1. **Re-run full assessment** to confirm story compliance and unblock development
2. **Document implementation lessons learned** for future precise specification stories
3. **Consider automation** of specification compliance validation in CI/CD pipeline