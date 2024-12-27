import Router from "koa-router";
import { BaseController } from "./BaseController";
import { GoogleAPI } from "../../modules";
import { Context } from "koa";

export class GoogleAPIController extends BaseController {
  readonly path: string = "/google";
  constructor() {
    super();
  }

  async fetchQueriesStats(ctx: Context): Promise<void> {
    const from = ctx.request.query.from as string;
    const to = ctx.request.query.to as string;
    if (from === undefined || to === undefined) {
      ctx.status = 400;
      ctx.body = "Missing date interval";
    }

    try {
      ctx.body = await GoogleAPI.instance.getSearchAnalytics(from, to);
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  build(): Router {
    const router = super.build();
    router.get("/queries", this.fetchQueriesStats.bind(this));
    return router;
  }
}
