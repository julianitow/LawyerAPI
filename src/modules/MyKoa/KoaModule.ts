import Router from "koa-router";
import { IModule } from "../../definitions/interfaces";
import Koa, { Context } from "koa";

export class KoaModule implements IModule {

    readonly app: Koa;
    readonly port = process.env.PORT || 3000;
    private readonly routers: Router[];

    constructor(routers: Router[]) {
        this.app = new Koa();
        this.routers = routers;
    }

    private async loggerMiddleware(ctx: Context, next: Function): Promise<void> {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    }

    default(): void {
        this.app.use(this.loggerMiddleware);
        for (const r of this.routers) {
            this.app.use(r.routes());
        }
        this.app.listen(this.port, () => {
            console.success('KOA Module loaded and listening on port', this.port);
        });
    }
}