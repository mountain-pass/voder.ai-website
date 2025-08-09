# Navigation Package - Shared Package Dependencies

## Purpose

This file documents what the Navigation package needs from `@voder/shared`. The Navigation package provides minimal, accessible navigation for the website.

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
}
```

### Navigation Configuration
```typescript
interface NavigationConfig {
  sections: NavigationSection[];
  mode: 'visible' | 'hidden' | 'minimal';
  position: 'top' | 'bottom' | 'side';
}

interface NavigationSection {
  id: string;
  title: string;
  href: string;
  order: number;
}
```

### Accessibility Configuration
```typescript
interface AccessibilityConfig {
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  skipLinks: boolean;
}
```

## Required Utilities from @voder/shared

### DOM Utilities
```typescript
function createNavElement(tag: string, className?: string): HTMLElement;
function addEventListeners(element: HTMLElement, events: Record<string, Function>): void;
function removeEventListeners(element: HTMLElement, events: Record<string, Function>): void;
```

### Accessibility Utilities
```typescript
function announceNavigation(section: string): void;
function manageNavFocus(elements: HTMLElement[]): void;
function createSkipLink(target: string, text: string): HTMLElement;
```

### Animation Utilities
```typescript
function fadeIn(element: HTMLElement, duration?: number): Promise<void>;
function fadeOut(element: HTMLElement, duration?: number): Promise<void>;
function slideToggle(element: HTMLElement, duration?: number): Promise<void>;
```

## Required Constants from @voder/shared

```typescript
const NAVIGATION_STYLES = {
  BACKGROUND_COLOR: '#0F1A2E',
  TEXT_COLOR: '#FFFFFF',
  ACCENT_COLOR: '#24D1D5',
  TRANSITION_DURATION: '0.3s',
} as const;

const NAVIGATION_ACCESSIBILITY = {
  ARIA_LABEL: 'Main navigation',
  SKIP_LINK_TEXT: 'Skip to main content',
  KEYBOARD_SHORTCUTS: {
    TOGGLE: 'n',
    CLOSE: 'Escape',
  },
} as const;
```

## Required Error Types from @voder/shared

```typescript
class NavigationError extends Error {
  constructor(operation: string, message: string) {
    super(`Navigation error during '${operation}': ${message}`);
    this.name = 'NavigationError';
  }
}
```
