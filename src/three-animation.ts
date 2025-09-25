import * as THREE from 'three';

interface ThreeAnimationOptions {
  container: HTMLElement;
  fallbackContent?: string;
}

export class ThreeAnimation {
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private cube?: THREE.Mesh;
  private animationFrameId?: number;
  private container: HTMLElement;
  private isInitialized = false;
  private supportsWebGL = false;

  constructor(options: ThreeAnimationOptions) {
    this.container = options.container;
    this.checkWebGLSupport();
  }

  private checkWebGLSupport(): void {
    // Check if we're in a browser environment
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      this.supportsWebGL = false;

      return;
    }

    try {
      const canvas = document.createElement('canvas');

      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      this.supportsWebGL = !!context;
    } catch {
      this.supportsWebGL = false;
    }
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    // If WebGL is not supported, fall back to 2D content
    if (!this.supportsWebGL) {
      this.initFallback();

      return;
    }

    try {
      this.initThreeJS();
      this.isInitialized = true;
    } catch (error) {
      console.warn('3D animation failed to initialize, falling back to 2D:', error);
      this.initFallback();
    }
  }

  private initFallback(): void {
    this.container.innerHTML = `
      <div class="animation-fallback">
        <div class="geometric-shape">
          <div class="cube-2d">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face right"></div>
            <div class="face left"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
          </div>
        </div>
      </div>`;
    this.isInitialized = true;
  }

  private initThreeJS(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a); // Voder Black

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);

    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x24d1d5, 0.8);

    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);

    // Create a more sophisticated cube with materials
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    const material = new THREE.MeshPhongMaterial({
      color: 0x24d1d5, // Soft Teal Glow
      shininess: 100,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;
    this.scene.add(this.cube);

    // Add edges for better definition
    const edges = new THREE.EdgesGeometry(geometry);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x24d1d5 });

    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    this.cube.add(wireframe);

    // Add mouse interaction
    this.addMouseInteraction();

    // Add scroll interaction
    this.addScrollInteraction();

    // Start animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private addMouseInteraction(): void {
    let mouseX = 0;

    let mouseY = 0;

    this.container.addEventListener('mousemove', (event) => {
      const rect = this.container.getBoundingClientRect();

      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Update cube rotation based on mouse position
    this.container.addEventListener('mousemove', () => {
      if (this.cube) {
        this.cube.rotation.y = mouseX * 0.5;
        this.cube.rotation.x = mouseY * 0.5;
      }
    });
  }

  private addScrollInteraction(): void {
    let ticking = false;

    const updateOnScroll = () => {
      if (!this.cube) return;

      const scrollY = window.scrollY;

      const maxScroll = document.body.scrollHeight - window.innerHeight;

      const scrollProgress = Math.min(scrollY / Math.max(maxScroll, 1), 1);

      // Scale the cube based on scroll progress
      const scale = 1 + scrollProgress * 0.3;

      this.cube.scale.setScalar(scale);

      // Rotate based on scroll
      this.cube.rotation.z = scrollProgress * Math.PI * 0.25;

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Gentle rotation when not interacting
    if (this.cube) {
      this.cube.rotation.x += 0.005;
      this.cube.rotation.y += 0.005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.camera || !this.renderer) return;

    const width = this.container.clientWidth;

    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    window.removeEventListener('resize', () => this.handleResize());
    window.removeEventListener('scroll', () => {}, { passive: true } as any);
    this.isInitialized = false;
  }

  public pause(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }

  public resume(): void {
    if (this.isInitialized && this.supportsWebGL && !this.animationFrameId) {
      this.animate();
    }
  }
}
