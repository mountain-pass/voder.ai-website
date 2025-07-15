import * as THREE from 'three';

export class BrandEntry3D {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.Object3D;
  private animationId: number | null = null;
  private isAnimating = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.initScene();
    this.createGeometry();
    this.startAnimation();
  }

  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0A0A0A'); // Voder Black

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private createGeometry(): void {
    // Create a lattice-like geometric object
    const group = new THREE.Group();

    // Create wireframe cube as base structure
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeometry);
    const cubeMaterial = new THREE.LineBasicMaterial({
      color: '#24D1D5', // Soft Teal Glow
      linewidth: 2
    });
    const cubeWireframe = new THREE.LineSegments(cubeEdges, cubeMaterial);
    group.add(cubeWireframe);

    // Add inner rotating element - icosahedron for complexity
    const icoGeometry = new THREE.IcosahedronGeometry(1.2, 0);
    const icoEdges = new THREE.EdgesGeometry(icoGeometry);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: '#24D1D5',
      linewidth: 1,
      transparent: true,
      opacity: 0.6
    });
    const icoWireframe = new THREE.LineSegments(icoEdges, icoMaterial);
    group.add(icoWireframe);

    // Add glowing center point
    const pointGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0.8
    });
    const centerPoint = new THREE.Mesh(pointGeometry, pointMaterial);
    group.add(centerPoint);

    // Add subtle glow effect using additional larger transparent sphere
    const glowGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0.1
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glowSphere);

    this.geometry = group;
    this.scene.add(this.geometry);
  }

  private animate = (): void => {
    if (!this.isAnimating) return;

    this.animationId = requestAnimationFrame(this.animate);

    // Rotate the entire group slowly
    this.geometry.rotation.x += 0.005;
    this.geometry.rotation.y += 0.007;
    this.geometry.rotation.z += 0.003;

    // Add subtle breathing effect - scale pulsing
    const time = Date.now() * 0.001;
    const scale = 1 + Math.sin(time * 2) * 0.05; // Very subtle pulse
    this.geometry.scale.setScalar(scale);

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  };

  public startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.animate();
  }

  public stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public handleResize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    this.stopAnimation();
    this.renderer.dispose();
    this.scene.clear();
  }

  // Methods for transition control
  public fadeIn(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      let startTime: number | null = null;
      const initialOpacity = 0;
      const targetOpacity = 1;

      const fadeAnimation = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Update opacity of all materials
        this.geometry.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
            if (child.material && 'opacity' in child.material) {
              const material = child.material as THREE.Material & { opacity: number };
              material.opacity = initialOpacity + (targetOpacity - initialOpacity) * progress;
            }
          }
        });

        if (progress < 1) {
          requestAnimationFrame(fadeAnimation);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(fadeAnimation);
    });
  }

  public fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      let startTime: number | null = null;
      const initialOpacity = 1;
      const targetOpacity = 0.3; // Keep some visibility

      const fadeAnimation = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Update opacity of all materials
        this.geometry.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
            if (child.material && 'opacity' in child.material) {
              const material = child.material as THREE.Material & { opacity: number };
              material.opacity = initialOpacity + (targetOpacity - initialOpacity) * progress;
            }
          }
        });

        if (progress < 1) {
          requestAnimationFrame(fadeAnimation);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(fadeAnimation);
    });
  }
}
