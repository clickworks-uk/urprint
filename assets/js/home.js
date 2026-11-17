/* ==========================================================================
   UR Print — homepage
   ========================================================================== */
(function () {
  'use strict';
  var D = window.URData, Art = window.URArt, App = window.URApp, I = App.I;
  var esc = App.esc, qs = App.qs;

  /* ------------------------------------------------------------- hero ---- */
  qs('[data-hero-points]').innerHTML = [
    'Artwork checked free by a real printer',
    'Collect from Ward Street or next-day courier',
    'No minimum order on most products'
  ].map(function (t) { return '<li>' + I.check + ' ' + esc(t) + '</li>'; }).join('');

  qs('[data-hero-collage]').innerHTML = [
    { art: 'roller-banner', cap: '850mm roller banners — from £39.99' },
    { art: 'business-cards', cap: 'Business cards — from £15.99' },
    { art: 'signs', cap: 'Shop fascia signs & window graphics' },
    { art: 'tshirt', cap: 'Workwear, printed & embroidered' }
  ].map(function (c) {
    return '<figure>' + Art.get(c.art) + '<figcaption>' + esc(c.cap) + '</figcaption></figure>';
  }).join('');

  qs('[data-hero-float]').innerHTML = I.bolt +
    '<div><b>Same-day collection</b><span>On banners &amp; boards, artwork in by 11am</span></div>';

  /* ---------------------------------------------------- value strip ------ */
  qs('[data-value-strip]').innerHTML = [
    { icon: I.factory, h: 'In-house Wolverhampton production', p: 'Printed, finished and quality-checked at Unit 1 Ward Street — with free click-and-collect when you are passing.' },
    { icon: I.upload, h: 'Upload artwork or get design help', p: 'Drop in a print-ready PDF, AI, EPS or PNG, or hand it to our in-house studio from £15 and approve a proof.' },
    { icon: I.star, h: 'Rated 4.8★ locally', p: 'Trusted by 312 Wolverhampton and West Midlands businesses, from corner shops to national contractors.' }
  ].map(function (v) {
    return '<article class="vcard"><div class="vcard__icon">' + v.icon + '</div>' +
      '<div><h3>' + esc(v.h) + '</h3><p>' + esc(v.p) + '</p></div></article>';
  }).join('');

  /* ------------------------------------------------------- categories ---- */
  qs('[data-category-grid]').innerHTML = D.CATEGORIES.map(function (c) {
    return '<a class="cattile" href="category.html?c=' + c.slug + '">' +
      '<span class="cattile__img">' + Art.get(c.art) + '</span>' +
      '<span class="cattile__label">' + esc(c.name) + '</span>' +
      '<span class="cattile__from">from ' + D.money(D.categoryFrom(c.slug)) + '</span></a>';
  }).join('');

  /* ------------------------------------------------------- bestsellers --- */
  function badgeClass(b) {
    if (/same-day|fast/i.test(b)) return 'badge--amber';
    if (/premium|trade/i.test(b)) return 'badge--ink';
    if (/free|no minimum/i.test(b)) return 'badge--blue';
    return '';
  }
  function priceBlock(p) {
    var f = D.fromParts(p);
    return '<div class="pcard__price">' + (f.qty ? '<span class="qty">' + esc(f.qty) + '</span>' : '') +
      '<b>' + esc(f.price) + '</b><span>incl. VAT</span></div>';
  }
  function card(p) {
    var cat = D.getCategory(p.cat);
    return '<a class="pcard" href="product.html?p=' + p.slug + '">' +
      '<div class="pcard__media">' + Art.get(p.art) +
      (p.badges.length ? '<div class="pcard__badges">' + p.badges.map(function (b) {
        return '<span class="badge ' + badgeClass(b) + '">' + esc(b) + '</span>';
      }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="pcard__body">' +
      '<span class="pcard__cat">' + esc(cat.name) + '</span>' +
      '<h3 class="pcard__title">' + esc(p.name) + '</h3>' +
      '<p class="pcard__blurb">' + esc(p.blurb) + '</p>' +
      '<div class="pcard__rating"><span class="stars">' + App.stars(p.rating) + '</span>' + p.rating.toFixed(1) + ' (' + p.reviews + ')</div>' +
      priceBlock(p) +
      '<div class="pcard__foot"><span class="btn btn--sm">Configure &amp; order</span></div>' +
      '</div></a>';
  }

  var featured = ['standard-business-cards', 'a5-flyers', 'roller-banners', 'pvc-vinyl-banners',
    'die-cut-stickers', 'embroidered-polo-shirts', 'foamex-correx-boards', 'matt-laminated-business-cards',
    'ncr-invoice-pads', 'takeaway-menus'].map(D.getProduct).filter(Boolean);

  var track = qs('[data-carousel-track]');
  track.innerHTML = featured.map(card).join('');
  qs('[data-carousel-prev]').innerHTML = I.arrowL;
  qs('[data-carousel-next]').innerHTML = I.arrowR;
  function scrollBy(dir) {
    var first = track.firstElementChild;
    var step = first ? first.getBoundingClientRect().width + 18 : 280;
    track.scrollBy({ left: dir * step * 2, behavior: 'smooth' });
  }
  qs('[data-carousel-prev]').addEventListener('click', function () { scrollBy(-1); });
  qs('[data-carousel-next]').addEventListener('click', function () { scrollBy(1); });

  /* --------------------------------------------------------- spotlight --- */
  qs('[data-spotlight-list]').innerHTML = [
    'Free site survey and a digital visual before anything is made',
    'Aluminium tray fascias, built-up letters and LED illumination',
    'Frosted manifestation, one-way vision and full window wraps',
    'Van lettering to full colour-change wraps, fitted indoors at Ward Street',
    'Planning and landlord drawings prepared on request'
  ].map(function (t) { return '<li>' + I.check + '<span>' + esc(t) + '</span></li>'; }).join('');
  qs('[data-spotlight-art]').innerHTML =
    '<div style="display:grid;gap:14px;width:100%">' +
    '<div style="border-radius:12px;overflow:hidden">' + Art.get('window-graphics') + '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
    '<div style="border-radius:12px;overflow:hidden">' + Art.get('vehicle') + '</div>' +
    '<div style="border-radius:12px;overflow:hidden">' + Art.get('a-board') + '</div>' +
    '</div></div>';

  /* ----------------------------------------------------------- reviews --- */
  var REVIEWS = [
    { n: 'Hardeep S.', b: 'Sandwell Autocare', t: 'Needed 2,000 flyers and a pull-up banner for a trade day with four days\' notice. Both were ready in two and the banner is still going strong a year later.' },
    { n: 'Marie T.', b: 'The Lilac Room, Tettenhall', t: 'They surveyed the shop front on the Tuesday, sent a visual on the Wednesday and fitted the sign the following week. Spotless job and no mess left behind.' },
    { n: 'Jas K.', b: 'Kings Catering Supplies', t: 'We get our NCR pads and menus reprinted here every few months. Artwork is kept on file so a reorder is one phone call.' },
    { n: 'Dan W.', b: 'Wolves Scaffolding Ltd', t: 'Fifty hi-vis vests and two vans lettered. Pricing was clear, no surprises, and they worked around our site hours.' },
    { n: 'Priya N.', b: 'Nova Beauty Studio', t: 'The velvet soft-touch cards are beautiful — clients comment on them. Worth the extra over the standard ones.' },
    { n: 'Steve B.', b: 'Bilston Road Motors', t: 'Rang at 9am about a replacement A-board panel, collected it the same afternoon. Proper local service.' }
  ];
  qs('[data-reviews]').innerHTML =
    '<div class="googlecard">' +
    '<div class="googlecard__score">4.8</div>' +
    '<div class="stars">★★★★★</div>' +
    '<p>Based on <strong>312 reviews</strong> from Wolverhampton and the wider West Midlands</p>' +
    '<div class="googlecard__g">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6"/><path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21.4 7.6 24 12 24"/><path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.3 15.1 0 12 0 7.6 0 3.7 2.6 1.8 6.3l3.8 3c.9-2.8 3.4-4.5 6.4-4.5"/></svg>' +
    'Google reviews</div>' +
    '<p class="formnote" style="margin-top:14px">Opening hours: Mon–Fri 8am–6pm · Sat 10am–4pm</p>' +
    '</div>' +
    '<div class="reviewgrid">' + REVIEWS.map(function (r) {
      return '<article class="review"><div class="stars">★★★★★</div>' +
        '<blockquote>“' + esc(r.t) + '”</blockquote>' +
        '<div class="review__who"><span class="review__avatar">' + esc(r.n.charAt(0)) + '</span>' +
        '<span><b>' + esc(r.n) + '</b><span>' + esc(r.b) + '</span></span></div></article>';
    }).join('') + '</div>';
})();
