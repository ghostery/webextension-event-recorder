import path from "node:path";
import fs from "node:fs";
import { PROJECT_ROOT_PATH } from "./path.js";
import { getBrowserName } from "./browser.js";

export function getExtensionPath() {
  return path.join(PROJECT_ROOT_PATH, "extension");
}

export const extensionId = 'hoiglcaaplgojoakdeoicoabmoboonik';

export function getManifest() {
  return JSON.parse(fs.readFileSync(path.join(getExtensionPath(), 'manifest.json')));
}

export function getExtensionUrl(path) {
  if (getBrowserName() === "firefox") {
    return `moz-extension://${extensionId}/${path}`;
  }
  return `chrome-extension://${extensionId}/${path}`;
}
