import { Context, NextFunction } from "../deps";

export default async (ctx: Context, next: NextFunction) => {
  if (ctx.chat!.type === "private") {
    return await ctx.reply(`⚠️ Bu komanda faqat guruh uchun!`);
  }
  await next();
};
