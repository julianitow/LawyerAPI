import Router from "koa-router";
import { IModule } from "../../definitions/interfaces";
import Koa, { Context } from "koa";
import cors from "@koa/cors"
import koaBody from "koa-body";
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
        console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
    }

    private async headersMiddleware(ctx: Context, next: Function): Promise<void> {
        /**
         * For later
         */
        await next();
    }

    default(): void {
        this.app.use(cors())
        this.app.use(this.headersMiddleware);
        this.app.use(this.loggerMiddleware);
        this.app.use(koaBody());
        for (const r of this.routers) {
            this.app.use(r.routes());
        }
        this.app.listen(this.port, () => {
            console.success('KOA Module loaded and listening on port', this.port);
        });
    }
}
