import http from 'node:http';

// preload unused resource from subdomain
export default async function (browser) {
  let server;
  try {
    server = http.createServer(function (_, res) {
      res.write(`
        <html>
        <link rel="preload" as="script" href="http://preload.localhost:8080/preload.js" />
        <h1>0005-preload</h1>
        </html>
      `);
      res.end();
    }).listen(8080, ()=> {});
    await browser.navigateTo("http://localhost:8080");
    // TODO: required for Firefox - find something to wait for that will be faster
    await new Promise(r => setTimeout(r, 1000));
  } finally {
    server.closeAllConnections();
    await new Promise(r => server.close(r));
  }
}
