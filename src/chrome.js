import { remote } from "webdriverio";
import { getExtensionPath } from "./extension.js";

export async function getChrome({ headless = true } = {}) {
  const browser = await remote({
    capabilities: {
      browserName: "chrome",
      webSocketUrl: true,
      "goog:chromeOptions": {
        args: [
          headless ? 'headless' : undefined,
          `--load-extension=${getExtensionPath()}`,
          "--disable-search-engine-choice-screen",
        ].filter(Boolean),
        prefs: {
          // enable "Extended preloading" for speculationrules
          "net.network_prediction_options": 3,
        },
      },
    },
  });
  return browser;
}
