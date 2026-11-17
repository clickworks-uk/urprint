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

  /* ---------------------------------------------------- value strip ------ */
  qs('[data-value-strip]').innerHTML = [
    { icon: I.factory, h: 'In-house Wolverhampton production', p: 'Printed, finished and quality-checked at Unit 1 Ward Street — with free click-and-collect when you are passing.' },
    { icon: I.upload, h: 'Upload artwork or get design help', p: 'Drop in a print-ready PDF, AI, EPS or PNG, or hand it to our in-house studio from £15 and approve a proof.' },
    { icon: I.pin, h: 'Collect in Wolverhampton', p: 'Unit 1 Ward Street, WV1 3LT. Open Monday to Friday 8am–6pm and Saturday 10am–4pm.' }
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
  function priceBlock(p) {
    var f = D.fromParts(p);
    return '<div class="pcard__price">' + (f.qty ? '<span class="qty">' + esc(f.qty) + '</span>' : '') +
      '<b>' + esc(f.price) + '</b><span>incl. VAT</span></div>';
  }
  function card(p) {
    var cat = D.getCategory(p.cat);
    return '<a class="pcard" href="product.html?p=' + p.slug + '">' +
      '<div class="pcard__media">' + Art.get(p.art) + '</div>' +
      '<div class="pcard__body">' +
      '<span class="pcard__cat">' + esc(cat.name) + '</span>' +
      '<h3 class="pcard__title">' + esc(p.name) + '</h3>' +
      '<p class="pcard__blurb">' + esc(p.blurb) + '</p>' +
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

})();
