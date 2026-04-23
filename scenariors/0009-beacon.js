import http from 'node:http';

// click on a link fires beacons during navigation — both synchronous (click) and on pagehide —
// mirroring google.com's post-click telemetry pattern where pings complete after the
// landing page has already started loading
export default async function (browser, scenarioName) {
  let searchServer;
  let landingServer;
  let beaconServer;
  try {
    searchServer = http.createServer(function (_, res) {
      res.write(`<!doctype html>
        <html>
        <head><title>${scenarioName} - search</title></head>
        <body>
        <h1>${scenarioName} - search</h1>
        <a id="result" href="http://landing.localhost:8081/">result</a>
        <script>
          const beaconOrigin = 'http://beacon.localhost:8082';
          document.getElementById('result').addEventListener('click', () => {
            navigator.sendBeacon(beaconOrigin + '/click', 'click');
          });
          window.addEventListener('pagehide', () => {
            navigator.sendBeacon(beaconOrigin + '/pagehide', 'pagehide');
          });
        </script>
        </body>
        </html>`);
      res.end();
    }).listen(8080, () => {});

    landingServer = http.createServer(function (_, res) {
      setTimeout(() => {
        res.write(`<!doctype html>
          <html>
          <head><title>${scenarioName} - landing</title></head>
          <body><h1>${scenarioName} - landing</h1></body>
          </html>`);
        res.end();
      }, 500);
    }).listen(8081, () => {});

    beaconServer = http.createServer(function (_, res) {
      res.statusCode = 204;
      res.end();
    }).listen(8082, () => {});

    await browser.navigateTo("http://search.localhost:8080");
    const result = await browser.$("#result");
    await result.click();
    await browser.waitUntil(async function () {
      return await browser.execute(() => window.location.href.startsWith("http://landing.localhost:8081"));
    });
    await new Promise(r => setTimeout(r, 1000));
  } finally {
    for (const s of [searchServer, landingServer, beaconServer]) {
      s?.closeAllConnections();
      await new Promise(r => s ? s.close(r) : r());
    }
  }
}
