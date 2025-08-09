import { IEffect, EffectConfig } from '@voder/shared';
import * as THREE from 'three';

export class Canvas3DEffect implements IEffect {
  readonly name = 'canvas3d';
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;

  async apply(element: HTMLElement, config: EffectConfig): Promise<void> {
    this.initScene(element);
    this.createCube();
    this.animate();
  }

  private initScene(container: HTMLElement): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
  }

  private createCube(): void {
    if (!this.scene) return;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    if (this.camera) {
      this.camera.position.z = 5;
    }
  }

  private animate(): void {
    if (!this.renderer || !this.scene || !this.camera) return;

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer!.render(this.scene!, this.camera!);
    };
    animate();
  }
}
