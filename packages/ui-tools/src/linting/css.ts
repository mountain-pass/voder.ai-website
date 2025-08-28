export function createCSSLintConfig(options = {}) {
    const { excludeRules = [], rules = {} } = options;

    return {
        extends: [
            'stylelint-config-standard',
            'stylelint-config-css-modules'
        ],
        plugins: [
            'stylelint-order'
        ],
        rules: {
            // Property ordering
            'order/properties-alphabetical-order': true,
            // CSS best practices
            'color-hex-length': 'short',
            'color-no-invalid-hex': true,
            'declaration-block-no-duplicate-properties': true,
            'declaration-block-trailing-semicolon': 'always',
            'indentation': 2,
            'max-empty-lines': 2,
            'no-duplicate-selectors': true,
            'no-extra-semicolons': true,
            // Disable any rules passed in excludeRules
            ...excludeRules.reduce((acc, rule) => {
                acc[rule] = null;

                return acc;
            }, {}),
            // Apply any overrides
            ...rules
        }
    };
}
