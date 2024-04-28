import mongoose from "mongoose";
import { IApplication, IArticle } from "../definitions/interfaces";
import { Application } from "./Application";
import { Article } from "../definitions/Models/Article";
import { ArticleDAO, _ArticleDAO } from "../platforms/mongo";
import Router from "koa-router";
import { ArticleController, BaseController } from "./controllers";

export class Lawyer extends Application implements IApplication {

    
    private readonly controllers: BaseController[] = [];

    constructor() {
        super();
        const articleController = new ArticleController();
        this.controllers.push(articleController);
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