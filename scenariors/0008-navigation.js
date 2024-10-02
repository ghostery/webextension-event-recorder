import http from 'node:http';

// navigate between two page which have different third parties
export default async function (browser, scenarioName) {
  let server1;
  let server2;
  try {
    server1 = http.createServer(function (_, res) {
      res.write(`
        <html>
        <head>
        <title>${scenarioName} - page 1</title>
        </head>
        <body>
        <h1>${scenarioName} - page 1</h1>
        <script src="http://script1.localhost:8080/script1.js"></script>
        </body>
        </html>
      `);
      res.end();
    }).listen(8080, ()=> {});
    server2 = http.createServer(function (_, res) {
      res.write(`
        <html>
        <head>
        <title>${scenarioName} - page 2</title>
        </head>
        <body>
        <h1>${scenarioName} - page 2</h1>
        <script src="http://script2.localhost:8081/script2.js"></script>
        </body>
        </html>
      `);
      res.end();
    }).listen(8081, ()=> {});
    await browser.navigateTo("http://page1.localhost:8080");
    await browser.navigateTo("http://page2.localhost:8081");
    // TODO: required for Firefox - find something to wait for that will be faster
    await new Promise(r => setTimeout(r, 1000));
  } finally {
    server1.closeAllConnections();
    server2.closeAllConnections();
    await new Promise(r => server1.close(r));
    await new Promise(r => server2.close(r));
  }
}

