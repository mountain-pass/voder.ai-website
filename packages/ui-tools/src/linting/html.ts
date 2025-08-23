export interface HTMLLintOptions {
  /** Rules to exclude */
  excludeRules?: string[];
  /** Additional rule overrides */
  rules?: Record<string, any>;
}

export function createHTMLLintConfig(options: HTMLLintOptions = {}) {
  const { excludeRules = [], rules = {} } = options;

  return {
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
      ...excludeRules.reduce((acc, rule) => {
        acc[rule] = false;

        return acc;
      }, {} as Record<string, boolean>),
      ...rules
    }
  };
}