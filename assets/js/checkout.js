/* ==========================================================================
   UR Print — checkout
   ========================================================================== */
(function () {
  'use strict';
  var D = window.URData, App = window.URApp, I = App.I;
  var esc = App.esc, qs = App.qs, B = App.Basket, CO = D.COMPANY;

  function render() {
    var items = B.read();
    qs('[data-empty]').hidden = items.length > 0;
    qs('[data-checkout]').hidden = items.length === 0;
    if (!items.length) return;

    qs('[data-summary-items]').innerHTML = items.map(function (i) { return App.lineItemHtml(i, true); }).join('');

    var sub = B.subtotal(), del = B.deliveryCost(), tot = B.total();
    var vat = D.round2(tot - tot / (1 + CO.vatRate));
    var mode = B.fulfilment();
    var toFree = D.round2(D.FREE_DELIVERY_THRESHOLD - sub);

    qs('[data-summary-totals]').innerHTML = '<div class="totals">' +
      '<div class="row"><span>Subtotal (' + items.length + ' item' + (items.length > 1 ? 's' : '') + ')</span><span>' + D.money(sub) + '</span></div>' +
      '<div class="row"><span>' + esc(D.DELIVERY[mode].label) + '</span><span>' + (del === 0 ? 'FREE' : D.money(del)) + '</span></div>' +
      (mode === 'standard' && toFree > 0
        ? '<div class="row muted"><span>Spend ' + D.money(toFree) + ' more for free standard delivery</span><span></span></div>' : '') +
      '<div class="row row--total"><span>Total to pay</span><span>' + D.money(tot) + '</span></div>' +
      '<div class="row muted"><span>Includes VAT at 20%</span><span>' + D.money(vat) + '</span></div>' +
      '</div>' +
      '<p class="trustline">' + I.shield + ' Every file checked by our studio before printing</p>';

    qs('[data-fulfil-picker]').innerHTML = App.fulfilmentPicker();

    var d = D.DELIVERY[mode];
    if (mode === 'collection') {
      qs('[data-fulfil-detail]').innerHTML = '<div class="collectbox">' +
        '<b>' + I.pin + ' Collect from ' + esc(CO.addressLine) + ', ' + esc(CO.city) + ' ' + esc(CO.postcode) + '</b>' +
        esc(d.note) + '<br>Open Mon–Fri 8am–6pm, Sat 10am–4pm. Free customer parking on site.</div>';
    } else {
      qs('[data-fulfil-detail]').innerHTML =
        '<p class="hint" style="margin:4px 0 14px">' + esc(d.eta) + '. ' + esc(d.note) + '</p>' +
        '<div class="grid2">' +
        '<div class="field"><label for="d-addr1">Address line 1</label><input id="d-addr1" name="addr1" type="text" autocomplete="address-line1" required></div>' +
        '<div class="field"><label for="d-addr2">Address line 2 (optional)</label><input id="d-addr2" name="addr2" type="text" autocomplete="address-line2"></div>' +
        '<div class="field"><label for="d-town">Town / city</label><input id="d-town" name="town" type="text" autocomplete="address-level2" required></div>' +
        '<div class="field"><label for="d-post">Postcode</label><input id="d-post" name="postcode" type="text" autocomplete="postal-code" required></div>' +
        '</div>';
    }
    qs('[data-secureline]').innerHTML = I.shield + ' Demonstration checkout — no payment is processed';
  }

  document.addEventListener('basket:change', render);
  render();

  qs('[data-checkout-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target, data = new FormData(form), errs = [];
    var mode = B.fulfilment();
    var required = [['first', 'first name'], ['last', 'last name'], ['email', 'email address'], ['phone', 'mobile number']];
    if (mode !== 'collection') required = required.concat([['addr1', 'address'], ['town', 'town or city'], ['postcode', 'postcode']]);

    required.forEach(function (r) { if (!String(data.get(r[0]) || '').trim()) errs.push(r[1]); });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(data.get('email') || ''))) {
      if (errs.indexOf('email address') === -1) errs.push('a valid email address');
    }
    if (!data.get('terms')) errs.push('confirmation that your artwork is print-ready');

    var box = qs('[data-checkout-error]');
    if (errs.length) {
      box.innerHTML = '<p class="error">Please add ' + esc(errs.join(', ').replace(/, ([^,]*)$/, ' and $1')) + '.</p>';
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    box.innerHTML = '';

    var items = B.read(), tot = B.total(), del = B.deliveryCost();
    var ref = 'URP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
    var order = {
      ref: ref, items: items, total: tot, delivery: del, mode: mode,
      name: String(data.get('first')) + ' ' + String(data.get('last')),
      email: String(data.get('email')),
      placed: new Date().toISOString()
    };
    try { localStorage.setItem(App.ORDER_KEY, JSON.stringify(order)); } catch (err) { }

    var longest = items.reduce(function (a, i) { return a.length > i.turnaround.length ? a : i.turnaround; }, '');
    B.clear();

    qs('[data-checkout]').hidden = true;
    qs('[data-empty]').hidden = true;
    var c = qs('[data-confirm]');
    c.hidden = false;
    qs('[data-tick]').innerHTML = I.check;
    qs('[data-ref]').textContent = ref;
    qs('[data-confirm-detail]').innerHTML =
      '<p style="color:var(--ink-60);max-width:56ch;margin:0 auto">' +
      (mode === 'collection'
        ? 'We will text ' + esc(order.name.split(' ')[0]) + ' as soon as your order is boxed and ready at <strong>' +
          esc(CO.addressLine) + ', ' + esc(CO.city) + ' ' + esc(CO.postcode) + '</strong>.'
        : 'Your order will be dispatched by ' + esc(D.DELIVERY[mode].label.toLowerCase()) + ' — ' + esc(D.DELIVERY[mode].eta) + '.') +
      '</p>' +
      '<p style="color:var(--ink-60);max-width:56ch;margin:14px auto 0">Production time: <strong>' + esc(longest) + '</strong>. ' +
      'Total paid <strong>' + D.money(tot) + '</strong> including VAT.</p>' +
      '<p style="color:var(--ink-60);max-width:56ch;margin:14px auto 0">Anything to add? Call <a href="' + CO.phoneHref + '">' +
      CO.phone + '</a> or email <a href="mailto:' + CO.email + '">' + CO.email + '</a> quoting ' + esc(ref) + '.</p>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
