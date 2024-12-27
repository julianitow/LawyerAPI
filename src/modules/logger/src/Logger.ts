import { IModule } from "../../../definitions/interfaces";
import util from "util";

declare global {
  interface Console {
    success(...out: unknown[]): void;
  }
}

enum LEVEL {
  "DEBUG" = "DEBUG",
  "INFO" = "INFO",
  "WARN" = "WARN",
  "ERROR" = "ERROR",
  "SUCCESS" = "SUCCESS",
}

class TextColor {
  readonly begin: string;
  readonly end: string;

  constructor(begin: string, end: string) {
    this.begin = begin;
    this.end = end;
  }
}

export class Logger implements IModule {
  private readonly yellow = new TextColor("\x1b[33m", "\x1b[89m");
  private readonly green = new TextColor("\x1b[32m", "\x1b[89m");
  private readonly white = new TextColor("\x1b[37m", "\x1b[89m");
  private readonly red = new TextColor("\x1b[31m", "\x1b[89m");
  private static readonly colorMap = new Map<LEVEL, TextColor>();

  default(): void {
    Logger.colorMap.set(LEVEL.WARN, this.yellow);
    Logger.colorMap.set(LEVEL.INFO, this.white);
    Logger.colorMap.set(LEVEL.ERROR, this.red);
    Logger.colorMap.set(LEVEL.DEBUG, this.white);
    Logger.colorMap.set(LEVEL.SUCCESS, this.green);

    if (
      process.env.NODE_ENV === "production" ||
      process.env.NODE_ENV === "development"
    ) {
      console.log = this.INFO;
      console.error = this.ERROR;
      console.warn = this.WARN;
      console.debug = this.DEBUG;
    }
    console.success = this.SUCCESS;
  }

  private static print(level: LEVEL, out: []): void {
    const now = new Date();
    const logFunc =
      level === LEVEL.ERROR
        ? process.stderr.write.bind(process.stderr)
        : process.stdout.write.bind(process.stdout);
    logFunc(
      `${Logger.colorMap.get(level)?.begin}[${level}]${
        Logger.colorMap.get(level)?.end
      }::${now.getHours() < 10 ? `O${now.getHours()}` : now.getHours()}:${
        now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()
      }:${
        now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds()
      }: ` +
        util.format(...out) +
        "\n"
    );
  }

  private DEBUG(...out: []): void {
    if (process.env.DEBUG) {
      Logger.print(LEVEL.DEBUG, out);
    }
  }

  private INFO(...out: []): void {
    Logger.print(LEVEL.INFO, out);
  }

  private ERROR(...out: []): void {
    Logger.print(LEVEL.ERROR, out);
  }

  private WARN(...out: []): void {
    Logger.print(LEVEL.WARN, out);
  }
  private SUCCESS(...out: []): void {
    Logger.print(LEVEL.SUCCESS, out);
  }
}
