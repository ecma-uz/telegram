import { Composer, Context } from "grammy";

const composer = new Composer();

interface Language {
  language: string;
  version: string;
  aliases: string[];
  runtime: string | undefined;
}

interface Response {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: unknown;
    output: string;
  };
}

composer.command("code", async (ctx: Context) => {
  try {
    const _msg = ctx.message!.text;
    if (typeof _msg === "undefined") return;
    const msg_id = ctx.message!.message_id;
    const msg = _msg.replace(/\n/gi, " ");
    const splitted = msg?.split(" ");

    if (typeof splitted[1] === "undefined") {
      return ctx.reply("Dasturlash tili ko'rsatilmadi", {
        reply_to_message_id: msg_id,
      });
    }
    if (typeof splitted[2] === "undefined") {
      return ctx.reply("Kod ko'rsatilmadi", {
        reply_to_message_id: msg_id,
      });
    }

    const lang = splitted[1].toLowerCase();

    if (lang === "python" || lang === "py") {
      return ctx.reply(
        "Uzr, python tili sintaksisda \"space\"ga ishongani uchun, menga to'g'ri kelmaydi",
        {
          reply_to_message_id: msg_id,
        },
      );
    }

    splitted[0] = "";
    splitted[1] = "";

    const code = splitted.join(" ");
    const available_langs = await fetch(
      "https://emkc.org/api/v2/piston/runtimes",
    );
    const available_langs_json = (await available_langs.json()) as Language[];
    const foundLang = available_langs_json.find(
      (l: Language) => l.language === lang,
    );
    const available_version = foundLang?.version;

    if (
      typeof available_version === "undefined" &&
      (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup")
    ) {
      return ctx.reply(
        `${lang} tili bizning ro'yxatimizda yo'q :(\n` +
          `To'liq ro'yxatni dm orqali shu xabarni yuborib bila olasiz`,
        {
          reply_to_message_id: msg_id,
        },
      );
    }

    if (
      typeof available_version === "undefined" &&
      ctx.chat?.type === "private"
    ) {
      let msg = `${lang} tili bizning ro'yxatimizda yo'q, to'liq ro'yxat:\n`;
      available_langs_json.forEach((l: Language) => {
        msg += l.language + "\n";
      });
      return await ctx.reply(msg, { reply_to_message_id: msg_id });
    }

    const _output = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      body: JSON.stringify({
        language: lang,
        version: available_version,
        files: [
          {
            content: code,
          },
        ],
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const outputjson = (await _output.json()) as Response;

    const stdout = outputjson.run.stdout.replace(/\n/gi, " ") + "\n";
    const stderror = outputjson.run.stderr.replace(/\n/gi, " ") + "\n";
    const output = outputjson.run.output.replace(/\n/gi, " ") + "\n";
    const exitCode = outputjson.run.code;

    const message = `<strong>Til</strong>: ${outputjson.language}\n` +
      `<strong>Versiya:</strong> ${outputjson.version}\n` +
      `<strong>Natija:</strong>\n` +
      `   <strong>stdout:</strong> ${stdout}` +
      `   <strong>stderror:</strong> ${stderror}` +
      `   <strong>exit code:</strong> ${exitCode}\n` +
      `   <strong>output:</strong> ${output}`;

    return await ctx.reply(message, {
      reply_to_message_id: msg_id,
      parse_mode: "HTML",
    });
  } catch (err) {
    console.log(err);
    return ctx.reply("500: bot xatoligi", {
      reply_to_message_id: ctx.message?.message_id,
    });
  }
});

export default composer;
