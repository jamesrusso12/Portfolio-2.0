#!/bin/bash
# One-shot: compress hefty .mp4/.MP4 files for web delivery.
# Originals are moved to img/_originals/ so you can restore if needed.
# Works regardless of the directory you invoke it from.
set -u
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT/img" || exit 1

MIN_BYTES=$((5 * 1024 * 1024))   # only compress files > 5MB
LOG="$PROJECT_ROOT/compression.log"
: > "$LOG"

compress_one() {
    local src="$1"
    local rel="$2"        # relative path under img/, e.g. "AppDevelopment.mp4" or "Videos/App Screen Recordings/foo.mp4"
    local backup_dir
    backup_dir="_originals/$(dirname "$rel")"
    mkdir -p "$backup_dir"
    local backup="_originals/$rel"

    # Skip anything we've already processed
    if [[ -f "$backup" ]]; then
        echo "skip (already processed): $rel" | tee -a "$LOG"
        return
    fi

    local size
    size=$(stat -f%z "$src")
    if (( size < MIN_BYTES )); then
        echo "skip (small): $rel  ($size bytes)" | tee -a "$LOG"
        return
    fi

    local tmp="${src}.compress.tmp.mp4"

    echo "=== compressing: $rel  ($(du -h "$src" | cut -f1))" | tee -a "$LOG"
    if ffmpeg -y -hide_banner -loglevel error -stats \
        -i "$src" \
        -vf "scale='min(1280,iw)':-2" \
        -c:v libx264 -preset medium -crf 28 \
        -c:a aac -b:a 128k -ac 2 \
        -movflags +faststart \
        "$tmp" 2>>"$LOG"
    then
        mv "$src" "$backup"
        mv "$tmp" "$src"
        echo "    -> $(du -h "$src" | cut -f1) (was $(du -h "$backup" | cut -f1))" | tee -a "$LOG"
    else
        echo "    FAILED — keeping original: $rel" | tee -a "$LOG"
        rm -f "$tmp"
    fi
}

# Top-level videos
for f in *.mp4 *.MP4; do
    [[ -e "$f" ]] || continue
    compress_one "$f" "$f"
done

# Screen recordings
if [[ -d "Videos/App Screen Recordings" ]]; then
    while IFS= read -r -d '' f; do
        rel="${f#./}"
        compress_one "$f" "$rel"
    done < <(find "Videos/App Screen Recordings" -type f \( -iname '*.mp4' \) -print0)
fi

echo "=== DONE ===" | tee -a "$LOG"
