# Build Configuration Package

## **🎯 Package Context**

This would be a separate `@voder/build-config` package providing optimized build configurations for different types of projects. This package would be independent from `@voder/dev-config` and focus solely on build tooling.

> **Status**: Documentation for potential future package - build configuration scope to be extracted from `@voder/dev-config`

## **Package Overview**

**Export Structure:**

```javascript
import { rollup, vite } from '@voder/build-config';
```

**Consolidated Responsibilities:**

- ✅ **Rollup configurations** - ES module library packages with optimization
- ✅ **Vite configurations** - Applications with performance optimization
- ✅ **Bundle splitting strategies** - Optimal loading performance
- ✅ **Asset optimization** - Build targets and output formats
- ✅ **TypeScript presets** - Build-specific compiler configurations (Vite)

### **Export Surface (Proposed)**

| Namespace    | Export(s)                                    | Kind      | Purpose                                   |
| ------------ | -------------------------------------------- | --------- | ----------------------------------------- |
| `rollup`     | `createLibraryConfig`, `createPackageConfig` | Functions | Library bundling with TypeScript        |
| `vite`       | `createAppConfig`, `createLibraryConfig`     | Functions | Application and library builds           |
| `typescript` | `vite`                                       | Preset    | Vite-specific TypeScript configuration   |

## **Rollup Configuration (`rollup`)**

### **Core Purpose**

Optimized Rollup configurations for:

- ES module library packages with TypeScript compilation
- Declaration file generation and source maps
- External dependency handling and tree shaking
- Multiple output formats (ESM, CJS if needed)

### **Library Configuration Factory**

```typescript
import { createLibraryConfig } from '@voder/build-config/rollup';

export default createLibraryConfig({
  input: 'src/index.ts',
  external: ['dependency-to-externalize'],
  typescript: {
    declaration: true,
    declarationMap: true,
  },
});
```

### **Package Configuration Factory**

```typescript
import { createPackageConfig } from '@voder/build-config/rollup';

export default createPackageConfig({
  entries: {
    '.': 'src/index.ts',
    './utils': 'src/utils/index.ts',
  },
});
```

## **Vite Configuration (`vite`)**

### **Core Purpose**

Optimized Vite configurations for:

- Application builds with performance optimization
- Library builds with proper externalization
- Development server configuration
- Asset optimization and code splitting

### **Application Configuration Factory**

```typescript
import { createAppConfig } from '@voder/build-config/vite';

export default createAppConfig({
  entry: 'src/main.ts',
  optimization: {
    splitChunks: true,
    treeshaking: true,
  },
});
```

### **Library Configuration Factory**

```typescript
import { createLibraryConfig } from '@voder/build-config/vite';

export default createLibraryConfig({
  entry: 'src/index.ts',
  name: 'MyLibrary',
  formats: ['es', 'umd'],
});
```

### **TypeScript Integration for Vite**

For Vite builds that need React JSX support and isolated modules:

```typescript
// tsconfig.json for Vite applications
{
  "extends": "@voder/build-config/typescript/vite.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

The Vite TypeScript preset includes:
- ES2022 library features
- React JSX support (`react-jsx`)
- Isolated modules for fast builds

## **Performance Optimizations**

### **Bundle Analysis**

- Automatic bundle size analysis and reporting
- Tree shaking optimization
- Dead code elimination
- Dependency size tracking

### **Code Splitting Strategies**

- Route-based splitting for applications
- Feature-based splitting for large libraries
- Vendor chunk optimization
- Dynamic import optimization

### **Asset Optimization**

- Image optimization and compression
- Font subset generation
- CSS optimization and purging
- SVG optimization

## **Configuration Patterns**

### **TypeScript Integration**

#### **Vite TypeScript Configuration**

For Vite-based builds that require React JSX and isolated modules:

```json
// typescript/vite.json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022"],
    "jsx": "react-jsx",
    "isolatedModules": true
  }
}
```

#### **Shared TypeScript Configuration**

```typescript
// Shared TypeScript configuration for builds
const typescriptConfig = {
  target: 'ES2022',
  module: 'ESNext',
  declaration: true,
  declarationMap: true,
  sourceMap: true,
};
```

### **External Dependencies**

```typescript
// Smart externalization for different build types
const libraryExternals = [
  // Peer dependencies should be external
  'react',
  'vue',
  'svelte',
  // Node.js built-ins
  'fs',
  'path',
  'url',
];
```

### **Output Formats**

```typescript
// Multiple output formats for library consumption
const outputs = [
  {
    format: 'es',
    dir: 'dist/esm',
    preserveModules: true,
  },
  {
    format: 'cjs',
    dir: 'dist/cjs',
    exports: 'named',
  },
];
```

## **Development vs Production**

### **Development Optimizations**

- Fast rebuild times with incremental compilation
- Source map generation for debugging
- Hot module replacement configuration
- Development server optimization

### **Production Optimizations**

- Minification and compression
- Bundle size optimization
- Cache optimization strategies
- Asset fingerprinting

## **Package Dependencies**

### **Core Build Tools**

```json
{
  "dependencies": {
    "rollup": "^4.0.0",
    "vite": "^5.0.0",
    "@rollup/plugin-typescript": "^11.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-commonjs": "^25.0.0"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### **Optimization Plugins**

```json
{
  "dependencies": {
    "@rollup/plugin-terser": "^0.4.0",
    "rollup-plugin-visualizer": "^5.0.0",
    "vite-plugin-checker": "^0.6.0",
    "vite-bundle-analyzer": "^0.7.0"
  }
}
```

## **Migration from @voder/dev-config**

### **What Changes**

- Remove `build` namespace from `@voder/dev-config`
- Extract Vite TypeScript preset to `@voder/build-config`
- Create new `@voder/build-config` package
- Update consumer packages to import from new package

### **Consumer Migration**

```typescript
// Before (from @voder/dev-config)
import { build } from '@voder/dev-config';
const config = build.createPackageConfig();

// After (from @voder/build-config)
import { rollup } from '@voder/build-config';
const config = rollup.createPackageConfig();
```

**TypeScript Configuration Migration:**

```json
// Before (from @voder/dev-config)
{
  "extends": "@voder/dev-config/typescript/vite.json"
}

// After (from @voder/build-config)
{
  "extends": "@voder/build-config/typescript/vite.json"
}
```

### **Package.json Updates**

```json
{
  "devDependencies": {
    "@voder/dev-config": "^1.0.0",
    "@voder/build-config": "^1.0.0"
  }
}
```

## **Benefits of Separation**

### **Focused Concerns**

- `@voder/dev-config`: Code quality, formatting, testing
- `@voder/build-config`: Build optimization, bundling, assets

### **Independent Evolution**

- Build tools can evolve separately from linting/formatting
- Different release cadences for different concerns
- Reduced bundle size for packages that don't need build configs

### **Clearer Dependencies**

- Build-specific dependencies isolated
- No cyclic dependency concerns
- Clear separation of runtime vs build-time tooling

## **Future Enhancements**

### **Advanced Optimizations**

- Module federation support
- Micro-frontend build strategies
- Progressive web app optimization
- Server-side rendering configuration

### **Framework Integration**

- React-specific optimizations
- Vue.js build patterns
- Svelte compilation strategies
- Framework-agnostic patterns

### **Deployment Integration**

- CDN optimization
- Edge deployment configuration
- Container build optimization
- Serverless bundling strategies
