import * as fs from "fs";
import { IModule } from "../../../definitions/interfaces/Module";
import path from "path";

export class MyDotEnv implements IModule {
  constructor(envFile?: string) {
    this.setEnv(envFile);
  }

  default(_?: string): void {}

  setEnv(envFile?: string): void {
    const filename = envFile ? envFile : ".env";
    if (!fs.existsSync(path.join(filename))) return;
    const env = fs.readFileSync(".env");
    const envStr = String(env);
    for (let l of envStr.split("\n")) {
      if (l.indexOf("=") === -1) continue;
      if (l.split("=")[1].indexOf("#") !== -1) {
        l = l.substring(0, l.indexOf("#"));
      }
      process.env[l.split("=")[0]] = l.split("=")[1];
    }
  }
}
