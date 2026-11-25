/*
 * Page analytics with GoatCounter: anonymous page counts, no cookies, no personal data.
 *
 * Setup: create a free site at goatcounter.com and put its code in SITE_CODE.
 * Tracking stays off while SITE_CODE is the placeholder.
 *
 * Your own visits: run  localStorage.setItem('goatcounter_ignore', '1')  in the browser console on the site.
 * To count yourself again: localStorage.removeItem('goatcounter_ignore').
 * You can also add your home IP in GoatCounter under Settings, then Tracking, then Ignore IPs.
 */
(function () {
  var SITE_CODE = 'SITE_CODE';
  if (SITE_CODE === 'SITE_CODE') return;

  if (isOptedOut()) return;

  window.goatcounter = { no_onload: true };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.setAttribute('data-goatcounter', 'https://' + SITE_CODE + '.goatcounter.com/count');
  script.onload = countView;
  document.head.appendChild(script);

  // Both builds switch views with the hash (#summary), so count each change.
  window.addEventListener('hashchange', countView);

  function countView() {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: location.hash || location.pathname });
    }
  }

  function isOptedOut() {
    try {
      return localStorage.getItem('goatcounter_ignore') === '1';
    } catch (e) {
      return false;
    }
  }
})();
