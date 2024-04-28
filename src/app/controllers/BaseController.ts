import Router from "koa-router";


export class BaseController {
    readonly path?: string;

    build(): Router {
        return new Router({
            prefix: this.path || '/'
        });
    }
}