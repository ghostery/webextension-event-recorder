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
      },
    },
  });
  return browser;
}
