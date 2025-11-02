// deno-lint-ignore-file no-explicit-any
import { reply } from "../utils/sender.ts";
import isReply from "../hooks/isReply.ts";
import topics from "../topics.json" with { type: "json" };
import { Composer, Context, InlineKeyboard } from "../deps.ts";

const composer = new Composer();

type Topics = { [key: string]: number };

composer.command("warn", isReply, async (ctx: Context): Promise<any> => {
  const registeredTopics: Topics = topics;
  const requestedTopic: string = typeof ctx.match === "string"
    ? ctx.match
    : ctx.match!.join(" ");

  if (!Object.keys(topics).includes(requestedTopic)) {
    return await reply(
      ctx,
      `<b>Bunaqangi topic bizda borga o'xshamaydiyov...\n\nBizda faqat quyidagi topic (mavzu)lar bor:</b>` +
        `\n` +
        `<i>${Object.keys(registeredTopics).join(" | ")}</i>`,
    );
  }

  await ctx.api
    .deleteMessage(ctx.message!.chat!.id, ctx.message!.message_id)
    .catch(() => {
      console.warn("Oh no... I couldn't delete the message!");
    });

  if (ctx?.message?.reply_to_message?.from?.id === ctx.me.id) {
    if (ctx.message) {
      return await reply(ctx, `Ha-ha... yaxshi urinish!`);
    }
  }

  await ctx.api
    .deleteMessage(
      ctx.message!.chat!.id,
      ctx.message!.reply_to_message!.message_id,
    )
    .catch(() => {
      console.warn("Oh no... I couldn't delete the message!");
    });

  const requestedTopicURL = registeredTopics[requestedTopic];

  const text =
    `<b>Hurmatli <a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${ctx?.message?.reply_to_message?.from?.first_name}</a>,</b>` +
    `\n` +
    `\n` +
    `Tushunishim bo'yicha siz mavzudan chetlayashyabsiz. Iltimos, ` +
    `quyidagi tugmachani bosish orqali bizning <b>${requestedTopic}</b> guruhimizga o'tib oling! ` +
    `<b>${requestedTopic}</b> guruhimizda ushbu mavzuda suhbatlashish ruxsat etiladi. Boshqalarga xalaqit qilmayliga 😉` +
    `\n` +
    `\n` +
    `<b>Hurmat ila, Ecma assisent</b>`;

  const keyboard = new InlineKeyboard().url(
    `${requestedTopic.charAt(0).toUpperCase()}${requestedTopic.slice(1)} Chat`,
    `https://t.me/xinuxuz/${requestedTopicURL}`,
  );

  return await reply(ctx, text, keyboard);
});

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

    return await reply(ctx, text);
  }
});

export default composer;
