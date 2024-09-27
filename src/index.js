import { getBrowser } from "./browser.js";
import { getExtensionUrl } from "./extension.js";
import { saveEvents } from "./output.js";
import { getScenariors, runScenario } from "./scenariors.js";

const browser = await getBrowser();

try {
  const [recorder] = await browser.pages();

  // TODO: should await, but in hangs on Firefox
  recorder.goto(getExtensionUrl('tab.html'));

  for (const scenario of getScenariors()) {
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
    } catch(e) {
      console.error(e);
    } finally {
      let events = await recorder.evaluate('window.events')
      events = events.filter(event => event.startedAt > recordingStart && event.startedAt < recordingEnd);
      console.warn(`scenario ${scenario}: recorder ${events.length} events`);

      saveEvents(scenario, events, {
        compress: process.argv.includes('--compress'),
      });

      // TODO: should use reload, but it hangs on Firefox
      // await recorder.reload();
      recorder.goto(getExtensionUrl('tab.html'));
      await new Promise(r => setTimeout(r, 200));
    }
  }
} finally {
  // Firefox will log error: `TargetCloseError: Frame detached.` - it can be ignored
  await browser.close();
}

