import { evaluate } from "./bidi.js";
import { getBrowser } from "./browser.js";
import { getExtensionUrl } from "./extension.js";
import { saveEvents } from "./output.js";
import { getScenariors, runScenario } from "./scenariors.js";

const browser = await getBrowser();

const only = process.argv.includes('--only') ? process.argv[process.argv.findIndex(o => o === '--only') + 1]  : false;

let crashed = false;

try {
  const recorder = await browser.newWindow(getExtensionUrl('tab.html'));

  for (const scenario of getScenariors()) {
    if (only && !scenario.startsWith(only)) {
      continue;
    }
    // wait some time between the tests for browser activity to settle
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
        compress: process.argv.includes('--compress'),
      });

      await browser.switchToWindow(recorder)
      // refresh to clean the events list
      await browser.navigateTo(getExtensionUrl('tab.html'));
    } catch(e) {
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

