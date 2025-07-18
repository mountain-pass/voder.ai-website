# Voder.ai Website Implementation Plan

## NOW

Fix WhyToProblemSpaceTransition to use scroll-tied behavior with `scrub: 1` instead of trigger-based implementation to resolve 9 failing tests. Convert all remaining trigger-based animations across sections to use GSAP ScrollTrigger with `scrub` for bidirectional scroll-tied behavior. Update TransitionController instances in BrandEntryToWhyConfig, ProblemSpaceToMetaphorConfig, and other transition files to ensure animations progress and reverse smoothly with scroll position.

## NEXT

Implement missing visual specification requirements: morphing backgrounds during stillness in The Why section, realistic syntax-highlighted TypeScript/JSX code fragments with color-coding in Problem Space, progressive disclosure animations for benefit cards in Outcome Focus section, and cinematic fade effect with signature glow in Closing Moment. Enhance Problem Space visual chaos with more sophisticated Three.js particle effects and realistic code fragment displays.

## LATER

Fine-tune scroll-tied animation timing with consistent easing curves and optimal start/end points for smooth bidirectional movement. Implement performance optimizations for scroll-tied animations and 3D rendering. Add automated visual regression testing to compare Playwright screenshots against specification designs. Polish animation precision and micro-interactions for enhanced user experience while maintaining full accessibility compliance.
