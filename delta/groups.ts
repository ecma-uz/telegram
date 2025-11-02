import { Composer, Context, InlineKeyboard } from "../deps.ts";
import communities from "../data/communities.json" with { type: "json" };

const composer = new Composer();

const PAGE_SIZE = 10;

const getCommunitiesPage = (page: number) => {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const items = communities.slice(start, end);
  const prevExists = page > 1;
  const nextExists = end < communities.length;
  return { items, prevExists, nextExists };
};

composer.command("groups", async (ctx: Context): Promise<void> => {
  const page = 1;
  const { items, nextExists } = getCommunitiesPage(page);
  const keyboard = new InlineKeyboard();

  try {
    for (const community of items) {
      keyboard.text(community.name, `group_${page}_${community.name}`);
      keyboard.row();
    }

    if (nextExists) {
      keyboard.text("Keyingi ➡️", `groups_${page + 1}`);
    }

    const text = "Ushbu ro'yxatdan kerakli guruhni tanlab oling";

    if (ctx.message?.is_topic_message) {
      await ctx.reply(text, {
        message_thread_id: ctx.message.message_thread_id,
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    } else {
      await ctx.reply(text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } catch (error) {
    console.error("[groups] fetch failed:", error);
    await ctx.reply(
      "Hozircha guruhlar ro'yxatini olib bo'lmadi. Keyinroq yana /groups buyrug'ini bering.",
    );
  }
});

composer.callbackQuery(
  /^groups_(\d+)$/,
  async (ctx: Context): Promise<void> => {
    const page = Number(ctx.match![1]);
    const { items, prevExists, nextExists } = getCommunitiesPage(page);
    const keyboard = new InlineKeyboard();

    try {
      for (const community of items) {
        keyboard.text(community.name, `group_${page}_${community.name}`);
        keyboard.row();
      }

      if (prevExists) {
        keyboard.text("⬅️ Oldingi", `groups_${page - 1}`);
      }
      if (nextExists) {
        keyboard.text("Keyingi ➡️", `groups_${page + 1}`);
      }

      await ctx.editMessageText(
        "Ushbu ro'yxatdan kerakli guruhni tanlab oling",
        {
          parse_mode: "HTML",
          reply_markup: keyboard,
        },
      );
    } catch (error) {
      console.error("[groups page] load failed:", error);
      await ctx.answerCallbackQuery({
        text: "Guruhlar ro'yxatini olishning iloji bo'lmadi",
        show_alert: true,
      });
    }
  },
);

composer.callbackQuery(/^group_(\d+)_(.*)$/, async (ctx: Context) => {
  const page = Number(ctx.match![1]);
  const name = ctx.match![2];
  const keyboard = new InlineKeyboard();

  try {
    const community = communities.find((c) => c.name === name);
    if (!community) {
      await ctx.answerCallbackQuery({
        text: "Bu nomdagi hamjamiyat topilmadi",
        show_alert: true,
      });
      return;
    }

    if (community.telegram) {
      keyboard.url(
        "🟦 Telegram",
        `https://t.me/${community.telegram.replace("@", "")}`,
      );
    }
    if (community.link) {
      keyboard.url("🌐 Sayt", community.link);
    }

    keyboard.row().text("🔙 Orqaga", `groups_${page}`);

    const text = `<b>${community.name}</b>\n\n` +
      (community.about ? `${community.about}\n\n` : "") +
      (community.telegram ? `Telegram: ${community.telegram}\n` : "") +
      (community.link ? `Sayt: ${community.link}\n` : "");

    await ctx.editMessageText(text, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error("[group detail] load failed:", error);
    await ctx.answerCallbackQuery({
      text: "Hamjamiyat ma'lumotini olishning iloji bo'lmadi",
      show_alert: true,
    });
  }
});

export default composer;
