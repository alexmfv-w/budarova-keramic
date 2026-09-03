#!/usr/bin/env python3
"""Мастер-копии из правок заказчика (customers_edits/photo) -> images/masters/.
Отдельный файл, чтобы не смешивать с первичной раскладкой архива."""
import subprocess, os, sys

SRC = 'customers_edits/photo'
OUT = 'images/masters'
MAX = 2400

MAP = {
    # триподы — две группы
    'tripod-zmey-maya-01': 'photo3_1.jpg',
    'tripod-zmey-maya-02': 'photo3_2.jpg',
    'tripod-zmey-maya-03': 'photo3_3.jpg',
    'tripod-ornament-01':  'photo4_1.jpg',
    'tripod-ornament-02':  'photo4_2.jpg',
    'tripod-ornament-03':  'photo4_3.jpg',
    # мхариумы
    'mharium-vityaz-01': 'photo5_1.jpg',
    'mharium-vityaz-02': 'photo5_2.jpg',
    'mharium-vityaz-03': 'photo5_3.jpg',
    'mharium-vityaz-04': 'photo5_5.jpg',
    'mharium-mudrets-01':     'photo6_1.jpg',
    'mharium-mudrets-02':     'photo6_4.jpg',
    'mharium-mudrets-03':     'photo6_3.jpg',
    'mharium-stareyshiny-01': 'photo6_2.jpg',
    'mharium-stareyshiny-02': 'photo6_5.jpg',
    'mharium-stareyshiny-03': 'photo6_3.jpg',
    'mharium-yablonya-01': 'photo7_1.jpg',
    'mharium-yablonya-02': 'photo7_2.jpg',
    'mharium-yablonya-03': 'photo7_3.jpg',
    'mharium-drevo-01': 'photo8_1.jpg',
    'mharium-drevo-02': 'photo8_5.jpg',
    'mharium-drevo-03': 'photo8_3.jpg',
    'mharium-drevo-04': 'photo8_6.jpg',
    'mharium-drevo-05': 'photo8_7.jpg',
    # интерьер
    'zerkalo-bestiariy-01': 'photo13.jpg',
    'zerkalo-bestiariy-02': 'photo14.jpg',
    'indeec-01': 'photo16.jpg',
    'indeec-02': 'photo17.jpg',
    'voron-most-01':  'photo18.jpg',
    'voron-most-02':  'photo19.jpg',
    'voron-most-03':  'photo20.jpg',
    'voron-most-04':  'photo24.jpg',
    'belyy-voron-01': 'photo21.jpg',
    'belyy-voron-02': 'photo22.jpg',
    'belyy-voron-03': 'photo23.jpg',
    'belyy-voron-04': 'photo24.jpg',
    'salamandra-01': 'photo25.jpg',
    'salamandra-02': 'photo26.jpg',
    'salamandra-03': 'photo27.jpg',
    'bolshaya-ryba-01': 'photo28.jpg',
    'bolshaya-ryba-02': 'photo29.jpg',
    # страница «О мастере»
    'about-master':  'photo2.jpg',
    'process-decor': 'photo1.jpg',
}

os.makedirs(OUT, exist_ok=True)
made, missing = 0, []
for name, fn in MAP.items():
    src = os.path.join(SRC, fn)
    if not os.path.exists(src):
        missing.append(src); continue
    dst = os.path.join(OUT, name + '.jpg')
    r = subprocess.run(['sips', '-Z', str(MAX), '-s', 'format', 'jpeg',
                        '-s', 'formatOptions', '92', src, '--out', dst], capture_output=True)
    if r.returncode == 0: made += 1
    else: missing.append(src + ' (sips)')
print(f'создано мастер-копий: {made} из {len(MAP)}')
if missing:
    print('НЕ НАЙДЕНО:'); [print('  ', m) for m in missing]; sys.exit(1)
