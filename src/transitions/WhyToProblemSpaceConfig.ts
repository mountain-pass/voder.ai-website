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
      elements: ['#why-heading', '.subheading'],
      properties: [
        { property: 'opacity', from: 1, to: 0, easing: 'power2.out' },
        { property: 'filter', from: 'blur(0px)', to: 'blur(10px)', easing: 'power2.out' },
        {
          property: 'transform',
          from: 'translateY(0px)',
          to: 'translateY(-50px)',
          easing: 'power2.out'
        }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'emerge-chaos',
      startTime: 2000,
      duration: 1500,
      elements: ['.visual-chaos'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'reveal-problem-content',
      startTime: 3500,
      duration: 500,
      elements: ['#problem-heading', '.secondary-heading', '.secondary-copy'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' },
        {
          property: 'transform',
          from: 'translateY(30px)',
          to: 'translateY(0px)',
          easing: 'power2.out'
        }
      ] as AnimationProperty[]
    } as AnimationPhase
  ],
  accessibility: {
    liveRegionSelector: '#main-content div[aria-live]',
    skipTriggerSelector: '',
    announceOnStart: 'Transitioning from Why section to Problem Space',
    announceOnComplete: 'Problem Space section revealed'
  } as AccessibilityConfig,
  testSelectors: [
    '#main-content',
    '#problem-heading',
    '.visual-chaos'
  ]
};