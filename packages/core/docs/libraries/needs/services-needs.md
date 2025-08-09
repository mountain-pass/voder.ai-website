# @voder/core Dependencies on @voder/services

This document specifies what the `@voder/core` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **All Four Core Services**
**Required for**: ServiceContainer registration and dependency injection

**Package-Specific Requirements:**
- **Service class constructors**: All services must support constructor injection with ServiceConfiguration
- **BaseService compliance**: All services must extend BaseService from @voder/shared for lifecycle management
- **Singleton instantiation**: All services must be instantiable as singleton instances in ServiceContainer
- **Dependency injection compatibility**: Services must be registerable with ServiceContainer.register() method

## 🔧 **SPECIFIC SERVICE REGISTRATION NEEDS**

### **AnimationService Registration**
- **Configuration requirements**: Must accept enableScrollTrigger and enablePerformanceMonitoring config options
- **Singleton lifecycle**: Single instance shared across all components requiring animation services

### **ScrollService Registration**
- **Configuration requirements**: Must accept standard ServiceConfiguration (no specific config needs)
- **Singleton lifecycle**: Single scroll event manager shared across all scroll-dependent components

### **AccessibilityService Registration**
- **Configuration requirements**: Must accept standard ServiceConfiguration (no specific config needs)
- **Singleton lifecycle**: Single accessibility manager for consistent ARIA and keyboard handling

### **AssetService Registration**
- **Configuration requirements**: Must accept enableCaching and maxCacheSize config options
- **Singleton lifecycle**: Single asset cache shared across all components requiring asset loading

## 🔧 **INTEGRATION REQUIREMENTS**

### **Export Requirements**
All four service classes must be exported from @voder/services for core package import and registration.

### **Lifecycle Requirements**
- **Dynamic import support**: Services must be importable as ES modules for ServiceContainer
- **Constructor injection pattern**: Services must accept ServiceConfiguration first, then dependencies
- **Lifecycle method compliance**: All services must implement initialize(), shutdown(), getHealth() methods

### **ServiceContainer Context**
Core package serves as the dependency injection coordinator, registering all services for use by sections, effects, and navigation components throughout the application.
- Must implement `IService` interface
- Must support constructor injection with `ServiceConfiguration` parameter
- Must be instantiable as singleton service

### **AccessibilityService Implementation**
The core package needs AccessibilityService for ARIA management and keyboard navigation:

```typescript
// Used in ServiceContainer.registerCoreServices()
this.register(
  'AccessibilityService',
  AccessibilityService,
  [],
  'singleton',
  {}
);
```

**Required Interface Compliance:**
- Must extend `BaseService` from `@voder/shared`
- Must implement `IService` interface
- Must support constructor injection with `ServiceConfiguration` parameter
- Must be instantiable as singleton service

### **AssetService Implementation**
The core package needs AssetService for resource loading and caching:

```typescript
// Used in ServiceContainer.registerCoreServices()
this.register(
  'AssetService',
  AssetService,
  [],
  'singleton',
  { enableCaching: true, maxCacheSize: 50 * 1024 * 1024 } // 50MB cache
);
```

**Required Interface Compliance:**
- Must extend `BaseService` from `@voder/shared`
- Must implement `IService` interface
- Must support constructor injection with `ServiceConfiguration` parameter
- Must be instantiable as singleton service

## 📦 **REQUIRED EXPORTS**

The `@voder/services` package must export these service classes for import and registration:

```typescript
// Required exports from @voder/services
export { AnimationService } from './AnimationService/index.js';
export { ScrollService } from './ScrollService/index.js';
export { AccessibilityService } from './AccessibilityService/index.js';
export { AssetService } from './AssetService/index.js';
```

## 🔄 **SERVICE LIFECYCLE REQUIREMENTS**

### **Dynamic Import Support**
The ServiceContainer uses dynamic imports to avoid circular dependencies:

```typescript
// Services must be importable as ES modules
const { AnimationService } = await import('@voder/services');
```

### **Constructor Injection Pattern**
All services must support the standard dependency injection pattern:

```typescript
// Service constructors must accept config first, then dependencies
constructor(
  config: ServiceConfiguration,
  ...dependencies: IService[]
)
```

### **Lifecycle Method Implementation**
Services must implement proper lifecycle methods:

```typescript
// Required lifecycle methods
async initialize(): Promise<void>
async shutdown(): Promise<void>
getHealth(): 'healthy' | 'degraded' | 'unhealthy'
```

## 🎯 **USAGE CONTEXT**

The core package uses these services in two main contexts:

### **1. ServiceContainer Registration**
```typescript
// In ServiceContainer.registerCoreServices()
private registerCoreServices(): void {
  this.register('AnimationService', AnimationService, [], 'singleton', config);
  this.register('ScrollService', ScrollService, [], 'singleton', config);
  this.register('AccessibilityService', AccessibilityService, [], 'singleton', config);
  this.register('AssetService', AssetService, [], 'singleton', config);
}
```

### **2. Service Resolution and Injection**
```typescript
// In ServiceContainer.resolve()
const instance = new registration.serviceClass(
  registration.config,
  ...dependencies
) as T;
```

## 🚨 **CRITICAL REQUIREMENTS**

1. **No Circular Dependencies**: Services must not depend on `@voder/core`
2. **Base Class Compliance**: All services must extend `BaseService` from `@voder/shared`
3. **Interface Implementation**: All services must implement `IService` interface
4. **Constructor Pattern**: Must support dependency injection constructor pattern
5. **Lifecycle Support**: Must implement initialize/shutdown/health methods
6. **Singleton Compatibility**: Must work correctly as singleton instances

## 📝 **NOTES**

- Services are registered as singletons by default in the core ServiceContainer
- Each service gets its own configuration object during registration
- Services must be independently initializable (no required constructor dependencies)
- All services must support graceful degradation and error recovery
- Services should be stateless where possible to support singleton pattern
