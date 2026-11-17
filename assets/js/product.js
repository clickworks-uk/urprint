/* ==========================================================================
   UR Print — product page / dynamic configurator
   ========================================================================== */
(function () {
  'use strict';
  var D = window.URData, Art = window.URArt, App = window.URApp, I = App.I;
  var esc = App.esc, qs = App.qs, qsa = App.qsa;

  var p = D.getProduct(App.param('p'));
  if (!p) {
    qs('[data-notfound]').hidden = false;
    qs('[data-crumbs]').innerHTML = '<a href="index.html">Home</a><span class="sep">/</span><span class="current">Not found</span>';
    return;
  }
  var cat = D.getCategory(p.cat);
  var subName = (cat.subs.filter(function (s) { return s.slug === p.sub; })[0] || {}).name || '';

  qs('[data-pdp]').hidden = false;
  document.title = p.name + ' | UR Print Wolverhampton';
  var md = document.querySelector('meta[name=description]');
  if (md) md.setAttribute('content', p.blurb + ' ' + D.fromLabel(p) + ' incl. VAT. Printed in Wolverhampton.');

  /* ------------------------------------------------------------ state --- */
  var sel = D.defaultSelection(p);
  var qty = D.headlineTier(p).q;
  var artworkMode = 'upload';
  var files = [];
  var brief = '';

  /* --------------------------------------------------------- breadcrumb -- */
  qs('[data-crumbs]').innerHTML =
    '<a href="index.html">Home</a><span class="sep">/</span>' +
    '<a href="category.html?c=' + cat.slug + '">' + esc(cat.name) + '</a><span class="sep">/</span>' +
    '<a href="category.html?c=' + cat.slug + '&s=' + p.sub + '">' + esc(subName) + '</a><span class="sep">/</span>' +
    '<span class="current">' + esc(p.name) + '</span>';

  /* ----------------------------------------------------------- gallery -- */
  var galleryArts = [p.art, cat.art].concat(
    D.productsIn(p.cat).filter(function (x) { return x.slug !== p.slug; }).slice(0, 2).map(function (x) { return x.art; })
  ).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 4);

  function badgeClass(b) {
    if (/same-day|fast/i.test(b)) return 'badge--amber';
    if (/premium|trade/i.test(b)) return 'badge--ink';
    if (/free|no minimum/i.test(b)) return 'badge--blue';
    return '';
  }
  function paintGallery(idx) {
    qs('[data-gallery-main]').innerHTML = Art.get(galleryArts[idx]) +
      (p.badges.length ? '<div class="gallery__badges">' + p.badges.map(function (b) {
        return '<span class="badge ' + badgeClass(b) + '">' + esc(b) + '</span>';
      }).join('') + '</div>' : '');
    qsa('[data-gallery-thumbs] button').forEach(function (b, i) { b.classList.toggle('is-active', i === idx); });
  }
  qs('[data-gallery-thumbs]').innerHTML = galleryArts.map(function (a, i) {
    return '<button type="button" data-thumb="' + i + '" aria-label="View image ' + (i + 1) + '">' + Art.get(a) + '</button>';
  }).join('');
  qsa('[data-thumb]').forEach(function (b) {
    b.addEventListener('click', function () { paintGallery(+b.getAttribute('data-thumb')); });
  });
  paintGallery(0);

  /* -------------------------------------------------------------- head -- */
  qs('[data-cfg-cat]').textContent = cat.name + ' · ' + subName;
  qs('[data-cfg-title]').textContent = p.name;
  qs('[data-cfg-rating]').innerHTML = '<span class="stars">' + App.stars(p.rating) + '</span>' +
    '<strong>' + p.rating.toFixed(1) + '</strong> · ' + p.reviews + ' reviews · ' + esc(p.turnaround);
  qs('[data-specs]').innerHTML = p.specs.map(function (s) { return '<li>' + I.check + '<span>' + esc(s) + '</span></li>'; }).join('');
  qs('[data-turnaround]').innerHTML = I.clock + ' ' + esc(p.turnaround) + ' · Free collection from Ward Street';
  if (p.priceNote) qs('[data-pricenote]').innerHTML = '<div class="callout"><p>' + esc(p.priceNote) +
    ' <a href="#" data-quote>Request a survey →</a></p></div>';

  qs('[data-upload-icon]').innerHTML = I.upload;
  qs('[data-checklist]').innerHTML = [
    'Add 3mm bleed on every edge',
    'Keep text 4mm inside the trim line',
    'Supply images at 300dpi (150dpi for large format)',
    'Convert artwork to CMYK and embed or outline fonts',
    'Spot UV and cutter guides on a separate 100% K layer'
  ].map(function (t) { return '<li>' + I.check + '<span>' + esc(t) + '</span></li>'; }).join('');

  var promises = qs('[data-pdp-promises]');
  if (promises) promises.innerHTML = [
    { i: I.pin, h: 'Free local collection', p: 'Collect from Unit 1 Ward Street, WV1 3LT — Mon–Fri 8am–6pm, Sat 10am–4pm.' },
    { i: I.truck, h: 'UK-wide courier', p: 'Tracked standard delivery from £5.95, or next working day express. Free standard over ' + D.money(D.FREE_DELIVERY_THRESHOLD) + '.' },
    { i: I.pencil, h: 'Free reorders on file', p: 'We keep your approved artwork for 24 months — a reorder is one phone call.' }
  ].map(function (v) {
    return '<article class="vcard"><div class="vcard__icon">' + v.i + '</div>' +
      '<div><h3>' + esc(v.h) + '</h3><p>' + esc(v.p) + '</p></div></article>';
  }).join('');

  /* ----------------------------------------------------------- options -- */
  function renderOptions() {
    qs('[data-options]').innerHTML = p.options.map(function (o) {
      var chips = o.choices.map(function (ch) {
        var id = 'opt-' + o.key + '-' + ch.v;
        var up = D.upliftFor(p, sel, qty, o.key, ch.v);
        var upTxt = Math.abs(up) < 0.005 ? '' :
          '<span class="plus"> ' + (up > 0 ? '+' : '−') + D.money(Math.abs(up)) + '</span>';
        return '<input type="radio" name="' + o.key + '" id="' + id + '" value="' + esc(ch.v) + '"' +
          (sel[o.key] === ch.v ? ' checked' : '') + '>' +
          '<label for="' + id + '">' + esc(ch.label) + upTxt + '</label>';
      }).join('');
      var chosen = o.choices.filter(function (ch) { return ch.v === sel[o.key]; })[0];
      return '<div class="optgroup">' +
        '<div class="optgroup__label"><span class="flabel">' + esc(o.label) + '</span>' +
        (chosen && chosen.note ? '<span class="pick">' + esc(chosen.note) + '</span>' : '') + '</div>' +
        (o.help ? '<p class="hint" style="margin:-4px 0 8px">' + esc(o.help) + '</p>' : '') +
        '<div class="chips">' + chips + '</div></div>';
    }).join('');
  }

  function renderQty() {
    qs('[data-qty]').innerHTML = p.qty.map(function (t) {
      var pr = D.priceFor(p, sel, t.q);
      var save = D.tierSaving(p, sel, t.q);
      var unitTxt = t.q > 1 ? D.money(pr.unit) + ' each' : D.money(pr.total);
      return '<input type="radio" name="qty" id="qty-' + t.q + '" value="' + t.q + '"' + (qty === t.q ? ' checked' : '') + '>' +
        '<label for="qty-' + t.q + '"><b>' + t.q.toLocaleString('en-GB') + '</b><span>' + unitTxt + '</span>' +
        (save >= 5 ? '<span class="save">−' + save + '%</span>' : '') + '</label>';
    }).join('');
    var biggest = p.qty[p.qty.length - 1];
    qs('[data-qty-note]').textContent = p.unit === 'm²' ? 'Charged per square metre' :
      'Best value at ' + biggest.q.toLocaleString('en-GB') + ' ' + p.unit + (biggest.q > 1 ? 's' : '');
  }

  function renderPrice(flash) {
    var pr = D.priceFor(p, sel, qty, artworkMode === 'design');
    var box = qs('[data-pricebox]');
    qs('[data-total]').textContent = D.money(pr.total);
    qs('[data-unit]').textContent = qty > 1
      ? D.money(pr.total / qty) + ' per ' + p.unit + ' · ' + qty.toLocaleString('en-GB') + ' ' + p.unit + 's'
      : 'For 1 ' + p.unit + (artworkMode === 'design' ? ' incl. design service' : '');
    var save = D.tierSaving(p, sel, qty);
    qs('[data-savebadge]').innerHTML = save >= 5
      ? '<span class="badge">Save ' + save + '% per ' + esc(p.unit) + '</span>'
      : (artworkMode === 'design' ? '<span class="badge badge--blue">Design service added</span>' : '');
    qs('[data-exvat]').textContent = D.money(pr.total / 1.2) + ' ex VAT';
    if (flash) { box.classList.remove('priceflash'); void box.offsetWidth; box.classList.add('priceflash'); }
  }

  function repaint(flash) {
    renderOptions();
    renderQty();
    renderPrice(flash);
  }

  /* -------------------------------------------------------- interaction - */
  var form = qs('[data-config]');

  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'qty') { qty = +t.value; repaint(true); return; }
    if (t.name === 'artwork') {
      artworkMode = t.value;
      renderPrice(true);
      return;
    }
    if (sel.hasOwnProperty(t.name)) { sel[t.name] = t.value; repaint(true); }
  });

  /* file handling -------------------------------------------------------- */
  var fileInput = qs('[data-fileinput]');
  var dropzone = qs('[data-dropzone]');

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
  function renderFiles() {
    qs('[data-filelist]').innerHTML = files.map(function (f, i) {
      return '<div class="fileitem">' + I.file +
        '<span class="name">' + esc(f.name) + '</span>' +
        '<span class="size">' + esc(f.size) + '</span>' +
        '<button class="linkbtn" type="button" data-rmfile="' + i + '">Remove</button></div>';
    }).join('');
  }
  function addFiles(list) {
    Array.prototype.forEach.call(list, function (f) {
      if (files.length >= 10) return;
      files.push({ name: f.name, size: fmtSize(f.size) });
    });
    renderFiles();
    if (files.length) App.toast(files.length === 1 ? 'Artwork attached — we will check it before printing' : files.length + ' files attached');
  }
  dropzone.addEventListener('click', function () { fileInput.click(); });
  dropzone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });
  ['dragenter', 'dragover'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('is-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('is-drag'); });
  });
  dropzone.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
  qs('[data-filelist]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-rmfile]');
    if (b) { files.splice(+b.getAttribute('data-rmfile'), 1); renderFiles(); }
  });
  qs('[data-brief]').addEventListener('input', function (e) { brief = e.target.value; });

  /* add to basket -------------------------------------------------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (artworkMode === 'upload' && !files.length) {
      if (!confirm('No artwork attached yet.\n\nAdd it to your basket anyway? You can email files to ' +
        D.COMPANY.email + ' quoting your order number, or upload them after checkout.')) return;
    }
    var pr = D.priceFor(p, sel, qty, artworkMode === 'design');
    var spec = {};
    p.options.forEach(function (o) { spec[o.label] = D.labelFor(p, o.key, sel[o.key]); });

    App.Basket.add({
      slug: p.slug, name: p.name, art: p.art, cat: cat.name,
      qty: qty, spec: spec, selection: JSON.parse(JSON.stringify(sel)),
      artwork: artworkMode,
      artworkLabel: artworkMode === 'design'
        ? 'In-house design service (+' + D.money(D.DESIGN_SERVICE_FEE) + ')'
        : (files.length ? files.map(function (f) { return f.name; }).join(', ') : 'To be supplied'),
      files: files.map(function (f) { return f.name; }),
      brief: brief,
      unit: pr.unit, total: pr.total,
      turnaround: p.turnaround
    });
    App.toast(p.name + ' added to your basket');
    App.openDrawer();
  });

  repaint(false);

  /* ----------------------------------------------------------- related -- */
  var related = D.productsIn(p.cat).filter(function (x) { return x.slug !== p.slug; });
  D.PRODUCTS.forEach(function (x) {
    if (related.length < 3 && x.cat !== p.cat && x.badges.indexOf('Bestseller') > -1) related.push(x);
  });
  related = related.slice(0, 3);
  if (related.length) {
    qs('[data-related-section]').hidden = false;
    qs('[data-related]').innerHTML = related.map(function (r) {
      var rc = D.getCategory(r.cat);
      return '<a class="pcard" href="product.html?p=' + r.slug + '">' +
        '<div class="pcard__media">' + Art.get(r.art) + '</div>' +
        '<div class="pcard__body"><span class="pcard__cat">' + esc(rc.name) + '</span>' +
        '<h3 class="pcard__title">' + esc(r.name) + '</h3>' +
        '<p class="pcard__blurb">' + esc(r.blurb) + '</p>' +
        (function () { var f = D.fromParts(r); return '<div class="pcard__price">' +
          (f.qty ? '<span class="qty">' + esc(f.qty) + '</span>' : '') +
          '<b>' + esc(f.price) + '</b><span>incl. VAT</span></div>'; })() +
        '<div class="pcard__foot"><span class="btn btn--sm">Configure &amp; order</span></div></div></a>';
    }).join('');
  }
})();
