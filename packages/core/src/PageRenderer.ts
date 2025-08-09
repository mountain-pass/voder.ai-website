import { ISection, SectionData } from '@voder/shared';

export class PageRenderer {
  private container: HTMLElement;
  private sections: Map<string, ISection> = new Map();

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
  }

  registerSection(section: ISection): void {
    this.sections.set(section.id, section);
  }

  async renderSection(sectionId: string, data: SectionData): Promise<void> {
    const section = this.sections.get(sectionId);
    if (!section) {
      throw new Error(`Section "${sectionId}" not found`);
    }

    const element = section.render(data);
    this.container.appendChild(element);
  }

  destroySection(sectionId: string): void {
    const section = this.sections.get(sectionId);
    if (section) {
      section.destroy();
      this.sections.delete(sectionId);
    }
  }

  clear(): void {
    this.sections.forEach(section => section.destroy());
    this.sections.clear();
    this.container.innerHTML = '';
  }
}
