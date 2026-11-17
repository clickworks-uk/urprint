/* ==========================================================================
   UR Print — catalogue, pricing engine and company data
   All prices are shown INCLUDING VAT at 20%.
   ========================================================================== */
(function (global) {
  'use strict';

  var COMPANY = {
    name: 'UR Print',
    addressLine: 'Unit 1 Ward Street',
    city: 'Wolverhampton',
    postcode: 'WV1 3LT',
    phone: '01902 331074',
    phoneHref: 'tel:+441902331074',
    email: 'info@urprint.co.uk',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Unit+1+Ward+Street+Wolverhampton+WV1+3LT',
    rating: 4.8,
    reviewCount: 312,
    hours: [
      { d: 'Monday – Friday', h: '8:00am – 6:00pm' },
      { d: 'Saturday', h: '10:00am – 4:00pm' },
      { d: 'Sunday', h: 'Closed', closed: true }
    ],
    vatRate: 0.20
  };

  var DELIVERY = {
    collection: { id: 'collection', label: 'Free local collection', price: 0, eta: 'Ready from Ward Street, Wolverhampton', note: 'Collect from Unit 1 Ward Street, WV1 3LT — we will text you the moment it is boxed.' },
    standard: { id: 'standard', label: 'UK standard courier', price: 5.95, eta: '2–3 working days after proof approval', note: 'Tracked DPD delivery to any UK mainland address.' },
    express: { id: 'express', label: 'UK express courier', price: 12.95, eta: 'Next working day after proof approval', note: 'Order before 11am for next-day dispatch on most products.' }
  };
  var FREE_DELIVERY_THRESHOLD = 150;
  var DESIGN_SERVICE_FEE = 15;

  /* ---------------------------------------------------------------- helpers */
  function opt(key, label, help, choices, help2) {
    return { key: key, label: label, help: help || '', choices: choices, note: help2 || '' };
  }
  function c(v, label, mult, note) { return { v: v, label: label, mult: mult === undefined ? 1 : mult, note: note || '' }; }
  function tiers(list) { // [[qty, price], ...]
    return list.map(function (t) { return { q: t[0], price: t[1] }; });
  }

  var SIDES = opt('sides', 'Printed sides', '', [
    c('single', 'Single sided', 1),
    c('double', 'Double sided', 1.18, 'Most popular')
  ]);

  /* -------------------------------------------------------------- categories */
  var CATEGORIES = [
    {
      slug: 'business-cards', name: 'Business Cards', art: 'business-cards',
      tagline: 'Premium stocks, laminates and finishes — printed in Wolverhampton.',
      blurb: 'From everyday 400gsm silk cards to velvet soft-touch and raised spot UV, every card is printed, guillotined and checked in-house at Ward Street.',
      subs: [
        { slug: 'standard', name: 'Standard' },
        { slug: 'matt-laminated', name: 'Matt Laminated' },
        { slug: 'soft-touch', name: 'Velvet / Soft-Touch' },
        { slug: 'rounded-corner', name: 'Rounded Corner' },
        { slug: 'spot-uv', name: 'Spot UV' }
      ],
      promo: { badge: 'Bestseller', title: '500 Matt Laminated Cards', text: 'Scuff-resistant matt lamination on 400gsm silk — from £32.99 incl. VAT.', art: 'matt-lam', href: 'product.html?p=matt-laminated-business-cards' }
    },
    {
      slug: 'flyers-leaflets', name: 'Flyers & Leaflets', art: 'flyers',
      tagline: 'Litho and digital short runs, folded leaflets, menus and brochures.',
      blurb: 'Leaflet drops, menu reprints, exhibition handouts and stitched brochures — on 130gsm gloss through to 350gsm uncoated.',
      subs: [
        { slug: 'flat-flyers', name: 'Flat Flyers' },
        { slug: 'folded-leaflets', headlineQty: 500, name: 'Folded Leaflets' },
        { slug: 'menus', name: 'Menus' },
        { slug: 'postcards', name: 'Postcards' },
        { slug: 'booklets', name: 'Booklets & Brochures' }
      ],
      promo: { badge: 'Fast turnaround', title: '1000 A5 Flyers', text: 'Full colour, double sided, 170gsm gloss — from £29.99 incl. VAT.', art: 'flyers', href: 'product.html?p=a5-flyers' }
    },
    {
      slug: 'signs-shop-fronts', name: 'Signs & Shop Fronts', art: 'signs',
      tagline: 'Fascia signs, window graphics and rigid boards, surveyed and fitted.',
      blurb: 'We measure, manufacture and install shop fronts across Wolverhampton and the West Midlands — built from aluminium tray, acrylic, Foamex and Correx.',
      subs: [
        { slug: 'fascia', name: 'Shop Fascia Signs' },
        { slug: 'window-graphics', name: 'Window Graphics & Decals' },
        { slug: 'rigid-boards', name: 'Foamex & Correx Boards' },
        { slug: 'a-boards', name: 'A-Boards' }
      ],
      promo: { badge: 'Free site survey', title: 'Shop front signage', text: 'Survey, design visual, manufacture and fit — all from one Wolverhampton unit.', art: 'signs', href: '#quote' }
    },
    {
      slug: 'banners-displays', name: 'Banners & Displays', art: 'banners',
      tagline: 'PVC, mesh and roller banners ready for collection the same week.',
      blurb: '510gsm PVC with welded hems and brass eyelets, pull-up stands with printed cassette graphics, and modular exhibition walls.',
      subs: [
        { slug: 'pvc-banners', name: 'PVC Vinyl Banners' },
        { slug: 'roller-banners', headlineQty: 1, name: 'Roller / Pull-Up Banners' },
        { slug: 'mesh-banners', name: 'Mesh Banners' },
        { slug: 'event-displays', name: 'Event Displays' }
      ],
      promo: { badge: 'Same-day available', title: '850mm Roller Banner', text: 'Printed, assembled and collected the same day — from £39.99 incl. VAT.', art: 'roller-banner', href: 'product.html?p=roller-banners' }
    },
    {
      slug: 'stickers-labels', name: 'Stickers & Labels', art: 'stickers',
      tagline: 'Die-cut shapes, label rolls, product labels and vehicle graphics.',
      blurb: 'Printed on monomeric and cast vinyl, kiss-cut to any contour, with laminate options for outdoor, freezer and dishwasher use.',
      subs: [
        { slug: 'die-cut', name: 'Custom Die-Cut Stickers' },
        { slug: 'sticker-rolls', name: 'Sticker Rolls' },
        { slug: 'product-labels', name: 'Product Labels' },
        { slug: 'vehicle-graphics', name: 'Vehicle Graphics' }
      ],
      promo: { badge: 'Bestseller', title: 'Die-cut vinyl stickers', text: 'Any shape, weatherproof laminate — 250 from £34.99 incl. VAT.', art: 'die-cut', href: 'product.html?p=die-cut-stickers' }
    },
    {
      slug: 'workwear-promo', name: 'Workwear & Promo', art: 'workwear',
      tagline: 'DTF printing and embroidery on garments, plus branded promo items.',
      blurb: 'Teamwear, site workwear and giveaway merchandise — printed or stitched in-house with no minimum order on most garments.',
      subs: [
        { slug: 't-shirts', name: 'Printed T-Shirts' },
        { slug: 'polo-shirts', name: 'Embroidered Polo Shirts' },
        { slug: 'hoodies', name: 'Hoodies' },
        { slug: 'hi-vis', name: 'Hi-Vis Workwear' },
        { slug: 'promo', name: 'Tote Bags & Mugs' }
      ],
      promo: { badge: 'No minimum order', title: 'Embroidered polos', text: 'Digitised logo setup included on orders of 10+ garments.', art: 'polo', href: 'product.html?p=embroidered-polo-shirts' }
    },
    {
      slug: 'stationery-packaging', name: 'Stationery & Packaging', art: 'stationery',
      tagline: 'Letterheads, comp slips, NCR pads and branded boxes.',
      blurb: 'Keep every touchpoint on-brand — matching business stationery sets and short-run printed packaging.',
      subs: [
        { slug: 'letterheads', name: 'Letterheads' },
        { slug: 'comp-slips', name: 'Compliment Slips' },
        { slug: 'ncr-pads', name: 'NCR Invoice Pads' },
        { slug: 'boxes', name: 'Branded Boxes' }
      ],
      promo: { badge: 'Trade accounts', title: 'Business stationery set', text: 'Letterheads, comp slips and cards printed to match, billed monthly.', art: 'letterhead', href: 'category.html?c=stationery-packaging' }
    }
  ];

  /* ---------------------------------------------------------------- products */
  var PRODUCTS = [

    /* ---------------------------------------------- 1. BUSINESS CARDS ------ */
    {
      slug: 'standard-business-cards', headlineQty: 100, name: 'Standard Business Cards', cat: 'business-cards', sub: 'standard',
      art: 'business-cards', badges: ['Bestseller'], rating: 4.9, reviews: 184, unit: 'card',
      blurb: 'Full colour on 400gsm silk board — the everyday workhorse card.',
      turnaround: 'Ready in 2 working days',
      specs: ['400gsm silk or uncoated board', 'Full colour litho/digital print', 'Guillotined to ±0.5mm', 'Free artwork pre-flight check'],
      options: [
        opt('size', 'Size', '', [
          c('85x55', '85 × 55mm (UK standard)', 1),
          c('90x50', '90 × 50mm (European)', 1),
          c('85x55sq', '55 × 55mm (Square)', 1.12)
        ]),
        opt('material', 'Paper weight / material', 'Thicker stocks feel more substantial in the hand.', [
          c('350silk', '350gsm Silk', 0.92),
          c('400silk', '400gsm Silk', 1, 'Recommended'),
          c('400uncoated', '400gsm Uncoated (writeable)', 1.06),
          c('540ultra', '540gsm Ultra Thick', 1.45)
        ]),
        opt('finish', 'Finish', '', [
          c('unlam', 'Unlaminated', 1),
          c('gloss', 'Gloss laminated', 1.22),
          c('matt', 'Matt laminated', 1.28)
        ]),
        SIDES
      ],
      qty: tiers([[100, 15.99], [250, 21.99], [500, 29.99], [1000, 44.99], [2500, 89.99], [5000, 149.99]])
    },
    {
      slug: 'matt-laminated-business-cards', headlineQty: 500, name: 'Matt Laminated Business Cards', cat: 'business-cards', sub: 'matt-laminated',
      art: 'matt-lam', badges: ['Bestseller'], rating: 4.9, reviews: 142, unit: 'card',
      blurb: 'Scuff-resistant matt film on both sides — deep, modern and fingerprint-friendly.',
      turnaround: 'Ready in 2–3 working days',
      specs: ['400gsm silk with matt lamination', 'Resists scuffing and creasing', 'Rich, non-reflective blacks', 'Pairs with spot UV for contrast'],
      options: [
        opt('size', 'Size', '', [c('85x55', '85 × 55mm (UK standard)', 1), c('90x50', '90 × 50mm (European)', 1), c('85x55sq', '55 × 55mm (Square)', 1.12)]),
        opt('material', 'Paper weight / material', '', [c('400silk', '400gsm Silk', 1, 'Recommended'), c('450silk', '450gsm Silk', 1.14), c('540ultra', '540gsm Ultra Thick', 1.42)]),
        opt('finish', 'Lamination', '', [c('matt1', 'Matt — single sided', 0.92), c('matt2', 'Matt — both sides', 1, 'Recommended'), c('softmatt', 'Matt + soft-touch top coat', 1.34)]),
        SIDES
      ],
      qty: tiers([[100, 19.99], [250, 26.99], [500, 32.99], [1000, 52.99], [2500, 104.99], [5000, 174.99]])
    },
    {
      slug: 'soft-touch-business-cards', name: 'Velvet Soft-Touch Business Cards', cat: 'business-cards', sub: 'soft-touch',
      art: 'soft-touch', badges: ['Premium'], rating: 5.0, reviews: 76, unit: 'card',
      blurb: 'A suede-like velvet laminate that makes people hold on to the card.',
      turnaround: 'Ready in 3 working days',
      specs: ['450gsm board with velvet laminate', 'Peach-skin tactile finish', 'Optional raised spot UV', 'Ideal for studios, salons and consultants'],
      options: [
        opt('size', 'Size', '', [c('85x55', '85 × 55mm (UK standard)', 1), c('85x55sq', '55 × 55mm (Square)', 1.12)]),
        opt('material', 'Paper weight / material', '', [c('450silk', '450gsm Silk', 1), c('540ultra', '540gsm Ultra Thick', 1.3), c('700duplex', '700gsm Duplex with colour core', 1.78)]),
        opt('finish', 'Finish', '', [c('velvet', 'Velvet soft-touch', 1), c('velvetuv', 'Velvet + raised spot UV', 1.46), c('velvetfoil', 'Velvet + gold foil', 1.68)]),
        SIDES
      ],
      qty: tiers([[100, 29.99], [250, 42.99], [500, 59.99], [1000, 94.99], [2500, 199.99]])
    },
    {
      slug: 'rounded-corner-business-cards', name: 'Rounded Corner Business Cards', cat: 'business-cards', sub: 'rounded-corner',
      art: 'rounded-corner', badges: [], rating: 4.8, reviews: 61, unit: 'card',
      blurb: 'Die-cut 3mm or 6mm radius corners — softer in the pocket, harder to ignore.',
      turnaround: 'Ready in 3 working days',
      specs: ['Precision die-cut corners', '400gsm silk as standard', 'Choose 3mm or 6mm radius', 'Laminate recommended for durability'],
      options: [
        opt('size', 'Size', '', [c('85x55', '85 × 55mm (UK standard)', 1), c('90x50', '90 × 50mm (European)', 1)]),
        opt('radius', 'Corner radius', '', [c('3mm', '3mm radius', 1), c('6mm', '6mm radius', 1.04)]),
        opt('material', 'Paper weight / material', '', [c('400silk', '400gsm Silk', 1), c('450silk', '450gsm Silk', 1.12), c('540ultra', '540gsm Ultra Thick', 1.4)]),
        opt('finish', 'Finish', '', [c('unlam', 'Unlaminated', 0.9), c('matt', 'Matt laminated', 1), c('gloss', 'Gloss laminated', 0.98)]),
        SIDES
      ],
      qty: tiers([[100, 24.99], [250, 32.99], [500, 44.99], [1000, 69.99], [2500, 144.99]])
    },
    {
      slug: 'spot-uv-business-cards', name: 'Spot UV Business Cards', cat: 'business-cards', sub: 'spot-uv',
      art: 'spot-uv', badges: ['Premium'], rating: 4.9, reviews: 53, unit: 'card',
      blurb: 'Raised, high-gloss varnish on a matt base — logos that catch the light.',
      turnaround: 'Ready in 3–4 working days',
      specs: ['Raised UV varnish to 30 micron', 'Matt laminated base stock', 'Single or double sided UV', 'Supply a separate 100% K spot layer'],
      options: [
        opt('size', 'Size', '', [c('85x55', '85 × 55mm (UK standard)', 1), c('85x55sq', '55 × 55mm (Square)', 1.12)]),
        opt('material', 'Paper weight / material', '', [c('400silk', '400gsm Silk', 1), c('450silk', '450gsm Silk', 1.1), c('540ultra', '540gsm Ultra Thick', 1.38)]),
        opt('finish', 'Spot UV coverage', '', [c('uv1', 'Spot UV — front only', 1), c('uv2', 'Spot UV — both sides', 1.3), c('uvfoil', 'Spot UV + metallic foil', 1.62)]),
        SIDES
      ],
      qty: tiers([[100, 39.99], [250, 54.99], [500, 74.99], [1000, 119.99], [2500, 249.99]])
    },

    /* ------------------------------------------- 2. FLYERS & LEAFLETS ------ */
    {
      slug: 'a5-flyers', headlineQty: 1000, name: 'A5 Flyers', cat: 'flyers-leaflets', sub: 'flat-flyers',
      art: 'flyers', badges: ['Bestseller', 'Fast turnaround'], rating: 4.8, reviews: 203, unit: 'flyer',
      blurb: 'Full colour flat flyers on gloss, silk or uncoated — ideal for leaflet drops.',
      turnaround: 'Ready in 2 working days',
      specs: ['130–400gsm stocks', 'Full bleed, trimmed to size', 'Litho printed above 2,500', 'Bulk leaflet distribution available'],
      options: [
        opt('size', 'Size', '', [
          c('a7', 'A7 (74 × 105mm)', 0.52), c('a6', 'A6 (105 × 148mm)', 0.68),
          c('a5', 'A5 (148 × 210mm)', 1, 'Most popular'), c('a4', 'A4 (210 × 297mm)', 1.68),
          c('dl', 'DL (99 × 210mm)', 0.84), c('a3', 'A3 (297 × 420mm)', 2.9)
        ]),
        opt('material', 'Paper weight / material', '', [
          c('130gloss', '130gsm Gloss', 0.88), c('170gloss', '170gsm Gloss', 1, 'Recommended'),
          c('170silk', '170gsm Silk', 1.02), c('250silk', '250gsm Silk', 1.34), c('300uncoated', '300gsm Uncoated', 1.58)
        ]),
        opt('finish', 'Finish', '', [c('unlam', 'Unlaminated', 1), c('gloss', 'Gloss laminated', 1.42), c('matt', 'Matt laminated', 1.48)]),
        SIDES
      ],
      qty: tiers([[250, 16.99], [500, 21.99], [1000, 29.99], [2500, 54.99], [5000, 89.99], [10000, 159.99]])
    },
    {
      slug: 'folded-leaflets', name: 'Folded Leaflets', cat: 'flyers-leaflets', sub: 'folded-leaflets',
      art: 'folded-leaflet', badges: [], rating: 4.7, reviews: 88, unit: 'leaflet',
      blurb: 'Creased and machine-folded — tri-fold, half-fold, Z-fold and roll-fold.',
      turnaround: 'Ready in 3 working days',
      specs: ['Creased before folding to avoid cracking', 'Up to 300gsm folded stock', 'Tri-fold, Z-fold, half or roll fold', 'Supplied flat-packed in boxes'],
      options: [
        opt('size', 'Flat size', '', [c('a4a5', 'A4 folded to A5', 1), c('a4dl', 'A4 folded to DL', 1.04), c('a3a4', 'A3 folded to A4', 1.86), c('a5a6', 'A5 folded to A6', 0.74)]),
        opt('fold', 'Fold type', '', [c('half', 'Half fold', 1), c('tri', 'Tri-fold (letter)', 1.08), c('z', 'Z-fold', 1.08), c('roll', 'Roll fold (4pp)', 1.22)]),
        opt('material', 'Paper weight / material', '', [c('130gloss', '130gsm Gloss', 0.9), c('170silk', '170gsm Silk', 1), c('250silk', '250gsm Silk', 1.36), c('300uncoated', '300gsm Uncoated', 1.6)]),
        SIDES
      ],
      qty: tiers([[250, 34.99], [500, 44.99], [1000, 64.99], [2500, 109.99], [5000, 184.99]])
    },
    {
      slug: 'takeaway-menus', headlineQty: 500, name: 'Takeaway Menus', cat: 'flyers-leaflets', sub: 'menus',
      art: 'menu', badges: ['Fast turnaround'], rating: 4.8, reviews: 97, unit: 'menu',
      blurb: 'Wipe-clean laminated menus and letterbox takeaway leaflets.',
      turnaround: 'Ready in 2–3 working days',
      specs: ['Gloss or matt encapsulation available', 'A4, A3 and DL letterbox sizes', 'Reprints kept on file for 24 months', 'Free delivery across Wolverhampton'],
      options: [
        opt('size', 'Size', '', [c('dl', 'DL letterbox (99 × 210mm)', 0.82), c('a5', 'A5 (148 × 210mm)', 1), c('a4', 'A4 (210 × 297mm)', 1.62), c('a3', 'A3 folded to A4', 2.74)]),
        opt('material', 'Paper weight / material', '', [c('130gloss', '130gsm Gloss', 0.88), c('170gloss', '170gsm Gloss', 1), c('250silk', '250gsm Silk', 1.38), c('350silk', '350gsm Silk', 1.72)]),
        opt('finish', 'Finish', '', [c('unlam', 'Unlaminated', 1), c('gloss', 'Gloss laminated', 1.44), c('wipe', 'Wipe-clean encapsulated', 1.95)]),
        SIDES
      ],
      qty: tiers([[250, 24.99], [500, 34.99], [1000, 49.99], [2500, 89.99], [5000, 149.99]])
    },
    {
      slug: 'postcards', name: 'Printed Postcards', cat: 'flyers-leaflets', sub: 'postcards',
      art: 'postcard', badges: [], rating: 4.7, reviews: 54, unit: 'postcard',
      blurb: 'Heavy card postcards for direct mail, loyalty schemes and thank-you notes.',
      turnaround: 'Ready in 2–3 working days',
      specs: ['350–400gsm card as standard', 'Uncoated reverse for handwriting', 'Royal Mail mailing sizes', 'Address data mail-merge available'],
      options: [
        opt('size', 'Size', '', [c('a6', 'A6 (105 × 148mm)', 1), c('a5', 'A5 (148 × 210mm)', 1.52), c('dl', 'DL (99 × 210mm)', 1.22)]),
        opt('material', 'Paper weight / material', '', [c('350silk', '350gsm Silk', 1), c('400silk', '400gsm Silk', 1.14), c('400uncoated', '400gsm Uncoated', 1.2)]),
        opt('finish', 'Finish', '', [c('unlam', 'Unlaminated', 1), c('matt', 'Matt laminated front', 1.3), c('gloss', 'Gloss laminated front', 1.26)]),
        SIDES
      ],
      qty: tiers([[100, 24.99], [250, 32.99], [500, 44.99], [1000, 69.99], [2500, 134.99]])
    },
    {
      slug: 'booklets-brochures', name: 'Booklets & Brochures', cat: 'flyers-leaflets', sub: 'booklets',
      art: 'booklet', badges: [], rating: 4.9, reviews: 42, unit: 'booklet',
      blurb: 'Saddle-stitched or wiro-bound, 8 to 64 pages, printed and finished in-house.',
      turnaround: 'Ready in 4–5 working days',
      specs: ['Saddle stitch, wiro or perfect bound', 'Separate cover stock available', 'Page counts in multiples of 4', 'Digital proof before production'],
      options: [
        opt('size', 'Size', '', [c('a5', 'A5 (148 × 210mm)', 1), c('a4', 'A4 (210 × 297mm)', 1.74), c('sq210', '210 × 210mm Square', 1.42)]),
        opt('pages', 'Page count', 'Covers plus inner pages, in multiples of 4.', [c('8', '8pp', 1), c('16', '16pp', 1.68), c('24', '24pp', 2.3), c('32', '32pp', 2.88), c('48', '48pp', 4.1)]),
        opt('material', 'Inner paper', '', [c('130silk', '130gsm Silk', 1), c('170silk', '170gsm Silk', 1.18), c('150uncoated', '150gsm Uncoated', 1.22)]),
        opt('binding', 'Binding', '', [c('saddle', 'Saddle stitched', 1), c('wiro', 'Wiro bound', 1.34), c('perfect', 'Perfect bound', 1.52)])
      ],
      qty: tiers([[50, 109.99], [100, 164.99], [250, 319.99], [500, 549.99], [1000, 949.99]])
    },

    /* ------------------------------------------ 3. SIGNS & SHOP FRONTS ----- */
    {
      slug: 'shop-fascia-signs', name: 'Shop Fascia Signs', cat: 'signs-shop-fronts', sub: 'fascia',
      art: 'signs', badges: ['Free site survey'], rating: 5.0, reviews: 68, unit: 'sign',
      blurb: 'Aluminium tray and flat panel fascias, built, delivered and fitted by our team.',
      turnaround: 'Survey to fit: 7–10 working days',
      specs: ['3mm aluminium composite or tray', 'Optional LED halo or trough lighting', 'Survey, manufacture and installation', 'Covered by our 3-year outdoor warranty'],
      priceNote: 'Price shown is an indicative supply-only price. Book a free survey for a fixed fitted quote.',
      options: [
        opt('size', 'Fascia size', 'Measured width of the sign board.', [
          c('2m', 'Up to 2m wide', 1), c('3m', '2 – 3m wide', 1.42),
          c('4m', '3 – 4m wide', 1.84), c('6m', '4 – 6m wide', 2.6), c('custom', 'Over 6m / multiple elevations', 3.4)
        ]),
        opt('material', 'Panel material', '', [
          c('acm', '3mm Aluminium composite (flat panel)', 1),
          c('tray', 'Powder-coated aluminium tray', 1.55),
          c('acrylic', 'Acrylic face with vinyl graphics', 1.34)
        ]),
        opt('finish', 'Lettering & lighting', '', [
          c('vinyl', 'Cut vinyl lettering', 1),
          c('raised', 'Raised acrylic lettering', 1.48),
          c('trough', 'Raised lettering + LED trough lights', 1.92),
          c('halo', 'Built-up halo-illuminated letters', 2.65)
        ]),
        opt('install', 'Installation', '', [c('supply', 'Supply only (collection)', 1), c('fitted', 'Supplied and fitted by UR Print', 1.38, 'West Midlands')])
      ],
      qty: tiers([[1, 249.0], [2, 459.0], [3, 639.0], [5, 989.0]])
    },
    {
      slug: 'window-graphics', name: 'Window Graphics & Decals', cat: 'signs-shop-fronts', sub: 'window-graphics',
      art: 'window-graphics', badges: [], rating: 4.9, reviews: 74, unit: 'm²',
      blurb: 'Frosted manifestation, cut vinyl lettering and full-colour window wraps.',
      turnaround: 'Ready in 3–4 working days',
      specs: ['Cast or monomeric vinyl', 'Frosted, one-way vision or solid colour', 'Application tape supplied free', 'Fitting available across the West Midlands'],
      options: [
        opt('size', 'Coverage', 'Total printed area across all windows.', [
          c('1', 'Up to 1m²', 1), c('3', '1 – 3m²', 2.4), c('6', '3 – 6m²', 4.3), c('10', '6 – 10m²', 6.6), c('custom', 'Over 10m²', 9.5)
        ]),
        opt('material', 'Vinyl type', '', [
          c('mono', 'Monomeric vinyl (up to 3 years)', 1),
          c('cast', 'Cast vinyl (up to 7 years)', 1.38),
          c('frost', 'Frosted etch-effect film', 1.24),
          c('onewayvision', 'One-way vision perforated', 1.46)
        ]),
        opt('finish', 'Cut & finish', '', [c('contour', 'Contour cut graphics', 1), c('lettering', 'Cut lettering only', 0.86), c('printlam', 'Printed + laminated panel', 1.22)]),
        opt('install', 'Installation', '', [c('supply', 'Supply only', 1), c('fitted', 'Fitted by UR Print', 1.45)])
      ],
      qty: tiers([[1, 64.99], [2, 119.99], [4, 219.99], [8, 399.99]])
    },
    {
      slug: 'foamex-correx-boards', headlineQty: 1, name: 'Foamex & Correx Boards', cat: 'signs-shop-fronts', sub: 'rigid-boards',
      art: 'foamex', badges: ['Fast turnaround'], rating: 4.8, reviews: 91, unit: 'board',
      blurb: 'Rigid printed boards for site hoardings, estate agents and safety signage.',
      turnaround: 'Ready in 2–3 working days',
      specs: ['3mm & 5mm Foamex PVC, 4mm Correx', 'Direct-to-substrate UV printing', 'Drilled holes or stake slots free', 'Weatherproof for 3+ years outdoors'],
      options: [
        opt('size', 'Board size', '', [
          c('a2', 'A2 (420 × 594mm)', 0.6), c('a1', 'A1 (594 × 841mm)', 1),
          c('a0', 'A0 (841 × 1189mm)', 1.78), c('1200', '1200 × 800mm', 1.62), c('2400', '2400 × 1200mm', 3.4)
        ]),
        opt('material', 'Material', '', [
          c('correx4', '4mm Correx (temporary)', 0.72),
          c('foamex3', '3mm Foamex PVC', 1),
          c('foamex5', '5mm Foamex PVC', 1.24),
          c('dibond', '3mm Dibond aluminium', 1.95)
        ]),
        opt('finish', 'Finishing', '', [c('none', 'Trimmed to size', 1), c('holes', 'Drilled corner holes', 1.04), c('stake', 'With ground stake', 1.18), c('lam', 'Anti-graffiti laminate', 1.3)]),
        SIDES
      ],
      qty: tiers([[1, 29.99], [2, 54.99], [5, 119.99], [10, 219.99], [25, 489.99]])
    },
    {
      slug: 'a-boards', name: 'Pavement A-Boards', cat: 'signs-shop-fronts', sub: 'a-boards',
      art: 'a-board', badges: [], rating: 4.7, reviews: 46, unit: 'board',
      blurb: 'Water-base and swing-frame pavement signs with printed panels.',
      turnaround: 'Ready in 3 working days',
      specs: ['Water or sand weighted base', 'Swing or snap frame options', 'Replacement panels available', 'Wind-resistant for high streets'],
      options: [
        opt('size', 'Frame size', '', [c('a2', 'A2 panel', 1), c('a1', 'A1 panel', 1.28), c('a0', 'A0 panel', 1.72)]),
        opt('material', 'Frame type', '', [c('water', 'Water-base swing sign', 1), c('snap', 'Aluminium snap frame A-board', 1.22), c('chalk', 'Wooden chalkboard A-board', 1.18)]),
        opt('finish', 'Panel finish', '', [c('single', 'Printed one panel', 0.88), c('double', 'Printed both panels', 1), c('spare', 'Both panels + spare set', 1.4)])
      ],
      qty: tiers([[1, 89.99], [2, 164.99], [5, 389.99], [10, 729.99]])
    },

    /* ------------------------------------------ 4. BANNERS & DISPLAYS ------ */
    {
      slug: 'pvc-vinyl-banners', headlineQty: 1, name: 'PVC Vinyl Banners', cat: 'banners-displays', sub: 'pvc-banners',
      art: 'pvc-banner', badges: ['Bestseller'], rating: 4.9, reviews: 156, unit: 'banner',
      blurb: '510gsm PVC with welded hems and brass eyelets — built to survive a British winter.',
      turnaround: 'Ready in 1–2 working days',
      specs: ['440gsm or 510gsm PVC', 'Welded hems, brass eyelets every 500mm', 'UV-stable inks, 3+ years outdoors', 'Rope and cable ties available'],
      options: [
        opt('size', 'Banner size', '', [
          c('1x05', '1m × 0.5m', 0.62), c('2x1', '2m × 1m', 1, 'Most popular'),
          c('3x1', '3m × 1m', 1.42), c('4x1', '4m × 1m', 1.84), c('6x1', '6m × 1m', 2.68), c('custom', 'Custom size', 1.6)
        ]),
        opt('material', 'Material', '', [c('440', '440gsm PVC', 0.86), c('510', '510gsm PVC', 1), c('blockout', '650gsm Blockout PVC', 1.36)]),
        opt('finish', 'Finishing', '', [c('hemeye', 'Hemmed + eyelets', 1), c('pole', 'Pole pockets top & bottom', 1.14), c('rope', 'Hems, eyelets + rope', 1.1)]),
        SIDES
      ],
      qty: tiers([[1, 24.99], [2, 44.99], [3, 62.99], [5, 99.99], [10, 184.99]])
    },
    {
      slug: 'roller-banners', name: 'Roller / Pull-Up Banners', cat: 'banners-displays', sub: 'roller-banners',
      art: 'roller-banner', badges: ['Bestseller', 'Same-day available'], rating: 4.9, reviews: 211, unit: 'banner',
      blurb: 'Printed graphic, cassette, pole and padded bag — assembled and ready to collect.',
      turnaround: 'Same-day collection available',
      specs: ['Anti-curl 220 micron display film', 'Aluminium cassette with 3-piece pole', 'Padded carry bag included', 'Replacement graphics available'],
      options: [
        opt('size', 'Banner size', '', [
          c('800', '800mm × 2000mm', 0.94), c('850', '850mm × 2000mm', 1, 'Standard'),
          c('1000', '1000mm × 2000mm', 1.18), c('1200', '1200mm × 2000mm', 1.42)
        ]),
        opt('material', 'Cassette grade', '', [
          c('eco', 'Economy cassette', 1), c('premium', 'Premium wide-base cassette', 1.38), c('doubleside', 'Double-sided cassette', 1.92)
        ]),
        opt('finish', 'Graphic finish', '', [c('matt', 'Matt anti-glare film', 1), c('gloss', 'Gloss film', 0.98), c('lam', 'Laminated for heavy use', 1.22)])
      ],
      qty: tiers([[1, 39.99], [2, 74.99], [3, 104.99], [5, 164.99], [10, 309.99]])
    },
    {
      slug: 'mesh-banners', name: 'Mesh Banners', cat: 'banners-displays', sub: 'mesh-banners',
      art: 'mesh-banner', badges: [], rating: 4.8, reviews: 37, unit: 'banner',
      blurb: 'Wind-permeable mesh for scaffolding, fencing and exposed building frontages.',
      turnaround: 'Ready in 2–3 working days',
      specs: ['370gsm printed mesh', '70/30 wind permeability', 'Reinforced hems and eyelets', 'Fire-retardant option available'],
      options: [
        opt('size', 'Banner size', '', [c('2x1', '2m × 1m', 1), c('3x2', '3m × 2m', 2.3), c('6x3', '6m × 3m', 5.8), c('custom', 'Custom / scaffold wrap', 4.2)]),
        opt('material', 'Mesh type', '', [c('370', '370gsm standard mesh', 1), c('fr', 'Fire-retardant mesh (B1)', 1.3), c('heavy', '450gsm heavy-duty mesh', 1.22)]),
        opt('finish', 'Finishing', '', [c('hemeye', 'Hems + eyelets every 500mm', 1), c('pocket', 'Pole pockets', 1.12), c('bungee', 'Eyelets + bungee kit', 1.2)])
      ],
      qty: tiers([[1, 54.99], [2, 99.99], [3, 142.99], [5, 229.99]])
    },
    {
      slug: 'event-displays', name: 'Event Display Stands', cat: 'banners-displays', sub: 'event-displays',
      art: 'event-display', badges: [], rating: 4.8, reviews: 29, unit: 'stand',
      blurb: 'Pop-up walls, fabric backdrops and counters for exhibitions and open days.',
      turnaround: 'Ready in 5 working days',
      specs: ['Straight or curved pop-up frames', 'Tension fabric or panel graphics', 'Wheeled case with counter wrap', 'Graphics replaceable season to season'],
      options: [
        opt('size', 'Display size', '', [c('3x3', '3 × 3 (2.2m wide)', 1), c('3x4', '3 × 4 (3m wide)', 1.34), c('3x5', '3 × 5 (3.8m wide)', 1.7)]),
        opt('material', 'Display type', '', [c('popup', 'Panel pop-up wall', 1), c('fabric', 'Tension fabric backdrop', 1.16), c('fabriccounter', 'Fabric wall + printed counter', 1.56)]),
        opt('finish', 'Case & extras', '', [c('bag', 'Carry bag', 1), c('case', 'Wheeled case', 1.14), c('casewrap', 'Wheeled case + counter wrap', 1.26)])
      ],
      qty: tiers([[1, 449.0], [2, 849.0], [3, 1199.0]])
    },

    /* -------------------------------------------- 5. STICKERS & LABELS ----- */
    {
      slug: 'die-cut-stickers', headlineQty: 250, name: 'Custom Die-Cut Stickers', cat: 'stickers-labels', sub: 'die-cut',
      art: 'die-cut', badges: ['Bestseller'], rating: 4.9, reviews: 168, unit: 'sticker',
      blurb: 'Contour-cut to any shape, on weatherproof vinyl with optional laminate.',
      turnaround: 'Ready in 2–3 working days',
      specs: ['Printed on white or clear vinyl', 'Cut to your exact outline', 'Dishwasher and outdoor safe with laminate', 'Supplied kiss-cut on sheets or singles'],
      options: [
        opt('size', 'Size (longest edge)', '', [
          c('30', 'Up to 30mm', 0.6), c('50', 'Up to 50mm', 0.8), c('75', 'Up to 75mm', 1),
          c('100', 'Up to 100mm', 1.32), c('150', 'Up to 150mm', 1.9), c('custom', 'Over 150mm', 2.6)
        ]),
        opt('material', 'Material', '', [
          c('white', 'White vinyl', 1), c('clear', 'Clear vinyl', 1.12),
          c('holo', 'Holographic vinyl', 1.48), c('paper', 'Paper label (indoor)', 0.78)
        ]),
        opt('finish', 'Finish', '', [c('gloss', 'Gloss laminate', 1), c('matt', 'Matt laminate', 1.04), c('none', 'No laminate', 0.88)]),
        opt('cut', 'Cut style', '', [c('kiss', 'Kiss-cut on sheets', 1), c('single', 'Cut to single stickers', 1.1), c('transfer', 'Transfer tape applied', 1.24)])
      ],
      qty: tiers([[50, 19.99], [100, 24.99], [250, 34.99], [500, 54.99], [1000, 89.99], [2500, 184.99]])
    },
    {
      slug: 'sticker-rolls', name: 'Sticker Rolls', cat: 'stickers-labels', sub: 'sticker-rolls',
      art: 'sticker-roll', badges: [], rating: 4.8, reviews: 52, unit: 'label',
      blurb: 'Roll-fed labels for packing benches, applicators and high-volume dispatch.',
      turnaround: 'Ready in 4 working days',
      specs: ['76mm or 25mm core', 'Wound out or wound in', 'Up to 5,000 labels per roll', 'Gap or black-mark sensing available'],
      options: [
        opt('size', 'Label size', '', [c('40', '40 × 40mm', 0.82), c('51', '51 × 51mm', 1), c('76', '76 × 51mm', 1.24), c('100', '100 × 70mm', 1.62)]),
        opt('material', 'Material', '', [c('gloss', 'Gloss paper', 1), c('matt', 'Matt paper', 1), c('vinyl', 'White vinyl (waterproof)', 1.32), c('clear', 'Clear vinyl', 1.4)]),
        opt('finish', 'Core & winding', '', [c('76out', '76mm core, wound out', 1), c('76in', '76mm core, wound in', 1), c('25', '25mm core (hand use)', 0.96)])
      ],
      qty: tiers([[250, 34.99], [500, 49.99], [1000, 74.99], [2500, 139.99], [5000, 229.99]])
    },
    {
      slug: 'product-labels', name: 'Product Labels', cat: 'stickers-labels', sub: 'product-labels',
      art: 'product-label', badges: [], rating: 4.9, reviews: 64, unit: 'label',
      blurb: 'Food, drink and cosmetic labels with laminates rated for fridge and freezer.',
      turnaround: 'Ready in 3–4 working days',
      specs: ['Food-safe adhesives', 'Freezer and wet-wipe rated laminates', 'Rectangle, oval or custom shape', 'Barcode and batch numbering available'],
      options: [
        opt('size', 'Label size', '', [c('40x60', '40 × 60mm', 0.84), c('50x80', '50 × 80mm', 1), c('70x100', '70 × 100mm', 1.36), c('custom', 'Custom shape', 1.5)]),
        opt('material', 'Material', '', [c('matt', 'Matt paper', 1), c('vinyl', 'White vinyl', 1.26), c('clear', 'Clear "no-label look"', 1.42), c('kraft', 'Kraft paper', 1.18)]),
        opt('finish', 'Laminate', '', [c('none', 'Uncoated', 0.92), c('gloss', 'Gloss laminate', 1), c('matt', 'Matt laminate', 1.04), c('freezer', 'Freezer-grade laminate', 1.22)])
      ],
      qty: tiers([[100, 29.99], [250, 39.99], [500, 54.99], [1000, 84.99], [2500, 169.99]])
    },
    {
      slug: 'vehicle-graphics', name: 'Vehicle Graphics & Lettering', cat: 'stickers-labels', sub: 'vehicle-graphics',
      art: 'vehicle', badges: ['Free site survey'], rating: 5.0, reviews: 83, unit: 'vehicle',
      blurb: 'Cut lettering, half wraps and full wraps applied at our Ward Street unit.',
      turnaround: 'Booked in: 3–7 working days',
      specs: ['Cast vinyl with air-release liner', 'Fitted indoors at Ward Street', 'Removable without paint damage', 'Fleet pricing on 3+ vehicles'],
      priceNote: 'Indicative price for a small van. Book a free survey for an exact quote on your vehicle.',
      options: [
        opt('size', 'Vehicle size', '', [
          c('car', 'Car', 0.82), c('smallvan', 'Small van (Caddy, Connect)', 1),
          c('mediumvan', 'Medium van (Transit Custom)', 1.3), c('lwb', 'LWB van (Sprinter, Transit)', 1.64), c('hgv', 'Luton / HGV box', 2.4)
        ]),
        opt('material', 'Coverage', '', [
          c('lettering', 'Cut lettering & logos', 1), c('half', 'Half wrap (printed panels)', 2.3),
          c('threequarter', 'Three-quarter wrap', 3.3), c('full', 'Full colour-change wrap', 4.6)
        ]),
        opt('finish', 'Vinyl & laminate', '', [c('cast', 'Cast vinyl, gloss laminate', 1), c('castmatt', 'Cast vinyl, matt laminate', 1.08), c('reflect', 'Reflective chevrons added', 1.34)]),
        opt('install', 'Fitting', '', [c('fitted', 'Fitted at Ward Street', 1), c('supply', 'Supply only (DIY kit)', 0.66)])
      ],
      qty: tiers([[1, 199.0], [2, 379.0], [3, 549.0], [5, 879.0]])
    },

    /* --------------------------------------------- 6. WORKWEAR & PROMO ----- */
    {
      slug: 'printed-t-shirts', headlineQty: 10, name: 'Printed T-Shirts', cat: 'workwear-promo', sub: 't-shirts',
      art: 'tshirt', badges: ['No minimum order'], rating: 4.8, reviews: 127, unit: 'shirt',
      blurb: 'DTF and screen printed tees on Gildan, Fruit of the Loom and AWDis blanks.',
      turnaround: 'Ready in 3–4 working days',
      specs: ['Sizes XS–5XL, no size surcharge to 2XL', 'Wash-tested to 40°C', 'Front, back and sleeve positions', 'Mixed sizes within one order'],
      options: [
        opt('size', 'Garment', '', [c('gildan', 'Gildan Softstyle 153gsm', 1), c('fotl', 'Fruit of the Loom Valueweight', 0.9), c('awdis', 'AWDis Organic 155gsm', 1.22), c('premium', 'Premium heavyweight 220gsm', 1.4)]),
        opt('material', 'Print method', '', [c('dtf', 'DTF transfer (full colour)', 1), c('screen', 'Screen print (1 colour)', 0.92, 'Best over 50'), c('vinyl', 'Cut vinyl (names & numbers)', 0.96), c('embroidery', 'Embroidered left chest', 1.26)]),
        opt('finish', 'Print positions', '', [c('front', 'Front only', 1), c('frontback', 'Front + back', 1.42), c('frontbacksleeve', 'Front, back + sleeve', 1.68)])
      ],
      qty: tiers([[1, 14.99], [5, 64.99], [10, 109.99], [25, 244.99], [50, 449.99], [100, 829.99]])
    },
    {
      slug: 'embroidered-polo-shirts', headlineQty: 10, name: 'Embroidered Polo Shirts', cat: 'workwear-promo', sub: 'polo-shirts',
      art: 'polo', badges: ['Bestseller'], rating: 4.9, reviews: 143, unit: 'polo',
      blurb: 'Stitched left-chest logos on hard-wearing poly-cotton polos.',
      turnaround: 'Ready in 4–5 working days',
      specs: ['Free logo digitising on 10+ garments', 'Up to 12 thread colours', '220gsm poly-cotton pique', 'Named garments available'],
      options: [
        opt('size', 'Garment', '', [c('uneek', 'Uneek Classic 220gsm', 1), c('fotl', 'Fruit of the Loom 65/35', 1.08), c('regatta', 'Regatta Professional', 1.28), c('ladies', 'Ladies-fit polo', 1.1)]),
        opt('material', 'Decoration', '', [c('leftchest', 'Left chest embroidery', 1), c('leftback', 'Left chest + back text', 1.26), c('leftbacksleeve', 'Chest, back + sleeve', 1.44)]),
        opt('finish', 'Extras', '', [c('none', 'Logo only', 1), c('names', 'Individual names added', 1.18), c('namesnumbers', 'Names + role titles', 1.24)])
      ],
      qty: tiers([[1, 19.99], [5, 89.99], [10, 159.99], [25, 369.99], [50, 689.99], [100, 1289.99]])
    },
    {
      slug: 'printed-hoodies', name: 'Printed & Embroidered Hoodies', cat: 'workwear-promo', sub: 'hoodies',
      art: 'hoodie', badges: [], rating: 4.9, reviews: 96, unit: 'hoodie',
      blurb: 'Heavyweight hoodies for site crews, staff teams and leavers.',
      turnaround: 'Ready in 4–5 working days',
      specs: ['280–350gsm brushed fleece', 'Pullover or full-zip', 'Embroidery or DTF print', 'Back prints up to A3'],
      options: [
        opt('size', 'Garment', '', [c('awdis', 'AWDis College Hoodie 280gsm', 1), c('heavy', 'Heavyweight 350gsm hoodie', 1.26), c('zip', 'Full-zip hoodie', 1.18), c('ladies', 'Ladies-fit hoodie', 1.06)]),
        opt('material', 'Decoration', '', [c('dtf', 'DTF print', 1), c('embroidery', 'Embroidery', 1.14), c('both', 'Embroidered chest + printed back', 1.38)]),
        opt('finish', 'Print positions', '', [c('front', 'Front only', 1), c('frontback', 'Front + back', 1.34), c('frontbacksleeve', 'Front, back + sleeve', 1.52)])
      ],
      qty: tiers([[1, 29.99], [5, 134.99], [10, 249.99], [25, 579.99], [50, 1089.99]])
    },
    {
      slug: 'hi-vis-workwear', name: 'Hi-Vis Workwear', cat: 'workwear-promo', sub: 'hi-vis',
      art: 'hivis', badges: [], rating: 4.8, reviews: 71, unit: 'item',
      blurb: 'EN ISO 20471 vests, polos and softshells printed with your company name.',
      turnaround: 'Ready in 3–4 working days',
      specs: ['EN ISO 20471 certified garments', 'Class 1, 2 and 3 options', 'Heat-sealed print, no stitching through tape', 'Site-ready same week'],
      options: [
        opt('size', 'Garment', '', [c('vest', 'Hi-vis vest', 1), c('polo', 'Hi-vis polo shirt', 2.1), c('sweatshirt', 'Hi-vis sweatshirt', 3.2), c('softshell', 'Hi-vis softshell jacket', 5.4)]),
        opt('material', 'Print positions', '', [c('back', 'Back only', 1), c('frontback', 'Front + back', 1.22), c('frontbacksleeve', 'Front, back + sleeves', 1.36)]),
        opt('finish', 'Print type', '', [c('vinyl', 'Heat-sealed vinyl', 1), c('dtf', 'DTF full colour', 1.14)])
      ],
      qty: tiers([[5, 44.99], [10, 79.99], [25, 179.99], [50, 329.99], [100, 619.99]])
    },
    {
      slug: 'tote-bags-mugs', name: 'Tote Bags & Printed Mugs', cat: 'workwear-promo', sub: 'promo',
      art: 'tote-mug', badges: [], rating: 4.7, reviews: 58, unit: 'item',
      blurb: 'Branded giveaways for open days, markets and welcome packs.',
      turnaround: 'Ready in 3–5 working days',
      specs: ['Cotton totes in natural, black and navy', 'Dishwasher-safe mug printing', 'Full colour wrap or single colour', 'Gift boxes available for mugs'],
      options: [
        opt('size', 'Item', '', [c('tote', '5oz cotton tote bag', 1), c('tote10', '10oz heavy canvas tote', 1.5), c('mug', '11oz ceramic mug', 1.3), c('travel', 'Travel mug', 2.4)]),
        opt('material', 'Print', '', [c('one', '1 colour, 1 side', 1), c('full', 'Full colour, 1 side', 1.2), c('fullboth', 'Full colour, both sides', 1.46)]),
        opt('finish', 'Packing', '', [c('bulk', 'Bulk packed', 1), c('individual', 'Individually bagged', 1.08), c('gift', 'Gift boxed', 1.3)])
      ],
      qty: tiers([[25, 84.99], [50, 149.99], [100, 269.99], [250, 619.99], [500, 1149.99]])
    },

    /* --------------------------------------- 7. STATIONERY & PACKAGING ----- */
    {
      slug: 'letterheads', name: 'Letterheads', cat: 'stationery-packaging', sub: 'letterheads',
      art: 'letterhead', badges: [], rating: 4.8, reviews: 49, unit: 'sheet',
      blurb: 'Laser-safe letterheads on uncoated and conqueror stocks.',
      turnaround: 'Ready in 3 working days',
      specs: ['100–120gsm laser-compatible', 'Uncoated, laid or wove finishes', 'Matching comp slips available', 'Shrink-wrapped in 250s'],
      options: [
        opt('size', 'Size', '', [c('a4', 'A4 (210 × 297mm)', 1), c('a5', 'A5 (148 × 210mm)', 0.7)]),
        opt('material', 'Paper weight / material', '', [c('100uncoated', '100gsm Uncoated', 1), c('120uncoated', '120gsm Uncoated', 1.16), c('100conqueror', '100gsm Conqueror Laid', 1.52), c('120recycled', '120gsm Recycled', 1.2)]),
        SIDES
      ],
      qty: tiers([[250, 44.99], [500, 59.99], [1000, 84.99], [2500, 149.99], [5000, 249.99]])
    },
    {
      slug: 'compliment-slips', name: 'Compliment Slips', cat: 'stationery-packaging', sub: 'comp-slips',
      art: 'letterhead', badges: [], rating: 4.7, reviews: 31, unit: 'slip',
      blurb: 'DL comp slips printed to match your letterheads and cards.',
      turnaround: 'Ready in 3 working days',
      specs: ['DL 210 × 99mm standard', '100–170gsm stocks', 'Writeable uncoated options', 'Matching stationery sets'],
      options: [
        opt('size', 'Size', '', [c('dl', 'DL (210 × 99mm)', 1), c('a5', 'A5 (148 × 210mm)', 1.46)]),
        opt('material', 'Paper weight / material', '', [c('100uncoated', '100gsm Uncoated', 1), c('120uncoated', '120gsm Uncoated', 1.14), c('170silk', '170gsm Silk', 1.3)]),
        SIDES
      ],
      qty: tiers([[250, 34.99], [500, 44.99], [1000, 64.99], [2500, 114.99], [5000, 189.99]])
    },
    {
      slug: 'ncr-invoice-pads', headlineQty: 10, name: 'NCR Invoice Pads', cat: 'stationery-packaging', sub: 'ncr-pads',
      art: 'ncr', badges: ['Trade favourite'], rating: 4.9, reviews: 88, unit: 'pad',
      blurb: 'Duplicate and triplicate carbonless pads, numbered and glued.',
      turnaround: 'Ready in 4 working days',
      specs: ['Duplicate or triplicate sets', 'Sequential numbering included', 'Glued and board-backed', 'Writing shield supplied free'],
      options: [
        opt('size', 'Pad size', '', [c('a6', 'A6 (105 × 148mm)', 0.62), c('a5', 'A5 (148 × 210mm)', 1), c('a4', 'A4 (210 × 297mm)', 1.66)]),
        opt('material', 'Parts per set', '', [c('2part', '2-part (white / yellow)', 1), c('3part', '3-part (white / yellow / pink)', 1.38), c('4part', '4-part', 1.72)]),
        opt('finish', 'Sets per pad', '', [c('50', '50 sets per pad', 1), c('100', '100 sets per pad', 1.74)]),
        opt('colours', 'Print colours', '', [c('1col', '1 colour (black)', 1), c('2col', '2 colours', 1.2), c('full', 'Full colour', 1.42)])
      ],
      qty: tiers([[5, 89.99], [10, 139.99], [25, 289.99], [50, 519.99], [100, 949.99]])
    },
    {
      slug: 'branded-boxes', name: 'Branded Boxes & Packaging', cat: 'stationery-packaging', sub: 'boxes',
      art: 'boxes', badges: [], rating: 4.8, reviews: 27, unit: 'box',
      blurb: 'Short-run printed mailers and product boxes with your branding inside and out.',
      turnaround: 'Ready in 7–10 working days',
      specs: ['E-flute and corrugated board', 'Printed inside and out', 'Die-cut mailers or tuck boxes', 'Low 50-unit minimum'],
      options: [
        opt('size', 'Box size', '', [c('small', 'Small mailer (160 × 120 × 60mm)', 1), c('medium', 'Medium mailer (250 × 180 × 80mm)', 1.36), c('large', 'Large mailer (350 × 250 × 120mm)', 1.86), c('custom', 'Custom dieline', 2.1)]),
        opt('material', 'Board', '', [c('eflute', 'E-flute corrugated', 1), c('bflute', 'B-flute corrugated', 1.16), c('kraft', 'Kraft board', 0.94), c('rigid', 'Rigid gift box', 2.4)]),
        opt('finish', 'Print & finish', '', [c('out1', '1 colour outside', 1), c('outfull', 'Full colour outside', 1.3), c('bothfull', 'Full colour inside + out', 1.68), c('mattlam', 'Full colour + matt laminate', 1.82)])
      ],
      qty: tiers([[50, 149.99], [100, 229.99], [250, 449.99], [500, 779.99], [1000, 1349.99]])
    }
  ];

  /* ---------------------------------------------------------- lookups ----- */
  var byCat = {};
  PRODUCTS.forEach(function (p) { (byCat[p.cat] = byCat[p.cat] || []).push(p); });

  function getCategory(slug) { return CATEGORIES.filter(function (x) { return x.slug === slug; })[0] || null; }
  function getProduct(slug) { return PRODUCTS.filter(function (x) { return x.slug === slug; })[0] || null; }
  function productsIn(catSlug, subSlug) {
    var list = byCat[catSlug] || [];
    return subSlug ? list.filter(function (p) { return p.sub === subSlug; }) : list.slice();
  }
  function categoryFrom(catSlug) {
    var list = productsIn(catSlug);
    if (!list.length) return 0;
    return Math.min.apply(null, list.map(function (p) { return headlineTier(p).price; }));
  }
  /* The default configuration is the one each product's quantity prices were
     authored against: the choice with a multiplier of exactly 1 in every
     group. That makes the advertised "from" price reproducible — a customer
     can land on the product page and see the same number. */
  function defaultSelection(p) {
    var sel = {};
    p.options.forEach(function (o) {
      var base = o.choices.filter(function (ch) { return ch.mult === 1; })[0];
      sel[o.key] = (base || o.choices[0]).v;
    });
    return sel;
  }

  /* ----------------------------------------------------------- pricing ---- */
  function multiplier(p, sel) {
    var m = 1;
    p.options.forEach(function (o) {
      var ch = o.choices.filter(function (x) { return x.v === sel[o.key]; })[0] || o.choices[0];
      m *= ch.mult;
    });
    return m;
  }
  function round2(n) { return Math.round(n * 100) / 100; }

  function priceFor(p, sel, qty, designService) {
    var tier = p.qty.filter(function (t) { return t.q === qty; })[0] || p.qty[0];
    var total = round2(tier.price * multiplier(p, sel));
    if (designService) total = round2(total + DESIGN_SERVICE_FEE);
    return {
      total: total,
      unit: round2(total / tier.q),
      qty: tier.q,
      baseTotal: round2(tier.price * multiplier(p, sel))
    };
  }

  /* saving vs the smallest tier's unit price, as a whole percentage */
  function tierSaving(p, sel, qty) {
    var m = multiplier(p, sel);
    var base = p.qty[0];
    var tier = p.qty.filter(function (t) { return t.q === qty; })[0];
    if (!tier || tier.q === base.q) return 0;
    var baseUnit = (base.price * m) / base.q;
    var unit = (tier.price * m) / tier.q;
    return Math.max(0, Math.round((1 - unit / baseUnit) * 100));
  }

  function money(n) {
    return '£' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function headlineTier(p) {
    if (p.headlineQty) {
      var t = p.qty.filter(function (x) { return x.q === p.headlineQty; })[0];
      if (t) return t;
    }
    return p.qty[0];
  }
  function fromPrice(p) { return money(headlineTier(p).price); }
  /* Split the headline price into a quantity line and a price line so cards
     can give the number the visual weight it deserves. */
  function fromParts(p) {
    var t = headlineTier(p);
    return {
      qty: t.q > 1 ? t.q.toLocaleString('en-GB') + ' ' + p.unit + (/s$|²$/.test(p.unit) ? '' : 's') : null,
      price: 'from ' + money(t.price)
    };
  }
  function fromLabel(p) {
    var t = headlineTier(p);
    return t.q > 1 ? t.q.toLocaleString('en-GB') + ' from ' + money(t.price) : 'From ' + money(t.price);
  }
  /* What this choice adds to the current configuration, in pounds. */
  function upliftFor(p, sel, qty, key, value) {
    var a = priceFor(p, sel, qty).baseTotal;
    var alt = {}; Object.keys(sel).forEach(function (k) { alt[k] = sel[k]; });
    alt[key] = value;
    return round2(priceFor(p, alt, qty).baseTotal - a);
  }

  function labelFor(p, key, value) {
    var o = p.options.filter(function (x) { return x.key === key; })[0];
    if (!o) return value;
    var ch = o.choices.filter(function (x) { return x.v === value; })[0];
    return ch ? ch.label : value;
  }

  function search(q) {
    q = (q || '').trim().toLowerCase();
    if (q.length < 2) return [];
    var terms = q.split(/\s+/);
    var scored = [];
    PRODUCTS.forEach(function (p) {
      var cat = getCategory(p.cat);
      var hay = (p.name + ' ' + p.blurb + ' ' + cat.name + ' ' + (p.specs || []).join(' ')).toLowerCase();
      var score = 0;
      terms.forEach(function (t) {
        if (p.name.toLowerCase().indexOf(t) === 0) score += 6;
        else if (p.name.toLowerCase().indexOf(t) > -1) score += 4;
        else if (hay.indexOf(t) > -1) score += 1;
      });
      if (score) scored.push({ p: p, s: score, cat: cat });
    });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored.slice(0, 7);
  }

  global.URData = {
    COMPANY: COMPANY, DELIVERY: DELIVERY, CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS,
    FREE_DELIVERY_THRESHOLD: FREE_DELIVERY_THRESHOLD, DESIGN_SERVICE_FEE: DESIGN_SERVICE_FEE,
    getCategory: getCategory, getProduct: getProduct, productsIn: productsIn, categoryFrom: categoryFrom,
    defaultSelection: defaultSelection, priceFor: priceFor, tierSaving: tierSaving, money: money,
    fromPrice: fromPrice, fromLabel: fromLabel, fromParts: fromParts, headlineTier: headlineTier, upliftFor: upliftFor, labelFor: labelFor, search: search, round2: round2
  };
})(window);
