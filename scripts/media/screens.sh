#!/usr/bin/env bash
# SceneOverflow: docs screenshots; cover = studio.png (most striking: full editor UI).
source "$(dirname "$0")/lib.sh"

SRC="$DEV/SceneOverflow/docs/images"
OUT="$MEDIA/sceneoverflow"
mkdir -p "$OUT"
echo "== sceneoverflow"

for f in "$SRC"/*.png "$SRC"/*.jpg; do
  [[ -e "$f" ]] || continue
  b=$(basename "${f%.*}")
  to_webp "$f" "$OUT/$b.webp" 1600 "$IMAGE_MAX" 85
done
if need "$OUT/cover.webp"; then cp "$OUT/studio.webp" "$OUT/cover.webp"; fi
