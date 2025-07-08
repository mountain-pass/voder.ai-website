# Migration from SvelteKit to Vite + Vanilla TypeScript

## Why This Choice?
- Zero learning curve for developers
- Keep all existing GSAP/Three.js code
- Modern tooling with familiar JavaScript/TypeScript
- Easy team onboarding

## Project Setup Steps

### 1. Initialize New Vite Project

```bash
# Create new Vite project with TypeScript
npm create vite@latest voder-website-vite -- --template vanilla-ts
cd voder-website-vite
npm install
```

### 2. Project Structure

```
voder-website-vite/
├── index.html              # Main HTML file
├── src/
│   ├── main.ts             # Entry point
│   ├── style.css           # Global styles
│   ├── components/         # Reusable components
│   │   ├── HeroSection.ts
│   │   ├── WhySection.ts
│   │   └── ...
│   ├── lib/
│   │   ├── animations.ts   # GSAP animations
│   │   ├── three-demos.ts  # Three.js code
│   │   └── utils.ts
│   └── assets/            # Images, fonts, etc.
├── public/                # Static files (served as-is)
│   ├── favicon.ico
│   ├── fonts/
│   └── assets/
└── dist/                  # Build output
```

### 3. Essential Dependencies

```bash
# Core dependencies (keep your existing ones)
npm install gsap three @types/three

# Development dependencies
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint
npm install -D @axe-core/playwright playwright
```

### 4. Component Architecture

Instead of Svelte components, create TypeScript classes or functions:

```typescript
// src/components/HeroSection.ts
export class HeroSection {
  private element: HTMLElement;
  
  constructor(container: HTMLElement) {
    this.element = this.createElement();
    container.appendChild(this.element);
    this.initAnimations();
  }
  
  private createElement(): HTMLElement {
    const section = document.createElement('section');
    section.className = 'hero-section';
    section.innerHTML = `
      <div class="hero-content">
        <h1>Your AI-Powered Development Partner</h1>
        <p>Transform your development workflow with intelligent automation</p>
      </div>
    `;
    return section;
  }
  
  private initAnimations(): void {
    // Your existing GSAP code here
    gsap.from(this.element.querySelector('h1'), {
      duration: 1,
      y: 50,
      opacity: 0
    });
  }
}
```

### 5. Main Application Setup

```typescript
// src/main.ts
import './style.css';
import { HeroSection } from './components/HeroSection';
import { WhySection } from './components/WhySection';
import { initScrollAnimations } from './lib/animations';

class App {
  constructor() {
    this.init();
  }
  
  private init(): void {
    const app = document.querySelector<HTMLDivElement>('#app')!;
    
    // Initialize components
    new HeroSection(app);
    new WhySection(app);
    
    // Initialize global animations
    initScrollAnimations();
  }
}

// Start the application
new App();
```

### 6. Migration Strategy

**Phase 1: Setup & Structure**
1. Create new Vite project
2. Copy over static assets (fonts, images)
3. Set up TypeScript configuration
4. Migrate global styles

**Phase 2: Component Migration**
1. Convert one Svelte component at a time
2. Keep the same HTML structure
3. Convert Svelte reactivity to vanilla JS/DOM manipulation
4. Test each component individually

**Phase 3: Integration**
1. Wire up all components in main.ts
2. Migrate routing (if needed)
3. Set up build process
4. Configure deployment

### 7. Development Commands

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,js --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write .",
    "test": "playwright test"
  }
}
```

### 8. Benefits for Your Team

- **Familiar**: Pure JavaScript/TypeScript - no new syntax
- **Flexible**: Can add any framework later if needed
- **Fast**: Vite's dev server is extremely fast
- **Maintainable**: Clear, understandable code structure
- **Testable**: Easy to unit test individual components

### 9. Keeping Your Existing Assets

- Copy `static/fonts/` to `public/fonts/`
- Move CSS from Svelte components to regular CSS files
- Keep all GSAP and Three.js code exactly as-is
- Maintain your existing accessibility implementations

## Next Steps

Would you like me to help you:
1. Set up the initial Vite project?
2. Convert your first Svelte component?
3. Set up the build and deployment pipeline?
