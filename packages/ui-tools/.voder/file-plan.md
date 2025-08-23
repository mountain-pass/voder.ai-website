## NOW  
Append the following line to `.gitignore`:  
```
.voder/
```

## NEXT  
Add these patterns to `.gitignore` to suppress common build artifacts and debug logs:  
```
# TypeScript incremental build files
*.tsbuildinfo

# npm/Yarn/Pnpm debug logs
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
```

## LATER  
• Introduce a pre-commit hook or CI diff-scanner that rejects additions of large or forbidden file patterns.  
• Document ignore-file conventions in `CONTRIBUTING.md` so contributors know when to update `.gitignore` vs. `.voderignore`.  
• Schedule periodic audits of repository for new large/generated files and update ignore rules accordingly.