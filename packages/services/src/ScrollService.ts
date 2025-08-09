import { IScrollService, EventCallback } from '@voder/shared';

export class ScrollService implements IScrollService {
  private callbacks: EventCallback<number>[] = [];
  private currentPosition: number = 0;

  constructor() {
    this.init();
  }

  private init(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    this.currentPosition = window.scrollY;
    this.callbacks.forEach(callback => callback(this.currentPosition));
  }

  onScroll(callback: EventCallback<number>): void {
    this.callbacks.push(callback);
  }

  getScrollPosition(): number {
    return this.currentPosition;
  }
}
