import { Composer, Context, InlineKeyboard } from "../deps";
import isPrivate from "../hooks/isPrivate";

const composer = new Composer();

export const message = `<b>Hurmatli foydalanuvchi!</b> \n` +
  `\n` +
  `Bizning botimiz aktiv tarzda shakllantirib boriladi. ` +
  `Buning ustida esa bir necha avtor va dasturchilar turadi, ` +
  `ushbu havolalar orqali bizning sinovchilarimizdan biriga aylaning ` +
  `va biz bilan botimiz, hamda guruhimiz ishlatish qulayligini oshiring.`;

export const keyboard = new InlineKeyboard().url(
  `Ochiq Havolalar`,
  `https://github.com/xinuxuz/xeonitte`,
);

composer.command("about", isPrivate, async (ctx: Context): Promise<void> => {
  if (ctx.message?.message_thread_id) {
    await ctx.reply(message, {
      message_thread_id: ctx.message.message_thread_id,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } else {
    await ctx.reply(message, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }
});

export default composer;
