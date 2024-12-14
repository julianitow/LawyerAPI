import Router from "koa-router";
import { BaseController } from "./BaseController";
import { IUser } from "../../definitions/interfaces/User";
import { Context } from "koa";
import * as jwt from "jsonwebtoken";
import { _UserDAO, UserDAO } from "../../platforms/mongo";
import * as bcrypt from "bcrypt";

export class UserController extends BaseController {
  readonly path: string = "/user";

  unsecuredRoutes?: string[] = [`/login`, "/register"];

  private readonly jwtSecretKey = process.env.JWT_SECRET_KEY;
  private readonly userDAO: UserDAO = _UserDAO;

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

  private checkPassword(user: IUser, enteredPassword: string): boolean {
    return bcrypt.compareSync(enteredPassword, user.password);
  }

  async login(ctx: Context): Promise<void> {
    const user = ctx.request.body as IUser;
    try {
      const dbUser = await this.userDAO.fetchOne(user.username);
      if (dbUser === null) {
        ctx.status = 404;
        return;
      }
      if (!this.checkPassword(dbUser, user.password)) {
        ctx.status = 401;
        return;
      }
      const token = this.generateToken(user);
      ctx.body = {
        token,
      };
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  }

  async create(ctx: Context): Promise<void> {
    const user = ctx.request.body as IUser;
    try {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
      await this.userDAO.create(user);
      ctx.status = 201;
    } catch (err) {
      if ((err as any).code === 11000) {
        ctx.body = "username already exists";
        ctx.status = 400;
      } else {
        ctx.status = 500;
      }
    }
  }

  build(): Router {
    const router = super.build();
    router.post("/login", this.login.bind(this));
    router.post("/register", this.create.bind(this));
    return router;
  }
}
