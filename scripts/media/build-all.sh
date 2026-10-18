#!/usr/bin/env bash
# Build every portfolio media asset, then check the budget.
#   SCRATCH=/some/tmp FORCE=1 scripts/media/build-all.sh
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
export SCRATCH="${SCRATCH:-${TMPDIR:-/tmp}/portfolio-media-raw}"
for s in mochiro shaders procedural engine roads screens elder og; do
  bash "$DIR/$s.sh"
done
bash "$DIR/budget.sh"
