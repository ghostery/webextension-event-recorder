import http from 'node:http';

// loads a page with 3rd
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
        <a href="http://localhost:8080/result" id="result" ping="http://ping.localhost:8080/ping">link</a>
        </body>
        </html>
      `);
      res.end();
    }).listen(8080, ()=> {});
    await browser.navigateTo("http://localhost:8080");
    const result = await browser.$("#result");
    await result.click();
    await browser.waitUntil(async function () {
      return await browser.execute(() => window.location.href === "http://localhost:8080/result");
    });
    // TODO: required for Firefox - find something to wait for that will be faster
    await new Promise(r => setTimeout(r, 1000));
  } finally {
    server.closeAllConnections();
    await new Promise(r => server.close(r));
  }
}
