import type {
  TransitionConfig,
  AnimationPhase,
  AnimationProperty,
  AccessibilityConfig
} from '../lib/TransitionController';

// Transition: Vision Flow → Prompt-Driven Iteration
export const visionFlowToPromptIterationConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: '#vision-flow', // scroll to 80% of vision-flow section
  duration: 5000, // 5 seconds total
  phases: [
    {
      name: 'diagram-zoom-out',
      startTime: 0,
      duration: 1000,
      elements: ['#vision-flow .flow-diagram'],
      properties: [
        { property: 'transform', from: 'scale(1)', to: 'scale(0.8)', easing: 'power2.out' },
        { property: 'opacity',   from: 1,         to: 0.3,         easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'prompt-panel-fade-in',
      startTime: 1000,
      duration: 1500,
      elements: ['section[aria-labelledby="prompt-iteration-heading"] .prompt-panel'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'live-update-demo',
      startTime: 2500,
      duration: 2000,
      elements: [
        'section[aria-labelledby="prompt-iteration-heading"] .prompt-content',
        'section[aria-labelledby="prompt-iteration-heading"] .ui-mockup h3'
      ],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'none' }
      ] as AnimationProperty[]
    } as AnimationPhase,
    {
      name: 'headline-reveal',
      startTime: 4500,
      duration: 500,
      elements: ['section[aria-labelledby="prompt-iteration-heading"] h2'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[]
    } as AnimationPhase
  ],
  accessibility: {
    liveRegionSelector: 'section[aria-labelledby="prompt-iteration-heading"] [aria-live]',
    skipTriggerSelector: 'section[aria-labelledby="prompt-iteration-heading"] button.skip-link',
    // Disabled announcements to avoid contrast issues with aria-live region
    // announceOnStart: 'Starting prompt-driven iteration demo',
    // announceOnComplete: 'Prompt-driven iteration complete'
  } as AccessibilityConfig,
  testSelectors: [
    'vision-diagram',
    'prompt-panel',
    'iteration-headline'
  ]
};