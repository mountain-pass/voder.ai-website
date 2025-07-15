import * as THREE from 'three';

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

export class VisualChaos {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles: ParticleData[] = [];
  private animationId: number | null = null;
  private isAnimating = false;
  private fragmentedGeometry!: THREE.Group;
  private bottleneckLine!: THREE.Line;

  constructor(private canvas: HTMLCanvasElement) {
    this.initScene();
    this.createChaosElements();
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
    this.camera.position.z = 8;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private createChaosElements(): void {
    this.createParticleSystem();
    this.createFragmentedObjects();
    this.createBottleneckVisualization();
  }

  private createParticleSystem(): void {
    // Create initial chaos particles
    for (let i = 0; i < 150; i++) {
      const particle: ParticleData = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        ),
        life: Math.random(),
        maxLife: 1 + Math.random() * 2,
        size: 0.01 + Math.random() * 0.05,
        opacity: 0.1 + Math.random() * 0.4
      };
      this.particles.push(particle);
    }
  }

  private createFragmentedObjects(): void {
    // Create fragmented geometric objects to represent broken systems
    this.fragmentedGeometry = new THREE.Group();

    // Create several broken/fragmented cubes
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({
        color: '#C6CBD4', // Cool Grey
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // Position randomly
      cube.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      );
      
      // Random rotation
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      // Add some fragments - broken pieces
      const fragments = new THREE.Group();
      for (let j = 0; j < 3; j++) {
        const fragmentGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const fragmentMaterial = new THREE.MeshBasicMaterial({
          color: '#C6CBD4',
          transparent: true,
          opacity: 0.5
        });
        const fragment = new THREE.Mesh(fragmentGeometry, fragmentMaterial);
        fragment.position.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        fragments.add(fragment);
      }
      
      cube.add(fragments);
      this.fragmentedGeometry.add(cube);
    }

    this.scene.add(this.fragmentedGeometry);
  }

  private createBottleneckVisualization(): void {
    // Create a visualization of bottlenecks using connected lines that get compressed
    const points = [];
    const numPoints = 50;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const x = (t - 0.5) * 15;
      
      // Create bottleneck effect - narrow in the middle
      const bottleneckFactor = Math.sin(t * Math.PI) * 0.3 + 0.1;
      const y = (Math.random() - 0.5) * bottleneckFactor * 5;
      const z = (Math.random() - 0.5) * 2;
      
      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: '#C6CBD4',
      transparent: true,
      opacity: 0.6
    });

    this.bottleneckLine = new THREE.Line(geometry, material);
    this.scene.add(this.bottleneckLine);
  }

  private updateParticles(): void {
    // Update existing particles
    this.particles.forEach((particle) => {
      // Update position
      particle.position.add(particle.velocity);
      
      // Update life
      particle.life += 0.016; // ~60fps
      
      // Add some chaos to movement
      particle.velocity.x += (Math.random() - 0.5) * 0.001;
      particle.velocity.y += (Math.random() - 0.5) * 0.001;
      
      // Reset particle if it's died
      if (particle.life > particle.maxLife) {
        particle.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        );
        particle.life = 0;
        particle.velocity.set(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.01
        );
      }
      
      // Calculate opacity based on life
      particle.opacity = Math.max(0, 0.5 - (particle.life / particle.maxLife) * 0.5);
    });

    // Render particles as points
    this.renderParticles();
  }

  private renderParticles(): void {
    // Clear any existing particle points
    const existingPoints = this.scene.getObjectByName('chaosParticles');
    if (existingPoints) {
      this.scene.remove(existingPoints);
    }

    // Create geometry for all particles
    const positions = new Float32Array(this.particles.length * 3);
    const colors = new Float32Array(this.particles.length * 3);
    const sizes = new Float32Array(this.particles.length);

    this.particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      // Cool grey color with varying opacity
      colors[i * 3] = 0.776; // R
      colors[i * 3 + 1] = 0.796; // G  
      colors[i * 3 + 2] = 0.831; // B (#C6CBD4)

      sizes[i] = particle.size * 100;
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    points.name = 'chaosParticles';
    this.scene.add(points);
  }

  private animate = (): void => {
    if (!this.isAnimating) return;

    this.animationId = requestAnimationFrame(this.animate);

    const time = Date.now() * 0.001;

    // Update particles
    this.updateParticles();

    // Animate fragmented objects - chaotic rotation
    this.fragmentedGeometry.children.forEach((child, index) => {
      child.rotation.x += (0.005 + Math.sin(time + index) * 0.003);
      child.rotation.y += (0.007 + Math.cos(time + index) * 0.002);
      child.rotation.z += (0.003 + Math.sin(time * 1.5 + index) * 0.001);
      
      // Add slight position drift for chaos
      child.position.x += Math.sin(time * 0.5 + index) * 0.01;
      child.position.y += Math.cos(time * 0.3 + index) * 0.01;
    });

    // Animate bottleneck - make it pulse and constrict
    const bottleneckPulse = Math.sin(time * 2) * 0.5 + 0.5;
    this.bottleneckLine.scale.y = 0.3 + bottleneckPulse * 0.7;

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

  // Transition methods for scroll-based interactions
  public intensifyChaos(): void {
    // Add more particles and increase movement speed during scroll
    while (this.particles.length < 250) {
      const particle: ParticleData = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.02
        ),
        life: Math.random(),
        maxLife: 0.5 + Math.random(),
        size: 0.02 + Math.random() * 0.08,
        opacity: 0.2 + Math.random() * 0.6
      };
      this.particles.push(particle);
    }
  }

  public calmChaos(): void {
    // Reduce particles and slow movement
    this.particles.splice(150);
    this.particles.forEach(particle => {
      particle.velocity.multiplyScalar(0.5);
    });
  }
}
