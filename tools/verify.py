# -*- coding: utf-8 -*-
"""Сверка собранного сайта с правками заказчика. Читает docs/, ничего не меняет."""
import re, os, json, sys, html

D='docs'
def page(p):
    with open(os.path.join(D,p),encoding='utf8') as f: return f.read()
def text(p):
    s=re.sub(r'<script.*?</script>','',page(p),flags=re.S)
    s=re.sub(r'<[^>]+>',' ',s)
    return re.sub(r'\s+',' ',html.unescape(s))

ok=fail=0
def check(n, cond, note=''):
    global ok,fail
    if cond: ok+=1
    else:
        fail+=1; print(f'  ✗ {n}  {note}')

home=text('index.html'); cat=text('catalog/index.html'); about=text('about/index.html')
meet=text('meetings/index.html'); cont=text('contacts/index.html'); stor=text('stories/index.html')
cj=json.load(open('data/catalog.json')); items={i['slug']:i for i in cj['items']}
sj=json.load(open('data/stories.json')); stories={s['slug']:s for s in sj['items']}

# ── А. О мастере
check('1 текст «Как это делается»','Сознание мастера — это фильтр' in about)
check('1б технологический процесс','всё в своё время, без спешки' in about)
check('1в материалы и печь','Безопасные качественные материалы' in about)
check('2 фото process-decor','process-decor-960.webp' in page('about/index.html'))
check('2б кота на странице нет','process-hands' not in page('about/index.html'))
check('3 подпись под фото','Партия триподов перед началом декорирования' in about)
check('4 нет раздела «Откуда индейцы»','Откуда индейцы' not in about)
check('5 нет раздела «Что можно заказать»','Что можно заказать' not in about)
check('6 портрет photo2','about-master-960.webp' in page('about/index.html'))
check('7 квадратные фото','panel-figure-square' in page('about/index.html'))

# ── Б. Главная
check('9 нет блока «под заказ»','Приносите идею' not in home)
check('10 какао-бобы в манифесте','считали какао-бобы физическим проявлением' in home)
check('10б какао-бобы в блоке триподов','Какао-бобы мололи' in home)
check('11 манифест крупнее','clamp(1.5rem,6vw,2.5rem)' in page('css/site.css'))

# ── Новый цикл: то, что бросилось в глаза
check('N1 новый слоган','Керамика, прошедшая сквозь тысячелетия' in home)
check('N1б подзаголовок','Возрождение традиций' in home)
check('N1в старого слогана нет','делали до нас' not in home)
check('N2 фото триподов заменено','dir-tripods' in page('index.html'))
check('N3 нет «многофункциональный индеец»','Многофункциональный индеец' not in home)
check('N4 ссылка «Смотреть работы»','Смотреть работы →' in home)
check('N4б нет «Смотреть интерьер»','Смотреть интерьер' not in home)
check('N5 текст мастера на главной','Сознание мастера' in home)
check('N6 горшков в заголовке нет','подсвечники, горшки' not in home)
check('N7 залипающая шапка','position:sticky' in page('css/site.css') and 'topbar-dock' in page('index.html'))
check('N8 уаскос поют, а не свистят','свистят' not in stor and 'свистящ' not in cat)
check('N9 в каталоге разделы по направлениям','cat-section' in page('catalog/index.html'))
check('N10 в каталоге ссылки на истории','При чём тут индейцы и какао' in cat and 'Как рождается роспись' in cat)
check('N11 боковая колонка в истории','article-aside' in page('stories/mharium/index.html'))

# ── В. Каталог: тексты и состав
check('12 вводный текст','Этнические мотивы, современные материалы' in cat)
check('12б авторские повторы','Возможны авторские повторы купленных работ' in cat)
check('13 «Змей майя»','tripod-zmey-maya' in items and items['tripod-zmey-maya']['title']=='Трипод «Змей майя»')
check('13б фото photo3_x','len 3', len(items['tripod-zmey-maya']['images'])==3)
check('14 «Орнамент»','tripod-ornament' in items)
check('15 объёмы','от 150 до 400 мл'==items['tripod-zmey-maya']['dimensions'])
check('16 трипод с объёмным декором 2000','tripod-obyomny-dekor' in items and items['tripod-obyomny-dekor']['price']==2000)
check('16б заглушка «скоро»','badge-soon' in page('catalog/index.html'))
check('17 дисклеймер в FAQ','декоративно-сувенирный характер' in cont)

# ── Г. Мхариумы
for gone in ('mharium-krasny','mharium-maska','mharium-derevo'):
    check(f'18 удалён {gone}', gone not in items)
check('19 Витязь 2000/15см', items['mharium-vityaz']['price']==2000 and items['mharium-vityaz']['dimensions']=='диаметр 15 см')
check('19б Витязь 5 фото', len(items['mharium-vityaz']['images'])==5)
check('20 Спящий мудрец 1000', items['mharium-mudrets']['price']==1000)
check('21 Три старейшины 1000', items['mharium-stareyshiny']['price']==1000)
check('22 Яблоня 1500', items['mharium-yablonya']['price']==1500)
check('23 Мировое древо 2000/18см', items['mharium-drevo']['price']==2000 and items['mharium-drevo']['dimensions']=='высота 18 см')
check('23б Древо 7 фото', len(items['mharium-drevo']['images'])==7)
check('Г-мох в подарок', all(items[s]['meta']=='мох в подарок' for s in items if items[s]['category']=='mharium'))

# ── Д. Уаскос
check('24 «поющий сосуд»', items['uasko-ptitsa']['meta']=='поющий сосуд')
check('26 Индеец 7000', items['uasko-indeec']['title']=='Уаскос «Индеец»' and items['uasko-indeec']['price']==7000)
check('26б «Зверь» исчез', not any('Зверь' in i['title'] for i in cj['items']))
check('27 где послушать','MAX' in items['uasko-indeec']['story'])
check('28 нет «по доколумбовым образцам»','доколумбовым образцам' not in text('stories/sosudy-kotorye-poyut/index.html'))
uw=text('work/uasko-indeec/index.html'); up=text('work/uasko-ptitsa/index.html')
check('N12 у уаскосов нет приписки про глазурь','допущенной к контакту' not in uw and 'допущенной к контакту' not in up)

# ── Е. Интерьер
check('30 Бестиарий', items['zerkalo-bestiariy']['title']=='Зеркало «Бестиарий»')
check('30б описание рамы','фанера' in items['zerkalo-bestiariy']['story'])
check('31 карусель 3 кадра', len(items['zerkalo-bestiariy']['images'])==3)
check('N13 фото зеркала не скриншот монитора','zerkalo-bestiariy-01' in items['zerkalo-bestiariy']['images'])
check('32 Скульптура-чаша 24 см', items['skulptura-chasha']['dimensions']=='высота 24 см' and 'благовоний' in items['skulptura-chasha']['story'])
for gone in ('gorshok-polet','kashpo-more','tarelki-ryby','chaynik-s-chashkoy','ryby'):
    check(f'33 удалён {gone}', gone not in items)
check('34 подсвечник продан', items['podsvechnik-tri-svechi']['availability']=='sold')
check('35 Ворон на мосту', items['voron-most']['price']==3000 and items['voron-most']['dimensions']=='диаметр 25 см')
check('35б 4 кадра с общим фото', len(items['voron-most']['images'])==4)
check('36 Белый ворон', items['belyy-voron']['price']==3000)
check('37 Саламандра 23/5', items['salamandra']['dimensions']=='диаметр 23 см, высота 5 см' and items['salamandra']['price']==3000)
check('38 Большая рыба продана', items['bolshaya-ryba']['availability']=='sold' and items['bolshaya-ryba']['dimensions']=='высота 27 см')
check('39 сочинённых описаний тарелок нет',
      all(items[s]['story'] is None for s in ('voron-most','belyy-voron','salamandra')))

# ── Ж. Истории
check('40 авторский текст уаскос','Уаскос имели важное ритуальное значение' in text('stories/sosudy-kotorye-poyut/index.html'))
check('41 авторский текст про какао','Именно индейцы майя создавали такую керамику' in text('stories/pri-chyom-tut-indeytsy-i-kakao/index.html'))
check('43 история про традиции есть','kak-rozhdaetsya-rospis' in stories)
check('43б слоган не дублируется в заголовке истории', not any('прошедшая сквозь тысячелетия' in s['title'] for s in sj['items']))
check('44 «5 причин»','5 причин завести мхариум' in stor)
check('44б нумерованные карточки','numbered-item' in page('stories/mharium/index.html'))
check('44в «Кому можно подарить»','Кому можно подарить' in text('stories/mharium/index.html'))

# ── З. Встречи
check('47 без какао-церемоний','церемони' not in meet)

# ── общее: битые картинки и ссылки
missing=[]
for p,_,fs in os.walk(D):
    for f in fs:
        if not f.endswith('.html'): continue
        s=open(os.path.join(p,f),encoding='utf8').read()
        for m in re.findall(r'/budarova-keramic(/img/[A-Za-z0-9._-]+\.webp)',s):
            if not os.path.exists(D+m): missing.append(m)
check('картинки все на месте', not missing, str(sorted(set(missing))[:5]))

links=set()
for p,_,fs in os.walk(D):
    for f in fs:
        if not f.endswith('.html'): continue
        s=open(os.path.join(p,f),encoding='utf8').read()
        for m in re.findall(r'href="/budarova-keramic(/[^"#?]*)',s): links.add(m)
broken=[l for l in links if not (os.path.exists(D+l) or os.path.exists(D+l+'index.html'))]
check('внутренние ссылки живые', not broken, str(broken))

# ── публикация: всё ли из docs/ попало в git ────────────────────────────────
# Трижды ловились «пустые странички» и пропавшие фотографии: локально всё есть,
# а в коммит уходили только уже отслеживаемые файлы. Проверяем это здесь.
import subprocess
def git(*a):
    r = subprocess.run(('git',)+a, capture_output=True, text=True)
    return r.stdout.splitlines() if r.returncode == 0 else None

tracked = git('ls-files', 'docs')
if tracked is None:
    print('  (git недоступен — проверку публикации пропускаем)')
else:
    tracked = set(tracked)
    on_disk = set()
    for p,_,fs in os.walk(D):
        for f in fs:
            on_disk.add(os.path.join(p,f).replace(os.sep,'/'))
    untracked = sorted(on_disk - tracked)
    check('всё из docs/ добавлено в git', not untracked,
          f'{len(untracked)} файлов не в git, например {untracked[:3]}. Лечится: git add -A')
    staged_del = sorted(tracked - on_disk)
    check('в git нет удалённых страниц', not staged_del,
          f'{len(staged_del)} лишних, например {staged_del[:3]}. Лечится: git add -A')

print(f'\nпроверок пройдено: {ok}, провалено: {fail}, ссылок обойдено: {len(links)}')
sys.exit(1 if fail else 0)
