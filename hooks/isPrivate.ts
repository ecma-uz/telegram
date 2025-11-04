import { Context, InlineKeyboard, NextFunction } from "../deps.ts";
import { reply } from "../utils/sender.ts";

const keyboard = new InlineKeyboard().url(
  `Shaxsiy Chat`,
  `https://t.me/ecmauzbot`,
);

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.chat!.type !== "private") {
    return await reply(
      ctx,
      `⚠️ Bu komanda faqat shaxsiy chat uchun!`,
      keyboard,
    );
  }

  await next();
};
