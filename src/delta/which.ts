import { Composer, Context } from "../deps";
import isGroup from "../hooks/isGroup";

const composer = new Composer();

composer.command("which", isGroup, async (ctx: Context): Promise<void> => {
  const status = (await ctx.getChatMember(ctx!.from!.id)).status;

  const text = `<b>Ushbu ${ctx!.from!.first_name} metrikasi:</b>` +
    `\n` +
    `\n` +
    `<b>Ismi:</b> ${ctx!.from!.first_name} ` + `\n` +
    (ctx?.from?.username && "<b>Username:</b> @" + ctx.from.username + `\n`) +
    (ctx?.chat?.id && `<b>Chat ID:</b> <code>${ctx.chat.id}</code>` + `\n`) +
    (ctx?.message?.from.id &&
      `<b>User ID:</b> <code>${ctx.message.from.id}</code>` + `\n`) +
    `<b>Status:</b> ${status}`;

  if (ctx.message?.message_thread_id) {
    await ctx.reply(text, {
      message_thread_id: ctx.message.message_thread_id,
      parse_mode: "HTML",
    });
  } else {
    await ctx.reply(text, { parse_mode: "HTML" });
  }
});

export default composer;
