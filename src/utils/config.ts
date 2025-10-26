import * as fs from "fs";
import { parse } from "toml";

export interface Configs {
  port: number;
  mode: string;
  host: string;
  token: string;
}

export class Config {
  private path: string;
  private host: string;
  private port: number;
  private mode: string;
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
      console.log("Does even your config file exists?");
      process.exit(1);
    }

    const read = fs.readFileSync(this.path, "utf-8");
    const data = parse(read) as any;

    this.port = data.port as number;
    this.mode = data.mode as string;
    this.host = data.host as string;
    this.token = data.token as string;
  }

  data(): Configs {
    return {
      host: this.host,
      port: this.port,
      mode: this.mode,
      token: this.token,
    };
  }
}

export default Config;
