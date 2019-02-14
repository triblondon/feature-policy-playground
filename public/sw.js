/* eslint-env serviceworker */
/* global addEventListener */

/**
 * Service worker for Feature policy sandbox
 *
 * This service worker provides the delay
 */

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

addEventListener('fetch', event => {

  // Pay attention only to requests with a `delay` query param
  const url = new URL(event.request.url);
  event.respondWith((async () => {
    if (url.searchParams.get('delay')) {
      await waitFor(Number.parseInt(url.searchParams.get('delay')));
    }
    return fetch(event.request);
  })());

});
