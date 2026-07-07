#!/usr/bin/env bash
# extract-frames.sh — turn a source video into a scroll-scrubbable WebP frame
# sequence. Replaces the manual "export frames" step some tutorials do via
# GUI video editors. Requires ffmpeg (and ffprobe) on PATH.
#
# Usage:
#   ./extract-frames.sh -i input.mp4 -o frames/product [-n 60] [-w 1600] [-q 80] [--dpr2]
#
#   -i  input video (required)
#   -o  output path prefix; frames land in "<dirname>/" as "<basename>-001.webp" etc.
#   -n  frame count (default 60 — see references/perf-and-frame-budget.md for sizing)
#   -w  output width in px at 1x; height auto-scales, aspect preserved (default 1600)
#   -q  WebP quality 1-100 (default 82)
#   --dpr2   also emit a @2x set (double width) into "<dirname>/@2x/"
#
# Frame budget: keep n roughly <= scroll-distance-in-px / 2 (fewer frames read
# fine on fast scrolls; more than that wastes bandwidth without visible gain).

set -euo pipefail

INPUT=""
OUT_PREFIX=""
FRAMES=60
WIDTH=1600
QUALITY=82
DPR2=false

usage() { grep '^#' "$0" | cut -c3-; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    -i) INPUT="$2"; shift 2 ;;
    -o) OUT_PREFIX="$2"; shift 2 ;;
    -n) FRAMES="$2"; shift 2 ;;
    -w) WIDTH="$2"; shift 2 ;;
    -q) QUALITY="$2"; shift 2 ;;
    --dpr2) DPR2=true; shift ;;
    -h|--help) usage ;;
    *) echo "Unknown argument: $1" >&2; usage ;;
  esac
done

if ! command -v ffmpeg >/dev/null 2>&1 || ! command -v ffprobe >/dev/null 2>&1; then
  cat >&2 <<'EOF'
ffmpeg/ffprobe not found on PATH.

Install it first:
  macOS:          brew install ffmpeg
  Ubuntu/Debian:  sudo apt-get install ffmpeg
  Windows (winget): winget install Gyan.FFmpeg

Then re-run this script. No GUI video app (Canva/CapCut/etc.) is needed —
this CLI does the frame extraction and encoding directly.
EOF
  exit 1
fi

[[ -z "$INPUT" || -z "$OUT_PREFIX" ]] && { echo "Missing -i or -o" >&2; usage; }
[[ -f "$INPUT" ]] || { echo "Input file not found: $INPUT" >&2; exit 1; }

OUT_DIR="$(dirname "$OUT_PREFIX")"
BASE="$(basename "$OUT_PREFIX")"
mkdir -p "$OUT_DIR"

DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT")
FPS=$(awk -v f="$FRAMES" -v d="$DURATION" 'BEGIN { printf "%.6f", f / d }')

echo "Source duration: ${DURATION}s -> sampling ${FRAMES} frames (~${FPS} fps) at ${WIDTH}px wide"

ffmpeg -y -loglevel error -i "$INPUT" \
  -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
  -vframes "$FRAMES" \
  -c:v libwebp -quality "$QUALITY" -compression_level 6 \
  "${OUT_DIR}/${BASE}-%03d.webp"

echo "Wrote ${FRAMES} frames to ${OUT_DIR}/${BASE}-001.webp .. ${BASE}-$(printf '%03d' "$FRAMES").webp"

if [[ "$DPR2" == true ]]; then
  DPR2_DIR="${OUT_DIR}/@2x"
  mkdir -p "$DPR2_DIR"
  WIDTH2=$((WIDTH * 2))
  ffmpeg -y -loglevel error -i "$INPUT" \
    -vf "fps=${FPS},scale=${WIDTH2}:-2:flags=lanczos" \
    -vframes "$FRAMES" \
    -c:v libwebp -quality "$QUALITY" -compression_level 6 \
    "${DPR2_DIR}/${BASE}-%03d.webp"
  echo "Wrote @2x frames to ${DPR2_DIR}/"
fi

TOTAL_SIZE=$(du -ch "${OUT_DIR}/${BASE}"-*.webp 2>/dev/null | tail -1 | cut -f1)
echo "Total sequence size: ${TOTAL_SIZE}"
echo "Done. Point the engine config at basePath='${OUT_DIR}/${BASE}-', frameCount=${FRAMES}, pad=3, ext='webp'."
