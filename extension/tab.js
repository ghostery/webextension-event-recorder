const $events = document.getElementById('events');
window.events = [];

chrome.runtime.onMessage.addListener((event) => {
  if (event?.type === 'event') {
    window.events.push(event.event);
    const $event = document.createElement('p');
    $event.innerHTML = JSON.stringify(event.event);
    $events.prepend($event);
  }
})
