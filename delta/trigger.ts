// deno-lint-ignore-file no-explicit-any
import { reply } from "../utils/sender.ts";
import isReply from "../hooks/isReply.ts";
import communities from "../data/communities.json" with { type: "json" };
import { Composer, Context, InlineKeyboard } from "../deps.ts";

const composer = new Composer();

composer.command("warn", isReply, async (ctx: Context): Promise<any> => {
  if (ctx.chat!.type === "private") {
    return await reply(
      ctx,
      `Ebe hay, biz O'zbek JavaScript/TypeScript hamjamiyati guruhida emasga o'xshaymiz...`,
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

  const requestedCommunity: string = ctx.match
    ? (typeof ctx.match === "string" ? ctx.match : ctx.match.join(" ")).trim()
    : "";

  let text: string;
  let keyboard: InlineKeyboard | undefined;

  const foundCommunity = communities.find((c) =>
    c.name.toLowerCase().includes(requestedCommunity.toLowerCase()) ||
    requestedCommunity.toLowerCase().includes(c.name.toLowerCase())
  );

  if (requestedCommunity && foundCommunity) {
    text =
      `<b>Hurmatli <a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${ctx?.message?.reply_to_message?.from?.first_name}</a>,</b>` +
      `\n` +
      `\n` +
      `Tushunishim bo'yicha siz mavzudan chetlayashyabsiz. Iltimos, ` +
      `quyidagi tugmachani bosish orqali bizning <b>${foundCommunity.name}</b> hamjamiyatimizga o'tib oling! ` +
      `<b>${foundCommunity.name}</b> hamjamiyatida ushbu mavzuda suhbatlashish ruxsat etiladi. Boshqalarga xalaqit qilmayliga 😉` +
      `\n` +
      `\n` +
      `<b>Hurmat ila, Ecma assisent</b>`;

    keyboard = new InlineKeyboard();
    if (foundCommunity.telegram) {
      keyboard.url(
        `${foundCommunity.name}`,
        `https://t.me/${foundCommunity.telegram.replace("@", "")}`,
      );
    }
    if (foundCommunity.link) {
      keyboard.url("🌐 Sayt", foundCommunity.link);
    }
  } else {
    text =
      `<b>Hurmatli <a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${ctx?.message?.reply_to_message?.from?.first_name}</a>,</b>` +
      `\n` +
      `\n` +
      `Mavzudan chetlashganga ogohlantirish. Iltimos, guruh qoidalariga rioya qiling 😉` +
      `\n` +
      `\n` +
      `<b>Mavzuga mos hamjamiyatlar:</b>`;

    keyboard = new InlineKeyboard();

    communities.forEach((community, index) => {
      if (community.telegram) {
        keyboard.url(
          community.name,
          `https://t.me/${community.telegram.replace("@", "")}`,
        );

        if (
          index % 2 === 1 ||
          (index === communities.length - 1 && index % 2 === 0)
        ) {
          keyboard.row();
        }
      }
    });
  }

  return await reply(ctx, text, keyboard);
});

export default composer;
