import { Composer, Context, InlineKeyboard } from "grammy";
import isPrivate from "../hooks/isPrivate";

const composer = new Composer();

export const message = `<b>Hurmatli guruh a'zosi...</b> ` +
  `\n` +
  `\n` +
  `Iltimos qoidalarga oz bo'lsada vaqt ajratishni unutmang, bu muhim! Ushbu guruhda quyidagi harakatlar taqiqlanadi:` +
  `\n` +
  `\n` +
  `<code>* Besabab bir-birini kamsitish yoki so'kinish</code>` +
  `\n` +
  `<code>* Sababsiz guruhga spam yozaverish yoki tashash</code>` +
  `\n` +
  `<code>* So'ralgan narsani yana qayta ezmalash</code> ` +
  `\n` +
  `<code>* Administratorlarga nisbatan juddayam qattiq kritika</code>` +
  `\n` +
  `<code>* Faoliyat ustidan shikoyat qilaverish yoki nolish</code>` +
  `\n` +
  `\n` +
  `<b>Ushbu qoidalarni doimiy tarzda buzish, butunlay ban yoki bir necha ogohlantirishlirga olib keladi!</b>`;

export const keyboard = new InlineKeyboard().url(
  `Guruhga qaytish`,
  `https://t.me/xinuxuz/178640`,
);

composer.command("rules", isPrivate, async (ctx: Context): Promise<void> => {
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
