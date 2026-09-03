#!/usr/bin/env node
/**
 * Локальный просмотр сайта. Зависимостей нет, только встроенный http Node.
 * Запуск:  node tools/serve.mjs [порт]
 *
 * Зачем отдельный скрипт, а не «открыть docs/index.html двойным щелчком»:
 * все ссылки и картинки на сайте абсолютные и начинаются с /budarova-keramic/
 * (так требует GitHub Pages, сайт живёт в подпапке). При открытии файла
 * напрямую браузер ищет эту папку в корне диска и не находит — страница
 * получается без стилей и без фотографий. Сервер подставляет папку правильно.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DOCS = join(ROOT, 'docs');
const BASE = '/budarova-keramic';          // должно совпадать с REPO в tools/lib.mjs
const PORT = Number(process.argv[2]) || 8747;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

async function fileFor(urlPath) {
  // отрезаем базовый префикс: /budarova-keramic/catalog/ -> /catalog/
  let rel = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  if (rel === BASE) return { redirect: BASE + '/' };
  if (!rel.startsWith(BASE + '/')) return null;
  rel = rel.slice(BASE.length);

  const target = resolve(join(DOCS, rel));
  // защита от выхода за пределы docs/ через ../
  if (target !== DOCS && !target.startsWith(DOCS + sep)) return null;

  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      if (!rel.endsWith('/')) return { redirect: BASE + rel + '/' };
      return { path: join(target, 'index.html') };
    }
    return { path: target };
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const found = await fileFor(req.url);

  if (found?.redirect) {
    res.writeHead(302, { Location: found.redirect });
    return res.end();
  }
  if (!req.url.startsWith(BASE)) {
    res.writeHead(302, { Location: BASE + '/' });
    return res.end();
  }

  try {
    const body = await readFile(found.path);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(found.path)] || 'application/octet-stream',
      'Cache-Control': 'no-store'          // чтобы после пересборки не показывалось старое
    });
    res.end(body);
  } catch {
    // ту же страницу «не найдено» покажет и GitHub Pages
    let page = 'Не найдено';
    try { page = await readFile(join(DOCS, '404.html')); } catch { /* и без неё сойдёт */ }
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  }
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\nПорт ${PORT} занят — на нём уже что-то работает.`);
    console.error(`Возьмите другой:  node tools/serve.mjs ${PORT + 1}\n`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, () => {
  console.log(`\n  Сайт открыт:  http://localhost:${PORT}${BASE}/`);
  console.log('  Остановить:   Ctrl+C');
  console.log('  После правок: node tools/build.mjs — и обновите страницу\n');
});
