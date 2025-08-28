export function createAccessibilityLintConfig(options = {}) {
    const { excludeRules = [], rules = {} } = options;

    return {
        plugins: ['stylelint-a11y'],
        rules: {
            // Core accessibility rules
            'a11y/content-property-no-static-value': true,
            'a11y/font-size-is-readable': true,
            'a11y/line-height-is-vertical-rhythmed': true,
            'a11y/no-outline-none': true,
            'a11y/selector-pseudo-class-focus': true,
            // Disable any excluded rules
            ...excludeRules.reduce((acc, rule) => {
                acc[rule] = null;

                return acc;
            }, {}),
            // Apply any overrides
            ...rules
        }
    };
}
