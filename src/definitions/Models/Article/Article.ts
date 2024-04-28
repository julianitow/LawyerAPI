import mongoose, { Document, Schema, ToObjectOptions, model } from "mongoose";
import { IArticle } from "../../interfaces";

export type ArticleDocument = IArticle & Document;

function toPrettyObject(doc: any, obj: any, options: any): any {
    if(obj._id) {
        obj.id = obj._id;
        delete obj._id;
    }
    return obj;
}

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
}, {
    timestamps: true,
    toObject: {
        transform: toPrettyObject
    },
    toJSON: {
        transform: toPrettyObject
    }
});


export const Article = mongoose.model<ArticleDocument>('Article', ArticleSchema);