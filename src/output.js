import path from "node:path";
import fs from "node:fs";

import { PROJECT_ROOT_PATH } from "./path.js";
import { getBrowserName } from "./browser.js";

export function saveEvents(scenario, events) {
  const outputFolderPath = path.join(PROJECT_ROOT_PATH, 'output', scenario);
  fs.mkdirSync(outputFolderPath, { recursive: true });
  const outputFilePath = path.join(outputFolderPath, `${getBrowserName()}.json`);
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }
  fs.writeFileSync(outputFilePath, events.map(event => JSON.stringify(event)).join('\n'));
}
