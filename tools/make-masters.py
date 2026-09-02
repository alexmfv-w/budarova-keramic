#!/usr/bin/env python3
"""Раскладывает исходные фото в images/masters/ под именами слагов.
Мастер-копия = JPEG 2400 px по длинной стороне. Дальше ими занимается build-images.sh."""
import subprocess, sys, os, re

SRC_PHOTOS = 'old_useful_materials/photos'
SRC_AVATARS = 'old_useful_materials/new_avatars'
OUT = 'images/masters'
MAX = 2400

# слаг-NN  ->  (папка, исходный файл)
MAP = {
    'tripod-zigzag-01':            (SRC_PHOTOS, 'tripod2.png'),
    'tripod-zigzag-02':            (SRC_PHOTOS, 'photo_26_0.png'),
    'tripod-ptitsy-01':            (SRC_PHOTOS, 'photo_31_0.png'),
    'tripod-ptitsy-02':            (SRC_PHOTOS, 'photo_30_0.png'),
    'tripod-monokhrom-01':         (SRC_PHOTOS, 'tripod4.png'),
    'tripod-volna-01':             (SRC_PHOTOS, 'photo_32_0.png'),
    'mharium-krasny-01':           (SRC_PHOTOS, 'mhariums_6.png'),
    'mharium-maska-01':            (SRC_PHOTOS, 'mharium6.png'),
    'mharium-derevo-01':           (SRC_PHOTOS, 'mhariom2.png'),
    'uasko-ptitsa-01':             (SRC_PHOTOS, 'photo_9_0.png'),
    'uasko-zver-01':               (SRC_PHOTOS, 'photo_10_0.png'),
    'zerkalo-yaguar-01':           (SRC_PHOTOS, 'mirrow.png'),
    'zerkalo-yaguar-02':           (SRC_PHOTOS, 'mirrow_part.png'),
    'indeec-01':                   (SRC_PHOTOS, 'author_43124116262.png'),
    'indeec-02':                   (SRC_PHOTOS, 'indeec3.png'),
    'gorshok-polet-01':            (SRC_PHOTOS, 'pot1.png'),
    'kashpo-more-01':              (SRC_PHOTOS, 'pots_super.png'),
    'podsvechnik-tri-svechi-01':   (SRC_PHOTOS, 'super_candlestick_with_cat.png'),
    'chaynik-s-chashkoy-01':       (SRC_PHOTOS, 'teapot2.png'),
    'tarelki-ryby-01':             (SRC_PHOTOS, 'plate.png'),
    'ryby-01':                     (SRC_PHOTOS, 'super_candleestic.png'),
    # страницы и блоки
    'hero-tripods':                (SRC_PHOTOS, 'tripod5.png'),
    'dir-tripods':                 (SRC_PHOTOS, 'tripod2.png'),
    'dir-mhariums':                (SRC_PHOTOS, 'mhariums_6.png'),
    'dir-interior':                (SRC_PHOTOS, 'mirrow.png'),
    'custom-uasko':                (SRC_AVATARS, 'a7.jpg'),
    'master-portrait':             (SRC_AVATARS, 'a6.jpg'),
    'master-wide':                 (SRC_AVATARS, 'a4.jpg'),
    'meetings':                    (SRC_PHOTOS, 'masterclass1.png'),
    'process-raw':                 (SRC_PHOTOS, 'photo_25_0.png'),
    'process-hands':               (SRC_PHOTOS, 'work_plate1.png'),
    'packing':                     (SRC_PHOTOS, 'package_plate_super.png'),
    # обложки историй
    'story-uasko':                 (SRC_PHOTOS, 'photo_9_0.png'),
    'story-tripods':               (SRC_PHOTOS, 'photo_27_0.png'),
    'story-kakao':                 (SRC_PHOTOS, 'Unknown.png'),
    'story-mharium':               (SRC_PHOTOS, 'mharium6.png'),
    'story-process':               (SRC_PHOTOS, 'work_plate1.png'),
}

os.makedirs(OUT, exist_ok=True)
missing, made = [], 0
for name, (folder, fn) in MAP.items():
    src = os.path.join(folder, fn)
    if not os.path.exists(src):
        missing.append(src); continue
    dst = os.path.join(OUT, name + '.jpg')
    if os.path.exists(dst):
        continue
    r = subprocess.run(['sips', '-Z', str(MAX), '-s', 'format', 'jpeg',
                        '-s', 'formatOptions', '92', src, '--out', dst],
                       capture_output=True)
    if r.returncode == 0:
        made += 1
    else:
        missing.append(src + ' (ошибка sips)')

print(f'мастер-копий создано: {made}, всего в папке: {len(os.listdir(OUT))}')
if missing:
    print('НЕ НАЙДЕНО:'); [print('  ', m) for m in missing]; sys.exit(1)
