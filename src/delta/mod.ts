import start from "./start";
import help from "./help";
import inline from "./inline";
import which from "./which";
import { Bot } from "../deps";
import about from "./about";
import rules from "./rules";
import text from "./text";
import groups from "./groups";
import honor from "./honor";
import warrior from "./warrior";
import trigger from "./trigger";
import feedback from "./feedback";
import code from "./code";

export default (bot: Bot) => {
  bot
    .use(start)
    .use(honor)
    .use(help)
    .use(groups)
    .use(inline)
    .use(which)
    .use(about)
    .use(rules)
    .use(feedback)
    .use(warrior)
    .use(trigger)
    .use(code)
    .use(text);
};
