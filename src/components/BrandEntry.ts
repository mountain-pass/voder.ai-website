// src/components/BrandEntry.ts
import { BrandEntry3D } from '../lib/BrandEntry3D';

export function BrandEntry(): HTMLElement {
  const section = document.createElement('section');
  section.setAttribute('role', 'banner');
  section.setAttribute('aria-label', 'Voder brand introduction');
  section.setAttribute('data-testid', 'brand-entry-section');
  section.style.position = 'relative';
  section.style.height = '100vh';
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.backgroundColor = '#0A0A0A'; // Voder Black
  section.style.overflow = 'hidden'; // Prevent scroll during sequence

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-testid', 'three-canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1';
  section.appendChild(canvas);

  const liveDiv = document.createElement('div');
  liveDiv.setAttribute('aria-live', 'polite');
  liveDiv.setAttribute('aria-atomic', 'true');
  liveDiv.style.position = 'absolute';
  liveDiv.style.opacity = '0';
  liveDiv.style.pointerEvents = 'none';
  section.appendChild(liveDiv);

  const contentWrapper = document.createElement('div');
  contentWrapper.style.position = 'relative';
  contentWrapper.style.zIndex = '2';
  contentWrapper.style.textAlign = 'center';
  contentWrapper.style.color = '#FFFFFF';

  const title = document.createElement('h1');
  title.setAttribute('data-testid', 'brand-entry-logo');
  title.textContent = 'Voder'; // Start with text to avoid accessibility violations
  title.style.fontSize = '4rem';
  title.style.fontWeight = '600';
  title.style.margin = '0 0 1rem 0';
  title.style.color = '#FFFFFF';
  title.style.opacity = '0';
  title.style.fontFamily = 'Inter, Satoshi, "Neue Haas Grotesk", -apple-system, BlinkMacSystemFont, sans-serif';
  contentWrapper.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.setAttribute('data-testid', 'brand-tagline');
  subtitle.textContent = 'The Compiler for Prompts';
  subtitle.style.fontSize = '1.5rem';
  subtitle.style.margin = '0';
  subtitle.style.opacity = '0';
  subtitle.style.color = '#C6CBD4'; // Cool Grey
  subtitle.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  subtitle.style.fontWeight = '300';
  contentWrapper.appendChild(subtitle);

  // Skip link - focused on load for accessibility
  const skipLink = document.createElement('a');
  skipLink.setAttribute('href', '#main-content');
  skipLink.setAttribute('data-testid', 'skip-intro');
  skipLink.classList.add('skip-link');
  skipLink.textContent = 'Skip to main content (ESC)';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '1rem';
  skipLink.style.left = '1rem';
  skipLink.style.zIndex = '3';
  skipLink.style.color = '#24D1D5';
  skipLink.style.textDecoration = 'underline';
  skipLink.style.padding = '0.5rem 1rem';
  skipLink.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
  skipLink.style.borderRadius = '4px';
  skipLink.style.border = '1px solid #24D1D5';
  section.appendChild(skipLink);

  section.appendChild(contentWrapper);

  // Disable scroll initially
  document.body.style.overflow = 'hidden';

  // Initialize the cinematic sequence after DOM is ready
  setTimeout(() => {
    initCinematicSequence(canvas, section, title, subtitle, liveDiv, skipLink);
  }, 100);

  return section;
}

// Main cinematic sequence controller
async function initCinematicSequence(
  canvas: HTMLCanvasElement, 
  section: HTMLElement, 
  title: HTMLElement, 
  subtitle: HTMLElement, 
  liveDiv: HTMLElement,
  skipLink: HTMLElement
): Promise<void> {
  try {
    // Device capability detection
    if (!isDeviceCapable()) {
      await showFallbackSequence(canvas, title, subtitle, liveDiv);
      return;
    }

    // Set canvas size
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Initialize 3D with error boundaries
    const brandEntry3D = await initializeWithRetry(canvas);
    
    if (!brandEntry3D) {
      await showFallbackSequence(canvas, title, subtitle, liveDiv);
      return;
    }
    
    // Store reference for cleanup
    (section as HTMLElement & { __brandEntry3D?: BrandEntry3D }).__brandEntry3D = brandEntry3D;
    
    // Handle window resize
    const handleResize = () => {
      try {
        const rect = section.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        brandEntry3D.handleResize();
      } catch {
        // Silently handle resize errors
      }
    };
    
    window.addEventListener('resize', handleResize);
    (section as HTMLElement & { __resizeHandler?: () => void }).__resizeHandler = handleResize;
    
    // Set up ESC key and skip link handlers
    const skipHandler = () => {
      skipToMainContent();
    };
    
    const escHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        skipToMainContent();
      }
    };
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      skipHandler();
    });
    
    document.addEventListener('keydown', escHandler);
    
    // Store cleanup function
    (section as HTMLElement & { __cleanup?: () => void }).__cleanup = () => {
      document.removeEventListener('keydown', escHandler);
      window.removeEventListener('resize', handleResize);
    };
    
    // Focus skip link initially
    skipLink.focus();
    
    // Announce loading to screen readers
    liveDiv.textContent = 'Loading Voder brand introduction';
    
    // Start the 6-second cinematic sequence
    await executeCinematicSequence(brandEntry3D, title, subtitle, liveDiv);
    
  } catch {
    await showFallbackSequence(canvas, title, subtitle, liveDiv);
  }
}

// Execute the full 6-second cinematic sequence
async function executeCinematicSequence(
  brandEntry3D: BrandEntry3D, 
  title: HTMLElement, 
  subtitle: HTMLElement, 
  liveDiv: HTMLElement
): Promise<void> {
  
  // Start 3D animation
  brandEntry3D.beginCinematicSequence();
  
  // Phase 1: Preload (0-0.5s) - already handled by 3D system
  
  // Phase 2: Ignition (0.5-1.5s) - handled by 3D system
  
  // Phase 3: Logo Reveal (1.5-3s)
  setTimeout(() => {
    typeText(title, 'Voder', 800); // Type over 0.8 seconds
    liveDiv.textContent = 'Voder';
  }, 1500);
  
  // Phase 4: Tagline Reveal (2.8-3.5s)
  setTimeout(() => {
    fadeInElement(subtitle, 700);
    liveDiv.textContent = 'Voder - The Compiler for Prompts';
  }, 2800);
  
  // Phase 5: Atmosphere (3-4s) - handled by 3D system
  
  // Phase 6: Stillness (4-6s) - handled by 3D system
  
  // Sequence complete - enable scroll and remove focus trap
  setTimeout(() => {
    document.body.style.overflow = '';
    
    // Announce completion
    liveDiv.textContent = 'Brand introduction complete. Welcome to Voder.';
    
    // Clear announcement after 3 seconds
    setTimeout(() => {
      liveDiv.textContent = '';
    }, 3000);
    
  }, 6000);
}

// Typing animation for logo
function typeText(element: HTMLElement, text: string, duration: number): void {
  element.style.opacity = '1';
  // Don't clear content - start from current content or empty if needed
  const currentText = element.textContent || '';
  if (currentText === text) {
    // Already has the correct text, no need to animate
    return;
  }
  
  let index = 0;
  const interval = duration / text.length;
  
  const typeInterval = setInterval(() => {
    element.textContent = text.substring(0, index + 1);
    index++;
    
    if (index >= text.length) {
      clearInterval(typeInterval);
    }
  }, interval);
}

// Fade in animation
function fadeInElement(element: HTMLElement, duration: number): void {
  element.style.transition = `opacity ${duration}ms ease-out`;
  element.style.opacity = '1';
}

// Skip to main content functionality
function skipToMainContent(): void {
  // Stop all animations
  document.body.style.overflow = '';
  
  // Show final state immediately
  const title = document.querySelector('[data-testid="voder-logo"]') as HTMLElement;
  const subtitle = document.querySelector('[data-testid="brand-tagline"]') as HTMLElement;
  
  if (title) {
    title.textContent = 'Voder';
    title.style.opacity = '1';
    title.style.transition = 'none';
  }
  
  if (subtitle) {
    subtitle.style.opacity = '1';
    subtitle.style.transition = 'none';
  }
  
  // Focus main content
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView();
  }
}

// Fallback sequence for reduced motion or incapable devices
async function showFallbackSequence(
  canvas: HTMLCanvasElement, 
  title: HTMLElement, 
  subtitle: HTMLElement, 
  liveDiv: HTMLElement
): Promise<void> {
  
  // Show static fallback graphic
  showFallbackGraphic(canvas);
  
  // Simple fade-in for text elements
  setTimeout(() => {
    title.textContent = 'Voder';
    title.style.transition = 'opacity 1s ease-out';
    title.style.opacity = '1';
    liveDiv.textContent = 'Voder';
  }, 500);
  
  setTimeout(() => {
    subtitle.style.transition = 'opacity 1s ease-out';
    subtitle.style.opacity = '1';
    liveDiv.textContent = 'Voder - The Compiler for Prompts';
  }, 1200);
  
  // Enable scroll after 2 seconds
  setTimeout(() => {
    document.body.style.overflow = '';
    liveDiv.textContent = 'Brand introduction complete. Welcome to Voder.';
    
    setTimeout(() => {
      liveDiv.textContent = '';
    }, 3000);
  }, 2000);
}

// Device capability detection
function isDeviceCapable(): boolean {
  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return false;
  
  // Type guard for WebGL context
  const webgl = gl as WebGLRenderingContext;
  
  // Check for basic hardware requirements
  const debugInfo = webgl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    // Skip very low-end hardware that might struggle
    if (renderer && renderer.toString().toLowerCase().includes('software')) {
      return false;
    }
  }
  
  // Check for reasonable viewport size
  if (window.innerWidth < 400 || window.innerHeight < 300) {
    return false;
  }
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  
  return true;
}

// Retry logic for 3D initialization
async function initializeWithRetry(canvas: HTMLCanvasElement, maxRetries: number = 2): Promise<BrandEntry3D | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const brandEntry3D = new BrandEntry3D(canvas);
      
      // Test render to ensure it's working
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            // If we get here without errors, it's working
            resolve(brandEntry3D);
          } catch (error) {
            reject(error);
          }
        }, 100);
      });
      
      return brandEntry3D;
    } catch {
      
      if (attempt === maxRetries) {
        return null;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return null;
}

// Enhanced fallback with better visual design
function showFallbackGraphic(canvas: HTMLCanvasElement): void {
  // Create a more sophisticated fallback that matches the brand
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Ultimate fallback - CSS gradient
    canvas.style.background = 'radial-gradient(circle, #24D1D5 0%, #0A0A0A 70%)';
    return;
  }
  
  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Clear canvas
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(0, 0, width, height);
  
  // Create animated fallback
  let frame = 0;
  const animate = () => {
    // Clear and redraw background
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, width, height);
    
    // Animate subtle glow effect
    const time = frame * 0.02;
    const glowRadius = 100 + Math.sin(time) * 20;
    
    // Create radial gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
    gradient.addColorStop(0, 'rgba(36, 209, 213, 0.3)');
    gradient.addColorStop(0.5, 'rgba(36, 209, 213, 0.1)');
    gradient.addColorStop(1, 'rgba(36, 209, 213, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw simple geometric shape
    ctx.strokeStyle = '#24D1D5';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6 + Math.sin(time * 2) * 0.2;
    
    // Rotating wireframe rectangle
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(time * 0.5);
    ctx.strokeRect(-40, -40, 80, 80);
    ctx.rotate(Math.PI / 4);
    ctx.globalAlpha *= 0.7;
    ctx.strokeRect(-30, -30, 60, 60);
    ctx.restore();
    
    frame++;
    
    // Continue animation if canvas is still visible
    if (canvas.offsetParent !== null) {
      requestAnimationFrame(animate);
    }
  };
  
  animate();
}