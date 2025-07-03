## NOW

Edit `README.md` and under the “## Build & Preview” heading remove the two-step build/preview instructions and replace them with a single line:

```
## Build & Preview

Run `npm run test:ci` to build the site, start a preview server, and execute end-to-end tests in one command.
```

## NEXT

- In your terminal, run `npm run test:ci` from the project root and verify that:
  - The production build is generated without errors.
  - The preview server starts on port 4173.
  - Playwright smoke tests pass against the preview.
- If any step fails, inspect the error output and fix code or configuration as needed.

## LATER

- Add automated Lighthouse performance and accessibility audits into the GitHub Actions CI workflow.
- Expand Playwright coverage to additional browsers, devices, and viewports.
- Integrate bundle-size tracking and performance-regression alerts into CI.