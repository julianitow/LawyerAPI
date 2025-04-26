import { Context } from "vm";
import { BaseController } from "./BaseController";
import Router from "koa-router";
import { _PresentationDAO } from "../../platforms/mongo/dao/Presentation/PresentationDAO";
import { IPresentation } from "../../definitions/interfaces";
import { PresentationDocument } from "../../definitions/Models/Presentation";

export class PresentationController extends BaseController {
  readonly path = '/presentation';
  unsecuredRoutes?: string[] = [`${this.path}`];

  constructor() {
    super();
  }

  async fetchPresentation(ctx: Context): Promise<void> {
    try {
      const presentations = await _PresentationDAO.fetchAll()
      if (presentations.length === 1) {
        ctx.body = presentations[0];
      } else {
        throw new Error('Too many presentations in db, something gone wrong');
      }
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  async updateOrCreate(ctx: Context): Promise<void> {
    let create = false;
    try {
      if ((await _PresentationDAO.fetchAll()).length === 0) {
        create = true;
      }
    }
    catch(err) {
      console.error('mongoDB fetch error:', err);
      ctx.status = 500;
    }

    try {
      const presentation = ctx.request.body as IPresentation;
      create ? _PresentationDAO.create(presentation) : _PresentationDAO.update(presentation);
      ctx.status = create ? 201 : 200;
    } catch(err) {
      console.error('updateOrCreateError', err);
      ctx.status = 500;
    }
  }

  build(): Router {
    const router = super.build();

    router.get('/', this.fetchPresentation.bind(this));
    router.put('/edit', this.updateOrCreate.bind(this));

    return router;
  }
}