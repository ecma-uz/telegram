import { Composer, Context } from "../deps.ts";
import { buildKeyboard, buildMessage } from "../utils/format.ts";
import { searchNpms, mapItem, fetchDownloads, hasTypes } from "../lib/npm.ts";

const CACHE_TIME = 30;
const MIN_LEN = 2;
const INLINE_RE = /^(npm|pkg|package|npms)(\s+.+)?$/i;

function isExact(raw: string) {
  return /^npm!\s+/i.test(raw);
}

const composer = new Composer<Context>();

composer.inlineQuery(INLINE_RE, async (ctx) => {
  const raw = (ctx.inlineQuery?.query ?? "").trim();
  const q = raw.replace(/^npm!?\s*/i, "");

  if (q.length < MIN_LEN) {
    return await ctx.answerInlineQuery([], { cache_time: 0, is_personal: true });
  }

  const offset = Number(ctx.inlineQuery?.offset || "0") || 0;

  let data;
  try {
    data = await searchNpms(q, offset);
  } catch {
    return await ctx.answerInlineQuery([], {
      cache_time: 1,
      is_personal: true,
      switch_pm_text: "NPM qidiruvda xatolik. Keyinroq urinib ko'ring.",
      switch_pm_parameter: "npm-error",
    });
  }

  const results = await Promise.all(
    data.results.map(async (it, i) => {
      const item = mapItem(it);
      const [dls, hasT] = await Promise.all([
        fetchDownloads(item.name),
        hasTypes(item.name),
      ]);

      const titleSuffix = dls != null ? ` • ${dls.toLocaleString()} w` : "";
      const title = `${item.name} — ${item.version}${titleSuffix}`;
      const description = item.description ?? "";

      return {
        type: "article",
        id: String(offset + i),
        title,
        description,
        input_message_content: {
          message_text: buildMessage(item, dls, hasT),
          parse_mode: "MarkdownV2",
          disable_web_page_preview: true,
        },
        reply_markup: buildKeyboard(item),
      };
    }),
  );

  const finalResults = isExact(raw) && results.length
    ? [results[0], ...results.slice(1)]
    : results;

  const nextOffset = offset + finalResults.length;
  const hasMore = nextOffset < (data.total ?? 0);

  return await ctx.answerInlineQuery(finalResults, {
    cache_time: CACHE_TIME,
    is_personal: false,
    next_offset: hasMore ? String(nextOffset) : undefined,
    switch_pm_text: finalResults.length ? undefined : "Ehh hech narsa topilmadi",
    switch_pm_parameter: finalResults.length ? undefined : "npm-empty",
  });
});

composer.command(["npm", "pkg", "package"], async (ctx) => {
  const raw = (ctx.match as string)?.trim() ?? "";
  if (!raw) {
    await ctx.reply("Foydalanish: `/npm react`", { parse_mode: "Markdown" });
    return;
  }

  try {
    const data = await searchNpms(raw, 0);
    const top3 = data.results.slice(0, 3);
    if (!top3.length) {
      await ctx.reply("Ehh hech narsa topilmadi.");
      return;
    }

    for (const r of top3) {
      const item = mapItem(r);
      const [dls, hasT] = await Promise.all([
        fetchDownloads(item.name),
        hasTypes(item.name),
      ]);

      await ctx.reply(buildMessage(item, dls, hasT), {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      });
    }
  } catch {
    await ctx.reply("Hmm NPM qidiruvda xatolik. Keyinroq urinib ko'ring.");
  }
});

export default composer;
