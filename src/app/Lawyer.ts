import { IApplication } from "../definitions/interfaces";
import { Application } from "./Application";
import Router from "koa-router";
import {
  ArticleController,
  BaseController,
  GoogleAPIController,
  HomeController,
  UserController,
} from "./controllers";

export class Lawyer extends Application implements IApplication {
  public unsecuredRoutes: string[] = [];
  private readonly controllers: BaseController[] = [];

  constructor() {
    super();
  }

  continue(): void {
    super.continue();
    const abilitiesController = new HomeController();
    const articleController = new ArticleController();
    const userController = new UserController();
    const googleApiController = new GoogleAPIController();
    this.controllers.push(abilitiesController);
    this.controllers.push(articleController);
    this.controllers.push(userController);
    this.controllers.push(googleApiController);
  }

  routers(): Router[] {
    const routers = [];
    for (const c of this.controllers) {
      if (c.unsecuredRoutes) {
        for (const route of c.unsecuredRoutes) {
          this.unsecuredRoutes.push(`${c.path}${route}`);
        }
      }
      routers.push(c.build());
    }
    return routers;
  }

  run(): void {
    super.run();
  }
}
