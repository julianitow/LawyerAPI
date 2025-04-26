/* eslint-disable @typescript-eslint/ban-types */
import Router from "koa-router";
import { IModule } from "../../definitions/interfaces";
import Koa, { Context } from "koa";
import cors from "@koa/cors";
import koaBody from "koa-body";
import jwt from "koa-jwt";

export class KoaModule implements IModule {
  readonly app: Koa;
  readonly port = process.env.PORT || 3000;
  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;
  private readonly routers: Router[];
  private readonly unsecuredRoutes?: string[];

  constructor(routers: Router[], unsecuredRoutes?: string[]) {
    this.app = new Koa();
    this.routers = routers;
    if (this.jwtSecretKey === undefined) {
      throw new Error("JWT_SECRET_KEY undefined");
    }
    if (unsecuredRoutes) {
      this.unsecuredRoutes = unsecuredRoutes;
    }
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
    this.app.use(this.loggerMiddleware);
    this.app.use(cors());
    this.app.use((ctx, next) => {
      return next().catch((err) => {
        if (401 == err.status) {
          ctx.status = 401;
          ctx.body =
            "Protected resource, use Authorization header to get access\n";
        } else {
          throw err;
        }
      });
    });
    if (this.unsecuredRoutes) {
      this.app.use(
        jwt({ secret: this.jwtSecretKey! }).unless({
          path: [...this.unsecuredRoutes],
        })
      );
    } else {
      this.app.use(jwt({ secret: this.jwtSecretKey! }));
    }
    // this.app.use(jwt({ secret: this.jwtSecretKey! }));
    this.app.use(this.headersMiddleware);
    this.app.use(
      koaBody({
        jsonLimit: "50mb",
      })
    );
    for (const r of this.routers) {
      this.app.use(r.routes());
    }
    this.app.listen(this.port, () => {
      console.success("KOA Module loaded and listening on port", this.port);
    });
  }
}
