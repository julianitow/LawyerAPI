import Router from "koa-router";
import { BaseController } from "./BaseController";
import { IUser } from "../../definitions/interfaces/User";
import { Context } from "koa";

export class UserController extends BaseController {
  readonly path: string = "/user";

  // private generateToken(user: IUser): string {
  //   let jwtSecretKey = process.env.JWT_SECRET_KEY;
  //   let data = {
  //       time: Date(),
  //       userId: 12,
  //   }
  // }

  async login(ctx: Context): Promise<void> {
    const user = ctx.request.body as IUser;
    try {
      console.log(user);
      ctx.body = {
        user,
      };
      ctx.status = 200;
    } catch (err) {
      console.error(err);
    }
  }

  build(): Router {
    const router = super.build();
    router.post("/login", this.login.bind(this));
    return router;
  }
}
