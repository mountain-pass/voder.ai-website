// Core interfaces for the Voder website architecture
export interface ISection {
  readonly id: string;
  render(data: SectionData): HTMLElement;
  destroy(): void;
}

export interface IEffect {
  readonly name: string;
  apply(element: HTMLElement, config: EffectConfig): Promise<void>;
}

export interface IAnimationService {
  execute(command: AnimationCommand): Promise<void>;
}

export interface IScrollService {
  onScroll(callback: (position: number) => void): void;
  getScrollPosition(): number;
}

export interface IAccessibilityService {
  announceToScreenReader(message: string): void;
  setFocusManagement(enabled: boolean): void;
}

export interface IAssetService {
  loadAsset(url: string): Promise<any>;
  preloadAssets(urls: string[]): Promise<void>;
}

// Data types
export interface SectionData {
  id: string;
  content: any;
  config: SectionConfig;
}

export interface SectionConfig {
  animations?: AnimationConfig;
  effects?: EffectConfig[];
  accessibility?: AccessibilityConfig;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface EffectConfig {
  type: string;
  intensity: number;
  parameters: Record<string, any>;
}

export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
}

// Animation commands
export interface AnimationCommand {
  type: 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'custom';
  target: HTMLElement;
  config: AnimationConfig;
}
