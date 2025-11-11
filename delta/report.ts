import {Composer, Context} from "../deps.ts";

const composer = new Composer<Context>();

const CONFIG = {
    warnLimit: 1,
    deleteOffenseMessage: true,
    adminCacheMs: 30_000,
} as const;

const BAN_SCHEDULE = [
    { label: "1 soat", seconds: 60 * 60 },
    { label: "1 hafta", seconds: 60 * 60 * 24 * 7 },
    { label: "2 hafta", seconds: 60 * 60 * 24 * 14 },
    { label: "1 oy", seconds: 60 * 60 * 24 * 30 },
    { label: "1 yil", seconds: 60 * 60 * 24 * 365 },
] as const;

const REASON_ALIASES: Record<string, string> = {
    "so'kinish": "so‘kinish/haqorat",
    "so'k": "so‘kinish/haqorat",
    "haqorat": "so‘kinish/haqorat",
    "badwords": "so‘kinish/haqorat",

    "ad": "reklama/link",
    "ads": "reklama/link",
    "reklama": "reklama/link",
    "link": "reklama/link",
    "tg": "reklama/link",
    "instagram": "reklama/link",

    "ai": "AI/chatgpt kontent",
    "chatgpt": "AI/chatgpt kontent",

    "spam": "spam",
    "off": "off-topic",
    "offtopic": "off-topic",
};

function normalizeReason(raw?: string): string {
    const k = (raw || "").trim().toLowerCase();
    if (!k) return "Qoida buzilishi";
    return REASON_ALIASES[k] ?? raw!;
}

const adminCache = new Map<string, { ok: boolean; ts: number }>();
const strikes = new Map<string, number>();

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

    if (cached && now - cached.ts < CONFIG.adminCacheMs) {
        if (!cached.ok) await ctx.reply("Bu buyruq faqat adminlar uchun.");
        return cached.ok;
    }

    try {
        const member = await ctx.getChatMember(userId);
        const ok = ["administrator", "creator"].includes(member.status as string);
        adminCache.set(k, { ok, ts: now });
        if (!ok) await ctx.reply("Bu buyruq faqat adminlar uchun.");
        return ok;
    } catch {
        return false;
    }
}

function humanStep(idx: number) {
    return BAN_SCHEDULE[Math.min(idx, BAN_SCHEDULE.length - 1)];
}

async function tryDeleteMessage(ctx: Context, chatId: number, messageId: number) {
    if (!CONFIG.deleteOffenseMessage) return;
    try {
        await ctx.api.deleteMessage(chatId, messageId);
    } catch {
        console.error("Error deleting message", chatId, messageId);
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
    if (current <= CONFIG.warnLimit) {
        resultLine = `⚠️ Ogohlantirish #${current}. Hozircha ban qo‘llanmadi.`;
    } else {
        const banIdx = current - CONFIG.warnLimit - 1; // 0-dan
        const step = humanStep(banIdx);
        const until = Math.floor(Date.now() / 1000) + step.seconds;

        try {
            await ctx.banChatMember(offenderId, until);
            resultLine = `⛔️ ${step.label}ga ban qilindi.`;
            await tryDeleteMessage(ctx, chatId, repliedMsgId!);
        } catch {
            resultLine =
                "⛔️ Ban qilish kerak edi, ammo botda yetarli huquq yo‘q (yoki Telegram xatosi).";
        }
    }

    const text =
        `🚩 <a href="tg://user?id=${offenderId}">${offenderName}</a> bo‘yicha chora ko‘rildi.\n` +
        `Sabab: <b>${reason}</b>\n` +
        `Joriy strikes: <b>${current}</b>\n` +
        resultLine;

    await ctx.reply(text, {
        parse_mode: "HTML",
        reply_to_message_id: repliedMsgId,
        disable_web_page_preview: true,
    });
}

async function reportHandler(ctx: Context) {
    if (!(await ensureAdmin(ctx))) return;

    const replied = ctx.message?.reply_to_message;
    if (!replied?.from) {
        await ctx.reply(
            "Avval buzilgan xabarni Reply qiling, keyin buyruqni yuboring.\n" +
            "Misol: /report so'kinish",
        );
        return;
    }

    const rawReason = (ctx.match as string)?.trim();
    const reason = normalizeReason(rawReason);
    const offender = replied.from;

    await applyEscalation(
        ctx,
        offender.id!,
        offender.first_name || "Foydalanuvchi",
        reason,
        replied.message_id,
    );
}

composer.command(["report", "rep"], reportHandler);

export default composer;
