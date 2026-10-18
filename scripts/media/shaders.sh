#!/usr/bin/env bash
# Advanced-Shaders: stills (+thumbs) and 6 s loops from the repo docs.
source "$(dirname "$0")/lib.sh"

BASE="https://raw.githubusercontent.com/monjar/Advanced-Shaders/main/docs"
RAW="$SCRATCH/shaders"
OUT="$MEDIA/advanced-shaders"
mkdir -p "$RAW/videos" "$OUT"
echo "== advanced-shaders"

IMAGES="blackhole-edge-on magic-crystal sdf-temple clouds-above watercolour portals-corridor atmosphere-sunset planet-orbit ocean-open-water planet-coast magic-obsidian"
for n in $IMAGES; do
  fetch "$BASE/$n.jpg" "$RAW/$n.jpg"
  to_webp "$RAW/$n.jpg" "$OUT/$n.webp" 1600 "$IMAGE_MAX"
  to_webp "$RAW/$n.jpg" "$OUT/$n-thumb.webp" 640 "$THUMB_MAX" 78
done
if need "$OUT/cover.webp"; then cp "$OUT/blackhole-edge-on.webp" "$OUT/cover.webp"; fi

# Start offsets picked from contact sheets (strong opening frame, no fades):
#  blackhole 1s   edge-on accretion disk with lensing, slow orbit
#  atmosphere 8s  horizon -> climbs into space -> planet limb
#  clouds 1s      cumulus over green plains
#  portals 6s     sci-fi lab portal pair, view through portal
#  magic 6s       molten fire orb -> golden rune sphere
#  watercolour 1s painterly village fly-over
#  ocean 8s       open water swells with island coastline
vstart() {
  case "$1" in
    blackhole) echo 1 ;; atmosphere) echo 8 ;; clouds) echo 1 ;; portals) echo 6 ;;
    magic) echo 6 ;; watercolour) echo 1 ;; ocean) echo 8 ;;
  esac
}
for n in blackhole atmosphere clouds portals magic watercolour ocean; do
  fetch "$BASE/videos/$n.mp4" "$RAW/videos/$n.mp4"
  ss=$(vstart "$n")
  encode_video "$RAW/videos/$n.mp4" "$ss" 6 720 "$OUT/$n" 1280 "$(echo "$ss + 0.5" | bc)"
done
