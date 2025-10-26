import normalize from "../utils/normalize";
import { InlineKeyboard } from "grammy";
import crypto from "crypto";

type InlineQueryResult = any;

export interface Package {
  name: string;
  desc: string;
  repo: string;
  arch: string;
  updated: string;
  installed: string;
  version: string;
  install: string;
  url?: string;
  type: string;
}

export class Search {
  static async search(query: string): Promise<Package[]> {
    return [];
  }
}

export class Pacman {
  protected results: Package[];

  constructor() {
    this.results = [];
  }

  public getLength(): number {
    return this.results.length;
  }

  public async search(query: string) {
    this.results = await Search.search(query);
  }

  public inline(limit = 49): InlineQueryResult[] {
    return this.results.slice(0, limit).map((item: Package) => ({
      type: "article" as const,
      id: crypto.randomUUID(),
      title: item.name,
      url: normalize(item),
      description: item.desc,
      reply_markup: new InlineKeyboard().url(`Web Sahifasi`, normalize(item)),
      input_message_content: {
        message_text: `<b>Nomi:</b> ${item.name}` +
          `\n` +
          (item.version &&
            "<b>Versiyasi:</b> " + item.version + `\n`) +
          (item.desc && "<b>Ma'lumot:</b> " + item.desc + `\n`) +
          (item.repo ? "<b>Repozitoriya:</b> " + item.repo + `\n` : "") +
          (item.updated &&
            "<b>O'zgartirilgan:</b> " +
              `${new Date(item.updated).toLocaleString()}` +
              `\n`) +
          `\n` +
          `<b>O'rnatish uchun:</b>` +
          `\n` +
          `<code>${item.install}</code>`,
        parse_mode: "HTML",
      },
    }));
  }

  public notFound(query: string): InlineQueryResult[] {
    return [{
      type: "article" as const,
      id: "404",
      title: "Xatolik yuz berdi!",
      description: `Ushbu ${query} ga oid natija topilmadi!`,
      reply_markup: new InlineKeyboard().switchInlineCurrent(
        "Qayta urinib ko'ramizmi?",
        "foobar",
      ),
      input_message_content: {
        message_text: `<b>"${query}" ga oid natija mavjud emas!</b>` +
          `\n` +
          `Iltimos, boshqattan ushbu qidirmoqchi bo'lgan paketingiz yozib qidirib ko'ring.`,
        parse_mode: "HTML",
      },
    }];
  }

  public noQuery(): InlineQueryResult[] {
    return [{
      type: "article" as const,
      id: "102",
      title: "Qidirishni boshlang!",
      description: "Qidirmoqchi bo'lgan tldr sahifa nomini yozing!",
      reply_markup: new InlineKeyboard().switchInlineCurrent(
        "Qayta urinib ko'ramizmi?",
        "foobar",
      ),
      input_message_content: {
        message_text: `<b>Salom foydalanuvchi!</b>` +
          `\n` +
          `Siz inline rejim ishga tushurdingiz. Ushbu qulaylik yordamida siz ` +
          `tldr sahifasiga kirmasdan turib telegramdan tldr sahifalarini ` +
          `qidirish imkoniga ega bo'lasiz! Qidirishni boshlash uchun ` +
          `\n` +
          `<code>@xeonittebot \/tldr &lt;sahifa nomi&gt;</code>` +
          `\n` +
          `yozasiz`,
        parse_mode: "HTML",
      },
    }];
  }
}
