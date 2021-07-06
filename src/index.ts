import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IOptions } from './models/option';
import getContext from './context';
import * as setCommand from './commands/set';
import * as echoCommand from './commands/echo';
import * as includeCommand from './commands/include';

export const serverSideInclude = (
  options: IOptions = {
    rejectUnauthorized: true,
  }
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ended = false;
    const _end = res.end;
    const _write = res.write;
    const chunks: Uint8Array[] = [];
    const host = `${req.protocol}://${req.get('host')}`;

    const addBuffer = (chunk: Buffer, encoding?: BufferEncoding): void => {
      if (chunk === undefined) return;
      if (typeof chunk === 'string') {
        chunk = Buffer.from(chunk, encoding);
      }
      chunks.push(chunk);
    };

    res.write = (chunk: Buffer): boolean => {
      if (ended) {
        return false;
      }
      addBuffer(chunk);
      return true;
    };

    res.end = (async (chunk: Buffer): Promise<void> => {
      if (ended) {
        return;
      }

      const type = res.getHeader('Content-Type') || '';

      chunks.push(chunk);

      let html = chunks.toString();

      if (!(type as string).match(/^text\/html/)) {
        res.end = _end;
        res.write = _write;
        res.write(html);
        res.end();
        return;
      }

      const context = getContext();
      setCommand.render(context, html);
      html = echoCommand.render(context, html);

      if (!options.host) {
        options.host = host;
      }
      if (options.getHost) {
        options.host = options.getHost(req);
      }

      html = await includeCommand.render(context, html, options);
      const result = Buffer.from(html, 'utf-8');
      if (res.getHeader('Content-Length')) {
        res.setHeader('Content-Length', String(result.length));
      }
      res.end = _end;
      res.write = _write;
      res.write(result);
      res.end();
    }) as (chunk: unknown) => void;
    next();
  };
};

module.exports = serverSideInclude;
