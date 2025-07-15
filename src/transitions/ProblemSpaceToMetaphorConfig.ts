import type {
  TransitionConfig,
  AnimationPhase,
  AnimationProperty,
  AccessibilityConfig
} from '../lib/TransitionController';

// Configuration for the Problem Space → Metaphor transition
export const problemSpaceToMetaphorConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: '[data-test-id="problem-section"]', // scroll to problem section
  duration: 4000, // total duration in ms (4 seconds)
  phases: [
    {
      name: 'chaos-peak',
      startTime: 0,
      duration: 1000,
      elements: ['.visual-chaos'],
      properties: [
        { property: 'opacity', from: 1, to: 1, easing: 'none' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'collapse-fragments',
      startTime: 1000,
      duration: 1500,
      elements: ['.visual-chaos'],
      properties: [
        { property: 'transform', from: 'scale(1)', to: 'scale(0.1)', easing: 'power2.in' },
        { property: 'opacity', from: 1, to: 0, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'void-moment',
      startTime: 2500,
      duration: 500,
      elements: ['.visual-chaos'],
      properties: [
        { property: 'opacity', from: 0, to: 0, easing: 'none' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'metaphor-emerge',
      startTime: 3000,
      duration: 1000,
      elements: ['.journey-diagram', 'h2#metaphor-heading', 'section[data-testid="metaphor-section"] p'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
        { property: 'transform', from: 'translateY(20px)', to: 'translateY(0)', easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase
  ],
  accessibility: {
    liveRegionSelector: 'section[aria-labelledby="transition-heading"] div[aria-live]',
    skipTriggerSelector: 'a.skip-link',
    announceOnStart: 'Transitioning to solution explanation',
    announceOnComplete: 'Solution metaphor revealed'
  } as AccessibilityConfig,
  testSelectors: [
    'chaos-container',
    'key-message',
    'road-metaphor',
    'passenger-headline',
    'metaphor-labels'
  ]
};
