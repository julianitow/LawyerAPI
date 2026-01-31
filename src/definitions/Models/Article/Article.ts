import mongoose, { Document, Schema } from "mongoose";
import { IArticle } from "../../interfaces";
import { FileSchema, Utils } from "s1mpl3-api-l1b";

export type ArticleDocument = IArticle & Document;

export const ArticleSchema = new Schema<ArticleDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
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
    image: {
      type: FileSchema,
      required: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: Utils.toPrettyObject,
    },
    toJSON: {
      transform: Utils.toPrettyObject,
    },
  }
);

export const Article = mongoose.model<ArticleDocument>(
  "Articles",
  ArticleSchema
);
