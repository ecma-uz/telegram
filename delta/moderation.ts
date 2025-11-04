import { Composer, Context } from "../deps.ts";

const composer = new Composer<Context>();

const strikes = new Map<string, number>();

const adminCache = new Map<string, { ok: boolean; ts: number }>();
const ADMIN_CACHE_MS = 30_000;

const WARN_LIMIT = 3 as const;
const BAN_SCHEDULE = [
  { label: "1 hafta", seconds: 60 * 60 * 24 * 7 },
  { label: "2 hafta", seconds: 60 * 60 * 24 * 14 },
  { label: "1 oy", seconds: 60 * 60 * 24 * 30 },
] as const;
const LONG_BAN_SECONDS = 60 * 60 * 24 * 365;

function key(chatId: number, userId: number) {
  return `${chatId}:${userId}`;
}

async function ensureAdmin(ctx: Context): Promise<boolean> {
  const chatId = ctx.chat?.id;
  const userId = ctx.from?.id;
  if (!chatId || !userId) return false;

  const k = key(chatId, userId);
  const cached = adminCache.get(k);
  const now = Date.now();

  if (cached && now - cached.ts < ADMIN_CACHE_MS) {
    if (!cached.ok) {
      await ctx.answerCallbackQuery({
        text: "Bu tugma faqat adminlar uchun.",
        show_alert: true,
      });
    }
    return cached.ok;
  }

  try {
    const member = await ctx.getChatMember(userId);
    const ok = ["administrator", "creator"].includes(member.status as string);
    adminCache.set(k, { ok, ts: now });

    if (!ok) {
      await ctx.answerCallbackQuery({
        text: "Bu faqat adminlar uchun.",
        show_alert: true,
      });
    }
    return ok;
  } catch {
    return false;
  }
}

async function applyEscalation(
  ctx: Context,
  offenderId: number,
  offenderName: string,
  reason: string,
  repliedMsgId?: number,
) {
  const chatId = ctx.chat!.id;
  const k = key(chatId, offenderId);

  const prev = strikes.get(k) ?? 0;
  const current = prev + 1;
  strikes.set(k, current);

  let resultLine = "";
  console.log(WARN_LIMIT);
  if (current <= WARN_LIMIT) {
    resultLine = `⚠️ Ogohlantirish #${current} (ban qo‘llanmadi).`;
  } else {
    const banIndex = current - WARN_LIMIT - 1;
    const step = BAN_SCHEDULE[banIndex];

    if (step) {
      const until = Math.floor(Date.now() / 1000) + step.seconds;
      try {
        await ctx.banChatMember(offenderId, until);
        resultLine = `⛔️ ${step.label} ga ban qilindi.`;
      } catch {
        resultLine = `⛔️ ${step.label} ga ban qilish kerak edi, lekin botda admin huquqi yo'q.`;
      }
    } else {
      const until = Math.floor(Date.now() / 1000) + LONG_BAN_SECONDS;
      try {
        await ctx.banChatMember(offenderId, until);
        resultLine = "⛔️ Takroriy buzilish: 1 yilga ban qilindi.";
      } catch {
        resultLine =
          "⛔️ Takroriy buzilish: ban qilish kerak edi, lekin botda admin huquqi yo'q.";
      }
    }
  }

  const text =
    `🚩 <a href="tg://user?id=${offenderId}">${offenderName}</a> bo'yicha *report* tasdiqlandi.\n` +
    `Sabab: <b>${reason}</b>\n` +
    `Joriy hisoblagich (strikes): <b>${current}</b>\n` +
    resultLine;

  await ctx.reply(text, {
    parse_mode: "HTML",
    reply_to_message_id: repliedMsgId,
    disable_web_page_preview: true,
  });
}

composer.callbackQuery(/^mod_report:(.+)$/, async (ctx: Context) => {
  const isAdmin = await ensureAdmin(ctx);
  if (!isAdmin) return;

  const replied = ctx.callbackQuery.message?.reply_to_message;
  if (!replied?.from) {
    await ctx.answerCallbackQuery({
      text: "Report xabar avval yomon xabarga *reply* bo‘lishi kerak.",
      show_alert: true,
    });
    return;
  }

  const offender = replied.from!;
  const reason = ctx.match![1];

  await applyEscalation(
    ctx,
    offender.id!,
    offender.first_name || "Foydalanuvchi",
    reason,
    replied.message_id,
  );

  await ctx.answerCallbackQuery({ text: "Report tasdiqlandi ✅" });
});

export default composer;
