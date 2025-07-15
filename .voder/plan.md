# Voder.ai Website Implementation Plan

## ✅ COMPLETED

Fixed bidirectional scrolling in `src/lib/TransitionController.ts`:
- ✅ Replaced `onEnter` callback with `toggleActions: "play reverse play reverse"`
- ✅ Updated ScrollTrigger configuration to use proper start/end points
- ✅ Added proper TypeScript types (GSAPVars) to eliminate `any` usage
- ✅ Enhanced accessibility with bidirectional announcements
- ✅ Build and most tests passing (existing issues unrelated to transition fix)

## NOW

Test scrolling behavior in the browser to verify bidirectional transitions work correctly for all sections.

## NEXT

- Test all transitions play forward on scroll down and reverse on scroll up
- Update transition config files in `src/transitions/*.ts` to match timing specifications
- Add bidirectional testing assertions to Playwright test suites
- Verify accessibility announcements work for both scroll directions

## LATER

– Add explicit bidirectional behavior sections to remaining transition prompt files in `prompts/sections/`
– Review and fine-tune all GSAP `ScrollTrigger` start/end thresholds and easing curves to perfect the cinematic pacing and narrative flow