#!/usr/bin/env bash
# Roads & Runes: the 0.9.2 app captures (docs/screenshots/app), the Watch
# renders, and a landscape cover of three phones on the app's cream ground.
source "$(dirname "$0")/lib.sh"

SRC="$DEV/Roads-Runes/docs/screenshots"
OUT="$MEDIA/roads-and-runes"
mkdir -p "$OUT"
echo "== roads-and-runes"

for f in "$SRC"/app/*.png; do
  to_webp "$f" "$OUT/app-$(basename "$f" .png).webp" 800 "$IMAGE_MAX"
done
for f in "$SRC"/w[0-9]-watch-*.png; do
  to_webp "$f" "$OUT/$(basename "$f" .png).webp" 9999 "$IMAGE_MAX" 90   # Watch: native size
done

# cover / share image: three screens side by side, rounded like phones
if need "$OUT/cover.webp" || need "$OUT/og.jpg"; then
  png="$SCRATCH/.roads-cover-$$.png"
  ffmpeg -v error -y \
    -i "$SRC/app/02-world.png" -i "$SRC/app/04-quest-detail.png" -i "$SRC/app/07-journeys-end.png" \
    -filter_complex "\
      color=c=0xf3ead8:s=1600x900[bg];\
      [0]scale=-2:780,format=rgba,geq=lum='p(X,Y)':a='if(gt(abs(X-W/2),W/2-34)*gt(abs(Y-H/2),H/2-34),if(lte(hypot(abs(X-W/2)-(W/2-34),abs(Y-H/2)-(H/2-34)),34),255,0),255)'[a];\
      [1]scale=-2:840,format=rgba,geq=lum='p(X,Y)':a='if(gt(abs(X-W/2),W/2-36)*gt(abs(Y-H/2),H/2-36),if(lte(hypot(abs(X-W/2)-(W/2-36),abs(Y-H/2)-(H/2-36)),36),255,0),255)'[b];\
      [2]scale=-2:780,format=rgba,geq=lum='p(X,Y)':a='if(gt(abs(X-W/2),W/2-34)*gt(abs(Y-H/2),H/2-34),if(lte(hypot(abs(X-W/2)-(W/2-34),abs(Y-H/2)-(H/2-34)),34),255,0),255)'[c];\
      [bg][a]overlay=x=190:y=80[t1];[t1][c]overlay=x=1050:y=80[t2];[t2][b]overlay=x=(W-w)/2:y=30" \
    -frames:v 1 "$png"
  to_webp "$png" "$OUT/cover.webp" 1600 "$IMAGE_MAX" 85
  ffmpeg -v error -y -i "$png" -vf "scale=1200:-2,crop=1200:630" -q:v 4 "$OUT/og.jpg"
  rm -f "$png"
fi
