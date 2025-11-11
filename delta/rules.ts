import { Composer, Context, InlineKeyboard } from "../deps.ts";
import communities from "../data/communities.json" with { type: "json" };

const composer = new Composer();

const privateMessage = `<b>Hurmatli guruh a'zosi...</b> ` +
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

const groupMessage = `<b>Yozish qoidalari</b>` +
  `\n` +
  `\n` +
  `Guruhda yozishda quyidagi qoidalarga rioya qiling:` +
  `\n` +
  `\n` +
  `<code>* Besabab bir-birini kamsitish yoki so'kinish</code>` +
  `\n` +
  `<code>* Sababsiz guruhga spam yozaverish yoki tashash</code>` +
  `\n` +
  `<code>* So'ralgan narsani yana qayta esmalash</code>` +
  `\n` +
  `<code>* Administratorlarga nisbatan juddayam qattiq kritika</code>` +
  `\n` +
  `<code>* Faoliyat ustidan shikoyat qilaverish yoki nolish</code>` +
  `\n` +
  `\n` +
  `<b>Ushbu qoidalarni doimiy tarzda buzish, butunlay ban yoki bir necha ogohlantirishlirga olib keladi!</b>` +
  `\n` +
  `\n` +
  `Batafsil ma'lumot uchun <b>nometa.uz</b> saytiga tashrif buyuring.`;

function buildPrivateKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  communities.forEach((community, index) => {
    if (community.telegram) {
      keyboard.url(
        community.name,
        `https://t.me/${community.telegram.replace("@", "")}`,
      );

      if (
        index % 2 === 1 || (index === communities.length - 1 && index % 2 === 0)
      ) {
        keyboard.row();
      }
    }
  });

  return keyboard;
}

const groupKeyboard = new InlineKeyboard().url(
  `📝 nometa.uz`,
  `https://nometa.uz`,
);

composer.command("rules", async (ctx: Context): Promise<void> => {
  if (ctx.chat!.type === "private") {
    const privateKeyboard = buildPrivateKeyboard();
    if (ctx.message!.is_topic_message) {
      await ctx.reply(privateMessage, {
        message_thread_id: ctx.message!.message_thread_id,
        parse_mode: "HTML",
        reply_markup: privateKeyboard,
      });
    } else {
      await ctx.reply(privateMessage, {
        parse_mode: "HTML",
        reply_markup: privateKeyboard,
      });
    }
  } else {
    if (ctx.message!.is_topic_message) {
      await ctx.reply(groupMessage, {
        message_thread_id: ctx.message!.message_thread_id,
        parse_mode: "HTML",
        reply_markup: groupKeyboard,
      });
    } else {
      await ctx.reply(groupMessage, {
        parse_mode: "HTML",
        reply_markup: groupKeyboard,
      });
    }
  }
});

export default composer;
