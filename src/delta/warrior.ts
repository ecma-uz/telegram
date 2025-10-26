import { Composer, Context, InputFile } from "grammy";
import isUwU from "../hooks/isUwU";
import isReply from "../hooks/isReply";

const composer = new Composer();

composer.command(
  "warrior",
  isReply,
  isUwU,
  async (ctx: Context): Promise<void> => {
    const name = ctx.message!.reply_to_message!.from!.first_name;
    const file: InputFile = new InputFile({
      url: `https://og.xinux.uz/api/warrior?full_name=${encodeURI(name)}`,
    });
    const caption =
      `<a href="tg://user?id=${ctx?.message?.reply_to_message?.from?.id}">${name}</a> ga Faxriy Yorlig' ob chiqilar!`;

    if (ctx.message?.message_thread_id) {
      await ctx.replyWithPhoto(file, {
        message_thread_id: ctx.message.message_thread_id,
        caption,
        parse_mode: "HTML",
      });
    } else {
      await ctx.replyWithPhoto(file, {
        caption,
        parse_mode: "HTML",
      });
    }
  },
);

export default composer;
