import { Request, Response, NextFunction } from 'express';
import { IOptions } from './models/option';
import getContext from './context';
import * as setCommand from './commands/set';
import * as echoCommand from './commands/echo';
import * as includeCommand from './commands/include';

const ServerSideInclude = (
  options: IOptions = {
    rejectUnauthorized: true,
  }
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const ended = false;
    const _end = res.end;
    const _write = res.write;
    const buffers: Buffer[] = [];
    const host = `${req.protocol}://${req.get('host')}`;

    const addBuffer = (chunk: Buffer, encoding?: BufferEncoding): void => {
      if (chunk === undefined) return;
      if (typeof chunk === 'string') {
        chunk = Buffer.from(chunk, encoding);
      }
      buffers.push(chunk);
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
      buffers.push(chunk);

      let html = buffers.toString();
      const context = getContext();
      setCommand.render(context, html);
      html = echoCommand.render(context, html);

      if (!options.host) {
        options.host = host;
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

export default ServerSideInclude;
