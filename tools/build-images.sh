#!/usr/bin/env bash
# Мастер-копии из images/masters/ -> адаптивные WebP в docs/img/
# JPEG-фолбэка нет намеренно: WebP поддерживают все браузеры с 2020 года (Safari 14+),
# а фолбэк весил в три раза больше самих картинок.
# Запуск: bash tools/build-images.sh [--force]
# Нужен cwebp (brew install webp) и системный sips.
set -euo pipefail

SRC="images/masters"
OUT="docs/img"
WIDTHS=(480 960 1600)
Q=82
FORCE="${1:-}"

command -v cwebp >/dev/null || { echo "нет cwebp: brew install webp"; exit 1; }
mkdir -p "$OUT"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

n=0
for src in "$SRC"/*.jpg; do
  [ -e "$src" ] || continue
  base="$(basename "$src" .jpg)"
  for w in "${WIDTHS[@]}"; do
    webp="$OUT/$base-$w.webp"
    if [ -f "$webp" ] && [ "$FORCE" != "--force" ]; then continue; fi
    sips --resampleWidth "$w" "$src" --out "$tmp/$base-$w.jpg" >/dev/null 2>&1
    # -m 6 -sharp_yuv: медленнее, но заметно чище мелкая роспись и цветные границы
    cwebp -q "$Q" -m 6 -sharp_yuv -quiet "$tmp/$base-$w.jpg" -o "$webp"
    n=$((n+1))
  done
done

echo "готово: сгенерировано $n файлов"
echo "вес docs/img: $(du -sh "$OUT" | cut -f1)"
