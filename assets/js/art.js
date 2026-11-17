/* ==========================================================================
   UR Print — inline SVG illustration library
   Flat, brand-coloured scenes used for category tiles, product cards and PDP.
   Every scene draws on a 400x300 viewBox and scales to its container.
   ========================================================================== */
(function (global) {
  'use strict';

  var C = {
    blue: '#0061D5', blueDark: '#004EAB', blueLt: '#D4E5FD', blueSky: '#EAF2FE',
    ink: '#1A1F2B', ink2: '#3C4454', grey: '#DDE1E8', grey2: '#ECEEF2', greyLt: '#F5F6F8',
    teal: '#0E9F8E', tealLt: '#CBEDE8', amber: '#F6A609', amberLt: '#FDE9C4',
    white: '#FFFFFF', paper: '#FBFCFE'
  };

  function wrap(bg, inner) {
    return '<svg class="art" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="400" height="300" fill="' + bg + '"/>' + inner + '</svg>';
  }

  /* small reusable pieces -------------------------------------------------- */
  function lines(x, y, w, gap, n, col, h) {
    var o = '', i;
    for (i = 0; i < n; i++) {
      o += '<rect x="' + x + '" y="' + (y + i * gap) + '" width="' + (i % 3 === 2 ? w * 0.62 : w) +
        '" height="' + (h || 3) + '" rx="1.5" fill="' + col + '"/>';
    }
    return o;
  }
  function mark(x, y, s, col) { // the UR circle mark, simplified
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<circle cx="0" cy="0" r="15" fill="none" stroke="' + col + '" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="' + col + '" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>';
  }

  var A = {};

  /* 1 — Business cards: fanned stack ------------------------------------- */
  A['business-cards'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(200,158)">' +
      '<g transform="rotate(-14) translate(-110,-10)"><rect width="190" height="118" rx="8" fill="' + C.blueDark + '"/>' +
      mark(150, 88, 1.1, 'rgba(255,255,255,.35)') + '</g>' +
      '<g transform="rotate(-6) translate(-100,-24)"><rect width="190" height="118" rx="8" fill="' + C.blue + '"/>' +
      '<rect x="18" y="22" width="58" height="5" rx="2.5" fill="rgba(255,255,255,.85)"/>' +
      lines(18, 40, 86, 11, 3, 'rgba(255,255,255,.4)') +
      mark(152, 88, 1.2, 'rgba(255,255,255,.5)') + '</g>' +
      '<g transform="rotate(5) translate(-86,-40)"><rect width="190" height="118" rx="8" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      mark(40, 36, 1.0, C.blue) +
      '<rect x="62" y="28" width="72" height="7" rx="3.5" fill="' + C.ink + '"/>' +
      '<rect x="62" y="42" width="48" height="5" rx="2.5" fill="' + C.blue + '"/>' +
      lines(22, 70, 96, 10, 3, C.grey) +
      '<rect x="150" y="70" width="22" height="22" rx="3" fill="' + C.greyLt + '" stroke="' + C.grey + '"/>' +
      '</g></g>');
  };

  /* 2 — Flyers & leaflets -------------------------------------------------- */
  A['flyers'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(60,40)">' +
      '<rect x="24" y="10" width="140" height="196" rx="6" fill="' + C.blueLt + '" transform="rotate(-8 94 108)"/>' +
      '<rect x="8" y="4" width="148" height="206" rx="6" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="8" y="4" width="148" height="74" rx="6" fill="' + C.blue + '"/>' +
      '<path d="M8 60h148v18H8z" fill="' + C.blue + '"/>' +
      '<rect x="24" y="24" width="86" height="9" rx="4.5" fill="rgba(255,255,255,.9)"/>' +
      '<rect x="24" y="40" width="58" height="6" rx="3" fill="rgba(255,255,255,.55)"/>' +
      '<circle cx="132" cy="44" r="16" fill="' + C.amber + '"/>' +
      lines(24, 96, 116, 11, 5, C.grey2) +
      '<rect x="24" y="162" width="70" height="26" rx="5" fill="' + C.teal + '"/>' +
      '</g>' +
      '<g transform="translate(214,66) rotate(7)">' +
      '<rect width="124" height="168" rx="6" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="14" y="14" width="96" height="58" rx="4" fill="' + C.blueSky + '"/>' +
      '<path d="M14 58l24-22 20 16 16-12 36 26v6H14z" fill="' + C.blueLt + '"/>' +
      '<circle cx="90" cy="30" r="8" fill="' + C.amber + '"/>' +
      lines(14, 86, 96, 11, 4, C.grey2) +
      '<rect x="14" y="136" width="52" height="18" rx="4" fill="' + C.blue + '"/>' +
      '</g>');
  };

  /* 3 — Shop fascia sign --------------------------------------------------- */
  A['signs'] = function () {
    return wrap('#EDF1F6',
      '<rect x="0" y="206" width="400" height="94" fill="' + C.grey2 + '"/>' +
      '<rect x="36" y="86" width="328" height="120" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      // fascia
      '<rect x="24" y="52" width="352" height="56" rx="5" fill="' + C.ink + '"/>' +
      '<rect x="24" y="52" width="352" height="56" rx="5" fill="none" stroke="' + C.blueDark + '" stroke-width="2"/>' +
      mark(66, 80, 1.15, C.white) +
      '<rect x="92" y="70" width="128" height="14" rx="7" fill="' + C.white + '"/>' +
      '<rect x="92" y="90" width="80" height="7" rx="3.5" fill="' + C.blue + '"/>' +
      '<rect x="300" y="72" width="54" height="22" rx="4" fill="' + C.teal + '"/>' +
      // glazing
      '<rect x="52" y="120" width="128" height="86" fill="' + C.blueSky + '"/>' +
      '<rect x="196" y="120" width="68" height="86" fill="' + C.blueSky + '"/>' +
      '<path d="M52 120l54 86H74l-22-36z" fill="rgba(255,255,255,.55)"/>' +
      // door
      '<rect x="278" y="128" width="70" height="78" rx="3" fill="' + C.grey2 + '" stroke="' + C.grey + '"/>' +
      '<circle cx="290" cy="170" r="3" fill="' + C.ink2 + '"/>' +
      // window vinyl
      '<rect x="66" y="142" width="100" height="10" rx="5" fill="' + C.blue + '" opacity=".8"/>' +
      '<rect x="66" y="158" width="64" height="7" rx="3.5" fill="' + C.ink2 + '" opacity=".45"/>' +
      '<rect x="206" y="142" width="48" height="48" rx="24" fill="' + C.amber + '" opacity=".85"/>' +
      // awning shadow
      '<path d="M24 108h352l-10 10H34z" fill="rgba(26,31,43,.14)"/>');
  };

  /* 4 — Roller banner + PVC banner ---------------------------------------- */
  A['banners'] = function () {
    return wrap(C.greyLt,
      // pvc banner on wall
      '<g transform="translate(26,42)">' +
      '<rect x="0" y="0" width="190" height="124" rx="4" fill="' + C.blue + '"/>' +
      '<path d="M0 0h190v124H0z" fill="url(#g1)" opacity=".18"/>' +
      '<rect x="18" y="22" width="110" height="13" rx="6.5" fill="rgba(255,255,255,.95)"/>' +
      '<rect x="18" y="44" width="78" height="8" rx="4" fill="rgba(255,255,255,.6)"/>' +
      '<rect x="18" y="78" width="62" height="24" rx="5" fill="' + C.amber + '"/>' +
      mark(160, 96, 1.1, 'rgba(255,255,255,.55)') +
      '<circle cx="9" cy="9" r="3.4" fill="' + C.greyLt + '"/><circle cx="181" cy="9" r="3.4" fill="' + C.greyLt + '"/>' +
      '<circle cx="9" cy="115" r="3.4" fill="' + C.greyLt + '"/><circle cx="181" cy="115" r="3.4" fill="' + C.greyLt + '"/>' +
      '</g>' +
      // roller banner
      '<g transform="translate(250,34)">' +
      '<rect x="0" y="0" width="112" height="206" rx="3" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<path d="M0 132h112v74H0z" fill="' + C.blueSky + '"/>' +
      '<path d="M0 206V150l34-20 30 22 24-16 24 18v52z" fill="' + C.blueLt + '"/>' +
      mark(56, 36, 1.3, C.blue) +
      '<rect x="20" y="62" width="72" height="11" rx="5.5" fill="' + C.ink + '"/>' +
      '<rect x="30" y="82" width="52" height="7" rx="3.5" fill="' + C.grey + '"/>' +
      '<rect x="32" y="102" width="48" height="18" rx="4" fill="' + C.teal + '"/>' +
      '<rect x="-8" y="206" width="128" height="14" rx="7" fill="' + C.ink2 + '"/>' +
      '<rect x="48" y="220" width="16" height="8" rx="2" fill="' + C.ink + '"/>' +
      '</g>' +
      '<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs>');
  };

  /* 5 — Stickers & labels -------------------------------------------------- */
  A['stickers'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(44,52)">' +
      '<circle cx="62" cy="62" r="58" fill="' + C.blue + '"/>' +
      '<circle cx="62" cy="62" r="50" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="6 6"/>' +
      mark(62, 50, 1.3, C.white) +
      '<rect x="30" y="74" width="64" height="9" rx="4.5" fill="rgba(255,255,255,.9)"/>' +
      '<rect x="42" y="90" width="40" height="6" rx="3" fill="rgba(255,255,255,.55)"/>' +
      '</g>' +
      '<g transform="translate(176,38) rotate(-9)">' +
      '<path d="M0 10a10 10 0 0 1 10-10h96a10 10 0 0 1 10 10v70a10 10 0 0 1-10 10H10A10 10 0 0 1 0 80z" fill="' + C.amber + '"/>' +
      '<rect x="16" y="22" width="62" height="10" rx="5" fill="rgba(255,255,255,.9)"/>' +
      '<rect x="16" y="40" width="84" height="6" rx="3" fill="rgba(255,255,255,.6)"/>' +
      '<rect x="16" y="54" width="48" height="6" rx="3" fill="rgba(255,255,255,.6)"/>' +
      '</g>' +
      '<g transform="translate(206,150) rotate(6)">' +
      '<rect width="150" height="96" rx="8" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="12" y="12" width="126" height="72" rx="5" fill="' + C.tealLt + '" stroke="' + C.teal + '" stroke-dasharray="5 5"/>' +
      '<path d="M44 58l18-20 16 18 12-10 24 24H44z" fill="' + C.teal + '"/>' +
      '<circle cx="48" cy="34" r="7" fill="' + C.teal + '"/>' +
      '</g>' +
      // sticker roll
      '<g transform="translate(36,186)">' +
      '<rect width="124" height="68" rx="8" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<circle cx="34" cy="34" r="20" fill="' + C.blueSky + '" stroke="' + C.blue + '" stroke-width="2"/>' +
      '<circle cx="34" cy="34" r="7" fill="' + C.white + '" stroke="' + C.blue + '" stroke-width="2"/>' +
      lines(66, 22, 42, 11, 3, C.grey2) + '</g>');
  };

  /* 6 — Workwear & promo --------------------------------------------------- */
  A['workwear'] = function () {
    var tee = function (x, y, s, body, accent) {
      return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
        '<path d="M44 0 24 8 0 22l12 26 14-7v77a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V41l14 7 12-26L100 8 80 0a20 20 0 0 1-36 0z" fill="' + body + '"/>' +
        '<path d="M44 0a20 20 0 0 0 36 0l-6-2a15 15 0 0 1-24 0z" fill="rgba(0,0,0,.14)"/>' +
        '<circle cx="62" cy="52" r="15" fill="' + accent + '"/>' +
        '<rect x="38" y="78" width="48" height="7" rx="3.5" fill="' + accent + '" opacity=".75"/>' +
        '</g>';
    };
    return wrap(C.greyLt,
      tee(18, 52, 1.0, C.blue, 'rgba(255,255,255,.9)') +
      tee(146, 70, 0.86, C.ink, C.amber) +
      // hi-vis
      '<g transform="translate(262,78) scale(.9)">' +
      '<path d="M44 0 24 8 0 22l12 26 14-7v77a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V41l14 7 12-26L100 8 80 0a20 20 0 0 1-36 0z" fill="#E8F14C"/>' +
      '<rect x="26" y="56" width="72" height="12" fill="#C7CF2C" opacity=".8"/>' +
      '<rect x="26" y="88" width="72" height="12" fill="#C7CF2C" opacity=".8"/>' +
      '<rect x="26" y="68" width="72" height="20" fill="#F2F7C9" opacity=".9"/>' +
      '</g>' +
      // mug
      '<g transform="translate(36,196)">' +
      '<rect x="0" y="0" width="54" height="56" rx="7" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<path d="M54 14h10a12 12 0 0 1 0 24H54z" fill="none" stroke="' + C.grey + '" stroke-width="5"/>' +
      mark(27, 28, .95, C.blue) + '</g>' +
      // tote
      '<g transform="translate(300,200)">' +
      '<rect x="0" y="14" width="64" height="58" rx="4" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<path d="M16 14V6a16 10 0 0 1 32 0v8" fill="none" stroke="' + C.ink2 + '" stroke-width="4"/>' +
      '<rect x="14" y="36" width="36" height="7" rx="3.5" fill="' + C.blue + '"/></g>');
  };

  /* 7 — Stationery & packaging -------------------------------------------- */
  A['stationery'] = function () {
    return wrap(C.greyLt,
      // letterhead
      '<g transform="translate(40,30) rotate(-4)">' +
      '<rect width="146" height="200" rx="4" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="0" y="0" width="146" height="8" fill="' + C.blue + '"/>' +
      mark(30, 36, 1.0, C.blue) +
      '<rect x="52" y="30" width="62" height="7" rx="3.5" fill="' + C.ink + '"/>' +
      '<rect x="52" y="42" width="40" height="5" rx="2.5" fill="' + C.grey + '"/>' +
      lines(22, 72, 102, 10, 8, C.grey2) +
      '<rect x="22" y="176" width="102" height="4" rx="2" fill="' + C.blueLt + '"/>' +
      '</g>' +
      // ncr pad
      '<g transform="translate(176,102) rotate(5)">' +
      '<rect y="8" width="150" height="116" rx="5" fill="#FFF6E0" stroke="' + C.amberLt + '"/>' +
      '<rect x="4" y="4" width="150" height="116" rx="5" fill="#EAF7FF" stroke="#CDE7F6"/>' +
      '<rect x="8" width="150" height="116" rx="5" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="22" y="16" width="56" height="8" rx="4" fill="' + C.ink + '"/>' +
      '<rect x="112" y="16" width="34" height="8" rx="4" fill="' + C.blue + '"/>' +
      lines(22, 40, 124, 12, 4, C.grey2) +
      '<rect x="100" y="92" width="46" height="8" rx="4" fill="' + C.teal + '"/>' +
      '</g>' +
      // box
      '<g transform="translate(228,16)">' +
      '<path d="M0 26 42 6l42 20-42 20z" fill="' + C.blue + '"/>' +
      '<path d="M0 26v44l42 20V46z" fill="' + C.blueDark + '"/>' +
      '<path d="M84 26v44L42 90V46z" fill="#0F6FE8"/>' +
      mark(42, 62, .8, 'rgba(255,255,255,.65)') + '</g>');
  };

  /* --- product-level scenes ---------------------------------------------- */

  A['spot-uv'] = function () {
    return wrap('#0E131C',
      '<g transform="translate(200,150)">' +
      '<g transform="rotate(-7) translate(-150,-56)">' +
      '<rect width="300" height="112" rx="10" fill="#161D2A" stroke="#2A3445"/>' +
      '<rect width="300" height="112" rx="10" fill="url(#sheen)" opacity=".5"/>' +
      mark(56, 56, 1.6, '#8FBEFF') +
      '<rect x="104" y="42" width="128" height="12" rx="6" fill="#FFFFFF"/>' +
      '<rect x="104" y="62" width="82" height="8" rx="4" fill="#7FB4FF"/>' +
      '<path d="M236 24l10 22 22 10-22 10-10 22-10-22-22-10 22-10z" fill="#BFD9FF" opacity=".9"/>' +
      '</g></g>' +
      '<defs><linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#5A8FD8" stop-opacity=".0"/><stop offset=".45" stop-color="#9CC4FF" stop-opacity=".45"/>' +
      '<stop offset=".6" stop-color="#9CC4FF" stop-opacity="0"/></linearGradient></defs>');
  };

  A['soft-touch'] = function () {
    return wrap('#F0EDE9',
      '<g transform="translate(200,150)">' +
      '<g transform="rotate(6) translate(-146,-54)">' +
      '<rect width="292" height="108" rx="9" fill="#2B2F3A"/>' +
      '<rect x="18" y="20" width="110" height="11" rx="5.5" fill="#F3EFEA"/>' +
      '<rect x="18" y="40" width="72" height="7" rx="3.5" fill="#9AA3B2"/>' +
      '<rect x="18" y="72" width="140" height="4" rx="2" fill="#5A6273"/>' +
      mark(248, 54, 1.5, '#F3EFEA') + '</g>' +
      '<g transform="rotate(-5) translate(-160,-30)">' +
      '<rect width="292" height="108" rx="9" fill="#FBF8F4" stroke="#E2DCD3"/>' +
      mark(52, 54, 1.4, '#2B2F3A') +
      '<rect x="96" y="40" width="120" height="11" rx="5.5" fill="#2B2F3A"/>' +
      '<rect x="96" y="60" width="78" height="7" rx="3.5" fill="#A9A098"/>' +
      '</g></g>');
  };

  A['rounded-corner'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(200,150)">' +
      '<g transform="translate(-150,-56) rotate(-4)">' +
      '<rect width="300" height="112" rx="26" fill="' + C.teal + '"/>' +
      '<rect x="24" y="30" width="118" height="12" rx="6" fill="rgba(255,255,255,.95)"/>' +
      '<rect x="24" y="52" width="78" height="8" rx="4" fill="rgba(255,255,255,.6)"/>' +
      mark(250, 56, 1.5, 'rgba(255,255,255,.55)') + '</g>' +
      '<g transform="translate(-130,-20) rotate(5)">' +
      '<rect width="300" height="112" rx="26" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      mark(56, 56, 1.4, C.teal) +
      '<rect x="102" y="40" width="130" height="12" rx="6" fill="' + C.ink + '"/>' +
      '<rect x="102" y="60" width="86" height="8" rx="4" fill="' + C.grey + '"/>' +
      '<path d="M0 26A26 26 0 0 1 26 0" fill="none" stroke="' + C.blue + '" stroke-width="3" stroke-dasharray="4 4"/>' +
      '</g></g>');
  };

  A['matt-lam'] = function () {
    return wrap('#EFF2F6',
      '<g transform="translate(200,150)">' +
      '<g transform="translate(-152,-58) rotate(-3)">' +
      '<rect width="304" height="116" rx="8" fill="' + C.ink + '"/>' +
      '<rect x="26" y="32" width="124" height="12" rx="6" fill="#FFFFFF"/>' +
      '<rect x="26" y="54" width="84" height="8" rx="4" fill="#7FB4FF"/>' +
      '<rect x="26" y="80" width="150" height="4" rx="2" fill="#424B5C"/>' +
      mark(254, 58, 1.5, '#7FB4FF') + '</g>' +
      '<rect x="-152" y="-58" width="304" height="116" rx="8" fill="none"/>' +
      '</g>' +
      '<rect x="0" y="238" width="400" height="62" fill="#E4E9F0"/>');
  };

  A['folded-leaflet'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(48,70)">' +
      '<path d="M0 20 96 0v172L0 192z" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<path d="M96 0l98 22v148l-98 22z" fill="#F2F5FA" stroke="' + C.grey + '"/>' +
      '<path d="M194 22l92-20v168l-92 22z" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="16" y="46" width="62" height="9" rx="4.5" fill="' + C.blue + '"/>' +
      lines(16, 70, 62, 11, 4, C.grey2) +
      '<rect x="116" y="44" width="58" height="52" rx="4" fill="' + C.blueSky + '"/>' +
      lines(116, 110, 58, 11, 3, C.grey2) +
      '<rect x="212" y="40" width="56" height="9" rx="4.5" fill="' + C.teal + '"/>' +
      lines(212, 64, 56, 11, 4, C.grey2) +
      '</g>');
  };

  A['booklet'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(52,58)">' +
      '<path d="M148 16C112-6 40-2 0 10v168c40-12 112-16 148 6z" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<path d="M148 16c36-22 108-18 148-6v168c-40-12-112-16-148 6z" fill="#F7F9FC" stroke="' + C.grey + '"/>' +
      '<rect x="22" y="40" width="96" height="48" rx="4" fill="' + C.blueSky + '"/>' +
      lines(22, 102, 96, 12, 4, C.grey2) +
      '<rect x="180" y="38" width="74" height="9" rx="4.5" fill="' + C.blue + '"/>' +
      lines(180, 60, 96, 12, 6, C.grey2) +
      '<path d="M148 16v164" stroke="' + C.grey + '" stroke-dasharray="4 4"/>' +
      '</g>');
  };

  A['postcard'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(60,74)">' +
      '<rect width="280" height="170" rx="7" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="0" y="0" width="140" height="170" rx="7" fill="' + C.blueSky + '"/>' +
      '<path d="M0 170v-54l38-30 30 24 24-18 48 38v40z" fill="' + C.blueLt + '"/>' +
      '<circle cx="104" cy="44" r="16" fill="' + C.amber + '"/>' +
      '<path d="M140 0v170" stroke="' + C.grey + '" stroke-dasharray="5 5"/>' +
      '<rect x="222" y="16" width="42" height="34" rx="3" fill="' + C.greyLt + '" stroke="' + C.grey + '"/>' +
      lines(158, 76, 94, 14, 4, C.grey2) +
      '<rect x="158" y="18" width="46" height="7" rx="3.5" fill="' + C.blue + '"/>' +
      '</g>');
  };

  A['menu'] = function () {
    return wrap('#F6F2EC',
      '<g transform="translate(118,34)">' +
      '<rect width="166" height="232" rx="6" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="0" y="0" width="166" height="58" fill="' + C.ink + '"/>' +
      '<rect x="40" y="18" width="86" height="11" rx="5.5" fill="' + C.white + '"/>' +
      '<rect x="58" y="36" width="50" height="6" rx="3" fill="' + C.amber + '"/>' +
      '<rect x="22" y="78" width="54" height="8" rx="4" fill="' + C.amber + '"/>' +
      lines(22, 96, 122, 13, 4, C.grey2) +
      '<rect x="22" y="160" width="54" height="8" rx="4" fill="' + C.amber + '"/>' +
      lines(22, 178, 122, 13, 3, C.grey2) +
      '</g>');
  };

  A['window-graphics'] = function () {
    return wrap('#E9EEF4',
      '<rect x="30" y="34" width="340" height="226" rx="6" fill="' + C.blueSky + '" stroke="' + C.grey + '" stroke-width="3"/>' +
      '<path d="M30 260 170 34h58L88 260z" fill="rgba(255,255,255,.5)"/>' +
      '<rect x="190" y="34" width="6" height="226" fill="' + C.grey + '"/>' +
      // frosted band
      '<rect x="30" y="120" width="340" height="52" fill="rgba(255,255,255,.75)"/>' +
      '<rect x="56" y="136" width="120" height="12" rx="6" fill="' + C.blue + '"/>' +
      '<rect x="56" y="154" width="74" height="7" rx="3.5" fill="' + C.ink2 + '" opacity=".6"/>' +
      mark(320, 146, 1.5, C.blue) +
      // decal
      '<circle cx="262" cy="74" r="28" fill="' + C.amber + '"/>' +
      '<rect x="238" y="208" width="104" height="10" rx="5" fill="' + C.teal + '"/>' +
      '<rect x="238" y="226" width="68" height="7" rx="3.5" fill="' + C.ink2 + '" opacity=".5"/>');
  };

  A['foamex'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(34,60)">' +
      '<rect width="180" height="130" rx="4" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<rect x="0" y="130" width="180" height="8" rx="2" fill="' + C.grey + '"/>' +
      mark(40, 44, 1.3, C.blue) +
      '<rect x="68" y="34" width="86" height="11" rx="5.5" fill="' + C.ink + '"/>' +
      '<rect x="68" y="52" width="58" height="7" rx="3.5" fill="' + C.blue + '"/>' +
      lines(24, 82, 132, 12, 3, C.grey2) + '</g>' +
      // correx with stake
      '<g transform="translate(232,52)">' +
      '<rect width="136" height="100" rx="3" fill="' + C.blue + '"/>' +
      '<g opacity=".16" fill="#fff">' +
      '<rect x="8" width="4" height="100"/><rect x="28" width="4" height="100"/><rect x="48" width="4" height="100"/>' +
      '<rect x="68" width="4" height="100"/><rect x="88" width="4" height="100"/><rect x="108" width="4" height="100"/></g>' +
      '<rect x="20" y="26" width="92" height="12" rx="6" fill="#fff"/>' +
      '<rect x="36" y="48" width="60" height="8" rx="4" fill="rgba(255,255,255,.65)"/>' +
      '<rect x="62" y="100" width="10" height="86" fill="' + C.grey + '"/>' +
      '</g>');
  };

  A['a-board'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(96,46)">' +
      '<path d="M44 0h120l32 196H12z" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<path d="M164 0h18l44 196h-30z" fill="' + C.grey2 + '"/>' +
      '<rect x="48" y="30" width="110" height="13" rx="6.5" fill="' + C.ink + '"/>' +
      '<rect x="56" y="54" width="94" height="8" rx="4" fill="' + C.blue + '"/>' +
      '<rect x="40" y="86" width="126" height="6" rx="3" fill="' + C.grey2 + '"/>' +
      '<rect x="40" y="100" width="126" height="6" rx="3" fill="' + C.grey2 + '"/>' +
      '<rect x="52" y="126" width="100" height="30" rx="6" fill="' + C.amber + '"/>' +
      mark(104, 178, 1.2, C.blue) +
      '</g>' +
      '<rect x="60" y="242" width="280" height="8" rx="4" fill="' + C.grey2 + '"/>');
  };

  A['vehicle'] = function () {
    return wrap('#E9EEF4',
      '<rect x="0" y="222" width="400" height="78" fill="#DDE3EB"/>' +
      '<g transform="translate(26,76)">' +
      '<path d="M12 36h150l44 44h126a14 14 0 0 1 14 14v56a10 10 0 0 1-10 10H10a10 10 0 0 1-10-10V50a14 14 0 0 1 12-14z" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<path d="M26 50h120v30H26z" fill="' + C.blueSky + '"/>' +
      '<path d="M166 52l30 28h-30z" fill="' + C.blueSky + '"/>' +
      '<rect x="212" y="94" width="126" height="54" rx="5" fill="' + C.blue + '"/>' +
      mark(240, 120, 1.1, 'rgba(255,255,255,.9)') +
      '<rect x="262" y="108" width="64" height="9" rx="4.5" fill="#fff"/>' +
      '<rect x="262" y="124" width="48" height="6" rx="3" fill="rgba(255,255,255,.7)"/>' +
      '<rect x="26" y="96" width="140" height="10" rx="5" fill="' + C.teal + '"/>' +
      '<rect x="26" y="114" width="92" height="7" rx="3.5" fill="' + C.ink2 + '" opacity=".4"/>' +
      '<circle cx="78" cy="150" r="26" fill="' + C.ink + '"/><circle cx="78" cy="150" r="11" fill="#9AA3B2"/>' +
      '<circle cx="282" cy="150" r="26" fill="' + C.ink + '"/><circle cx="282" cy="150" r="11" fill="#9AA3B2"/>' +
      '</g>');
  };

  A['tshirt'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(92,34) scale(1.6)">' +
      '<path d="M44 0 24 8 0 22l12 26 14-7v77a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V41l14 7 12-26L100 8 80 0a20 20 0 0 1-36 0z" fill="' + C.blue + '"/>' +
      '<path d="M44 0a20 20 0 0 0 36 0l-6-2a15 15 0 0 1-24 0z" fill="rgba(0,0,0,.16)"/>' +
      '<g transform="translate(62,56) scale(1.05)"><circle r="15" fill="none" stroke="#fff" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<rect x="40" y="84" width="44" height="6" rx="3" fill="rgba(255,255,255,.75)"/>' +
      '</g>');
  };

  A['polo'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(92,34) scale(1.6)">' +
      '<path d="M44 0 24 8 0 22l12 26 14-7v77a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V41l14 7 12-26L100 8 80 0 62 18z" fill="#15335C"/>' +
      '<path d="M44 0 62 18 80 0l-7-2-11 12-11-12z" fill="#0E2444"/>' +
      '<path d="M55 16h14v26H55z" fill="#0E2444" opacity=".55"/>' +
      '<circle cx="62" cy="24" r="1.8" fill="#C7D3E3"/><circle cx="62" cy="34" r="1.8" fill="#C7D3E3"/>' +
      '<g transform="translate(90,48) scale(.6)"><circle r="15" fill="none" stroke="#F6A609" stroke-width="3"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="#F6A609" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="#F6A609" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '</g>');
  };

  A['hoodie'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(88,30) scale(1.6)">' +
      '<path d="M44 2 20 10 0 26l14 28 14-8v76a6 6 0 0 0 6 6h56a6 6 0 0 0 6-6V46l14 8 14-28L104 10 80 2z" fill="#3C4454"/>' +
      '<path d="M44 2c0 12 8 18 18 18s18-6 18-18l-8-2c-2 8-6 12-10 12s-8-4-10-12z" fill="#2B3240"/>' +
      '<path d="M46 0c-6 6-8 14-8 22h48c0-8-2-16-8-22z" fill="#2B3240"/>' +
      '<path d="M56 20v26M68 20v26" stroke="#AEB6C4" stroke-width="2.4" stroke-linecap="round"/>' +
      '<rect x="36" y="78" width="52" height="22" rx="5" fill="#2B3240"/>' +
      '<g transform="translate(92,44) scale(.55)"><circle r="15" fill="none" stroke="#7FB4FF" stroke-width="3"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="#7FB4FF" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="#7FB4FF" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '</g>');
  };

  A['hivis'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(96,32) scale(1.6)">' +
      '<path d="M44 0 24 8 0 22l12 26 14-7v77a6 6 0 0 0 6 6h60a6 6 0 0 0 6-6V41l14 7 12-26L100 8 80 0a20 20 0 0 1-36 0z" fill="#E8F14C"/>' +
      '<rect x="22" y="52" width="80" height="10" fill="#B9C125"/>' +
      '<rect x="22" y="62" width="80" height="14" fill="#EFF4C4"/>' +
      '<rect x="22" y="76" width="80" height="10" fill="#B9C125"/>' +
      '<rect x="38" y="96" width="48" height="7" rx="3.5" fill="#2B3240"/>' +
      '<rect x="46" y="22" width="32" height="7" rx="3.5" fill="#2B3240"/>' +
      '</g>');
  };

  A['tote-mug'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(40,70) scale(1.5)">' +
      '<rect x="0" y="14" width="78" height="72" rx="5" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<path d="M20 14V6a19 11 0 0 1 38 0v8" fill="none" stroke="' + C.ink2 + '" stroke-width="4.5"/>' +
      '<g transform="translate(39,48) scale(.85)"><circle r="15" fill="none" stroke="' + C.blue + '" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="' + C.blue + '" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="' + C.blue + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '</g>' +
      '<g transform="translate(222,106) scale(1.5)">' +
      '<rect x="0" y="0" width="64" height="62" rx="8" fill="' + C.blue + '"/>' +
      '<path d="M64 14h12a14 14 0 0 1 0 28H64z" fill="none" stroke="' + C.blue + '" stroke-width="7"/>' +
      '<rect x="12" y="24" width="40" height="8" rx="4" fill="rgba(255,255,255,.92)"/>' +
      '<rect x="20" y="38" width="24" height="5" rx="2.5" fill="rgba(255,255,255,.6)"/>' +
      '</g>');
  };

  A['letterhead'] = A['stationery'];

  A['ncr'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(66,44)">' +
      '<rect x="18" y="20" width="248" height="190" rx="6" fill="#FFF6E0" stroke="#F0DEB4"/>' +
      '<rect x="9" y="10" width="248" height="190" rx="6" fill="#EAF7FF" stroke="#CDE7F6"/>' +
      '<rect x="0" y="0" width="248" height="190" rx="6" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      mark(36, 36, 1.1, C.blue) +
      '<rect x="64" y="26" width="86" height="9" rx="4.5" fill="' + C.ink + '"/>' +
      '<rect x="180" y="24" width="48" height="14" rx="4" fill="' + C.blue + '"/>' +
      '<rect x="22" y="66" width="204" height="1.5" fill="' + C.grey2 + '"/>' +
      lines(22, 78, 204, 16, 5, C.grey2) +
      '<rect x="150" y="160" width="76" height="10" rx="5" fill="' + C.teal + '"/>' +
      '</g>');
  };

  A['boxes'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(74,56)">' +
      '<path d="M0 54 86 12l86 42-86 42z" fill="' + C.blue + '"/>' +
      '<path d="M0 54v86l86 42v-86z" fill="' + C.blueDark + '"/>' +
      '<path d="M172 54v86l-86 42v-86z" fill="#0F6FE8"/>' +
      '<g transform="translate(86,112) scale(1.3)"><circle r="15" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '</g>' +
      '<g transform="translate(236,150)">' +
      '<path d="M0 30 54 4l54 26-54 26z" fill="#8FBEFF"/>' +
      '<path d="M0 30v52l54 26V82z" fill="#6AA6F5"/>' +
      '<path d="M108 30v52l-54 26V82z" fill="#A9CEFF"/></g>');
  };

  A['pvc-banner'] = function () {
    return wrap('#E9EEF4',
      '<g transform="translate(34,64)">' +
      '<rect width="332" height="172" rx="5" fill="' + C.blue + '"/>' +
      '<path d="M0 100l332-56v128H0z" fill="rgba(0,0,0,.08)"/>' +
      '<rect x="30" y="34" width="176" height="18" rx="9" fill="#fff"/>' +
      '<rect x="30" y="64" width="120" height="10" rx="5" fill="rgba(255,255,255,.65)"/>' +
      '<rect x="30" y="110" width="104" height="32" rx="6" fill="' + C.amber + '"/>' +
      '<g transform="translate(272,86) scale(1.7)"><circle r="15" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<circle cx="12" cy="12" r="4.5" fill="#E9EEF4"/><circle cx="320" cy="12" r="4.5" fill="#E9EEF4"/>' +
      '<circle cx="12" cy="160" r="4.5" fill="#E9EEF4"/><circle cx="320" cy="160" r="4.5" fill="#E9EEF4"/>' +
      '<circle cx="166" cy="12" r="4.5" fill="#E9EEF4"/><circle cx="166" cy="160" r="4.5" fill="#E9EEF4"/>' +
      '</g>');
  };

  A['roller-banner'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(140,22)">' +
      '<rect width="120" height="228" rx="3" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<path d="M0 150h120v78H0z" fill="' + C.blueSky + '"/>' +
      '<path d="M0 228v-62l38-22 32 24 26-18 24 18v60z" fill="' + C.blueLt + '"/>' +
      '<g transform="translate(60,42) scale(1.5)"><circle r="15" fill="none" stroke="' + C.blue + '" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="' + C.blue + '" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="' + C.blue + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<rect x="20" y="76" width="80" height="12" rx="6" fill="' + C.ink + '"/>' +
      '<rect x="32" y="96" width="56" height="8" rx="4" fill="' + C.grey + '"/>' +
      '<rect x="34" y="116" width="52" height="20" rx="5" fill="' + C.teal + '"/>' +
      '<rect x="-10" y="228" width="140" height="16" rx="8" fill="' + C.ink2 + '"/>' +
      '<rect x="52" y="244" width="16" height="10" rx="2" fill="' + C.ink + '"/>' +
      '</g>' +
      '<rect x="70" y="262" width="260" height="6" rx="3" fill="' + C.grey2 + '"/>');
  };

  A['mesh-banner'] = function () {
    return wrap('#E9EEF4',
      '<rect x="40" y="56" width="320" height="188" rx="4" fill="' + C.ink + '"/>' +
      '<g opacity=".22" stroke="#fff" stroke-width="1">' +
      (function () { var o = '', i; for (i = 48; i < 360; i += 10) o += '<path d="M' + i + ' 56v188"/>'; for (i = 64; i < 244; i += 10) o += '<path d="M40 ' + i + 'h320"/>'; return o; })() +
      '</g>' +
      '<rect x="74" y="98" width="180" height="20" rx="10" fill="#fff"/>' +
      '<rect x="74" y="130" width="120" height="11" rx="5.5" fill="' + C.amber + '"/>' +
      '<rect x="74" y="168" width="150" height="8" rx="4" fill="rgba(255,255,255,.45)"/>' +
      '<rect x="36" y="48" width="328" height="10" rx="5" fill="' + C.grey + '"/>' +
      '<rect x="36" y="242" width="328" height="10" rx="5" fill="' + C.grey + '"/>');
  };

  A['event-display'] = function () {
    return wrap(C.greyLt,
      '<path d="M40 70h150v170H40z" fill="' + C.blue + '" />' +
      '<path d="M190 48h170v192H190z" fill="' + C.blueDark + '"/>' +
      '<g transform="translate(70,110)"><rect width="96" height="14" rx="7" fill="#fff"/>' +
      '<rect y="26" width="64" height="9" rx="4.5" fill="rgba(255,255,255,.6)"/></g>' +
      '<g transform="translate(276,128) scale(1.8)"><circle r="15" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<rect x="100" y="240" width="220" height="30" rx="4" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      '<rect x="120" y="250" width="110" height="10" rx="5" fill="' + C.teal + '"/>');
  };

  A['die-cut'] = A['stickers'];
  A['sticker-roll'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(60,70)">' +
      '<circle cx="96" cy="80" r="80" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<circle cx="96" cy="80" r="56" fill="' + C.blueSky + '"/>' +
      '<circle cx="96" cy="80" r="22" fill="' + C.white + '" stroke="' + C.grey + '" stroke-width="2"/>' +
      '<path d="M176 60c40-6 80-4 112 8l-6 30c-30-10-66-12-106-6z" fill="' + C.blue + '"/>' +
      '<g transform="translate(236,78)"><circle r="12" fill="none" stroke="#fff" stroke-width="2"/></g>' +
      '<path d="M176 60a80 80 0 0 1 0 32z" fill="' + C.blueDark + '"/>' +
      '<circle cx="96" cy="80" r="70" fill="none" stroke="' + C.blue + '" stroke-width="1.6" stroke-dasharray="7 7"/>' +
      '</g>');
  };
  A['product-label'] = function () {
    return wrap(C.greyLt,
      '<g transform="translate(98,40)">' +
      '<path d="M0 30a30 30 0 0 1 30-30h144a30 30 0 0 1 30 30v160a30 30 0 0 1-30 30H30a30 30 0 0 1-30-30z" fill="' + C.teal + '"/>' +
      '<path d="M14 42a20 20 0 0 1 20-20h136a20 20 0 0 1 20 20v136a20 20 0 0 1-20 20H34a20 20 0 0 1-20-20z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="6 6"/>' +
      '<g transform="translate(102,80) scale(1.4)"><circle r="15" fill="none" stroke="#fff" stroke-width="2.4"/>' +
      '<path d="M-7.5 -8 v8.5a7.5 7.5 0 0 0 15 0V-8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M2 -8h4.5a4 4 0 0 1 0 8H2m3 0 5 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<rect x="48" y="122" width="108" height="12" rx="6" fill="#fff"/>' +
      '<rect x="68" y="144" width="68" height="8" rx="4" fill="rgba(255,255,255,.65)"/>' +
      '<rect x="62" y="172" width="80" height="22" rx="4" fill="rgba(255,255,255,.9)"/>' +
      '</g>');
  };

  A['fascia'] = A['signs'];

  /* hero collage pieces ---------------------------------------------------- */
  A['hero-cards'] = A['business-cards'];
  A['hero-banner'] = A['roller-banner'];
  A['hero-sign'] = A['signs'];
  A['hero-wear'] = A['tshirt'];

  /* generic fallback ------------------------------------------------------- */
  A['default'] = function () {
    return wrap(C.greyLt,
      '<rect x="80" y="70" width="240" height="160" rx="10" fill="' + C.white + '" stroke="' + C.grey + '"/>' +
      mark(200, 134, 2.2, C.blue) +
      '<rect x="140" y="178" width="120" height="10" rx="5" fill="' + C.grey2 + '"/>');
  };

  function get(key) { return (A[key] || A['default'])(); }

  global.URArt = { get: get, keys: Object.keys(A), palette: C, mark: mark };
})(window);
