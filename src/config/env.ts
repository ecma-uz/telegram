import dotenv from "dotenv";

dotenv.config();

export default {
  token: process.env.BOT_TOKEN || "",
  mode: (process.env.BOT_MODE as "webhook" | "polling") || "polling",
  host: process.env.BOT_HOST || "127.0.0.1",
  port: parseInt(process.env.BOT_PORT || "8000", 10),
  adminUserId: parseInt(process.env.ADMIN_USER_ID || "0", 10),
  homeChatId: parseInt(process.env.HOME_CHAT_ID || "0", 10),
  adminUserIds: process.env.ADMIN_USER_ID?.split(",").map(id => parseInt(id.trim(), 10)) || [],
};

