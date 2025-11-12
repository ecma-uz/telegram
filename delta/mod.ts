import start from "./start.ts";
import help from "./help.ts";
import inline from "./inline.ts";
import which from "./which.ts";
import { Bot } from "../deps.ts";
import about from "./about.ts";
import rules from "./rules.ts";
import text from "./text.ts";
import report from "./report.ts";
import groups from "./groups.ts";
import trigger from "./trigger.ts";
import feedback from "./feedback.ts";
import code from "./code.ts";
import doc from "./doc.ts";

export default (bot: Bot) => {
  bot
    .use(start)
    .use(help)
    .use(groups)
    .use(inline)
    .use(which)
    .use(report)
    .use(about)
    .use(rules)
    .use(feedback)
    .use(trigger)
    .use(doc)
    .use(code)
    .use(text);
};
