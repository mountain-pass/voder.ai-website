# Last Action Executed

**Timestamp:** 2025-08-21T09:10:27.994Z

## Plan

```
Restore tracked .voder paths to their HEAD state (idempotent). Run this single POSIX command from the project root:

```bash
paths="$(git ls-files -z .voder/ packages/ui-tools/.voder/ 2>/dev/null | tr '\0' '\n' || true)"; if [ -n "$paths" ]; then git restore --source=HEAD -- $paths || true; else echo "No .voder paths known to git to restore"; fi
```
```

## Action

**Type:** run_command

**Parameters:**
```json
{
  "command": "bash",
  "parameters": [
    "-lc",
    "paths=\"$(git ls-files -z .voder/ packages/ui-tools/.voder/ 2>/dev/null | tr '\\0' '\\n' || true)\"; if [ -n \"$paths\" ]; then git restore --source=HEAD -- $paths || true; else echo \"No .voder paths known to git to restore\"; fi"
  ],
  "timeout": 60000
}
```

## Handler Response

```
`bash -lc paths="$(git ls-files -z .voder/ packages/ui-tools/.voder/ 2>/dev/null | tr '\0' '\n' || true)"; if [ -n "$paths" ]; then git restore --source=HEAD -- $paths || true; else echo "No .voder paths known to git to restore"; fi` completed.
Output:

```
