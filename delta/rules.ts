import { Composer, Context, InlineKeyboard } from "../deps.ts";
import isPrivate from "../hooks/isPrivate.ts";

const composer = new Composer();

export const message =
  `<b>Hurmatli guruh a'zosi...</b> ` +
  `\n` +
  `\n` +
  `Iltimos qoidalarga oz bo'lsada vaqt ajratishni unutmang, bu muhim! Ushbu guruhda quyidagi harakatlar taqiqlanadi:` +
  `\n` +
  `\n` +
  `<code>* Besabab bir-birini kamsitish yoki so'kinish</code>` +
  `\n` +
  `<code>* Sababsiz guruhga spam yozaverish yoki tashash</code>` +
  `\n` +
  `<code>* So'ralgan narsani yana qayta esmalash</code> ` +
  `\n` +
  `<code>* Administratorlarga nisbatan juddayam qattiq kritika</code>` +
  `\n` +
  `<code>* Faoliyat ustidan shikoyat qilaverish yoki nolish</code>` +
  `\n` +
  `\n` +
  `<b>Ushbu qoidalarni doimiy tarzda buzish, butunlay ban yoki bir necha ogohlantirishlirga olib keladi!</b>`;

export const keyboard = new InlineKeyboard().url(
  `Guruhga qaytish`,
  `https://t.me/react_uz`,
);

composer.command("rules", isPrivate, async (ctx: Context): Promise<void> => {
  if (ctx.message!.is_topic_message) {
    await ctx.reply(message, {
      message_thread_id: ctx.message!.message_thread_id,
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
