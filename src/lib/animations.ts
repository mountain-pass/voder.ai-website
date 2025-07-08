// src/lib/animations.ts

// THREE.js imports
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// GSAP imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PerspectiveCamera } from 'three';

/**
 * Applies the bespoke animation for the brand-entry (hero) section.
 */
function animateHeroSection(
  camera: PerspectiveCamera,
  config: gsap.plugins.ScrollTriggerInstanceVars
) {
  gsap.to('section[role="banner"]', {
    scrollTrigger: config,
    // TODO: animate camera position, apply CSS filter blur, adjust opacity
  });

  // Problem → Metaphor: implode visual chaos into a single node
  gsap.to('div.visual-chaos', {
    scrollTrigger: {
      trigger: 'section[data-test-id="problem-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.3,
    ease:    'power2.in',
  });

  // Metaphor → Vision Flow: fade out journey diagram and fade in flow diagram
  gsap.to('div.journey-diagram', {
    scrollTrigger: {
      trigger: 'section[data-testid="metaphor-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.5,
    ease:    'power2.inOut',
  });
  
// Vision Flow → Prompt-Driven Iteration: fade in prompt panel and zoom UI mockup
gsap.fromTo(
  'div.prompt-panel',
  { opacity: 0, x: -50 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    x: 0,
    ease: 'power2.out',
  }
);
gsap.fromTo(
  'div.ui-mockup',
  { opacity: 0, scale: 0.8 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    scale: 1,
    ease: 'power2.out',
  }
);
// Prompt-Driven Iteration → Outcome Focus: fade/slide in benefit items
gsap.from('div[role="complementary"]', {
  scrollTrigger: {
    trigger: 'section[aria-labelledby="outcome-focus-heading"]',
    start: 'top 80%',
    end:   'bottom 20%',
    scrub: true,
  },
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: 'power2.out',
});
  // Outcome Focus → Closing Moment: fade to black overlay and pulse logo
  gsap.to(overlay, {
    scrollTrigger: {
      trigger: 'section[role=\"contentinfo\"]',
      start: 'top 80%',
      end:   'bottom top',
      scrub: true,
    },
    opacity: 1,
    ease: 'none',
    onComplete: () => {
      gsap.to('.logo-signature', {
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        className: '+=logo-pulse',
      });
    },
  });gsap.fromTo(
    'div.flow-diagram',
    { opacity: 0, scale: 0.5 },
    {
      scrollTrigger: {
        trigger: 'section[data-testid="metaphor-section"]',
        start: 'top 80%',
        end:   'bottom 20%',
        scrub: true,
      },
      opacity: 1,
      scale:   1,
      ease:    'power2.out',
    }
  );
}

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize scroll-tied animations.
 * Should be called once on page load.
 */
export function initScrollAnimations(): void {
  // create full-screen black overlay for curtain effect
  const overlay = document.createElement('div');
  overlay.classList.add('curtain-fall');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = '#0A0A0A';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);
  // Early exit if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Reduced motion detected, skipping complex animations.');
    return;
  }

  // Set up Three.js scene, camera, renderer
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.zIndex = '-1';
  camera.position.z = 5;
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  document.body.appendChild(renderer.domElement);

  // Load a sample GLB model
  const loader = new GLTFLoader();
  loader.load('/assets/cube.glb', (gltf) => {
    scene.add(gltf.scene);
    renderer.render(scene, camera);
  });

  // Problem → Metaphor: implode visual chaos into a single node
  gsap.to('div.visual-chaos', {
    scrollTrigger: {
      trigger: 'section[data-test-id="problem-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.3,
    ease:    'power2.in',
  });

  // Metaphor → Vision Flow: fade out journey diagram and fade in flow diagram
  gsap.to('div.journey-diagram', {
    scrollTrigger: {
      trigger: 'section[data-testid="metaphor-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.5,
    ease:    'power2.inOut',
  });
  
// Vision Flow → Prompt-Driven Iteration: fade in prompt panel and zoom UI mockup
gsap.fromTo(
  'div.prompt-panel',
  { opacity: 0, x: -50 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    x: 0,
    ease: 'power2.out',
  }
);
gsap.fromTo(
  'div.ui-mockup',
  { opacity: 0, scale: 0.8 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    scale: 1,
    ease: 'power2.out',
  }
);
// Prompt-Driven Iteration → Outcome Focus: fade/slide in benefit items
gsap.from('div[role="complementary"]', {
  scrollTrigger: {
    trigger: 'section[aria-labelledby="outcome-focus-heading"]',
    start: 'top 80%',
    end:   'bottom 20%',
    scrub: true,
  },
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: 'power2.out',
});
  // Outcome Focus → Closing Moment: fade to black overlay and pulse logo
  gsap.to(overlay, {
    scrollTrigger: {
      trigger: 'section[role=\"contentinfo\"]',
      start: 'top 80%',
      end:   'bottom top',
      scrub: true,
    },
    opacity: 1,
    ease: 'none',
    onComplete: () => {
      gsap.to('.logo-signature', {
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        className: '+=logo-pulse',
      });
    },
  });gsap.fromTo(
    'div.flow-diagram',
    { opacity: 0, scale: 0.5 },
    {
      scrollTrigger: {
        trigger: 'section[data-testid="metaphor-section"]',
        start: 'top 80%',
        end:   'bottom 20%',
        scrub: true,
      },
      opacity: 1,
      scale:   1,
      ease:    'power2.out',
    }
  );

  // Fade in each narrative section on scroll
  [
    '#why-heading', // The Why
    'section[data-test-id="problem-section"]', // Problem Space
    'section[data-testid="metaphor-section"]', // Metaphor
    '#vision-flow', // Vision Flow
    'section[aria-labelledby="prompt-iteration-heading"]', // Prompt-Driven Iteration
    '[aria-labelledby="outcome-focus-heading"]', // Outcome Focus
    'section[role="contentinfo"]', // Closing Moment
  ].forEach((sel) => {
    gsap.from(sel, {
      scrollTrigger: {
        trigger: sel,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
      opacity: 0,
      y: 50,
      ease: 'power2.out',
    });

  // Problem → Metaphor: implode visual chaos into a single node
  gsap.to('div.visual-chaos', {
    scrollTrigger: {
      trigger: 'section[data-test-id="problem-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.3,
    ease:    'power2.in',
  });

  // Metaphor → Vision Flow: fade out journey diagram and fade in flow diagram
  gsap.to('div.journey-diagram', {
    scrollTrigger: {
      trigger: 'section[data-testid="metaphor-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.5,
    ease:    'power2.inOut',
  });
  
// Vision Flow → Prompt-Driven Iteration: fade in prompt panel and zoom UI mockup
gsap.fromTo(
  'div.prompt-panel',
  { opacity: 0, x: -50 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    x: 0,
    ease: 'power2.out',
  }
);
gsap.fromTo(
  'div.ui-mockup',
  { opacity: 0, scale: 0.8 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    scale: 1,
    ease: 'power2.out',
  }
);
// Prompt-Driven Iteration → Outcome Focus: fade/slide in benefit items
gsap.from('div[role="complementary"]', {
  scrollTrigger: {
    trigger: 'section[aria-labelledby="outcome-focus-heading"]',
    start: 'top 80%',
    end:   'bottom 20%',
    scrub: true,
  },
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: 'power2.out',
});
  // Outcome Focus → Closing Moment: fade to black overlay and pulse logo
  gsap.to(overlay, {
    scrollTrigger: {
      trigger: 'section[role=\"contentinfo\"]',
      start: 'top 80%',
      end:   'bottom top',
      scrub: true,
    },
    opacity: 1,
    ease: 'none',
    onComplete: () => {
      gsap.to('.logo-signature', {
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        className: '+=logo-pulse',
      });
    },
  });gsap.fromTo(
    'div.flow-diagram',
    { opacity: 0, scale: 0.5 },
    {
      scrollTrigger: {
        trigger: 'section[data-testid="metaphor-section"]',
        start: 'top 80%',
        end:   'bottom 20%',
        scrub: true,
      },
      opacity: 1,
      scale:   1,
      ease:    'power2.out',
    }
  );
  });

  // Problem → Metaphor: implode visual chaos into a single node
  gsap.to('div.visual-chaos', {
    scrollTrigger: {
      trigger: 'section[data-test-id="problem-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.3,
    ease:    'power2.in',
  });

  // Metaphor → Vision Flow: fade out journey diagram and fade in flow diagram
  gsap.to('div.journey-diagram', {
    scrollTrigger: {
      trigger: 'section[data-testid="metaphor-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.5,
    ease:    'power2.inOut',
  });
  
// Vision Flow → Prompt-Driven Iteration: fade in prompt panel and zoom UI mockup
gsap.fromTo(
  'div.prompt-panel',
  { opacity: 0, x: -50 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    x: 0,
    ease: 'power2.out',
  }
);
gsap.fromTo(
  'div.ui-mockup',
  { opacity: 0, scale: 0.8 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    scale: 1,
    ease: 'power2.out',
  }
);
// Prompt-Driven Iteration → Outcome Focus: fade/slide in benefit items
gsap.from('div[role="complementary"]', {
  scrollTrigger: {
    trigger: 'section[aria-labelledby="outcome-focus-heading"]',
    start: 'top 80%',
    end:   'bottom 20%',
    scrub: true,
  },
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: 'power2.out',
});
  // Outcome Focus → Closing Moment: fade to black overlay and pulse logo
  gsap.to(overlay, {
    scrollTrigger: {
      trigger: 'section[role=\"contentinfo\"]',
      start: 'top 80%',
      end:   'bottom top',
      scrub: true,
    },
    opacity: 1,
    ease: 'none',
    onComplete: () => {
      gsap.to('.logo-signature', {
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        className: '+=logo-pulse',
      });
    },
  });gsap.fromTo(
    'div.flow-diagram',
    { opacity: 0, scale: 0.5 },
    {
      scrollTrigger: {
        trigger: 'section[data-testid="metaphor-section"]',
        start: 'top 80%',
        end:   'bottom 20%',
        scrub: true,
      },
      opacity: 1,
      scale:   1,
      ease:    'power2.out',
    }
  );

  // Replace banner fade-in tween with bespoke hero animation
  animateHeroSection(camera, {
    trigger: 'section[role="banner"]',
    start: 'top top',
    end: 'bottom center',
    scrub: true
  });

  // Problem → Metaphor: implode visual chaos into a single node
  gsap.to('div.visual-chaos', {
    scrollTrigger: {
      trigger: 'section[data-test-id="problem-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.3,
    ease:    'power2.in',
  });

  // Metaphor → Vision Flow: fade out journey diagram and fade in flow diagram
  gsap.to('div.journey-diagram', {
    scrollTrigger: {
      trigger: 'section[data-testid="metaphor-section"]',
      start: 'top 80%',
      end:   'bottom 20%',
      scrub: true,
    },
    opacity: 0,
    scale:   0.5,
    ease:    'power2.inOut',
  });
  
// Vision Flow → Prompt-Driven Iteration: fade in prompt panel and zoom UI mockup
gsap.fromTo(
  'div.prompt-panel',
  { opacity: 0, x: -50 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    x: 0,
    ease: 'power2.out',
  }
);
gsap.fromTo(
  'div.ui-mockup',
  { opacity: 0, scale: 0.8 },
  {
    scrollTrigger: {
      trigger: 'section[aria-labelledby="prompt-iteration-heading"]',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: true,
    },
    opacity: 1,
    scale: 1,
    ease: 'power2.out',
  }
);
// Prompt-Driven Iteration → Outcome Focus: fade/slide in benefit items
gsap.from('div[role="complementary"]', {
  scrollTrigger: {
    trigger: 'section[aria-labelledby="outcome-focus-heading"]',
    start: 'top 80%',
    end:   'bottom 20%',
    scrub: true,
  },
  opacity: 0,
  y: 50,
  stagger: 0.2,
  ease: 'power2.out',
});
  // Outcome Focus → Closing Moment: fade to black overlay and pulse logo
  gsap.to(overlay, {
    scrollTrigger: {
      trigger: 'section[role=\"contentinfo\"]',
      start: 'top 80%',
      end:   'bottom top',
      scrub: true,
    },
    opacity: 1,
    ease: 'none',
    onComplete: () => {
      gsap.to('.logo-signature', {
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        className: '+=logo-pulse',
      });
    },
  });gsap.fromTo(
    'div.flow-diagram',
    { opacity: 0, scale: 0.5 },
    {
      scrollTrigger: {
        trigger: 'section[data-testid="metaphor-section"]',
        start: 'top 80%',
        end:   'bottom 20%',
        scrub: true,
      },
      opacity: 1,
      scale:   1,
      ease:    'power2.out',
    }
  );

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
