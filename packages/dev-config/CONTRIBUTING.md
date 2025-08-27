# Contributing

Thank you for helping improve @voder/dev-config! Before you begin, please read and follow these guidelines.

## Branch Sync Guidelines

1. Always work off `main`.  
   - Fetch and update:  
     ```bash
     git checkout main
     git pull origin main
     ```

2. Create a new branch for your change:  
   ```bash
   git checkout -b feature/your-description
   ```

3. Keep your branch up to date with `main` as you work:  
   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. Resolve any merge conflicts immediately, then continue your rebase.

## Contribution Workflow

1. Write your code in small, self-contained commits.
2. Add or update tests to cover your changes.
3. Run local checks (see Pre-Push Verification below).
4. Commit your changes with a clear, imperative message:  
   ```bash
   git add .
   git commit -m "feat: add X functionality"
   ```
5. Push your branch:  
   ```bash
   git push origin feature/your-description
   ```

## Pre-Push Verification

Before pushing any commits, you **must** run:

```bash
npm run verify
```

This will perform:
- `npm audit fix --force`
- `npm run lint:check` and `npm run lint:fix`
- `npm run lint:md:fix`
- `npm run format`
- `npm run build`
- `npm run test:ci`

Ensure every step completes without errors or warnings. Only push when your branch is green.

## Questions or Issues

If you encounter any problems with the process above, please open an issue describing the steps you took and the errors you encountered.
