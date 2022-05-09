import { IContext } from '../models/context';
import { get } from '../utils/fetch';
import { ssiTagParser } from '../utils/tagParser';

export interface IncludeOption {
  host: string;
  rejectUnauthorized: boolean;
  debug?: boolean;
}

const regex = /<!--#include\s(.*)-->/gi;

export const includeRender = async (
  context: IContext,
  html: string,
  { host, rejectUnauthorized = false, debug = false }: IncludeOption
): Promise<string> => {
  let finalHTML = html;
  const includeTags = html.match(regex);
  if (includeTags) {
    try {
      const responses = await Promise.all(
        includeTags.map((includeTag) => {
          const tag = ssiTagParser(includeTag);
          let url = tag.attributes['virtual'];
          Object.keys(context.variable).forEach((key) => {
            url = url.replace(key, context.variable[key]);
          });

          const fullUrl = host + url;

          if (debug) {
            console.info('Request to', fullUrl);
          }
          return get(fullUrl, {
            rejectUnauthorized,
          }).catch((err) => console.error(err));
        })
      ).catch((error) => console.error(error));
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

export default includeRender;
