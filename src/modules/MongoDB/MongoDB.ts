import { IModule } from "../../definitions/interfaces";
import { connect } from "mongoose";

export class MongoDB implements IModule {
  private MONGO_HOST: string = "";
  private MONGO_PORT: string = "";
  private MONGO_DB: string = "";
  private MONGO_USER: string = "";
  private MONGO_PASSWD: string = "";

  constructor() {}

  private init(): void {
    if (
      !process.env.MONGO_HOST ||
      !process.env.MONGO_PORT ||
      !process.env.MONGO_DB ||
      !process.env.MONGO_USER ||
      !process.env.MONGO_PASSWD
    ) {
      throw new Error("Missing env");
    }
    this.MONGO_HOST = process.env.MONGO_HOST;
    this.MONGO_PORT = process.env.MONGO_PORT;
    this.MONGO_DB = process.env.MONGO_DB;
    this.MONGO_USER = process.env.MONGO_USER;
    this.MONGO_PASSWD = process.env.MONGO_PASSWD;
  }

  private async connect(): Promise<void> {
    //const url = `mongodb://${this.MONGO_USER}:${this.MONGO_PASSWD}@${this.MONGO_HOST}:${this.MONGO_PORT}/${this.MONGO_DB}?authMechanism=DEFAULT&directConnection=true`;
    const url = `mongodb://${this.MONGO_USER}:${this.MONGO_PASSWD}@${this.MONGO_HOST}:${this.MONGO_PORT}/${this.MONGO_DB}?authSource=admin&directConnection=true`;
    try {
      await connect(url);
      console.success("MONGO CONNECTED TO", this.MONGO_HOST, this.MONGO_PORT);
    } catch (err) {
      console.error("ERR_DB_CONN", err);
    }
  }

  default(): void {
    this.init();
    this.connect();
  }
}
