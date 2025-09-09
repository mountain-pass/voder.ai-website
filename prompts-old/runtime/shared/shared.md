# @voder/shared Package Implementation Guide

This document provides comprehensive implementation guidelines for the `@voder/shared` package, which serves as the foundation for all runtime packages in the Voder monorepo. This package contains core TypeScript interfaces, runtime utilities, and shared functionality that prevents code duplication across the system.

## 🎯 **PACKAGE SCOPE & RESPONSIBILITIES**

### **Primary Responsibilities**

- **Type Definitions**: Core interfaces, types, and contracts for all runtime packages
- **Runtime Utilities**: Validation functions, common helpers, and shared utilities
- **Constants**: Shared constants and configuration values
- **Base Classes**: Abstract base classes for common patterns
- **Error Types**: Standardized error classes and error handling utilities

### **What This Package Should NOT Include**

- ❌ Business logic specific to individual components
- ❌ DOM manipulation utilities (belongs in components)
- ❌ Animation-specific code (belongs in services)
- ❌ Build-time utilities (belongs in development packages)
- ❌ External library wrappers (should be minimal and focused)

## 🏗️ **PACKAGE STRUCTURE**

```
packages/shared/
├── src/
│   ├── index.ts                    # Main export barrel
│   ├── types/                      # Type definitions
│   │   ├── index.ts               # Type exports
│   │   ├── component.ts           # Component interfaces
│   │   ├── service.ts             # Service interfaces
│   │   ├── configuration.ts       # Configuration types
│   │   ├── events.ts              # Event system types
│   │   └── lifecycle.ts           # Lifecycle interfaces
│   ├── interfaces/                # Core interfaces
│   │   ├── index.ts               # Interface exports
│   │   ├── IComponent.ts          # Base component interface
│   │   ├── IService.ts            # Base service interface
│   │   ├── IServiceContainer.ts   # Service container interface
│   │   ├── IEventBus.ts           # Event bus interface
│   │   └── IRenderer.ts           # Renderer interface
│   ├── utils/                     # Runtime utilities
│   │   ├── index.ts               # Utility exports
│   │   ├── validation.ts          # Validation functions
│   │   ├── object-utils.ts        # Object manipulation utilities
│   │   ├── type-guards.ts         # Type guard functions
│   │   ├── async-utils.ts         # Promise and async utilities
│   │   └── dom-utils.ts           # Minimal DOM utilities
│   ├── constants/                 # Shared constants
│   │   ├── index.ts               # Constant exports
│   │   ├── events.ts              # Event name constants
│   │   ├── lifecycle.ts           # Lifecycle phase constants
│   │   ├── performance.ts         # Performance thresholds
│   │   └── accessibility.ts       # ARIA constants
│   ├── errors/                    # Error classes
│   │   ├── index.ts               # Error exports
│   │   ├── ComponentError.ts      # Component-specific errors
│   │   ├── ServiceError.ts        # Service-specific errors
│   │   ├── ValidationError.ts     # Validation errors
│   │   └── ConfigurationError.ts  # Configuration errors
│   └── base/                      # Base classes
│       ├── index.ts               # Base class exports
│       ├── BaseComponent.ts       # Abstract component base
│       ├── BaseService.ts         # Abstract service base
│       └── BaseEventTarget.ts     # Event target base
├── tests/                         # Vitest unit tests
├── dist/                          # Built output (git-ignored)
├── package.json                   # Package metadata
├── tsconfig.json                  # TypeScript config
└── rollup.config.js               # Build configuration
```

## 🔧 **CORE INTERFACES**

### **Component Interface Hierarchy**

```typescript
// src/interfaces/IComponent.ts
export interface IComponent {
  readonly id: string;
  readonly type: string;
  initialize(): Promise<void>;
  mount(container: Element): Promise<void>;
  unmount(): Promise<void>;
  destroy(): void;
  getState(): ComponentState;
}

export interface IConfigurableComponent<TConfig = unknown> extends IComponent {
  readonly config: TConfig;
  updateConfig(config: Partial<TConfig>): Promise<void>;
}

export interface IEventEmittingComponent extends IComponent, EventTarget {
  emit<T>(eventType: string, detail: T): void;
}

// Common component lifecycle states
export type ComponentState =
  | 'created'
  | 'initializing'
  | 'initialized'
  | 'mounting'
  | 'mounted'
  | 'unmounting'
  | 'unmounted'
  | 'destroyed'
  | 'error';
```

### **Service Interface Hierarchy**

```typescript
// src/interfaces/IService.ts
export interface IService {
  readonly name: string;
  readonly version: string;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
  getHealth(): ServiceHealth;
}

export interface IConfigurableService<TConfig = unknown> extends IService {
  readonly config: TConfig;
  updateConfig(config: Partial<TConfig>): Promise<void>;
}

export interface ICacheableService extends IService {
  clearCache(): Promise<void>;
  getCacheStats(): CacheStats;
}

// Service health monitoring
export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: Date;
  details?: Record<string, unknown>;
}

export interface CacheStats {
  size: number;
  hitRate: number;
  missRate: number;
  lastCleared: Date;
}
```

### **Service Container Interface**

```typescript
// src/interfaces/IServiceContainer.ts
export interface IServiceContainer {
  register<T extends IService>(
    name: string,
    factory: ServiceFactory<T>,
    options?: ServiceRegistrationOptions,
  ): void;

  resolve<T extends IService>(name: string): T;

  has(name: string): boolean;

  unregister(name: string): void;

  getRegisteredServices(): string[];

  shutdown(): Promise<void>;
}

export type ServiceFactory<T extends IService> = (
  container: IServiceContainer,
) => T | Promise<T>;

export interface ServiceRegistrationOptions {
  singleton?: boolean;
  lazy?: boolean;
  dependencies?: string[];
}
```

### **Event System Interfaces**

```typescript
// src/interfaces/IEventBus.ts
export interface IEventBus {
  emit<T>(eventType: string, detail: T): void;
  on<T>(eventType: string, handler: EventHandler<T>): EventSubscription;
  off(subscription: EventSubscription): void;
  once<T>(eventType: string, handler: EventHandler<T>): Promise<T>;
  clear(): void;
}

export type EventHandler<T = unknown> = (detail: T) => void | Promise<void>;

export interface EventSubscription {
  readonly id: string;
  readonly eventType: string;
  unsubscribe(): void;
}

// Standard event types used across components
export interface ComponentEvent<T = unknown> {
  readonly component: string;
  readonly timestamp: Date;
  readonly data: T;
}

export interface ServiceEvent<T = unknown> {
  readonly service: string;
  readonly timestamp: Date;
  readonly data: T;
}
```

### **Renderer Interface**

```typescript
// src/interfaces/IRenderer.ts
export interface IRenderer {
  render(template: RenderTemplate, container: Element): Promise<void>;
  clear(container: Element): void;
  update(container: Element, updates: RenderUpdate[]): Promise<void>;
}

export interface RenderTemplate {
  readonly type: string;
  readonly data: Record<string, unknown>;
  readonly options?: RenderOptions;
}

export interface RenderUpdate {
  readonly selector: string;
  readonly operation: 'replace' | 'append' | 'prepend' | 'remove';
  readonly content?: string | Element;
}

export interface RenderOptions {
  sanitize?: boolean;
  validateHtml?: boolean;
  preserveScripts?: boolean;
}
```

### **Section Component Interface**

```typescript
// src/interfaces/ISectionComponent.ts
export interface ISectionComponent extends IComponent {
  render(container: Element): Promise<void>;
  updateScrollProgress(progress: number): void;
  cleanup(): Promise<void>;
}

export interface SectionServices {
  animation: IAnimationService;
  accessibility: IAccessibilityService;
  assets: IAssetService;
  scroll: IScrollService;
}

export interface SectionConfiguration extends ComponentConfiguration {
  readonly sectionId: string;
  readonly scrollTrigger?: ScrollTriggerConfiguration;
  readonly effects?: EffectConfiguration[];
}

export interface ScrollTriggerConfiguration {
  readonly start: string;
  readonly end: string;
  readonly scrub?: boolean | number;
  readonly pin?: boolean;
}

export interface EffectConfiguration {
  readonly type: string;
  readonly enabled: boolean;
  readonly config?: Record<string, unknown>;
}
```

### **Effect Component Interface**

```typescript
// src/interfaces/IEffectComponent.ts
export interface IEffectComponent extends IComponent {
  initialize(container: Element): Promise<void>;
  destroy(): Promise<void>;
  resize(dimensions: EffectDimensions): Promise<void>;
  setVisibility(visible: boolean): void;
}

export interface EffectServices {
  animation: IAnimationService;
  accessibility: IAccessibilityService;
  performance: IPerformanceService;
  assets?: IAssetService;
}

export interface EffectConfiguration extends ComponentConfiguration {
  readonly effectType: string;
  readonly container?: Element;
  readonly performance?: EffectPerformanceConfig;
  readonly accessibility?: EffectAccessibilityConfig;
}

export interface EffectDimensions {
  readonly width: number;
  readonly height: number;
  readonly devicePixelRatio?: number;
}

export interface EffectPerformanceConfig {
  readonly targetFPS?: number;
  readonly enableGPUAcceleration?: boolean;
  readonly maxRenderDistance?: number;
}

export interface EffectAccessibilityConfig extends AccessibilityConfiguration {
  readonly providesAlternativeText?: boolean;
  readonly respectsReducedMotion?: boolean;
  readonly hasKeyboardControls?: boolean;
}
```

### **Animation Timeline Interface**

```typescript
// src/interfaces/IAnimationTimeline.ts
export interface IAnimationTimeline {
  play(): void;
  pause(): void;
  reverse(): void;
  seek(time: number): void;
  kill(): void;
  progress(): number;
  duration(): number;
}

export interface TimelineConfiguration {
  readonly paused?: boolean;
  readonly repeat?: number;
  readonly yoyo?: boolean;
  readonly delay?: number;
}
```

## 📝 **TYPE DEFINITIONS**

### **Configuration Types**

```typescript
// src/types/configuration.ts
export interface BaseConfiguration {
  readonly id: string;
  readonly enabled?: boolean;
  readonly debug?: boolean;
}

export interface ComponentConfiguration extends BaseConfiguration {
  readonly containerId?: string;
  readonly className?: string;
  readonly attributes?: Record<string, string>;
  readonly accessibility?: AccessibilityConfiguration;
}

export interface ServiceConfiguration extends BaseConfiguration {
  readonly priority?: number;
  readonly retryPolicy?: RetryPolicy;
  readonly timeout?: number;
}

export interface AccessibilityConfiguration {
  readonly ariaLabel?: string;
  readonly ariaDescription?: string;
  readonly role?: string;
  readonly tabIndex?: number;
  readonly announceChanges?: boolean;
}

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly backoffMs: number;
  readonly exponential?: boolean;
}
```

### **Event Types**

```typescript
// src/types/events.ts
export interface LifecycleEvent {
  readonly phase: LifecyclePhase;
  readonly target: string;
  readonly timestamp: Date;
  readonly duration?: number;
  readonly error?: Error;
}

export type LifecyclePhase =
  | 'initialize'
  | 'mount'
  | 'unmount'
  | 'destroy'
  | 'configure'
  | 'error';

export interface PerformanceEvent {
  readonly operation: string;
  readonly duration: number;
  readonly memory?: number;
  readonly timestamp: Date;
  readonly metadata?: Record<string, unknown>;
}

export interface ErrorEvent {
  readonly error: Error;
  readonly context: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly timestamp: Date;
  readonly recovery?: string;
}
```

## 🛠️ **RUNTIME UTILITIES**

### **Validation Utilities**

```typescript
// src/utils/validation.ts
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string,
): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateString(
  value: unknown,
  fieldName: string,
  options: StringValidationOptions = {},
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  if (options.minLength && value.length < options.minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.minLength} characters`,
    );
  }

  if (options.maxLength && value.length > options.maxLength) {
    throw new ValidationError(
      `${fieldName} must be no more than ${options.maxLength} characters`,
    );
  }

  if (options.pattern && !options.pattern.test(value)) {
    throw new ValidationError(`${fieldName} does not match required pattern`);
  }

  return value;
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  options: NumberValidationOptions = {},
): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a valid number`);
  }

  if (options.min !== undefined && value < options.min) {
    throw new ValidationError(`${fieldName} must be at least ${options.min}`);
  }

  if (options.max !== undefined && value > options.max) {
    throw new ValidationError(
      `${fieldName} must be no more than ${options.max}`,
    );
  }

  if (options.integer && !Number.isInteger(value)) {
    throw new ValidationError(`${fieldName} must be an integer`);
  }

  return value;
}

export function validateUrl(value: unknown, fieldName: string): URL {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  try {
    return new URL(value);
  } catch {
    throw new ValidationError(`${fieldName} must be a valid URL`);
  }
}

export function validateElement(value: unknown, fieldName: string): Element {
  if (!(value instanceof Element)) {
    throw new ValidationError(`${fieldName} must be a DOM Element`);
  }
  return value;
}

export function validateComponentConfiguration(
  config: unknown,
): ComponentConfiguration {
  if (!isObject(config)) {
    throw new ValidationError('Component configuration must be an object');
  }

  const typedConfig = config as Record<string, unknown>;

  return {
    id: validateString(typedConfig.id, 'id'),
    debug:
      typedConfig.debug === undefined ? undefined : Boolean(typedConfig.debug),
    containerId:
      typedConfig.containerId === undefined
        ? undefined
        : validateString(typedConfig.containerId, 'containerId'),
    accessibility:
      typedConfig.accessibility === undefined
        ? undefined
        : validateAccessibilityConfiguration(typedConfig.accessibility),
  };
}

export function validateServiceConfiguration(
  config: unknown,
): ServiceConfiguration {
  if (!isObject(config)) {
    throw new ValidationError('Service configuration must be an object');
  }

  const typedConfig = config as Record<string, unknown>;

  return {
    id: validateString(typedConfig.id, 'id'),
    debug:
      typedConfig.debug === undefined ? undefined : Boolean(typedConfig.debug),
    priority:
      typedConfig.priority === undefined
        ? undefined
        : validateNumber(typedConfig.priority, 'priority', {
            min: 0,
            integer: true,
          }),
    timeout:
      typedConfig.timeout === undefined
        ? undefined
        : validateNumber(typedConfig.timeout, 'timeout', {
            min: 0,
            integer: true,
          }),
  };
}

export function validateAccessibilityConfiguration(
  config: unknown,
): AccessibilityConfiguration {
  if (!isObject(config)) {
    throw new ValidationError('Accessibility configuration must be an object');
  }

  const typedConfig = config as Record<string, unknown>;

  return {
    ariaLabel:
      typedConfig.ariaLabel === undefined
        ? undefined
        : validateString(typedConfig.ariaLabel, 'ariaLabel'),
    announceChanges:
      typedConfig.announceChanges === undefined
        ? undefined
        : Boolean(typedConfig.announceChanges),
  };
}

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface NumberValidationOptions {
  min?: number;
  max?: number;
  integer?: boolean;
}
```

### **Object Utilities**

```typescript
// src/utils/object-utils.ts
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

export function deepMerge<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as object, source[key] as object);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function isObject(item: unknown): item is object {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function isEmpty(obj: unknown): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}
```

### **Type Guards**

```typescript
// src/utils/type-guards.ts
export function isComponent(value: unknown): value is IComponent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'initialize' in value &&
    'mount' in value &&
    'unmount' in value &&
    'destroy' in value &&
    typeof (value as any).initialize === 'function' &&
    typeof (value as any).mount === 'function' &&
    typeof (value as any).unmount === 'function' &&
    typeof (value as any).destroy === 'function'
  );
}

export function isService(value: unknown): value is IService {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'version' in value &&
    'initialize' in value &&
    'shutdown' in value &&
    typeof (value as any).initialize === 'function' &&
    typeof (value as any).shutdown === 'function'
  );
}

export function isConfigurable<T>(
  value: unknown,
): value is IConfigurableComponent<T> | IConfigurableService<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'config' in value &&
    'updateConfig' in value &&
    typeof (value as any).updateConfig === 'function'
  );
}

export function isEventEmitting(
  value: unknown,
): value is IEventEmittingComponent {
  return (
    isComponent(value) &&
    value instanceof EventTarget &&
    'emit' in value &&
    typeof (value as any).emit === 'function'
  );
}

export function hasLifecycleState(
  value: unknown,
): value is { getState(): ComponentState } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getState' in value &&
    typeof (value as any).getState === 'function'
  );
}
```

### **Async Utilities**

```typescript
// src/utils/async-utils.ts
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
}

export function retry<T>(
  operation: () => Promise<T>,
  policy: RetryPolicy,
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let lastError: Error;

    for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
      try {
        const result = await operation();
        resolve(result);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === policy.maxAttempts) {
          reject(lastError);
          return;
        }

        const delay = policy.exponential
          ? policy.backoffMs * Math.pow(2, attempt - 1)
          : policy.backoffMs;

        await sleep(delay);
      }
    }
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
): Promise<{ result: T; metrics: PerformanceMetrics }> {
  return new Promise(async (resolve, reject) => {
    const startTime = performance.now();
    const timestamp = new Date();

    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      resolve({
        result,
        metrics: {
          operation,
          duration,
          timestamp,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): T {
  let timeoutId: ReturnType<typeof setTimeout>;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  }) as T;
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
): T {
  let inThrottle: boolean;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}
```

### **DOM Utilities**

```typescript
// src/utils/dom-utils.ts
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementCreationOptions = {},
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);

  if (options.id) {
    element.id = options.id;
  }

  if (options.className) {
    element.className = options.className;
  }

  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      element.setAttribute(key, value);
    }
  }

  if (options.textContent) {
    element.textContent = options.textContent;
  }

  if (options.innerHTML) {
    element.innerHTML = options.innerHTML;
  }

  return element;
}

export function findElement(selector: string, container?: Element): Element {
  const root = container || document;
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  return element;
}

export function findElementSafe(
  selector: string,
  container?: Element,
): Element | null {
  const root = container || document;
  return root.querySelector(selector);
}

export function removeAllChildren(element: Element): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function findFocusableElements(container: Element): Element[] {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
}

export function isElementVisible(element: Element): boolean {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetParent !== null
  );
}

export function createAriaLiveRegion(
  politeness: 'polite' | 'assertive',
): HTMLElement {
  const region = document.createElement('div');
  region.setAttribute('aria-live', politeness);
  region.setAttribute('aria-atomic', 'true');
  region.style.position = 'absolute';
  region.style.left = '-10000px';
  region.style.width = '1px';
  region.style.height = '1px';
  region.style.overflow = 'hidden';

  document.body.appendChild(region);
  return region;
}

export function addEventListenerSafe<K extends keyof HTMLElementEventMap>(
  element: Element,
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): () => void {
  element.addEventListener(type, listener, options);
  return () => element.removeEventListener(type, listener, options);
}

export interface ElementCreationOptions {
  id?: string;
  className?: string;
  attributes?: Record<string, string>;
  textContent?: string;
  innerHTML?: string;
}
```

## 🏗️ **ERROR CLASSES**

### **Component Errors**

```typescript
// src/errors/ComponentError.ts
export class ComponentError extends Error {
  constructor(
    message: string,
    public readonly componentId: string,
    public readonly operation: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'ComponentError';
  }
}
```

### **Service Errors**

```typescript
// src/errors/ServiceError.ts
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly service: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
```

### **Configuration Errors**

```typescript
// src/errors/ConfigurationError.ts
export class ConfigurationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
```

### **Validation Errors**

```typescript
// src/errors/ValidationError.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## 📊 **PERFORMANCE TYPES**

### **Performance Monitoring**

```typescript
// src/types/performance.ts
export interface PerformanceMetrics {
  readonly operation: string;
  readonly duration: number;
  readonly timestamp: Date;
}

export interface PerformanceThreshold {
  readonly operation: string;
  readonly maxDuration: number;
  readonly warningDuration: number;
}
```

## 🔢 **SHARED CONSTANTS**

### **Event Constants**

```typescript
// src/constants/events.ts
export const COMPONENT_EVENTS = {
  INITIALIZED: 'component:initialized',
  MOUNTED: 'component:mounted',
  UNMOUNTED: 'component:unmounted',
  DESTROYED: 'component:destroyed',
  ERROR: 'component:error',
  CONFIG_UPDATED: 'component:config-updated',
} as const;

export const SERVICE_EVENTS = {
  STARTED: 'service:started',
  STOPPED: 'service:stopped',
  ERROR: 'service:error',
  HEALTH_CHANGED: 'service:health-changed',
  CONFIG_UPDATED: 'service:config-updated',
} as const;

export const LIFECYCLE_EVENTS = {
  BEFORE_INITIALIZE: 'lifecycle:before-initialize',
  AFTER_INITIALIZE: 'lifecycle:after-initialize',
  BEFORE_MOUNT: 'lifecycle:before-mount',
  AFTER_MOUNT: 'lifecycle:after-mount',
  BEFORE_UNMOUNT: 'lifecycle:before-unmount',
  AFTER_UNMOUNT: 'lifecycle:after-unmount',
  BEFORE_DESTROY: 'lifecycle:before-destroy',
  AFTER_DESTROY: 'lifecycle:after-destroy',
} as const;
```

### **Performance Constants**

```typescript
// src/constants/performance.ts
export const PERFORMANCE_THRESHOLDS = {
  COMPONENT_INIT_MS: 100,
  COMPONENT_MOUNT_MS: 200,
  SERVICE_START_MS: 500,
  ANIMATION_FRAME_MS: 16.67, // 60fps
  ANIMATION_FRAME_BUDGET: 16, // 16ms for 60fps
  INTERACTION_RESPONSE_MS: 100,
  NAVIGATION_MS: 1000,
  DEFAULT_TIMEOUT: 5000,
  MAX_INITIALIZATION_TIME: 10000,
} as const;

export const MEMORY_THRESHOLDS = {
  COMPONENT_MAX_MB: 10,
  SERVICE_MAX_MB: 50,
  CACHE_MAX_MB: 100,
  TOTAL_MAX_MB: 500,
} as const;

export const RETRY_POLICIES = {
  DEFAULT: {
    maxAttempts: 3,
    backoffMs: 1000,
    exponential: true,
  },
  AGGRESSIVE: {
    maxAttempts: 5,
    backoffMs: 500,
    exponential: true,
  },
  CONSERVATIVE: {
    maxAttempts: 2,
    backoffMs: 2000,
    exponential: false,
  },
} as const;
```

### **Accessibility Constants**

```typescript
// src/constants/accessibility.ts
export const ARIA_ROLES = {
  BUTTON: 'button',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  REGION: 'region',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  COMPLEMENTARY: 'complementary',
  SEARCH: 'search',
  FORM: 'form',
  APPLICATION: 'application',
} as const;

export const ARIA_LIVE = {
  OFF: 'off',
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
} as const;

export const ACCESSIBILITY_CONSTANTS = {
  SCREEN_READER_DELAY: 150, // 150ms
  FOCUS_TRANSITION_DURATION: 150, // 150ms
  MIN_TOUCH_TARGET_SIZE: 44, // 44px
} as const;

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;
```

### **Brand Constants**

```typescript
// src/constants/brand.ts
export const BRAND_COLORS = {
  VODER_BLACK: '#0A0A0A',
  DEEP_NAVY: '#0F1A2E',
  SOFT_TEAL_GLOW: '#24D1D5',
  PAPER_WHITE: '#FFFFFF',
  COOL_GREY: '#C6CBD4',
  ACCENT_GREEN: '#9AEF00',
  WARM_GREY: '#8B8680',
  CHARCOAL: '#2D2D2D',
} as const;

export const BRAND_TYPOGRAPHY = {
  FONT_FAMILY_DISPLAY:
    'Inter, Satoshi, "Neue Haas Grotesk", system-ui, sans-serif',
  FONT_FAMILY_BODY: 'Inter, "Helvetica Neue", system-ui, sans-serif',
  FONT_FAMILY_MONO:
    'JetBrains Mono, "SF Mono", Monaco, "Cascadia Code", monospace',
} as const;
```

## 🚨 **ERROR CLASSES**

### **Base Error Classes**

```typescript
// src/errors/ComponentError.ts
export class ComponentError extends Error {
  constructor(
    message: string,
    public readonly componentId: string,
    public readonly phase: LifecyclePhase,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ComponentError';
  }
}

// src/errors/ServiceError.ts
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly serviceName: string,
    public readonly operation: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// src/errors/ValidationError.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// src/errors/ConfigurationError.ts
export class ConfigurationError extends Error {
  constructor(
    message: string,
    public readonly configKey: string,
    public readonly expectedType?: string,
    public readonly actualValue?: unknown,
  ) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
```

## 🏗️ **BASE CLASSES**

### **Abstract Component Base**

```typescript
// src/base/BaseComponent.ts
export abstract class BaseComponent implements IEventEmittingComponent {
  protected _state: ComponentState = 'created';
  private _eventTarget: EventTarget = new EventTarget();

  constructor(
    public readonly id: string,
    public readonly type: string,
  ) {}

  abstract initialize(): Promise<void>;
  abstract mount(container: Element): Promise<void>;
  abstract unmount(): Promise<void>;

  getState(): ComponentState {
    return this._state;
  }

  protected setState(state: ComponentState): void {
    const previousState = this._state;
    this._state = state;

    this.emit('component:state-changed', {
      component: this.id,
      previousState,
      currentState: state,
      timestamp: new Date(),
    });
  }

  destroy(): void {
    this.setState('destroyed');
  }

  // EventTarget delegation
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    this._eventTarget.addEventListener(type, callback, options);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    this._eventTarget.removeEventListener(type, callback, options);
  }

  dispatchEvent(event: Event): boolean {
    return this._eventTarget.dispatchEvent(event);
  }

  emit<T>(eventType: string, detail: T): void {
    const event = new CustomEvent(eventType, { detail });
    this.dispatchEvent(event);
  }
}
```

### **Abstract Service Base**

```typescript
// src/base/BaseService.ts
export abstract class BaseService implements IService {
  private _health: ServiceHealth = {
    status: 'healthy',
    lastCheck: new Date(),
  };

  constructor(
    public readonly name: string,
    public readonly version: string,
  ) {}

  abstract initialize(): Promise<void>;
  abstract shutdown(): Promise<void>;

  getHealth(): ServiceHealth {
    return { ...this._health };
  }

  protected updateHealth(
    status: ServiceHealth['status'],
    details?: Record<string, unknown>,
  ): void {
    this._health = {
      status,
      lastCheck: new Date(),
      details,
    };
  }

  protected handleError(error: Error, operation: string): void {
    this.updateHealth('unhealthy', {
      error: error.message,
      operation,
      stack: error.stack,
    });

    throw new ServiceError(
      `Service ${this.name} failed during ${operation}: ${error.message}`,
      this.name,
      operation,
      error,
    );
  }
}
```

## 📦 **EXPORT STRUCTURE**

### **Main Export Barrel**

```typescript
// src/index.ts
// Type exports
export type * from './types/index.js';

// Interface exports
export * from './interfaces/index.js';

// Utility exports
export * from './utils/index.js';

// Constant exports
export * from './constants/index.js';

// Error exports
export * from './errors/index.js';

// Base class exports
export * from './base/index.js';
```

### **Organized Category Exports**

```typescript
// src/types/index.ts
export * from './component.js';
export * from './service.js';
export * from './configuration.js';
export * from './events.js';
export * from './lifecycle.js';

// src/interfaces/index.ts
export * from './IComponent.js';
export * from './IService.js';
export * from './IServiceContainer.js';
export * from './IEventBus.js';
export * from './IRenderer.js';

// src/utils/index.ts
export * from './validation.js';
export * from './object-utils.js';
export * from './type-guards.js';
export * from './async-utils.js';
export * from './dom-utils.js';

// src/constants/index.ts
export * from './events.js';
export * from './lifecycle.js';
export * from './performance.js';
export * from './accessibility.js';

// src/errors/index.ts
export * from './ComponentError.js';
export * from './ServiceError.js';
export * from './ValidationError.js';
export * from './ConfigurationError.js';

// src/base/index.ts
export * from './BaseComponent.js';
export * from './BaseService.js';
export * from './BaseEventTarget.js';
```

## 🧪 **TESTING REQUIREMENTS**

### **Unit Test Coverage**

- **Validation utilities**: Test all validation functions with valid/invalid inputs
- **Object utilities**: Test deep cloning, merging, picking, omitting
- **Type guards**: Test type checking functions with various inputs
- **Async utilities**: Test timeout, retry, debounce, throttle functions
- **Error classes**: Test error creation and property assignment
- **Base classes**: Test lifecycle methods and state management

### **Test Structure**

```typescript
// tests/utils/validation.test.ts
describe('Validation Utilities', () => {
  describe('validateRequired', () => {
    it('should return value when not null/undefined', () => {
      expect(validateRequired('test', 'field')).toBe('test');
    });

    it('should throw ValidationError when null', () => {
      expect(() => validateRequired(null, 'field')).toThrow(ValidationError);
    });
  });
});
```

## 📊 **PERFORMANCE CONSIDERATIONS**

### **Bundle Size Optimization**

- Use tree-shakeable exports
- Minimize external dependencies
- Keep utility functions small and focused
- Use lazy loading for optional features

### **Runtime Performance**

- Cache validation results where appropriate
- Use efficient object manipulation algorithms
- Minimize DOM queries in utilities
- Implement debouncing for expensive operations

### **Memory Management**

- Clean up event listeners in base classes
- Avoid memory leaks in utility functions
- Use weak references where appropriate
- Monitor object creation in utilities

## 🔒 **SECURITY PATTERNS**

### **Input Sanitization**

- Validate all configuration objects
- Sanitize HTML content in DOM utilities
- Validate URLs before usage
- Type check all function parameters

### **Safe Defaults**

- Default to secure configurations
- Fail safely when validation errors occur
- Use readonly properties where possible
- Implement proper error boundaries

## 📚 **USAGE EXAMPLES**

### **Creating a Component**

```typescript
import {
  BaseComponent,
  ComponentConfiguration,
  validateRequired,
} from '@voder/shared';

class MyComponent extends BaseComponent {
  constructor(private config: ComponentConfiguration) {
    super(validateRequired(config.id, 'config.id'), 'my-component');
  }

  async initialize(): Promise<void> {
    this.setState('initializing');
    // Initialization logic
    this.setState('initialized');
  }

  async mount(container: Element): Promise<void> {
    this.setState('mounting');
    // Mount logic
    this.setState('mounted');
  }

  async unmount(): Promise<void> {
    this.setState('unmounting');
    // Cleanup logic
    this.setState('unmounted');
  }
}
```

### **Using Validation Utilities**

```typescript
import { validateString, validateNumber, ValidationError } from '@voder/shared';

function processUserInput(input: unknown) {
  try {
    const name = validateString(input.name, 'name', {
      minLength: 1,
      maxLength: 50,
    });
    const age = validateNumber(input.age, 'age', {
      min: 0,
      max: 120,
      integer: true,
    });

    return { name, age };
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.message);
    }
    throw error;
  }
}
```

This implementation guide provides a comprehensive foundation for the `@voder/shared` package that serves as the cornerstone for all runtime packages in the Voder monorepo. The package includes both robust type definitions and practical runtime utilities that prevent code duplication while maintaining type safety and performance.
