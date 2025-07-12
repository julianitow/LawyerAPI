import NodeCache from "node-cache";
import { Application } from "../../app";
import { IModule } from "../../definitions/interfaces";

export type CacheSpecifier = NodeCache.Options;

export class CacheModule implements IModule {

  private cache?: NodeCache;

  constructor(private readonly specifier? : CacheSpecifier) {}

  default(): void {
    this.initCache();
    if (this.cache === undefined) {
      throw new Error('Cache is undefined');
    }
    Application.sharedContext = { cache: this.cache };
  }

  private initCache(): void {
    const cacheSpecifier = this.specifier ?? {
      stdTTL: 0,
      checkperiod: 0,
      useClones: true,
    };
    this.cache = new NodeCache(cacheSpecifier);
  }
}