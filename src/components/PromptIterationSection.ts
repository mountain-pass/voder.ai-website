/**
 * Enhanced Prompt-Driven Iteration section with Live Prompt Interaction System
 * Replaces static mockup with sophisticated curated demonstration
 */

import { LivePromptInteraction } from './LivePromptInteraction';

class PromptIterationSection {
  private livePromptSystem: LivePromptInteraction;

  constructor(container: HTMLElement) {
    // Create the container for the live prompt interaction system
    const section = document.createElement('div');
    section.className = 'prompt-iteration-wrapper';
    container.appendChild(section);

    // Initialize the sophisticated live prompt interaction system
    this.livePromptSystem = new LivePromptInteraction(section);
  }

  public destroy(): void {
    if (this.livePromptSystem) {
      this.livePromptSystem.destroy();
    }
  }
}

export { PromptIterationSection };
