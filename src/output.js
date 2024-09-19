import path from "node:path";
import fs from "node:fs";
import brotli from "brotli";

import { PROJECT_ROOT_PATH } from "./path.js";
import { getBrowserName } from "./browser.js";

export function saveEvents(scenario, events, { compress = false } = {}) {
  const outputFolderPath = path.join(PROJECT_ROOT_PATH, "output");
  let outputFilePath = path.join(outputFolderPath, `events_${scenario}_${getBrowserName()}.log`);
  let output = events.map(event => JSON.stringify(event)).join("\n");

  fs.mkdirSync(outputFolderPath, { recursive: true });

  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }

  if (compress) {
    outputFilePath += ".br";
    output = brotli.compress(Buffer.from(output, "utf8"), true)
  }

  fs.writeFileSync(outputFilePath, output);
}
