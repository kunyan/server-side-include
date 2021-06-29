import { IContext } from '../models/context';
import { ssiTagParser } from '../utils/tagParser';

const regex = /<!--#echo\s(.*)-->/gi;
export const render = (context: IContext, html: string): string => {
  let finalHTML = html;
  const echoTags = html.match(regex);
  if (echoTags) {
    echoTags.map((echoTag) => {
      const tag = ssiTagParser(echoTag);
      const name = tag.attributes['var'];
      // const decoding = tag.attributes["decoding"];
      // const encoding = tag.attributes["encoding"];
      const value = context.variable[name];
      finalHTML = finalHTML.replace(echoTag, value);
    });
  }
  return finalHTML;
};
