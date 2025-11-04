import start from "./start.ts";
import help from "./help.ts";
import inline from "./inline.ts";
import moderation from "./moderation.ts";
import which from "./which.ts";
import { Bot } from "../deps.ts";
import about from "./about.ts";
import rules from "./rules.ts";
import text from "./text.ts";
import groups from "./groups.ts";
import warrior from "./warrior.ts";
import trigger from "./trigger.ts";
import feedback from "./feedback.ts";
import code from "./code.ts";

export default (bot: Bot) => {
  bot
    .use(start)
    .use(help)
    .use(groups)
    .use(inline)
    .use(moderation)
    .use(which)
    .use(about)
    .use(rules)
    .use(feedback)
    .use(warrior)
    .use(trigger)
    .use(code)
    .use(text);
};
