## Vulnerability Audit

Run:

```bash
npm run audit:ci
```

This will fail on any high-severity issues.

## Safe Subprocess Calls

Prefer Node’s `spawnSync(['cmd', 'arg'], { shell: false })` rather than `execSync('cmd arg')` to avoid shell-injection risk.

## Audit Fix Policy

Do **not** use `npm audit fix --force` in automation; forcing fixes can introduce breaking upgrades.
