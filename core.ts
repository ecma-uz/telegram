import { blue, Bot, webhookCallback } from "./deps.ts";
import "./utils/config.ts";
import delta from "./delta/mod.ts";
import { Config, Configs } from "./utils/config.ts";
import args from "./utils/cli.ts";

export const handle = (bot: Bot) => webhookCallback(bot, "std/http");

const webhook = (bot: Bot, config: Configs) => {
  console.log(blue("[INFO]"), `bot is starting on ${config.mode}`);

  Deno.serve(
    {
      port: config.port,
      hostname: "127.0.0.1",
    },
    async (req) => {
      const url = new URL(req.url);

      if (req.method === "POST") {
        if (url.pathname.slice(1) === bot.token) {
          try {
            return await handle(bot)(req);
          } catch (err) {
            console.error(err);
          }
        }
      }

      if (req.method === "GET") {
        try {
          await bot.api.setWebhook(`${config.host}/${bot.token}`);
          return new Response("Done. Set");
        } catch (_) {
          return new Response("Couldn't succeed with installing webhook");
        }
      }

      return new Response("What you're trying to post?");
    },
  );
};

const polling = async (bot: Bot) => {
  await bot.start();
};

export const launch = async () => {
  if (args.config == undefined) {
    console.info("Path to config file is not defined!");
    Deno.exit(1);
  }

  const config = new Config(args.config);
  await config.consume();

  const data: Configs = config.data();
  const bot = new Bot(data.token);

  delta(bot);
  bot.catch((error) => {
    console.log(error, error.ctx.api);
  });

  switch (data.mode) {
    case "webhook":
      webhook(bot, data);
      break;
    case "polling":
      await polling(bot);
      break;
    default:
      throw new Error("Deploy method not validated!");
  }
};

await launch();
