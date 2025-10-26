import { Bot } from "grammy";
import { setupCommands } from "./commands";
import Config, { BotConfig } from "./config/config";
import parseArgs from "./config/cli";
import env from "./config/env";
import express from "express";

function setupWebhook(bot: Bot, config: BotConfig, app: express.Express): void {
  console.info(`[INFO] bot is starting on ${config.mode}`);
  
  app.use(express.json());
  
  app.post(`/${bot.token}`, async (req, res) => {
    try {
      await bot.handleUpdate(req.body);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

  app.get("/", async (req, res) => {
    try {
      await bot.api.setWebhook(`${config.host}/${bot.token}`);
      res.send("Done. Set");
    } catch (_) {
      res.send("Couldn't succeed with installing webhook");
    }
  });

  app.listen(config.port, "127.0.0.1", () => {
    console.info(`Server listening on port ${config.port}`);
  });
};

async function startPolling(bot: Bot): Promise<void> {
  await bot.start();
}

async function launch(): Promise<void> {
  const useEnv = env.token !== "";
  let data: BotConfig;
  
  if (useEnv) {
    data = {
      token: env.token,
      mode: env.mode,
      host: env.host,
      port: env.port,
    };
  } else {
    if (parseArgs.config == undefined) {
      console.error("BOT_TOKEN environment variable or --config argument required!");
      process.exit(1);
    }

    const config = new Config(parseArgs.config);
    config.consume();
    data = config.data();
  }
  
  const bot = new Bot(data.token);

  setupCommands(bot);
  bot.catch((error) => {
    console.error(error, error.ctx.api);
  });

  const app = express();

  switch (data.mode) {
    case "webhook":
      setupWebhook(bot, data, app);
      break;
    case "polling":
      await startPolling(bot);
      break;
    default:
      throw new Error(`Invalid deployment mode: ${data.mode}`);
  }
};

launch();

