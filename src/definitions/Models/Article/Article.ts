import mongoose, { Document, Schema, model } from "mongoose";
import { IArticle } from "../../interfaces";

export type ArticleDocument = IArticle & Document;

export const ArticleSchema = new Schema<ArticleDocument>({
    title: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String],
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, {timestamps: true});

export const Article = mongoose.model<ArticleDocument>('Article', ArticleSchema);