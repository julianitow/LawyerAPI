import { IApplication } from "../definitions/interfaces";
import { Application } from "./Application";
import { _ArticleDAO } from "../platforms/mongo";
import Router from "koa-router";
import { ArticleController, BaseController, UserController } from "./controllers";

export class Lawyer extends Application implements IApplication {

    
    private readonly controllers: BaseController[] = [];

    constructor() {
        super();
        const articleController = new ArticleController();
        const userController = new UserController();
        this.controllers.push(articleController);
        this.controllers.push(userController);
    }

    routers(): Router[] {
        const routers = [];
        for (const c of this.controllers) {
            routers.push(c.build());
        }
        return routers;
    }
    
    run(): void {
        super.run();
    }
}