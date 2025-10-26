import start from "./start";
import help from "./help";
import about from "./about";
import rules from "./rules";
import which from "./which";
import honor from "./honor";
import warrior from "./warrior";
import inline from "./inline";
import groups from "./groups";
import feedback from "./feedback";
import trigger from "./trigger";
import code from "./code";
import text from "./text";

export function setupCommands(bot: any): void {
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
}

