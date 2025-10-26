import { Bot } from "grammy";
import { setupCommands } from "./commands";
import { config } from "./config";
import express from "express";

function setupWebhook(bot: Bot, app: express.Express): void {
  console.info(`[INFO] Bot is starting in ${config.mode} mode`);
  
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
  const bot = new Bot(config.token);

  setupCommands(bot);
  bot.catch((error) => {
    console.error(error, error.ctx.api);
  });

  const app = express();

  switch (config.mode) {
    case "webhook":
      setupWebhook(bot, app);
      break;
    case "polling":
      await startPolling(bot);
      break;
    default:
      throw new Error(`Invalid deployment mode: ${config.mode}`);
  }
};

launch();

