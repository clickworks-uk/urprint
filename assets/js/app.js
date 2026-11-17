/* ==========================================================================
   UR Print — shared application shell
   Renders the utility bar, header, mega-menu, footer, basket drawer, the
   quote modal and the toast, and owns the persisted basket.
   ========================================================================== */
(function (global) {
  'use strict';

  var D = global.URData, Art = global.URArt;
  var CO = D.COMPANY;
  var BASKET_KEY = 'urprint.basket.v2';
  var FULFIL_KEY = 'urprint.fulfilment.v2';
  var ORDER_KEY = 'urprint.lastorder.v2';

  /* ------------------------------------------------------------- icons --- */
  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.4v.6"/><path d="M12 17h.01"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/></svg>',
    basket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m8 12.5 2.6 2.6L16 9.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h11v9H2z"/><path d="M13 10h4.5l3 3.2V16H13z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h3.6l1.6 4.2-2.1 1.5a12 12 0 0 0 5.2 5.2l1.5-2.1 4.2 1.6V17a2 2 0 0 1-2.2 2A15.8 15.8 0 0 1 3 5.2 2 2 0 0 1 5 3z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5"/><path d="m7.5 9.5 4.5-4.5 4.5 4.5"/><path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/><path d="M13 3v6h6"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m14.5 6.5 3 3"/></svg>',
    factory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20V10l5 3V10l5 3V10l5 3V7h3v13z"/><path d="M3 20h18"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.1L12 17.1 6.4 20l1.2-6.1L3 9.6l6.3-.8z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.3 3 8 7 9 4-1 7-4.7 7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 5 13h6l-1 8 8-10h-6z"/></svg>',
    quote: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.4 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12z"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2z"/><path d="m4 7.2 8 4.3 8-4.3M12 11.5V21"/></svg>'
  };

  /* -------------------------------------------------------------- utils --- */
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function qs(s, r) { return (r || document).querySelector(s); }
  function qsa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function stars(r) { var full = Math.round(r); return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full); }
  function param(name) { return new URLSearchParams(location.search).get(name); }
  function uid() { return 'it_' + Math.random().toString(36).slice(2, 10); }

  /* ------------------------------------------------------------- basket --- */
  var Basket = {
    read: function () {
      try { var v = JSON.parse(localStorage.getItem(BASKET_KEY)); return Array.isArray(v) ? v : []; }
      catch (e) { return []; }
    },
    write: function (items) {
      try { localStorage.setItem(BASKET_KEY, JSON.stringify(items)); } catch (e) { }
      document.dispatchEvent(new CustomEvent('basket:change'));
    },
    add: function (item) {
      var items = Basket.read();
      item.id = uid();
      items.push(item);
      Basket.write(items);
      return item;
    },
    remove: function (id) { Basket.write(Basket.read().filter(function (i) { return i.id !== id; })); },
    clear: function () { Basket.write([]); },
    count: function () { return Basket.read().length; },
    subtotal: function () { return D.round2(Basket.read().reduce(function (a, i) { return a + i.total; }, 0)); },
    fulfilment: function (v) {
      if (v) { try { localStorage.setItem(FULFIL_KEY, v); } catch (e) { } document.dispatchEvent(new CustomEvent('basket:change')); return v; }
      try { return localStorage.getItem(FULFIL_KEY) || 'collection'; } catch (e) { return 'collection'; }
    },
    deliveryCost: function () {
      var m = Basket.fulfilment(), d = D.DELIVERY[m] || D.DELIVERY.collection;
      if (m === 'standard' && Basket.subtotal() >= D.FREE_DELIVERY_THRESHOLD) return 0;
      return d.price;
    },
    total: function () { return D.round2(Basket.subtotal() + Basket.deliveryCost()); }
  };

  /* ------------------------------------------------------------- chrome --- */
  function utilityBar() {
    return '' +
      '<div class="utility"><div class="wrap utility__inner">' +
      '<ul class="utility__perks">' +
      '<li>' + I.pin + ' Free local collection in Wolverhampton</li><li class="dot"></li>' +
      '<li>' + I.truck + ' Fast UK-wide delivery</li><li class="dot"></li>' +
      '<li>' + I.phone + ' Call us: <a href="' + CO.phoneHref + '"><strong>' + CO.phone + '</strong></a></li>' +
      '</ul>' +
      '<ul class="utility__links">' +
      '<li><a href="#" data-quote>' + I.quote + ' Request a custom quote</a></li>' +
      '<li><a href="artwork-guidelines.html">' + I.file + ' Artwork guidelines</a></li>' +
      '<li><a href="track-order.html">' + I.box + ' Track order</a></li>' +
      '</ul></div></div>';
  }

  function megaFor(cat) {
    var popular = D.productsIn(cat.slug).slice().sort(function (a, b) {
      return (b.badges.length - a.badges.length) || (b.reviews - a.reviews);
    }).slice(0, 4);

    var colTypes = '<div class="mega__col"><h4>Shop by type</h4><ul>' +
      cat.subs.map(function (s) {
        return '<li><a href="category.html?c=' + cat.slug + '&s=' + s.slug + '">' + esc(s.name) + '</a></li>';
      }).join('') +
      '<li><a href="category.html?c=' + cat.slug + '"><strong>View all ' + esc(cat.name.toLowerCase()) + ' &rarr;</strong></a></li>' +
      '</ul></div>';

    var colPopular = '<div class="mega__col"><h4>Popular right now</h4><ul>' +
      popular.map(function (pr) {
        return '<li><a href="product.html?p=' + pr.slug + '">' + esc(pr.name) +
          '<span class="mega__price">' + esc(D.fromLabel(pr)) + ' incl. VAT</span></a></li>';
      }).join('') + '</ul></div>';

    var colHelp = '<div class="mega__col"><h4>Artwork &amp; help</h4><ul>' +
      '<li><a href="artwork-guidelines.html">Artwork guidelines</a></li>' +
      '<li><a href="artwork-guidelines.html#templates">Free templates</a></li>' +
      '<li><a href="artwork-guidelines.html#design">Design service &mdash; £15</a></li>' +
      '<li><a href="#" data-quote>Request a custom quote</a></li>' +
      '<li><a href="' + CO.phoneHref + '">Call ' + CO.phone + '</a></li>' +
      '</ul></div>';

    var p = cat.promo;
    var promo = '<div class="mega__promo">' +
      '<span class="badge' + (/same-day|fast|free/i.test(p.badge) ? ' badge--amber' : '') + '">' + esc(p.badge) + '</span>' +
      '<h5>' + esc(p.title) + '</h5><p>' + esc(p.text) + '</p>' +
      '<a class="btn btn--sm" href="' + (p.href === '#quote' ? '#' : p.href) + '"' + (p.href === '#quote' ? ' data-quote' : '') + '>' +
      (p.href === '#quote' ? 'Request a quote' : 'Configure &amp; order') + '</a>' +
      '<div class="art">' + Art.get(p.art) + '</div></div>';

    return '<div class="mega"><div class="mega__inner">' + colTypes + colPopular + colHelp + promo + '</div></div>';
  }

  function header() {
    var nav = D.CATEGORIES.map(function (cat) {
      return '<li class="catnav__item" data-cat="' + cat.slug + '">' +
        '<a class="catnav__link" href="category.html?c=' + cat.slug + '" aria-haspopup="true" aria-expanded="false">' +
        esc(cat.name) + I.chev + '</a>' + megaFor(cat) + '</li>';
    }).join('');

    return '' +
      '<header class="header">' +
      '<div class="wrap header__main">' +
      '<button class="iconbtn burger" type="button" data-mnav-open aria-label="Open menu">' + I.menu + '</button>' +
      '<a class="brand" href="index.html" aria-label="UR Print home"><img src="assets/img/logo.png" alt="UR Print" width="900" height="328"></a>' +
      '<div class="search" role="search">' +
      '<span class="search__icon">' + I.search + '</span>' +
      '<label class="sr-only" for="site-search">Search products</label>' +
      '<input id="site-search" type="search" autocomplete="off" placeholder="Search business cards, shop signs, flyers, banners..." aria-expanded="false" aria-controls="search-results">' +
      '<button class="search__btn" type="button" data-search-go>Search</button>' +
      '<div class="search__results" id="search-results" role="listbox" hidden></div>' +
      '</div>' +
      '<div class="header__actions">' +
      '<a class="iconbtn" href="artwork-guidelines.html">' + I.help + '<span>Help</span></a>' +
      '<a class="iconbtn" href="#" data-account>' + I.user + '<span>Sign in</span></a>' +
      '<button class="iconbtn" type="button" data-basket-open aria-label="Open basket">' + I.basket +
      '<span>Basket</span><span class="iconbtn__count" data-basket-count data-empty="true">0</span></button>' +
      '</div></div>' +
      '<nav class="catnav" aria-label="Product categories"><div class="wrap"><ul class="catnav__list">' + nav +
      '<li class="catnav__spacer"></li>' +
      '<li><a class="catnav__cta" href="#" data-quote>' + I.quote + ' Custom quote</a></li>' +
      '</ul></div></nav>' +
      '</header>' +
      mobileNav();
  }

  function mobileNav() {
    var items = D.CATEGORIES.map(function (cat) {
      return '<details><summary>' + esc(cat.name) + '</summary>' +
        cat.subs.map(function (s) { return '<a href="category.html?c=' + cat.slug + '&s=' + s.slug + '">' + esc(s.name) + '</a>'; }).join('') +
        '<a href="category.html?c=' + cat.slug + '"><strong>View all →</strong></a></details>';
    }).join('');
    return '<div class="mnav" data-mnav hidden><div class="overlay is-open" data-mnav-close></div>' +
      '<div class="mnav__panel" role="dialog" aria-label="Menu">' +
      '<div class="mnav__head"><img src="assets/img/logo.png" alt="UR Print" width="900" height="328">' +
      '<button class="iconclose" type="button" data-mnav-close aria-label="Close menu">' + I.close + '</button></div>' +
      items +
      '<div class="mnav__foot">' +
      '<a class="btn btn--block" href="#" data-quote>Request a custom quote</a>' +
      '<a class="btn btn--ghost btn--block" href="' + CO.phoneHref + '">Call ' + CO.phone + '</a>' +
      '<a class="btn btn--quiet btn--block" href="artwork-guidelines.html">Artwork guidelines</a>' +
      '<a class="btn btn--quiet btn--block" href="track-order.html">Track my order</a>' +
      '</div></div></div>';
  }

  function footer() {
    var catLinks = D.CATEGORIES.map(function (c) { return '<li><a href="category.html?c=' + c.slug + '">' + esc(c.name) + '</a></li>'; }).join('');
    return '' +
      /* local trust bar */
      '<section class="localbar"><div class="wrap localbar__grid">' +
      '<div><h3>Visit our Wolverhampton print works</h3>' +
      '<address>' + esc(CO.name) + '<br>' + esc(CO.addressLine) + '<br>' + esc(CO.city) + '<br>' + esc(CO.postcode) + '<br>' +
      '<a href="' + CO.phoneHref + '">' + CO.phone + '</a> · <a href="mailto:' + CO.email + '">' + CO.email + '</a></address>' +
      '<a class="maplink" href="' + CO.mapsUrl + '" target="_blank" rel="noopener">' + miniMap() +
      '<span class="bar">' + I.pin + ' Open in Google Maps — free customer parking on site</span></a></div>' +
      '<div><h3>Opening hours</h3><ul class="hours">' +
      CO.hours.map(function (h) { return '<li><span>' + esc(h.d) + '</span><b class="' + (h.closed ? 'closed' : '') + '">' + esc(h.h) + '</b></li>'; }).join('') +
      '</ul><p class="formnote">Artwork received before 11am is usually on press the same day.</p></div>' +
      '<div><h3>Talk to a printer</h3><p style="font-size:.92rem;color:var(--ink-60)">Not sure which stock, size or material you need? Call the unit and speak to the person who will run the job.</p>' +
      '<a class="btn btn--block" href="' + CO.phoneHref + '">' + I.phone + ' ' + CO.phone + '</a>' +
      '<a class="btn btn--ghost btn--block" style="margin-top:10px" href="#" data-quote>Request a custom quote</a></div>' +
      '</div></section>' +
      /* footer proper */
      '<footer class="footer"><div class="wrap footer__grid">' +
      '<div class="footer__brand"><img src="assets/img/logo-white.png" alt="UR Print" width="900" height="328">' +
      '<p>Litho, digital and large-format printing, signage and workwear — produced in-house at Ward Street, Wolverhampton since 2009.</p>' +
      '<div class="footer__social">' +
      '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H7.5v3h2.7v8z"/></svg></a>' +
      '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/></svg></a>' +
      '<a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.5H4.2V20h2.7zM5.5 3.8a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2M20 13.6c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.9-2.9 1.6V8.5H10.6V20h2.7v-6.2c0-1.4.6-2.2 1.8-2.2s1.7.8 1.7 2.2V20H20z"/></svg></a>' +
      '</div></div>' +
      '<div><h4>Products</h4><ul>' + catLinks + '</ul></div>' +
      '<div><h4>Artwork &amp; help</h4><ul>' +
      '<li><a href="artwork-guidelines.html">Artwork guidelines</a></li>' +
      '<li><a href="artwork-guidelines.html#templates">Free templates</a></li>' +
      '<li><a href="artwork-guidelines.html#design">In-house design service</a></li>' +
      '<li><a href="track-order.html">Track my order</a></li>' +
      '<li><a href="#" data-quote>Request a quote</a></li></ul></div>' +
      '<div><h4>Services</h4><ul>' +
      '<li><a href="#" data-quote>Free site surveys</a></li>' +
      '<li><a href="#" data-quote>Sign installation</a></li>' +
      '<li><a href="category.html?c=stickers-labels&s=vehicle-graphics">Vehicle wrapping</a></li>' +
      '<li><a href="#" data-quote>Trade &amp; account printing</a></li>' +
      '<li><a href="#" data-quote>Leaflet distribution</a></li></ul></div>' +
      '<div><h4>Company</h4><ul>' +
      '<li><a href="' + CO.mapsUrl + '" target="_blank" rel="noopener">Find us</a></li>' +
      '<li><a href="mailto:' + CO.email + '">Contact us</a></li>' +
      '<li><a href="#">Delivery &amp; collection</a></li>' +
      '<li><a href="#">Returns &amp; reprints</a></li>' +
      '<li><a href="#">Privacy &amp; terms</a></li></ul></div>' +
      '</div>' +
      '<div class="wrap footer__bottom">' +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(CO.name) + ' · ' + esc(CO.addressLine) + ', ' + esc(CO.city) + ' ' + esc(CO.postcode) + ' · Prices shown include VAT at 20%</span>' +
      '<div class="payicons"><span>VISA</span><span>MASTERCARD</span><span>AMEX</span><span>PAYPAL</span><span>APPLE&nbsp;PAY</span><span>KLARNA</span></div>' +
      '</div></footer>';
  }

  function miniMap() {
    return '<svg viewBox="0 0 400 150" role="img" aria-label="Map showing Unit 1 Ward Street, Wolverhampton" preserveAspectRatio="none" style="height:120px;width:100%">' +
      '<rect width="400" height="150" fill="#EAEEF3"/>' +
      '<path d="M0 96h400M0 42h400M74 0v150M246 0v150" stroke="#fff" stroke-width="9"/>' +
      '<path d="M0 96h400M0 42h400M74 0v150M246 0v150" stroke="#DCE2EA" stroke-width="1"/>' +
      '<path d="M0 126h400" stroke="#fff" stroke-width="5"/>' +
      '<rect x="12" y="52" width="48" height="32" fill="#DDE3EB"/><rect x="90" y="52" width="60" height="32" fill="#DDE3EB"/>' +
      '<rect x="258" y="52" width="54" height="32" fill="#DDE3EB"/><rect x="326" y="104" width="54" height="30" fill="#DDE3EB"/>' +
      '<rect x="12" y="104" width="46" height="30" fill="#DDE3EB"/>' +
      '<rect x="170" y="52" width="62" height="32" fill="#CFE0F7" stroke="#0061D5" stroke-width="1.5"/>' +
      '<text x="86" y="36" font-family="Inter,sans-serif" font-size="10" fill="#8A93A2">Ward Street</text>' +
      '<text x="12" y="116" font-family="Inter,sans-serif" font-size="9" fill="#8A93A2">Bilston Rd</text>' +
      '<g transform="translate(201,56)"><path d="M0 24c0 0 11-10.2 11-17A11 11 0 1 0-11 7c0 6.8 11 17 11 17z" fill="#0061D5"/><circle cy="7" r="4" fill="#fff"/></g>' +
      '<text x="201" y="98" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#1A1F2B">UR Print · WV1 3LT</text>' +
      '</svg>';
  }

  /* ------------------------------------------------------ basket drawer --- */
  function drawerMarkup() {
    return '<div class="overlay" data-overlay></div>' +
      '<aside class="drawer" data-drawer role="dialog" aria-label="Your basket" aria-hidden="true">' +
      '<div class="drawer__head"><h2>Your basket <span data-drawer-count style="color:var(--ink-60);font-weight:600"></span></h2>' +
      '<button class="iconclose" type="button" data-basket-close aria-label="Close basket">' + I.close + '</button></div>' +
      '<div class="drawer__body" data-drawer-body></div>' +
      '<div class="drawer__foot" data-drawer-foot></div></aside>';
  }

  function lineItemHtml(i, compact) {
    var specs = Object.keys(i.spec || {}).map(function (k) { return '<b>' + esc(k) + ':</b> ' + esc(i.spec[k]); }).join(' · ');
    return '<div class="lineitem">' +
      '<div class="lineitem__thumb">' + Art.get(i.art) + '</div>' +
      '<div class="lineitem__body">' +
      '<p class="lineitem__title">' + esc(i.name) + '</p>' +
      '<p class="lineitem__spec"><b>Quantity:</b> ' + i.qty.toLocaleString('en-GB') + '</p>' +
      '<p class="lineitem__spec">' + specs + '</p>' +
      '<p class="lineitem__spec"><b>Artwork:</b> ' + esc(i.artworkLabel) + '</p>' +
      '<div class="lineitem__foot"><span class="lineitem__price">' + D.money(i.total) + '</span>' +
      (compact ? '' : '<button class="linkbtn" type="button" data-remove="' + i.id + '">Remove</button>') +
      '</div></div></div>';
  }

  function fulfilmentPicker() {
    var mode = Basket.fulfilment();
    var sub = Basket.subtotal();
    var freeStd = sub >= D.FREE_DELIVERY_THRESHOLD;
    return '<p class="flabel">How would you like it?</p><div class="fulfil">' +
      '<input type="radio" name="fulfil" id="f-collection" value="collection"' + (mode === 'collection' ? ' checked' : '') + '>' +
      '<label for="f-collection"><b>Local collection</b><span>Unit 1 Ward St, WV1 3LT</span><span class="cost">FREE</span></label>' +
      '<input type="radio" name="fulfil" id="f-standard" value="standard"' + (mode === 'standard' ? ' checked' : '') + '>' +
      '<label for="f-standard"><b>UK standard</b><span>2–3 working days</span><span class="cost">' + (freeStd ? 'FREE' : D.money(D.DELIVERY.standard.price)) + '</span></label>' +
      '<input type="radio" name="fulfil" id="f-express" value="express"' + (mode === 'express' ? ' checked' : '') + '>' +
      '<label for="f-express"><b>UK express</b><span>Next working day</span><span class="cost">' + D.money(D.DELIVERY.express.price) + '</span></label>' +
      '</div>';
  }

  function renderDrawer() {
    var body = qs('[data-drawer-body]'), foot = qs('[data-drawer-foot]');
    if (!body) return;
    var items = Basket.read();
    qsa('[data-basket-count]').forEach(function (n) { n.textContent = items.length; n.setAttribute('data-empty', items.length ? 'false' : 'true'); });
    var dc = qs('[data-drawer-count]'); if (dc) dc.textContent = items.length ? '(' + items.length + ')' : '';

    if (!items.length) {
      body.innerHTML = '<div class="emptybasket">' + I.basket +
        '<h3>Your basket is empty</h3><p>Configure a product and it will appear here, ready for collection or delivery.</p>' +
        '<a class="btn" href="index.html#categories">Browse products</a></div>';
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = items.map(function (i) { return lineItemHtml(i); }).join('');
    var sub = Basket.subtotal(), del = Basket.deliveryCost(), tot = Basket.total();
    var vat = D.round2(tot - tot / (1 + CO.vatRate));
    foot.innerHTML = fulfilmentPicker() +
      '<div class="totals">' +
      '<div class="row"><span>Subtotal</span><span>' + D.money(sub) + '</span></div>' +
      '<div class="row"><span>' + esc(D.DELIVERY[Basket.fulfilment()].label) + '</span><span>' + (del === 0 ? 'FREE' : D.money(del)) + '</span></div>' +
      '<div class="row row--total"><span>Total</span><span>' + D.money(tot) + '</span></div>' +
      '<div class="row muted"><span>Includes VAT at 20%</span><span>' + D.money(vat) + '</span></div>' +
      '</div>' +
      '<a class="btn btn--block btn--lg" style="margin-top:14px" href="checkout.html">Checkout securely</a>' +
      '<p class="trustline">' + I.shield + ' Artwork checked by a human before we print</p>';
  }

  function openDrawer() {
    renderDrawer();
    qs('[data-drawer]').classList.add('is-open');
    qs('[data-drawer]').setAttribute('aria-hidden', 'false');
    qs('[data-overlay]').classList.add('is-open');
    document.body.classList.add('is-locked');
  }
  function closeDrawer() {
    var d = qs('[data-drawer]'); if (!d) return;
    d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true');
    qs('[data-overlay]').classList.remove('is-open');
    if (!qs('.modal.is-open')) document.body.classList.remove('is-locked');
  }

  /* -------------------------------------------------------- quote modal --- */
  function quoteModal() {
    var catOpts = D.CATEGORIES.map(function (c) { return '<option value="' + esc(c.name) + '">' + esc(c.name) + '</option>'; }).join('');
    return '<div class="modal" data-modal="quote" role="dialog" aria-modal="true" aria-labelledby="quote-title">' +
      '<div class="overlay is-open" data-modal-close></div>' +
      '<div class="modal__box">' +
      '<div class="modal__head"><div><span class="badge badge--blue">Free · No obligation</span>' +
      '<h2 id="quote-title" style="margin-top:10px">Request a quote or site survey</h2>' +
      '<p>Tell us what you need and we will come back within one working day — or arrange a free survey anywhere in the West Midlands.</p></div>' +
      '<button class="iconclose" type="button" data-modal-close aria-label="Close">' + I.close + '</button></div>' +
      '<div class="modal__body"><form data-quote-form novalidate>' +
      '<div class="grid2">' +
      '<div class="field"><label for="q-name">Your name</label><input id="q-name" name="name" type="text" required></div>' +
      '<div class="field"><label for="q-company">Company</label><input id="q-company" name="company" type="text"></div>' +
      '<div class="field"><label for="q-email">Email</label><input id="q-email" name="email" type="email" required></div>' +
      '<div class="field"><label for="q-phone">Phone</label><input id="q-phone" name="phone" type="tel" required></div>' +
      '</div>' +
      '<div class="grid2">' +
      '<div class="field"><label for="q-type">What do you need?</label><select id="q-type" name="type">' +
      '<option>Shop front / fascia signage</option><option>Window graphics</option><option>Vehicle graphics</option>' +
      catOpts + '<option>Something else</option></select></div>' +
      '<div class="field"><label for="q-when">When do you need it?</label><select id="q-when" name="when">' +
      '<option>As soon as possible</option><option>Within 1–2 weeks</option><option>Within a month</option><option>Just pricing for now</option>' +
      '</select></div></div>' +
      '<div class="field"><label for="q-detail">Sizes, quantities and anything else useful</label>' +
      '<textarea id="q-detail" name="detail" placeholder="e.g. Shop fascia roughly 4.2m wide, existing sign to be removed, plus two window vinyls."></textarea></div>' +
      '<div class="field"><label class="checkline"><input type="checkbox" name="survey" value="yes"> I would like a free site survey at my premises</label></div>' +
      '<div data-quote-error></div>' +
      '<button class="btn btn--lg btn--block" type="submit">Send my request</button>' +
      '<p class="formnote">Or call <a href="' + CO.phoneHref + '">' + CO.phone + '</a> · ' +
      'This is a demonstration storefront — nothing is sent and no data leaves your browser.</p>' +
      '</form></div></div></div>';
  }

  function openModal(name) {
    var m = qs('[data-modal="' + name + '"]'); if (!m) return;
    m.classList.add('is-open'); document.body.classList.add('is-locked');
    var f = m.querySelector('input,select,textarea'); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeModal(m) {
    (m ? [m] : qsa('.modal.is-open')).forEach(function (x) { x.classList.remove('is-open'); });
    if (!qs('.drawer.is-open')) document.body.classList.remove('is-locked');
  }

  /* -------------------------------------------------------------- toast --- */
  function toast(msg) {
    var t = qs('[data-toast]');
    if (!t) { t = el('<div class="toast" data-toast role="status"></div>'); document.body.appendChild(t); }
    t.innerHTML = I.checkCircle + '<span>' + esc(msg) + '</span>';
    t.classList.add('is-on');
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }

  /* ------------------------------------------------------------- search --- */
  function wireSearch() {
    var input = qs('#site-search'), box = qs('#search-results');
    if (!input) return;
    function render(q) {
      var res = D.search(q);
      if (!q || q.trim().length < 2) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      if (!res.length) {
        box.innerHTML = '<div class="search__empty">No matches for “' + esc(q) + '”. Try “banners”, “labels” or <a href="#" data-quote>ask us for a quote</a>.</div>';
      } else {
        box.innerHTML = res.map(function (r) {
          return '<a href="product.html?p=' + r.p.slug + '" role="option">' +
            '<span class="thumb">' + Art.get(r.p.art) + '</span>' +
            '<span><span class="t">' + esc(r.p.name) + '</span><br><span class="s">' + esc(r.cat.name) + ' · ' + D.fromLabel(r.p) + '</span></span></a>';
        }).join('');
      }
      box.hidden = false; input.setAttribute('aria-expanded', 'true');
    }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value.trim().length > 1) render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { box.hidden = true; input.blur(); }
      if (e.key === 'Enter') { var first = box.querySelector('a'); if (first && !box.hidden) location.href = first.getAttribute('href'); }
      if (e.key === 'ArrowDown') { var a = box.querySelector('a'); if (a) { e.preventDefault(); a.focus(); } }
    });
    var go = qs('[data-search-go]');
    if (go) go.addEventListener('click', function () { var f = box.querySelector('a'); if (f) location.href = f.getAttribute('href'); else input.focus(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.hidden = true; });
  }

  /* --------------------------------------------------------- mega menus --- */
  function wireMega() {
    var items = qsa('.catnav__item'), timer = null;
    items.forEach(function (li) {
      function open() { clearTimeout(timer); items.forEach(function (x) { if (x !== li) close(x); }); li.classList.add('is-open'); li.querySelector('.catnav__link').setAttribute('aria-expanded', 'true'); }
      function close(target) { var t = target || li; t.classList.remove('is-open'); var l = t.querySelector('.catnav__link'); if (l) l.setAttribute('aria-expanded', 'false'); }
      li.addEventListener('mouseenter', open);
      li.addEventListener('mouseleave', function () { timer = setTimeout(function () { close(); }, 140); });
      li.querySelector('.catnav__link').addEventListener('focus', open);
      li.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); li.querySelector('.catnav__link').focus(); } });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.catnav__item')) items.forEach(function (x) { x.classList.remove('is-open'); });
    });
  }

  /* -------------------------------------------------------------- mount --- */
  function mount() {
    var head = qs('[data-app-header]'), foot = qs('[data-app-footer]');
    if (head) head.innerHTML = utilityBar() + header();
    if (foot) foot.innerHTML = footer();
    document.body.insertAdjacentHTML('beforeend', drawerMarkup() + quoteModal());

    wireSearch();
    wireMega();
    renderDrawer();

    document.addEventListener('basket:change', renderDrawer);

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-basket-open]')) { e.preventDefault(); openDrawer(); }
      if (t.closest('[data-basket-close]') || t.closest('[data-overlay]')) { closeDrawer(); }
      if (t.closest('[data-quote]')) { e.preventDefault(); openModal('quote'); }
      if (t.closest('[data-modal-close]')) { e.preventDefault(); closeModal(t.closest('.modal')); }
      if (t.closest('[data-mnav-open]')) { e.preventDefault(); var m = qs('[data-mnav]'); m.hidden = false; m.classList.add('is-open'); document.body.classList.add('is-locked'); }
      if (t.closest('[data-mnav-close]')) { var mm = qs('[data-mnav]'); mm.classList.remove('is-open'); mm.hidden = true; document.body.classList.remove('is-locked'); }
      if (t.closest('[data-account]')) { e.preventDefault(); toast('Accounts are not part of this demo storefront'); }
      var rm = t.closest('[data-remove]');
      if (rm) { Basket.remove(rm.getAttribute('data-remove')); toast('Item removed from your basket'); }
    });

    document.addEventListener('change', function (e) {
      if (e.target.name === 'fulfil') { Basket.fulfilment(e.target.value); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDrawer(); closeModal(); }
    });

    /* quote form */
    var qf = qs('[data-quote-form]');
    if (qf) qf.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(qf), errBox = qs('[data-quote-error]');
      var missing = ['name', 'email', 'phone'].filter(function (k) { return !String(data.get(k) || '').trim(); });
      var email = String(data.get('email') || '');
      if (missing.length || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        errBox.innerHTML = '<p class="error">Please add your name, a valid email address and a phone number so we can come back to you.</p>';
        return;
      }
      var box = qf.closest('.modal__box');
      box.innerHTML = '<div class="modal__success">' + I.checkCircle +
        '<h2>Thanks, ' + esc(String(data.get('name')).split(' ')[0]) + ' — request received</h2>' +
        '<p>A member of the team will call you on <strong>' + esc(String(data.get('phone'))) + '</strong> within one working day' +
        (data.get('survey') ? ' to arrange your free site survey' : '') + '.</p>' +
        '<p class="formnote">Need it sooner? Call the unit on <a href="' + CO.phoneHref + '">' + CO.phone + '</a>.</p>' +
        '<button class="btn" type="button" data-modal-close>Close</button></div>';
    });
  }

  global.URApp = {
    I: I, el: el, qs: qs, qsa: qsa, esc: esc, stars: stars, param: param,
    Basket: Basket, openDrawer: openDrawer, closeDrawer: closeDrawer, openModal: openModal, closeModal: closeModal,
    toast: toast, lineItemHtml: lineItemHtml, fulfilmentPicker: fulfilmentPicker, mount: mount,
    ORDER_KEY: ORDER_KEY, miniMap: miniMap
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})(window);
