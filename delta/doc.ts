// deno-lint-ignore-file no-explicit-any
import { reply } from "../utils/sender.ts";
import isReply from "../hooks/isReply.ts";
import { Composer, Context, InlineKeyboard } from "../deps.ts";

const composer = new Composer();

composer.command("doc", isReply, async (ctx: Context): Promise<any> => {
  if (ctx?.message?.reply_to_message?.from?.id === ctx.me.id) {
    return await reply(ctx, `Ha-ha... yaxshi urinish!`);
  } else {
    await ctx.api
      .deleteMessage(ctx.message!.chat!.id, ctx.message!.message_id)
      .catch(() => {
        console.warn("Oh no... I couldn't delete the message!");
      });

    const text =
      `<b>Demak, <a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${ctx?.message?.reply_to_message?.from?.first_name}</a>,</b>` +
      `\n` +
      `\n` +
      `<i>Bir bor ekan, bir yo'q ekan... Qadim o'tgan zamonlarda dokumentatsiya ` +
      `bo'lgan ekan. Aytishlariga qaraganda, undan deyarli hamma savollarga ` +
      `javob olsa bo'larkanda. Yanachi, unga avtorlar shunchalik ko'p vaqt ajratishar ` +
      `ekanu, lekin uni sanoqligina odam o'qisharkan. Attang...</i>`;

    const keyboard = new InlineKeyboard()
      .url("MDN Web Docs", "https://developer.mozilla.org")
      .url("JavaScript.info", "https://javascript.info")
      .row()
      .url("Google", "https://www.google.com/search?q=javascript+documentation")
      .row()
      .url("Ecma Uzbekistan", "https://ecma.uz");

    return await reply(ctx, text, keyboard);
  }
});

export default composer;
