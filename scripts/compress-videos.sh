#!/bin/bash
# Compress web-delivered video in place.
#
# Run from anywhere:  ./scripts/compress-videos.sh
#
# What it does
#   - walks assets/video/ (and archive/media/) for .mp4
#   - keeps a pristine copy under img/_originals/pre-crf20/ before touching
#     anything, because some clips have no other master
#   - re-encodes at CRF 20, preset slow, native resolution
#   - only keeps the result if it is actually SMALLER than what was there
#
# Why CRF 20 at native resolution rather than downscaling: the heavy files here
# are screen recordings, which are mostly static and compress enormously. A
# measured comparison on the 54 MB Figma capture put CRF 20 at native size at
# SSIM 0.9998 against the source while cutting 82% of the bytes. Downscaling
# bought almost nothing extra and cost text legibility, which is the whole
# point of a UI recording.
#
# High-motion gameplay footage is a different story: it is already near the
# floor, and re-encoding it comes out larger. The size guard below means such
# files are left alone automatically rather than quietly degraded.

set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT" || exit 1

CRF=20
PRESET=slow
BACKUP="img/_originals/pre-crf20"
LOG="$ROOT/compression.log"

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found. brew install ffmpeg"; exit 1; }

mkdir -p "$BACKUP"
: > "$LOG"

total_before=0
total_after=0

compress_one() {
    local f="$1"
    [ -f "$f" ] || return
    local base; base=$(basename "$f")
    local before; before=$(stat -f%z "$f")

    # Never encode from a file we are about to overwrite.
    [ -f "$BACKUP/$base" ] || cp "$f" "$BACKUP/$base"

    local tmp="${f%.mp4}.tmp.mp4"
    if ! ffmpeg -v error -y -i "$BACKUP/$base" \
            -c:v libx264 -preset "$PRESET" -crf "$CRF" -pix_fmt yuv420p \
            -c:a aac -b:a 96k -movflags +faststart "$tmp" 2>>"$LOG"; then
        rm -f "$tmp"
        printf "%-44s FAILED\n" "$base" | tee -a "$LOG"
        return
    fi

    local after; after=$(stat -f%z "$tmp")
    total_before=$((total_before + before))

    if [ "$after" -lt "$before" ]; then
        mv "$tmp" "$f"
        total_after=$((total_after + after))
        printf "%-44s %7.1fM -> %6.1fM  (%.0f%% saved)\n" "$base" \
            "$(echo "$before" | awk '{print $1/1048576}')" \
            "$(echo "$after"  | awk '{print $1/1048576}')" \
            "$(echo "$before $after" | awk '{print 100-100*$2/$1}')" | tee -a "$LOG"
    else
        rm -f "$tmp"
        total_after=$((total_after + before))
        printf "%-44s kept as-is (re-encode was larger)\n" "$base" | tee -a "$LOG"
    fi
}

for f in assets/video/*.mp4 archive/media/*.mp4; do
    [ -e "$f" ] || continue
    compress_one "$f"
done

if [ "$total_before" -gt 0 ]; then
    printf "\nTOTAL %7.1fM -> %6.1fM  (%.0f%% saved)\n" \
        "$(echo "$total_before" | awk '{print $1/1048576}')" \
        "$(echo "$total_after"  | awk '{print $1/1048576}')" \
        "$(echo "$total_before $total_after" | awk '{print 100-100*$2/$1}')" | tee -a "$LOG"
fi

echo "" | tee -a "$LOG"
echo "Pristine copies are in $BACKUP (gitignored)." | tee -a "$LOG"
