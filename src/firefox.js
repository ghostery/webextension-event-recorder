import { remote } from "webdriverio";
import getPort from "get-port";
import { connect } from "../node_modules/web-ext/lib/firefox/remote.js";

import { getExtensionPath, extensionId, getManifest } from "./extension.js";

export async function getFirefox() {
  const rppPort = await getPort();
  const browser = await remote({
    capabilities: {
      browserName: "firefox",
      "moz:firefoxOptions": {
        args: [
          `--start-debugger-server=${rppPort}`,
          '-headless',
        ],
        prefs: {
          "devtools.chrome.enabled": true,
          "devtools.debugger.prompt-connection": false,
          "devtools.debugger.remote-enabled": true,
          "extensions.webextensions.uuids": JSON.stringify({
            [getManifest().browser_specific_settings.gecko.id]: extensionId,
          }),
        },
      },
    },
  });
  const rdp = await connect(rppPort);
  await rdp.installTemporaryAddon(getExtensionPath());
  return browser;
}
