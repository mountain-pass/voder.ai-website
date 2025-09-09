---
status: accepted
date: 2025-08-28
decision-makers: Tom Howard
---

# Don't use .editorconfig for formatting

## Context and Problem Statement

The dev-config package provides comprehensive formatting and linting configurations through Prettier and ESLint. The question arose whether to also include `.editorconfig` generation utilities to provide additional editor-level formatting configuration. While `.editorconfig` files can provide consistent editor behavior across teams, they overlap significantly with Prettier's functionality and can create conflicts in modern development workflows.

## Decision Drivers

- Risk of configuration conflicts between `.editorconfig` and Prettier settings
- Redundancy with Prettier IDE plugin workflows
- Maintenance overhead of keeping multiple configuration systems in sync
- Modern IDE tooling already provides superior formatting through language server protocols
- Package philosophy of providing focused, non-overlapping tool configurations

## Considered Options

- Include `.editorconfig` generation utilities in the dev-config package
- Provide `.editorconfig` as an optional export alongside Prettier configurations
- Don't provide `.editorconfig` utilities and rely on Prettier + IDE plugins

## Decision Outcome

Chosen option: "Don't provide `.editorconfig` utilities and rely on Prettier + IDE plugins", because it eliminates potential conflicts, reduces configuration complexity, and aligns with modern development workflows where IDE plugins handle formatting automatically.

### Consequences

- Good, because it eliminates risk of conflicts between `.editorconfig` and Prettier settings
- Good, because it reduces configuration surface area and maintenance overhead
- Good, because it encourages adoption of modern IDE tooling (Prettier plugins, ESLint plugins)
- Good, because it keeps the package focused on essential, non-overlapping configurations
- Bad, because developers without IDE plugins may lack basic editor consistency
- Bad, because some legacy editors or specific workflows might benefit from `.editorconfig` fallbacks

## Implementation Notes

The dev-config package will focus exclusively on Prettier, ESLint, TypeScript, and Vitest configurations. Teams requiring `.editorconfig` files should create them manually using standard `.editorconfig` syntax, ensuring they don't conflict with the provided Prettier settings (particularly `endOfLine`, `printWidth`, and indentation rules).
