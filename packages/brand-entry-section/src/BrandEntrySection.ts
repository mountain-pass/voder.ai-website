import { ISection, SectionData } from '@voder/shared';

export class BrandEntrySection implements ISection {
  readonly id = 'brand-entry';
  private element: HTMLElement | null = null;

  render(data: SectionData): HTMLElement {
    this.element = document.createElement('section');
    this.element.id = this.id;
    this.element.className = 'brand-entry-section';
    
    this.element.innerHTML = `
      <div class="brand-entry-content">
        <h1>Welcome to Voder.ai</h1>
        <p>Revolutionizing AI-powered development</p>
        <div id="canvas-3d-container"></div>
      </div>
    `;

    return this.element;
  }

  destroy(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
