import {
  echoRender,
  getContext,
  IncludeOption,
  includeRender,
  setRender,
} from '@server-side-include/core';
import type { Plugin, ViteDevServer } from 'vite';

interface Options extends Partial<IncludeOption> {
  variables?: {
    [key: string]: string;
  };
}

export const SSIPlugin = ({
  variables,
  host,
  rejectUnauthorized,
}: Options): Plugin => {
  let server: ViteDevServer;
  return {
    name: '@server-side-include/vite-plugin',
    apply: 'serve',
    configureServer: (_server) => {
      server = _server;
    },
    transformIndexHtml: async (html: string) => {
      let draft = html;
      const context = getContext();

      if (variables) {
        context.variable = {
          ...context.variable,
          ...variables,
        };
      }

      setRender(context, draft);
      draft = echoRender(context, draft);

      let defaultHost = (server.config.server.https
        ? 'https://'
        : 'http://') +
          (server.config.server.host ? server.config.server.host : 'localhost');
      if (server.config.server.port) {
        defaultHost += ':' + server.config.server.port;
      } else {
        defaultHost += ':3000';
      }

      const opts: IncludeOption = {
        host: host || defaultHost,
        rejectUnauthorized: !!rejectUnauthorized,
      };

      return await includeRender(context, draft, opts);
    },
  };
};

export default SSIPlugin;
