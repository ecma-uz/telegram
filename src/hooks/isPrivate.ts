import { Context, NextFunction, InlineKeyboard } from "../deps";
import { reply } from "../utils/sender";

const keyboard = new InlineKeyboard().url(
  `Shaxsiy Chat`,
  `https://t.me/xeonittebot`,
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
