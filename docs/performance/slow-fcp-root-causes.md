# Slow FCP Root Causes

This document summarizes the top metrics from `lhci-report.json` contributing to a First Contentful Paint (FCP) that exceeds performance budgets.

## 1. first-contentful-paint

- Audit Key: `first-contentful-paint`
- Measured Value: 1660 ms (expected ≤ 1500 ms)
- Resource Scope: All render-blocking CSS and JavaScript loaded on initial page load
- Note: The global stylesheet (`/src/style.css`) is loaded synchronously, blocking first paint and delaying interactivity.
- Why It Slows FCP: Large or render-blocking assets postpone the browser’s first meaningful paint by delaying style calculations and script execution.

## 2. interactive

- Audit Key: `interactive`
- Measured Value: 2989 ms (expected ≤ 2500 ms)
- Resource Scope: Main-thread tasks triggered by initial JavaScript bundles
- Note: The main JS bundle (including the initial GSAP and Three.js imports) is oversized, blocking parsing and execution before first paint.
- Why It Slows FCP: Heavy script execution and long tasks block the main thread, delaying both interactivity and the browser’s ability to render content promptly.

<!-- Consider investigating splitting or deferring critical CSS/JS, minimizing bundle sizes, and optimizing server response times to improve FCP. -->
