import { exists, toml } from "../deps.ts";

export interface Configs {
  port: number;
  mode: string;
  host: string;
  token: string;
  admin_user_ids?: number[];
  home_chat_id?: string;
}

export class Config {
  private path: string;
  private host: string;
  private port: number;
  private mode: string;
  private token: string;
  private admin_user_ids: number[];
  private home_chat_id: string;

  constructor(path: string) {
    this.mode = "polling";
    this.token = "";
    this.host = "127.0.0.1";
    this.port = 8000;
    this.admin_user_ids = [];
    this.home_chat_id = "";
    this.path = path;
  }

  async consume(): Promise<void> {
    if (!(await exists(this.path))) {
      console.log("Does even your config file exists?");
      Deno.exit(1);
    }

    const read = Deno.readTextFileSync(this.path);
    const data = toml.parse(read);

    this.port = data.port as number;
    this.mode = data.mode as string;
    this.host = data.host as string;
    this.token = data.token as string;
    this.admin_user_ids = (data.admin_user_ids as number[]) || [];
    this.home_chat_id = (data.home_chat_id as string) || "";
  }

  data(): Configs {
    return {
      host: this.host,
      port: this.port,
      mode: this.mode,
      token: this.token,
      admin_user_ids:
        this.admin_user_ids.length > 0 ? this.admin_user_ids : undefined,
      home_chat_id: this.home_chat_id || undefined,
    };
  }
}

export default Config;
