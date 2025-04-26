import mongoose from "mongoose";
import {
  Presentation,
  PresentationDocument,
} from "../../../../definitions/Models/Presentation";
import { IPresentation } from "../../../../definitions/interfaces";

export class PresentationDAO {
  private readonly model: mongoose.Model<PresentationDocument>;

  constructor() {
    this.model = Presentation;
  }

  async update(presentation: IPresentation): Promise<void> {
    await this.model.updateOne({ _id: presentation.id }, presentation);
  }

  async create(presentation: IPresentation): Promise<PresentationDocument | void> {
    return await this.model.create(presentation);
  }

  async fetchAll(sorted: boolean = true): Promise<PresentationDocument[]> {
    try {
      return sorted
        ? await this.model.find().sort({ _id: -1 })
        : await this.model.find();
    } catch (err) {
      console.error("ERR_FETCH", err);
      return [];
    }
  }
}

export const _PresentationDAO = new PresentationDAO();
