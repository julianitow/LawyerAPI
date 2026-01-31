import mongoose from "mongoose";
import { IUser, User, UserDocument } from "s1mpl3-api-l1b";

export class UserDAO {
  private readonly model: mongoose.Model<UserDocument>;

  constructor() {
    this.model = User;
  }

  async update(user: IUser): Promise<void> {
    await this.model.updateOne({ _id: user }, user);
  }

  async create(user: IUser): Promise<UserDocument | void> {
    return await this.model.create(user);
  }

  async fetchOne(username: string): Promise<IUser | null> {
    return await this.model.findOne({ username });
  }
}

export const _UserDAO = new UserDAO();
