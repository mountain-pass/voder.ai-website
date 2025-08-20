# Markdown Linting with markdownlint-cli2

This guide shows how to generate and run the shared Markdown lint configuration provided by `@voder/dev-config`.

## Generate `.markdownlint.json`

Before running linting, generate the config file in your project root:

```bash
npm run generate:md-config
```

This will create or update `.markdownlint.json` using the rules from `@voder/dev-config/linters/markdown`.

## Linting Commands

Once `.markdownlint.json` is in place, run:

```bash
markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md
```

to check for violations, and:

```bash
markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md
```

to automatically fix fixable issues.

Both commands use the shared rule set:

- Heading levels and order (MD001)
- Code fences must specify a language (MD040)
- No raw HTML (MD033)
- Line-length rule disabled (MD013)
- No relative links in public READMEs (MD034 placeholder)
