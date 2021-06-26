# Server Side Include

[![Build Status](https://github.com/kunyan/server-side-include/workflows/Build/badge.svg)](https://github.com/kunyan/server-side-include/actions)
[![codecov](https://codecov.io/gh/kunyan/server-side-include/branch/main/graph/badge.svg?token=KFDF83NVCR)](https://codecov.io/gh/kunyan/server-side-include)
[![npm version](https://img.shields.io/npm/v/server-side-include)](https://www.npmjs.com/package/server-side-include)

The express middleware to help node server to render SSI tags

### Usage

```js
const express = require('express');
const serverSideInclude = 'server-side-include';

const app = express();
app.use(serverSideInclude());

app.use(express.static('public'));

app.listen(3000, () => {
  console.log(`server is running`);
});
```

### Work with `http-proxy-middleware`

```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const createHttpsProxyAgent = require('https-proxy-agent');
const serverSideInclude = 'server-side-include';

const proxyServer =
  process.env.http_proxy ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.HTTPS_PROXY ||
  '';

const app = express();

const reverseProxy = createProxyMiddleware({
  target: 'https://access.redhat.com',
  changeOrigin: true,
  agent: createHttpsProxyAgent(proxyServer),
});

app.use('/services', reverseProxy);
app.use('/webassets', reverseProxy);

app.use(serverSideInclude());
app.use(express.static('public'));

app.listen(3000, () => {
  console.log(`server is running`);
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
