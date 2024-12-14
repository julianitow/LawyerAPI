import mongoose, { Document, Schema } from "mongoose";
import { IArticle } from "../../interfaces";
import { IFile } from "../../interfaces/Article/IFile";

export type ArticleDocument = IArticle & Document;
export type FileDocument = IFile & Document;

function toPrettyObject(doc: any, obj: any): any {
    if(obj._id) {
        obj.id = obj._id;
        delete obj._id;
    }
    return obj;
}

export const FileSchema = new Schema<FileDocument>({
    name: {
        type: String,
        required: true,
    },
    content: {
        type: Buffer,
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
    },
    image: FileSchema,
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