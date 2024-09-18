import { evaluate } from "./bidi.js";
import { getBrowser } from "./browser.js";
import { getExtensionUrl } from "./extension.js";
import { saveEvents } from "./output.js";
import { getScenariors, runScenario } from "./scenariors.js";

const browser = await getBrowser();

try {
  const recorder = await browser.newWindow(getExtensionUrl('tab.html'));

  for (const scenario of getScenariors()) {
    console.warn(`scenario ${scenario}: Start`);
    try {
      await runScenario(browser, scenario);
      console.warn(`scenario ${scenario}: End`);
    } catch(e) {
      console.error(e);
    } finally {
      const events = await evaluate(browser, recorder, "window.events");
      console.warn(`scenario ${scenario}: recorder ${events.length} events`);
      saveEvents(scenario, events);
      await browser.switchToWindow(recorder)
      // refresh to clean the events list
      await browser.navigateTo(getExtensionUrl('tab.html'));
    }
  }
} finally {
  await browser.deleteSession();
}

