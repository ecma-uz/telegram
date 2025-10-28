import dotenv from "dotenv";

dotenv.config();

interface BotConfig {
  token: string;
  host: string;
  port: number;
  adminUserIds: number[];
  homeChatId: number;
}

function loadConfig(): BotConfig {
  const token = process.env.BOT_TOKEN;
  if (!token) {
    throw new Error("BOT_TOKEN environment variable is required!");
  }

  return {
    token,
    host: process.env.BOT_HOST || "127.0.0.1",
    port: parseInt(process.env.BOT_PORT || "8000", 10),
    adminUserIds: process.env.ADMIN_USER_ID
      ? process.env.ADMIN_USER_ID.split(",").map((id) =>
          parseInt(id.trim(), 10),
        )
      : [],
    homeChatId: parseInt(process.env.HOME_CHAT_ID || "0", 10),
  };
}

export const config = loadConfig();
