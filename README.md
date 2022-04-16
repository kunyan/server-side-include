# Server Side Include

[![Build Status](https://github.com/kunyan/server-side-include/workflows/Build/badge.svg)](https://github.com/kunyan/server-side-include/actions)
[![NPM (scoped)](https://img.shields.io/npm/v/@server-side-include/core?label=npm%20%7C%20core)](https://www.npmjs.com/package/@server-side-include/core)
[![NPM (scoped)](https://img.shields.io/npm/v/@server-side-include/express-middleware?label=npm%20%7C%20express-middleware)](https://www.npmjs.com/package/@server-side-include/express-middleware)
[![NPM (scoped)](https://img.shields.io/npm/v/@server-side-include/vite-plugin?label=npm%20%7C%20vite-plugin)](https://www.npmjs.com/package/@server-side-include/vite-plugin)

## Concept

Implement [Server Side Includes](https://httpd.apache.org/docs/current/howto/ssi.htm) with Node.js

## Integration

### Express

```js
import { serverSideInclude } from '@server-side-include/express-middleware';
import express from 'express';

app.use(serverSideInclude());

app.use(express.static('public'));

app.listen(3000);
```

### Vite

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

```html
<!DOCTYPE html>
<html class="no-js nimbus pf-m-redhat-font">
  <head>
    <!--#include virtual="/_include_/init.html" -->
    <!--#include virtual="/services/chrome/head/$locale?legacy=false" -->
  </head>
  <body>
    <!--#include virtual="/services/chrome/header/$locale?legacy=false" -->
    <div class="container">
      <div id="chrometwo">
        <div id="root">Hello world</div>
        <!--#echo var="DATE_LOCAL" -->
      </div>
    </div>
    <!--#include virtual="/services/chrome/footer/$locale?legacy=false" -->
  </body>
</html>
```
