---
applyTo: '**'
---

If you need additiional information, ask questions one at a time, allowing me to respond to each before asking the next. This will help me provide accurate and relevant answers.

When asking questions, please provide context or background information to help me understand your needs better.

When making changes to code or tests, make sure the specification in #file:../../prompts is updated first and relevant decisions
are documented or updated in #file:../../docs/decisions using the MADR 4.0 format as
per #file:../../prompt-assets/adr-template.md

All code changes should conform to #file:../../prompts and #file:../../docs/decisions . When working with dependencies, follow the usage patterns and best practices documented in #file:../../docs/libraries . If you need to make changes to those files, please ask first.

If you are directed to make changes that do not conform #file:../../prompts and #file:../../docs/decisions then seek clarification and update the documentation in line with the response. When using project dependencies, consult #file:../../docs/libraries for proper usage patterns and configuration guidelines.

When making changes, ensure that all relevant tests are updated or added in #file:../../tests to maintain code quality and coverage.

when renaming files, prefer `git mv` to preserve file history.
