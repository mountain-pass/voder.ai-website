---
status: 'accepted'
date: 2025-08-06
decision-makers: voder.ai website team
consulted: LLM-assisted development stakeholders
informed: development team, project stakeholders
---

# ADR 0008: Adopt Monorepo Package Architecture for LLM Agent Development

## Context and Problem Statement

Following ADR-0006's migration to Vanilla TypeScript for LLM compatibility, we need to establish an architecture that enables **LLM agents as developers** for parallel package development. The current monolithic structure doesn't support:

- Independent LLM agents working on isolated components
- Clear dependency contracts between system components  
- Hierarchical documentation inheritance for agent context
- Parallel development without conflicts
- Package-level testing and deployment

We need an architecture optimized for AI-driven development workflows.

## Decision Drivers

- **LLM Agent Isolation**: Each agent needs clear boundaries and dependencies
- **Documentation-Driven Development**: Implementation follows specifications, not legacy code
- **Parallel Development**: Multiple agents working simultaneously without conflicts
- **Interface Contracts**: Explicit dependencies prevent implementation coupling
- **Scalable Testing**: Package-level testing with clear success criteria
- **Hierarchical Context**: Universal → Layer → Package documentation inheritance

## Considered Options

- **Monolithic Structure** (status quo): Single large codebase
- **Lerna Monorepo**: Traditional JavaScript monorepo tooling
- **npm Workspaces Monorepo**: Native npm workspace management
- **Nx Monorepo**: Enterprise monorepo with build optimization

## Decision Outcome

Chosen option: **"npm Workspaces Monorepo"**, because it provides native package isolation, simple dependency management, and integrates seamlessly with the existing npm ecosystem without additional tooling complexity.

### Architecture Overview

```
packages/
├── shared/           # @voder/shared - Interfaces and types
├── services/         # @voder/services - Business logic services  
├── core/             # @voder/core - Application orchestration
├── sections/         # Section components (brand-entry, why, etc.)
├── effects/          # Effect components (3d, animations, etc.)
├── navigation/       # Navigation component
├── tsconfig/         # @voder/tsconfig - Shared TypeScript configs
├── eslint-config/    # @voder/eslint-config - Shared linting rules
├── build-tools/      # @voder/build-tools - Package build utilities
└── dev-tools/        # @voder/dev-tools - Development utilities

apps/
└── voder-website/    # Main Vite application
```

### Documentation Inheritance System

```
prompts/                           # Universal documentation
├── core.md                       # Architecture principles (all packages)
├── testing.md                    # Testing standards (all packages)
├── security-and-privacy.md      # Security guidelines (all packages)
├── development/                  # Development layer (dev packages only)
│   ├── development.md
│   └── package-name/
└── runtime/                      # Runtime layer (runtime packages only)
    ├── runtime.md
    ├── sections/                 # Section sublayer
    ├── effects/                  # Effect sublayer
    └── package-name/
```

### Consequences

**Positive:**
- **True Package Isolation**: Each LLM agent owns complete package implementation
- **Interface-Driven Development**: Dependencies through contracts, not implementations
- **Hierarchical Documentation**: Agents get exactly the context they need
- **Parallel Development**: No cross-package conflicts or shared state
- **Clear Testing Boundaries**: Package-level success criteria
- **Scalable Architecture**: Easy to add packages and agents

**Negative:**
- **Setup Complexity**: More package.json files and build configurations
- **Coordination Overhead**: Interface changes require cross-package updates
- **Documentation Maintenance**: Hierarchical docs need consistent updates

### Confirmation

- ✅ Each package has independent build, test, and deploy capabilities
- ✅ Documentation inheritance system works via symlinks
- ✅ LLM agents can implement packages using only linked documentation
- ✅ Prepare hooks create proper documentation context automatically
- ✅ No package depends on another package's implementation details

## Implementation Details

### Package Structure Standard
Every package follows identical structure:
```
packages/package-name/
├── package.json              # Dependencies, scripts, metadata
├── src/
│   ├── index.ts             # Public API exports only  
│   ├── PackageName.ts       # Main implementation
│   ├── types.ts             # Internal types
│   └── PackageName.test.ts  # Comprehensive tests
├── rollup.config.ts         # Build configuration (packages)
└── prompts/                 # Symlinked documentation (auto-generated)
```

### Dependency Flow
```
@voder/shared (types & interfaces)
    ↓
@voder/services (business logic)
    ↓  
@voder/core (orchestration)
    ↓
@voder/components (sections & effects)
    ↓
voder-website (application)
```

### Development Workflow
1. **Universal Documentation**: Create shared principles and standards
2. **Layer Documentation**: Development vs runtime guidelines  
3. **Package Implementation**: LLM agents implement isolated packages
4. **Integration Testing**: Validate package contracts and interfaces
5. **Application Assembly**: Main app composes packages

## Alignment with Existing ADRs

- **ADR-0001 (Vite)**: Apps use Vite, packages use Rollup for library builds
- **ADR-0002 (Playwright)**: E2E testing at application level
- **ADR-0004 (ESLint/Prettier)**: Shared via @voder/eslint-config package
- **ADR-0006 (Vanilla TypeScript)**: All packages use vanilla TypeScript
- **ADR-0007 (CSS Inlining)**: Build optimization handled in @voder/build-tools

## More Information

This architecture enables the next phase of development where LLM agents implement individual packages using documentation-driven specifications. Each agent receives precisely the context needed through the hierarchical documentation system, ensuring consistent implementation without cross-package conflicts.

The package boundaries enforce the interface-driven architecture established in core.md, while the documentation inheritance system provides the context management needed for effective LLM agent development.
