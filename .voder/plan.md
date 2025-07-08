## NOW
Copy the placeholder 3D model into the public assets directory:
  ```
  cp assets/mockups/cube.glb public/assets/cube.glb
  ```

## NEXT
- Open `docs/placeholders.md` and update its entry to:
  ```
  - public/assets/cube.glb → Placeholder 3D model for BrandEntry
  ```
- Run the full production build and CI checks:
  ```
  npm run build
  npm run test:ci
  ```

## LATER
- Refine GSAP scroll-trigger animation timings, easing curves, and add pause/skip controls for users with `prefers-reduced-motion`.  
- Enhance responsive layouts, keyboard navigation, and focus management to fully satisfy WCAG 2.1 AA/AAA.  
- When the final production GLB arrives, update the loader path in `src/lib/animations.ts` and record the new filename in `docs/placeholders.md`.