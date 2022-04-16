import {
  echoRender,
  getContext,
  IncludeOption,
  includeRender,
  setRender,
} from '@server-side-include/core';
import fs from 'fs';
import type { Plugin } from 'vite';

interface Options extends IncludeOption {
  templatePath: string;
}

export const SSIPlugin = (options: Options): Plugin => ({
  name: '@server-side-include/vite-plugin',
  configureServer(server) {
    return () => {
      server.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl || req.url || '';

        try {
          // 1. Read index.html
          let template = fs.readFileSync(options.templatePath, 'utf-8');

          // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
          //    also applies HTML transforms from Vite plugins, e.g. global preambles
          //    from @vitejs/plugin-react
          template = await server.transformIndexHtml(url, template);

          const context = getContext();
          setRender(context, template);
          template = echoRender(context, template);

          if (!options.host) {
            options.host = url;
          }

          template = await includeRender(context, template, options);

          const html = template;

          // 6. Send the rendered HTML back.
          res.end(html);
        } catch (e) {
          next(e);
        }
      });
    };
  },
});

export default SSIPlugin;
