import mongoose, { Document, Schema } from "mongoose";
import { FileSchema } from "../File";
import { Utils } from "../utils";
import { IPresentation } from "../../interfaces/Presentation";

export type PresentationDocument = IPresentation & Document;

export const PresentationSchema = new Schema<PresentationDocument>(
  {
    title: {
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

export const Presentation = mongoose.model<PresentationDocument>(
  "Presentation",
  PresentationSchema
);
