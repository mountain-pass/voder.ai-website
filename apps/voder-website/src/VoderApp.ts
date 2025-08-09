import { PageRenderer, ServiceContainer } from '@voder/core';
import { BrandEntrySection } from '@voder/brand-entry-section';

export class VoderApp {
  private pageRenderer: PageRenderer;
  private serviceContainer: ServiceContainer;

  constructor() {
    this.serviceContainer = new ServiceContainer();
    this.pageRenderer = new PageRenderer('app');
    this.init();
  }

  private async init(): Promise<void> {
    // Register sections
    this.pageRenderer.registerSection(new BrandEntrySection());

    // Render initial section
    await this.pageRenderer.renderSection('brand-entry', {
      id: 'brand-entry',
      content: {},
      config: {}
    });
  }

  public getServices(): ServiceContainer {
    return this.serviceContainer;
  }
}
