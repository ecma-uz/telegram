import { Context, NextFunction } from "grammy";
import { replyWithTopic } from "../handlers/reply";
import env from "../config/env";

export default async (ctx: Context, next: NextFunction) => {
  if (!env.adminUserIds.includes(ctx.message!.from!.id!)) {
    return await replyWithTopic(ctx, `⚠️ Bu komanda faqat Xinux Asoschisi uchun!`);
  }
  await next();
};
