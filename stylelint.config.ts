export interface CSSLintOptions {
  excludeRules?: string[];
  rules?: Record<string, any>;
}

function createCSSLintConfig(options: CSSLintOptions = {}) {
  const { excludeRules = [], rules = {} } = options;

  return {
    extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
    plugins: ['stylelint-order'],
    rules: {
      // Property ordering
      'order/properties-alphabetical-order': true,
      // CSS best practices
      'color-hex-length': 'short',
      'color-no-invalid-hex': true,
      'declaration-block-no-duplicate-properties': true,
      // Note: Removed deprecated rules:
      // - 'declaration-block-trailing-semicolon': 'always' (deprecated)
      // - 'indentation': 2 (deprecated)
      // - 'max-empty-lines': 2 (deprecated)
      // - 'no-extra-semicolons': true (deprecated)
      'no-duplicate-selectors': true,
      // Disable any rules passed in excludeRules
      ...excludeRules.reduce((acc: Record<string, any>, rule: string) => {
        acc[rule] = null;

        return acc;
      }, {}),
      // Apply any overrides
      ...rules,
    },
  };
}

export default createCSSLintConfig();
