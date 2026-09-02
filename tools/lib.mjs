#!/usr/bin/env node
/**
 * Общая часть сборки: настройки сайта, каркас страницы, повторяющиеся блоки.
 * Точка входа — tools/build.mjs. Зависимостей нет, только встроенные модули Node.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'docs');
const SITE = {
  name: 'Бударова-керамика',
  title: 'Бударова-керамика — авторская керамика из Краснодара',
  desc: 'Триподы майя для какао, сосуды со мхом, зеркала в керамической раме. Ручная работа, каждая вещь в одном экземпляре. Краснодар.',
  base: '/keramika',
  origin: 'https://alexmfv-w.github.io',
  tg: 'https://t.me/Budarova_keramika',
  max: 'https://max.ru/channel_kistpero',
  tel: '+79530716785',
  telText: '+7 953 071 67 85',
  vkPersonal: 'https://vk.ru/alenabudarova',
  vkStudio: 'https://vk.ru/kistpero'
};

const CATEGORIES = {
  tripod:   { label: 'Триподы',  note: 'чаши на трёх ножках для какао' },
  mharium:  { label: 'Мхариумы', note: 'керамика с живым или стабилизированным мхом' },
  interior: { label: 'Интерьер', note: 'зеркала, подсвечники, горшки, посуда' },
  uasko:    { label: 'Уаскос',   note: 'свистящие сосуды по доколумбовым образцам' }
};
const AVAIL = {
  in_stock: 'В наличии',
  on_order: 'Под заказ',
  sold: 'Продано'
};

/* ── утилиты ── */
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = (p) => SITE.base + p;
const write = (p, html) => {
  const full = join(OUT, p);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html.trim() + '\n');
};

/** Адаптивная картинка. name — имя без ширины и расширения. */
function img(name, alt, { sizes, ratio, priority = false, cls = '' } = {}) {
  const src = (w) => `${url('/img/')}${name}-${w}.webp`;
  const [rw, rh] = (ratio || '4/5').split('/').map(Number);
  const width = 960;
  const height = Math.round((width * rh) / rw);
  return `<img src="${src(960)}" srcset="${src(480)} 480w, ${src(960)} 960w, ${src(1600)} 1600w"` +
    ` sizes="${sizes || '100vw'}" width="${width}" height="${height}" alt="${esc(alt)}"` +
    (cls ? ` class="${cls}"` : '') +
    (priority ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
}

/* ── общий каркас страницы ── */
function layout({ title, desc, path, body, ogImage, cls = '' }) {
  const nav = [
    ['/catalog/', 'Работы'],
    ['/stories/', 'Истории'],
    ['/about/', 'О мастере'],
    ['/meetings/', 'Встречи'],
    ['/contacts/', 'Контакты']
  ];
  const isCurrent = (href) => path === href || (href !== '/' && path.startsWith(href));
  const navLinks = (extraClass) => nav.map(([href, label]) =>
    `<a href="${url(href)}"${isCurrent(href) ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ');
  const og = ogImage ? `${SITE.origin}${url('/img/')}${ogImage}-1600.webp` : `${SITE.origin}${url('/img/hero-tripods-1600.webp')}`;

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE.origin}${url(path)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${og}">
<meta property="og:url" content="${SITE.origin}${url(path)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${url('/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600&family=Golos+Text:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${url('/css/site.css')}">
</head>
<body${cls ? ` class="${cls}"` : ''}>
<a class="visually-hidden" href="#main">Перейти к содержанию</a>

<header class="wrap topbar">
  <a class="brand" href="${url('/')}">Бударова<i>·</i>керамика</a>
  <nav class="nav" aria-label="Основная навигация">
      ${navLinks()}
  </nav>
  <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-panel">Меню</button>
</header>
<div class="belt" aria-hidden="true"></div>

<div class="nav-panel" id="nav-panel" hidden>
  <div class="nav-panel-top"><button class="nav-toggle" type="button" data-close>Закрыть</button></div>
  <nav aria-label="Меню">
      ${navLinks()}
  </nav>
</div>

<main id="main">
${body}
</main>

<footer class="footer">
  <div class="wrap footer-grid">
    <div>
      <h2>Бударова-керамика</h2>
      <p style="margin-top:1rem;opacity:.8;max-width:34ch">Авторская керамика ручной работы. Краснодар.</p>
    </div>
    <div>
      <h2>Разделы</h2>
      <ul>${nav.map(([href, label]) => `<li><a href="${url(href)}">${label}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2>Связь</h2>
      <ul>
        <li><a href="${SITE.tg}">Telegram</a></li>
        <li><a href="${SITE.max}">MAX</a></li>
        <li><a href="tel:${SITE.tel}">${SITE.telText}</a></li>
      </ul>
    </div>
  </div>
  <p class="wrap footer-note">Алёна Бударова · Краснодар · ${SITE.telText}</p>
</footer>

<div class="sticky-cta">
  <a href="${SITE.tg}">Telegram</a>
  <a href="${SITE.max}">MAX</a>
  <a href="tel:${SITE.tel}">Позвонить</a>
</div>

<script src="${url('/js/site.js')}" defer></script>
</body>
</html>`;
}

/* ── карточка работы для сетки ── */
function card(item) {
  const price = item.price ? `${item.price} ₽` : 'цена по запросу';
  const badge = item.availability === 'sold'
    ? '<span class="badge badge-sold">продано</span>'
    : (item.featured ? '<span class="badge">новое</span>' : '');
  const meta = item.meta || item.dimensions || '';
  return `<a class="card" href="${url('/work/' + item.slug + '/')}" data-cat="${item.category}">
  ${badge}
  ${img(item.images[0], item.title, { ratio: '4/5', sizes: '(min-width:64rem) 22vw, (min-width:44rem) 30vw, 45vw' })}
  <span class="card-body">
    <span class="card-title">${esc(item.title)}</span>
    ${meta ? `<span class="card-meta">${esc(meta)}</span>` : ''}
    <span class="card-price">${esc(item.availability === 'sold' ? 'под заказ' : price)}</span>
  </span>
</a>`;
}

function chips(active = 'all') {
  const all = [['all', 'Все'], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.label])];
  return `<div class="chips" role="group" aria-label="Фильтр по направлениям">
  ${all.map(([k, label]) =>
    `<button type="button" class="chip" data-filter="${k}" aria-pressed="${String(k === active)}">${label}</button>`
  ).join('\n  ')}
</div>`;
}

const shipNote = 'Отправляю Почтой России, СДЭК и Ozon. Доставка не входит в стоимость и оплачивается отдельно. Самовывоз в Краснодаре — по договорённости.';

function contactsBlock() {
  return `<section class="wrap section" id="contacts" aria-labelledby="contacts-h">
  <p class="eyebrow">Связь</p>
  <h2 class="h-section" id="contacts-h">Напишите — договоримся</h2>
  <ul class="clist">
    <li><a href="${SITE.tg}">Telegram <span>канал и заказы</span></a></li>
    <li><a href="${SITE.max}">MAX <span>канал и магазин</span></a></li>
    <li><a href="tel:${SITE.tel}">${SITE.telText} <span>звонок мастеру</span></a></li>
  </ul>
  <p class="work-ship">${shipNote}</p>
</section>`;
}

export { SITE, CATEGORIES, AVAIL, read, json, esc, url, write, img, layout, card, chips, contactsBlock, shipNote, OUT, ROOT };
