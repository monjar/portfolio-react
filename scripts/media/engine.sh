#!/usr/bin/env bash
# Enchanted-Graphics-Engine: screenshots (+thumbs) and GIF -> video loops.
source "$(dirname "$0")/lib.sh"

SRC="$DEV/Enchanted-Graphics-Engine/docs/images"
OUT="$MEDIA/enchanted-graphics-engine"
mkdir -p "$OUT"
echo "== enchanted-graphics-engine"

for n in demo-scene editor level character; do
  to_webp "$SRC/$n.png" "$OUT/$n.webp" 1600 "$IMAGE_MAX"
  to_webp "$SRC/$n.png" "$OUT/$n-thumb.webp" 640 "$THUMB_MAX" 78
done
if need "$OUT/cover.webp"; then cp "$OUT/demo-scene.webp" "$OUT/cover.webp"; fi

# GIFs: full length if <= 10 s, else the first 8 s (checked: all open on a
# strong frame; level.gif is static after ~28 s, demo-tour/character start in-scene).
for n in engine-demo demo-tour level character; do
  f="$SRC/$n.gif"
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  if (( $(echo "$d <= 10" | bc) )); then dur=$d; else dur=8; fi
  encode_video "$f" 0 "$dur" 960 "$OUT/$n-loop" 960 0
done
