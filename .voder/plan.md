# Implementation Plan

## NOW

**Implement Story 026.02-BIZ-SEGMENT-MAPPING (Required Dependency)**

Analysis complete: Story 026.03 depends on 026.02-BIZ-SEGMENT-MAPPING which is not yet implemented. Following proper dependency order, we must implement 026.02 first.

**Status Check**:
- ✅ 026.01-BIZ-SCROLL-DETECTION: Implemented (`scroll-narrative-detector.ts`)
- ❌ 026.02-BIZ-SEGMENT-MAPPING: NOT implemented (required for 026.03)
- ❌ 026.03-BIZ-COLOR-ATMOSPHERE: Waiting for 026.02

**Action**: Implement the segment mapping system following Gall's Law (simplest working system).

**Implementation Steps**:
1. Create `src/segment-mapper.ts` with SegmentMapper class
2. Define narrative map configuration (5 acts, 8 segments with scroll ranges)
3. Implement active segment detection logic based on scroll progress
4. Add state tracking for current act and active segments
5. Integrate with existing ScrollNarrativeDetector
6. Add debug console logging showing segment states
7. Write tests for segment mapping logic
8. Verify accurate mapping at all scroll positions

**Why This Matters**: 026.02 provides the timing foundation that 026.03 needs to know which segments should be visible at any scroll position.

## NEXT

**Implement Story 026.03-BIZ-COLOR-ATMOSPHERE (After 026.02 Complete)**

Once segment mapping is implemented and tested:

1. Add CSS foundation for opacity transitions (.narrative-segment with .visible/.hidden classes)
2. Create ProgressiveReveal class to manage segment visibility
3. Integrate ProgressiveReveal with SegmentMapper
4. Add data-segment attributes to HTML narrative elements
5. Wire up scroll handler to trigger visibility updates  
6. Write tests for scroll-driven visibility behavior
7. Verify performance (60fps opacity transitions)
8. Test mobile compatibility  
9. Add accessibility support (prefers-reduced-motion)
10. Update traceability JSON files for both 026.02 and 026.03 to PASSED

## LATER

**Continue Release 1.0 Story Implementation**

After story 026.03 is complete and validated:
- Update traceability JSON to PASSED status
- Re-run assessment to find next unimplemented story
- Continue working backwards through Release 1.0 stories
- Build on this foundation for more sophisticated visual effects

**Optional Dependency Maintenance** (Non-Blocking)

Schedule for next maintenance cycle when packages mature beyond 7-day window:
- Update 8 outdated packages (eslint, playwright, postcss, stylelint, typescript, vite, vitest)
- Address 3 low-severity vulnerabilities (micromatch, cross-spawn, path-to-regexp)
