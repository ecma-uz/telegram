import { Composer, Context } from "grammy";
import { PacmanSearch, TealdeerSearch } from "../services";

const composer = new Composer();

composer.inlineQuery(/(.*)/ig, async (ctx: Context) => {
  let search: string | undefined;
  let instance: PacmanSearch | TealdeerSearch = new PacmanSearch();

  if (!ctx.inlineQuery?.query) {
    return await ctx.answerInlineQuery(await instance.getEmptyQuery());
  }

  const split = ctx.inlineQuery?.query.split(" ");

  switch (split![0]) {
    case "tldr":
      instance = new TealdeerSearch();
      search = split?.slice(1).join(" ");
      break;
    default:
      instance = new PacmanSearch();
      search = split?.join(" ");
      break;
  }

  await instance.search(search);

  if (instance.getLength() === 0) {
    return await ctx.answerInlineQuery(await instance.getNotFound(search));
  }

  return await ctx.answerInlineQuery(
    await instance.getResults(),
  );
});

export default composer;
