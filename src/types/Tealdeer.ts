import { InlineKeyboard } from "../deps";
import crypto from "crypto";

interface File {
  name: string;
  [key: string]: any;
}

interface Page {
  title: string;
  description: string;
  content: string;
  link: string;
}

export interface InlineQueryResult {
  type: string;
  id: string;
  title?: string;
  description?: string;
  url?: string;
  reply_markup?: any;
  input_message_content?: any;
}

const API_URL = "https://api.github.com/repos/tldr-pages/tldr/contents/pages";
const DL_URL = "https://raw.githubusercontent.com/tldr-pages/tldr/main/pages";
const WEB_URL = "https://tldr.inbrowser.app/pages";

export class Tealdeer {
  protected results: Page[];

  constructor() {
    this.results = [];
  }

  public getLength(): number {
    return this.results.length;
  }

  public async query(type: string, page: string) {
    const matches: string[] = [];
    const response = await fetch(`${API_URL}/${type}`);

    if (response.status != 200) return [];

    const jsonData: File[] = await response.json();

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

  public async getPage(type: string, page: string): Promise<Page> {
    const response = await fetch(`${DL_URL}/${type}/${page}.md`);

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
      link: `${WEB_URL}/${type}/${page}`,
    };
  }

  public async search(page: string) {
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

  public inline(limit = 49): InlineQueryResult[] {
    return this.results.slice(0, limit).map((page) => ({
      type: "article",
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

  public notFound(query: string): InlineQueryResult[] {
    return [{
      type: "article",
      id: "404tldr",
      title: "Xatolik yuz berdi!",
      description: `Ushbu ${query} ga oid sahifa topilmadi!`,
      reply_markup: new InlineKeyboard().switchInlineCurrent(
        "Qayta urinib ko'ramizmi?",
        "ls",
      ),
      input_message_content: {
        message_text: `<b>"${query}" ga oid natija mavjud emas!</b>` +
          `\n` +
          `Iltimos, boshqattan ushbu qidirmoqchi bo'lgan tldr sahifa` +
          `nomini yozib qidirib ko'ring.`,
        parse_mode: "HTML",
      },
    }];
  }

  public noQuery(): InlineQueryResult[] {
    return [{
      type: "article",
      id: "102",
      title: "Qidirishni boshlang!",
      description: "Qidirmoqchi bo'lgan tldr sahifa nomini yozing!",
      reply_markup: new InlineKeyboard().switchInlineCurrent(
        "Qayta urinib ko'ramizmi?",
        "ls",
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
