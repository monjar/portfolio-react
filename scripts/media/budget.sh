#!/usr/bin/env bash
# Report public/media sizes; exit 1 if any file > 1.5 MB or the total > 30 MB.
set -euo pipefail
MEDIA="$HOME/Developer/portfolio-react/public/media"
FILE_MAX=$((1500 * 1000))
TOTAL_MAX=$((30 * 1000 * 1000))

du -sh "$MEDIA"/* | sed "s|$MEDIA/||"
fail=0 total=0
while IFS= read -r -d '' f; do
  s=$(stat -f %z "$f" 2>/dev/null || stat -c %s "$f")
  total=$((total + s))
  if (( s > FILE_MAX )); then echo "OVER 1.5MB: ${f#$MEDIA/} ($s B)"; fail=1; fi
done < <(find "$MEDIA" -type f -print0)
printf 'total: %s bytes (%.2f MB) in %s files\n' "$total" "$(echo "$total/1000000" | bc -l)" "$(find "$MEDIA" -type f | wc -l | tr -d ' ')"
if (( total > TOTAL_MAX )); then echo "OVER 30MB total"; fail=1; fi
(( fail )) && { echo "budget: FAIL"; exit 1; }
echo "budget: OK"
