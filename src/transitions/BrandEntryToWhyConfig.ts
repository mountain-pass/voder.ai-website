import type { TransitionConfig, AnimationPhase, AnimationProperty, AccessibilityConfig } from '../lib/TransitionController';

// Configuration for the Brand Entry → The Why transition
export const brandEntryToWhyConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: '#main-content', // scroll Y > 50px (~5% of viewport)
  duration: 3000, // 3 seconds total
  phases: [
    {
      name: 'dissolve-3d-intro',
      startTime: 0,
      duration: 1000,
      elements: ['.three-d-transition'],
      properties: [
        { property: 'opacity', from: 1, to: 0.3, easing: 'power2.out' },
        { property: 'transform', from: 'none', to: 'scale(1)', easing: 'power2.out' }
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'logo-reposition',
      startTime: 1000,
      duration: 1000,
      elements: ['section[role="banner"] h1'],
      properties: [
        { property: 'transform', from: 'translate(0,0) scale(1)', to: 'translate(-40%, -60%) scale(0.7)', easing: 'power2.inOut' }
      ] as AnimationProperty[],
    } as AnimationPhase
    // REMOVED why-section-fadein to avoid conflict with WhyToProblemSpaceTransition
  ],
  accessibility: {
    liveRegionSelector: 'section[role="main"] div[aria-live] ',
    skipTriggerSelector: 'a.skip-link',
    announceOnStart: 'Moving to main message',
    announceOnComplete: 'Main message visible'
  } as AccessibilityConfig,
  testSelectors: [
    'brand-object-trigger',
    'logo-reposition-complete'
    // REMOVED 'why-headline' to avoid conflicts
  ]
};
