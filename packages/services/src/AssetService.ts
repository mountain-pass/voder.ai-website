import { IAssetService } from '@voder/shared';

export class AssetService implements IAssetService {
  private cache: Map<string, any> = new Map();

  async loadAsset(url: string): Promise<any> {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      const response = await fetch(url);
      const asset = await response.blob();
      this.cache.set(url, asset);
      return asset;
    } catch (error) {
      console.error(`Failed to load asset: ${url}`, error);
      throw error;
    }
  }

  async preloadAssets(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.loadAsset(url));
    await Promise.all(promises);
  }
}
