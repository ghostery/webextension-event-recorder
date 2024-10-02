import fs from "node:fs";
import path from "node:path";

import { PROJECT_ROOT_PATH } from "./path.js";

const scenariorsPath = path.join(PROJECT_ROOT_PATH, 'scenariors');

export function getScenariors() {
  return fs.readdirSync(scenariorsPath, { withFileTypes: true })
    .filter(file => !file.isDirectory())
    .map(file => path.basename(file.name, path.extname(file.name)))
}

export async function runScenario(browser, name) {
  const start = Date.now();
  let end;
  await browser.newWindow('about:blank', {
    windowName: name,
  });

  const handles = await browser.getWindowHandles();
  await browser.switchToWindow(handles.at(-1));

  const module = await import(path.join(scenariorsPath, `${name}.js`));
  await module.default(browser);

  end = Date.now();

  await browser.closeWindow();

  return { start, end };
}
