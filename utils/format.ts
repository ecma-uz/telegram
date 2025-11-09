import type { NpmSearchItem } from "../lib/npm.ts";

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
  const parts: string[] = [];

  parts.push(`*${md2(item.name)}* \`v${md2(item.version)}\``);
  if (item.description) {
    parts.push(`_${md2(item.description)}_`);
    parts.push("");
  }

  if (weekly != null || hasTypes) {
    const stats: string[] = [];
    if (weekly != null) {
      stats.push(`${md2(kfmt(weekly))} haftalik`);
    }
    if (hasTypes) {
      stats.push(`${md2("TypeScript")} types`);
    }
    if (stats.length > 0) {
      parts.push(stats.join(" • "));
      parts.push("");
    }
  }

  parts.push(`*${md2("O'rnatish:")}*`);
  parts.push(`\`\`\`bash`);
  parts.push(`npm i ${md2(item.name)}`);
  parts.push(`yarn add ${md2(item.name)}`);
  parts.push(`pnpm add ${md2(item.name)}`);
  parts.push(`\`\`\``);

  return parts.join("\n");
}

export function buildKeyboard(item: NpmSearchItem) {
  const row = [{ text: "npm", url: item.npmUrl }] as Array<{ text: string; url: string }>;
  if (item.repoUrl) row.push({ text: "repo", url: item.repoUrl });
  if (item.homeUrl) row.push({ text: "home", url: item.homeUrl });
  return { inline_keyboard: [row] };
}
