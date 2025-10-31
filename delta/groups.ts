import { Composer, Context, Groups, InlineKeyboard } from "../deps.ts";

const composer = new Composer();

composer.command("groups", async (ctx: Context): Promise<void> => {
  const keyboard = new InlineKeyboard();

  try {
    const groups = await Groups.groups(1);
    const nextLength = (await Groups.groups(2)).length;

    for (const group of groups) {
      keyboard.text(`${group.name} (${group.packs})`, `group_1_${group.name}`);
      keyboard.row();
    }

    if (nextLength > 0) {
      keyboard.text("Keyingi ➡️", "groups_2");
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
      "⚠️ Hozircha guruhlar ro'yxatini olib bo'lmadi. Keyinroq yana /groups buyrug'ini bering.",
    );
  }
});

composer.callbackQuery(
  /^groups_(\d+)$/,
  async (ctx: Context): Promise<void> => {
    const page = Number(ctx.match![1]);
    const keyboard = new InlineKeyboard();

    try {
      const groups = await Groups.groups(page);
      const prevLength = (await Groups.groups(page - 1)).length;
      const nextLength = (await Groups.groups(page + 1)).length;

      for (const group of groups) {
        keyboard.text(
          `${group.name} (${group.packs})`,
          `group_${page}_${group.name}`,
        );
        keyboard.row();
      }

      if (prevLength > 0) {
        keyboard.text("⬅️ Oldingi", `groups_${page - 1}`);
      }
      if (nextLength > 0) {
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
      console.error("[groups page] fetch failed:", error);
      await ctx.answerCallbackQuery({
        text: "Guruhlar serveri javob bermadi",
        show_alert: true,
      });
    }
  },
);

composer.callbackQuery(/^group_(\d+)_(.*)$/, async (ctx: Context) => {
  const page = ctx.match![1];
  const name = ctx.match![2];
  const keyboard = new InlineKeyboard();

  try {
    const group = await Groups.group(name);

    for (const data of group.packs) {
      keyboard.switchInlineCurrent(`${data.name}`, `${data.name}`);

      if ((group.packs.indexOf(data) + 1) % 3 === 0) {
        keyboard.row();
      }
    }

    keyboard.row().text("🔙 Orqaga", `groups_${page}`);

    await ctx.editMessageText(
      `<b>${group.arch} arxitekturasidagi ${group.name} to'planmada ${group.packs.length} ta paketlar mavjud:</b>`,
      {
        parse_mode: "HTML",
        reply_markup: keyboard,
      },
    );
  } catch (error) {
    console.error("[group detail] fetch failed:", error);
    await ctx.answerCallbackQuery({
      text: "Guruh ma'lumotini olishning iloji bo'lmadi",
      show_alert: true,
    });
  }
});

export default composer;
