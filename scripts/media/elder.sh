#!/usr/bin/env bash
# Elder works: YouTube posters + logos (originals in public/images are kept).
source "$(dirname "$0")/lib.sh"

RAW="$SCRATCH/elder"
mkdir -p "$RAW"
echo "== elder works"

yt() { # slug id
  local slug="$1" id="$2" jpg="$RAW/$2.jpg"
  if [[ ! -s "$jpg" ]]; then
    curl -sfL -o "$jpg" "https://i.ytimg.com/vi/$id/maxresdefault.jpg" \
      || curl -sfL -o "$jpg" "https://i.ytimg.com/vi/$id/hqdefault.jpg"
  fi
  to_webp "$jpg" "$MEDIA/$slug/poster.webp" 1280 "$IMAGE_MAX"
}
yt mage-hands       -PEmQkcHclY
yt sentient-strokes 3fiSZIrx-Pc
yt melodymuse       JOXD_-y0c1I
yt enchanted-realms jbacmKkosa4

IMG="$REPO/public/images"
to_webp "$IMG/raidfield.webp"   "$MEDIA/raidfield-2/logo.webp"     600 "$IMAGE_MAX" 90
to_webp "$IMG/billiard.png"     "$MEDIA/super-billiard/logo.webp"  600 "$IMAGE_MAX" 90
to_webp "$IMG/cubicdreams.jpg"  "$MEDIA/cubic-dreams/logo.webp"    600 "$IMAGE_MAX" 90
to_webp "$IMG/animately.png"    "$MEDIA/animately/logo.webp"       600 "$IMAGE_MAX" 90
to_webp "$IMG/rahnema.png"      "$MEDIA/rahnema-college/logo.webp" 600 "$IMAGE_MAX" 90
