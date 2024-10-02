import http from 'node:http';

// loads empty page
export default async function (browser, scenarioName) {
  let server;
  try {
    server = http.createServer(function (_, res) {
      res.write(`
        <html>
        <head>
        <title>${scenarioName}</title>
        </head>
        <body>
        <h1>${scenarioName}</h1>
        </body>
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
