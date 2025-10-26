import { Context, NextFunction, InlineKeyboard } from "grammy";
import { replyWithTopic } from "../handlers/reply";
import env from "../config/env";

const keyboard = new InlineKeyboard().url(
  `Guruhimizga o'ting`,
  `https://t.me/xinuxuz`,
);

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.chat!.id !== env.homeChatId) {
    return await replyWithTopic(
      ctx,
      `⚠️ Bu komanda faqat o'zimizni guruh uchun`,
      keyboard,
    );
  }
  await next();
};
