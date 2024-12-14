import { IModule } from "..";

export class Application {
  private modules: IModule[] = [];

  constructor() {}

  public use<T extends IModule>(
    module: new (...args: any[]) => T,
    ...args: any[]
  ): void {
    const m = new module(...args);
    this.modules.push(m);
  }

  protected beforeRun(): void {}

  protected run(): void {
    this.beforeRun();
    for (const m of this.modules) {
      m.default();
    }
  }

  protected exit(exitCode?: number): void {
    process.exit(exitCode ? exitCode : 0);
  }
}
