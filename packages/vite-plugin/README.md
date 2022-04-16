# @server-side-include/vite-plugin

## Usage

```js
import { SSIPlugin } from '@server-side-include/vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    SSIPlugin({
      host: 'https://access.redhat.com',
      rejectUnauthorized: true,
      templatePath: path.resolve(__dirname, 'index.html'),
    }),
  ],
});
```
