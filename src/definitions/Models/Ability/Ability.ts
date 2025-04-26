import mongoose, { Document, Schema } from "mongoose";
import { IAbility } from "../../interfaces/";
import { Utils } from "../utils";
import { FileSchema } from "../File";

export type AbilityDocument = IAbility & Document;

export const AbilitySchema = new Schema<AbilityDocument>(
  {
    name: {
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

export const Ability = mongoose.model<AbilityDocument>(
  "Abilities",
  AbilitySchema
);
