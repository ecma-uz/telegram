// deno-lint-ignore-file no-explicit-any
import { Composer, Context, InlineKeyboard } from "../deps.ts";
import isPrivate from "../hooks/isPrivate.ts";
import { reply } from "../utils/sender.ts";

const composer = new Composer();

export const message = (ctx: Context) =>
  `<b>Hurmatli ${ctx.from!.first_name}!</b> \n` +
  `\n` +
  `\n` +
  `Ecma.uz distributivi haqida o'z fikringizni yozib qoldiring... ` +
  `Bizga o'z fikringizni yozib qoldirganingiz uchun o'z ` +
  `minnatdorchiligimizni bildiramiz. Ushbu fikr va kamchiliklar ` +
  `tez orada muhokama qilib bo'lishimiz bilanoq kuchga kiritishga ` +
  `harakat qilami!`;

export const keyboard = new InlineKeyboard().url(
  `Disskussiyaga o'tish`,
  `https://github.com/orgs/uzinfocom-org/discussions`,
);

composer.command("feedback", isPrivate, async (ctx: Context): Promise<any> => {
  return await reply(ctx, message(ctx), keyboard);
});

export default composer;
