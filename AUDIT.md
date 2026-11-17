# UR Print — technical and commercial audit

Site audited: https://urprint-seven.vercel.app
Date: 17 November 2026

## Read this first

This site is a **front-end prototype**. It is static HTML, CSS and JavaScript
served from Vercel. There is no server, no database, no payment processor and
no email service attached to it.

That has one consequence that outweighs everything else in this document:

> **An order placed on this site today reaches nobody.** The checkout collects
> details, generates a reference like `URP-2026-9540`, shows a confirmation
> screen and clears the basket — entirely inside the customer's browser.
> Nothing is transmitted, stored, charged or emailed. UR Print would never
> learn the order existed.

The same is true of the quote form and the artwork upload. Until a backend
exists, the site is a **brochure and quoting shopfront**, not a shop.

## Status at a glance

| Area | Status |
|---|---|
| Product listings, categories, search | Working |
| Product variations and live pricing | Working |
| Basket and delivery/collection toggle | Working (browser storage only) |
| Checkout form and validation | Working (submits nowhere) |
| Payment processing | **Absent** — no gateway of any kind |
| Order storage | **Absent** |
| Order confirmation email | **Absent** |
| Admin / order management | **Absent** |
| Forms reaching a destination | **Absent** |
| Mobile responsiveness | Fixed and verified, 8 viewports |
| SEO and performance | Fixed and verified, 98–100 Lighthouse |
| Product data accuracy | **Placeholder — see below** |

---

## 1. Ecommerce functionality

Tested end to end in Chromium at 1440 / 1024 / 390px. Fourteen automated
checks pass: mega-menu, search, category listing, sorting, configurator
recalculation, design-service surcharge, artwork upload, basket drawer,
delivery switching, checkout validation, order reference, basket clearing and
quote submission.

**Works**
- 7 categories, 31 products, sub-category filtering and sorting.
- Configurator: size, material, finish, sides, quantity, with live unit and
  total price and per-option price uplifts shown on each control.
- Basket persists across pages in `localStorage`.

**Does not work**
- Order submission. `checkout.js` writes the order to `localStorage` and
  renders a confirmation. No network request is made.
- Order management. There is no admin view because there is nowhere to read
  orders from.
- Order tracking. `track-order.html` only recognises an order placed in the
  same browser.

**Bugs found and fixed during this audit**
- `hidden` was being overridden by author `display:grid` rules, so the
  empty-basket message rendered behind the live checkout form, and the
  product "not found" block rendered behind a live product.
- Breadcrumb structured data repeated the product name when a product and
  its sub-category share a name.

## 2. Payment processing

There is **no payment integration** — no gateway, no SDK, no API call, no test
mode. The card fields on `checkout.html` are plain inputs that are never read.
They are clearly labelled as a demonstration.

Nothing here was enabled or configured, per your instruction. To add payments:

1. UR Print opens a Stripe account and supplies **test-mode** keys.
2. Add Vercel serverless functions: `POST /api/checkout` creates a Stripe
   Checkout Session or PaymentIntent server-side; the secret key never reaches
   the browser.
3. Add `POST /api/webhook` for `payment_intent.succeeded` and
   `payment_intent.payment_failed`. **The webhook, not the browser, must be
   what marks an order paid** — otherwise a closed tab loses the order.
4. Duplicate prevention: send a Stripe idempotency key per attempt and store
   the PaymentIntent id against the order, unique-indexed.
5. Recalculate the price server-side from the product code and options. The
   current prices live in client-side JavaScript and a customer could edit them
   before submitting. **This is the most important rule in the list.**
6. Go live only when UR Print authorises it.

## 3. Order management

Absent in full. A minimum viable implementation needs:

- A datastore (Vercel Postgres, Supabase or similar) holding order reference,
  line items with chosen options, prices, customer contact details, delivery
  or collection choice, address, artwork file references and status.
- Artwork file storage (Vercel Blob or S3). The upload control currently shows
  the filename only — **the file itself is never read or sent**.
- Transactional email (Resend, Postmark) for the customer confirmation and the
  notification to UR Print.
- An authenticated admin page listing incoming orders with status changes.
- Order statuses. The tracking page already displays a five-stage model
  (received, artwork pre-flight, on press, finishing, ready/dispatched) which
  UR Print should confirm matches how they actually work.

## 4. Delivery and collection

The interface works: customers switch between collection and delivery in both
the basket drawer and checkout, address fields appear only for delivery, and
totals update.

**Every figure below was invented for the prototype and needs confirming
before launch:**

| Item | Placeholder value | Needs |
|---|---|---|
| UK standard delivery | £5.95, 2–3 working days | Real price and carrier |
| UK express delivery | £12.95, next working day | Real price and cut-off |
| Free delivery threshold | £150 | Confirm or remove |
| Local collection | Free | Confirm |
| Collection readiness | "we will text you" | Confirm the process exists |
| Per-product turnaround | e.g. "Ready in 2 working days" | Real lead times |
| Delivery area | UK mainland | Confirm exclusions |

No VAT treatment is applied per product. UK printed matter is not uniform
here — leaflets, flyers and booklets are commonly zero-rated while business
cards, stickers and signage are standard-rated. The site currently applies 20%
to everything. **This needs an accountant's confirmation**, and the pricing
engine needs a per-product VAT rate.

## 5. Forms and contact

| Form | Validation | Destination |
|---|---|---|
| Quote / site survey modal | Name, valid email, phone | **None** |
| Checkout | Full field and format validation | **None** |
| Track order | Reference required | Local browser only |
| Newsletter | — | Does not exist |

All forms show clear success and error states, and the quote modal states that
nothing is sent. Wiring them up needs one serverless function plus an email
provider. A newsletter signup can be added if UR Print has a mailing list.

## 6. Mobile responsiveness

Swept 6 pages across 8 viewports from 375px to 1920px, checking for horizontal
overflow, oversized elements and undersized tap targets. **All clean.**

Fixed in this pass:
- The seven-item category bar overflowed between 980px and 1100px
  (tablet portrait). The drawer navigation now takes over below 1100px.
  Horizontal scrolling was not an option: it would clip the mega-menus.
- Cumulative Layout Shift was 0.55 / 1.06 / 0.50 on home / category / product.
  Google's threshold is 0.1. Now 0.00 / 0.00 / 0.01.

## 7. SEO and performance

Lighthouse, mobile emulation, against production:

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 100 | 100 | 100 | 100 |
| Category | 99 | 100 | 100 | 100 |
| Product | 98 | 100 | 100 | 100 |

Added: `robots.txt`; `sitemap.xml` with 72 URLs; canonical URLs including
dynamic ones for category and product pages; Open Graph and Twitter cards with
a generated share image; `apple-touch-icon`; LocalBusiness structured data;
dynamic BreadcrumbList.

Fonts are now self-hosted, which removed about 1.3s of render-blocking
third-party CSS and stopped visitor IP addresses being sent to Google — worth
noting for GDPR.

**Structured data deliberately omitted.** There is no `Product`, `Offer` or
`aggregateRating` markup. Publishing prices or review counts in structured data
that are not real is a Google manual-action risk. Add `Product`/`Offer` once
UR Print confirms real prices, and `aggregateRating` only when it reflects
genuine collected reviews.

Remaining, both minor: JavaScript is unminified (brotli already recovers most
of it; roughly 3KB left), and the homepage DOM is 1,712 elements because the
product illustrations are inline SVG.

**Local SEO** still outstanding: Google Business Profile claimed and matched to
the site NAP, consistent name/address/phone across directories, and a real
domain. Structured data is in place and ready for it.

---

## Placeholder content inventory

Everything below was written for the prototype and is **not** real UR Print
information. It all needs replacing or confirming before launch.

- **All 31 products**: names, descriptions, specifications, option lists and
  turnaround times.
- **All prices**: every quantity tier and every option multiplier.
- **The £15 design service fee.**
- **Delivery prices and thresholds** (see section 4).
- **Body copy**: homepage hero, value propositions, category descriptions,
  the signage section, artwork guidelines and the "since 2009" footer line.
- **Social links** point to `#`.

Removed during this audit, at your request: six customer testimonials, the
Google review score card, the "4.8 stars from 312 businesses" claims, all
per-product star ratings and review counts, all product badges
(Bestseller, Fast turnaround, Premium, Same-day available and the rest), and
the "same-day collection" hero promise.

**Confirmed real** (supplied by you): business name, Unit 1 Ward Street,
Wolverhampton WV1 3LT, 01902 331074, info@urprint.co.uk, and the opening hours
shown in the footer.

## Legal pages still required

The footer links to Delivery & collection, Returns & reprints, and
Privacy & terms — all currently `#`. A UK ecommerce site selling to consumers
needs real ones: terms of sale, privacy policy and cookie information,
delivery and returns policy, and company details including VAT number if
registered.

## Recommended order of work

1. UR Print confirms products, prices, delivery charges and turnaround times.
2. Replace placeholder copy; add the legal pages.
3. Build the order backend: datastore, artwork upload, confirmation emails,
   admin view.
4. Add Stripe in test mode with server-side pricing and webhook confirmation.
5. Buy and connect the real domain; claim the Google Business Profile.
6. Test orders end to end, then authorise live payments.
