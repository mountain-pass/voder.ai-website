# Core Package - Shared Package Dependencies

## Purpose

This file documents what the Core package needs from `@voder/shared`. The Core package provides PageRenderer and ServiceContainer for component coordination.

## Required Interfaces from @voder/shared

### Component Lifecycle
```typescript
interface Component {
  mount(container: HTMLElement): Promise<void>;
  unmount(): Promise<void>;
  update(props: any): Promise<void>;
  destroy(): void;
}

interface ComponentConfig {
  id: string;
  className?: string;
  attributes?: Record<string, string>;
}
```

### Service Container
```typescript
interface ServiceContainer {
  register<T>(name: string, service: T): void;
  get<T>(name: string): T;
  has(name: string): boolean;
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}
```

### Page Configuration
```typescript
interface PageConfig {
  sections: SectionConfig[];
  navigation: NavigationConfig;
  effects: EffectConfig[];
  layout: LayoutConfig;
}

interface SectionConfig {
  id: string;
  component: string;
  props: any;
  order: number;
}

interface LayoutConfig {
  container: string;
  responsive: boolean;
  maxWidth?: string;
}
```

## Required Utilities from @voder/shared

### Component Management
```typescript
function createComponent(tag: string, className?: string): HTMLElement;
function mountComponent(component: Component, container: HTMLElement): Promise<void>;
function unmountComponent(component: Component): Promise<void>;
```

### DOM Utilities
```typescript
function querySelector(selector: string): HTMLElement | null;
function querySelectorAll(selector: string): HTMLElement[];
function createElement(tag: string, attributes?: Record<string, string>): HTMLElement;
```

## Required Constants from @voder/shared

```typescript
const PAGE_LAYOUT = {
  CONTAINER_SELECTOR: '#app',
  MAX_WIDTH: '1200px',
  SECTION_SPACING: '4rem',
} as const;

const COMPONENT_PRIORITIES = {
  NAVIGATION: 1,
  SECTIONS: 2,
  EFFECTS: 3,
} as const;
```

## Required Error Types from @voder/shared

```typescript
class PageRenderError extends Error {
  constructor(component: string, message: string) {
    super(`Page render error in '${component}': ${message}`);
    this.name = 'PageRenderError';
  }
}
```
