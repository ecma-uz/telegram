import { Context, NextFunction, InlineKeyboard } from "grammy";
import { replyWithTopic } from "../handlers/reply";

const keyboard = new InlineKeyboard().url(
  `Shaxsiy Chat`,
  `https://t.me/xeonittebot`,
);

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.chat!.type !== "private") {
    return await replyWithTopic(
      ctx,
      `⚠️ Bu komanda faqat shaxsiy chat uchun!`,
      keyboard,
    );
  }

  await next();
};
