---
## NOW

Start the production preview server on port 4173 by running:
```
npm run preview -- --port=4173
```

## NEXT

- In a new terminal, execute the end-to-end smoke tests:  
  ```
  npm run test:e2e
  ```
- If any assertion (especially the `<h1>` text) fails, update `src/main.js` (or the test in `tests/smoke.spec.js`) to restore alignment, then rebuild and re-preview.

## LATER

- Set up an automated CI/CD pipeline to build, test, and deploy on each push  
- Conduct an accessibility audit (ARIA roles, keyboard navigation, color-contrast)  
- Optimize SEO and performance (critical CSS, preloads, structured data)  
- Plan lightweight analytics and error-tracking integrations