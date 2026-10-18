#!/usr/bin/env bash
# Roads & Runes: phone + Watch screenshots, cover from the design thumbnail.
source "$(dirname "$0")/lib.sh"

SRC="$DEV/Roads-Runes/docs/screenshots"
OUT="$MEDIA/roads-and-runes"
mkdir -p "$OUT"
echo "== roads-and-runes"

for f in "$SRC"/*.png; do
  b=$(basename "$f" .png)
  case "$b" in
    w[0-9]-watch-*) to_webp "$f" "$OUT/$b.webp" 9999 "$IMAGE_MAX" 90 ;;  # Watch: native size
    *)              to_webp "$f" "$OUT/$b.webp" 800 "$IMAGE_MAX" ;;
  esac
done
to_webp "$DEV/Roads-Runes/docs/design/thumbnail.webp" "$OUT/cover.webp" 1600 "$IMAGE_MAX" 90
