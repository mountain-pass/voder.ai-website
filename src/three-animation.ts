import * as THREE from 'three';

interface ThreeAnimationOptions {
  container: HTMLElement;
  fallbackContent?: string;
}

export class ThreeAnimation {
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private cube?: THREE.Mesh; // The glass cube
  private animationFrameId?: number;
  private container: HTMLElement;
  private isInitialized = false;
  private supportsWebGL = false;

  constructor(options: ThreeAnimationOptions) {
    this.container = options.container;

    this.checkWebGLSupport();
  }

  // Public method for testing device detection
  public getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof navigator === 'undefined') return 'desktop';

    const userAgent = navigator.userAgent;

    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    );

    const isTablet = /iPad|Android(?!.*Mobile)|Kindle|Silk/i.test(userAgent);

    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';

    return 'desktop';
  }

  // Public method for testing responsive calculations
  public getResponsiveConfig(): { fov: number; cameraZ: number } {
    if (typeof window === 'undefined') {
      return { fov: 65, cameraZ: 5 };
    }

    const deviceType = this.getDeviceType();

    let fov: number;

    let cameraZ: number;

    if (deviceType === 'mobile') {
      fov = 75; // Wide FOV for mobile
      cameraZ = 6; // Move camera back for mobile
    } else if (deviceType === 'tablet') {
      fov = 70; // Medium-wide FOV for tablet
      cameraZ = 5.5; // Slightly back for tablet
    } else {
      fov = 65; // Standard FOV for desktop
      cameraZ = 5; // Standard position for desktop
    }

    return { fov, cameraZ };
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

    // Camera setup - Use container dimensions instead of viewport
    const containerWidth = this.container.clientWidth || 400;

    const containerHeight = this.container.clientHeight || 400;

    // Use responsive configuration
    const config = this.getResponsiveConfig();

    this.camera = new THREE.PerspectiveCamera(
      config.fov,
      containerWidth / containerHeight, // Use container aspect ratio
      0.1,
      1000,
    );

    // Position camera using responsive configuration
    const deviceType = this.getDeviceType();

    if (deviceType === 'mobile') {
      // Mobile: Further back with wide FOV to show complete cube
      this.camera.position.x = 0;
      this.camera.position.y = 20;
      this.camera.position.z = 45;
    } else if (deviceType === 'tablet') {
      // Tablet: Medium distance with good viewing angle
      this.camera.position.x = 0;
      this.camera.position.y = 18;
      this.camera.position.z = 42;
    } else {
      // Desktop: Original positioning works well
      this.camera.position.x = 0;
      this.camera.position.y = 16;
      this.camera.position.z = 40;
    }

    if (this.camera.lookAt) {
      this.camera.lookAt(0, 0, 0); // Look at cube center
    }

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(containerWidth, containerHeight); // Use container dimensions
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Clean, elegant lighting for glass cube with enhanced environment
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Reduced ambient for better glass contrast

    this.scene.add(ambientLight);

    // Main light from top-right - enhanced for glass reflections
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);

    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // Softer fill light from left - teal tinted to complement glass
    const fillLight = new THREE.DirectionalLight(0x00aaff, 0.8);

    fillLight.position.set(-10, 8, 5);
    this.scene.add(fillLight);

    // Enhanced back rim light for glass edge definition
    const rimLight = new THREE.DirectionalLight(0x0066aa, 0.6);

    rimLight.position.set(0, 5, -15);
    this.scene.add(rimLight);

    // Additional side lights for glass reflections
    const sideLight1 = new THREE.DirectionalLight(0x00cccc, 0.3);

    sideLight1.position.set(15, 8, 0);
    this.scene.add(sideLight1);

    const sideLight2 = new THREE.DirectionalLight(0x0088aa, 0.3);

    sideLight2.position.set(-15, 8, 0);
    this.scene.add(sideLight2);

    // Create AWESOME living cube with wisps
    this.createAwesomeCube();

    // Create simple environment for reflections (after cube creation)
    this.setupEnvironmentForGlass();

    // Add scroll interaction for cube rotation
    this.addScrollInteraction();

    // Start animation loop
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private createAwesomeCube(): void {
    // Create proper rounded cube using the correct RoundedBoxGeometry implementation
    const geometry = this.createRoundedBoxGeometry(6, 6, 6, 2, 0.2);

    // Advanced glass material with realistic physical properties
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff, // Teal brand color
      transparent: true,
      opacity: 0.2, // 80% transparency (meets 70-85% requirement)
      transmission: 0.9, // High transmission for realistic glass light passing
      thickness: 1.0, // Glass thickness for depth perception
      roughness: 0.05, // Very smooth surface with minimal imperfections
      metalness: 0.0, // Non-metallic for pure glass appearance
      clearcoat: 1.0, // Full clearcoat for surface reflections
      clearcoatRoughness: 0.02, // Very smooth clearcoat for sharp reflections
      ior: 1.5, // Index of refraction for realistic glass
      reflectivity: 0.8, // High reflectivity for glass-like surface
      envMapIntensity: 1.0, // Environment map reflection intensity
      side: THREE.DoubleSide,
    });

    this.cube = new THREE.Mesh(geometry, material);

    this.scene?.add(this.cube);

    // Simple orientation: cube sits on bottom face, rotated 45° to show corner-to-camera
    this.cube.rotation.y = Math.PI / 4; // 45 degrees - shows two faces at corner angle
  }

  private setupEnvironmentForGlass(): void {
    // Create a simple environment map for glass reflections
    // Using a gradient environment to create subtle reflections
    const envMapSize = 256;

    const envMapTexture = new THREE.DataTexture(
      new Uint8Array(envMapSize * envMapSize * 4),
      envMapSize,
      envMapSize,
      THREE.RGBAFormat,
    );

    // Create a simple gradient environment
    const data = envMapTexture.image.data;

    for (let i = 0; i < envMapSize; i++) {
      for (let j = 0; j < envMapSize; j++) {
        const index = (i * envMapSize + j) * 4;

        const x = (j / envMapSize) * 2 - 1;

        const y = (i / envMapSize) * 2 - 1;

        const distance = Math.sqrt(x * x + y * y);

        // Create a radial gradient with teal tones
        const intensity = Math.max(0, 1 - distance);

        data[index] = Math.floor(0 * 255 * intensity); // R
        data[index + 1] = Math.floor(0.8 * 255 * intensity); // G (teal)
        data[index + 2] = Math.floor(0.9 * 255 * intensity); // B (teal)
        data[index + 3] = 255; // A
      }
    }

    envMapTexture.needsUpdate = true;
    envMapTexture.mapping = THREE.EquirectangularReflectionMapping;

    // Apply environment map to the scene for reflections
    if (this.scene) {
      this.scene.environment = envMapTexture;
    }

    // Apply the environment map to the cube material if it exists
    if (this.cube && this.cube.material instanceof THREE.MeshPhysicalMaterial) {
      this.cube.material.envMap = envMapTexture;
      this.cube.material.needsUpdate = true;
    }
  }

  private createRoundedBoxGeometry(
    width: number,
    height: number,
    depth: number,
    segments: number,
    radius: number,
  ): THREE.BufferGeometry {
    const _tempNormal = new THREE.Vector3();

    const getUv = (
      faceDirVector: THREE.Vector3,
      normal: THREE.Vector3,
      uvAxis: string,
      projectionAxis: string,
      cornerRadius: number,
      sideLength: number,
    ): number => {
      const totArcLength = (2 * Math.PI * cornerRadius) / 4;

      const centerLength = Math.max(sideLength - 2 * cornerRadius, 0);

      const halfArc = Math.PI / 4;

      _tempNormal.copy(normal);
      (_tempNormal as any)[projectionAxis] = 0;
      _tempNormal.normalize();

      const arcUvRatio = (0.5 * totArcLength) / (totArcLength + centerLength);

      const arcAngleRatio = 1.0 - _tempNormal.angleTo(faceDirVector) / halfArc;

      if (Math.sign((_tempNormal as any)[uvAxis]) === 1) {
        return arcAngleRatio * arcUvRatio;
      } else {
        const lenUv = centerLength / (totArcLength + centerLength);

        return lenUv + arcUvRatio + arcUvRatio * (1.0 - arcAngleRatio);
      }
    };

    // ensure segments is odd so we have a plane connecting the rounded corners
    segments = segments * 2 + 1;

    // ensure radius isn't bigger than shortest side
    radius = Math.min(width / 2, height / 2, depth / 2, radius);

    const geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);

    // if we just have one segment we're the same as a regular box
    if (segments === 1) {
      geometry.scale(width, height, depth);

      return geometry;
    }

    const geometry2 = geometry.toNonIndexed();

    const newGeometry = new THREE.BufferGeometry();

    newGeometry.setAttribute('position', geometry2.attributes.position);
    newGeometry.setAttribute('normal', geometry2.attributes.normal);
    newGeometry.setAttribute('uv', geometry2.attributes.uv);

    const position = new THREE.Vector3();

    const normal = new THREE.Vector3();

    const box = new THREE.Vector3(width, height, depth).divideScalar(2).subScalar(radius);

    const positions = newGeometry.attributes.position.array as Float32Array;

    const normals = newGeometry.attributes.normal.array as Float32Array;

    const uvs = newGeometry.attributes.uv.array as Float32Array;

    const faceTris = positions.length / 6;

    const faceDirVector = new THREE.Vector3();

    const halfSegmentSize = 0.5 / segments;

    for (let i = 0, j = 0; i < positions.length; i += 3, j += 2) {
      position.fromArray(positions, i);
      normal.copy(position);
      normal.x -= Math.sign(normal.x) * halfSegmentSize;
      normal.y -= Math.sign(normal.y) * halfSegmentSize;
      normal.z -= Math.sign(normal.z) * halfSegmentSize;
      normal.normalize();

      positions[i + 0] = box.x * Math.sign(position.x) + normal.x * radius;
      positions[i + 1] = box.y * Math.sign(position.y) + normal.y * radius;
      positions[i + 2] = box.z * Math.sign(position.z) + normal.z * radius;

      normals[i + 0] = normal.x;
      normals[i + 1] = normal.y;
      normals[i + 2] = normal.z;

      const side = Math.floor(i / faceTris);

      switch (side) {
        case 0: // right
          faceDirVector.set(1, 0, 0);
          uvs[j + 0] = getUv(faceDirVector, normal, 'z', 'y', radius, depth);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'z', radius, height);
          break;
        case 1: // left
          faceDirVector.set(-1, 0, 0);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'z', 'y', radius, depth);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'z', radius, height);
          break;
        case 2: // top
          faceDirVector.set(0, 1, 0);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'x', 'z', radius, width);
          uvs[j + 1] = getUv(faceDirVector, normal, 'z', 'x', radius, depth);
          break;
        case 3: // bottom
          faceDirVector.set(0, -1, 0);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'x', 'z', radius, width);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'z', 'x', radius, depth);
          break;
        case 4: // front
          faceDirVector.set(0, 0, 1);
          uvs[j + 0] = 1.0 - getUv(faceDirVector, normal, 'x', 'y', radius, width);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'x', radius, height);
          break;
        case 5: // back
          faceDirVector.set(0, 0, -1);
          uvs[j + 0] = getUv(faceDirVector, normal, 'x', 'y', radius, width);
          uvs[j + 1] = 1.0 - getUv(faceDirVector, normal, 'y', 'x', radius, height);
          break;
      }
    }

    return newGeometry;
  }

  private addScrollInteraction(): void {
    let ticking = false;

    const updateOnScroll = () => {
      if (!this.cube) {
        ticking = false;

        return;
      }

      // Calculate responsive rotation multiplier based on device type
      const deviceType = this.getDeviceType();

      const rotationMultiplier = deviceType === 'mobile' ? 0.003 : 0.005;

      // Map scroll position directly to Y-axis rotation
      // Scroll down = rotate left (negative), scroll up = rotate right (positive)
      const scrollPosition = window.scrollY;

      const rotationY = Math.PI / 4 + scrollPosition * rotationMultiplier;

      // Apply rotation to cube (maintains the initial 45-degree corner orientation)
      this.cube.rotation.y = rotationY;

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

    // Static cube - no animation, just render
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.camera || !this.renderer) return;

    // Skip resize handling on mobile to prevent size jumps (workaround for mobile viewport issue)
    if (this.getDeviceType() === 'mobile') {
      return;
    }

    // Update for container dimensions instead of viewport
    const containerWidth = this.container.clientWidth || 400;

    const containerHeight = this.container.clientHeight || 400;

    // Use responsive configuration
    const config = this.getResponsiveConfig();

    this.camera.fov = config.fov;

    this.camera.aspect = containerWidth / containerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(containerWidth, containerHeight);

    // Update camera position based on device type
    const deviceType = this.getDeviceType();

    if (deviceType === 'mobile') {
      // Mobile: Much closer camera with narrow FOV
      this.camera.position.x = 0;
      this.camera.position.y = 8;
      this.camera.position.z = 15;
    } else if (deviceType === 'tablet') {
      // Tablet: Closer camera with medium FOV
      this.camera.position.x = 0;
      this.camera.position.y = 10;
      this.camera.position.z = 20;
    } else {
      // Desktop: Original positioning with wide FOV
      this.camera.position.x = 0;
      this.camera.position.y = 16;
      this.camera.position.z = 40;
    }

    if (this.camera.lookAt) {
      this.camera.lookAt(0, 0, 0); // Ensure camera still looks at center
    }
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Clean up glass cube
    if (this.cube && this.cube.parent) {
      this.cube.parent.remove(this.cube);
      this.cube.geometry.dispose();
      if (this.cube.material instanceof THREE.Material) {
        this.cube.material.dispose();
      }
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    // Clear the container
    if (this.container) {
      this.container.innerHTML = '';
    }

    window.removeEventListener('resize', () => this.handleResize());
    // Note: Individual scroll event listeners are cleaned up automatically when the window is destroyed
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
