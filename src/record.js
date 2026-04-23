import { evaluate } from "./bidi.js";
import { getChrome } from "./chrome.js";
import { getFirefox } from "./firefox.js";
import { getExtensionUrl } from "./extension.js";
import { saveEvents } from "./output.js";
import { BROWSER, COMPRESS, SCENARIO } from "./env.js";

if (!SCENARIO) {
  throw new Error('--scenario <NAME> has to be specified when --record is in use');
}

const browser = await (BROWSER === "firefox" ? getFirefox({ headless: false }) : getChrome({ headless: false }));

let recordingStart;

try {
  const recorderWindow = await browser.newWindow(getExtensionUrl('tab.html'));
  const recorder = recorderWindow.handle ?? recorderWindow;

  recordingStart = Date.now()

  const actorWindow = await browser.newWindow('about:blank');
  const actor = actorWindow.handle ?? actorWindow;

  // await actor window being closed which indicates the end of recording
  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      const currentWindowHandles = await browser.getWindowHandles();
      if (!currentWindowHandles.includes(actor)) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });

  const recordingEnd = Date.now();
  await browser.switchToWindow(recorder)

  // Ensure that the recorder tab is focus
  await browser.waitUntil(async () => {
    return (await browser.getTitle()) === "WebExtension Event Recorder";
  });

  let events = await evaluate(browser, recorder, "window.events");
  events = events.filter(event => event.startedAt > recordingStart && event.startedAt < recordingEnd);

  saveEvents(SCENARIO, events, {
    compress: COMPRESS,
  });

} finally {
  await browser.deleteSession();
}
