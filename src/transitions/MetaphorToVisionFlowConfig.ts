import type {
  TransitionConfig,
  AnimationPhase,
  AnimationProperty,
  AccessibilityConfig
} from '../lib/TransitionController';

// Transition: Metaphor → Vision Flow
export const metaphorToVisionFlowConfig: TransitionConfig = {
  trigger: 'scroll',
  triggerValue: '[data-testid="metaphor-section"]',
  duration: 3500,
  phases: [
    {
      name: 'path-morph',
      startTime: 0,
      duration: 1000,
      elements: ['.journey-diagram'],
      properties: [
        {
          property: 'stroke-dasharray',
          from: '0,1000',
          to: '1000,0',
          easing: 'power2.out'
        }
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'background-lighten',
      startTime: 1000,
      duration: 500,
      elements: ['section[data-testid="metaphor-section"]'],
      properties: [
        {
          property: 'backgroundColor',
          from: '#0A0A0A',
          to: '#0F1A2E',
          easing: 'power1.inOut'
        }
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'draw-flow-diagram',
      startTime: 1500,
      duration: 1500,
      elements: ['.flow-diagram svg line', '.flow-diagram svg circle'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[],
    } as AnimationPhase,
    {
      name: 'label-fade-in',
      startTime: 3000,
      duration: 500,
      elements: ['.flow-text .flow-step h3', '.flow-text .flow-step p'],
      properties: [
        { property: 'opacity', from: 0, to: 1, easing: 'power2.out' }
      ] as AnimationProperty[],
    } as AnimationPhase
  ],
  accessibility: {
    liveRegionSelector: 'section[data-testid="metaphor-section"] + div[aria-live]',
    skipTriggerSelector: 'a.skip-link',
    announceOnStart: 'Transitioning to architecture diagram',
    announceOnComplete: 'Vision flow revealed'
  } as AccessibilityConfig,
  testSelectors: [
    'metaphor-path',
    'flow-diagram',
    'source-prompts-node',
    'voder-node',
    'application-code-node',
    'working-product-node'
  ]
};
