# WebExension Event Recorder

WebExtension Event Recorder is a browser automation tool that plays scripted `scenariors` of browser interactions and records series of `events` that a web-extension would receive.

To start the recording, first install dependencies with `npm ci`.

Record events from Chrome with `npm run start.chrome`

Record events from Firefox with `npm run start.firefox`

## Setup

Be sure to install Firefox if you wish to run scenariors with it:

```
npx puppeteer browsers install firefox
```

## Debugging

WebDriver BiDi support for web-extensions is still not fully ready.

Sometimes it may be useful to debug the protocol messages to understand why we run into problems.

This can be done by setting `DEBUG` environment variable.

```
DEBUG="puppeteer:webDriverBiDi:*"  npm run start.firefox
```
