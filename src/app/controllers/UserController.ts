import Router from "koa-router";
import { BaseController } from "./BaseController";
import { IUser } from "../../definitions/interfaces/User";
import { Context } from "koa";
import * as jwt from "jsonwebtoken";

export class UserController extends BaseController {
  readonly path: string = "/user";

  unsecuredRoutes?: string[] = [`/login`];

  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;

  constructor() {
    super();
    if (this.jwtSecretKey === undefined) {
      throw new Error("JWT_SECRET_KEY undefined");
    }
  }

  private generateToken(user: IUser): string {
    const payload = {
      time: Date(),
      userId: 12,
    };
    return jwt.sign(payload, this.jwtSecretKey!);
  }

  async login(ctx: Context): Promise<void> {
    const user = ctx.request.body as IUser;
    try {
      const token = this.generateToken(user);
      console.log(user);
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
