#!/usr/bin/env bash
# build-loop.sh — stitch a "forward" clip (calm -> dramatic) and a "reverse"
# clip (dramatic -> calm) into one seamless loop-ready video, or auto-generate
# the reverse clip from the forward one. This replaces the manual
# Canva/CapCut "merge two clips" step with a single ffmpeg command.
#
# Usage:
#   ./build-loop.sh -f forward.mp4 -o loop.mp4                # auto-reverses forward.mp4
#   ./build-loop.sh -f forward.mp4 -r reverse.mp4 -o loop.mp4  # uses your own reverse clip
#
#   -f  forward clip: calm/start -> dramatic/end (required)
#   -r  reverse clip: dramatic/end -> calm/start (optional; auto-generated if omitted)
#   -o  output path for the merged loop video (required)
#
# Output is a single MP4 (H.264 + AAC) suitable for direct <video> playback,
# or as input to extract-frames.sh to produce a canvas frame sequence.

set -euo pipefail

FORWARD=""
REVERSE=""
OUTPUT=""

usage() { grep '^#' "$0" | cut -c3-; exit 1; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    -f) FORWARD="$2"; shift 2 ;;
    -r) REVERSE="$2"; shift 2 ;;
    -o) OUTPUT="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown argument: $1" >&2; usage ;;
  esac
done

if ! command -v ffmpeg >/dev/null 2>&1; then
  cat >&2 <<'EOF'
ffmpeg not found on PATH.

Install it first:
  macOS:          brew install ffmpeg
  Ubuntu/Debian:  sudo apt-get install ffmpeg
  Windows (winget): winget install Gyan.FFmpeg

No GUI video editor is needed — this CLI does the concatenation directly.
EOF
  exit 1
fi

[[ -z "$FORWARD" || -z "$OUTPUT" ]] && { echo "Missing -f or -o" >&2; usage; }
[[ -f "$FORWARD" ]] || { echo "Forward clip not found: $FORWARD" >&2; exit 1; }

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

if [[ -z "$REVERSE" ]]; then
  echo "No reverse clip given — auto-generating one from ${FORWARD}"
  REVERSE="${WORKDIR}/reverse.mp4"
  # `reverse`/`areverse` buffer the whole clip in memory — fine for short
  # (a few seconds) product clips, which is the expected input size here.
  ffmpeg -y -loglevel error -i "$FORWARD" -vf reverse -af areverse "$REVERSE"
else
  [[ -f "$REVERSE" ]] || { echo "Reverse clip not found: $REVERSE" >&2; exit 1; }
fi

# Re-encode both to a common, concat-safe codec/resolution before joining —
# concatenating mismatched codecs/timebases silently produces glitchy joins.
NORM_FWD="${WORKDIR}/fwd_norm.mp4"
NORM_REV="${WORKDIR}/rev_norm.mp4"
ffmpeg -y -loglevel error -i "$FORWARD" -c:v libx264 -pix_fmt yuv420p -an "$NORM_FWD"
ffmpeg -y -loglevel error -i "$REVERSE" -c:v libx264 -pix_fmt yuv420p -an "$NORM_REV"

CONCAT_LIST="${WORKDIR}/concat.txt"
printf "file '%s'\nfile '%s'\n" "$NORM_FWD" "$NORM_REV" > "$CONCAT_LIST"

mkdir -p "$(dirname "$OUTPUT")"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$CONCAT_LIST" -c copy "$OUTPUT"

DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$OUTPUT")
echo "Wrote seamless loop: ${OUTPUT} (${DURATION}s)"
echo "Next: run extract-frames.sh on this file to produce a canvas frame sequence."
