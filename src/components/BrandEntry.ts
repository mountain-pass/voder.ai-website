// src/components/BrandEntry.ts
import { BrandEntry3D } from '../lib/BrandEntry3D';

export function BrandEntry(): HTMLElement {
  const section = document.createElement('section');
  section.setAttribute('role', 'banner');
  section.setAttribute('aria-label', 'Voder brand introduction');
  section.style.position = 'relative';
  section.style.height = '100vh';
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.backgroundColor = '#0A0A0A'; // Voder Black

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
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
  title.textContent = 'Voder';
  title.style.fontSize = '4rem';
  title.style.fontWeight = '600';
  title.style.margin = '0 0 1rem 0';
  title.style.color = '#FFFFFF';
  contentWrapper.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'The Compiler for Prompts';
  subtitle.style.fontSize = '1.5rem';
  subtitle.style.margin = '0';
  subtitle.style.opacity = '0.8';
  subtitle.style.color = '#C6CBD4'; // Cool Grey
  contentWrapper.appendChild(subtitle);

  const skipLink = document.createElement('a');
  skipLink.setAttribute('href', '#main-content');
  skipLink.classList.add('skip-link');
  skipLink.textContent = 'Skip to main content';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '1rem';
  skipLink.style.left = '1rem';
  skipLink.style.zIndex = '3';
  skipLink.style.color = '#24D1D5';
  skipLink.style.textDecoration = 'underline';
  section.appendChild(skipLink);

  section.appendChild(contentWrapper);

  // Initialize 3D scene after canvas is in DOM
  setTimeout(() => {
    initBrandEntry3D(canvas, section);
  }, 100);

  return section;
}

// Enhanced 3D initialization with comprehensive error handling
async function initBrandEntry3D(canvas: HTMLCanvasElement, section: HTMLElement): Promise<void> {
  try {
    // Device capability detection
    if (!isDeviceCapable()) {
      showFallbackGraphic(canvas);
      return;
    }

    // Set canvas size
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Initialize 3D with error boundaries
    const brandEntry3D = await initializeWithRetry(canvas);
    
    if (!brandEntry3D) {
      showFallbackGraphic(canvas);
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
        // Silently handle resize errors, fallback will continue working
      }
    };
    
    window.addEventListener('resize', handleResize);
    (section as HTMLElement & { __resizeHandler?: () => void }).__resizeHandler = handleResize;
    
    // Cinematic fadeIn sequence as specified
    await brandEntry3D.fadeIn(2000);
    
  } catch {
    showFallbackGraphic(canvas);
  }
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
    } catch (error) {
      
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
