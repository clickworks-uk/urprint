/* ==========================================================================
   UR Print — category listing
   ========================================================================== */
(function () {
  'use strict';
  var D = window.URData, Art = window.URArt, App = window.URApp;
  var esc = App.esc, qs = App.qs;

  var catSlug = App.param('c');
  var subSlug = App.param('s');
  var cat = catSlug ? D.getCategory(catSlug) : null;

  if (catSlug && !cat) { catSlug = null; subSlug = null; }
  if (cat && subSlug && !cat.subs.some(function (s) { return s.slug === subSlug; })) subSlug = null;

  var sub = cat && subSlug ? cat.subs.filter(function (s) { return s.slug === subSlug; })[0] : null;

  /* ------------------------------------------------------------- head --- */
  var pageTitle = (sub ? sub.name + ' — ' + cat.name : cat ? cat.name : 'All products') + ' | UR Print Wolverhampton';
  var pageDesc = sub
    ? sub.name + ' from UR Print, Wolverhampton. ' + cat.tagline + ' Free local collection at Unit 1 Ward Street or UK-wide delivery.'
    : cat
      ? cat.blurb
      : 'Business cards, flyers, signage, banners, stickers, workwear and stationery printed in Wolverhampton, with live online pricing.';
  var crumbTrail = [{ name: 'Home', path: '' }];
  if (cat) {
    crumbTrail.push({ name: cat.name, path: 'category.html?c=' + cat.slug });
    if (sub) crumbTrail.push({ name: sub.name, path: 'category.html?c=' + cat.slug + '&s=' + sub.slug });
  } else {
    crumbTrail.push({ name: 'All products', path: 'category.html' });
  }
  App.setPageMeta({
    title: pageTitle,
    description: pageDesc,
    path: cat ? ('category.html?c=' + cat.slug + (sub ? '&s=' + sub.slug : '')) : 'category.html',
    breadcrumbs: crumbTrail
  });
  qs('[data-cat-title]').textContent = sub ? sub.name : cat ? cat.name : 'Everything we print';
  qs('[data-cat-blurb]').textContent = sub
    ? cat.tagline
    : cat ? cat.blurb
      : 'Business cards, flyers, signage, banners, stickers, workwear and stationery — all produced at our Wolverhampton unit with live online pricing.';

  var crumbs = ['<a href="index.html">Home</a>'];
  if (cat) {
    crumbs.push('<span class="sep">/</span><a href="category.html?c=' + cat.slug + '">' + esc(cat.name) + '</a>');
    if (sub) crumbs.push('<span class="sep">/</span><span class="current">' + esc(sub.name) + '</span>');
  } else {
    crumbs.push('<span class="sep">/</span><span class="current">All products</span>');
  }
  qs('[data-crumbs]').innerHTML = crumbs.join('');

  /* ---------------------------------------------------------- filters --- */
  qs('[data-filter-cats]').innerHTML =
    '<li><a href="category.html" class="' + (cat ? '' : 'is-active') + '">All products</a></li>' +
    D.CATEGORIES.map(function (c) {
      return '<li><a href="category.html?c=' + c.slug + '" class="' + (cat && c.slug === cat.slug && !sub ? 'is-active' : '') + '">' +
        esc(c.name) + '</a></li>';
    }).join('');

  if (cat) {
    qs('[data-filter-subs-block]').hidden = false;
    qs('[data-subs-heading]').textContent = cat.name;
    qs('[data-filter-subs]').innerHTML =
      '<li><a href="category.html?c=' + cat.slug + '" class="' + (sub ? '' : 'is-active') + '">All ' + esc(cat.name.toLowerCase()) + '</a></li>' +
      cat.subs.map(function (s) {
        return '<li><a href="category.html?c=' + cat.slug + '&s=' + s.slug + '" class="' + (sub && sub.slug === s.slug ? 'is-active' : '') + '">' +
          esc(s.name) + '</a></li>';
      }).join('');
  }

  /* --------------------------------------------------------- products --- */
  var products = cat ? D.productsIn(cat.slug, sub ? sub.slug : null) : D.PRODUCTS.slice();

  function priceBlock(p) {
    var f = D.fromParts(p);
    return '<div class="pcard__price">' + (f.qty ? '<span class="qty">' + esc(f.qty) + '</span>' : '') +
      '<b>' + esc(f.price) + '</b><span>incl. VAT</span></div>';
  }
  function card(p) {
    var c = D.getCategory(p.cat);
    return '<a class="pcard" href="product.html?p=' + p.slug + '">' +
      '<div class="pcard__media">' + Art.get(p.art) + '</div>' +
      '<div class="pcard__body">' +
      '<span class="pcard__cat">' + esc(c.name) + '</span>' +
      '<h3 class="pcard__title">' + esc(p.name) + '</h3>' +
      '<p class="pcard__blurb">' + esc(p.blurb) + '</p>' +
      priceBlock(p) +
      '<div class="pcard__foot"><span class="btn btn--sm">Configure &amp; order</span></div>' +
      '</div></a>';
  }

  function sortList(mode) {
    var list = products.slice();
    if (mode === 'price-asc') list.sort(function (a, b) { return D.headlineTier(a).price - D.headlineTier(b).price; });
    else if (mode === 'price-desc') list.sort(function (a, b) { return D.headlineTier(b).price - D.headlineTier(a).price; });
    else if (mode === 'name') list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    /* default: the curated catalogue order */
    return list;
  }

  function render(mode) {
    var list = sortList(mode);
    qs('[data-prodgrid]').innerHTML = list.length
      ? list.map(card).join('')
      : '<div class="helpbox"><h4>Nothing here yet</h4><p>We still print it — ask us for a bespoke quote.</p>' +
        '<a class="btn btn--sm" href="#" data-quote>Request a quote</a></div>';
    qs('[data-count]').textContent = list.length + (list.length === 1 ? ' product' : ' products') +
      (cat ? ' in ' + (sub ? sub.name : cat.name) : ' available');
  }

  var sel = qs('[data-sort]');
  sel.addEventListener('change', function () { render(sel.value); });
  render('featured');
})();
