#!/usr/bin/env bash
# Shared helpers for the media pipeline. Source this file; do not run it directly.
#
# Env:
#   SCRATCH  raw download / temp dir (default: $TMPDIR/portfolio-media-raw)
#   FORCE=1  rebuild outputs even if they already exist
#
# Budgets: video <= VIDEO_MAX bytes, image <= IMAGE_MAX, thumb <= THUMB_MAX.

set -euo pipefail

DEV="$HOME/Developer"
REPO="$DEV/portfolio-react"
MEDIA="$REPO/public/media"
SCRATCH="${SCRATCH:-${TMPDIR:-/tmp}/portfolio-media-raw}"
FORCE="${FORCE:-0}"

VIDEO_MAX="${VIDEO_MAX:-1200000}"   # 1.2 MB
IMAGE_MAX="${IMAGE_MAX:-180000}"    # 180 KB
THUMB_MAX="${THUMB_MAX:-50000}"     # 50 KB
POSTER_MAX="${POSTER_MAX:-180000}"

mkdir -p "$SCRATCH" "$MEDIA"

log() { printf '  %s\n' "$*" >&2; }

fsize() { stat -f %z "$1" 2>/dev/null || stat -c %s "$1"; }

# need OUT -> returns 0 when OUT must be (re)built
need() { [[ "$FORCE" == "1" || ! -s "$1" ]]; }

# Pixel width of an image (sips first, ffprobe fallback).
img_width() {
  local w
  w=$(sips -g pixelWidth "$1" 2>/dev/null | awk '/pixelWidth/{print $2}')
  if [[ -z "$w" ]]; then
    w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$1")
  fi
  echo "$w"
}

# Download URL to FILE once (idempotent).
fetch() {
  local url="$1" out="$2"
  mkdir -p "$(dirname "$out")"
  if [[ ! -s "$out" ]]; then
    curl -sfL --retry 3 -o "$out.part" "$url" && mv "$out.part" "$out"
  fi
}

# to_webp SRC OUT MAXW [MAXBYTES] [Q]
# Converts to WebP, only ever resizing DOWN to MAXW, and lowers quality until
# the file fits MAXBYTES. Then shrinks width by 10% steps as a last resort.
to_webp() {
  local src="$1" out="$2" maxw="$3" maxb="${4:-$IMAGE_MAX}" q="${5:-82}"
  need "$out" || { log "skip $(basename "$out")"; return 0; }
  mkdir -p "$(dirname "$out")"
  local w tw input="$src" tmp=""
  w=$(img_width "$src")
  # cwebp can't read GIF/some formats; normalise via sips to PNG if needed
  case "${src##*.}" in
    png|PNG|jpg|jpeg|JPG|JPEG|webp|tif|tiff) ;;
    *) tmp="$SCRATCH/.tmp-$$.png"; sips -s format png "$src" --out "$tmp" >/dev/null; input="$tmp" ;;
  esac
  tw=$w; (( tw > maxw )) && tw=$maxw
  while :; do
    local resize=()
    (( tw < w )) && resize=(-resize "$tw" 0)
    for qq in $q 76 70 64 58 52 46 40; do
      (( qq > q )) && continue
      cwebp -quiet -mt -m 6 -q "$qq" -alpha_q 90 -sharp_yuv ${resize[@]+"${resize[@]}"} "$input" -o "$out"
      if (( $(fsize "$out") <= maxb )); then
        log "$(basename "$out")  ${tw}w q$qq  $(fsize "$out")B"
        [[ -n "$tmp" ]] && rm -f "$tmp"
        return 0
      fi
    done
    tw=$(( tw * 9 / 10 ))
    (( tw < 64 )) && { log "WARN cannot fit $out"; return 1; }
  done
}

# encode_video SRC START DUR WIDTH OUTBASE [POSTER_W] [POSTER_AT]
# Produces OUTBASE.webm (VP9), OUTBASE.mp4 (H.264), OUTBASE-poster.jpg.
# Muted, 30fps. Raises CRF (VP9 38..45, H.264 26..32); if either format still
# exceeds VIDEO_MAX, BOTH are re-encoded at a lower width (640, then -15%) so
# webm and mp4 always share the same dimensions.
_enc_webm() { # src ss dur w out -> 0 if fits
  local crf
  for crf in 38 40 42 44 45; do
    ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an \
      -vf "fps=30,scale='min(iw,$4)':-2:flags=lanczos,format=yuv420p" \
      -c:v libvpx-vp9 -b:v 0 -crf "$crf" -row-mt 1 -deadline good -cpu-used 2 \
      -g 150 "$5"
    if (( $(fsize "$5") <= VIDEO_MAX )); then log "$(basename "$5") ${4}w crf$crf $(fsize "$5")B"; return 0; fi
  done
  # Fallback: 2-pass constrained quality capped to the byte budget.
  local br; br=$(_budget_kbps "$3"); local pl="$SCRATCH/.vp9pass-$$"
  for p in 1 2; do
    local o="$5"; [[ $p == 1 ]] && o=/dev/null
    ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an \
      -vf "fps=30,scale='min(iw,$4)':-2:flags=lanczos,format=yuv420p" \
      -c:v libvpx-vp9 -b:v "${br}k" -crf 45 -row-mt 1 -deadline good -cpu-used 2 \
      -g 150 -pass $p -passlogfile "$pl" -f webm "$o"
  done
  rm -f "$pl"*
  if (( $(fsize "$5") <= VIDEO_MAX )); then log "$(basename "$5") ${4}w 2pass ${br}k $(fsize "$5")B"; return 0; fi
  return 1
}
# kbps that lands a DUR-second clip at ~90% of VIDEO_MAX
_budget_kbps() { echo $(( VIDEO_MAX * 8 * 9 / 10 / 1000 * 10 / ($(printf '%.0f' "$(echo "$1 * 10" | bc)")) )); }
_enc_mp4() {
  local crf
  for crf in 26 28 30 32; do
    ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an \
      -vf "fps=30,scale='min(iw,$4)':-2:flags=lanczos,format=yuv420p" \
      -c:v libx264 -pix_fmt yuv420p -profile:v high -crf "$crf" -preset slow \
      -movflags +faststart "$5"
    if (( $(fsize "$5") <= VIDEO_MAX )); then log "$(basename "$5") ${4}w crf$crf $(fsize "$5")B"; return 0; fi
  done
  local br; br=$(_budget_kbps "$3"); local pl="$SCRATCH/.x264pass-$$"
  for p in 1 2; do
    local o="$5"; [[ $p == 1 ]] && o=/dev/null
    ffmpeg -v error -y -ss "$2" -t "$3" -i "$1" -an \
      -vf "fps=30,scale='min(iw,$4)':-2:flags=lanczos,format=yuv420p" \
      -c:v libx264 -pix_fmt yuv420p -profile:v high -b:v "${br}k" -preset slow \
      -pass $p -passlogfile "$pl" -movflags +faststart -f mp4 "$o"
  done
  rm -f "$pl"*
  if (( $(fsize "$5") <= VIDEO_MAX )); then log "$(basename "$5") ${4}w 2pass ${br}k $(fsize "$5")B"; return 0; fi
  return 1
}
encode_video() {
  local src="$1" ss="$2" dur="$3" width="$4" base="$5" pw="${6:-$4}" pat="${7:-}"
  mkdir -p "$(dirname "$base")"
  [[ -z "$pat" ]] && pat="$ss"
  local w=$width
  if need "$base.webm" || need "$base.mp4"; then
    while :; do
      if _enc_webm "$src" "$ss" "$dur" "$w" "$base.webm" && _enc_mp4 "$src" "$ss" "$dur" "$w" "$base.mp4"; then
        break
      fi
      log "$(basename "$base") over budget at ${w}w, shrinking"
      if (( w > 640 )); then w=640; else w=$(( (w * 85 / 100) / 2 * 2 )); fi
    done
  else log "skip $(basename "$base").{webm,mp4}"; fi

  if need "$base-poster.jpg"; then
    local q=4
    while :; do
      ffmpeg -v error -y -ss "$pat" -i "$src" -frames:v 1 \
        -vf "scale='min(iw,$pw)':-2:flags=lanczos" -q:v "$q" "$base-poster.jpg"
      (( $(fsize "$base-poster.jpg") <= POSTER_MAX || q >= 12 )) && break
      q=$(( q + 1 ))
    done
    log "$(basename "$base")-poster.jpg q$q $(fsize "$base-poster.jpg")B"
  else log "skip $(basename "$base")-poster.jpg"; fi
}

# still_webp SRC TIME OUT MAXW [MAXBYTES] -- grab a video frame as WebP
still_webp() {
  local src="$1" t="$2" out="$3" maxw="$4" maxb="${5:-$IMAGE_MAX}"
  need "$out" || { log "skip $(basename "$out")"; return 0; }
  local png="$SCRATCH/.still-$$.png"
  ffmpeg -v error -y -ss "$t" -i "$src" -frames:v 1 "$png"
  to_webp "$png" "$out" "$maxw" "$maxb"
  rm -f "$png"
}
