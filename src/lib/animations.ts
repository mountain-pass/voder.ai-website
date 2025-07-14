import type * as THREE from 'three';
import { prefersReducedMotion } from './utils';

(window as any).__bannerModelLoaded = false;

/**
 * Initializes scroll-driven animations and banner rendering.
 * If reduced motion is preferred, skips all complex animations.
 */
export function initScrollAnimations(): void {
  // expose banner model loaded flag
  (window as any).__bannerModelLoaded = false;
  if (prefersReducedMotion()) {
    console.log('Reduced motion detected, skipping complex animations.');
    return;
  }

  (async () => {
    // Dynamically import Three.js and GSAP for future use
    const THREE = await import('three');
    const gsapModule =
      (await import('gsap')).default || (await import('gsap')).gsap;
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsapModule.registerPlugin(ScrollTrigger);
    // Animate each section as it scrolls into view
    document.querySelectorAll('section').forEach((section) => {
      gsapModule.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        }
      );
      ScrollTrigger.refresh();
    });
    (window as any).THREE = THREE;
    (window as any).gsap = gsapModule;

    // Set up Three.js scene on the banner canvas
    const { GLTFLoader } = await import(
      'three/examples/jsm/loaders/GLTFLoader.js'
    );
    const canvas = document.querySelector<HTMLCanvasElement>(
      'section[role="banner"] canvas'
    );
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    // ensure canvas clears to white instead of default black
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Animation loop for Three.js
    function animate(): void {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();
    const canvasEl = canvas!;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && model === null) {
          loader.load(
            '/assets/cube.glb',
            (gltf) => {
              model = gltf.scene;
              (window as any).__bannerModelLoaded = true;
              scene.add(model);
              animate();
            },
            undefined,
            (error) => {
              console.error('Error loading GLTF model:', error);
              (window as any).__bannerModelLoaded = true;
            }
          );
          obs.disconnect();
        }
      });
    });
    observer.observe(canvasEl);
  })();
}
