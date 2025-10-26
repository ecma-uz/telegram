import { replyWithTopic } from "../handlers/reply";
import { Context, NextFunction } from "grammy";
import topics from "../topics.json";

export default async (ctx: Context, next: NextFunction) => {
  if (
    !ctx.message?.reply_to_message ||
    Object.values(topics).includes(ctx.message!.reply_to_message!.message_id)
  ) {
    return await replyWithTopic(ctx, `↪ Reply bilan ko'rsatingchi habarni!`);
  }
  await next();
};
