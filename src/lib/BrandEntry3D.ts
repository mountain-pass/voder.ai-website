import * as THREE from 'three';

export class BrandEntry3D {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private geometry!: THREE.Object3D;
  private pulseLight!: THREE.PointLight;
  private particleSystem!: THREE.Points;
  private animationId: number | null = null;
  private isAnimating = false;
  private startTime: number = 0;
  private cinematicPhase: 'preload' | 'ignition' | 'reveal' | 'atmosphere' | 'stillness' | 'complete' = 'preload';

  constructor(private canvas: HTMLCanvasElement) {
    this.initScene();
    this.createGeometry();
    this.createLighting();
    this.createParticleSystem();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0A0A0A');

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private createGeometry(): void {
    const group = new THREE.Group();

    // Main wireframe structure
    const mainGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const mainEdges = new THREE.EdgesGeometry(mainGeometry);
    const mainMaterial = new THREE.LineBasicMaterial({
      color: '#24D1D5',
      linewidth: 2,
      transparent: true,
      opacity: 0
    });
    const mainWireframe = new THREE.LineSegments(mainEdges, mainMaterial);
    mainWireframe.name = 'mainStructure';
    group.add(mainWireframe);

    // Inner structure
    const innerGeometry = new THREE.DodecahedronGeometry(1.2, 0);
    const innerEdges = new THREE.EdgesGeometry(innerGeometry);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: '#24D1D5',
      linewidth: 1,
      transparent: true,
      opacity: 0
    });
    const innerWireframe = new THREE.LineSegments(innerEdges, innerMaterial);
    innerWireframe.name = 'innerStructure';
    group.add(innerWireframe);

    // Core point
    const coreGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0,
      emissive: '#24D1D5',
      emissiveIntensity: 0
    });
    const corePoint = new THREE.Mesh(coreGeometry, coreMaterial);
    corePoint.name = 'corePoint';
    group.add(corePoint);

    // Glow sphere
    const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    glowSphere.name = 'glowSphere';
    group.add(glowSphere);

    this.geometry = group;
    this.scene.add(this.geometry);
  }

  private createLighting(): void {
    const ambientLight = new THREE.AmbientLight('#24D1D5', 0.1);
    this.scene.add(ambientLight);

    this.pulseLight = new THREE.PointLight('#24D1D5', 0, 10);
    this.pulseLight.position.set(0, 0, 0);
    this.scene.add(this.pulseLight);
  }

  private createParticleSystem(): void {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 0.5;
      positions[i + 1] = (Math.random() - 0.5) * 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 0.5;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: '#24D1D5',
      size: 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
  }

  private animate = (): void => {
    if (!this.isAnimating) return;

    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = (Date.now() - this.startTime) / 1000;
    this.updateCinematicPhase(elapsed);
    this.updatePhaseAnimations(elapsed);

    if (this.cinematicPhase !== 'preload') {
      this.geometry.rotation.x += 0.003;
      this.geometry.rotation.y += 0.005;
      this.geometry.rotation.z += 0.002;

      if (this.cinematicPhase === 'stillness' || this.cinematicPhase === 'complete') {
        const breathe = 1 + Math.sin(elapsed * 1.5) * 0.03;
        this.geometry.scale.setScalar(breathe);
      }
    }

    if (this.cinematicPhase === 'atmosphere' || this.cinematicPhase === 'stillness' || this.cinematicPhase === 'complete') {
      this.updateParticleSystem();
    }

    this.renderer.render(this.scene, this.camera);
  };

  private updateCinematicPhase(elapsed: number): void {
    if (elapsed < 0.5) {
      this.cinematicPhase = 'preload';
    } else if (elapsed < 1.5) {
      this.cinematicPhase = 'ignition';
    } else if (elapsed < 3.0) {
      this.cinematicPhase = 'reveal';
    } else if (elapsed < 4.0) {
      this.cinematicPhase = 'atmosphere';
    } else if (elapsed < 6.0) {
      this.cinematicPhase = 'stillness';
    } else {
      this.cinematicPhase = 'complete';
    }
  }

  private updatePhaseAnimations(elapsed: number): void {
    switch (this.cinematicPhase) {
      case 'preload': {
        // Everything stays at opacity 0
        break;
      }

      case 'ignition': {
        const ignitionProgress = (elapsed - 0.5) / 1.0;
        const pulseIntensity = Math.sin(ignitionProgress * Math.PI * 4) * 2;
        this.pulseLight.intensity = Math.max(0, pulseIntensity);
        
        const corePoint = this.geometry.getObjectByName('corePoint') as THREE.Mesh;
        const glowSphere = this.geometry.getObjectByName('glowSphere') as THREE.Mesh;
        
        if (corePoint?.material) {
          const material = corePoint.material as THREE.MeshPhongMaterial;
          material.opacity = ignitionProgress * 0.8;
          material.emissiveIntensity = ignitionProgress * 0.5;
        }
        
        if (glowSphere?.material) {
          const material = glowSphere.material as THREE.MeshBasicMaterial;
          material.opacity = ignitionProgress * 0.2;
        }
        break;
      }

      case 'reveal': {
        const revealProgress = (elapsed - 1.5) / 1.5;
        
        const mainStructure = this.geometry.getObjectByName('mainStructure') as THREE.LineSegments;
        const innerStructure = this.geometry.getObjectByName('innerStructure') as THREE.LineSegments;
        
        if (mainStructure?.material) {
          const material = mainStructure.material as THREE.LineBasicMaterial;
          material.opacity = revealProgress * 1.0;
        }
        
        if (innerStructure?.material) {
          const material = innerStructure.material as THREE.LineBasicMaterial;
          material.opacity = revealProgress * 0.7;
        }
        
        this.pulseLight.intensity *= 0.95;
        break;
      }

      case 'atmosphere': {
        const atmosphereProgress = (elapsed - 3.0) / 1.0;
        
        if (this.particleSystem?.material) {
          const material = this.particleSystem.material as THREE.PointsMaterial;
          material.opacity = atmosphereProgress * 0.6;
        }
        
        const tealAmount = atmosphereProgress * 0.05;
        this.scene.background = new THREE.Color(0.04 + tealAmount, 0.04 + tealAmount, 0.04 + tealAmount * 2);
        break;
      }

      case 'stillness':
      case 'complete': {
        this.pulseLight.intensity = 0.1;
        break;
      }
    }
  }

  private updateParticleSystem(): void {
    const positions = this.particleSystem.geometry.attributes.position.array as Float32Array;
    const velocities = this.particleSystem.geometry.attributes.velocity?.array as Float32Array;
    
    if (!velocities) return;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      const distance = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
      if (distance > 5) {
        positions[i] = (Math.random() - 0.5) * 0.5;
        positions[i + 1] = (Math.random() - 0.5) * 0.5;
        positions[i + 2] = (Math.random() - 0.5) * 0.5;
      }
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  public startAnimation(): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.startTime = Date.now();
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

  public beginCinematicSequence(): Promise<void> {
    return new Promise((resolve) => {
      this.startTime = Date.now();
      this.startAnimation();
      
      setTimeout(() => {
        resolve();
      }, 6000);
    });
  }

  public fadeIn(): Promise<void> {
    return this.beginCinematicSequence();
  }

  public fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      let startTime: number | null = null;
      const initialOpacity = 1;
      const targetOpacity = 0.3;

      const fadeAnimation = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        this.geometry.traverse((child) => {
          if ((child as THREE.Mesh).material || (child as THREE.LineSegments).material) {
            const material = (child as THREE.Mesh | THREE.LineSegments).material as THREE.Material & { opacity: number };
            if ('opacity' in material) {
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
