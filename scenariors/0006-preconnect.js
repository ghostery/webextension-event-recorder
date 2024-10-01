import http from 'node:http';

// preconnects
export default async function (browser) {
  let server;
  try {
    server = http.createServer(function (_, res) {
      res.write(`
        <html>
        <link rel="preconnect" href="http://preconnect.localhost:8080/preconnect" />
        <h1>0006-preconnect</h1>
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
