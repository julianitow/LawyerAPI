import { Context } from "vm";
import { BaseController } from "./BaseController";
import Router from "koa-router";

export class PresentationController extends BaseController {
  readonly path = '/presentation';
  unsecuredRoutes?: string[] = [`${this.path}`];

  async fetchPresentation(ctx: Context): Promise<void> {
    try {
      ctx.body = { title: 'test', content: 'test'};
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  build(): Router {
    const router = super.build();
    
    router.get('/', this.fetchPresentation.bind(this));

    return router;
  }
}