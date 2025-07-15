import type {
  TransitionConfig,
  AnimationPhase,
  AnimationProperty,
  AccessibilityConfig
} from '../lib/TransitionController';

// Transition: The Why → Problem Space
export const whyToProblemSpaceConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: '#main-content',
  duration: 4000,
  phases: [
    {
      name: 'darken-background',
      startTime: 0,
      duration: 1000,
      elements: ['#main-content'],
      properties: [
        {
          property: 'backgroundColor',
          from: '#0F1A2E',
          to: '#0A0A0A',
          easing: 'power2.out'
        }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'dissolve-why-text',
      startTime: 1000,
      duration: 1000,
      elements: ['#why-heading'],
      properties: [
        { property: 'opacity', from: 1, to: 0, easing: 'power2.out' },
        {
          property: 'transform',
          from: 'translateY(0px)',
          to: 'translateY(-100px)',
          easing: 'power2.out'
        }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'show-chaos',
      startTime: 2000,
      duration: 1500,
      elements: ['.visual-chaos'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'reveal-problem-text',
      startTime: 3500,
      duration: 500,
      elements: ['h2#problem-heading', 'p.secondary-heading', 'p.secondary-copy'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase
  ],
  accessibility: {
    liveRegionSelector: '.visual-chaos ~ div[aria-live]',
    skipTriggerSelector: 'section[role="main"] .skip-link',
    announceOnStart: 'Transitioning to problem identification',
    announceOnComplete: 'Problem space revealed'
  } as AccessibilityConfig,
  testSelectors: [
    'why-statement',
    'code-fragments',
    'problem-headline'
  ]
};