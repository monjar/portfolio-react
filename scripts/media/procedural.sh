#!/usr/bin/env bash
# Procedural Animation Studies: live-site screenshots + recordings via Playwright.
source "$(dirname "$0")/lib.sh"

RAW="$SCRATCH/procedural"
OUT="$MEDIA/procedural-animations"
PLAYWRIGHT_DIR="${PLAYWRIGHT_DIR:-$SCRATCH/pw}"
mkdir -p "$RAW" "$OUT"
echo "== procedural-animations"

# Playwright lives in a throwaway dir, never in the portfolio's package.json.
if [[ ! -d "$PLAYWRIGHT_DIR/node_modules/playwright" ]]; then
  mkdir -p "$PLAYWRIGHT_DIR"
  [[ -f "$PLAYWRIGHT_DIR/package.json" ]] || echo '{"name":"pw","private":true}' > "$PLAYWRIGHT_DIR/package.json"
  (cd "$PLAYWRIGHT_DIR" && npm i --silent playwright@1.56.1 && npx playwright install chromium-headless-shell)
fi

PF=(); [[ "$FORCE" == "1" ]] && PF=(--force)
PLAYWRIGHT_DIR="$PLAYWRIGHT_DIR" node "$(dirname "$0")/capture-procedural.mjs" \
  --raw "$RAW" --media "$OUT" ${PF[@]+"${PF[@]}"}

for f in "$RAW"/study-*.png; do
  b=$(basename "$f" .png)
  to_webp "$f" "$OUT/$b.webp" 1600 "$IMAGE_MAX"
  to_webp "$f" "$OUT/$b-thumb.webp" 640 "$THUMB_MAX" 78
done
# Cover: GPU crowds (16k fish boids) is the most striking frame.
if need "$OUT/cover.webp"; then cp "$OUT/study-11.webp" "$OUT/cover.webp"; fi

# Recordings: manifest "start" = seconds until the scene was ready (+2 s settle).
# Extra per-clip offset picked from contact sheets:
#  hexapod +3   spider weaving between crates, then climbing a wall
#  quadruped +0 side-on dog gait cycle
#  boids +2     school of fish swirling once fully formed
#  creatures +0 evolved block creature crawling, trail drawn behind
#  ik +0        CCD / FABRIK / Jacobian tentacles chasing their targets
#  xpbd +0      a walker trailing an XPBD cape
#  footik +0    mocap walk adapted onto stairs and slopes
extra() { case "$1" in hexapod) echo 3 ;; boids) echo 2 ;; *) echo 0 ;; esac; }
# Subjects small in a 1280x720 frame get a 1:1 crop around them (w:h:x:y).
crop() { case "$1" in
  ik) echo "900:506:190:150" ;;
  xpbd) echo "720:405:360:150" ;;
  footik) echo "800:450:280:150" ;;
  *) echo "" ;;
esac; }
for name in hexapod quadruped boids creatures ik xpbd footik; do
  src="$RAW/videos/$name.webm"
  c=$(crop "$name")
  if [[ -n "$c" && -s "$src" ]]; then
    cropped="$RAW/videos/$name-crop.mp4"
    [[ -s "$cropped" && "$FORCE" != "1" ]] || \
      ffmpeg -v error -y -i "$src" -vf "crop=$c" -c:v libx264 -crf 12 -preset fast -an "$cropped"
    src="$cropped"
  fi
  [[ -s "$src" ]] || { log "WARN missing $src"; continue; }
  st=$(node -e "const m=require('$RAW/videos/manifest.json');console.log(m['$name'].start)")
  ss=$(echo "$st + $(extra "$name")" | bc)
  encode_video "$src" "$ss" 6 720 "$OUT/$name" 1280 "$(echo "$ss + 0.5" | bc)"
done
