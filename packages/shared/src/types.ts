// Additional type definitions
export type ScrollDirection = 'up' | 'down';
export type AnimationState = 'idle' | 'running' | 'paused' | 'complete';
export type EffectType = 'canvas3d' | 'typing' | 'particles' | 'button' | 'code';
export type SectionType = 'brand-entry' | 'the-why' | 'problem-space' | 'metaphor' | 'vision-flow' | 'prompt-iteration' | 'outcome-focus' | 'closing-moment';

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EventCallback<T = void> = (data: T) => void;

// Service registry types
export interface ServiceRegistry {
  animation: any;
  scroll: any;
  accessibility: any;
  asset: any;
}
