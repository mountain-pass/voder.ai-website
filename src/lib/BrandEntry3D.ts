import * as THREE from 'three';

export class BrandEntry3D {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cinematicObject!: THREE.Group;
  private ignitionPulse!: THREE.Group;
  private atmosphericParticles!: THREE.Group;
  private ambientParticles!: THREE.Group;
  private advancedLighting!: THREE.Group;
  private animationId: number | null = null;
  private isAnimating = false;
  private startTime: number = 0;
  private cinematicPhase: 'preload' | 'ignition' | 'reveal' | 'atmosphere' | 'stillness' | 'complete' = 'preload';
  private textFragments: THREE.Mesh[] = [];
  private pulseRings: THREE.Mesh[] = [];
  private atmosphericLayers: THREE.Points[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.initScene();
    this.createAdvancedLighting();
    this.createCinematicObject();
    this.createIgnitionPulseSystem();
    this.createAtmosphericParticleSystem();
    this.createAmbientParticleLayer();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0A0A0A');
    this.scene.fog = new THREE.Fog('#0A0A0A', 5, 25);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 6);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  private createAdvancedLighting(): void {
    this.advancedLighting = new THREE.Group();
    
    // Ambient lighting with dynamic intensity
    const ambientLight = new THREE.AmbientLight('#24D1D5', 0.05);
    ambientLight.name = 'ambientLight';
    this.advancedLighting.add(ambientLight);

    // Main dramatic light
    const dramaticLight = new THREE.DirectionalLight('#24D1D5', 0);
    dramaticLight.position.set(2, 3, 5);
    dramaticLight.castShadow = true;
    dramaticLight.shadow.mapSize.width = 2048;
    dramaticLight.shadow.mapSize.height = 2048;
    dramaticLight.name = 'dramaticLight';
    this.advancedLighting.add(dramaticLight);

    // Rim lighting for depth
    const rimLight1 = new THREE.DirectionalLight('#1a9da1', 0);
    rimLight1.position.set(-2, -1, -3);
    rimLight1.name = 'rimLight1';
    this.advancedLighting.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight('#0f7173', 0);
    rimLight2.position.set(1, -2, 4);
    rimLight2.name = 'rimLight2';
    this.advancedLighting.add(rimLight2);

    // Center pulse light for ignition
    const pulseLight = new THREE.PointLight('#24D1D5', 0, 15, 0.8);
    pulseLight.position.set(0, 0, 0);
    pulseLight.name = 'pulseLight';
    this.advancedLighting.add(pulseLight);

    // Atmospheric volume light
    const volumeLight = new THREE.SpotLight('#24D1D5', 0, 20, Math.PI * 0.3, 0.5, 1);
    volumeLight.position.set(0, 5, 8);
    volumeLight.target.position.set(0, 0, 0);
    volumeLight.name = 'volumeLight';
    this.advancedLighting.add(volumeLight);
    this.advancedLighting.add(volumeLight.target);

    this.scene.add(this.advancedLighting);
  }

  private createCinematicObject(): void {
    this.cinematicObject = new THREE.Group();
    
    // Main faceted cube structure
    const facetedGeometry = new THREE.DodecahedronGeometry(1.8, 1);
    const facetedMaterial = new THREE.MeshPhysicalMaterial({
      color: '#24D1D5',
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0,
      emissive: '#24D1D5',
      emissiveIntensity: 0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true
    });
    const facetedCube = new THREE.Mesh(facetedGeometry, facetedMaterial);
    facetedCube.name = 'facetedCube';
    facetedCube.castShadow = true;
    facetedCube.receiveShadow = true;
    this.cinematicObject.add(facetedCube);

    // Inner glowing knot of prompt-text fragments
    this.createPromptTextFragments();

    // Outer wireframe structure for complexity
    const outerGeometry = new THREE.IcosahedronGeometry(2.2, 0);
    const outerEdges = new THREE.EdgesGeometry(outerGeometry);
    const outerMaterial = new THREE.LineBasicMaterial({
      color: '#1a9da1',
      transparent: true,
      opacity: 0,
      linewidth: 1.5
    });
    const outerWireframe = new THREE.LineSegments(outerEdges, outerMaterial);
    outerWireframe.name = 'outerWireframe';
    this.cinematicObject.add(outerWireframe);

    // Central core with breathing effect
    const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0,
      emissive: '#24D1D5',
      emissiveIntensity: 0,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0
    });
    const centralCore = new THREE.Mesh(coreGeometry, coreMaterial);
    centralCore.name = 'centralCore';
    centralCore.castShadow = true;
    this.cinematicObject.add(centralCore);

    // Glow halo effect
    const haloGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.name = 'halo';
    this.cinematicObject.add(halo);

    this.scene.add(this.cinematicObject);
  }

  private createPromptTextFragments(): void {
    const textGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.02);
    const textMaterial = new THREE.MeshPhysicalMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0,
      emissive: '#24D1D5',
      emissiveIntensity: 0,
      metalness: 0.3,
      roughness: 0.7
    });

    // Create floating text fragments around the core
    for (let i = 0; i < 12; i++) {
      const fragment = new THREE.Mesh(textGeometry.clone(), textMaterial.clone());
      const angle = (i / 12) * Math.PI * 2;
      const radius = 1.2 + Math.random() * 0.8;
      fragment.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.5,
        Math.sin(angle) * radius
      );
      fragment.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      fragment.name = `textFragment${i}`;
      this.textFragments.push(fragment);
      this.cinematicObject.add(fragment);
    }
  }

  private createIgnitionPulseSystem(): void {
    this.ignitionPulse = new THREE.Group();

    // Create multiple pulse rings for sophisticated flash effect
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.RingGeometry(0.1 + i * 0.3, 0.15 + i * 0.3, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: '#24D1D5',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.name = `pulseRing${i}`;
      this.pulseRings.push(ring);
      this.ignitionPulse.add(ring);
    }

    // Center flash burst
    const burstGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const burstMaterial = new THREE.MeshBasicMaterial({
      color: '#24D1D5',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const centerBurst = new THREE.Mesh(burstGeometry, burstMaterial);
    centerBurst.name = 'centerBurst';
    this.ignitionPulse.add(centerBurst);

    this.scene.add(this.ignitionPulse);
  }

  private createAtmosphericParticleSystem(): void {
    this.atmosphericParticles = new THREE.Group();

    // Multiple particle layers for depth and complexity
    for (let layer = 0; layer < 3; layer++) {
      const particleCount = 80 + layer * 40;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 3 + layer * 2;
        
        // Spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        velocities[i3] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

        sizes[i] = 0.02 + Math.random() * 0.08;

        // Color variation in teal spectrum
        const colorVariation = 0.7 + Math.random() * 0.3;
        colors[i3] = 0.14 * colorVariation;     // R
        colors[i3 + 1] = 0.82 * colorVariation; // G
        colors[i3 + 2] = 0.84 * colorVariation; // B
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        sizeAttenuation: true
      });

      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      particleSystem.name = `atmosphericLayer${layer}`;
      this.atmosphericLayers.push(particleSystem);
      this.atmosphericParticles.add(particleSystem);
    }

    this.scene.add(this.atmosphericParticles);
  }

  private createAmbientParticleLayer(): void {
    this.ambientParticles = new THREE.Group();

    // Fine ambient particles for atmospheric depth
    const ambientCount = 200;
    const positions = new Float32Array(ambientCount * 3);
    const velocities = new Float32Array(ambientCount * 3);
    const life = new Float32Array(ambientCount);

    for (let i = 0; i < ambientCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

      life[i] = Math.random();
    }

    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ambientGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    ambientGeometry.setAttribute('life', new THREE.BufferAttribute(life, 1));

    const ambientMaterial = new THREE.PointsMaterial({
      color: '#24D1D5',
      size: 0.01,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    const ambientSystem = new THREE.Points(ambientGeometry, ambientMaterial);
    ambientSystem.name = 'ambientParticles';
    this.ambientParticles.add(ambientSystem);

    this.scene.add(this.ambientParticles);
  }

  private animate = (): void => {
    if (!this.isAnimating) return;

    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = (Date.now() - this.startTime) / 1000;
    this.updateCinematicPhase(elapsed);
    this.updatePhaseAnimations(elapsed);
    this.updateCinematicObject(elapsed);
    this.updateIgnitionPulse(elapsed);
    this.updateAtmosphericParticles(elapsed);
    this.updateAmbientParticles(elapsed);

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

  private updateCinematicObject(elapsed: number): void {
    if (this.cinematicPhase === 'preload') return;

    // Sophisticated rotation with living feel
    const breathingSpeed = 1.2;
    const rotationSpeed = 0.002;
    
    this.cinematicObject.rotation.x += rotationSpeed * (1 + Math.sin(elapsed * breathingSpeed) * 0.3);
    this.cinematicObject.rotation.y += rotationSpeed * 1.8 * (1 + Math.cos(elapsed * breathingSpeed * 0.7) * 0.2);
    this.cinematicObject.rotation.z += rotationSpeed * 0.8 * (1 + Math.sin(elapsed * breathingSpeed * 1.3) * 0.4);

    // Breathing scale effect during stillness
    if (this.cinematicPhase === 'stillness' || this.cinematicPhase === 'complete') {
      const breathe = 1 + Math.sin(elapsed * 1.5) * 0.05;
      this.cinematicObject.scale.setScalar(breathe);
    }

    // Update text fragments with floating motion
    this.textFragments.forEach((fragment, index) => {
      const time = elapsed + index * 0.5;
      fragment.rotation.x += 0.01;
      fragment.rotation.y += 0.008;
      fragment.position.y += Math.sin(time * 2) * 0.002;
      fragment.position.x += Math.cos(time * 1.5) * 0.001;
    });
  }

  private updateIgnitionPulse(elapsed: number): void {
    if (this.cinematicPhase !== 'ignition') return;

    const ignitionProgress = (elapsed - 0.5) / 1.0;
    const pulseIntensity = Math.sin(ignitionProgress * Math.PI * 6) * 2;

    // Update pulse light
    const pulseLight = this.advancedLighting.getObjectByName('pulseLight') as THREE.PointLight;
    if (pulseLight) {
      pulseLight.intensity = Math.max(0, pulseIntensity);
    }

    // Update pulse rings with expanding waves
    this.pulseRings.forEach((ring, index) => {
      const ringMaterial = ring.material as THREE.MeshBasicMaterial;
      const delay = index * 0.1;
      const progress = Math.max(0, ignitionProgress - delay);
      
      if (progress > 0) {
        const scale = 1 + progress * 3;
        ring.scale.setScalar(scale);
        ringMaterial.opacity = Math.max(0, (1 - progress) * 0.8);
      }
    });

    // Center burst effect
    const centerBurst = this.ignitionPulse.getObjectByName('centerBurst') as THREE.Mesh;
    if (centerBurst) {
      const burstMaterial = centerBurst.material as THREE.MeshBasicMaterial;
      const burstScale = 1 + ignitionProgress * 15;
      centerBurst.scale.setScalar(burstScale);
      burstMaterial.opacity = Math.max(0, (1 - ignitionProgress) * 1.5);
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
        
        // Central core ignition
        const centralCore = this.cinematicObject.getObjectByName('centralCore') as THREE.Mesh;
        if (centralCore?.material) {
          const material = centralCore.material as THREE.MeshPhysicalMaterial;
          material.opacity = ignitionProgress * 0.9;
          material.emissiveIntensity = ignitionProgress * 0.8;
        }

        // Halo glow
        const halo = this.cinematicObject.getObjectByName('halo') as THREE.Mesh;
        if (halo?.material) {
          const material = halo.material as THREE.MeshBasicMaterial;
          material.opacity = ignitionProgress * 0.1;
        }

        // Advanced lighting intensity
        const dramaticLight = this.advancedLighting.getObjectByName('dramaticLight') as THREE.DirectionalLight;
        if (dramaticLight) {
          dramaticLight.intensity = ignitionProgress * 0.5;
        }
        break;
      }

      case 'reveal': {
        const revealProgress = (elapsed - 1.5) / 1.5;
        
        // Faceted cube reveal with beam-of-light effect
        const facetedCube = this.cinematicObject.getObjectByName('facetedCube') as THREE.Mesh;
        if (facetedCube?.material) {
          const material = facetedCube.material as THREE.MeshPhysicalMaterial;
          material.opacity = revealProgress * 0.8;
          material.emissiveIntensity = revealProgress * 0.3;
        }

        // Outer wireframe structure
        const outerWireframe = this.cinematicObject.getObjectByName('outerWireframe') as THREE.LineSegments;
        if (outerWireframe?.material) {
          const material = outerWireframe.material as THREE.LineBasicMaterial;
          material.opacity = revealProgress * 0.6;
        }

        // Text fragments reveal
        this.textFragments.forEach((fragment, index) => {
          if (fragment.material) {
            const material = fragment.material as THREE.MeshPhysicalMaterial;
            const delay = index * 0.08;
            const progress = Math.max(0, revealProgress - delay);
            material.opacity = progress * 0.7;
            material.emissiveIntensity = progress * 0.4;
          }
        });

        // Volume light for dramatic effect
        const volumeLight = this.advancedLighting.getObjectByName('volumeLight') as THREE.SpotLight;
        if (volumeLight) {
          volumeLight.intensity = revealProgress * 0.8;
        }

        // Rim lighting
        const rimLight1 = this.advancedLighting.getObjectByName('rimLight1') as THREE.DirectionalLight;
        const rimLight2 = this.advancedLighting.getObjectByName('rimLight2') as THREE.DirectionalLight;
        if (rimLight1) rimLight1.intensity = revealProgress * 0.3;
        if (rimLight2) rimLight2.intensity = revealProgress * 0.2;
        break;
      }

      case 'atmosphere': {
        const atmosphereProgress = (elapsed - 3.0) / 1.0;
        
        // Atmospheric particles fade in
        this.atmosphericLayers.forEach((layer, index) => {
          if (layer.material) {
            const material = layer.material as THREE.PointsMaterial;
            const delay = index * 0.2;
            const progress = Math.max(0, atmosphereProgress - delay);
            material.opacity = progress * (0.6 - index * 0.1);
          }
        });

        // Ambient particles
        const ambientSystem = this.ambientParticles.getObjectByName('ambientParticles') as THREE.Points;
        if (ambientSystem?.material) {
          const material = ambientSystem.material as THREE.PointsMaterial;
          material.opacity = atmosphereProgress * 0.3;
        }

        // Atmospheric color shift
        const tealAmount = atmosphereProgress * 0.08;
        this.scene.background = new THREE.Color(
          0.04 + tealAmount * 0.3,
          0.04 + tealAmount * 0.8,
          0.04 + tealAmount * 1.0
        );

        // Ambient light increase
        const ambientLight = this.advancedLighting.getObjectByName('ambientLight') as THREE.AmbientLight;
        if (ambientLight) {
          ambientLight.intensity = 0.05 + atmosphereProgress * 0.1;
        }
        break;
      }

      case 'stillness':
      case 'complete': {
        // Maintain atmospheric state with subtle pulsing
        const pulseLight = this.advancedLighting.getObjectByName('pulseLight') as THREE.PointLight;
        if (pulseLight) {
          pulseLight.intensity = 0.1 + Math.sin(elapsed * 2) * 0.05;
        }
        break;
      }
    }
  }

  private updateAtmosphericParticles(elapsed: number): void {
    if (this.cinematicPhase === 'preload' || this.cinematicPhase === 'ignition') return;

    this.atmosphericLayers.forEach((layer, layerIndex) => {
      const positions = layer.geometry.attributes.position.array as Float32Array;
      const velocities = layer.geometry.attributes.velocity?.array as Float32Array;
      
      if (!velocities) return;

      for (let i = 0; i < positions.length; i += 3) {
        // Apply velocities with breathing motion
        const breathingInfluence = Math.sin(elapsed * 1.5 + layerIndex) * 0.001;
        positions[i] += velocities[i] + breathingInfluence;
        positions[i + 1] += velocities[i + 1] + breathingInfluence * 0.5;
        positions[i + 2] += velocities[i + 2] + breathingInfluence * 0.8;

        // Orbital motion around center
        const centerX = positions[i];
        const centerZ = positions[i + 2];
        const radius = Math.sqrt(centerX * centerX + centerZ * centerZ);
        
        if (radius > 1) {
          const angle = Math.atan2(centerZ, centerX) + 0.005;
          positions[i] = radius * Math.cos(angle);
          positions[i + 2] = radius * Math.sin(angle);
        }

        // Reset particles that drift too far
        const distance = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);
        if (distance > 8 + layerIndex * 2) {
          const resetRadius = 3 + layerIndex * 2;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          positions[i] = resetRadius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = resetRadius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = resetRadius * Math.cos(phi);
        }
      }

      layer.geometry.attributes.position.needsUpdate = true;
    });
  }

  private updateAmbientParticles(_elapsed: number): void {
    if (this.cinematicPhase === 'preload') return;

    const ambientSystem = this.ambientParticles.getObjectByName('ambientParticles') as THREE.Points;
    if (!ambientSystem) return;

    const positions = ambientSystem.geometry.attributes.position.array as Float32Array;
    const velocities = ambientSystem.geometry.attributes.velocity?.array as Float32Array;
    const life = ambientSystem.geometry.attributes.life?.array as Float32Array;

    if (!velocities || !life) return;

    for (let i = 0; i < positions.length; i += 3) {
      const lifeIndex = i / 3;
      
      // Update life cycle
      life[lifeIndex] += 0.005;
      if (life[lifeIndex] > 1) {
        life[lifeIndex] = 0;
        // Respawn particle
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
      }

      // Apply gentle drift
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
    }

    ambientSystem.geometry.attributes.position.needsUpdate = true;
    ambientSystem.geometry.attributes.life.needsUpdate = true;
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

        // Fade all objects
        this.cinematicObject.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).material || (child as THREE.LineSegments).material) {
            const material = (child as THREE.Mesh | THREE.LineSegments).material as THREE.Material & { opacity: number };
            if ('opacity' in material) {
              material.opacity = initialOpacity + (targetOpacity - initialOpacity) * progress;
            }
          }
        });

        // Fade particle systems
        this.atmosphericLayers.forEach(layer => {
          if (layer.material) {
            const material = layer.material as THREE.PointsMaterial;
            material.opacity = (initialOpacity + (targetOpacity - initialOpacity) * progress) * 0.6;
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
