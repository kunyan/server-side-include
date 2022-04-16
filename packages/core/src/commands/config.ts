import { Context } from '../context';
import { ssiTagParser } from '../utils/tagParser';

const regex = /<!--#config\s(.*)-->/gi;
export const config = (context: Context, html: string): void => {
  const setTags = html.match(regex);
  if (setTags) {
    setTags.map((setTag) => {
      const tag = ssiTagParser(setTag);
      const name = tag.attributes['var'];
      let value = tag.attributes['value'];
      Object.keys(context.variable).forEach((key) => {
        value = value.replace(key, context.variable[key]);
      });
      context.variable[name] = value;
    });
  }
};

export default config;
