# Core Package Requirements for voder-website

## 🎯 **Configuration Responsibility Scope**

The voder-website app requires @voder/core for **configuration and coordination setup only**. The app handles initial configuration, service registration, section registration, and app lifecycle, while PageRenderer handles execution.

## 📋 **Required Core Exports**

### **Primary Classes**
- `PageRenderer` - For coordinating navigation, content, and effects
- `ServiceContainer` - For service dependency injection and lifecycle management
- `ComponentRegistry` - For component registration and health tracking

### **Configuration Types**
- `PageConfiguration` - For configuring page rendering setup
- `ServiceRegistration` - For service registration configuration
- `ComponentConfiguration` - For individual component configuration

### **Utility Classes**
- `PageInitializer` - For initial DOM setup and environment detection
- `RenderContext` - For rendering environment management

## 🏗️ **App Configuration Responsibilities**

### **Service Registration**
```typescript
// App registers all services with their dependencies
serviceContainer.register('scroll', ScrollService, []);
serviceContainer.register('animation', AnimationService, ['scroll']);
serviceContainer.register('accessibility', AccessibilityService, []);
serviceContainer.register('asset', AssetService, []);
```

### **Component Configuration**
```typescript
// App configures PageRenderer with component instances
const pageConfig: PageConfiguration = {
  id: 'voder-website',
  navigation: { /* navigation config */ },
  content: { /* content sections config */ },
  effects: { /* effects config */ },
  metadata: {
    title: 'Voder.ai - AI-Powered Code Generation',
    description: 'Transform natural language into production-ready code',
    keywords: ['AI', 'code generation', 'development tools']
  }
};
```

### **Section Registration**
```typescript
// App registers all page sections
pageRenderer.registerSection('brand-entry', brandEntrySection);
pageRenderer.registerSection('the-why', theWhySection);
pageRenderer.registerSection('problem-space', problemSpaceSection);
// ... all other sections
```

## 🔧 **Required Core Capabilities**

### **PageRenderer Configuration Methods**
- `constructor()` - For setting up component dependencies
- `initialize()` - For component initialization
- `render(config: PageConfiguration)` - For coordinated page rendering
- `registerSection()` - For section registration (if available)
- `getCurrentConfig()` - For configuration access

### **ServiceContainer DI Methods**
- `register<T>(id, serviceClass, dependencies[], lifecycle)` - For service registration
- `get<T>(id)` - For service resolution
- `has(id)` - For checking service availability
- Dependency injection with proper order resolution

### **ComponentRegistry Tracking**
- `register(id, component)` - For component registration
- `areAllComponentsReady()` - For readiness checking
- `getHealthStatus()` - For health monitoring

## 🚫 **Excluded Responsibilities**

### **NOT Required by voder-website**
- Direct DOM manipulation (handled by PageRenderer)
- Component lifecycle management (handled by PageRenderer)
- Service implementation details (handled by services)
- Effect execution logic (handled by effects)
- Detailed render optimization (handled by PageRenderer)

## ⚡ **Integration Pattern**

### **Main App Structure**
```typescript
// voder-website main.ts pattern
const serviceContainer = new ServiceContainer();
const pageRenderer = new PageRenderer(/* configured components */);

// App responsibility: Register services
registerAllServices(serviceContainer);

// App responsibility: Configure page
const pageConfig = createPageConfiguration();

// App responsibility: Initialize and render
await pageRenderer.initialize();
const result = await pageRenderer.render(pageConfig);
```

### **Testing Requirements**
- Mock PageRenderer for configuration testing
- Mock ServiceContainer for service registration testing
- Test service registration order and dependencies
- Test page configuration structure
- Test app initialization sequence

## 🎯 **Success Criteria**

The voder-website app should be able to:
1. ✅ Register all services with correct dependencies
2. ✅ Configure PageRenderer with all required components
3. ✅ Initialize the application environment
4. ✅ Coordinate initial page render
5. ✅ Handle app-level errors gracefully
6. ✅ Test configuration logic in isolation
