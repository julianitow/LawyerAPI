import Router from "koa-router";
import { AbilitiesController } from "./AbilitiesController";
import { PresentationController } from "./PresentationController";
import { BaseController } from "s1mpl3-api-l1b";

export class HomeController extends BaseController {
  readonly path = "/home";
  
  unsecuredRoutes?: string[];

  private subControllers: BaseController[];

  constructor() {
    super();
    this.subControllers = [ new PresentationController(), new AbilitiesController() ];
    this.unsecuredRoutes = 
      this.subControllers.map(sc => {
        if (sc.unsecuredRoutes !== undefined) {
          return sc.unsecuredRoutes;
        }
        return '';
      }).flat();
  }

  build(): Router {
    const router = super.build();
    for (const sc of this.subControllers) {
      router.use(sc.build().routes());
    }
    return router;
  }
}
