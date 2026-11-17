/* ==========================================================================
   UR Print — cookie consent manager
   --------------------------------------------------------------------------
   Design rules this implements, so they are not accidentally undone later:

   1. Nothing non-essential runs before opt-in. Scripts are declared inert
      (`type="text/plain"`) and are only activated once their category is
      consented to. There is no "implied consent on scroll" anywhere.
   2. "Accept all" and "Reject all" are the same size, in the same row, with
      the same visual weight. Rejecting is exactly as easy as accepting.
   3. The choice is stored and re-openable at any time from the footer.
   4. Consent lapses after 12 months, in line with ICO guidance.
   5. If the browser sends Global Privacy Control, non-essential categories
      default to off and that is shown in the preferences dialog.

   The banner only appears when there is actually something to consent to.
   Today the site loads no analytics and sets no cookies, so it stays hidden.
   Flip IN_USE below (or add a gated script) when that changes.
   ========================================================================== */
(function (global) {
  'use strict';

  var STORE_KEY = 'urprint.consent.v1';
  var POLICY_VERSION = 1;          // bump to re-ask everyone
  var MAX_AGE_DAYS = 365;          // ICO: refresh consent at least yearly

  /* Which non-essential categories this site actually uses.
     Set to true when you add a script in that category. */
  var IN_USE = {
    analytics: false,
    marketing: false
  };

  var CATEGORIES = [
    {
      id: 'necessary', required: true,
      name: 'Strictly necessary',
      desc: 'Keeps your basket, your collection-or-delivery choice and your ' +
            'cookie preferences on this device. The site cannot work without ' +
            'these and they are never used for tracking.'
    },
    {
      id: 'analytics', required: false,
      name: 'Performance and analytics',
      desc: 'Anonymous statistics about which pages are visited, so we can see ' +
            'what needs improving. Switched off unless you turn it on.'
    },
    {
      id: 'marketing', required: false,
      name: 'Marketing',
      desc: 'Used to measure advertising and show you relevant offers on other ' +
            'sites. Switched off unless you turn it on.'
    }
  ];

  /* ------------------------------------------------------------- state --- */
  function gpc() {
    return global.navigator && (global.navigator.globalPrivacyControl === true);
  }

  function read() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!raw || raw.v !== POLICY_VERSION) return null;
      var ageDays = (Date.now() - (raw.t || 0)) / 86400000;
      if (ageDays > MAX_AGE_DAYS) return null;
      return raw;
    } catch (e) { return null; }
  }

  function write(prefs) {
    var rec = { v: POLICY_VERSION, t: Date.now() };
    CATEGORIES.forEach(function (c) {
      rec[c.id] = c.required ? true : !!prefs[c.id];
    });
    try { localStorage.setItem(STORE_KEY, JSON.stringify(rec)); } catch (e) { }
    apply(rec);
    document.dispatchEvent(new CustomEvent('consent:change', { detail: rec }));
    return rec;
  }

  function has(category) {
    if (category === 'necessary') return true;
    var rec = read();
    return !!(rec && rec[category]);
  }

  /* -------------------------------------------------------- activation --- */
  /* A gated script is written as:
       <script type="text/plain" data-consent-category="analytics"
               data-src="https://example.com/a.js"></script>
     or with the code inline in the same tag. Nothing executes until the
     matching category is granted. */
  function apply(rec) {
    var pending = document.querySelectorAll('script[type="text/plain"][data-consent-category]');
    Array.prototype.forEach.call(pending, function (node) {
      var cat = node.getAttribute('data-consent-category');
      if (!rec[cat]) return;
      var s = document.createElement('script');
      Array.prototype.forEach.call(node.attributes, function (a) {
        if (a.name === 'type' || a.name === 'data-src' || a.name === 'data-consent-category') return;
        s.setAttribute(a.name, a.value);
      });
      if (node.getAttribute('data-src')) s.src = node.getAttribute('data-src');
      else s.textContent = node.textContent;
      node.parentNode.replaceChild(s, node);
    });
  }

  /* Any gated script on the page means that category is genuinely in use. */
  function detectInUse() {
    var found = {};
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-consent-category]'),
      function (n) { found[n.getAttribute('data-consent-category')] = true; }
    );
    Object.keys(found).forEach(function (k) { IN_USE[k] = true; });
    return CATEGORIES.some(function (c) { return !c.required && IN_USE[c.id]; });
  }

  /* ------------------------------------------------------------ markup --- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function bannerHtml() {
    return '' +
      '<div class="consent" data-consent-banner role="dialog" aria-modal="false" ' +
           'aria-labelledby="consent-title" aria-describedby="consent-body">' +
        '<div class="consent__inner">' +
          '<div class="consent__copy">' +
            '<h2 class="consent__title" id="consent-title">Cookies on this site</h2>' +
            '<p id="consent-body">We use strictly necessary storage to keep your basket working. ' +
            'We would also like to set optional cookies to understand how the site is used. ' +
            'We will not set anything optional unless you agree. ' +
            '<a href="cookie-policy.html">Read our cookie policy</a>.</p>' +
          '</div>' +
          '<div class="consent__actions">' +
            '<button type="button" class="btn consent__btn" data-consent-reject>Reject all</button>' +
            '<button type="button" class="btn consent__btn" data-consent-accept>Accept all</button>' +
            '<button type="button" class="consent__link" data-consent-manage>Manage preferences</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function prefsHtml() {
    var rec = read() || {};
    var rows = CATEGORIES.map(function (c) {
      var on = c.required ? true : !!rec[c.id];
      var disabledNote = c.required
        ? '<span class="consent__always">Always on</span>'
        : '<label class="consent__switch">' +
            '<input type="checkbox" data-consent-toggle="' + c.id + '"' + (on ? ' checked' : '') +
            ' aria-describedby="cdesc-' + c.id + '">' +
            '<span class="consent__slider" aria-hidden="true"></span>' +
            '<span class="sr-only">' + esc(c.name) + '</span>' +
          '</label>';
      var unused = (!c.required && !IN_USE[c.id])
        ? '<p class="consent__unused">Not currently used anywhere on this site.</p>' : '';
      return '<div class="consent__cat">' +
        '<div class="consent__cat-head"><h3>' + esc(c.name) + '</h3>' + disabledNote + '</div>' +
        '<p id="cdesc-' + c.id + '">' + esc(c.desc) + '</p>' + unused +
        '</div>';
    }).join('');

    return '' +
      '<div class="modal consent-modal" data-consent-prefs role="dialog" aria-modal="true" aria-labelledby="cprefs-title">' +
        '<div class="overlay is-open" data-consent-close></div>' +
        '<div class="modal__box">' +
          '<div class="modal__head"><div>' +
            '<h2 id="cprefs-title">Cookie preferences</h2>' +
            '<p>Choose what you are happy for us to store. You can change this at any ' +
            'time from the link in the footer.</p>' +
          '</div>' +
          '<button class="iconclose" type="button" data-consent-close aria-label="Close">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
          '<div class="modal__body">' +
            (gpc() ? '<div class="callout"><p>Your browser is sending a Global Privacy Control signal, ' +
                     'so optional categories start switched off.</p></div>' : '') +
            rows +
            '<div class="consent__prefs-actions">' +
              '<button type="button" class="btn consent__btn" data-consent-reject>Reject all</button>' +
              '<button type="button" class="btn consent__btn" data-consent-accept>Accept all</button>' +
              '<button type="button" class="btn btn--quiet" data-consent-save>Save my choices</button>' +
            '</div>' +
            '<p class="formnote">Full detail is in our <a href="cookie-policy.html">cookie policy</a> ' +
            'and <a href="privacy-policy.html">privacy policy</a>.</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* --------------------------------------------------------- behaviour --- */
  var lastFocus = null;

  function showBanner() {
    if (document.querySelector('[data-consent-banner]')) return;
    document.body.insertAdjacentHTML('beforeend', bannerHtml());
    requestAnimationFrame(function () {
      var el = document.querySelector('[data-consent-banner]');
      if (el) el.classList.add('is-on');
    });
  }
  function hideBanner() {
    var el = document.querySelector('[data-consent-banner]');
    if (el) { el.classList.remove('is-on'); setTimeout(function () { el.remove(); }, 220); }
  }

  function openPrefs() {
    closePrefs();
    lastFocus = document.activeElement;
    document.body.insertAdjacentHTML('beforeend', prefsHtml());
    var m = document.querySelector('[data-consent-prefs]');
    m.classList.add('is-open');
    document.body.classList.add('is-locked');
    var first = m.querySelector('input,button');
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closePrefs() {
    var m = document.querySelector('[data-consent-prefs]');
    if (!m) return;
    m.remove();
    if (!document.querySelector('.drawer.is-open, .modal.is-open')) {
      document.body.classList.remove('is-locked');
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function acceptAll() {
    var p = {}; CATEGORIES.forEach(function (c) { p[c.id] = true; });
    write(p); hideBanner(); closePrefs();
  }
  function rejectAll() {
    var p = {}; CATEGORIES.forEach(function (c) { p[c.id] = c.required; });
    write(p); hideBanner(); closePrefs();
  }
  function saveChoices() {
    var p = {};
    CATEGORIES.forEach(function (c) {
      if (c.required) { p[c.id] = true; return; }
      var box = document.querySelector('[data-consent-toggle="' + c.id + '"]');
      p[c.id] = !!(box && box.checked);
    });
    write(p); hideBanner(); closePrefs();
  }

  function init() {
    var somethingToConsentTo = detectInUse();
    var rec = read();

    if (rec) apply(rec);                        // honour a stored decision
    else if (somethingToConsentTo) showBanner(); // otherwise ask, if there is anything to ask about

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-consent-accept]')) { e.preventDefault(); acceptAll(); }
      else if (e.target.closest('[data-consent-reject]')) { e.preventDefault(); rejectAll(); }
      else if (e.target.closest('[data-consent-manage]')) { e.preventDefault(); openPrefs(); }
      else if (e.target.closest('[data-consent-save]')) { e.preventDefault(); saveChoices(); }
      else if (e.target.closest('[data-consent-close]')) { e.preventDefault(); closePrefs(); }
      else if (e.target.closest('[data-consent-open]')) { e.preventDefault(); openPrefs(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.querySelector('[data-consent-prefs]')) closePrefs();
    });
  }

  global.URConsent = {
    has: has,
    get: read,
    open: openPrefs,
    acceptAll: acceptAll,
    rejectAll: rejectAll,
    categories: CATEGORIES,
    /* testing helper: clear the stored decision and start over */
    reset: function () {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { }
      hideBanner(); closePrefs(); showBanner();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
