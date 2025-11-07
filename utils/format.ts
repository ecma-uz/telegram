import type { NpmSearchItem } from "./types.ts";

export function md2(s = "") {
  return s.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, (m) => "\\" + m);
}

export function kfmt(n?: number) {
  if (n == null) return "";
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function buildMessage(
  item: NpmSearchItem,
  weekly?: number,
  hasTypes?: boolean,
) {
  const lines = [
    `*${md2(item.name)}*  \`${md2(item.version)}\``,
    item.description ? md2(item.description) : "_tavsif mavjud emas_",
    "",
    "📦 O‘rnatish:",
    `\`npm i ${md2(item.name)}\``,
    `\`yarn add ${md2(item.name)}\``,
    `\`pnpm add ${md2(item.name)}\``,
    "",
    `[npm](${md2(item.npmUrl)})` +
    (item.repoUrl ? ` • [repo](${md2(item.repoUrl)})` : "") +
    (item.homeUrl ? ` • [home](${md2(item.homeUrl)})` : ""),
    weekly != null ? `\n_${kfmt(weekly)} haftalik yuklab olishlar_` : "",
    hasTypes ? `\n_Types mavjud: ✅ @types/${md2(item.name)}_` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildKeyboard(item: NpmSearchItem) {
  const row = [{ text: "npm", url: item.npmUrl }] as Array<{ text: string; url: string }>;
  if (item.repoUrl) row.push({ text: "repo", url: item.repoUrl });
  if (item.homeUrl) row.push({ text: "home", url: item.homeUrl });
  return { inline_keyboard: [row] };
}
