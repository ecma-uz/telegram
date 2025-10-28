import { Bot } from "grammy";
import { setupCommands } from "./commands";
import { config } from "./config";

async function startPolling(bot: Bot): Promise<void> {
  await bot.start();
}

async function launch(): Promise<void> {
  const bot = new Bot(config.token);

  setupCommands(bot);
  bot.catch((error) => {
    console.error(error, error.ctx.api);
  });

  await startPolling(bot);
}

launch();
