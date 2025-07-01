## NOW

Open http://localhost:3000 in your browser and verify that the page loads without console errors, that the subtitle types character-by-character, each section fades in at its configured delay, and the SVG text uses the neon-green accent.

## NEXT

- In `src/index.html`, inside `<head>`, add these meta tags:  
    • `<meta name="description" content="The Compiler for Prompts – version your prompts with code-style rigor.">`  
    • `<meta property="og:title" content="voder.ai — The Compiler for Prompts.">`  
    • `<meta property="og:description" content="We version our code. We version our infrastructure. Now it’s time to version our prompts.">`  
    • `<meta property="og:image" content="/path/to/preview.png">`  
- Run a production build and preview:  
    • `npm run build`  
    • `npm run preview`  
- In your browser or device-emulation, confirm that layout, typography, and animations render correctly on both mobile and desktop.

## LATER

- Introduce lightweight end-to-end smoke tests (e.g., Playwright or Puppeteer) to validate that core content appears and animations trigger.  
- Create `README.md` documenting project overview, setup, and available scripts.  
- Further enhance SEO with favicons and schema.org JSON-LD, and investigate performance optimizations (critical CSS, resource hints).