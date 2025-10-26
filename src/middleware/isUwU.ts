import { Context, NextFunction } from "grammy";
import { replyWithTopic } from "../handlers/reply";
import { config } from "../config";

export default async (ctx: Context, next: NextFunction) => {
  if (!config.adminUserIds.includes(ctx.message!.from!.id!)) {
    return await replyWithTopic(ctx, `⚠️ Bu komanda faqat Xinux Asoschisi uchun!`);
  }
  await next();
};
