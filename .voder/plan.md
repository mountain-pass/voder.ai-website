# Implementation Plan

Based on visual quality assessment, we need to fix critical layout issues preventing launch.

## NOW

**Fix email form positioning and mysterious teal line artifact on desktop**

Investigate and fix the two critical visual defects visible in desktop screenshots:

1. **Email form positioning**: The email signup form appears misaligned/awkwardly positioned on desktop viewport (1920x1080). Need to:
   - Examine CSS for `.interest-capture` and `.signup-form` classes
   - Check for margin/padding issues causing poor alignment
   - Test positioning across different desktop resolutions
   - Ensure form is properly centered and visually balanced

2. **Mysterious teal line artifact**: There's an unexplained teal line/border visible in top-left corner of desktop layout. Need to:
   - Identify source of the teal line (CSS border, outline, or positioning issue)
   - Check for overflow, pseudo-elements, or stray styling
   - Remove the artifact completely
   - Verify clean layout across all desktop viewports

**Testing approach**: Make changes, run `npm run screenshots`, visually inspect desktop screenshots for fixes.

## NEXT

**Optimize responsive layout quality**

After fixing the critical desktop issues:

1. **Polish spacing and alignment** across all components on desktop
2. **Verify tablet layout quality** - ensure no similar artifacts exist
3. **Fine-tune responsive breakpoints** if needed for better visual flow
4. **Test email form functionality** on all viewports after CSS changes

## LATER

**Performance and polish improvements**

1. **Optimize loading performance** for faster first impressions
2. **Add hover/focus states refinements** for better interactivity
3. **Consider subtle animations** for more professional feel
4. **Test across different browsers** for consistent rendering

---

*This plan follows Gall's Law by starting with the simplest fixes to make the current system work properly, then building up polish and refinements.*