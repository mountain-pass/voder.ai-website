
import { prefersReducedMotion } from './utils';

/**
 * Initializes scroll-driven animations and banner rendering.
 * If reduced motion is preferred, skips all complex animations.
 */
export async function initScrollAnimations(): Promise<void> {
  // ensure THREE and gsap globals exist immediately
  (window as any).THREE = (window as any).THREE || {};
  (window as any).gsap = (window as any).gsap || {};

  console.log('▶️ initScrollAnimations fired');
  (window as any).__bannerModelLoaded = false;

  if (prefersReducedMotion()) {
    console.log('Reduced motion detected, skipping complex animations.');
    (window as any).THREE = {};
    (window as any).gsap = {};
    (window as any).__bannerModelLoaded = true;
    return;
}

  try {
    // Import specific Three.js modules for better chunking
    const [
      { Scene },
      { PerspectiveCamera },
      { WebGLRenderer },
      { AmbientLight },
      { DirectionalLight },
      gsapModuleImport,
      { ScrollTrigger },
      { GLTFLoader }
    ] = await Promise.all([
      import('three/src/scenes/Scene.js'),
      import('three/src/cameras/PerspectiveCamera.js'),
      import('three/src/renderers/WebGLRenderer.js'),
      import('three/src/lights/AmbientLight.js'),
      import('three/src/lights/DirectionalLight.js'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('three/examples/jsm/loaders/GLTFLoader.js')
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gsap = (gsapModuleImport as any).default ?? (gsapModuleImport as any).gsap;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(gsap as any)._voderScrollRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (gsap as any)._voderScrollRegistered = true;
    }

    // Create a lightweight THREE object with only what we need
    const THREE = {
      Scene,
      PerspectiveCamera,
      WebGLRenderer,
      AmbientLight,
      DirectionalLight
    };

    // Expose globals for testing and animation logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).THREE = THREE;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gsap = gsap;

    // Load and render the 3D model
    const canvas = document.querySelector<HTMLCanvasElement>('section[role="banner"] canvas');
    if (!canvas) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__bannerModelLoaded = true;
      return;
    }

    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new Scene();
    const camera = new PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    scene.add(new AmbientLight(0xffffff, 0.5));
    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/production-cube.glb',
      (gltf) => {
        scene.add(gltf.scene);
        renderer.setAnimationLoop(() => renderer.render(scene, camera));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__bannerModelLoaded = true;
      },
      undefined,
      (error) => {
        // eslint-disable-next-line no-console
        console.error('Error loading GLTF model:', error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__bannerModelLoaded = true;
      }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading animations libraries:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).THREE = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gsap = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__bannerModelLoaded = true;
  }
}
