import * as fs from "fs";
import { parse } from "toml";

export interface BotConfig {
  port: number;
  mode: "webhook" | "polling";
  host: string;
  token: string;
}

export default class Config {
  private path: string;
  private host: string;
  private port: number;
  private mode: "webhook" | "polling";
  private token: string;

  constructor(path: string) {
    this.mode = "polling";
    this.token = "";
    this.host = "127.0.0.1";
    this.port = 8000;
    this.path = path;
  }

  consume(): void {
    if (!fs.existsSync(this.path)) {
      console.error("Config file does not exist:", this.path);
      process.exit(1);
    }

    const read = fs.readFileSync(this.path, "utf-8");
    const data = parse(read) as any;

    this.port = data.port as number;
    this.mode = data.mode as "webhook" | "polling";
    this.host = data.host as string;
    this.token = data.token as string;
  }

  data(): BotConfig {
    return {
      host: this.host,
      port: this.port,
      mode: this.mode,
      token: this.token,
    };
  }
}
