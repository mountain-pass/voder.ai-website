---
status: 'accepted'
date: 2025-08-21
decision-makers: [Tom Howard, GitHub Copilot]
consulted: []
informed: [Development Team]
---

# PostCSS + Autoprefixer for UI Tools CSS Preprocessing

## Context and Problem Statement

The `@voder/ui-tools` package needs to provide CSS preprocessing capabilities as part of its Vite library build configuration. The CSS preprocessing solution should be easy to test, LLM-friendly for future maintenance, and provide real value for UI component library development without unnecessary complexity.

## Decision Drivers

- **Testability**: Simple, predictable transformations that are easy to verify
- **LLM-friendliness**: Clear APIs, well-documented, extensive examples in training data
- **Maintenance overhead**: Minimal configuration surface area and dependency chains
- **Real value**: Must provide tangible benefits for cross-browser compatibility
- **ESM-first**: Must work well with modern ESM-only build tooling
- **Library focus**: Optimized for component library builds, not application builds

## Considered Options

- PostCSS + Autoprefixer (minimal, cross-browser focused)
- PostCSS + Tailwind CSS (utility-first framework)
- SCSS (traditional preprocessing with variables and mixins)

## Decision Outcome

Chosen option: "PostCSS + Autoprefixer", because it provides the best balance of simplicity, testability, and LLM-friendliness while delivering real cross-browser compatibility value with minimal complexity.

### Consequences

- Good, because transformations are predictable and easy to test (input CSS + expected vendor prefixes)
- Good, because PostCSS has extensive documentation and examples in LLM training data
- Good, because autoprefixer provides immediate, tangible value for cross-browser compatibility
- Good, because minimal configuration reduces maintenance overhead and potential issues
- Good, because works seamlessly with Vite's built-in CSS handling
- Bad, because doesn't provide advanced features like variables, mixins, or utility classes out of the box
- Neutral, because consumers can still add additional PostCSS plugins if needed

### Confirmation

Implementation compliance will be confirmed through:

- Unit tests verifying CSS transformations produce expected vendor prefixes
- Integration tests ensuring Vite builds process CSS correctly
- Documentation examples showing configuration and usage patterns
- Code review to ensure PostCSS configuration follows best practices

## Pros and Cons of the Options

### PostCSS + Autoprefixer

Minimal CSS processing focused on cross-browser compatibility through automatic vendor prefixing.

- Good, because simple input/output transformations are easy to test
- Good, because PostCSS has well-documented APIs and patterns
- Good, because autoprefixer provides immediate cross-browser value
- Good, because minimal configuration reduces complexity
- Good, because extensible - consumers can add more PostCSS plugins
- Good, because works seamlessly with Vite's CSS processing
- Neutral, because limited to vendor prefixing without additional plugins
- Bad, because doesn't provide variables, mixins, or utility classes

### PostCSS + Tailwind CSS

Utility-first CSS framework with extensive utility classes.

- Good, because provides comprehensive utility class system
- Good, because popular and well-documented
- Good, because good tree-shaking and purging capabilities
- Bad, because complex utility generation is harder to test comprehensively
- Bad, because larger configuration surface area increases complexity
- Bad, because may not be appropriate for all UI component libraries
- Bad, because adds opinionated design system that may conflict with library goals

### SCSS

Traditional CSS preprocessing with variables, mixins, and nested syntax.

- Good, because provides variables, mixins, and functions
- Good, because familiar to many developers
- Good, because mature tooling and ecosystem
- Bad, because more complex syntax and compilation process
- Bad, because variable scoping and import resolution add complexity
- Bad, because requires additional build configuration
- Bad, because less common in modern ESM-focused toolchains

## More Information

This decision establishes PostCSS + Autoprefixer as the foundation CSS preprocessing stack for `@voder/ui-tools`. The implementation should:

1. Provide a sensible default PostCSS configuration with autoprefixer
2. Allow consumers to extend the configuration with additional plugins
3. Include comprehensive tests for the CSS transformation pipeline
4. Document configuration and extension patterns clearly

This decision may be revisited if:

- Testing reveals significant complexity issues
- LLM maintenance becomes problematic
- Consumer feedback indicates need for more advanced CSS features
- New CSS preprocessing tools emerge that better meet our criteria
