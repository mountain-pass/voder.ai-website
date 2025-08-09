# Canvas 3D Effect - Shared Package Dependencies

## Purpose

This file documents what the Canvas 3D Effect package needs from `@voder/shared` and how it intends to use those shared utilities.

## Required Interfaces from @voder/shared

### Base Component Interface
- `IComponent` with id, getState() method
- `ComponentState` type for lifecycle management
- `IConfigurableComponent<T>` for configuration management

### Effect Component Interface
- `IEffectComponent` extending IComponent with initialize(), destroy(), resize() methods
- `EffectConfiguration` extending ComponentConfiguration with effect-specific settings
- Effect lifecycle state management

### Configuration Types
- `ComponentConfiguration` with id, debug, containerId, accessibility
- `AccessibilityConfiguration` for ARIA and motion preferences
- Configuration validation functions

### Brand Constants
- `BRAND_COLORS` for consistent 3D material colors (SOFT_TEAL_GLOW, ACCENT_GREEN, VODER_BLACK)
- `BRAND_TYPOGRAPHY` for UI elements (Inter font family)

### Error Handling
- `ComponentError` class for 3D effect-specific errors
- `ValidationError` class for configuration validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config validation

### DOM Utilities
- `createAriaLiveRegion()` for screen reader announcements
- `validateElement()` for container validation

### Constants
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for timing announcements
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps WebGL rendering
- `PERFORMANCE_THRESHOLDS.MAX_RENDER_DISTANCE` for 3D scene optimization

## Usage Patterns

### 3D Scene Configuration Management
The Canvas 3D Effect uses shared interfaces to manage WebGL scene configuration:

```typescript
interface Canvas3DEffectConfig extends ComponentConfiguration {
  scene: SceneConfig;
  camera: CameraConfig;
  lighting: LightingConfig;
  models: Model3DConfig[];
  animations: Animation3DConfig[];
  performance: PerformanceConfig;
}
```

### Effect Configuration Validation
Uses shared utilities for validating 3D scene configuration:

```typescript
// Configuration validation using shared utilities
validateComponentConfiguration(config);
validateAccessibilityConfiguration(config.accessibility);

// Error handling for 3D scene requirements
if (!config.models?.length) {
  throw new ValidationError('At least one 3D model required for Canvas 3D Effect');
}
```

### WebGL Container Setup
Leverages shared DOM utilities for proper canvas container initialization:

```typescript
// Validate container element using shared utilities
const container = validateElement(containerElement, 'Canvas 3D container');

// Create accessibility announcements for 3D scene state
const announcements = createAriaLiveRegion();
announcements.textContent = `3D scene containing ${visibleObjects.length} objects`;
```

### Brand Integration for 3D Materials
Uses shared brand constants for consistent 3D material styling:

```typescript
// Apply brand colors to 3D materials
const brandMaterial = new THREE.MeshStandardMaterial({
  color: BRAND_COLORS.SOFT_TEAL_GLOW,
  emissive: BRAND_COLORS.SOFT_TEAL_GLOW,
  emissiveIntensity: 0.3,
  metalness: 0.8,
  roughness: 0.2
});

// Secondary accent materials
const accentMaterial = new THREE.MeshStandardMaterial({
  color: BRAND_COLORS.ACCENT_GREEN,
  emissive: BRAND_COLORS.ACCENT_GREEN,
  emissiveIntensity: 0.2
});
```

### Performance Optimization Management
Uses shared performance constants for WebGL optimization:

```typescript
// Apply performance thresholds for 3D rendering
const targetFPS = PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET;
const maxRenderDistance = PERFORMANCE_THRESHOLDS.MAX_RENDER_DISTANCE || 100;

// Adaptive quality based on performance
if (currentFPS < targetFPS) {
  this.adaptQuality('low');
  this.setRenderDistance(maxRenderDistance * 0.5);
}
```

### Accessibility Integration for 3D Content
Uses shared accessibility utilities for WebGL accessibility:

```typescript
// Screen reader support for 3D scenes
if (config.accessibility?.announceChanges) {
  const sceneDescription = this.generateSceneDescription();
  announcements.textContent = sceneDescription;
  
  // Delay announcement using shared constants
  setTimeout(() => {
    this.accessibilityService.announce(sceneDescription, 'polite');
  }, ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY);
}

// Reduced motion support
if (this.accessibilityService.prefersReducedMotion()) {
  this.disableAnimations();
  this.setStaticScene();
}
```
