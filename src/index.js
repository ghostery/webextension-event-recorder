import { createWindowAt, evaluate, navigateContext } from "./bidi.js";
import { getChrome } from "./chrome.js";
import { getFirefox } from "./firefox.js";
import { getExtensionUrl } from "./extension.js";
import { saveEvents } from "./output.js";
import { getScenarios, runScenario } from "./scenarios.js";
import { ONLY, BROWSER, COMPRESS } from "./env.js";

const browser = await (BROWSER === "firefox" ? getFirefox() : getChrome());

let crashed = false;

try {
  const recorderUrl = getExtensionUrl('tab.html');
  const recorder = await createWindowAt(browser, recorderUrl);

  let lastScenario;

  for (const scenario of getScenarios()) {
    if (ONLY && !scenario.startsWith(ONLY)) {
      continue;
    }

    lastScenario = scenario;

    await new Promise(r => setTimeout(r, 1000));

    console.warn(`scenario ${scenario}: Start`);
    let recordingStart;
    let recordingEnd;

    try {
      const output = await runScenario(browser, scenario);
      recordingStart = output.start;
      recordingEnd = output.end;
      console.warn(`scenario ${scenario}: End`);

      let events = await evaluate(browser, recorder, "window.events");
      events = events.filter(event => event.startedAt > recordingStart && event.startedAt < recordingEnd);
      console.warn(`scenario ${scenario}: recorder ${events.length} events`);

      saveEvents(scenario, events, {
        compress: COMPRESS,
      });

      await navigateContext(browser, recorder, recorderUrl);
    } catch(e) {
      console.warn(`scenario ${lastScenario}: Error`);
      console.error(e);
      crashed = true;
      throw e;
    }
  }
} finally {
  await browser.deleteSession();
  if (crashed) {
    process.exit(1);
  }
}
