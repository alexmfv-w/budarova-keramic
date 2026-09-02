#!/usr/bin/env node
/**
 * Сборка сайта «Бударова-керамика».
 * Читает data/*.json и src/, кладёт готовую статику в docs/.
 * Запуск: node tools/build.mjs
 * Зависимостей нет — только встроенные модули Node.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import {
  SITE, CATEGORIES, AVAIL, json, esc, url, write, img,
  layout, card, chips, contactsBlock, shipNote, OUT, ROOT
} from './lib.mjs';

const catalog = json('data/catalog.json');
const stories = json('data/stories.json');
const meetings = json('data/meetings.json');
const items = catalog.items;

/* ═══ ГЛАВНАЯ ═══ */
function pageHome() {
  const featured = items.filter((i) => i.featured).slice(0, 8);

  const ribbon = (o) => `<section class="ribbon${o.flip ? ' flip' : ''}" aria-labelledby="${o.id}">
  ${img(o.image, o.alt, { ratio: '4/3', sizes: '(min-width:52rem) 50vw, 100vw' })}
  <div class="ribbon-body">
    <p class="eyebrow">${o.eyebrow}</p>
    <h2 class="h-block" id="${o.id}">${o.title}</h2>
    <p>${o.text}</p>
    ${o.note ? `<p class="note-ochre">${o.note}</p>` : ''}
    <a class="link-more" href="${o.href}">${o.link} →</a>
  </div>
</section>`;

  const body = `
<span data-cta-sentinel aria-hidden="true"></span>

<section class="hero">
  <figure class="hero-figure">
    ${img('hero-tripods', 'Девять керамических триподов с росписью, сложенных горкой', { ratio: '16/9', sizes: '100vw', priority: true })}
  </figure>
  <div class="hero-body">
    <p class="eyebrow">Алёна Бударова · Краснодар</p>
    <h1>Керамика, которую <mark>делали до нас</mark></h1>
    <p class="hero-sub">Триподы майя для какао, сосуды со мхом, зеркала в керамической раме. Каждая вещь в одном экземпляре — второй такой не будет.</p>
    <div class="hero-actions">
      <a class="btn btn-solid" href="${url('/catalog/')}">Смотреть работы</a>
      <a class="btn" href="${SITE.tg}">Написать в Telegram</a>
    </div>
  </div>
</section>

<section class="manifest">
  <div class="wrap manifest-in">
    <q>У чая своя чашка, у эспрессо своя. А у какао своей посуды не осталось.</q>
    <p>Майя и ацтеки пили какао из чаш на трёх ножках — и считали какао-бобы физическим проявлением Кетцалькоатля, бога мудрости. Я возвращаю напитку его посуду.</p>
  </div>
</section>
<div class="belt" aria-hidden="true"></div>

${ribbon({
    id: 'dir-tripod', flip: true, image: 'dir-tripods',
    alt: 'Трипод с треугольным орнаментом охрой и красным',
    eyebrow: 'Триподы', title: 'Посуда для напитка богов',
    text: 'Бобы мололи, разводили холодной водой и взбивали до пены. Полихромные чаши на трёх ножках были роскошью — их ставили на пирах и в ритуалах. Объёмы от 150 до 400 мл.',
    href: url('/catalog/?c=tripod'), link: 'Смотреть триподы'
  })}
<div class="belt-thin" aria-hidden="true"></div>

${ribbon({
    id: 'dir-mharium', image: 'dir-mhariums',
    alt: 'Два керамических мхариума со мхом на блюдцах',
    eyebrow: 'Мхариумы', title: 'Керамика и мох',
    text: 'Сосуд, в котором живёт мох — живой или стабилизированный. Один и тот же мхариум работает подсвечником, курительницей и ёмкостью для украшений. Многофункциональный индеец.',
    href: url('/catalog/?c=mharium'), link: 'Смотреть мхариумы'
  })}
<div class="belt-thin" aria-hidden="true"></div>

${ribbon({
    id: 'dir-interior', flip: true, image: 'dir-interior',
    alt: 'Зеркало в керамической раме с ягуаром',
    eyebrow: 'Интерьер', title: 'Зеркала, подсвечники, горшки',
    text: 'Рама собирается из отдельных плиток: ягуар, волна, листья — рисунок процарапан по сырой глине. Такие вещи делаются в одном экземпляре и обычно уезжают сразу.',
    href: url('/catalog/?c=interior'), link: 'Смотреть интерьер'
  })}
<div class="belt" aria-hidden="true"></div>

<section class="wrap section" id="kiln" aria-labelledby="kiln-h">
  <div class="sechead">
    <div>
      <p class="eyebrow">Свежее из печи</p>
      <h2 class="h-section" id="kiln-h">Из последнего обжига</h2>
    </div>
    <p class="sechead-note">Обновляю раздел после каждого обжига.<br>Что уехало — уберу, что вышло из печи — добавлю.</p>
  </div>
  ${chips()}
  <div class="grid">
    ${featured.map(card).join('\n    ')}
  </div>
  <p class="catalog-empty" hidden>В этом направлении сейчас ничего нет. <a href="${url('/catalog/')}">Посмотрите весь каталог</a>.</p>
  <p style="margin-top:2rem"><a class="btn" href="${url('/catalog/')}">Все работы</a></p>
</section>
<div class="belt" aria-hidden="true"></div>

<section class="section" aria-labelledby="about-h">
  <div class="wrap panel">
    <figure class="panel-figure">
      ${img('master-portrait', 'Алёна Бударова за столом со своими работами', { ratio: '4/5', sizes: '(min-width:58rem) 45vw, 100vw' })}
    </figure>
    <div class="panel-body panel-clay">
      <p class="eyebrow">О мастере</p>
      <h2 class="h-block" id="about-h">Алёна Бударова</h2>
      <p class="panel-quote">«Совершенству в керамике нет предела»</p>
      <p class="txt">Художник-керамист из Краснодара. Основала изостудию «Кисть и Перо», где ведёт занятия для детей и взрослых. Керамика — отдельная линия работы: триподы, мхариумы, зеркала, посуда.</p>
      <a class="btn btn-light" href="${url('/about/')}">Подробнее о мастере</a>
    </div>
  </div>
</section>

<section class="section-tight" aria-labelledby="meet-h">
  <div class="wrap panel">
    <figure class="panel-figure">
      ${img('meetings', 'Участница мастер-класса процарапывает рисунок на керамической тарелке', { ratio: '4/5', sizes: '(min-width:58rem) 45vw, 100vw' })}
    </figure>
    <div class="panel-body panel-glaze">
      <p class="eyebrow">Встречи</p>
      <h2 class="h-block" id="meet-h">Мастер-классы в студии</h2>
      <p class="txt">Занятия по керамике в студии «Кисть и Перо» в Краснодаре — для детей и взрослых.</p>
      <a class="btn btn-light" href="${url('/meetings/')}">Узнать даты</a>
    </div>
  </div>
</section>
<div class="belt-thin" aria-hidden="true"></div>

${contactsBlock()}`;

  return layout({
    title: SITE.title, desc: SITE.desc, path: '/', body, ogImage: 'hero-tripods'
  });
}

/* ═══ КАТАЛОГ ═══ */
function pageCatalog() {
  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<section class="wrap section" aria-labelledby="cat-h">
  <p class="eyebrow">Каталог</p>
  <h1 class="h-section" id="cat-h">Работы</h1>
  <p class="catalog-intro">Этнические мотивы, современные материалы, гармония формы и орнамента, воплощённые в керамике по воле мастера.</p>
  <p class="catalog-intro">Каждая работа только в одном экземпляре. Похожие, в одном стиле, но двух одинаковых не найти. Уточняйте — вышлю фото конкретно того, что есть на данный момент. Возможны авторские повторы купленных работ.</p>
  <div style="margin-top:2rem">${chips()}</div>
  <div class="grid">
    ${items.map(card).join('\n    ')}
  </div>
  <p class="catalog-empty" hidden>В этом направлении сейчас ничего нет. Напишите — расскажу, что готовится.</p>
</section>
<div class="belt" aria-hidden="true"></div>
${contactsBlock()}`;

  return layout({
    title: 'Работы — ' + SITE.name,
    desc: 'Каталог авторской керамики Алёны Бударовой: триподы для какао, мхариумы, уаскос, зеркала, подсвечники и посуда.',
    path: '/catalog/', body, ogImage: 'dir-tripods'
  });
}

/* ═══ КАРТОЧКА РАБОТЫ ═══ */
function pageWork(item) {
  const cat = CATEGORIES[item.category];
  const price = item.price ? `${item.price} ₽` : 'Цена по запросу';
  const sold = item.availability === 'sold';

  const specs = [
    ['Направление', cat.label],
    ['Размеры', item.dimensions],
    ['Материалы', item.materials],
    ['Уход', item.care]
  ].filter(([, v]) => v);

  const thumbs = item.images.length > 1 ? `<div class="gallery-strip">
      ${item.images.map((name, i) => `<button type="button" class="gallery-thumb" aria-current="${i === 0}"
        data-src="${url('/img/')}${name}-960.webp"
        data-srcset="${url('/img/')}${name}-480.webp 480w, ${url('/img/')}${name}-960.webp 960w, ${url('/img/')}${name}-1600.webp 1600w"
        data-alt="${esc(item.title)}, кадр ${i + 1}">
        <img src="${url('/img/')}${name}-480.webp" alt="Показать кадр ${i + 1}" width="480" height="480" loading="lazy">
      </button>`).join('\n      ')}
    </div>` : '';

  const similar = items
    .filter((i) => i.category === item.category && i.slug !== item.slug)
    .slice(0, 4);

  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<section class="wrap work">
  <p style="margin-bottom:1.5rem"><a class="link-more" href="${url('/catalog/?c=' + item.category)}">← ${cat.label}</a></p>
  <div class="work-layout">
    <div class="gallery">
      <figure class="gallery-main">
        ${item.images.length
          ? img(item.images[0], item.title, { ratio: '4/5', sizes: '(min-width:58rem) 55vw, 100vw', priority: true })
          : '<div class="photo-soon"><span>Фотографии скоро</span></div>'}
      </figure>
      ${thumbs}
    </div>
    <div class="work-head">
      <p class="work-cat">${cat.label}</p>
      <h1>${esc(item.title)}</h1>
      <p class="work-price">${esc(sold ? 'Продано' : price)}</p>
      <p class="work-status${sold ? ' is-sold' : ''}">${AVAIL[item.availability]}</p>
      ${item.story ? `<p class="work-story">${esc(item.story)}</p>` : ''}
      <div class="work-cta">
        <a class="btn btn-solid" href="${SITE.tg}">${sold ? 'Сделать похожую' : 'Написать о работе'}</a>
        <a class="btn" href="tel:${SITE.tel}">Позвонить</a>
      </div>
      <p class="work-hint">Напишите в сообщении название — <b>${esc(item.title)}</b>, чтобы сразу было понятно, о какой работе речь.</p>
      ${specs.length ? `<ul class="specs">
        ${specs.map(([k, v]) => `<li><span class="k">${esc(k)}</span><span>${esc(v)}</span></li>`).join('\n        ')}
      </ul>` : ''}
      ${item.ritual_usage ? `<div class="work-ritual">
        <p class="eyebrow">Как этим пользовались</p>
        <p>${esc(item.ritual_usage)}</p>
      </div>` : ''}
      ${item.food_note ? `<p class="work-note">Внутренняя поверхность и край покрыты глазурью, допущенной к контакту с пищевыми продуктами. При этом изделие имеет декоративно-сувенирный характер и не является посудой.</p>` : ''}
      <p class="work-ship">${shipNote}</p>
    </div>
  </div>
</section>

${similar.length ? `<div class="belt-thin" aria-hidden="true"></div>
<section class="wrap section" aria-labelledby="similar-h">
  <h2 class="h-block" id="similar-h">Похожие работы</h2>
  <div class="grid" style="margin-top:1.5rem">
    ${similar.map(card).join('\n    ')}
  </div>
</section>` : ''}`;

  return layout({
    title: `${item.title} — ${SITE.name}`,
    desc: (item.story || `${item.title} — авторская керамика Алёны Бударовой.`).slice(0, 180),
    path: `/work/${item.slug}/`, body, ogImage: item.images[0] || 'hero-tripods'
  });
}

/* ═══ О МАСТЕРЕ ═══ */
function pageAbout() {
  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<section class="wrap about-page">
  <p class="eyebrow">О мастере</p>
  <h1 class="h-section">Алёна Бударова</h1>
  <p class="about-lead">Художник-керамист из Краснодара. Основатель изостудии «Кисть и Перо».</p>
</section>

<section class="section-tight">
  <div class="wrap panel">
    <figure class="panel-figure panel-figure-square">
      ${img('about-master', 'Алёна Бударова держит трипод, перед ней поющие сосуды и чаши', { ratio: '1/1', sizes: '(min-width:58rem) 45vw, 100vw', priority: true })}
    </figure>
    <div class="panel-body panel-clay">
      <p class="eyebrow">Своими словами</p>
      <p class="panel-quote">«Совершенству в керамике нет предела»</p>
      <p class="txt">Изостудия «Кисть и Перо» — это занятия рисунком и керамикой для детей и взрослых. Керамика выросла из студии в отдельную линию работы: сначала пробы, потом заказы, потом целые серии.</p>
    </div>
  </div>
</section>
<div class="belt-thin" aria-hidden="true"></div>

<section class="wrap section">
  <div class="prose">
    <h2>Как это делается</h2>
    <p class="plain">Сознание мастера — это фильтр, который выделяет из окружающего мира особенные звуки, тени, образы, чувства и формирует идею, которую остаётся только воплотить в керамике.</p>
    <p>Технологический процесс выстроен с учётом свойств материалов: всё в своё время, без спешки, ни раньше и ни позже.</p>
    <p>Безопасные качественные материалы, профессиональная печь для обжига.</p>
  </div>
</section>

<section class="wrap section-tight">
  <div class="duo">
    <figure>${img('process-raw', 'Партия триподов сохнет на доске перед обжигом', { ratio: '1/1', sizes: '(min-width:52rem) 45vw, 100vw' })}
      <figcaption>Партия триподов перед началом декорирования.</figcaption></figure>
    <figure>${img('process-decor', 'Руки мастера держат трипод с процарапанным орнаментом, рядом инструмент и кисть', { ratio: '1/1', sizes: '(min-width:52rem) 45vw, 100vw' })}
      <figcaption>Работа с декором: линия за линией, отменить нельзя.</figcaption></figure>
  </div>
</section>
<div class="belt" aria-hidden="true"></div>
${contactsBlock()}`;

  return layout({
    title: 'О мастере — ' + SITE.name,
    desc: 'Алёна Бударова — художник-керамист из Краснодара, основатель изостудии «Кисть и Перо». Как рождается идея и как делается роспись по сырой глине.',
    path: '/about/', body, ogImage: 'about-master'
  });
}

/* ═══ ВСТРЕЧИ ═══ */
function pageMeetings() {
  const list = meetings.items.length
    ? `<ul class="meet-list">${meetings.items.map((m) =>
        `<li><strong>${esc(m.title)}</strong> — ${esc(m.date)}${m.place ? ', ' + esc(m.place) : ''}${m.note ? `<br>${esc(m.note)}` : ''}</li>`
      ).join('')}</ul>`
    : `<p class="txt">Ближайшие даты объявляю в Telegram и MAX. Напишите — расскажу, что готовится.</p>`;

  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<section class="wrap about-page">
  <p class="eyebrow">Встречи</p>
  <h1 class="h-section">Мастер-классы в студии</h1>
  <p class="about-lead">Занятия по керамике в изостудии «Кисть и Перо» в Краснодаре — для детей и взрослых.</p>
</section>

<section class="section-tight">
  <div class="wrap panel">
    <figure class="panel-figure">
      ${img('meetings', 'Участница мастер-класса процарапывает рисунок на керамической тарелке', { ratio: '4/5', sizes: '(min-width:58rem) 45vw, 100vw', priority: true })}
    </figure>
    <div class="panel-body panel-glaze">
      <p class="eyebrow">Что бывает</p>
      <ul class="meet-list">
        <li>Мастер-классы по керамике для детей и взрослых — в студии</li>
        <li>Даты и запись — в Telegram и MAX</li>
      </ul>
      <a class="btn btn-light" href="${SITE.tg}">Написать про занятие</a>
    </div>
  </div>
</section>
<div class="belt-thin" aria-hidden="true"></div>

<section class="wrap section">
  <div class="prose">
    <h2>Ближайшие даты</h2>
    ${list}
  </div>
</section>
<div class="belt" aria-hidden="true"></div>
${contactsBlock()}`;

  return layout({
    title: 'Встречи — ' + SITE.name,
    desc: 'Мастер-классы по керамике для детей и взрослых в изостудии «Кисть и Перо» в Краснодаре.',
    path: '/meetings/', body, ogImage: 'meetings'
  });
}

/* ═══ ИСТОРИИ ═══ */
function pageStories() {
  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<section class="wrap section">
  <p class="eyebrow">Истории</p>
  <h1 class="h-section">Про керамику, какао и индейцев</h1>
  <p class="catalog-intro">Откуда взялись триподы, почему уаскос свистят, как делается роспись и по какому рецепту варить какао.</p>
  <div class="stories-grid" style="margin-top:2.5rem">
    ${stories.items.map((s) => `<a class="story-card" href="${url('/stories/' + s.slug + '/')}">
      ${img(s.cover, s.title, { ratio: '3/2', sizes: '(min-width:64rem) 30vw, (min-width:44rem) 45vw, 100vw' })}
      <span class="story-card-body">
        <h2>${esc(s.title)}</h2>
        <p>${esc(s.lead)}</p>
      </span>
    </a>`).join('\n    ')}
  </div>
</section>
<div class="belt" aria-hidden="true"></div>
${contactsBlock()}`;

  return layout({
    title: 'Истории — ' + SITE.name,
    desc: 'Уаскос, триподы майя, какао как валюта, рецепт какао с финиками и как рождается роспись по сырой глине.',
    path: '/stories/', body, ogImage: 'story-tripods'
  });
}

/** Блок истории: строка — абзац; {h} — подзаголовок; {callout} — выделенная мысль;
 *  {cards} — нумерованные карточки. */
function storyBlock(b) {
  if (typeof b === 'string') return `<p>${esc(b)}</p>`;
  if (b.h) return `<h2 class="article-h">${esc(b.h)}</h2>`;
  if (b.callout) return `<aside class="article-callout"><p>${esc(b.callout)}</p></aside>`;
  if (b.cards) return `<ol class="numbered">
      ${b.cards.map((c) => `<li class="numbered-item">
        <span class="numbered-n" aria-hidden="true">${esc(c.n)}</span>
        <span class="numbered-text"><b>${esc(c.t)}</b><span>${esc(c.p)}</span></span>
      </li>`).join('\n      ')}
    </ol>`;
  return '';
}

function pageStory(story) {
  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<article class="article">
  <div class="article-hero">
    <figure class="article-cover">
      ${img(story.cover, story.title, { ratio: '3/2', sizes: '100vw', priority: true })}
    </figure>
    <div class="article-head">
      <p class="eyebrow">Истории</p>
      <h1>${esc(story.title)}</h1>
      <p class="article-lead">${esc(story.lead)}</p>
    </div>
  </div>
  <div class="wrap">
    <div class="article-body">
      ${story.body.map(storyBlock).join('\n      ')}
      <p><a class="article-back" href="${url('/stories/')}">← Все истории</a></p>
    </div>
  </div>
</article>
<div class="belt" aria-hidden="true"></div>
${contactsBlock()}`;

  return layout({
    title: `${story.title} — ${SITE.name}`,
    desc: story.lead,
    path: `/stories/${story.slug}/`, body, ogImage: story.cover
  });
}

/* ═══ КОНТАКТЫ И FAQ ═══ */
function pageContacts() {
  const faq = [
    ['Как купить?', 'Напишите в Telegram или MAX либо позвоните. Скажите, какая работа нужна — договоримся об оплате и отправке. Корзины и оплаты на сайте нет: каждая вещь в одном экземпляре, проще обсудить лично.'],
    ['Сколько стоит?', 'Триподы — 1500 ₽ за чашу, объёмы от 150 до 400 мл. Триподы с объёмным декором — 2000 ₽. Мхариумы — от 1000 до 2000 ₽, блюда и тарелки — 3000 ₽. По остальным работам цену называю в переписке.'],
    ['Как отправляете?', 'Почтой России, СДЭК или Ozon — как вам удобнее. Доставка не входит в стоимость работы и оплачивается отдельно.'],
    ['Можно забрать самому?', 'Да, в Краснодаре. Напишите, договоримся о месте и времени.'],
    ['Упаковка не разобьётся?', 'Керамику упаковываю в коробку с бумажным наполнителем.'],
    ['Можно заказать свою вещь?', 'Да. Присылайте референс, фотографию или просто опишите идею — обсудим форму, роспись и размер.'],
    ['Что если работа уже продана?', 'Напишите: повторить один в один не получится, каждая вещь уникальна, но сделаю похожую.'],
    ['Из этого можно пить и есть?', 'Внутренняя поверхность и край покрыты глазурью, допущенной к контакту с пищевыми продуктами. При этом изделия имеют декоративно-сувенирный характер и не являются посудой.']
  ];

  const body = `
<span data-cta-sentinel aria-hidden="true"></span>
<section class="wrap about-page">
  <p class="eyebrow">Связь</p>
  <h1 class="h-section">Напишите — договоримся</h1>
  <p class="about-lead">Отвечаю в Telegram и MAX, можно просто позвонить.</p>
  <ul class="clist">
    <li><a href="${SITE.tg}">Telegram <span>канал и заказы</span></a></li>
    <li><a href="${SITE.max}">MAX <span>канал и магазин</span></a></li>
    <li><a href="tel:${SITE.tel}">${SITE.telText} <span>звонок мастеру</span></a></li>
  </ul>
  <p class="work-ship">Ещё есть ВКонтакте: <a href="${SITE.vkPersonal}">личная страница</a> и <a href="${SITE.vkStudio}">страница студии «Кисть и Перо»</a>.</p>
</section>

<section class="wrap section">
  <h2 class="h-block">Частые вопросы</h2>
  <div class="faq">
    ${faq.map(([q, a]) => `<details>
      <summary>${esc(q)}</summary>
      <p>${a}</p>
    </details>`).join('\n    ')}
  </div>
</section>

<section class="section-tight">
  <div class="wrap panel">
    <figure class="panel-figure">
      ${img('packing', 'Керамическая тарелка, упакованная в коробку с бумажным наполнителем', { ratio: '4/5', sizes: '(min-width:58rem) 45vw, 100vw' })}
    </figure>
    <div class="panel-body panel-clay">
      <p class="eyebrow">Доставка</p>
      <h2 class="h-block">Как работа доедет</h2>
      <p class="txt">${shipNote}</p>
    </div>
  </div>
</section>`;

  return layout({
    title: 'Контакты — ' + SITE.name,
    desc: 'Как купить керамику Алёны Бударовой: Telegram, MAX, телефон +7 953 071 67 85. Доставка Почтой, СДЭК и Ozon, самовывоз в Краснодаре.',
    path: '/contacts/', body, ogImage: 'packing'
  });
}

/* ═══ 404 ═══ */
function page404() {
  const body = `
<section class="wrap notfound">
  <h1>Здесь пусто</h1>
  <p>Такой страницы нет — возможно, работа уже уехала к новому владельцу.</p>
  <p><a class="btn btn-solid" href="${url('/catalog/')}">Посмотреть работы</a></p>
</section>`;
  return layout({ title: 'Страница не найдена — ' + SITE.name, desc: 'Страница не найдена.', path: '/404', body });
}

/* ═══ СБОРКА ═══ */
function buildCss() {
  const files = readdirSync(join(ROOT, 'src/css')).filter((f) => f.endsWith('.css')).sort();
  const css = files.map((f) => `/* ── ${f} ── */\n` + readFileSync(join(ROOT, 'src/css', f), 'utf8')).join('\n');
  write('css/site.css', css);
  return files.length;
}

function buildSitemap(paths) {
  const body = paths.map((p) => `  <url><loc>${SITE.origin}${url(p)}</loc></url>`).join('\n');
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}${url('/sitemap.xml')}\n`);
}

function favicon() {
  write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
<rect width="40" height="40" fill="#F7F0E1"/>
<path d="M0 34 10 12 20 34Z" fill="#A8452C"/>
<path d="M20 34 30 12 40 34Z" fill="#3B2419"/>
<rect y="34" width="40" height="6" fill="#D9A047"/>
</svg>`);
}

function main() {
  const started = Date.now();
  if (existsSync(OUT)) {
    for (const entry of readdirSync(OUT)) {
      // img и CNAME не трогаем: первое долго собирается, второе держит свой домен
      if (entry !== 'img' && entry !== 'CNAME') rmSync(join(OUT, entry), { recursive: true, force: true });
    }
  }

  const paths = ['/', '/catalog/', '/about/', '/meetings/', '/stories/', '/contacts/'];

  write('index.html', pageHome());
  write('catalog/index.html', pageCatalog());
  write('about/index.html', pageAbout());
  write('meetings/index.html', pageMeetings());
  write('stories/index.html', pageStories());
  write('contacts/index.html', pageContacts());
  write('404.html', page404());

  for (const item of items) {
    write(`work/${item.slug}/index.html`, pageWork(item));
    paths.push(`/work/${item.slug}/`);
  }
  for (const story of stories.items) {
    write(`stories/${story.slug}/index.html`, pageStory(story));
    paths.push(`/stories/${story.slug}/`);
  }

  const cssFiles = buildCss();
  cpSync(join(ROOT, 'src/js/site.js'), join(OUT, 'js/site.js'), { force: true });
  favicon();
  buildSitemap(paths);
  write('.nojekyll', '');

  // Свой домен: CNAME пишем из настроек, чтобы он не расходился с путями в HTML
  const cnamePath = join(OUT, 'CNAME');
  if (SITE.domain) {
    writeFileSync(cnamePath, SITE.domain + '\n');
  } else if (existsSync(cnamePath)) {
    const current = readFileSync(cnamePath, 'utf8').trim();
    console.warn(`\nВНИМАНИЕ: в docs/CNAME указан домен ${current}, но DOMAIN в tools/lib.mjs = null.`);
    console.warn(`Сейчас все пути собраны для /keramika и на своём домене работать не будут.`);
    console.warn(`Впишите домен в DOMAIN и пересоберите.\n`);
  }

  const missing = [];
  for (const item of items) {
    for (const name of item.images) {
      for (const w of [480, 960, 1600]) {
        if (!existsSync(join(OUT, 'img', `${name}-${w}.webp`))) missing.push(`${name}-${w}.webp`);
      }
    }
  }

  console.log(`страниц: ${paths.length + 1}  ·  работ: ${items.length}  ·  историй: ${stories.items.length}  ·  css-файлов склеено: ${cssFiles}`);
  console.log(`собрано за ${Date.now() - started} мс -> docs/`);
  if (missing.length) {
    console.log('НЕТ КАРТИНОК (запустите bash tools/build-images.sh):');
    missing.slice(0, 10).forEach((m) => console.log('  ', m));
    process.exitCode = 1;
  }
}

main();
