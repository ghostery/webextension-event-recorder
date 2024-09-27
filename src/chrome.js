import puppeteer from "puppeteer";
import { getExtensionPath } from "./extension.js";

export async function getChrome() {
  const extensionPath = getExtensionPath();
  const browser = puppeteer.launch({
    product: "chrome",
    headless: true,
    protocol: "webDriverBiDi",
    args: [
      `--load-extension=${extensionPath}`,
      `--disable-extensions-except=${extensionPath}`,
      "--disable-search-engine-choice-screen",
    ]
  });
  return browser;
}
