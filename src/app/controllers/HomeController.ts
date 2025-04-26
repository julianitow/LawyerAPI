import Router from "koa-router";
import { BaseController } from "./BaseController";
import { AbilitiesController } from "./AbilitiesController";
import { PresentationController } from "./PresentationController";

export class HomeController extends BaseController {
  readonly path = "/home";
  
  unsecuredRoutes?: string[];

  private subControllers: BaseController[];

  constructor() {
    super();
    this.subControllers = [ new PresentationController(), new AbilitiesController() ];
    this.unsecuredRoutes = this.subControllers.map(sc => sc.unsecuredRoutes!.join());
  }

  build(): Router {
    const router = super.build();
    for (const sc of this.subControllers) {
      router.use(sc.build().routes());
    }
    return router;
  }
}
