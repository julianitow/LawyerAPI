import { IApplication } from "../definitions/interfaces";
import { Application } from "./Application";
import Router from "koa-router";
import {
  ArticleController,
  BaseController,
  UserController,
} from "./controllers";

export class Lawyer extends Application implements IApplication {
  public unsecuredRoutes: string[] = [];
  private readonly controllers: BaseController[] = [];

  constructor() {
    super();
  }

  protected beforeRun(): void {
    super.beforeRun();
    const articleController = new ArticleController();
    const userController = new UserController();
    this.controllers.push(articleController);
    this.controllers.push(userController);
  }

  routers(): Router[] {
    const routers = [];
    for (const c of this.controllers) {
      if (c.unsecureRoutes) {
        this.unsecuredRoutes.push(...c.unsecureRoutes);
      }
      routers.push(c.build());
    }
    return routers;
  }

  run(): void {
    super.run();
  }
}
