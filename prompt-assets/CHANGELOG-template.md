# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- [New features, functionality, or capabilities]

### Changed
- [Changes in existing functionality]

### Deprecated
- [Soon-to-be removed features]

### Removed
- [Now removed features]

### Fixed
- [Bug fixes]

### Security
- [Vulnerability fixes]

---

## [1.0.0] - YYYY-MM-DD

### Added
- Initial release
- [Core feature 1]: [Brief description]
- [Core feature 2]: [Brief description]
- [Core feature 3]: [Brief description]

### Documentation
- Comprehensive README with usage examples
- API reference documentation
- Migration guides for common use cases

### Developer Experience
- TypeScript support with full type definitions
- ESM module format for optimal tree shaking
- Comprehensive test suite with 90%+ coverage

---

## Template Guidelines

### Version Format
- Use [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH)
- **MAJOR**: Breaking changes that require consumer updates
- **MINOR**: New features that are backward compatible
- **PATCH**: Bug fixes and internal improvements

### Change Categories
Use these categories in order when present:

1. **Added**: New features, exports, or functionality
2. **Changed**: Changes in existing functionality (non-breaking)
3. **Deprecated**: Features marked for removal (with timeline)
4. **Removed**: Features removed in this release
5. **Fixed**: Bug fixes and error corrections
6. **Security**: Vulnerability patches and security improvements

### Entry Format
- Use present tense ("Add feature" not "Added feature")
- Include the scope when helpful ("ESLint: Add TypeScript support")
- Link to issues/PRs when relevant
- Be specific about breaking changes

### Breaking Changes
For major versions, clearly document:
- What changed and why
- Migration steps with before/after examples
- Timeline for deprecated feature removal
- Links to migration guides

### Examples

**Good entries:**
```markdown
### Added
- New `createVitestNodeConfig()` function for server-side testing
- TypeScript configuration export at `/typescript`
- Support for ESLint flat config v9

### Changed
- ESLint configuration now uses flat config format instead of legacy .eslintrc
- Prettier configuration moved from JSON to TypeScript format
- Minimum Node.js version requirement increased to 18.0.0

### Deprecated
- Legacy ESLint configuration format (remove in v2.0.0)
- CommonJS exports (ESM-only in v2.0.0)

### Fixed
- ESLint parser configuration for TypeScript projects
- Missing peer dependency declarations
- Export path resolution in package.json
```

**Avoid vague entries:**
```markdown
### Changed
- Updated dependencies
- Fixed bugs
- Improved performance
```

### Release Notes Integration
- Each release should have clear, actionable information
- Include upgrade/migration guidance for breaking changes
- Reference relevant documentation sections
- Highlight security fixes prominently

### Consumer Focus
Write entries from the consumer perspective:
- Focus on what changed for package users
- Include configuration examples for breaking changes
- Mention new capabilities and how to use them
- Note any new requirements or dependencies
