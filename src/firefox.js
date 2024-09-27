import puppeteer from "puppeteer";
import getPort from "get-port";
import { connect } from "../node_modules/web-ext/lib/firefox/remote.js";

import { getExtensionPath, extensionId, getManifest } from "./extension.js";

export async function getFirefox() {
  const rdpPort = await getPort();
  const extensionPath = getExtensionPath();
  const browser = await puppeteer.launch({
    browser: 'firefox',
    headless: true,
    protocol: "webDriverBiDi",
    args: [`--start-debugger-server=${rdpPort}`],
    extraPrefsFirefox: {
      "devtools.chrome.enabled": true,
      "devtools.debugger.prompt-connection": false,
      "devtools.debugger.remote-enabled": true,
      "extensions.webextensions.uuids": JSON.stringify({
        [getManifest().browser_specific_settings.gecko.id]: extensionId,
      }),
    }
  });
  const rdp = await connect(rdpPort);
  await rdp.installTemporaryAddon(extensionPath);
  return browser;
}
