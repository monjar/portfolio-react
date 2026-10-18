#!/usr/bin/env bash
# Mochiro: 5 portrait promo loops, palette icons, cover still.
source "$(dirname "$0")/lib.sh"

SRC="$DEV/Mochiro/mochiro-promos/out"
ICONS="$DEV/Mochiro/mochiro-mobile/assets/icons"
OUT="$MEDIA/mochiro"
mkdir -p "$OUT"
echo "== mochiro"

# Start offsets chosen by inspecting frames: each 6 s window shows the app face/UI
#  01 9.5s  home screen face + "type it, or hold to talk" chat
#  02 20s   tic-tac-toe game being played against Mochiro
#  03 7s    "little helpers" tools list -> pomodoro screen
#  04 5s    home face + natural-language reminder being set
#  05 25s   theme palette switching (lab / blush / midnight) + icon change
promo_start() {
  case "$1" in
    01) echo 9.5 ;; 02) echo 20 ;; 03) echo 7 ;; 04) echo 5 ;; 05) echo 25 ;;
  esac
}

for n in 01 02 03 04 05; do
  f=$(ls "$SRC"/$n-*.mp4 | head -1)
  ss=$(promo_start $n)
  encode_video "$f" "$ss" 6 360 "$OUT/promo-$n" 540 "$(echo "$ss + 1" | bc)"
done

for name in graphite noir lab bone midnight forest blush ember; do
  to_webp "$ICONS/icon-$name.png" "$OUT/icon-$name.webp" 256 "$THUMB_MAX" 88
done

# Cover: promo 01 @24s — face, Mochiro's speech bubble and full home UI.
still_webp "$(ls "$SRC"/01-*.mp4 | head -1)" 24.5 "$OUT/cover.webp" 1200
