import { Context } from "koa";
import Router from "koa-router";
import { ArticleDAO, _ArticleDAO } from "../../platforms/mongo";
import { BaseController } from "./BaseController";
import { IArticle } from "../../definitions/interfaces";

import * as fs from "fs";

export class ArticleController extends BaseController {
  readonly path = "/article";
  private readonly articleDAO: ArticleDAO;
  unsecuredRoutes?: string[] = [`/all`];

  constructor() {
    super();
    this.articleDAO = _ArticleDAO;
  }

  async update(ctx: Context): Promise<void> {
    try {
      const article = ctx.request.body as IArticle;
      if (article.image !== undefined) {
        article.image.content = Buffer.from(article.image.content); // convert uint8array to Buffer
      }
      this.articleDAO.update(article);
      ctx.status = 204;
    } catch (err) {
      console.error("ERR_UPDT", err);
      ctx.status = 500;
    }
  }

  async create(ctx: Context): Promise<void> {
    try {
      const article = ctx.request.body as IArticle;
      if (article.image !== undefined) {
        article.image.content = Buffer.from(article.image.content); // convert uint8array to Buffer
      }
      ctx.body = await this.articleDAO.create(article);
      ctx.status = 201;
    } catch (err) {
      console.error("ERR_CREAT", err);
      ctx.status = 500;
    }
  }

  async fetchAll(ctx: Context): Promise<void> {
    try {
      ctx.body = await this.articleDAO.fetchAll();
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  build(): Router {
    const router = super.build();
    router.get("/all", this.fetchAll.bind(this));
    router.post("/create", this.create.bind(this));
    router.patch("/edit", this.update.bind(this));
    return router;
  }
}
