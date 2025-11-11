import { Composer, Context } from "../deps.ts";
import * as start from "./start.ts";

const composer = new Composer();

export const message = `<b>Mavjud komandalar ro'yxati:</b>` +
  `\n` +
  `\n` +
  `/doc - <code>reply qilingan odamga dok borligi haqida eslatish</code>` +
  `\n` +
  `/warn &lt;topic&gt; - <code>reply qilingan odamga spesifik topic borligi haqida eslatish</code>` +
  `\n` +
  `/help - <code>ushbu xabarni qayta ko'rsatish</code>` +
  `\n` +
  `/about - <code>ushbu botimizning rivojlantirish qismi</code>` +
  `\n` +
  `/rules - <code>qoidalarni aks ettirish</code>` +
  `\n` +
  `/which - <code>ushbu guruh va foydalanuvchi metrik ma'lumotlarini ko'rsatish</code>` +
  `\n` +
  `/groups - <code>Javascript / Typescript ga oid guruh va hamjamiyatlar</code>` +
  `\n` +
  `/feedback &lt;habar&gt; - <code>paketlarni to'plam bo'yicha qidirish</code>`;

export const keyboard = start.keyboard;

composer.command("help", async (ctx: Context): Promise<void> => {
  if (ctx.message!.is_topic_message) {
    await ctx.reply(message, {
      message_thread_id: ctx.message!.message_thread_id,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } else {
    await ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }
});

export default composer;
