# @server-side-include/vite-plugin

## Usage

Here is a example works with reverse proxy

```js
import { SSIPlugin } from '@server-side-include/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    SSIPlugin({
      variables: {
        $locale: 'en',
      },
      rejectUnauthorized: true,
    }),
  ],
  server: {
    proxy: {
      '/services/': {
        target: 'https://access.redhat.com',
        changeOrigin: true,
      },
    },
  },
});
```

## Options

| Option name        | Description                                    |          | Default                  |     |
| ------------------ | ---------------------------------------------- | -------- | ------------------------ | --- |
| variables          | Pre define some variables if needed            | Optional | null                     |     |
| host               | if you want to overwrite the included url host | Optional | vite server default host |     |
| rejectUnauthorized | Avoid self-signed cert issue                   | Optional | false                    |     |
