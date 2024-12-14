import Router from "koa-router";
import { BaseController } from "./BaseController";
import { IUser } from "../../definitions/interfaces/User";
import { Context } from "koa";

export class UserController extends BaseController {
    readonly path: string = '/user';

    async login(ctx: Context): Promise<void> {
        const user = ctx.request.body as IUser;
        try {
            console.log(user);
            ctx.status = 200;
        } catch(err) {
            console.error(err);
        }
    }

    build(): Router {
        const router = super.build();
        router.post('/login', this.login.bind(this));
        return router;
    }
}