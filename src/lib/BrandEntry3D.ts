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
  private qualityPreset: 'high' | 'medium' | 'low' = 'high';

  constructor(private canvas: HTMLCanvasElement) {
    this.detectQualityPreset();
    this.initScene();
    this.createAdvancedLighting();
    this.createCinematicObject();
    this.createIgnitionPulseSystem();
    this.createAtmosphericParticleSystem();
    this.createAmbientParticleLayer();
  }

  private detectQualityPreset(): void {
    // Device-specific quality presets for consistent experience
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      this.qualityPreset = 'low';
      return;
    }

    // Detect device capabilities
    const renderer = gl.getParameter(gl.RENDERER) || '';
    const vendor = gl.getParameter(gl.VENDOR) || '';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    
    // Mobile device detection
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    const isLowPowerGPU = renderer.includes('Mali') || renderer.includes('Adreno') || 
                         renderer.includes('PowerVR') || vendor.includes('Qualcomm');
    
    // Quality preset determination
    if (isMobile || isLowPowerGPU || maxTextureSize < 4096 || maxVertexUniforms < 256) {
      this.qualityPreset = 'low';
    } else if (maxTextureSize < 8192 || maxVertexUniforms < 512) {
      this.qualityPreset = 'medium';
    } else {
      this.qualityPreset = 'high';
    }

    // eslint-disable-next-line no-console
    console.log(`Brand Entry 3D Quality Preset: ${this.qualityPreset}`);
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0A0A0A');
    
    // Quality-based fog settings
    const fogNear = this.qualityPreset === 'low' ? 8 : 5;
    const fogFar = this.qualityPreset === 'low' ? 20 : 25;
    this.scene.fog = new THREE.Fog('#0A0A0A', fogNear, fogFar);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 6);

    // Quality-based renderer settings
    const antialias = this.qualityPreset !== 'low';
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias,
      alpha: true,
      powerPreference: this.qualityPreset === 'high' ? 'high-performance' : 'default'
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    
    // Quality-based pixel ratio
    const maxPixelRatio = this.qualityPreset === 'high' ? 2 : this.qualityPreset === 'medium' ? 1.5 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    
    // Quality-based shadow settings
    this.renderer.shadowMap.enabled = this.qualityPreset !== 'low';
    this.renderer.shadowMap.type = this.qualityPreset === 'high' ? 
      THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  private createAdvancedLighting(): void {
    this.advancedLighting = new THREE.Group();
    
    // Enhanced ambient lighting with refined intensity
    const ambientLight = new THREE.AmbientLight('#24D1D5', 0.04); // Slightly reduced for better contrast
    ambientLight.name = 'ambientLight';
    this.advancedLighting.add(ambientLight);

    // Perfected main dramatic light with enhanced shadow mapping
    const dramaticLight = new THREE.DirectionalLight('#24D1D5', 0);
    dramaticLight.position.set(2.5, 3.5, 5.5); // Optimized position for better shadow casting
    dramaticLight.castShadow = this.qualityPreset !== 'low';
    
    if (dramaticLight.castShadow) {
      // Quality-based shadow mapping settings
      const shadowMapSize = this.qualityPreset === 'high' ? 4096 : 
                           this.qualityPreset === 'medium' ? 2048 : 1024;
      dramaticLight.shadow.mapSize.width = shadowMapSize;
      dramaticLight.shadow.mapSize.height = shadowMapSize;
      dramaticLight.shadow.camera.near = 0.1;
      dramaticLight.shadow.camera.far = 25;
      dramaticLight.shadow.camera.left = -10;
      dramaticLight.shadow.camera.right = 10;
      dramaticLight.shadow.camera.top = 10;
      dramaticLight.shadow.camera.bottom = -10;
      dramaticLight.shadow.bias = -0.0001;
      dramaticLight.shadow.normalBias = 0.02;
    }
    dramaticLight.name = 'dramaticLight';
    this.advancedLighting.add(dramaticLight);

    // Enhanced rim lighting for superior depth perception
    const rimLight1 = new THREE.DirectionalLight('#1a9da1', 0);
    rimLight1.position.set(-2.2, -1.2, -3.2); // Optimized for better rim effect
    rimLight1.castShadow = false; // Rim lights don't need shadows
    rimLight1.name = 'rimLight1';
    this.advancedLighting.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight('#0f7173', 0);
    rimLight2.position.set(1.2, -2.2, 4.2); // Enhanced positioning
    rimLight2.castShadow = false;
    rimLight2.name = 'rimLight2';
    this.advancedLighting.add(rimLight2);

    // Perfected center pulse light for ignition with optimized falloff
    const pulseLight = new THREE.PointLight('#24D1D5', 0, 18, 0.6); // Improved range and decay
    pulseLight.position.set(0, 0, 0);
    pulseLight.castShadow = this.qualityPreset === 'high';
    
    if (pulseLight.castShadow) {
      const shadowMapSize = this.qualityPreset === 'high' ? 1024 : 512;
      pulseLight.shadow.mapSize.width = shadowMapSize;
      pulseLight.shadow.mapSize.height = shadowMapSize;
    }
    pulseLight.name = 'pulseLight';
    this.advancedLighting.add(pulseLight);

    // Enhanced atmospheric volume light with precision targeting
    const volumeLight = new THREE.SpotLight('#24D1D5', 0, 25, Math.PI * 0.25, 0.4, 1.2);
    volumeLight.position.set(0, 6, 9); // Optimized for better beam effect
    volumeLight.target.position.set(0, 0, 0);
    volumeLight.castShadow = this.qualityPreset !== 'low';
    
    if (volumeLight.castShadow) {
      const shadowMapSize = this.qualityPreset === 'high' ? 2048 : 1024;
      volumeLight.shadow.mapSize.width = shadowMapSize;
      volumeLight.shadow.mapSize.height = shadowMapSize;
      volumeLight.shadow.camera.near = 0.1;
      volumeLight.shadow.camera.far = 30;
    }
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

    // Quality-based particle layer configuration
    const layerCount = this.qualityPreset === 'high' ? 3 : this.qualityPreset === 'medium' ? 2 : 1;
    const baseParticleCount = this.qualityPreset === 'high' ? 80 : this.qualityPreset === 'medium' ? 50 : 30;
    
    for (let layer = 0; layer < layerCount; layer++) {
      const particleCount = baseParticleCount + layer * (this.qualityPreset === 'high' ? 40 : 20);
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

        // Enhanced color variation in teal spectrum with quality-based complexity
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
    // Fine-tuned 6-second choreographed sequence timing
    if (elapsed < 0.5) {
      this.cinematicPhase = 'preload';      // 0.0-0.5s: Preload phase
    } else if (elapsed < 1.5) {
      this.cinematicPhase = 'ignition';     // 0.5-1.5s: 1.0s ignition pulse
    } else if (elapsed < 3.0) {
      this.cinematicPhase = 'reveal';       // 1.5-3.0s: 1.5s logo reveal with typing
    } else if (elapsed < 4.0) {
      this.cinematicPhase = 'atmosphere';   // 3.0-4.0s: 1.0s atmosphere fill
    } else if (elapsed < 6.0) {
      this.cinematicPhase = 'stillness';    // 4.0-6.0s: 2.0s stillness with breathing
    } else {
      this.cinematicPhase = 'complete';
    }
  }

  private updateCinematicObject(elapsed: number): void {
    if (this.cinematicPhase === 'preload') return;

    // Enhanced sophisticated rotation with polished living feel
    const breathingSpeed = 1.1; // Slightly slower for more cinematic feel
    const rotationSpeed = 0.0025; // Increased for better visibility
    
    // Multi-layered breathing effects for more complex motion
    const primaryBreathing = Math.sin(elapsed * breathingSpeed) * 0.35;
    const secondaryBreathing = Math.cos(elapsed * breathingSpeed * 0.6) * 0.15;
    const tertiaryBreathing = Math.sin(elapsed * breathingSpeed * 1.4) * 0.08;
    
    this.cinematicObject.rotation.x += rotationSpeed * (1 + primaryBreathing + tertiaryBreathing);
    this.cinematicObject.rotation.y += rotationSpeed * 1.6 * (1 + secondaryBreathing + primaryBreathing * 0.5);
    this.cinematicObject.rotation.z += rotationSpeed * 0.9 * (1 + tertiaryBreathing + secondaryBreathing * 0.7);

    // Enhanced breathing scale effect with more sophisticated animation
    if (this.cinematicPhase === 'stillness' || this.cinematicPhase === 'complete') {
      // Complex breathing pattern with multiple harmonics
      const primaryBreathe = Math.sin(elapsed * 1.3) * 0.04;
      const secondaryBreathe = Math.sin(elapsed * 2.1) * 0.02;
      const tertiaryBreathe = Math.cos(elapsed * 0.8) * 0.015;
      const breathe = 1 + primaryBreathe + secondaryBreathe + tertiaryBreathe;
      this.cinematicObject.scale.setScalar(breathe);
    }

    // Enhanced text fragments with improved floating motion and depth
    this.textFragments.forEach((fragment, index) => {
      const time = elapsed + index * 0.4; // Adjusted phase offset
      const depthFactor = 1 + index * 0.1; // Different motion intensity per fragment
      
      // Enhanced rotation with varied speeds
      fragment.rotation.x += 0.012 * depthFactor;
      fragment.rotation.y += 0.009 * depthFactor;
      fragment.rotation.z += 0.006 * depthFactor;
      
      // Improved floating motion with orbital characteristics
      const orbitRadius = 0.003 * depthFactor;
      fragment.position.y += Math.sin(time * 2.2) * orbitRadius;
      fragment.position.x += Math.cos(time * 1.7) * orbitRadius;
      fragment.position.z += Math.sin(time * 1.9) * orbitRadius * 0.5;
    });
  }

  private updateIgnitionPulse(elapsed: number): void {
    if (this.cinematicPhase !== 'ignition') return;

    const ignitionProgress = (elapsed - 0.5) / 1.0;
    // Enhanced intensity scaling with proper synchronization
    const pulseIntensity = Math.sin(ignitionProgress * Math.PI * 8) * 3.5 * (1 - ignitionProgress * 0.3);

    // Update pulse light with enhanced intensity scaling
    const pulseLight = this.advancedLighting.getObjectByName('pulseLight') as THREE.PointLight;
    if (pulseLight) {
      pulseLight.intensity = Math.max(0, pulseIntensity * 2);
      // Add pulsing color temperature variation
      const colorIntensity = 0.8 + Math.sin(elapsed * 12) * 0.2;
      pulseLight.color.setRGB(0.14 * colorIntensity, 0.82 * colorIntensity, 0.84 * colorIntensity);
    }

    // Enhanced pulse rings with proper ring synchronization
    this.pulseRings.forEach((ring, index) => {
      const ringMaterial = ring.material as THREE.MeshBasicMaterial;
      const delay = index * 0.08; // Tighter synchronization
      const progress = Math.max(0, ignitionProgress - delay);
      
      if (progress > 0) {
        // Enhanced ring expansion with intensity scaling
        const scale = 1 + progress * 4.5; // Increased expansion for better visibility
        ring.scale.setScalar(scale);
        
        // Improved opacity decay with proper synchronization
        const opacity = Math.max(0, (1 - progress) * 0.8 * Math.max(0.2, pulseIntensity * 0.5));
        ringMaterial.opacity = opacity;
        
        // Enhanced ring rotation for dynamic effect
        ring.rotation.z += 0.02 * (index + 1);
      }
    });

    // Enhanced center burst effect
    const centerBurst = this.ignitionPulse.getObjectByName('centerBurst') as THREE.Mesh;
    if (centerBurst) {
      const burstMaterial = centerBurst.material as THREE.MeshBasicMaterial;
      // Improved burst scaling with intensity synchronization
      const burstScale = 1 + Math.max(0, pulseIntensity) * 0.4;
      centerBurst.scale.setScalar(burstScale);
      burstMaterial.opacity = Math.max(0, Math.abs(pulseIntensity) * 0.7);
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
        
        // Enhanced faceted cube reveal with refined beam-of-light effect
        const facetedCube = this.cinematicObject.getObjectByName('facetedCube') as THREE.Mesh;
        if (facetedCube?.material) {
          const material = facetedCube.material as THREE.MeshPhysicalMaterial;
          // Refined opacity curve for smoother reveal
          material.opacity = Math.min(0.9, revealProgress * revealProgress * 1.2);
          // Enhanced emissive intensity with pulsing effect
          const pulseEffect = 1 + Math.sin(elapsed * 3) * 0.1;
          material.emissiveIntensity = revealProgress * 0.4 * pulseEffect;
        }

        // Outer wireframe structure with dynamic intensity
        const outerWireframe = this.cinematicObject.getObjectByName('outerWireframe') as THREE.LineSegments;
        if (outerWireframe?.material) {
          const material = outerWireframe.material as THREE.LineBasicMaterial;
          // Enhanced wireframe visibility with breathing effect
          const breathingEffect = 1 + Math.sin(elapsed * 2.5) * 0.15;
          material.opacity = revealProgress * 0.7 * breathingEffect;
        }

        // Enhanced text fragments reveal with staggered timing
        this.textFragments.forEach((fragment, index) => {
          if (fragment.material) {
            const material = fragment.material as THREE.MeshPhysicalMaterial;
            const delay = index * 0.06; // Tighter staggering for smoother effect
            const progress = Math.max(0, revealProgress - delay);
            // Improved opacity curve with better emissive coordination
            material.opacity = Math.min(0.8, progress * progress * 1.3);
            material.emissiveIntensity = progress * 0.5 * (1 + Math.sin(elapsed * 4 + index) * 0.2);
          }
        });

        // Enhanced volumetric lighting precision
        const volumeLight = this.advancedLighting.getObjectByName('volumeLight') as THREE.SpotLight;
        if (volumeLight) {
          // Improved volumetric light intensity with beam precision
          const beamIntensity = revealProgress * 1.2 * (1 + Math.sin(elapsed * 1.8) * 0.1);
          volumeLight.intensity = Math.min(1.5, beamIntensity);
          // Enhanced beam focus for precise logo reveal
          volumeLight.angle = Math.PI * 0.25 * (1 - revealProgress * 0.3);
          volumeLight.penumbra = 0.3 + revealProgress * 0.4;
        }

        // Enhanced rim lighting with directional precision
        const rimLight1 = this.advancedLighting.getObjectByName('rimLight1') as THREE.DirectionalLight;
        const rimLight2 = this.advancedLighting.getObjectByName('rimLight2') as THREE.DirectionalLight;
        if (rimLight1) {
          rimLight1.intensity = revealProgress * 0.4 * (1 + Math.cos(elapsed * 2) * 0.15);
        }
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

    // Performance optimization: Update particles at reduced frequency
    const updateFrequency = Math.floor(elapsed * 60) % 2 === 0; // Update every other frame
    
    this.atmosphericLayers.forEach((layer, layerIndex) => {
      const positions = layer.geometry.attributes.position.array as Float32Array;
      const velocities = layer.geometry.attributes.velocity?.array as Float32Array;
      const colors = layer.geometry.attributes.color?.array as Float32Array;
      
      if (!velocities || !colors) return;

      // Enhanced visual depth with layered motion
      const layerDepthFactor = 1 + layerIndex * 0.3;
      const phaseOffset = layerIndex * Math.PI * 0.4;

      for (let i = 0; i < positions.length; i += 3) {
        if (updateFrequency) {
          // Enhanced breathing motion with depth variation
          const breathingInfluence = Math.sin(elapsed * 1.2 + phaseOffset) * 0.0015 * layerDepthFactor;
          const orbitalMotion = Math.cos(elapsed * 0.8 + i * 0.01) * 0.001;
          
          // Apply enhanced velocities with atmospheric depth
          positions[i] += velocities[i] + breathingInfluence + orbitalMotion;
          positions[i + 1] += velocities[i + 1] + breathingInfluence * 0.6;
          positions[i + 2] += velocities[i + 2] + breathingInfluence * 0.9 + orbitalMotion * 0.5;
        }

        // Enhanced color variation with atmospheric depth
        const depthInfluence = 0.8 + layerIndex * 0.1;
        const colorPulse = 0.9 + Math.sin(elapsed * 2 + i * 0.05) * 0.1;
        
        colors[i] = 0.14 * depthInfluence * colorPulse;     // R - Enhanced teal variation
        colors[i + 1] = 0.82 * depthInfluence * colorPulse; // G - Improved depth color
        colors[i + 2] = 0.84 * depthInfluence * colorPulse; // B - Sophisticated layering

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

  private updateAmbientParticles(elapsed: number): void {
    if (this.cinematicPhase === 'preload') return;

    const ambientSystem = this.ambientParticles.getObjectByName('ambientParticles') as THREE.Points;
    if (!ambientSystem) return;

    const positions = ambientSystem.geometry.attributes.position.array as Float32Array;
    const velocities = ambientSystem.geometry.attributes.velocity?.array as Float32Array;
    const life = ambientSystem.geometry.attributes.life?.array as Float32Array;

    if (!velocities || !life) return;

    // Quality-based update frequency for performance optimization
    const updateFrequency = this.qualityPreset === 'high' ? 1 : 
                           this.qualityPreset === 'medium' ? 2 : 3;
    const shouldUpdate = Math.floor(elapsed * 60) % updateFrequency === 0;

    for (let i = 0; i < positions.length; i += 3) {
      const lifeIndex = i / 3;
      
      // Update life cycle with elapsed time consideration
      const lifeIncrement = 0.005 * (1 + Math.sin(elapsed * 0.1) * 0.2);
      life[lifeIndex] += lifeIncrement;
      if (life[lifeIndex] > 1) {
        life[lifeIndex] = 0;
        // Respawn particle
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
      }

      // Apply gentle drift with quality-based frequency
      if (shouldUpdate) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];
      }
    }

    // Update geometry only when needed for performance
    if (shouldUpdate) {
      ambientSystem.geometry.attributes.position.needsUpdate = true;
    }
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
