import { IContext } from "../models/context";
import { ssiTagParser } from "../utils/tagParser";

const regex = /<!--#set\s(.*)-->/gi;
export const render = (context: IContext, html: string): void => {
  const setTags = html.match(regex);
  if (setTags) {
    setTags.map((setTag) => {
      const tag = ssiTagParser(setTag);
      const name = tag.attributes["var"];
      let value = tag.attributes["value"];
      Object.keys(context.variable).forEach((key) => {
        value = value.replace(key, context.variable[key]);
      });
      context.variable[name] = value;
    });
  }
};
