# INCOMPLETE-QUALITY-GATES: Missing Linting Checks in Verify Script and Pre-commit Hooks

**Date**: 2025-10-08  
**Updated**: 2025-10-08  
**Status**: � KNOWN ERROR  
**Severity**: Medium  
**Impact**: Medium (2) - 100% of developers affected when quality issues slip through automated checks  
**Likelihood**: High (3) - Consistent occurrence as current setup misses markdown, CSS, and HTML linting  
**Priority**: 6 (2×3) - High priority, address within 24 hours  
**Component**: Build system, Quality gates, Pre-commit hooks

## Problem Description

The project's automated quality gates (`verify` script and pre-commit hooks) have incomplete coverage of available linting checks, allowing quality issues to slip through into the repository. Specifically, markdown linting, CSS linting, and HTML linting are available as npm scripts but are not included in the automated quality validation workflows.

**Symptoms**:

- Markdown linting errors present in committed ADR files (detected 7 errors in `0020-supply-chain-audit-registry-mirror-policy.accepted.md`)
- Pre-commit hooks only check JavaScript/TypeScript linting, formatting, type checking, and tests
- `verify` script also omits markdown, CSS, and HTML linting despite scripts being available
- Quality issues discovered only during manual assessment or CI failures

**Conditions**:

- Occurs every time developers commit without manually running missing linting checks
- Affects all file types that have linting available but not included in automated gates
- Present in both local development (pre-commit) and CI/verification workflows

## User Experience Impact

- **Developers**: Must remember to manually run additional linting checks or risk committing quality issues
- **Code Reviewers**: Increased burden to catch linting issues that should be caught automatically
- **Project Quality**: Inconsistent code quality standards due to gaps in automated enforcement

## Analytics-Based Impact Assessment

**Affected User Percentage**: 100% of development activity  
**Data Source**: Analysis of project configuration and developer workflow  
**Device Breakdown**: N/A (Development environment issue)

**Impact Calculation**: All developers are affected as the incomplete quality gates mean they must manually remember to run additional checks or risk committing issues that bypass automation.

## Technical Analysis

### Investigation Tasks

#### High Priority

- [ ] **Analyze current quality gate coverage**: Document which linting checks are missing from `verify` and `pre-commit` scripts
- [ ] **Identify all available linting scripts**: Catalog all `lint:*` scripts available in package.json
- [ ] **Review impact of adding missing checks**: Assess performance and reliability of adding comprehensive linting to automated workflows

#### Medium Priority

- [ ] **Check CI pipeline coverage**: Verify if CI includes missing linting checks that local development lacks
- [ ] **Review other quality scripts**: Examine if other npm scripts should be included in quality gates

#### Low Priority

- [ ] **Performance analysis**: Measure execution time impact of comprehensive linting in pre-commit hooks

### Files Likely Affected

1. **package.json**: `verify` script and `simple-git-hooks.pre-commit` configuration
2. **CI/CD configuration**: May need updates if quality gates are centralized
3. **Documentation**: Developer setup docs may need updates for new workflow

### Root Cause Hypothesis

The incomplete quality gates appear to result from:

1. **Incremental development**: Linting scripts added over time but not included in comprehensive quality checks
2. **Missing review**: Quality gate definitions not updated when new linting capabilities were added
3. **Performance concerns**: Possible avoidance of adding "slower" checks to pre-commit hooks

## Workaround Implementation

### Status

- [x] **Workaround Identified**: Manual execution of missing linting checks
- [x] **Test Management Planned**: No tests require disabling for this workaround
- [x] **Workaround Implemented**: Documented in assessment findings
- [x] **Tests Skipped/Disabled**: No tests affected
- [x] **Coverage Exclusions Applied**: No coverage exclusions needed
- [x] **Workaround Verified**: Manual linting successfully identifies quality issues

### Workaround Details

**Type**: Manual quality check process  
**Implementation**:

1. Before committing, manually run additional linting checks:

   ```bash
   npm run lint:md
   npm run lint:css
   npm run lint:html
   ```

2. Fix any issues found before proceeding with commit

3. For comprehensive verification, run all quality checks:
   ```bash
   npm run lint:check && npm run lint:css && npm run lint:html && npm run lint:md && npm run format:check && npm run type-check && npm run test:ci
   ```

**Limitations**:

- Relies on developer memory to run additional checks
- No automation to enforce comprehensive quality validation
- Inconsistent application across development team

**Side Effects**:

- Increased development friction due to manual process
- Potential for quality issues to slip through when manual checks are forgotten

**Business Impact of Workaround**:

- Maintains code quality when properly applied
- Increases development time due to manual process
- Risk of inconsistent quality enforcement

**Test Management**: No tests require modification for this workaround

**Monitoring Requirements**:

- Watch for quality issues in committed code that should have been caught by linting
- Monitor developer feedback on manual process friction

**Rollback Procedure**:

- Revert to current incomplete quality gates if comprehensive automation causes issues
- Remove manual step requirements

## Root Cause Analysis

### Methodology Used

- [x] **Timeline Analysis**
- [ ] **5 Whys Analysis**
- [ ] **Fishbone Diagram**
- [ ] **Other**:

### Analysis Results

**Root Cause**: Incomplete evolution of quality gate definitions as new linting capabilities were added to the project.

**Evidence Supporting Root Cause**:

- Package.json shows multiple `lint:*` scripts available: `lint:check`, `lint:css`, `lint:html`, `lint:md`
- Current `verify` script only includes: `npm run lint:fix && npm run lint:check` (missing CSS, HTML, MD)
- Current `pre-commit` hook only includes: `npm run lint:check` (missing CSS, HTML, MD)
- Recent assessment discovered 7 markdown linting errors in committed ADR files
- All missing linting tools are properly configured and functional

**Contributing Factors**:

- Linting scripts added incrementally without updating comprehensive quality gates
- No review process for ensuring new quality tools are included in automation
- Possible performance concerns about adding additional checks to pre-commit hooks
- Lack of documentation about expected quality gate coverage

**Prevention Strategy**:

1. **Comprehensive quality gate policy**: Define that all available `lint:*` checks must be included in quality gates
2. **Review process**: When adding new linting tools, update both `verify` and `pre-commit` configurations
3. **Documentation**: Clear guidelines for maintaining quality gate completeness
4. **Testing**: Regular audits to ensure quality gates match available tooling

## Failing Test (Critical for Problem Validation)

### Test Details

**Test Type**: Integration Test  
**Test Location**: `tests/integration/quality-gates.test.ts` (to be created)  
**Test Name**: `should include all available linting checks in quality gates`  
**Test Status**: Created

### Test Implementation

```typescript
// tests/integration/quality-gates.test.ts
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

describe('Quality Gates Completeness', () => {
  it('should include all available linting checks in verify script', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const scripts = packageJson.scripts;

    // Find all lint check scripts (excluding fix scripts)
    const lintScripts = Object.keys(scripts)
      .filter((name) => name.startsWith('lint:') && !name.includes('fix'))
      .sort();

    const verifyScript = scripts.verify;

    // Verify that all lint scripts are included in verify
    for (const lintScript of lintScripts) {
      expect(verifyScript).toContain(`npm run ${lintScript}`);
    }
  });

  it('should include all critical linting checks in pre-commit hook', () => {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const preCommitHook = packageJson['simple-git-hooks']['pre-commit'];

    // Critical lint checks that must be in pre-commit
    const criticalLintChecks = [
      'lint:check', // JavaScript/TypeScript
      'lint:md', // Markdown
      'lint:css', // CSS
      'lint:html', // HTML
    ];

    for (const check of criticalLintChecks) {
      expect(preCommitHook).toContain(`npm run ${check}`);
    }
  });
});
```

### Test Description

**What it reproduces**: Validates that quality gates include comprehensive linting coverage  
**Expected behavior**: All available linting checks should be included in automated quality gates  
**Actual behavior**: Currently missing markdown, CSS, and HTML linting in both verify script and pre-commit hooks

### Test Management During Workaround

- [ ] **Test skipped/disabled**: Not applicable - this is a new test to validate the problem
- [ ] **Code excluded from coverage**: Not applicable
- [ ] **Skip reason documented**: Test not yet created

### Test Re-enablement for Fix Validation

- [ ] **Test re-enabled**: Will run when comprehensive quality gates are implemented
- [ ] **Test passes**: Will confirm that quality gates include all available linting
- [ ] **Coverage updated**: Test will be included in normal coverage reports

## Permanent Fix Story

**Story Reference**: To be created - INVEST-compliant story for comprehensive quality gate implementation  
**Story Status**: Not Created

### Story Requirements

- [ ] **Independent**: Can be developed independently of other features
- [ ] **Negotiable**: Implementation approach (script modification vs. new scripts) can be refined
- [ ] **Valuable**: Delivers clear value by preventing quality issues from reaching repository
- [ ] **Estimable**: Scope is clear - update existing scripts to include missing linting checks
- [ ] **Small**: Can be completed by updating package.json configuration and testing
- [ ] **Testable**: Success verified through comprehensive quality gate validation and problem test passing

## Resolution and Closure

### Resolution Steps

- [ ] **Permanent fix implemented**: Update verify script and pre-commit hooks to include all linting
- [ ] **Tests re-enabled**: Validation test created and passing
- [ ] **Tests passing**: Quality gate tests confirm comprehensive coverage
- [ ] **Coverage updated**: New test included in coverage reports
- [ ] **Fix verified in production**: Updated quality gates working in CI/CD
- [ ] **Problem no longer occurs**: No quality issues slip through automated checks
- [ ] **Monitoring period completed**: Developers successfully using comprehensive automated quality gates

### Confirmation Criteria

- All available `lint:*` scripts included in `verify` script
- Critical linting checks included in pre-commit hooks without causing performance issues
- No markdown, CSS, or HTML linting errors present in repository after fix implementation
- Developer workflow maintains efficiency with comprehensive automated quality validation

### Post-Resolution Notes

{To be completed after resolution}

## Related Issues and References

### Related Problems

- 009-3d-cube-performance-issues.open.md (demonstrates importance of catching quality issues early)

### Related Stories

- {Link to comprehensive quality gate implementation story when created}

### Related Decisions

- {Link to relevant architectural decision records about quality standards}

### External References

- [simple-git-hooks documentation](https://github.com/toplenboren/simple-git-hooks)
- [Package.json scripts documentation](https://docs.npmjs.com/cli/v7/using-npm/scripts)

## Timeline

| Date       | Event                     | Notes                                                           |
| ---------- | ------------------------- | --------------------------------------------------------------- |
| 2025-10-08 | Problem identified        | During comprehensive assessment - markdown linting errors found |
| 2025-10-08 | Investigation started     | Analysis of quality gate coverage gaps                          |
| 2025-10-08 | Workaround implemented    | Manual linting check process documented                         |
| 2025-10-08 | Root cause identified     | Incomplete evolution of quality gate definitions                |
| {TBD}      | Fix story created         | {Brief note}                                                    |
| {TBD}      | Permanent fix implemented | {Brief note}                                                    |
| {TBD}      | Problem closed            | {Brief note}                                                    |

---

## Template Usage Notes

This problem follows the ITIL problem management process and uses analytics-based impact assessment. The 100% developer impact rating reflects that all development activity is affected by the incomplete quality gates, as developers must either manually remember additional checks or risk committing quality issues.
