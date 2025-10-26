import { Context, InlineKeyboard } from "../deps";

/**
 * Reply to message api but with topics support
 * @param ctx Context from Grammy.js middleware
 * @param message The message you want to send
 * @param buttons InlineKeyboard button to attach to the message
 */
export const reply = async (
  ctx: Context,
  message: string,
  buttons?: InlineKeyboard,
): Promise<any> => {
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
};
