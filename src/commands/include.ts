import { ssiTagParser } from "../utils/tagParser";
import { get } from "../utils/fetch";
import { IOptions } from "../models/option";
import { IContext } from "../models/context";

const regex = /<!--#include\s(.*)-->/gi;

export const render = async (
  context: IContext,
  html: string,
  options: IOptions
): Promise<string> => {
  let finalHTML = html;
  const includeTags = html.match(regex);
  if (includeTags) {
    try {
      const responses = await Promise.all(
        includeTags.map((includeTag) => {
          const tag = ssiTagParser(includeTag);
          let url = tag.attributes["virtual"];
          Object.keys(context.variable).forEach((key) => {
            url = url.replace(key, context.variable[key]);
          });

          return get(options.host + url, {
            rejectUnauthorized: options.rejectUnauthorized
          }).catch((err) => console.error(err));
        })
      );
      if (responses && Array.isArray(responses)) {
        includeTags.forEach((tag, index) => {
          const response = responses[index];
          if (response && response.length > 0) {
            finalHTML = finalHTML.replace(tag, response);
          }
        });

        return finalHTML;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return finalHTML;
};
