import type { IncomingMessage } from 'http';
import * as http from 'http';
import type { RequestOptions } from 'https';
import * as https from 'https';

export const get = (url: string, options?: RequestOptions): Promise<string> => {
  const request = url.startsWith('https:') ? https.request : http.request;
  const opts: RequestOptions = {
    method: 'GET',
    ...options,
  };
  return new Promise((resolve, reject) => {
    const req = request(url, opts, (res: IncomingMessage) => {
      let rawData = '';

      res.on('data', (chunk) => (rawData += chunk));

      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(rawData);
          } else {
            reject(res.statusCode);
          }
        } catch (error) {
          reject(error);
        }
      });

      res.on('error', (error) => {
        reject(error);
      });
    });
    req.end();
  });
};
