import * as THREE from 'three';

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

interface CodeFragmentData {
  text: string;
  fileType: 'tsx' | 'js' | 'json' | 'config' | 'css';
  color: number;
  content: string;
  mass: number;
}

interface CodeFragment {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
  text: string;
  fileType: 'tsx' | 'json' | 'css' | 'js' | 'config';
  content: string;
  textMesh?: THREE.Mesh;
  boundingBox: THREE.Box3;
  mass: number;
}

interface CollisionPair {
  fragmentA: CodeFragment;
  fragmentB: CodeFragment;
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
  private codeFragments: CodeFragment[] = [];
  private mousePosition = new THREE.Vector2();
  private parallaxLayers: THREE.Group[] = [];
  private collisionPairs: CollisionPair[] = [];
  private currentParallaxOffset = new THREE.Vector3();
  private targetParallaxOffset = new THREE.Vector3();
  private debouncedMouseMove!: (...args: unknown[]) => void;

  constructor(private canvas: HTMLCanvasElement) {
    this.initScene();
    this.createAdvancedChaosElements();
    this.setupEventListeners();
    this.startAnimation();
  }

  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    // Make background transparent so it overlays properly
    this.scene.background = null; // Transparent background
    
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
      alpha: true // Enable alpha for transparency
    });
    
    // Ensure canvas has proper dimensions
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Transparent clear color
  }

  private createAdvancedChaosElements(): void {
    this.createParticleSystem();
    this.createParallaxLayers();
    this.createRealisticCodeFragments();
    this.createBottleneckVisualization();
    this.createFragmentedObjects();
  }

  private createParallaxLayers(): void {
    // Create 5 depth layers for sophisticated parallax
    for (let i = 0; i < 5; i++) {
      const layer = new THREE.Group();
      layer.position.z = -i * 2; // Spread layers in depth
      this.parallaxLayers.push(layer);
      this.scene.add(layer);
    }
  }

  private setupEventListeners(): void {
    const container = this.renderer.domElement.parentElement;
    
    if (container) {
      // Mouse movement for parallax effect
      container.addEventListener('mousemove', this.handleMouseMove);
      container.addEventListener('mouseleave', this.handleMouseLeave);
      
      // Touch events for mobile parallax
      container.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      container.addEventListener('touchend', this.handleTouchEnd);
    }
    
    // Performance optimization
    this.debouncedMouseMove = this.debounce(this.updateParallaxLayers.bind(this), 16);
  }

  private handleMouseMove = (event: MouseEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.debouncedMouseMove();
  };

  private handleMouseLeave = (): void => {
    // Gradually return to center position
    this.targetParallaxOffset.set(0, 0, 0);
  };

  private handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      event.preventDefault();
      const touch = event.touches[0];
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mousePosition.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePosition.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      
      this.debouncedMouseMove();
    }
  };

  private handleTouchEnd = (): void => {
    this.targetParallaxOffset.set(0, 0, 0);
  };

  private updateParallaxLayers(): void {
    // Calculate target offset based on mouse position
    const intensity = 2.0; // Adjust for stronger/weaker effect
    this.targetParallaxOffset.set(
      this.mousePosition.x * intensity,
      this.mousePosition.y * intensity * 0.5, // Less Y movement
      this.mousePosition.x * intensity * 0.3  // Z-depth parallax
    );
  }

  private debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  private createRealisticCodeFragments(): void {
    const realisticFragments = [
      {
        text: 'Component.tsx',
        fileType: 'tsx' as const,
        content: `import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface Props {
  title: string;
  onUpdate: (data: any) => void;
}

export const Component: React.FC<Props> = ({ title, onUpdate }) => {
  const [state, setState] = useState<string>('');
  
  useEffect(() => {
    gsap.fromTo('.element', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    );
  }, []);

  return (
    <div className="component">
      <h2>{title}</h2>
      <input value={state} onChange={(e) => setState(e.target.value)} />
    </div>
  );
};`,
        color: 0x007ACC,
        mass: 1.2
      },
      {
        text: 'webpack.config.js',
        fileType: 'config' as const,
        content: `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
};`,
        color: 0xFF6B35,
        mass: 1.5
      },
      {
        text: 'package.json',
        fileType: 'json' as const,
        content: `{
  "name": "voder-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gsap": "^3.12.2",
    "three": "^0.158.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/three": "^0.158.3",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}`,
        color: 0xFFD700,
        mass: 0.8
      },
      {
        text: 'tsconfig.json',
        fileType: 'json' as const,
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
        color: 0xFFD700,
        mass: 0.9
      },
      {
        text: 'styles.css',
        fileType: 'css' as const,
        content: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0A0A0A, #0F1A2E);
  min-height: 100vh;
}

.component {
  background: rgba(36, 209, 213, 0.1);
  border: 1px solid #24D1D5;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  transition: all 0.3s ease;
}

.component:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(36, 209, 213, 0.2);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}`,
        color: 0x1572B6,
        mass: 1.0
      },
      {
        text: 'utils.js',
        fileType: 'js' as const,
        content: `export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};`,
        color: 0xF7DF1E,
        mass: 0.7
      }
    ];

    realisticFragments.forEach((fragmentData, index) => {
      const fragment = this.createCodeFragmentMesh(fragmentData);
      
      // Distribute across parallax layers
      const layerIndex = index % this.parallaxLayers.length;
      this.parallaxLayers[layerIndex].add(fragment.mesh);
      
      this.codeFragments.push(fragment);
    });
  }

  private createCodeFragmentMesh(fragmentData: CodeFragmentData): CodeFragment {
    // Create geometry based on content length
    const lines = fragmentData.content.split('\n').length;
    const width = Math.min(1.2, 0.4 + (lines * 0.02));
    const height = Math.min(0.8, 0.15 + (lines * 0.008));
    
    const geometry = new THREE.BoxGeometry(width, height, 0.02);
    const material = new THREE.MeshBasicMaterial({
      color: fragmentData.color,
      transparent: true,
      opacity: 0.85,
      wireframe: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Position with realistic spacing
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 10
    );
    
    // Initial rotation
    mesh.rotation.set(
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.2,
      Math.random() * Math.PI * 0.1
    );

    // Create physics properties
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.008
    );
    
    const rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.005
    );

    const boundingBox = new THREE.Box3().setFromObject(mesh);

    return {
      mesh,
      velocity,
      rotationSpeed,
      text: fragmentData.text,
      fileType: fragmentData.fileType,
      content: fragmentData.content,
      boundingBox,
      mass: fragmentData.mass || 1.0
    };
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

  private updateAdvancedPhysics(): void {
    this.codeFragments.forEach((fragment) => {
      // Apply gravity and momentum
      fragment.velocity.y -= 0.0001; // Subtle gravity
      
      // Mouse interaction - attract nearby fragments
      const screenPosition = fragment.mesh.position.clone().project(this.camera);
      const distance = this.mousePosition.distanceTo(new THREE.Vector2(screenPosition.x, screenPosition.y));
      
      if (distance < 0.3) {
        const attractionForce = (0.3 - distance) * 0.0002;
        const direction = new THREE.Vector3(
          this.mousePosition.x - screenPosition.x,
          this.mousePosition.y - screenPosition.y,
          0
        ).normalize();
        
        fragment.velocity.add(direction.multiplyScalar(attractionForce));
      }
      
      // Update position with velocity
      fragment.mesh.position.add(fragment.velocity);
      
      // Update rotation
      fragment.mesh.rotation.x += fragment.rotationSpeed.x;
      fragment.mesh.rotation.y += fragment.rotationSpeed.y;
      fragment.mesh.rotation.z += fragment.rotationSpeed.z;
      
      // Apply air resistance
      fragment.velocity.multiplyScalar(0.998);
      
      // Boundary checking with bounce
      const bounds = { x: 12, y: 8, z: 6 };
      if (Math.abs(fragment.mesh.position.x) > bounds.x) {
        fragment.velocity.x *= -0.6;
        fragment.mesh.position.x = Math.sign(fragment.mesh.position.x) * bounds.x;
      }
      if (Math.abs(fragment.mesh.position.y) > bounds.y) {
        fragment.velocity.y *= -0.6;
        fragment.mesh.position.y = Math.sign(fragment.mesh.position.y) * bounds.y;
      }
      if (Math.abs(fragment.mesh.position.z) > bounds.z) {
        fragment.velocity.z *= -0.6;
        fragment.mesh.position.z = Math.sign(fragment.mesh.position.z) * bounds.z;
      }
      
      // Update bounding box
      fragment.boundingBox.setFromObject(fragment.mesh);
    });
    
    // Check for collisions
    this.handleCollisions();
  }

  private handleCollisions(): void {
    this.collisionPairs = [];
    
    for (let i = 0; i < this.codeFragments.length; i++) {
      for (let j = i + 1; j < this.codeFragments.length; j++) {
        const fragmentA = this.codeFragments[i];
        const fragmentB = this.codeFragments[j];
        
        if (fragmentA.boundingBox.intersectsBox(fragmentB.boundingBox)) {
          this.collisionPairs.push({ fragmentA, fragmentB });
          this.resolveCollision(fragmentA, fragmentB);
        }
      }
    }
  }

  private resolveCollision(fragmentA: CodeFragment, fragmentB: CodeFragment): void {
    // Calculate collision response
    const positionDiff = fragmentA.mesh.position.clone().sub(fragmentB.mesh.position);
    const distance = positionDiff.length();
    
    if (distance === 0) return;
    
    const normalizedDiff = positionDiff.normalize();
    const relativeVelocity = fragmentA.velocity.clone().sub(fragmentB.velocity);
    const velocityAlongNormal = relativeVelocity.dot(normalizedDiff);
    
    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;
    
    // Calculate restitution (bounciness)
    const restitution = 0.4;
    
    // Calculate impulse scalar
    const impulse = -(1 + restitution) * velocityAlongNormal;
    const totalMass = fragmentA.mass + fragmentB.mass;
    const impulseScalar = impulse / totalMass;
    
    // Apply impulse
    const impulseVector = normalizedDiff.clone().multiplyScalar(impulseScalar);
    
    fragmentA.velocity.add(impulseVector.clone().multiplyScalar(fragmentB.mass));
    fragmentB.velocity.sub(impulseVector.clone().multiplyScalar(fragmentA.mass));
    
    // Separate fragments to prevent overlap
    const separation = normalizedDiff.multiplyScalar(0.05);
    fragmentA.mesh.position.add(separation);
    fragmentB.mesh.position.sub(separation);
    
    // Add visual effect for collision
    this.createCollisionEffect(fragmentA.mesh.position.clone());
  }

  private createCollisionEffect(position: THREE.Vector3): void {
    // Create small spark particles at collision point
    for (let i = 0; i < 5; i++) {
      const spark: ParticleData = {
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ),
        life: 0,
        maxLife: 0.5,
        size: 0.02,
        opacity: 1.0
      };
      this.particles.push(spark);
    }
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
      size: 3, // Appropriately sized for visibility
      transparent: true,
      opacity: 0.8, // Good visibility without being overwhelming
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

    // Update particles with enhanced behavior
    this.updateParticles();

    // Update advanced physics for code fragments
    this.updateAdvancedPhysics();

    // Animate fragmented objects - chaotic rotation with breathing
    this.fragmentedGeometry.children.forEach((child, index) => {
      const breathingScale = 1 + Math.sin(time * 2 + index) * 0.05;
      child.scale.setScalar(breathingScale);
      
      child.rotation.x += (0.005 + Math.sin(time + index) * 0.003);
      child.rotation.y += (0.007 + Math.cos(time + index) * 0.002);
      child.rotation.z += (0.003 + Math.sin(time * 1.5 + index) * 0.001);
      
      // Add slight position drift for chaos
      child.position.x += Math.sin(time * 0.5 + index) * 0.008;
      child.position.y += Math.cos(time * 0.3 + index) * 0.008;
    });

    // Animate bottleneck - make it pulse and constrict with more sophistication
    const bottleneckPulse = Math.sin(time * 2) * 0.5 + 0.5;
    const breathingEffect = Math.sin(time * 0.5) * 0.1 + 1;
    this.bottleneckLine.scale.y = (0.3 + bottleneckPulse * 0.7) * breathingEffect;
    this.bottleneckLine.rotation.z = Math.sin(time * 0.3) * 0.1;

    // Update fragment lifecycle and spawning
    this.updateFragmentLifecycle();

    // Apply parallax effect based on mouse position
    this.applyParallaxToLayers();

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  };

  private updateFragmentLifecycle(): void {
    // Occasionally spawn new fragments or despawn old ones
    const time = Date.now() * 0.001;
    
    if (Math.random() < 0.002 && this.codeFragments.length < 15) {
      // Spawn new fragment
      this.spawnNewFragment();
    }
    
    // Update fragment opacity based on lifecycle
    this.codeFragments.forEach((fragment) => {
      const material = fragment.mesh.material as THREE.MeshBasicMaterial;
      const lifecycle = (time) % 20; // 20 second lifecycle
      
      if (lifecycle < 1) {
        // Spawning phase
        material.opacity = lifecycle * 0.85;
        fragment.mesh.scale.setScalar(lifecycle);
      } else if (lifecycle > 18) {
        // Despawning phase
        const despawnProgress = (lifecycle - 18) / 2;
        material.opacity = 0.85 * (1 - despawnProgress);
        fragment.mesh.scale.setScalar(1 - despawnProgress * 0.5);
      } else {
        // Normal phase
        material.opacity = 0.85;
        fragment.mesh.scale.setScalar(1);
      }
    });
  }

  private spawnNewFragment(): void {
    const fragmentTypes = [
      { text: 'jest.config.js', fileType: 'config' as const, color: 0xFF6B35 },
      { text: 'Dockerfile', fileType: 'config' as const, color: 0x2496ED },
      { text: 'index.html', fileType: 'js' as const, color: 0xE34F26 },
      { text: '.eslintrc.json', fileType: 'json' as const, color: 0xFFD700 }
    ];
    
    const randomType = fragmentTypes[Math.floor(Math.random() * fragmentTypes.length)];
    
    const fragmentData = {
      ...randomType,
      content: `// Generated fragment
export const config = {
  name: "${randomType.text}",
  type: "${randomType.fileType}"
};`,
      mass: 0.8
    };

    const newFragment = this.createCodeFragmentMesh(fragmentData);
    
    // Spawn at edge of scene
    const spawnRadius = 15;
    const angle = Math.random() * Math.PI * 2;
    newFragment.mesh.position.set(
      Math.cos(angle) * spawnRadius,
      (Math.random() - 0.5) * 8,
      Math.sin(angle) * spawnRadius
    );
    
    // Give initial velocity toward center
    newFragment.velocity = new THREE.Vector3(
      -Math.cos(angle) * 0.02,
      (Math.random() - 0.5) * 0.01,
      -Math.sin(angle) * 0.02
    );

    const layerIndex = this.codeFragments.length % this.parallaxLayers.length;
    this.parallaxLayers[layerIndex].add(newFragment.mesh);
    this.codeFragments.push(newFragment);
  }

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

    // Intensify code fragment movement
    this.codeFragments.forEach(fragment => {
      fragment.velocity.multiplyScalar(1.5);
      fragment.rotationSpeed.multiplyScalar(1.2);
    });
  }

  public calmChaos(): void {
    // Reduce particles and slow movement
    this.particles.splice(150);
    this.particles.forEach(particle => {
      particle.velocity.multiplyScalar(0.5);
    });

    // Calm code fragment movement
    this.codeFragments.forEach(fragment => {
      fragment.velocity.multiplyScalar(0.7);
      fragment.rotationSpeed.multiplyScalar(0.8);
    });
  }

  // Apply smooth parallax offset to layers
  private applyParallaxToLayers(): void {
    // Smoothly interpolate current offset toward target
    this.currentParallaxOffset.lerp(this.targetParallaxOffset, 0.05);
    
    this.parallaxLayers.forEach((layer, index) => {
      const depth = (index + 1) / this.parallaxLayers.length; // 0.2, 0.4, 0.6, 0.8, 1.0
      const parallaxAmount = depth * 0.8; // Scale the effect
      
      layer.position.x = this.currentParallaxOffset.x * parallaxAmount;
      layer.position.y = this.currentParallaxOffset.y * parallaxAmount;
      layer.position.z = this.currentParallaxOffset.z * parallaxAmount * 0.5;
      
      // Add subtle rotation based on mouse position
      layer.rotation.y = this.currentParallaxOffset.x * 0.02 * parallaxAmount;
      layer.rotation.x = this.currentParallaxOffset.y * 0.02 * parallaxAmount;
    });
  }

  public destroy(): void {
    this.isAnimating = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Clean up event listeners
    const container = this.renderer.domElement.parentElement;
    if (container) {
      container.removeEventListener('mousemove', this.handleMouseMove);
      container.removeEventListener('mouseleave', this.handleMouseLeave);
      container.removeEventListener('touchmove', this.handleTouchMove);
      container.removeEventListener('touchend', this.handleTouchEnd);
    }

    // Dispose of Three.js objects
    this.scene.clear();
    this.renderer.dispose();
  }
}
