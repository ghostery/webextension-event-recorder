# WebExension Event Recorder

WebExtension Event Recorder is a browser automation tool that records series of `events` that a web-extension would receive.

## Prepare

Install dependencies with `npm ci`.

## Re-play scenarios

You can re-play scripted `scenariors` of browser interactions:

* from Chrome: `npm run start.chrome`

* from Firefox  `npm run start.firefox`

### Options

`--only <SCENARIOR PREFIX>` allows to run scenariors that start with file names starting with given prefix

## Manual recordings

To record events from manually controlled session use:

* for Chrome: `npm run record.chrome -- --scenario <NAME>`

* for Firefox: `npm run record.firefox -- --scenario <NAME>`

Recording session will end once the browser window is closed.
