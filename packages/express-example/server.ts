import { serverSideInclude } from '@server-side-include/express-middleware';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const reverseProxy = createProxyMiddleware({
  target: 'https://access.redhat.com',
  changeOrigin: true,
});

app.use('/services', reverseProxy);
app.use('/webassets', reverseProxy);

app.use(serverSideInclude());

app.use(express.static('public'));

app.listen(3000);
