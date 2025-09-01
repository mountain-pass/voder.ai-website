## NOW

Fix the export naming inconsistency that is causing the single test failure. Update the main index.ts export to use `createVitestJsdomConfig` instead of `createJsdomConfig` to match the expected API in tests and documentation. This is a simple rename that will immediately resolve the failing test and bring the test suite to 100% pass rate (28/28 tests). The function in `src/testing/vitest-jsdom.ts` should be renamed from `createJsdomConfig` to `createVitestJsdomConfig` and the export in `src/index.ts` updated accordingly. This single change will move the project from 96.4% to 100% test pass rate and resolve the primary functional issue.

## NEXT

- **Fix ESLint Configuration Issues**: Resolve the 2 ESLint parsing errors by updating the TypeScript project configuration to properly handle JavaScript files (`prettier.config.js` and `tests/dist-import.test.js`). Either add these files to an appropriate tsconfig or configure ESLint to handle mixed file types properly.

- **Update Documentation Consistency**: Ensure all documentation (README.md, API reference, examples) uses the correct function name `createVitestJsdomConfig` consistently to match the implementation.

- **Run Full Verification Suite**: Execute `npm run verify` to ensure all quality gates pass (type-check, lint, format, build, and test with coverage).

- **Address Minor Dependency Issues**: Review and clean up any overlapping dev vs peer dependencies to optimize the dependency strategy.

## LATER

- **Enhanced Integration Testing**: Add integration tests that verify the package works correctly when consumed by real UI component libraries, including testing the generated Vite and Vitest configurations in practice.

- **Accessibility Testing Enhancements**: Expand the accessibility testing utilities with more comprehensive examples and additional jest-axe configuration options for different testing scenarios.

- **Performance Testing Utilities**: Consider adding performance testing helpers for UI components, such as rendering time measurement and interaction performance validation.

- **Advanced Configuration Options**: Add more sophisticated configuration merging capabilities for PostCSS plugins and Vite configurations to handle edge cases in consumer projects.

- **Documentation Improvements**: Add troubleshooting guides, advanced usage examples, and migration guides for teams adopting the tooling.

- **CI/CD Integration Examples**: Provide example workflows and configurations for integrating the quality tools into continuous integration pipelines.