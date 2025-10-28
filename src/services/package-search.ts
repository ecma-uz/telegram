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

export class SearchService {
  static async search(query: string): Promise<Package[]> {
    return [];
  }
}

export class PacmanSearch {
  protected results: Package[];

  constructor() {
    this.results = [];
  }

  public getLength(): number {
    return this.results.length;
  }

  public async search(query: string): Promise<void> {
    this.results = await SearchService.search(query);
  }

  public getResults(limit = 49): InlineQueryResult[] {
    return this.results.slice(0, limit).map((item: Package) => ({
      type: "article" as const,
      id: crypto.randomUUID(),
      title: item.name,
      url: normalize(item),
      description: item.desc,
      reply_markup: new InlineKeyboard().url(`Web Sahifasi`, normalize(item)),
      input_message_content: {
        message_text:
          `<b>Nomi:</b> ${item.name}` +
          `\n` +
          (item.version && "<b>Versiyasi:</b> " + item.version + `\n`) +
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

  public getNotFound(query: string): InlineQueryResult[] {
    return [
      {
        type: "article" as const,
        id: "404",
        title: "Xatolik yuz berdi!",
        description: `Ushbu ${query} ga oid natija topilmadi!`,
        reply_markup: new InlineKeyboard().switchInlineCurrent(
          "Qayta urinib ko'ramizmi?",
          "foobar",
        ),
        input_message_content: {
          message_text:
            `<b>"${query}" ga oid natija mavjud emas!</b>` +
            `\n` +
            `Iltimos, boshqattan ushbu qidirmoqchi bo'lgan paketingiz yozib qidirib ko'ring.`,
          parse_mode: "HTML",
        },
      },
    ];
  }

  public getEmptyQuery(): InlineQueryResult[] {
    return [
      {
        type: "article" as const,
        id: "102",
        title: "Qidirishni boshlang!",
        description: "Qidirmoqchi bo'lgan tldr sahifa nomini yozing!",
        reply_markup: new InlineKeyboard().switchInlineCurrent(
          "Qayta urinib ko'ramizmi?",
          "foobar",
        ),
        input_message_content: {
          message_text:
            `<b>Salom foydalanuvchi!</b>` +
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
      },
    ];
  }
}

export class TealdeerSearch {
  protected results: any[];

  constructor() {
    this.results = [];
  }

  public getLength(): number {
    return this.results.length;
  }

  public async query(type: string, page: string): Promise<string[]> {
    const matches: string[] = [];
    const response = await fetch(
      `https://api.github.com/repos/tldr-pages/tldr/contents/pages/${type}`,
    );

    if (response.status != 200) return [];

    const jsonData = (await response.json()) as any[];

    jsonData.forEach((file) => {
      const fileName = file.name.slice(0, -3);
      if (fileName.startsWith(page)) {
        if (fileName == page) {
          matches.unshift(fileName);
        } else {
          matches.push(fileName);
        }
      }
    });

    return matches;
  }

  public async getPage(type: string, page: string): Promise<any> {
    const response = await fetch(
      `https://raw.githubusercontent.com/tldr-pages/tldr/main/pages/${type}/${page}.md`,
    );
    const responseText = await response.text();
    const lines = responseText.split("\n").map((line) => {
      if (line.startsWith(">")) {
        return `_${line.slice(2)}_`;
      }
      return line;
    });
    const title = lines[0].replace(/^#\s?/, "");
    lines[0] = `*${title}*`;
    const content = lines.join("\n");

    return {
      title: title,
      description: type,
      content: content,
      link: `https://tldr.inbrowser.app/pages/${type}/${page}`,
    };
  }

  public async search(page: string): Promise<void> {
    const query = page.toLowerCase();
    const matches = await this.query("linux", query);
    const pages = await Promise.all(
      matches.map(async (page) => await this.getPage("linux", page)),
    );

    if (pages.length < 10) {
      const _matches = await this.query("common", query);
      const _pages = await Promise.all(
        _matches.map(async (page) => await this.getPage("common", page)),
      );
      pages.push(..._pages);
    }

    this.results = pages;
  }

  public getResults(limit = 49): InlineQueryResult[] {
    return this.results.slice(0, limit).map((page) => ({
      type: "article" as const,
      id: crypto.randomUUID(),
      title: page.title,
      description: page.description,
      url: page.link,
      reply_markup: new InlineKeyboard().url(`Brauzerda ko\'rish`, page.link),
      input_message_content: {
        message_text: page.content,
        parse_mode: "Markdown",
      },
    }));
  }

  public getNotFound(query: string): InlineQueryResult[] {
    return [
      {
        type: "article" as const,
        id: "404tldr",
        title: "Xatolik yuz berdi!",
        description: `Ushbu ${query} ga oid sahifa topilmadi!`,
        reply_markup: new InlineKeyboard().switchInlineCurrent(
          "Qayta urinib ko'ramizmi?",
          "ls",
        ),
        input_message_content: {
          message_text:
            `<b>"${query}" ga oid natija mavjud emas!</b>` +
            `\n` +
            `Iltimos, boshqattan ushbu qidirmoqchi bo'lgan tldr sahifa` +
            `nomini yozib qidirib ko'ring.`,
          parse_mode: "HTML",
        },
      },
    ];
  }

  public getEmptyQuery(): InlineQueryResult[] {
    return [
      {
        type: "article" as const,
        id: "102",
        title: "Qidirishni boshlang!",
        description: "Qidirmoqchi bo'lgan tldr sahifa nomini yozing!",
        reply_markup: new InlineKeyboard().switchInlineCurrent(
          "Qayta urinib ko'ramizmi?",
          "ls",
        ),
        input_message_content: {
          message_text:
            `<b>Salom foydalanuvchi!</b>` +
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
      },
    ];
  }
}
