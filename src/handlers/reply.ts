import { Context, InlineKeyboard } from "grammy";

/**
 * Reply to message with topic support
 * @param ctx - Grammy context
 * @param message - Message text
 * @param buttons - Optional inline keyboard
 */
export async function replyWithTopic(
  ctx: Context,
  message: string,
  buttons?: InlineKeyboard,
): Promise<any> {
  const config: { [key: string]: any } = {
    parse_mode: "HTML",
  };

  if (ctx.message?.message_thread_id) {
    config["message_thread_id"] = ctx.message.message_thread_id;
  }

  if (buttons) {
    config["reply_markup"] = buttons;
  }

  return await ctx.reply(message, config);
}

