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
    let ended = false;
    const _end = res.end;
    const _write = res.write;
    const chunks: Buffer[] = [];
    const host = `${req.protocol}://${req.get('host')}`;
    let finalBuffer;

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

    res.end = (async (chunk: any, encoding: BufferEncoding) => {
      if (ended) {
        return;
      }

      const type = res.getHeader('Content-Type') || '';

      if (chunk) {
        addBuffer(chunk);
      }

      finalBuffer = Buffer.concat(chunks);
      if (/^text\/html/.test(type as string)) {
        let content = chunks.toString();
        const context = getContext();
        setCommand.render(context, content);
        content = echoCommand.render(context, content);

        if (!options.host) {
          options.host = host;
        }
        if (options.getHost) {
          options.host = options.getHost(req);
        }

        content = await includeCommand.render(context, content, options);
        finalBuffer = Buffer.from(content, encoding);
      }
      if (res.getHeader('Content-Length')) {
        res.setHeader('Content-Length', String(finalBuffer.length));
      }
      ended = true;
      res.end = _end;
      res.write = _write;
      res.write(finalBuffer);
      res.end();
    }) as any;
    next();
  };
};

export default serverSideInclude;

module.exports = serverSideInclude;
