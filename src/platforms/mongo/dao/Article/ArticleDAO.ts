import mongoose from "mongoose";
import {
  Article,
  ArticleDocument,
} from "../../../../definitions/Models/Article";
import { IArticle } from "../../../../definitions/interfaces";

export class ArticleDAO {
  private readonly model: mongoose.Model<ArticleDocument>;

  constructor() {
    this.model = Article;
  }

  async update(article: IArticle): Promise<void> {
    await this.model.updateOne({ _id: article.id }, article);
  }

  async create(article: IArticle): Promise<ArticleDocument | void> {
    return await this.model.create(article);
  }

  async fetchAll(sorted: boolean = true): Promise<ArticleDocument[]> {
    try {
      return sorted
        ? await this.model.find().sort({ _id: -1 })
        : await this.model.find();
    } catch (err) {
      console.error("ERR_FETCH", err);
      return [];
    }
  }

  async fetchOne(id: string): Promise<IArticle | null> {
    return await this.model.findById(id);
  }
}

export const _ArticleDAO = new ArticleDAO();
