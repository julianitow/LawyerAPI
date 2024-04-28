import { Context } from "koa";
import Router from "koa-router";
import { ArticleDAO, _ArticleDAO } from "../../platforms/mongo";
import { BaseController } from "./BaseController";

export class ArticleController extends BaseController {

    readonly path = '/article';
    private readonly articleDAO: ArticleDAO;

    constructor() {
        super();
        this.articleDAO = _ArticleDAO;
    }

    async fetchAll(ctx: Context): Promise<void> {
        try {
            ctx.body = await this.articleDAO.fetchAll();
            ctx.status = 200;
        } catch(err) {
            console.error(err);
            ctx.status = 500;
        }
    }

    build(): Router {
        const router = super.build();
        router.get('/all', this.fetchAll.bind(this));
        return router;
    }
}