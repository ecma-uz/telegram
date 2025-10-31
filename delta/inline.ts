import { Composer, Context } from "../deps.ts";
import { Pacman } from "../types/Pacman.ts";
import { Tealdeer } from "../types/Tealdeer.ts";

const composer = new Composer();

composer.inlineQuery(/(.*)/gi, async (ctx: Context) => {
  let search: string | undefined;
  let instance: Pacman | Tealdeer = new Pacman();

  if (!ctx.inlineQuery?.query) {
    return await ctx.answerInlineQuery(instance.noQuery());
  }

  const split = ctx.inlineQuery?.query.split(" ");

  switch (split![0]) {
    case "tldr":
      instance = new Tealdeer();
      search = split?.slice(1).join(" ");
      break;
    default:
      instance = new Pacman();
      search = split?.join(" ");
      break;
  }

  await instance.search(search!);

  if (instance.getLength() === 0) {
    return await ctx.answerInlineQuery(instance.notFound(search!));
  }

  return await ctx.answerInlineQuery(instance.inline());
});

export default composer;
