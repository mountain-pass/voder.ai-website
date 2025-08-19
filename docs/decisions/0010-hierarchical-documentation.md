---
status: 'accepted'
date: 2025-08-06
decision-makers: voder.ai website team
consulted: LLM-assisted development stakeholders
informed: development team
---

# ADR 0010: Implement Hierarchical Documentation Inheritance for LLM Agent Context

## Context and Problem Statement

Following ADR-0008's monorepo architecture, we need a documentation system that provides LLM agents with precisely the context they need without overwhelming them with irrelevant information. Each agent should receive:

- Universal principles that apply to all packages
- Layer-specific guidelines for their package type
- Package-specific implementation details
- Dependency requirements from dependent packages

Manual documentation copying would create maintenance overhead and inconsistency.

## Decision Drivers

- **Precise Context**: Each LLM agent gets exactly the documentation it needs
- **No Duplication**: Single source of truth for each piece of information
- **Automatic Inheritance**: New packages automatically inherit appropriate documentation
- **Dependency Communication**: Dependent packages communicate requirements to dependencies
- **Maintainability**: Changes propagate automatically without manual updates
- **LLM Comprehension**: Clear, hierarchical context improves AI implementation quality

## Considered Options

- **Manual Documentation**: Copy documentation manually to each package
- **Template System**: Generate documentation from templates
- **Symlink Inheritance**: Use filesystem symlinks for hierarchical inheritance
- **Build-time Assembly**: Assemble documentation during build process

## Decision Outcome

Chosen option: **"Symlink Inheritance"**, because it provides automatic, real-time inheritance with no build complexity while maintaining single sources of truth for all documentation.

### Documentation Hierarchy

```
prompts/                           # Universal (all packages inherit)
├── core.md                       # Architecture principles
├── testing.md                    # Testing standards
├── security-and-privacy.md      # Security guidelines
├── glossary.md                   # Terms and concepts
├── development/                  # Development layer (dev packages only)
│   ├── development.md           # Dev tooling guidelines
│   ├── tsconfig/               # Package-specific guides
│   ├── eslint-config/
│   └── build-tools/
└── runtime/                     # Runtime layer (runtime packages only)
    ├── runtime.md              # Runtime guidelines
    ├── shared/                 # Package-specific guides
    ├── services/
    ├── sections/               # Section sublayer
    ├── effects/                # Effect sublayer
    └── applications/           # Application layer
```

### Inheritance Rules

1. **Universal Files**: All packages inherit core.md, testing.md, security-and-privacy.md, glossary.md
2. **Layer Files**: Only packages in development/ or runtime/ inherit layer guidelines
3. **Sublayer Files**: Only packages in sections/ or effects/ inherit sublayer guidelines  
4. **Package Files**: Only specific packages get package-specific documentation
5. **Needs Files**: Dependencies receive requirements from dependent packages

### Consequences

**Positive:**
- **Automatic Inheritance**: New packages get appropriate documentation instantly
- **Single Source of Truth**: Updates propagate to all inheriting packages
- **Precise Context**: Each agent sees only relevant documentation
- **Real-time Updates**: Changes appear immediately in all inheriting packages
- **Clear Dependencies**: Needs files communicate requirements explicitly

**Negative:**
- **Symlink Complexity**: Development on Windows may have symlink limitations
- **Tool Support**: Some editors may not follow symlinks properly
- **Debugging**: Link issues require understanding of inheritance hierarchy

### Confirmation

- ✅ setup-package-docs.js creates correct symlinks for each package
- ✅ Universal files appear in all package prompts/ directories
- ✅ Layer-specific files only appear in appropriate packages
- ✅ Needs files are properly linked between dependent/dependency packages
- ✅ No broken symlinks when running validation reports

## Implementation Details

### Symlink Creation Script
```javascript
// setup-package-docs.js
// Creates hierarchical symlinks based on package type and dependencies
function createDocumentationLinks(packagePath) {
  // 1. Universal files (all packages)
  // 2. Layer files (based on package type)
  // 3. Sublayer files (based on package sublayer)
  // 4. Package-specific files
  // 5. Needs files (from dependent packages)
}
```

### Package Types and Inheritance
- **Development Packages**: Universal + development/ + package-specific
- **Foundation Packages**: Universal + runtime/ + package-specific  
- **Component Packages**: Universal + runtime/ + sublayer/ + package-specific
- **Application Packages**: Universal + runtime/applications/ + package-specific

### Needs Files Communication
```
packages/dependent-package/docs/libraries/needs/dependency-needs.md
                    ↓ (symlinked to)
packages/dependency-package/prompts/needs/dependent-package-needs.md
```

### Directory Structure After Linking
```
packages/shared/prompts/
├── core.md -> ../../../prompts/core.md
├── testing.md -> ../../../prompts/testing.md
├── security-and-privacy.md -> ../../../prompts/security-and-privacy.md
├── glossary.md -> ../../../prompts/glossary.md
├── runtime.md -> ../../../prompts/runtime/runtime.md
├── shared.md -> ../../../prompts/runtime/shared/shared.md
└── needs/
    ├── services-needs.md -> ../../services/docs/libraries/needs/shared-needs.md
    └── core-needs.md -> ../../core/docs/libraries/needs/shared-needs.md
```

## Workflow Integration

### Package Preparation
Each package includes prepare hook:
```json
{
  "scripts": {
    "prepare": "node ../../setup-package-docs.js"
  }
}
```

### LLM Agent Context Assembly
1. Agent assigned to package
2. `npm run prepare` executed in package
3. Documentation symlinks created based on hierarchy
4. Agent receives complete, contextual documentation set
5. Agent implements package using provided specifications

### Documentation Updates
1. Universal changes: Update source file in prompts/
2. Layer changes: Update layer file (development/ or runtime/)
3. Package changes: Update package-specific file
4. Dependency changes: Update needs file in dependent package
5. All inheriting packages see changes immediately

## Alignment with Existing ADRs

- **ADR-0008**: Enables the monorepo architecture with proper agent context
- **ADR-0006**: Supports LLM-friendly development with clear documentation
- **ADR-0009**: Provides testing context inheritance for validation

## More Information

This hierarchical documentation system is the foundation that enables LLM agents to work effectively in the monorepo architecture. Each agent receives exactly the context needed to implement their package correctly while maintaining consistency across the entire system.

The symlink-based approach ensures that documentation updates propagate instantly while maintaining the clear boundaries needed for agent isolation.
