import { reply } from "../utils/sender";
import { Context, NextFunction } from "../deps";
import topics from "../../topics.json";

export default async (ctx: Context, next: NextFunction) => {
  if (
    !ctx.message?.reply_to_message ||
    Object.values(topics).includes(ctx.message!.reply_to_message!.message_id)
  ) {
    return await reply(ctx, `↪ Reply bilan ko'rsatingchi habarni!`);
  }
  await next();
};
