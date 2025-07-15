import type {
  TransitionConfig,
  AnimationPhase,
  AnimationProperty,
  AccessibilityConfig
} from '../lib/TransitionController';

// Transition: Outcome Focus → Closing Moment
export const outcomeFocusToClosingMomentConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: 'section[role="contentinfo"]',
  duration: 5000, // 5 seconds total
  phases: [
    {
      name: 'benefits-fade-out',
      startTime: 0,
      duration: 1000,
      elements: ['.benefit-container .benefit-item'],
      properties: [
        { property: 'opacity', from: 1, to: 0, easing: 'power2.inOut' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'background-to-black',
      startTime: 1000,
      duration: 2000,
      elements: ['section[role="contentinfo"]'],
      properties: [
        { property: 'backgroundColor', from: '#0F1A2E', to: '#0A0A0A', easing: 'power1.inOut' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'tagline-emergence',
      startTime: 3000,
      duration: 1000,
      elements: ['.closing-statement .tagline'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'final-elements-reveal',
      startTime: 4000,
      duration: 1000,
      elements: ['.coming-soon', '.built-with', '.logo-signature img'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase
  ],
  accessibility: {
    liveRegionSelector: 'section[role="contentinfo"] div[aria-live]',
    skipTriggerSelector: 'a.skip-link',
    announceOnStart: 'Reaching final brand statement',
    announceOnComplete: 'Voder presentation complete'
  } as AccessibilityConfig,
  testSelectors: [
    'outcome-benefits',
    'compiler-tagline',
    'coming-soon',
    'voder-logo'
  ]
};
