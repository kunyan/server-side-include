import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import createHttpsProxyAgent from 'https-proxy-agent';
import serverSideInclude from '../src/index';

const proxyServer =
  process.env.http_proxy ||
  process.env.https_proxy ||
  process.env.HTTP_PROXY ||
  process.env.HTTPS_PROXY ||
  '';

console.log(proxyServer);
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
