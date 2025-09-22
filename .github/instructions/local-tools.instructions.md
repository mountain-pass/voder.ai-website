---
applyTo: '**'
---

The `timeout` and `gtimeout` commands are not available on macOS. Do not run these commands on macOS.

**GitHub CLI (gh) commands MUST be piped to `cat`** to prevent terminal blocking on macOS. This applies to ALL `gh` commands that produce output.

Examples:

- Use `gh run list --limit 5 | cat` instead of `gh run list --limit 5`
- Use `gh run view <run-id> | cat` instead of `gh run view <run-id>`
- Use `gh pr list | cat` instead of `gh pr list`
- Use `gh workflow list | cat` instead of `gh workflow list`

**Required**: Always append `| cat` to any `gh` command that produces output to prevent interactive pager issues.
