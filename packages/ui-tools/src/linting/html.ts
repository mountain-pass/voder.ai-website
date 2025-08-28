import { disableRules } from '../utils/disableRules.js';
export function createHTMLLintConfig(options = {}) {
    const { excludeRules = [], rules = {} } = options;

    const baseConfig = {
        extends: ['htmlhint:recommended'],
        rules: {
            'title-require': true,
            'alt-require': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': true,
            'doctype-first': true,
            'tag-pair': true,
            'spec-char-escape': true,
            'id-unique': true,
            'src-not-empty': true,
            'attr-no-duplication': true,
            'space-tab-mixed-disabled': 'tab',
            ...rules
        }
    };

    return disableRules(baseConfig, excludeRules);
}
