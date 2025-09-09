# Application Layer Guidelines

## 📋 **APPLICATION LAYER OVERVIEW**

**Layer Type:** Application layer (top-level consumers)  
**Purpose:** Coordinate all runtime packages into complete, deployable applications  
**Inheritance:** Inherits from universal documentation + runtime layer documentation

**Key Responsibilities:**

- ✅ **Application coordination** - Orchestrate core systems, components, and services
- ✅ **Configuration management** - Provide application-specific configurations
- ✅ **Deployment integration** - Handle build, deployment, and runtime concerns
- ✅ **User experience orchestration** - Coordinate complete user experience flows
- ✅ **Performance optimization** - Ensure optimal application-level performance

## 🎯 **CORE ARCHITECTURE PRINCIPLES**

### **1. Application as Orchestrator Pattern**

Applications should coordinate runtime packages rather than implement functionality:

```typescript
// ✅ CORRECT: Application orchestrates packages
class VoderWebsiteApp {
  constructor(
    private pageRenderer: PageRenderer,
    private serviceContainer: ServiceContainer,
  ) {}

  async initialize(): Promise<void> {
    // Coordinate package initialization
    await this.serviceContainer.initialize();
    await this.pageRenderer.render();
  }
}

// ❌ INCORRECT: Application implements functionality
class VoderWebsiteApp {
  render3DScene() {
    /* implementation details */
  }
  handleScrollAnimation() {
    /* implementation details */
  }
}
```

### **2. Configuration-Driven Architecture**

Applications provide configurations that packages use to customize behavior:

```typescript
interface ApplicationConfiguration {
  // Application-level settings
  environment: 'development' | 'production';
  features: ApplicationFeatures;

  // Package configurations
  pageConfig: PageConfiguration;
  serviceConfig: ServiceConfiguration;
  sectionConfigs: SectionConfiguration[];
  effectConfigs: EffectConfiguration[];
}
```

### **3. Dependency Injection at Application Level**

Applications are responsible for wiring dependencies between packages:

```typescript
class ApplicationContainer {
  // Wire up the complete dependency graph
  configureServices(): ServiceContainer {
    return new ServiceContainer({
      animationService: new GSAPAnimationService(),
      accessibilityService: new AccessibilityService(),
      scrollService: new ScrollService(),
      assetService: new AssetService(),
    });
  }

  configureComponents(services: ServiceContainer): ComponentRegistry {
    // Wire components with their dependencies
  }
}
```

## 📁 **REQUIRED APPLICATION STRUCTURE**

### **1. Application Entry Point**

**File:** `src/main.ts` or `src/app.ts`  
**Purpose:** Initialize and start the application

```typescript
import { VoderWebsiteApp } from './VoderWebsiteApp.js';
import { createApplicationConfiguration } from './config/configuration.js';

async function main(): Promise<void> {
  const config = createApplicationConfiguration();
  const app = new VoderWebsiteApp(config);

  await app.initialize();
  await app.start();
}

main().catch(console.error);
```

### **2. Application Configuration**

**Directory:** `src/config/`  
**Purpose:** Centralized configuration management

```typescript
// src/config/configuration.ts
export function createApplicationConfiguration(): ApplicationConfiguration {
  return {
    environment: getEnvironment(),
    features: getFeatureFlags(),

    pageConfig: createPageConfiguration(),
    serviceConfig: createServiceConfiguration(),
    sectionConfigs: createSectionConfigurations(),
    effectConfigs: createEffectConfigurations(),
  };
}
```

### **3. Application Class**

**File:** `src/VoderWebsiteApp.ts`  
**Purpose:** Main application orchestrator

```typescript
export class VoderWebsiteApp {
  private serviceContainer: ServiceContainer;
  private pageRenderer: PageRenderer;

  constructor(private config: ApplicationConfiguration) {}

  async initialize(): Promise<void> {
    // Initialize services first
    this.serviceContainer = this.createServiceContainer();
    await this.serviceContainer.initialize();

    // Initialize page renderer with services
    this.pageRenderer = this.createPageRenderer();
    await this.pageRenderer.initialize();
  }

  async start(): Promise<void> {
    // Start the application
    await this.pageRenderer.render();
  }

  async destroy(): Promise<void> {
    // Cleanup in reverse order
    await this.pageRenderer?.destroy();
    await this.serviceContainer?.destroy();
  }
}
```

## 🔧 **PACKAGE INTEGRATION PATTERNS**

### **1. Service Integration**

Applications coordinate service lifecycle and configuration:

```typescript
private createServiceContainer(): ServiceContainer {
  const container = new ServiceContainer();

  // Register services with application-specific configurations
  container.register(IAnimationService, () =>
    new GSAPAnimationService(this.config.animationConfig)
  );

  container.register(IAccessibilityService, () =>
    new AccessibilityService(this.config.accessibilityConfig)
  );

  return container;
}
```

### **2. Component Integration**

Applications wire components with their dependencies:

```typescript
private createPageRenderer(): PageRenderer {
  const navigation = new NavigationComponent(
    this.config.navigationConfig,
    this.serviceContainer
  );

  const sections = this.createSectionComponents();
  const effects = this.createEffectComponents();

  const contentComponent = new ContentComponent(
    this.config.contentConfig,
    sections
  );

  const effectManager = new EffectManager(
    this.config.effectConfig,
    effects
  );

  return new PageRenderer(
    this.config.pageConfig,
    navigation,
    contentComponent,
    effectManager
  );
}
```

### **3. Configuration Cascading**

Applications provide hierarchical configuration:

```typescript
private createSectionConfigurations(): SectionConfiguration[] {
  return [
    {
      type: 'brand-entry',
      config: {
        ...this.config.globalSectionConfig, // Shared settings
        brandData: this.config.brandData,   // Section-specific
        animations: this.config.brandEntryAnimations
      }
    },
    {
      type: 'the-why',
      config: {
        ...this.config.globalSectionConfig,
        whyData: this.config.whyData,
        animations: this.config.whyAnimations
      }
    }
    // ... other sections
  ];
}
```

## 🧪 **APPLICATION TESTING STRATEGY**

### **1. Integration Testing Focus**

Applications should focus on integration testing rather than unit testing:

```typescript
// test/integration/application.test.ts
describe('VoderWebsiteApp Integration', () => {
  test('should initialize and render complete application', async () => {
    const config = createTestConfiguration();
    const app = new VoderWebsiteApp(config);

    await app.initialize();
    await app.start();

    // Verify application is fully functional
    expect(
      document.querySelector('[data-testid="brand-entry-section"]'),
    ).toBeVisible();
    expect(
      document.querySelector('[data-testid="navigation"]'),
    ).toBeInTheDocument();
  });

  test('should handle application lifecycle correctly', async () => {
    const app = new VoderWebsiteApp(createTestConfiguration());

    await app.initialize();
    await app.start();
    await app.destroy();

    // Verify cleanup
    expect(document.body.innerHTML).toBe('');
  });
});
```

### **2. End-to-End Testing**

Applications coordinate E2E testing using Playwright:

```typescript
// tests/e2e/full-experience.spec.ts
import { test, expect } from '@playwright/test';

test('complete user experience flow', async ({ page }) => {
  await page.goto('/');

  // Test complete narrative flow
  await expect(
    page.locator('[data-testid="brand-entry-section"]'),
  ).toBeVisible();

  // Test scroll-tied animations
  await page.mouse.wheel(0, 1000);
  await expect(page.locator('[data-testid="the-why-section"]')).toBeVisible();

  // Continue through all sections...
});
```

## 🚀 **DEPLOYMENT CONSIDERATIONS**

### **1. Build Integration**

Applications coordinate build processes across packages:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { createBuildConfiguration } from '@voder/build-tools';

export default defineConfig({
  ...createBuildConfiguration({
    entry: './src/main.ts',
    outDir: './dist',

    // Package-specific build settings
    packageConfigs: {
      effects: { treeshake: true },
      sections: { codeSplit: true },
    },
  }),
});
```

### **2. Performance Monitoring**

Applications implement performance monitoring:

```typescript
class PerformanceMonitor {
  trackApplicationStartup(app: VoderWebsiteApp): void {
    performance.mark('app-start');

    app.onInitialized(() => {
      performance.mark('app-initialized');
      performance.measure('startup-time', 'app-start', 'app-initialized');
    });
  }

  trackSectionPerformance(): void {
    // Monitor section load times, animation performance, etc.
  }
}
```

### **3. Error Handling**

Applications provide global error handling:

```typescript
class ApplicationErrorHandler {
  setupGlobalErrorHandling(): void {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener(
      'unhandledrejection',
      this.handlePromiseRejection.bind(this),
    );
  }

  private handleError(event: ErrorEvent): void {
    // Log error, show user-friendly message, attempt recovery
    console.error('Application error:', event.error);
    this.attemptGracefulRecovery(event.error);
  }
}
```

## 📊 **MONITORING AND ANALYTICS**

### **1. User Experience Tracking**

Applications coordinate user experience monitoring:

```typescript
class UserExperienceTracker {
  trackNarrativeFlow(): void {
    // Track user progression through sections
    this.trackSectionViews();
    this.trackScrollBehavior();
    this.trackEngagementMetrics();
  }

  trackPerformanceMetrics(): void {
    // Monitor Core Web Vitals
    this.trackLCP(); // Largest Contentful Paint
    this.trackFID(); // First Input Delay
    this.trackCLS(); // Cumulative Layout Shift
  }
}
```

### **2. Feature Flag Integration**

Applications handle feature toggles:

```typescript
interface FeatureFlags {
  enableAdvancedAnimations: boolean;
  enableAnalytics: boolean;
  enable3DEffects: boolean;
  enableAccessibilityEnhancements: boolean;
}

class FeatureManager {
  configureFeatures(flags: FeatureFlags): ApplicationConfiguration {
    return {
      // Conditionally enable features based on flags
      effectConfigs: flags.enable3DEffects
        ? this.get3DEffects()
        : this.get2DEffects(),
      animationConfigs: flags.enableAdvancedAnimations
        ? this.getAdvancedAnimations()
        : this.getBasicAnimations(),
    };
  }
}
```

## 🎯 **APPLICATION IMPLEMENTATION CHECKLIST**

### **Core Implementation**

- [ ] Application entry point (main.ts)
- [ ] Main application class with lifecycle methods
- [ ] Configuration management system
- [ ] Service container integration
- [ ] Component coordination
- [ ] Error handling and recovery

### **Integration Testing**

- [ ] Package integration tests
- [ ] Application lifecycle tests
- [ ] Configuration validation tests
- [ ] Performance benchmarks
- [ ] Accessibility compliance tests

### **Build and Deployment**

- [ ] Vite configuration
- [ ] Build optimization
- [ ] Asset management
- [ ] Environment configuration
- [ ] Deployment scripts

> **Note**: For comprehensive CI/CD pipeline requirements, git workflow standards, and visual validation processes, see `prompts/root/deployment.md`. Those guidelines apply at the root level and are not inherited by any packages or applications.

### **Monitoring and Analytics**

- [ ] Performance monitoring
- [ ] User experience tracking
- [ ] Error reporting
- [ ] Feature flag integration
- [ ] Analytics integration

This guide provides the foundation for implementing applications that effectively coordinate all runtime packages into cohesive, high-performance user experiences.
