import {
    Composer,
    Context,
    InlineKeyboard,
    type InlineQueryResult,
} from "../deps.ts";

const composer = new Composer<Context>();

composer.inlineQuery(/(.*)/gi, async (ctx: Context) => {
    const raw = ctx.inlineQuery?.query?.trim() ?? "";
    if (!raw.toLowerCase().startsWith("report")) {
        return await ctx.answerInlineQuery([], { cache_time: 0 });
    }

    const extra = raw.split(" ").slice(1).join(" ").trim();

    const kb = (reason: string) =>
        new InlineKeyboard().text("✅ Reportni tasdiqlash (admin)", `mod_report:${reason}`);

    const results: InlineQueryResult[] = [
        {
            type: "article",
            id: "rep_badwords",
            title: "So'kinish / haqorat",
            description: "Reply qilib yuboring, keyin tugmani bosing",
            reply_markup: kb("badwords"),
            input_message_content: {
                message_text:
                    "*Report:* guruh qoidalariga zid so'zlar (so'kinish / haqorat). Admin, iltimos tekshiring.",
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "rep_ads",
            title: "Reklama / link",
            description: "t.me, instagram, noma'lum link ...",
            reply_markup: kb("ads"),
            input_message_content: {
                message_text:
                    "*Report:* ruxsatsiz reklama yoki tashqi havola yuborilgan. Admin, iltimos tekshiring.",
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "rep_ai",
            title: "AI / ChatGPT kontent",
            description: "AI yozgani o'xshaydi",
            reply_markup: kb("ai"),
            input_message_content: {
                message_text:
                    "*Report:* AI/chatgpt uslubidagi kontent. Admin, iltimos tekshiring.",
                parse_mode: "Markdown",
            },
        },
        {
            type: "article",
            id: "rep_other",
            title: "Boshqa qoida buzilishi",
            description: extra ? `Izoh: ${extra}` : "off-topic, flood, spam ...",
            reply_markup: kb(extra || "other"),
            input_message_content: {
                message_text: extra
                    ? `*Report:* ${extra}`
                    : "*Report:* Boshqa qoida buzilishi. Admin, iltimos tekshiring.",
                parse_mode: "Markdown",
            },
        },
    ];

    return await ctx.answerInlineQuery(results, { cache_time: 0 });
});

export default composer;