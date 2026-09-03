#!/usr/bin/env python3
"""Второй проход по правкам (цикл 03.09.2026).

Делает три вещи:
1. срезает белую рамку у фотографий, присланных «скриншотом с полями»;
2. подставляет нормальные снимки туда, где по ошибке лежало фото экрана;
3. добавляет кадры, которые заказчик прислал, а в каталог они не попали.
Запуск: python3 tools/make-masters-edits2.py
"""
import subprocess, os, sys

EDITS = 'customers_edits/photo'
OUT = 'images/masters'
MAX = 2400

def dims(p):
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', p],
                       capture_output=True, text=True).stdout
    w = h = 0
    for line in r.splitlines():
        if 'pixelWidth' in line: w = int(line.split(':')[1])
        if 'pixelHeight' in line: h = int(line.split(':')[1])
    return w, h

def make(dst, src, trim=0, tall=None):
    """trim — сколько пикселей белого поля срезать с каждой стороны."""
    if not os.path.exists(src):
        print('НЕТ ИСХОДНИКА:', src); return False
    out = os.path.join(OUT, dst + '.jpg')
    tmp = out + '.tmp.jpg'
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '95',
                    src, '--out', tmp], capture_output=True, check=True)
    if trim:
        w, h = dims(tmp)
        subprocess.run(['sips', '-c', str(h - 2 * trim), str(w - 2 * trim), tmp],
                       capture_output=True, check=True)
    subprocess.run(['sips', '-Z', str(MAX), '-s', 'formatOptions', '92', tmp, '--out', out],
                   capture_output=True, check=True)
    os.remove(tmp)
    return True

# (куда, откуда, срезать белое поле)
JOBS = [
    # ── картинки направлений на главной ────────────────────────────────
    # триподы: было размытое макро одной чаши, стала вся партия
    ('dir-tripods',  f'{EDITS}/photo4_3.jpg', 0),
    # мхариумы: было фото удалённой из каталога красной работы
    ('dir-mhariums', f'{OUT}/story-mharium.jpg', 72),
    # интерьер: фронтальный кадр зеркала вместо тёмного ракурса
    ('dir-interior', f'{OUT}/_unused/zerkalo-yaguar-01.jpg', 0),

    # ── зеркало «Бестиарий»: в карточке лежало фото монитора ───────────
    ('zerkalo-bestiariy-01', f'{OUT}/_unused/zerkalo-yaguar-01.jpg', 0),
    ('zerkalo-bestiariy-02', f'{OUT}/_unused/zerkalo-yaguar-02.jpg', 0),
    ('zerkalo-bestiariy-03', f'{EDITS}/photo14.jpg', 0),

    # ── белые поля по краям ────────────────────────────────────────────
    ('story-mharium',       f'{OUT}/story-mharium.jpg', 72),
    ('mharium-vityaz-01',   f'{EDITS}/photo5_1.jpg', 88),
    ('mharium-vityaz-02',   f'{EDITS}/photo5_2.jpg', 72),
    ('mharium-vityaz-03',   f'{EDITS}/photo5_3.jpg', 72),
    ('mharium-vityaz-05',   f'{EDITS}/photo5_4.jpg', 40),
    ('mharium-yablonya-03', f'{EDITS}/photo7_3.jpg', 72),
    ('indeec-02',           f'{EDITS}/photo17.jpg', 72),

    # ── кадры, которые заказчик прислал, а в каталог они не попали ─────
    ('mharium-drevo-05', f'{EDITS}/photo8_2.jpg', 0),
    ('mharium-drevo-06', f'{EDITS}/photo8_4.jpg', 0),
    ('mharium-drevo-07', f'{EDITS}/photo8_7.jpg', 0),
]

ok = 0
for dst, src, trim in JOBS:
    if make(dst, src, trim): ok += 1
print(f'обновлено мастер-копий: {ok} из {len(JOBS)}')
if ok != len(JOBS): sys.exit(1)
