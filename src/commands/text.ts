import { Composer, Context } from "grammy";
import topics from "../topics.json";
import env from "../config/env";

const composer = new Composer();

composer.on("message:text", async (ctx: Context): Promise<any> => {
  if (
    ctx.chat!.id === env.homeChatId &&
    ctx.message!.message_thread_id === topics["neofetch"]
  ) {
    return await ctx.deleteMessage();
  }

  if (
    ctx?.message?.from?.username &&
    ctx?.message?.from?.username === "Channel_Bot"
  ) {
    return await ctx.deleteMessage();
  }
});

composer.on("channel_post", (ctx: Context): void => {
  console.log("Type:", ctx.chat!.type, " with ID of:", ctx.chat!.id);
});

export default composer;
