import composer from "./report.ts";

composer.command("strikes", async (ctx) => {
    if (!(await ensureAdmin(ctx))) return;

    const r = ctx.message?.reply_to_message?.from;
    if (!r) {
        await ctx.reply("Kimning strikes sonini ko‘rmoqchisiz? Iltimos, o‘sha xabarga reply qiling.");
        return;
    }
    const count = strikes.get(key(ctx.chat!.id, r.id!)) ?? 0;
    await ctx.reply(
        `👤 ${r.first_name || "Foydalanuvchi"} — strikes: ${count}`,
        { reply_to_message_id: ctx.message!.message_id },
    );
});

composer.command("clearstrikes", async (ctx) => {
    if (!(await ensureAdmin(ctx))) return;

    const r = ctx.message?.reply_to_message?.from;
    if (!r) {
        await ctx.reply("Kimning strikesini tozalamoqchisiz? Iltimos, o‘sha xabarga reply qiling.");
        return;
    }
    strikes.delete(key(ctx.chat!.id, r.id!));
    await ctx.reply("✅ Strikes tozalandi.");
});

export default composer;