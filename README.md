# UR Print — e-commerce print & signage storefront

A responsive, VistaPrint-style storefront for **UR Print**, a printing and signage company in
Wolverhampton (Unit 1 Ward Street, WV1 3LT · 01902 331074 · info@urprint.co.uk).

Built as a **zero-dependency static site** — no build step, no framework, no npm install. Open
`index.html` through any web server and it runs.

## Running it

```bash
python3 -m http.server 8080
```

Then visit <http://127.0.0.1:8080/>. (A plain `file://` open mostly works, but a server is needed
for consistent behaviour.) Deploy by uploading the folder to any static host.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Homepage — hero, value strip, category grid, bestsellers carousel, signage spotlight, reviews |
| `category.html?c=<slug>&s=<sub>` | Category / sub-category listing with filters and sorting |
| `product.html?p=<slug>` | Product page with the dynamic configurator and artwork step |
| `checkout.html` | Checkout, delivery-vs-collection, order confirmation |
| `artwork-guidelines.html` | Artwork spec, file formats and the in-house design service |
| `track-order.html` | Order tracking for orders placed in the current browser |

## Source layout

```
assets/css/styles.css   Design system and all page styles
assets/js/catalog.js    Product catalogue, company data and the pricing engine
assets/js/art.js        Inline SVG illustration library (no image requests)
assets/js/app.js        Shared shell: header, mega-menu, search, basket, drawer, quote modal
assets/js/home.js       Homepage rendering
assets/js/category.js   Category listing
assets/js/product.js    Product configurator
assets/js/checkout.js   Checkout and confirmation
assets/img/             Logo variants and favicon
```

## How pricing works

Every product in `catalog.js` carries quantity tiers and option groups:

```js
qty: tiers([[100, 15.99], [250, 21.99], ...])
options: [ opt('finish', 'Finish', '', [ c('unlam', 'Unlaminated', 1), c('matt', 'Matt laminated', 1.28) ]) ]
```

`total = tierPrice × ∏(option multipliers)`, plus £15 if the design service is selected.

Each option group contains exactly one choice with a multiplier of `1` — that is the baseline the
tier prices were written against, and it is what `defaultSelection()` picks. The consequence is that
**the advertised "from" price is always reproducible**: "100 Business Cards from £15.99" lands on a
product page showing exactly £15.99. A test in the catalogue's data asserts this for every product.

Prices are shown including VAT at 20%; the ex-VAT figure is derived for display.

### Adding a product

Append an object to `PRODUCTS` in `assets/js/catalog.js` with a `cat`/`sub` matching an existing
category, an `art` key from `assets/js/art.js`, option groups and quantity tiers. It appears in
navigation, search, listings and the configurator automatically. Set `headlineQty` to choose which
tier the "from" price advertises.

## Behaviour notes

- **Basket** persists in `localStorage` (`urprint.basket.v2`) and is shared across pages.
- **Delivery vs collection** is chosen in the basket drawer or at checkout: free local collection,
  UK standard £5.95 (free over £150) or UK express £12.95.
- **Artwork** can be uploaded (file names are listed; nothing is transmitted) or handed to the
  in-house design service for £15.
- **Search** runs client-side over product names, blurbs and specs.

## Deploying

The site is static with no build step, so any host works. For Vercel:

**Dashboard (no CLI):** Vercel → Add New → Project → import `clickworks-uk/urprint` →
Framework Preset **Other** → leave build and output settings empty → Deploy. `vercel.json`
in the repo root already sets the framework to none and adds cache and security headers.

**CLI:**

```bash
npx vercel --prod
```

The production branch is `claude/quirky-hawking-1dmxzr` (the repository's default branch), so
pushes to it redeploy once the project is linked.

## Demonstration limits

This is a front-end storefront. There is no server, so no payment is processed, no artwork file
leaves the browser, no email is sent by the quote form, and order tracking only recognises orders
placed in the same browser. Wiring it to a real backend means replacing the submit handlers in
`checkout.js`, `product.js` (file upload) and the quote form in `app.js`.
