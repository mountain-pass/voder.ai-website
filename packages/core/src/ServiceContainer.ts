import { ServiceRegistry } from '@voder/shared';
import { 
  AnimationService, 
  ScrollService, 
  AccessibilityService, 
  AssetService 
} from '@voder/services';

export class ServiceContainer {
  private services: ServiceRegistry;

  constructor() {
    this.services = {
      animation: new AnimationService(),
      scroll: new ScrollService(),
      accessibility: new AccessibilityService(),
      asset: new AssetService()
    };
  }

  getService<T extends keyof ServiceRegistry>(serviceName: T): ServiceRegistry[T] {
    return this.services[serviceName];
  }

  registerService<T extends keyof ServiceRegistry>(serviceName: T, service: ServiceRegistry[T]): void {
    this.services[serviceName] = service;
  }

  getAllServices(): ServiceRegistry {
    return { ...this.services };
  }
}
