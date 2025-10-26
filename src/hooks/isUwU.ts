import { Context, NextFunction } from "../deps";
import { reply } from "../utils/sender";

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.message!.from!.id! !== 756870298) {
    return await reply(ctx, `⚠️ Bu komanda faqat Xinux Asoschisi uchun!`);
  }
  await next();
};
