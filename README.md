# Сайт-магазин керамики Алёны Бударовой

Статическая витрина-каталог. Продажа идёт в Telegram и MAX, на сайте нет корзины и оплаты.

**Адрес после публикации:** `https://alexmfv-w.github.io/budarova-keramic/`

## Быстрый старт

```bash
node tools/build.mjs                 # собрать сайт в docs/
bash tools/build-images.sh           # пересобрать картинки (нужен cwebp)
```

Локальный просмотр — сайт живёт в подпапке `/budarova-keramic`, поэтому просто открыть файл не получится:

```bash
mkdir -p /tmp/preview && ln -sfn "$PWD/docs" /tmp/preview/budarova-keramic
cd /tmp/preview && python3 -m http.server 8747
# http://localhost:8747/budarova-keramic/
```

## Что где лежит

```
data/            catalog.json · stories.json · meetings.json — весь контент
src/css/         стили, склеиваются в docs/css/site.css по алфавиту имён
src/js/site.js   меню, фильтры, галерея, липкая кнопка связи — 95 строк
tools/lib.mjs    настройки сайта, каркас страницы, повторяющиеся блоки
tools/build.mjs  страницы и запуск сборки
tools/build-images.sh   мастер-копии -> WebP 480/960/1600
tools/make-masters.py   раскладывает исходные фото под имена слагов
images/masters/  мастер-копии, 2000–3000 px
docs/            результат сборки, публикуется на GitHub Pages
```

Зависимостей нет: только Node, системный `sips` и `cwebp`.

## Как добавить работу

Смотрите `DEPLOY.md`, раздел «Как добавить новую работу». Коротко: фото в `images/masters/`,
запись в `data/catalog.json`, две команды, `git push`.

## Рабочие файлы проекта

| Файл | О чём |
|---|---|
| `CLAUDE.md` | процесс и правила работы над проектом |
| `ANALYSIS_NOTES.md` | что нашлось в исходных материалах |
| `DESIGN_NOTES.md` | дизайн-направление, палитра, шрифты |
| `PHOTO_INVENTORY.md` | разбор всех фотографий |
| `PHOTO_PIPELINE.md` | как готовить фото |
| `SITE_TEXTS.md` | тексты сайта |
| `ARCHITECTURE.md` | структура и решения |
| `DEPLOY.md` | публикация и обновление |
