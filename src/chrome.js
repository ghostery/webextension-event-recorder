import { remote } from "webdriverio";
import { getExtensionPath } from "./extension.js";

export async function getChrome() {
  const browser = await remote({
    capabilities: {
      browserName: "chrome",
      webSocketUrl: true,
      "goog:chromeOptions": {
        args: [
          "headless",
          `--load-extension=${getExtensionPath()}`,
          "--disable-search-engine-choice-screen",
        ],
        prefs: {
          // enable "Extended preloading" for speculationrules
          "net.network_prediction_options": 3,
        },
      },
    },
  });
  return browser;
}
