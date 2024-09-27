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

  try {
    const module = await import(path.join(scenariorsPath, `${name}.js`));
    await module.default(browser);
  } finally {
    end = Date.now();

    // recorder is always the first page
    const [_, ...pages] = await browser.pages();
    for (const page of pages) {
      await page.close();
    }
  }

  return { start, end };
}
