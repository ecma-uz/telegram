import { Context, NextFunction, InlineKeyboard } from "../deps";
import { reply } from "../utils/sender";

const keyboard = new InlineKeyboard().url(
  `Guruhimizga o'ting`,
  `https://t.me/xinuxuz`,
);

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.chat!.id !== -1001174263940) {
    return await reply(
      ctx,
      `⚠️ Bu komanda faqat o'zimizni guruh uchun`,
      keyboard,
    );
  }
  await next();
};
