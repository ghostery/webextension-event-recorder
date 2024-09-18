Object.entries({
  tabs: [
    'onZoomChange',
    'onReplaced',
    'onRemoved',
    'onAttached',
    'onDetached',
    'onHighlighted',
    'onActivated',
    'onMoved',
    'onUpdated',
    'onCreated',
  ],
  webNavigation: [
    'onHistoryStateUpdated',
    'onTabReplaced',
    'onReferenceFragmentUpdated',
    'onCreatedNavigationTarget',
    'onErrorOccurred',
    'onCompleted',
    'onDOMContentLoaded',
    'onCommitted',
    'onBeforeNavigate',
  ],
  webRequest: [
    'onErrorOccurred',
    'onCompleted',
    'onBeforeRedirect',
    'onResponseStarted',
    'onAuthRequired',
    'onHeadersReceived',
    'onSendHeaders',
    'onBeforeSendHeaders',
    'onBeforeRequest',
  ],
  windows: [
    'onBoundsChanged',
    'onCreated',
    'onFocusChanged',
    'onRemoved',
  ],
}).forEach(([api, events]) => {
  events.forEach((event) => {
    try {
      const handler = (...args) => {
        const step = {
          startedAt: Date.now(),
          api,
          event,
          args,
        };
        try {
          chrome.runtime.sendMessage({
            type: 'event',
            event: step,
          });
        } catch (e) {
          // ignore failing listenres
        }
      };
      if (api === 'webRequest') {
        try {
          chrome[api][event].addListener(
            handler,
            { urls: ['<all_urls>'] },
            ['responseHeaders'],
          );
        } catch (e) {
          chrome[api][event].addListener(handler, { urls: ['<all_urls>'] });
        }
      } else {
        chrome[api][event].addListener(handler);
      }
    } catch (e) {
      console.warn(`Failed to register API: chrome.${api}.${event}`);
    }
  });
});
