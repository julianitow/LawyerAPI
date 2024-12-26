import mongoose from "mongoose";
import { IAbility } from "../../../../definitions/interfaces";
import {
  Ability,
  AbilityDocument,
} from "../../../../definitions/Models/Ability";

export class AbilityDAO {
  private readonly model: mongoose.Model<AbilityDocument>;

  constructor() {
    this.model = Ability;
  }

  async update(ability: IAbility): Promise<void> {
    await this.model.updateOne({ _id: ability.id }, ability);
  }

  async create(ability: IAbility): Promise<AbilityDocument | void> {
    return await this.model.create(ability);
  }

  async delete(abilityId: string): Promise<void> {
    await this.model.deleteOne({ _id: abilityId });
  }

  async fetchAll(sorted: boolean = true): Promise<AbilityDocument[]> {
    try {
      return sorted
        ? await this.model.find().sort({ _id: -1 })
        : await this.model.find();
    } catch (err) {
      console.error("ERR_FETCH", err);
      return [];
    }
  }

  async fetchOne(id: string): Promise<IAbility | null> {
    return await this.model.findById(id);
  }
}

export const _AbilityDAO = new AbilityDAO();
