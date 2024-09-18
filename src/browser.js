import { getChrome } from "./chrome.js";
import { getFirefox } from "./firefox.js";

export function getBrowserName() {
  if (process.argv.includes("firefox")) {
    return "firefox"
  }
  return "chrome";
}

export function getBrowser() {
  return getBrowserName() === "firefox" ? getFirefox() : getChrome();
}

