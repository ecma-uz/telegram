import { Context, NextFunction } from "grammy";
import { replyWithTopic } from "../handlers/reply";

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.message!.from!.id! !== 756870298) {
    return await replyWithTopic(ctx, `⚠️ Bu komanda faqat Xinux Asoschisi uchun!`);
  }
  await next();
};
