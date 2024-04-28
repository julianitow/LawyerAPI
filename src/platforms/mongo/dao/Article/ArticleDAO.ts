import mongoose from "mongoose";
import { Article, ArticleDocument } from "../../../../definitions/Models/Article";
import { IArticle } from "../../../../definitions/interfaces";

export class ArticleDAO {

    private readonly model: mongoose.Model<ArticleDocument>;

    constructor() {
        this.model = Article;
    }

    async create(article: IArticle): Promise<ArticleDocument | void> {
        try {
            return await this.model.create(article);
        } catch(err) {
            console.error('ERR_CREAT', err);
        }
    }

    async fetchAll(sorted: boolean = true): Promise<ArticleDocument[]> {
        try {
            return sorted ? await this.model.find().sort({_id: -1}) : await this.model.find();
        } catch(err) {
            console.error('ERR_FETCH', err);
            return [];
        }
    }

    async fetchOne(id: string): Promise<IArticle | null> {
        try {
            return await this.model.findById(id);
        } catch(err) {
            console.error('ERR_FETCH', err);
            return null;
        }
    }
 }

 export const _ArticleDAO = new ArticleDAO();