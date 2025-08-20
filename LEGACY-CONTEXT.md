# 📋 Legacy Codebase Context - To Be Discarded

## 🚨 **CRITICAL REFERENCE: CURRENT ARCHITECTURAL DECISIONS**

## **Phase 9 Pre-Consolidation Content Audit Results (CURRENT SESSION)**
**Date**: Current session  
**Decision**: Root-level content audit complete  
**Reasoning**: Identified CI/CD content references that need classification

**Audit Findings:**
- **architecture.md**: Contains references to CI/CD/deployment as things packages MUST NOT do - this is universal constraint knowledge that should stay universal
- **testing.md**: Contains list of what packages should NOT test (deployment, CI/CD, infrastructure) - this is universal constraint knowledge that should stay universal  
- **glossary.md**: Contains "DEPLOYMENT TERMS" section with static site generation, progressive enhancement, browser support concepts - this appears to be web development concepts, not CI/CD infrastructure
- **accessibility-requirements.md**: Contains single reference to "CI pipeline" for color contrast validation - this is about testing integration, not infrastructure
- **security-and-privacy.md**: No deployment/infrastructure content found
- **brand-guide.md**: No deployment/infrastructure content found
- **implementation-hints.md**: No deployment/infrastructure content found

**Classification Decision:**
- **All current universal files are properly classified** - they contain constraints about what packages should NOT do regarding CI/CD, not actual CI/CD implementation guidance
- **No content needs to move to root level** - references to deployment/CI/CD are properly scoped as universal constraints for LLM agents
- **Glossary deployment terms are web development concepts** - static site generation, progressive enhancement, browser support are runtime web technology concepts, not infrastructure concerns
- **CI pipeline reference in accessibility** - refers to testing integration patterns, not infrastructure setup

**Next Action**: Proceed with Phase 9 content consolidation without creating root/ directory since no actual CI/CD implementation guidance exists in universal files

## **Package Merge Analysis - @voder/tsconfig + @voder/eslint-config → @voder/shared (CURRENT SESSION)**
**Date**: Current session  
**Context**: User asking whether to merge @voder/tsconfig and @voder/eslint-config into @voder/shared package  
**Decision Process**: Systematic Q&A to understand architectural implications

**Question 1**: Are `@voder/tsconfig` and `@voder/eslint-config` currently meant to be used together as a pair (every package that uses one also uses the other), or do some packages only need TypeScript configuration without ESLint rules?  
**User Answer**: Every package that uses one also uses the other  
**Classification**: These packages are always used together as a pair

**Question 2**: Would merging these into `@voder/shared` create any dependency management issues? For example, would `@voder/shared` then need to depend on both TypeScript AND ESLint plugins (making it heavier), or would some packages prefer to have lighter dependencies by only including what they need?  
**User Answer**: Everything else depends on tsconfig, eslint-config & shared. That's why I'm thinking it makes sense to merge them  
**Classification**: All other packages already depend on all three, so merging would simplify dependency management rather than create issues

**Question 3**: If we merge them into `@voder/shared`, what would be the ideal structure? Should `@voder/shared` export both TypeScript configs AND ESLint configs from the same package, or would you prefer to keep the current `@voder/shared` focused on runtime utilities and create a new consolidated package like `@voder/dev-config` that combines tsconfig + eslint-config?  
**User Answer**: Export both TypeScript configs AND ESLint configs from the same package  
**Classification**: Merge tsconfig and eslint-config into @voder/shared, making it a unified development configuration package

**MERGE DECISION ANALYSIS:**
Based on the Q&A session:
- ✅ **Always used together**: Every package that uses one also uses the other
- ✅ **Dependency simplification**: All other packages already depend on tsconfig, eslint-config & shared  
- ✅ **Unified export structure**: User wants both TypeScript and ESLint configs exported from same package
- ✅ **Architectural benefit**: Reduces from 3 universal dependencies to 1 universal dependency

**RECOMMENDATION**: ✅ **PROCEED WITH MERGE**
- Merge `@voder/tsconfig` and `@voder/eslint-config` into `@voder/shared`
- Update all package.json files to remove separate tsconfig/eslint-config dependencies
- Create unified import structure: `import { tsconfig, eslintConfig } from '@voder/shared/config'`
- Maintain separate files within package but export through unified interface

## **Development Package Analysis - @voder/build-tools + @voder/dev-tools Evaluation (CURRENT SESSION)**
**Date**: Current session  
**Context**: User forgot about these packages and wants to know what they're for and if they're needed as separate packages  
**Analysis**: Reviewing documentation and component hierarchy to understand purpose

**@voder/build-tools Analysis:**
- **Purpose**: Rollup configurations for ES module library packages + Vite configurations for applications
- **Documented Responsibilities**: 
  - Rollup configs with TypeScript compilation, tree shaking, CSS inlining (ADR-0007)
  - Bundle splitting strategies (GSAP, Three.js, vendor chunks)
  - Asset optimization for 3D models and performance libraries
- **Current State**: Has comprehensive specification in `prompts/development/build-tools/build-tools.md`
- **Dependencies**: Used by ALL packages for building (according to LLM-IMPLEMENTATION-PLAN.md)

**@voder/dev-tools Analysis:**
- **Purpose**: Vitest testing utilities and development helpers
- **Documented Responsibilities**:
  - Vitest configuration with jsdom environment
  - Test utilities, mock factories, assertions
  - Coverage requirements (90% function, 80% branch)
  - Accessibility testing integration (@testing-library, axe-core)
- **Current State**: Empty file `prompts/development/dev-tools/dev-tools.md` (needs content)
- **Dependencies**: Used by ALL packages for testing (according to LLM-IMPLEMENTATION-PLAN.md)

**Component Hierarchy Analysis:**
Looking at the component hierarchy, there are no direct references to build or dev tools since they are:
- Infrastructure/tooling concerns (not runtime components)
- Development-time dependencies (not runtime dependencies)
- Configuration providers (not functional components)

**Question 1**: Looking at your current development package setup, you have 4 development packages that are all used by every other package:
- `@voder/tsconfig` (TypeScript configuration) 
- `@voder/eslint-config` (ESLint rules)
- `@voder/build-tools` (Rollup/Vite build configs)
- `@voder/dev-tools` (Vitest testing utilities)

Since you already decided to merge tsconfig + eslint-config into `@voder/shared`, would it make sense to merge ALL 4 development packages into `@voder/shared` to create one unified development configuration package? Or do you see build tools and testing utilities as different enough that they should remain separate?  
**User Answer**: I'm wondering if I should merge these 4 and keep @voder/shared separate  
**Classification**: User is considering merging all 4 development packages (tsconfig + eslint-config + build-tools + dev-tools) into a new unified package, while keeping @voder/shared as a separate runtime package

**Question 2**: That's an interesting architectural distinction! So you're thinking:
- **Development Package**: Merge all 4 development configs (tsconfig + eslint + build-tools + dev-tools) into one package 
- **@voder/shared**: Keep as a separate runtime package for interfaces, types, and utilities

What would you want to call this unified development package? Something like `@voder/dev-config`, `@voder/toolchain`, or `@voder/development`? And would this development package export organized sections like `{ typescript, eslint, build, testing }` or a different structure?  
**User Answer**: I'd call it @voder/dev-config  
**Classification**: New package name will be @voder/dev-config for unified development tooling

**Question 3**: For the `@voder/dev-config` package structure, how would you prefer to organize the exports? Would you want:

**Option A - Organized by tool type:**
```javascript
import { typescript, eslint, build, testing } from '@voder/dev-config';
```

**Option B - Organized by function:**
```javascript
import { configs } from '@voder/dev-config';
// configs.typescript, configs.eslint, configs.build, configs.testing
```

**Option C - Direct tool imports:**
```javascript
import { tsconfig } from '@voder/dev-config/typescript';
import { eslintConfig } from '@voder/dev-config/eslint';
import { buildConfig } from '@voder/dev-config/build';
import { testConfig } from '@voder/dev-config/testing';
```

Which structure feels most natural for your development workflow?  
**User Answer**: Which has the better DX?  
**Classification**: User wants DX analysis to make the decision

**DX ANALYSIS FOR @voder/dev-config STRUCTURE:**

**Option A (Named destructuring) - BEST DX:**
✅ **Pros:**
- Single import line - minimal ceremony
- Clear, descriptive names at import site
- Great IntelliSense/autocomplete (shows all available configs)
- Standard ES6 pattern developers expect
- Easy to see all tools being used in one glance

**Option B (Namespace object) - MODERATE DX:**
⚠️ **Pros/Cons:**
- Single import, but requires dot notation access
- Less clear what's available without checking docs
- More verbose usage: `configs.typescript` vs `typescript`

**Option C (Subpath imports) - POOR DX:**
❌ **Cons:**
- Multiple import lines create noise
- More complex package.json exports configuration needed
- Harder to discover available tools
- More typing required

**RECOMMENDATION**: **Option A** has the best DX - clean, discoverable, standard pattern that developers expect

**Question 4**: [User confirmed Option A for @voder/dev-config structure]  
**User Answer**: Yes, let's go with Option A  
**Classification**: Final decision confirmed - Option A (named destructuring) for @voder/dev-config exports

**FINAL ARCHITECTURAL RESTRUCTURING DECISION:**

**✅ APPROVED PACKAGE CONSOLIDATION:**
- **Before**: 5 packages (@voder/shared + @voder/tsconfig + @voder/eslint-config + @voder/build-tools + @voder/dev-tools)
- **After**: 2 packages (@voder/shared + @voder/dev-config)

**Package Structure:**
1. **@voder/shared** - Runtime utilities, interfaces, types (unchanged scope)
2. **@voder/dev-config** - Unified development tooling configuration
   - Consolidates: tsconfig + eslint-config + build-tools + dev-tools
   - Export structure: `import { typescript, eslint, build, testing } from '@voder/dev-config';`
   - Benefits: Single development dependency, better DX, simplified maintenance

**Architectural Benefits:**
- ✅ **Dependency simplification**: 4 development packages → 1 package
- ✅ **Clear separation**: Development configs vs runtime utilities  
- ✅ **Better DX**: Single import with descriptive named exports
- ✅ **Maintenance efficiency**: One package to update instead of coordinating 4
- ✅ **Logical grouping**: All development tooling in one place

**Implementation Impact:**
- All packages currently depending on 4 development packages will depend on just @voder/dev-config
- @voder/shared remains focused on runtime concerns
- Phase A validation shifts from 4 development packages to 1 unified package

## **@voder/dev-config Unified Specification Creation (CURRENT SESSION)**
**Date**: Current session  
**Context**: User requested creation of unified @voder/dev-config specification

## **Legacy Guidelines.md Content Analysis (CURRENT SESSION)**
**Date**: Current session  
**Context**: User requesting migration of relevant content from legacy guidelines.md to non-legacy files  
**File Size**: 227 lines of comprehensive development guidelines  

**Existing Coverage Analysis:**
Looking at the semantic search results, I found extensive existing coverage of many guidelines.md topics:

**✅ ALREADY WELL COVERED:**
- **ADR compliance**: Extensively covered in development layer files
- **Build requirements**: `npm run build` extensively documented in dev-config
- **WCAG/Accessibility**: Comprehensive coverage in runtime layer with contrast ratios, ARIA requirements
- **Technology choices**: ADR references throughout development files
- **CSS inlining**: ADR-0007 implementation well documented

**🔍 NEEDS DETAILED ANALYSIS:**
Several sections require deeper examination to identify unique content:

1. **Git Workflow & Commit Guidelines** (lines 22-40):
   - Specific commit frequency rules ("MUST commit when tests pass")
   - File count triggers ("more than 5 modified files")
   - Process management rules
   - Output file management patterns

2. **Debugging & Troubleshooting** (lines 35-40):
   - Build-first debugging methodology
   - Error message analysis approach

3. **Project Requirements & Design** (lines 7-21):
   - Asset management rules (logo/cube file protection)
   - Mockup usage guidelines
   - Placeholder tracking requirements

4. **Transition Implementation** (lines 78-106):
   - TransitionController pattern specifics
   - 6-question verification process
   - Test selector requirements

5. **Visual Assessment Process** (lines 107-150):
   - Screenshot capture requirements
   - Progress documentation standards
   - Evidence-based evaluation methodology

6. **Definition of Done** (lines 214-227):
   - Completion criteria checklist
   - Visual validation requirements

**USER DECISION 1**: Git workflow enforcement rules should be migrated
- User confirmed that specific commit frequency and file count trigger rules should be preserved
- ✅ COMPLETED: Migrated git workflow enforcement patterns to root/deployment.md

**USER DECISION 2**: Process management rules should be migrated
- User confirmed process management rules should be migrated ("just the processes thing")
- ✅ COMPLETED: Migrated process management rules to root/deployment.md

**USER DECISION 3**: Project-specific asset protection rules should NOT be migrated
- User decided against migrating asset protection, mockup handling, and design workflow rules
- These will remain legacy-specific and be discarded with the file

**USER DECISION 4**: Visual assessment procedures should NOT be migrated
- User decided against migrating detailed visual assessment and quality gate procedures
- Existing deployment validation procedures are sufficient

**USER DECISION 5**: Partial Definition of Done migration
- User requested migration of ONLY "YOU ARE NOT DONE UNTIL ALL THE CHANGES ARE COMMITTED AND PUSHED"
- Other completion criteria (screenshots, progress documentation, CI pipeline) were not migrated
- ✅ COMPLETED: Added completion requirement to root/deployment.md

**MIGRATION SUMMARY - GUIDELINES.MD COMPLETED**:
✅ **Migrated Content**:
1. Git workflow enforcement rules → root/deployment.md (Development Workflow section)
2. Process management rules → root/deployment.md (Process Management section)  
3. Git commit completion requirement → root/deployment.md (Completion Requirements section)

❌ **Content Not Migrated** (user decisions):
- Project-specific asset protection and mockup handling rules
- Detailed visual assessment and quality gate procedures
- Screenshot and documentation completion criteria
- Most other project-specific guidelines

**READY FOR FILE DELETION**: All requested content successfully migrated from guidelines.md

## **Development.md to Dev-Config.md Merge Decision (CURRENT SESSION)**
**Date**: Current session  
**Context**: User requested merging development.md into dev-config.md to consolidate documentation  
**Decision Process**: Analyzed content and architectural value

**Content Analysis:**
- **Outdated content**: References to old 4-package structure (tsconfig, eslint-config, build-tools, dev-tools) should be ignored
- **Valuable content**: Development workflow hints, quality standards, critical requirements, maintenance guidelines, architectural patterns
- **Architectural patterns**: Configuration-First Design, Modular Configuration Exports, validation patterns are essential

**Merge Strategy Decision:**
**Option B - Add new sections for architecture** selected based on:
- Keep dev-config.md focused on unified package while preserving architectural guidance
- Maintain practical operational knowledge from development.md
- Create structured sections for different types of guidance

**Approved Section Structure:**
1. **"Package Architecture" section** - Configuration-first design patterns
2. **"Implementation Standards" section** - Validation, testing, documentation requirements  
3. **"Development Workflow" section** - Practical Vite/CLI guidance
4. **"Maintenance & Operations" section** - Version management, dependency guidelines

**User Confirmation**: "yes, proceed with this structure and start the merge"  
**Next Action**: Execute merge with new section structure  
**Action**: Successfully created comprehensive specification consolidating all 4 development packages

**Specification Created**: `/prompts/development/dev-config/dev-config.md`

**Content Consolidated:**
- **TypeScript configurations** - From @voder/tsconfig (base, vite, node, library, test presets)
- **ESLint configurations** - From @voder/eslint-config (base, accessibility, performance rules)
- **Build configurations** - From @voder/build-tools (Rollup package + Vite app configs)
- **Testing configurations** - From @voder/dev-tools (Vitest setup + test utilities)

**Export Structure Implemented:**
```javascript
import { typescript, eslint, build, testing } from '@voder/dev-config';
```

**Key Features:**
- ✅ **Complete consolidation** of all 4 development package specifications
- ✅ **Unified documentation** with clear section organization  
- ✅ **Integration patterns** showing how configurations work together
- ✅ **Usage examples** for both packages and applications
- ✅ **ESM-first approach** with explicit .js extension enforcement
- ✅ **Performance optimization** with bundle splitting and CSS inlining (ADR-0007)
- ✅ **Accessibility integration** with testing-library and axe-core
- ✅ **Coverage requirements** (90% function, 80% branch)

**Architectural Achievement:**
- Reduced 4 separate development packages to 1 unified package
- Maintained all functionality while improving DX with single import
- Clear separation between development tooling (@voder/dev-config) and runtime utilities (@voder/shared)
- Ready for Phase A validation as unified package

## **Universal File Scope Analysis - Q&A Session (CURRENT SESSION)**
**Date**: Current session  
**Context**: Analyzing which current universal files truly apply to ALL 22 packages to determine proper content distribution

**Question 1**: Does `@voder/tsconfig` (TypeScript configuration package) need `accessibility-requirements.md` with WCAG compliance, screen reader support, and UI accessibility patterns?  
**User Answer**: NO - @voder/tsconfig does not need accessibility-requirements.md  
**Classification**: accessibility-requirements.md should move to runtime layer (only UI packages need accessibility guidelines)

**Question 2**: Does `@voder/tsconfig` need `security-and-privacy.md` with web security principles like Content Security Policy (CSP), DOM manipulation security, input sanitization, and XSS prevention?  
**User Answer**: NO - web security guidelines should only go to UI packages in the runtime layer, not configuration packages  
**Classification**: security-and-privacy.md should move to runtime layer (only UI packages need web security guidelines)

**Question 3**: Does `@voder/tsconfig` need component architecture patterns from `architecture.md` like the `IComponent` interface, DOM manipulation patterns, and UI component lifecycle management?  
**User Answer**: NO - component architecture should only go to UI packages in the runtime layer  
**Classification**: Component architecture content from architecture.md should move to runtime layer (only UI packages need component patterns)

**Question 4**: What should remain truly universal (needed by ALL 22 packages including `@voder/tsconfig`)?  
**User Answer**: YES to LLM-optimized patterns, package scope boundaries, error handling patterns, documentation standards, code quality standards  
**User Question**: "What do you mean by Interface-only dependency patterns?"  

**Clarification of "Interface-only dependency patterns":**
This refers to the architectural principle that packages should only depend on other packages through their public interfaces, not implementation details. For example:
- ✅ Import from `@voder/shared` only the exported types/interfaces  
- ❌ Never import internal implementation files directly
- ✅ Use dependency injection with interface contracts
- ✅ Follow the principle that if package A uses package B, A should only know B's public API

This is universal because ALL packages (including @voder/tsconfig) need to follow this pattern when they depend on other packages.

**Final Universal Content Classification (CONFIRMED):**
- ✅ **LLM-optimized patterns** - for AI comprehension and implementation  
- ✅ **Package scope boundaries** - what packages MUST NOT do (CI/CD restrictions)
- ✅ **Interface-only dependency patterns** - clean dependency contracts
- ✅ **Error handling patterns** - consistent error management  
- ✅ **Documentation standards** - how to document code
- ✅ **Code quality standards** - TypeScript/ESLint configuration requirements

**Runtime Layer Content (UI packages only):**
- ✅ **Component architecture** - IComponent interface, DOM patterns
- ✅ **Security principles** - CSP, DOM security, XSS prevention  
- ✅ **Accessibility requirements** - WCAG, screen readers
- ✅ **Animation principles** - GSAP patterns
- ✅ **Service architecture** - UI service patterns

**Ready for Phase 9 Implementation**: Content distribution analysis complete, proceed with universal file consolidation

## **Universal Content Deep Analysis - Additional Questions (CURRENT SESSION)**
**Date**: Current session  
**Context**: Reviewing each confirmed universal content type to ensure it truly applies to ALL 22 packages

**Question 5**: Are error handling patterns truly universal? Does `@voder/tsconfig` (TypeScript configuration package) need error handling patterns, or would it just export configuration objects without error handling logic?

**Question 6**: Does `@voder/tsconfig` (TypeScript configuration package) need brand guidelines like typography choices, color schemes, voice/tone, or visual language standards?  
**User Answer**: NO - @voder/tsconfig does not need brand guidelines like typography choices, color schemes, voice/tone, or
**Classification**: brand-guide.md should move to runtime layer (only UI packages need brand guidelines)

**Question 7**: Are error handling patterns truly universal? Does `@voder/tsconfig` (TypeScript configuration package) need error handling patterns, or would it just export configuration objects without runtime error handling logic?  
**User Answer**: NO - error handling is not universal. @voder/tsconfig does not need them  
**Classification**: Error handling patterns should move to runtime layer (only packages with runtime code need error handling)

**Question 8**: What about documentation standards and code quality standards - does `@voder/tsconfig` need guidance on how to document TypeScript configurations and maintain code quality, or would these also be too specific for a simple configuration package?  
**User Answer**: YES - documentation standards and code quality standards are universal. Every package, including @voder/tsconfig, needs them  
**Classification**: Documentation standards and code quality standards remain universal (all packages need consistent documentation and code quality)

**Question 9**: What about the glossary terms and concepts - does `@voder/tsconfig` need to understand terms like "component", "service", "effect", or are there some glossary terms that are only relevant to runtime packages?  
**User Answer**: NO - @voder/tsconfig does not need to understand terms like "component", "service", "effect". User is not sure if any other terms are universal  
**Classification**: Glossary should be split - only truly universal terms remain universal, runtime-specific terms move to runtime layer

**Question 10**: Looking at testing.md content - does `@voder/tsconfig` need interface compliance tests (IComponent), lifecycle tests (mount/unmount), accessibility tests (WCAG, ARIA), animation/transition testing, visual validation, cross-browser testing, or complex mock factories? Or would it only need basic package testing, error handling patterns, and configuration validation?  
**User Answer**: Most of testing.md content (accessibility, animations, transitions, visual testing, lifecycle testing) should move to the runtime layer since only UI packages need those testing requirements  
**Classification**: testing.md should be split - only basic testing principles, error handling patterns, and package validation remain universal; UI testing requirements move to runtime layer

**FINAL UNIVERSAL CONTENT CLASSIFICATION (CONFIRMED):**
Based on systematic Q&A session with user:

**✅ TRULY UNIVERSAL (stays in universal-guide.md):**
- LLM-optimized patterns for AI comprehension and implementation
- Package scope boundaries (what packages MUST NOT do - CI/CD restrictions)
- Interface-only dependency patterns (clean dependency contracts)
- Documentation standards (how to document code)
- Code quality standards (TypeScript/ESLint configuration requirements)
- Basic testing principles (testing what packages export, error handling patterns, configuration validation)

**➡️ RUNTIME LAYER (moves to runtime/):**
- Component architecture (IComponent interface, DOM patterns)
- Security principles (CSP, DOM security, XSS prevention)
- Accessibility requirements (WCAG, screen readers, keyboard navigation)
- Brand guidelines (typography, colors, voice/tone, visual language)
- Error handling patterns (runtime error handling for UI components)
- UI testing requirements (accessibility tests, lifecycle tests, animation/transition testing)
- Runtime-specific glossary terms (component, service, effect definitions)

## **Phase 23 Effects Sublayer Consolidation - COMPLETED (CURRENT SESSION)**
**Date**: Current session  
**Task**: Merge effects sublayer files (effect-hints.md → effects.md)  
**Status**: ✅ **COMPLETE**

**Files Merged:**
- `prompts/runtime/effects/effect-hints.md` → 5 links → ✅ **CONSOLIDATED**
- `prompts/runtime/effects/effects.md` → 5 links → ✅ **EXPANDED**

**Consolidation Results:**
- **BEFORE**: 2 separate effects files, 10 total links (5 + 5)
- **AFTER**: 1 consolidated effects.md file, 5 total links
- **REDUCTION**: 50% reduction in effects sublayer links (10 → 5)
- **CONTENT**: Implementation hints successfully integrated into comprehensive effects guide including:
  - Technical hints about Three.js, GSAP, and library integration
  - Resource management and disposal patterns
  - Comprehensive effect component guidelines

**Integration Details:**
- Added "Implementation Hints" section to effects.md with specific technical guidance
- Included Three.js version specifications (0.178.0)
- Added resource management patterns and memory leak prevention
- Preserved all architectural principles and testing requirements

**Documentation System State After Effects Consolidation:**
- ✅ **Universal Files**: 1 file (universal-guide.md) → 22 links
- ✅ **Runtime Layer Files**: 1 file (runtime.md) → 18 links
- ✅ **Effects Sublayer Files**: 1 file (effects.md) → 5 links (reduced from 10)
- ✅ **Development Layer Files**: 2 files → 4 links each (development.md, development-hints.md)
- ✅ **Package-Specific Files**: 26 files → 1 link each
- ✅ **Total**: 31 linked files, 1 unused file (root/deployment.md)

**User Command Executed**: `npm run docs:report` confirmed successful consolidation

## **Phase 23 Development Layer Consolidation - COMPLETED (CURRENT SESSION)**
**Date**: Current session  
**Task**: Merge development layer files (development-hints.md → development.md)  
**Status**: ✅ **COMPLETE**

**Files Merged:**
- `prompts/development/development-hints.md` → 4 links → ✅ **CONSOLIDATED**
- `prompts/development/development.md` → 4 links → ✅ **EXPANDED**

**Consolidation Results:**
- **BEFORE**: 2 separate development files, 8 total links (4 + 4)
- **AFTER**: 1 consolidated development.md file, 4 total links
- **REDUCTION**: 50% reduction in development layer links (8 → 4)
- **CONTENT**: Development hints successfully integrated into comprehensive development guide including:
  - Build & development workflow guidance (Vite commands, build requirements)
  - Development tools & CLI best practices
  - Complete development package architecture and guidelines

**Integration Details:**
- Added "Development Hints" section to development.md with practical workflow guidance
- Included Vite build process requirements and static asset handling
- Added CLI tool guidance and issue tracking practices
- Preserved all architectural principles and configuration patterns

**Documentation System State After Development Consolidation:**
- ✅ **Universal Files**: 1 file (universal-guide.md) → 22 links
- ✅ **Runtime Layer Files**: 1 file (runtime.md) → 18 links
- ✅ **Effects Sublayer Files**: 1 file (effects.md) → 5 links
- ✅ **Development Layer Files**: 1 file (development.md) → 4 links (reduced from 8)
- ✅ **Package-Specific Files**: 26 files → 1 link each
- ✅ **Total**: 30 linked files, 1 unused file (root/deployment.md)

**User Command Executed**: `npm run docs:report` confirmed successful consolidation
**Date**: Current session  
**Task**: Merge individual universal files into single consolidated universal guide  
**Status**: ✅ **COMPLETE**

**Files Merged:**
- `prompts/architecture.md` → 22 links → ✅ **CONSOLIDATED**
- `prompts/glossary.md` → 22 links → ✅ **CONSOLIDATED**  
- `prompts/implementation-hints.md` → 22 links → ✅ **CONSOLIDATED**
- `prompts/testing.md` → 22 links → ✅ **CONSOLIDATED**
- `prompts/universal-guide.md` → 22 links → ✅ **EXPANDED**

**Consolidation Results:**
- **BEFORE**: 5 separate universal files, each linked to 22 packages = 110 total links
- **AFTER**: 1 consolidated universal-guide.md linked to 22 packages = 22 total links
- **REDUCTION**: 80% reduction in universal file links (110 → 22)
- **CONTENT**: All truly universal content consolidated into comprehensive guide including:
  - LLM-optimized architectural patterns
  - Package scope boundaries and constraints
  - Interface-only dependency patterns
  - Universal testing standards and requirements
  - Code quality standards (ESLint, Prettier, TypeScript)
  - Documentation requirements and standards
  - Error handling patterns and conventions
  - Universal glossary terms for system concepts
  - Implementation hints and development guidelines

**Documentation System State After Consolidation:**
- ✅ **Universal Files**: 1 file (universal-guide.md) → 22 links
- ✅ **Runtime Layer Files**: 1 file (runtime.md) → 18 links
- ✅ **Effects Sublayer Files**: 1 file (effects.md) → 5 links
- ✅ **Development Layer Files**: 1 file (development.md) → 4 links (reduced from 8)
- ✅ **Package-Specific Files**: 26 files → 1 link each
- ✅ **Total**: 37 linked files, 1 unused file (root/deployment.md)

**User Command Executed**: `npm run docs:report` (which runs `docs:setup` then generates report)
**Final Result**: All 22 packages now receive single comprehensive universal guide instead of 5 separate files

**Key Improvements:**
- **Simplified LLM Context**: Each package receives one comprehensive universal file instead of 5 separate ones
- **Reduced Maintenance**: Single source of truth for all universal concepts
- **Enhanced Organization**: Clear sections with navigation for all universal knowledge
- **Path-Based Naming**: Clean filename separation (universal-guide.md vs runtime-testing.md)
- **Complete Coverage**: All essential universal concepts preserved and organized

**Ready for Next Phase**: Phase 9 universal file consolidation complete, ready for layer-specific consolidations
- Testing requirements include critical GSAP animation timing considerations for scroll-triggered animations
- Content is entirely UI-focused with no universal concepts that would apply to configuration or utility packages

## **Phase 9 Universal File Consolidation - Security & Privacy Move Complete (CURRENT SESSION)**
**Date**: Current session  
**Task**: Move `security-and-privacy.md` → `prompts/runtime/security-and-privacy.md`  
**Status**: ✅ **COMPLETE**

**Move Details:**
- **Source**: `prompts/security-and-privacy.md` (609 lines of web security and privacy implementation guidelines)
- **Destination**: `prompts/runtime/security-and-privacy.md` (will be linked as `runtime-security-and-privacy.md`)
- **Content**: Complete file moved with no modifications - contains CSP policies, DOM manipulation security, XSS prevention, input sanitization, analytics implementation, privacy compliance (GDPR/CCPA), external service security, form security patterns, secure component patterns
- **Reasoning**: Security and privacy guidelines are web/UI-specific and only apply to runtime packages that interact with browsers, DOM, user input, and external services. Configuration packages like `@voder/tsconfig` do not need CSP policies, XSS prevention, DOM sanitization, or privacy compliance patterns
- **File Removal**: Original universal file successfully removed after move
- **Path-Based Naming**: Will be linked as `runtime-security-and-privacy.md` to clearly distinguish from any future universal security concepts

**Implementation Notes:**
- File contains comprehensive web security patterns including CSP implementation, external service validation, DOM security, input sanitization, analytics privacy controls, and GDPR compliance
- Security patterns are entirely browser/DOM-focused with no universal concepts that would apply to configuration or utility packages
- Content includes specific implementations for analytics services (Google Analytics, Microsoft Clarity), privacy compliance services, and secure component patterns

## **Phase 9 Universal File Consolidation - Brand Guide Move Complete (CURRENT SESSION)**
**Date**: Current session  
**Task**: Move `brand-guide.md` → `prompts/runtime/brand-guide.md`  
**Status**: ✅ **COMPLETE**

**Move Details:**
- **Source**: `prompts/brand-guide.md` (151 lines of visual brand and UI design guidelines)
- **Destination**: `prompts/runtime/brand-guide.md` (will be linked as `runtime-brand-guide.md`)
- **Content**: Complete file moved with no modifications - contains typography standards, color palette, accessibility requirements, visual language guidelines, motion/interaction principles, voice/tone examples, layout structure guidelines, iconography standards
- **Reasoning**: Brand guidelines are UI-specific and only apply to runtime packages that create user interfaces. Configuration packages like `@voder/tsconfig` do not need typography choices, color schemes, voice/tone standards, or visual language guidelines
- **File Removal**: Original universal file successfully removed after move
- **Path-Based Naming**: Will be linked as `runtime-brand-guide.md` to clearly distinguish from any future universal branding concepts

**Implementation Notes:**
- File contains comprehensive visual and interaction design standards including typography (Inter/Satoshi), color palette (Voder Black, Deep Navy, Soft Teal Glow), accessibility requirements (WCAG 2.1, ARIA standards), motion principles, voice/tone guidelines
- Brand guidelines are entirely UI/visual-focused with no universal concepts that would apply to configuration or utility packages
- Content includes specific layout structure for website sections, keyboard navigation requirements, screen reader support, and motion accessibility patterns

## **Phase 8.5 Path-Based Naming System Implementation (CURRENT SESSION)**
**Date**: Current session  
**Decision**: Successfully implemented path-based naming system in setup-package-docs.js  
**User Clarification**: Confirmed that `prompts/runtime/runtime-hints.md` should link as `runtime-runtime-hints.md` (not `runtime-hints.md`) until file is moved to `prompts/runtime/hints.md`

**Implementation Results:**
- ✅ **Path-based naming function created**: `generatePathBasedFilename()` with proper redundancy detection
- ✅ **Universal files maintain simple names**: `architecture.md`, `testing.md`, `glossary.md` (no prefix)
- ✅ **Runtime files get runtime- prefix**: `runtime.md`, `runtime-sections.md`, `runtime-runtime-hints.md`
- ✅ **Development files get development- prefix**: `development.md`, `development-build-tools.md`, `development-development-hints.md`
- ✅ **Deep package files get full path**: `runtime-sections-brand-entry-section.md`
- ✅ **Redundancy handling working correctly**: `runtime/runtime.md` → `runtime.md`, but `runtime/runtime-hints.md` → `runtime-runtime-hints.md` (intended behavior)
- ✅ **No naming conflicts**: Universal `testing.md` and future runtime `runtime-testing.md` can coexist
- ✅ **All functions updated**: Universal, layer, directory, root prompt, and package-specific file functions now use path-based naming
- ✅ **Comprehensive testing**: Tested on brand-entry-section and build-tools packages, verified correct behavior

**Phase 9 Universal File Consolidation - Content Extraction Complete**
**Date**: Current session  
**Context**: Successfully created universal-guide.md with truly universal content and confirmed runtime layer moves

**Phase 9 Universal File Consolidation - Runtime Content Extraction Progress (CURRENT SESSION)**
**Date**: Current session  
**Context**: Moving confirmed runtime-specific content from architecture.md to runtime layer

**✅ COMPLETED MOVES:**
- ✅ **Component Architecture section** (lines 100-170) → Added to `prompts/runtime/runtime.md` under "Universal Component Pattern"

## **Phase 9 Universal File Consolidation - Glossary Terms Separation Complete (CURRENT SESSION)**
**Date**: Current session  
**Task**: Split `glossary.md` → Universal concepts only, runtime-specific terms → `prompts/runtime/glossary.md`  
**Status**: ✅ **COMPLETE**

**Split Details:**
- **Original**: `prompts/glossary.md` (504 lines with mixed universal and runtime-specific terms)
- **Runtime File**: `prompts/runtime/glossary.md` (comprehensive runtime-specific terminology)
- **Universal File**: `prompts/glossary.md` (recreated with only universal system concepts)
- **Content Separation**: 
  - **Universal**: Monorepo structure (Package, Layer, Interface Contract, Dependency Injection, Documentation Inheritance, Needs File, LLM Agent Context, Build Tool Strategy, Package Naming Convention, Prepare Hook), Documentation Inheritance system, Build Tool Strategy, Testing Strategy, Dependency Graph, Interface Compliance, Service Registration, File Naming Patterns, Import/Export Patterns
  - **Runtime**: Component/Service/Effect/Section architectural definitions, GSAP/ScrollTrigger/Three.js animation terms, CSP/Input Sanitization security terms, ARIA/WCAG/Screen Reader accessibility terms, Core Web Vitals/Critical CSS performance terms, Brand Entry/GPS Metaphor content terms, Progressive Enhancement deployment terms
- **Reasoning**: Glossary contained mixed terminology. Universal terms must apply to ALL 22 packages (including @voder/tsconfig), while runtime-specific terms only apply to UI packages
- **Path-Based Naming**: Runtime glossary will be linked as `runtime-glossary.md` to distinguish from universal glossary

**Implementation Notes:**
- Successfully separated 504-line glossary into appropriate universal vs runtime-specific terminology
- Universal glossary now contains only concepts needed by configuration, utility, and runtime packages alike
- Runtime glossary provides comprehensive UI/web development terminology for runtime packages
- Clean separation ensures @voder/tsconfig receives only relevant monorepo/system concepts without irrelevant UI-specific terms

## **Phase 9 Universal File Consolidation - Application Layer Positioning Confirmed (CURRENT SESSION)**
**Date**: Current session  
**Task**: Confirm applications are properly positioned under runtime layer  
**Status**: ✅ **COMPLETE**

**Positioning Analysis:**
- **Current Structure**: Applications positioned under `prompts/runtime/applications/` inheriting from universal + runtime layer documentation
- **Inheritance Chain**: Universal documentation → Runtime layer documentation → Application layer guidelines → Specific application (voder-website)
- **Architecture Validation**: Applications like `VoderApp` correctly orchestrate runtime packages (PageRenderer, ServiceContainer, sections, effects) rather than implementing functionality directly
- **Documentation Content**: Application guidelines properly emphasize coordination and configuration management over direct implementation

**Implementation Notes:**
- Applications are correctly classified as specialized runtime packages that coordinate other runtime components
- Inheritance structure provides appropriate context: universal system concepts + runtime patterns + application coordination patterns
- Application layer guidelines properly distinguish between orchestration (correct) and implementation (incorrect) responsibilities
- Current positioning aligns with architectural principle that applications consume and coordinate runtime packages rather than duplicate their functionality
  - IComponent interface with mount/unmount/update/destroy lifecycle
  - IComponentConfig interface for dependency injection
  - Universal component class template with consistent patterns
  - IAccessibleComponent interface for ARIA, keyboard navigation, reduced motion, screen reader support
- ✅ **Service Architecture section** (lines 173-220) → Added to `prompts/runtime/runtime.md` under "Service Architecture"
  - IServiceContainer interface for central service access
  - IService interface pattern for all services
  - BaseService abstract class with standard lifecycle
  - Service injection patterns instead of direct imports

**✅ TESTING CONTENT DISTRIBUTION COMPLETE:**
Successfully split testing.md into universal and runtime-specific content:

**✅ Universal testing.md (updated)** - Now contains ONLY truly universal testing content:
- Universal testing philosophy applying to all 22 packages
- Package export validation patterns for all package types
- Configuration validation requirements for all packages
- Basic error handling patterns using PackageError
- Universal file management guidelines (temporary files only)
- Universal vitest configuration standards (.mjs requirement)
- Basic mock patterns suitable for any package type
- Universal testing scope boundaries (what to test vs. what NOT to test)

**✅ Runtime testing.md (new file)** - Contains UI-specific testing requirements:
- IComponent interface compliance tests (mount/unmount/destroy lifecycle)
- Accessibility tests (WCAG compliance, ARIA, keyboard navigation, screen readers)
- Performance tests (initialization timing, memory leaks)
- Visual validation standards (cross-browser, animation states)
- Animation & transition testing (reduced motion, timing requirements)
- Complex mock factories for runtime services (animation, accessibility, scroll, assets)
- Runtime-specific test configuration (Playwright for applications)

**Content Classification Results:**
- ✅ **Moved to runtime layer**: Component lifecycle tests, accessibility tests, visual validation, animation testing, cross-browser testing, complex service mocks, performance testing, UI-specific error handling
- ✅ **Kept universal**: Package export validation, configuration validation, basic error handling, file management, vitest configuration, basic mocking patterns

**Path-based naming ready**: New runtime testing file will be linked as `runtime-testing.md` providing clear separation from universal `testing.md`

**❓ QUESTION ANSWERED:**
The Package Development Guidelines section contains:
1. ✅ **Package Structure** → `/prompts/root/` directory (root project guidance for package structure)
2. ✅ **Public API Rules** → Already in universal-guide.md (export rules for all packages)
3. ✅ **Error Handling Pattern** → Moved to runtime.md Error Handling section
4. ✅ **Animation & Interaction Principles** → Moved to runtime.md Animation Performance section

**📁 DIRECTORY CLASSIFICATION LEARNED:**
- `/prompts/` (root level) = UNIVERSAL content for ALL 22 packages
- `/prompts/root/` = ROOT PROJECT SPECIFIC content (CI/CD, deployment, package structure guidelines)
- `/prompts/runtime/` = RUNTIME LAYER content (UI packages only)
- `/prompts/development/` = DEVELOPMENT LAYER content (dev tool packages only)

**✅ CONTENT SUCCESSFULLY INTEGRATED**: The moved content fits well into runtime.md's existing structure and enhances the component and service guidance for UI packages.
- ✅ **universal-guide.md created** with comprehensive universal content:
  - LLM-optimized patterns for AI comprehension and implementation
  - Package scope boundaries (what packages MUST NOT do - CI/CD restrictions)  
  - Interface-only dependency patterns (clean dependency contracts)
  - Documentation standards (how to document code)
  - Code quality standards (TypeScript/ESLint configuration requirements)
  - Basic testing principles (testing what packages export, error handling patterns, configuration validation)
  - Universal glossary terms (Package, Layer, Interface Contract, Dependency Injection, Documentation Inheritance, Needs File, LLM Agent Context, Build Tool Strategy, Package Naming Convention, Prepare Hook)

**✅ CONFIRMED FOR RUNTIME LAYER MOVE:**
- Component Architecture section (IComponent interface, DOM patterns) ✅ **CONFIRMED**
- Accessibility Requirements section (IAccessibleComponent interface, ARIA, keyboard navigation, reduced motion, screen reader support) ✅ **CONFIRMED**
- Security & Privacy Principles (CSP, DOM security, XSS prevention) ✅ **CONFIRMED** 
- UI Testing Requirements (accessibility tests, lifecycle tests, animation/transition testing) ✅ **CONFIRMED**
- Runtime-specific glossary terms (Component, Service, Effect, Section, ARIA, GSAP, Three.js, Screen Reader, etc.) ✅ **CONFIRMED**

**🎯 NEXT STEPS**: 
- Move confirmed runtime content from architecture.md to runtime layer with path-based naming
- Move accessibility-requirements.md → runtime/accessibility-requirements.md (linked as runtime-accessibility-requirements.md)
- Move security-and-privacy.md → runtime/security-and-privacy.md (linked as runtime-security-and-privacy.md)
- Move brand-guide.md → runtime/brand-guide.md (linked as runtime-brand-guide.md)
- Extract runtime-specific testing content → runtime/runtime-testing.md (linked as runtime-testing.md)
- Extract runtime-specific glossary terms → runtime/runtime-glossary.md (linked as runtime-glossary.md)
- Remove individual universal files after consolidation complete
- Update symlink system to use universal-guide.md for all packages

**Confirmed Universal Content from Q&A Session:**
- LLM-optimized patterns for AI comprehension and implementation
- Package scope boundaries (what packages MUST NOT do - CI/CD restrictions)  
- Interface-only dependency patterns (clean dependency contracts)
- Documentation standards (how to document code)
- Code quality standards (TypeScript/ESLint configuration requirements)
- Basic testing principles (testing what packages export, error handling patterns, configuration validation)

**Confirmed Runtime Layer Content (to be moved later):**
- Component architecture (IComponent interface, DOM patterns) ✅ **CONFIRMED FOR MOVE**
- Security principles (CSP, DOM security, XSS prevention)
- Accessibility requirements (WCAG, screen readers, keyboard navigation) ⏳ **PENDING CONFIRMATION**
- Brand guidelines (typography, colors, voice/tone, visual language)
- Error handling patterns (runtime error handling for UI components)
- UI testing requirements (accessibility tests, lifecycle tests, animation/transition testing)
- Runtime-specific glossary terms (component, service, effect definitions)
- ✅ **Usage report validation**: 38 linked files with proper path-based naming, only 1 unused file

**Naming Examples Confirmed:**
- Universal: `prompts/architecture.md` → `architecture.md`
- Runtime layer: `prompts/runtime/runtime.md` → `runtime.md`
- Runtime sublayer: `prompts/runtime/sections/sections.md` → `runtime-sections.md`
- Runtime package: `prompts/runtime/sections/brand-entry-section/brand-entry-section.md` → `runtime-sections-brand-entry-section.md`
- Development layer: `prompts/development/development.md` → `development.md`
- Development package: `prompts/development/build-tools/build-tools.md` → `development-build-tools.md`
- Intentional redundancy preserved: `prompts/runtime/runtime-hints.md` → `runtime-runtime-hints.md`

**Next Action**: Phase 8.5 complete, proceed to Phase 9 universal file consolidation using new path-based naming system

#### **implementation-strategy.md Deletion (COMPLETED)**
**Date**: Current session  
**Decision**: Delete implementation-strategy.md file due to redundancy  
**Reasoning**: Content was redundant with existing comprehensive implementation guides across the documentation hierarchy  

**Implementation:**
- **File deletion**: `prompts/implementation-strategy.md` removed completely
- **Redundancy elimination**: Existing layer-specific and package-specific implementation guides already provide comprehensive strategy guidance
- **Documentation cleanup**: Removed unnecessary duplication to maintain single source of truth principle

**Result**: implementation-strategy.md no longer clutters universal prompts, implementation strategy is now properly distributed across appropriate hierarchy levels

#### **hints.md Split (COMPLETED)**
**Date**: Current session  
**Decision**: Split hints.md into three hierarchy-appropriate files with unique names  
**Reasoning**: File contained mix of universal, development-specific, and application-specific hints that needed proper distribution across documentation hierarchy  

**Content Distribution:**
- **Universal hints** → `prompts/implementation-hints.md` (tech stack, component patterns, ESLint config, accessibility, architecture constraints)
- **Development hints** → `prompts/development/development-hints.md` (build commands, CLI tools, development workflow)
- **Application hints** → `prompts/runtime/applications/application-hints.md` (testing strategy, browser testing approach, application architecture)

**Implementation:**
- **File split**: `prompts/hints.md` → 3 specialized files with unique names to avoid linking conflicts
- **Hierarchy placement**: Each file placed at appropriate documentation level for proper inheritance
- **Name uniqueness**: Used descriptive prefixes (implementation-, development-, application-) to prevent clashing during symlink creation

**Result**: hints.md content now properly distributed across hierarchy with appropriate inheritance patterns, no linking conflicts

#### **VS Code Performance Concern (CURRENT)**
**Date**: Current session  
**Issue**: User reports that having many small documentation files significantly slows down VS Code performance  
**Context**: Current structure has numerous individual files across universal, runtime, development, and application layers  

**Consolidation Options Under Consideration:**
- **Option 1**: Consolidate by responsibility (all dev tools → development-tools.md, all sections → content-sections.md, all effects → visual-effects.md)
- **Option 2**: Consolidate by layer (single large files per layer: runtime-packages.md, development-packages.md)
- **Option 3**: Hybrid approach (keep universal files, consolidate related packages within sublayers)

**Question for User**: Priority preference between faster VS Code performance (fewer files) vs easier LLM agent context (smaller, focused files per package)?

**User Response**: "easier LLM agent context (smaller, focused files per package)"

**Decision**: Prioritize LLM agent effectiveness over VS Code performance  
**Reasoning**: LLM agents work better with focused, package-specific context rather than large consolidated files  
**Benefits**: Clear separation of concerns, better maintainability, parallel development capability  

**Consolidation Strategy**: Targeted consolidation of related files within same responsibility areas while maintaining package-specific focus

#### Navigation Component Implementation (CURRENT)
**Date**: Current session  
**Decision**: Implement Navigation component as a skip-to-content accessibility feature only, without visible navigation menu  
**Reasoning**: Preserves cinematic narrative flow while ensuring WCAG compliance

**Implementation Details:**
- Navigation component provides keyboard navigation and screen reader support
- No visible navigation menu is rendered, preserving the immersive storytelling approach
- Skip links are styled as hidden and only revealed on keyboard focus
- Focus management ensures smooth user experience without disrupting the narrative flow

**Testing Validation:**
- Verified that navigation component meets all accessibility requirements
- Confirmed that no visual navigation elements interfere with the cinematic experience
- Ensured that keyboard navigation works as intended, providing access to all content

---

## 📒 Package Validation Log — 2025-08-08

### A1. @voder/tsconfig — Validation Findings
- File inventory (prompts):
  - `universal-guide.md`
  - `development.md`
  - `development-tsconfig.md` — EMPTY
- Appropriateness: ✅ Universal + development layer docs are appropriate for a config package
- Content gaps: 🚫 Package-specific file is empty; lacks targeted guidance for variants and usage patterns
- Inheritance: ✅ Receives development layer correctly; no runtime docs present (as desired)
- Consistency: ⚠️ Mixed quality vs other dev packages (`build-tools` has content; `dev-tools` is empty)
- Sufficiency: ❌ Not sufficient for LLM agent without package-specific guidance

Decisions:
- ✅ Add dedicated test/Vitest variant `test.json`
  - Types: ["vitest/globals", "vitest"]
  - Extends: `./base.json`
  - Typical include: test directories (e.g., `tests/**/*`, `src/**/*` when needed)
  - Purpose: Provide test-only ambient types without leaking into build configs
- ✅ Standardize TS path aliases in shared config
  - baseUrl: "."
  - paths: { "@voder/*": ["../*/src"] }
  - Scope: For dev DX; consumers must mirror in Vite/Vitest/Rollup/ESLint resolvers
  - Caveat: May bypass package.json exports; document usage and publishing cautions
- ✅ Provide library preset `library.json`
  - compilerOptions: { declaration: true, declarationMap: true, composite: true, incremental: true }
  - Purpose: Encourage TS project references and faster rebuilds for libraries
  - Notes: Document `outDir`, `.tsbuildinfo` caching, and guidance on when apps should NOT use this preset

Open Questions (awaiting user decisions):
1) Should @voder/tsconfig provide a dedicated test/Vitest variant, under the existing A1 validation entry.
2) Do we standardize path aliases for workspace packages (e.g., `paths: { "@voder/*": ["../*/src"] }`), or leave to consumers?
3) For library packages, do we recommend `declaration: true` and `composite/incremental` in a `package.json`-oriented tsconfig, or keep these out of shared configs?
4) Do application configs require explicit DOM libs and `noEmit: true` (current `vite.json` already has `noEmit: true`)—any additional app-specific flags?
5) What is the minimal variant set we want to bless: `base.json`, `node.json`, `vite.json`, and (if approved) `test.json`?

Next Actions Proposed:
- Populate `packages/tsconfig/prompts/development-tsconfig.md` with: purpose, variant matrix (base/node/vite/(test?)), usage examples, extension patterns, and ADR ties.
- Keep universal scope minimal; avoid runtime/web-specific guidance here.

---

### A1. @voder/tsconfig — Progress Update (2025-08-08)
- Action: Populated `packages/tsconfig/prompts/development-tsconfig.md` with the main package specification.
- Coverage:
  - Preset matrix: base.json, vite.json (apps), node.json (tools/CLIs), library.json (libs), test.json (Vitest)
  - ESM enforcement: `.js` import specifiers, `verbatimModuleSyntax: true`, NodeNext for libs/tools
  - Live dev DX: shared `@voder/*` path alias (→ `../*/src`), Vite integration notes (tsconfig paths, preserveSymlinks, server.fs.allow, optimizeDeps.exclude)
  - Usage examples for apps, libs, and tests
  - Notes/caveats and ADR links
- Decisions reflected (from earlier Q&A):
  - ✅ Add `test.json` preset for Vitest
  - ✅ Standardize `@voder/*` alias to source (`../*/src`)
  - ✅ Provide `library.json` with declaration/composite/incremental/emitDeclarationOnly
  - ✅ App preset uses bundler resolution, DOM libs, `noEmit: true`, `types: ["vite/client"]`
- Known discrepancy to reconcile:
  - Current `packages/tsconfig/node.json` is CommonJS + Node resolution; spec recommends ESM with `module: "NodeNext"` and `moduleResolution: "NodeNext"` for tools/libs.
- Next actions proposed for A1 completion:
  1) Add `packages/tsconfig/library.json` per spec
  2) Add `packages/tsconfig/test.json` per spec
  3) Update `packages/tsconfig/node.json` to NodeNext (or document reason to keep CJS)

Blocking question (single): Proceed to create `library.json` and `test.json`, and switch `node.json` to NodeNext now?

---

### A1. @voder/tsconfig — Decision Update (2025-08-08)
- User decision: Do NOT create `library.json` or `test.json` now, and do NOT switch `node.json` to NodeNext.
- Status: Follow-up actions deferred; package spec remains in `prompts/development-tsconfig.md`.
- Proposed next step: Mark A1 complete and proceed to A2 (@voder/eslint-config) if approved.

---

### A2. @voder/eslint-config — Decision Log (2025-08-08)
- Decision: Enforce ESM-style import specifiers with `.js` extensions for TS sources via `eslint-plugin-import`.
  - Rule: `import/extensions`: ["error", "always", { "ts": "always", "tsx": "always" }]
  - Purpose: Align lint rules with ESM runtime validity and TS `verbatimModuleSyntax`.

---

### A2. @voder/eslint-config — Decision Log Update (2025-08-08)
- Additional rules to enforce no CJS interop and prefer named exports in TS:
  - `import/no-default-export`: "error"
  - `import/no-commonjs`: "error" (disallow `require`, `module.exports`, `exports` in TS)
  - `@typescript-eslint/no-var-requires`: "error" (forbid `require()` in TS files)

---

### A2. @voder/eslint-config — Decision Log Update 2 (2025-08-08)
- Import style standardization:
  - `import/order`: ["error", { "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "type"], "newlines-between": "always", "alphabetize": { "order": "asc", "caseInsensitive": true } }]
  - `@typescript-eslint/consistent-type-imports`: ["error", { "prefer": "type-imports", "fixStyle": "inline-type-imports" }]
  - `@typescript-eslint/consistent-type-exports`: ["error", { "fixMixedExportsWithInlineTypeSpecifier": true }]
  
---

### A2. @voder/eslint-config — Decision Log Update 3 (2025-08-08)
- Import path hygiene:
  - `unicorn/prefer-node-protocol`: "error"
  - `import/no-useless-path-segments`: "error"

## **Legacy voder-website.md Migration Analysis (CURRENT SESSION)**
**Date**: Current session  
**Context**: User requested migration of relevant content from legacy voder-website.md to non-legacy prompt files and deletion of legacy file  
**Analysis**: Complete content duplication verification

**Migration Status:**
- **Legacy File**: `/prompts/legacy/voder-website.md` (212 lines)
- **Non-Legacy File**: `/prompts/runtime/applications/voder-website/website.md` (212 lines)
- **Verification**: Files are identical (diff shows no differences)
- **Content Coverage**: All website specification content (Purpose, Audience, Tone, Visual Design, Narrative Structure, Technical Implementation, etc.) exists in non-legacy location
- **Dependencies**: No unique content in legacy file that isn't already preserved

**Migration Decision**: ✅ **SAFE TO DELETE** - Legacy file is a complete duplicate with no unique content

## **Legacy accessibility-requirements.md Migration Analysis (CURRENT SESSION)**
**Date**: Current session  
**Context**: User requested migration of relevant content from legacy accessibility-requirements.md to non-legacy prompt files and deletion of legacy file  
**Analysis**: Comprehensive content coverage verification and unique content identification

**Content Coverage Analysis:**

**✅ ALREADY COVERED in non-legacy files:**
- **WCAG Goals & Standards**: Identical accessibility goals exist in runtime layer files
- **Color Contrast Tables**: Exact same contrast ratio tables (19.6:1, 15.8:1, etc.) exist in multiple runtime files
- **General ARIA Patterns**: Basic ARIA implementation patterns covered in runtime accessibility implementation
- **Basic Keyboard Navigation**: Standard keyboard patterns covered in runtime layer
- **Motion Accessibility**: prefers-reduced-motion patterns exist in runtime components
- **Screen Reader Patterns**: Basic aria-live and semantic HTML guidance covered

**🔍 UNIQUE CONTENT in legacy file (NOT found elsewhere):**
1. **Detailed Component-Specific ARIA Examples**: Specific HTML examples for Brand Entry, Hero, Problem Space, Flow Diagram sections with exact `aria-label` values
2. **Comprehensive Testing Requirements with GSAP ScrollTrigger Integration**: Critical testing patterns for scroll-triggered animations, including specific TypeScript code for waiting on GSAP animations
3. **Complete Testing Checklist**: Comprehensive 12-point checklist specifically for scroll-triggered accessibility testing
4. **Focus Management Patterns**: Detailed focus trap and keyboard navigation requirements specific to animation sequences
5. **Implementation Priority Phases**: 3-phase implementation strategy (Foundation → Enhancement → Validation)
6. **Touch Target Specifications**: Specific 44px minimum touch targets and 8px spacing requirements
7. **Responsive Accessibility Requirements**: 200% zoom support and mobile screen reader testing requirements

**Migration Decision:**
- **Component-specific ARIA examples** should move to application-level accessibility documentation
- **GSAP ScrollTrigger testing patterns** are critically important and not covered elsewhere
- **Testing checklist and implementation phases** provide practical guidance missing from general patterns
- **Unique content** represents ~40% of legacy file content, requiring preservation

**✅ MIGRATION COMPLETED:**
- **Date**: Current session
- **Target Location**: `/prompts/runtime/applications/voder-website/website.md`
- **Content Migrated**:
  - Component-specific ARIA examples with complete HTML code snippets for Brand Entry, Hero, Problem Space, and Flow Diagram sections
  - Comprehensive keyboard navigation requirements with key bindings table
  - Focus management patterns specific to animation sequences
  - Responsive accessibility requirements (touch targets, viewport considerations)
  - Motion accessibility with prefers-reduced-motion CSS implementation
  - Screen reader optimization patterns with dynamic content examples
  - **CRITICAL**: GSAP ScrollTrigger testing integration patterns with TypeScript code for animation-aware accessibility testing
  - Complete testing checklist with 12 specific requirements for scroll-triggered animations
  - Implementation priority phases (Foundation → Enhancement → Validation)
  - Success metrics and manual testing requirements

**Migration Summary:**
- **Original legacy file**: 298 lines of comprehensive accessibility guidance
- **Unique content preserved**: Component-specific ARIA examples, GSAP testing patterns, testing checklist, implementation phases
- **Integration approach**: Expanded existing "Accessibility & ARIA Requirements" section with detailed implementation guidance
- **Critical preservation**: GSAP ScrollTrigger testing patterns that ensure accessibility scans wait for scroll-triggered animations to complete

**Ready for legacy file deletion**: All relevant unique content has been successfully migrated to the appropriate application-level specification.

## **Legacy brand-guide.md Migration Analysis (CURRENT SESSION)**
**Date**: Current session  
**Context**: User requested migration of relevant content from legacy brand-guide.md to non-legacy prompt files and deletion of legacy file  
**Analysis**: Comprehensive content coverage verification and unique content identification

**Content Coverage Analysis:**

**✅ ALREADY COVERED in non-legacy files:**
- **Brand Essence & Personality**: Identical content exists in runtime layer (name, tagline, core belief, persona, voice, personality traits)
- **Typography Implementation**: Font families, weights, and line height specifications exist in runtime layer with TypeScript interfaces
- **Color Palette**: All hex values (Voder Black #0A0A0A, Deep Navy #0F1A2E, Soft Teal Glow #24D1D5, etc.) exist in runtime layer
- **Accessibility & Color Contrast**: Exact same contrast ratio tables (19.6:1, 15.8:1, 11.7:1, 13.2:1, 16.1:1) exist in runtime layer
- **Motion & Interaction Principles**: Animation config, easing functions, and motion principles covered in runtime layer
- **Voice & Tone Examples**: Hero lines, CTA examples, microcopy examples covered in runtime layer

**🔍 POTENTIAL UNIQUE CONTENT in legacy file (requires verification):**
1. **Detailed Iconography Guidelines**: "Line-based, minimal, avoid skeuomorphism, repeating motifs (cube, flow lines, glimmer, lattice, circuit)" ✅ **MIGRATED**
2. **Detailed ARIA Implementation Table**: Component-specific ARIA attributes table may have more detail than runtime layer
3. **Motion Accessibility Specifications**: Specific prefers-reduced-motion CSS implementation
4. **Layout Structure Guidelines**: 8-section layout structure with specific content formats ✅ **MIGRATED**
5. **Voice Tone "Avoid" Guidelines**: Specific guidance on what to avoid in messaging ✅ **ALREADY COVERED**
6. **Brand Persona Summary**: "If Voder Were a Person" creative summary section ✅ **MIGRATED**

**✅ MIGRATION COMPLETED:**
- **Date**: Current session
- **Target Location**: `/prompts/runtime/runtime-consolidated.md`
- **Content Migrated**:
  - **Iconography Standards**: Line-based minimal icons with specific motifs (cube, flow lines, glimmer, lattice, circuit), stroke width, corner radius, and implementation guidance
  - **Layout Structure Guidelines**: Complete 8-section layout table with content formats and implementation notes for all website sections
  - **Brand Persona Reference**: Creative "If Voder Were a Person" summary for strategic alignment (appearance, interests, communication style)
  - **Voice Guidelines**: "Avoid" guidelines were already covered in existing runtime implementation

**Migration Summary:**
- **Original legacy file**: 151 lines of comprehensive brand guidelines
- **Unique content preserved**: Iconography standards, layout structure guidelines, brand persona reference
- **Integration approach**: Added new sections to existing "VODER BRAND IMPLEMENTATION" in runtime layer
- **Implementation format**: TypeScript interfaces and configuration objects for developer implementation

**Legacy File Status**: ✅ **DELETED** - All unique content successfully migrated

**Migration Decision**: ✅ **SAFE TO DELETE** - All unique brand content has been successfully migrated to the runtime layer where UI packages can access comprehensive brand implementation guidance.
