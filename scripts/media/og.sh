#!/usr/bin/env bash
# 1200×630 share images (og:image) for each work that has a cover.
set -euo pipefail
cd "$(dirname "$0")/../.."
for dir in public/media/*/; do
  slug=$(basename "$dir")
  src="$dir/cover.webp"
  [[ "$slug" == "mochiro" ]] && src="$dir/promo-01-poster.jpg"
  [[ -f "$src" ]] || continue
  out="$dir/og.jpg"
  [[ -f "$out" && -z "${FORCE:-}" ]] && continue
  ffmpeg -loglevel error -y -i "$src" \
    -vf "scale=1200:630:force_original_aspect_ratio=increase:flags=lanczos,crop=1200:630" \
    -q:v 4 "$out"
  echo "og: $out ($(du -k "$out" | cut -f1)K)"
done
