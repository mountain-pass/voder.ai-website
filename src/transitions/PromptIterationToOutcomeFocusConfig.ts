import type {
  TransitionConfig,
  AnimationPhase,
  AnimationProperty,
  AccessibilityConfig,
} from '../lib/TransitionController';

// Configuration for the Prompt-Driven Iteration → Outcome Focus transition
export const promptIterationToOutcomeFocusConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: 'section[aria-labelledby="prompt-iteration-heading"]',
  duration: 4000, // 4 seconds total
  phases: [
    {
      name: 'prompt-panel-fade-zoom',
      startTime: 0,
      duration: 1000,
      elements: ['.prompt-panel'],
      properties: [
        { property: 'opacity', from: 1, to: 0.3, easing: 'power2.out' },
        { property: 'transform', from: 'scale(1)', to: 'scale(0.8)', easing: 'power2.out' },
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'benefit-1-reveal',
      startTime: 1000,
      duration: 500,
      elements: ['.benefit-item:nth-of-type(1)'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'benefit-2-reveal',
      startTime: 1500,
      duration: 500,
      elements: ['.benefit-item:nth-of-type(2)'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'benefit-3-reveal',
      startTime: 2000,
      duration: 500,
      elements: ['.benefit-item:nth-of-type(3)'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'benefit-4-reveal',
      startTime: 2500,
      duration: 500,
      elements: ['.benefit-item:nth-of-type(4)'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'outcomes-headline-reveal',
      startTime: 3000,
      duration: 1000,
      elements: ['#outcome-focus-heading'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
      ] as AnimationProperty[],
    } as AnimationPhase,
  ],
  accessibility: {
    liveRegionSelector: 'section[aria-labelledby="outcome-focus-heading"] [aria-live]',
    skipTriggerSelector: 'a.skip-link',
    announceOnStart: 'Starting outcome focus transition',
    announceOnComplete: 'Outcome focus complete',
  } as AccessibilityConfig,
  testSelectors: [
    'prompt-panel',
    'benefit-1',
    'benefit-2',
    'benefit-3',
    'benefit-4',
    'outcomes-headline',
  ],
};
