## NOW
Run the updated Lighthouse CI check to confirm the new budgets pass:
- Execute in your shell (non-interactive):  
  npm run assert:lhci

## NEXT
- If the assertion still fails, adjust critical-CSS inlining:
  - Edit `vite.config.ts` → the `beasties({…})` options (e.g. `inlineThreshold`, `allowRules`) to reduce render-blocking CSS  
  - Rebuild and re-run `npm run assert:lhci`
- Create a Netlify config for hosting:
  - Add a file `netlify.toml` at project root with:
    ```toml
    [build]
      command   = "npm run build"
      publish   = "dist"
    ```
  - (Or alternatively, create `vercel.json` with equivalent build/output settings)

## LATER
- Deploy the site to Netlify (or Vercel) using the new config  
- Verify live performance and accessibility on the production URL  
- Finalize custom domain, monitoring, and rollback procedures