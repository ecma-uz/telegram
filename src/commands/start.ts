import { Composer, Context, InlineKeyboard } from "grammy";

const composer = new Composer();

export const message: string =
  `<b>Assalomu alaykum, hurmatli administrator!</b> \n` +
  `\n` +
  `Sizni ko'rib turganimdan bag'oyatda xursandman. ` +
  `Men Ecma.uz hamjamiyati tomonidan yaratilgan bot hisoblanib, ` +
  `Ecma hamjamiyati foydalanuvchilari uchun foydali resurslarni yetkazish, saqlash va ` +
  `ularni saralash uchun xizmat qilaman.`;

export const keyboard = new InlineKeyboard()
  .url("React hamjamiyati", "https://t.me/react_uz")
  .url("Node.js hamjamiyati", "https://t.me/nodejs_uz");

composer.command("start", async (ctx: Context): Promise<void> => {
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
