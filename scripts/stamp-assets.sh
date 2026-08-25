#!/bin/bash
# Stamp a content hash onto every local CSS and JS URL in the HTML.
#
# Run from anywhere:  ./scripts/stamp-assets.sh
# Run it after changing anything in assets/css or assets/js, before committing.
#
# Why this exists: GitHub Pages serves HTML and assets with independent
# 600 second caches. After a deploy a visitor can hold the new HTML while still
# holding CSS from before, and the page renders with markup its stylesheet has
# never heard of. That is not hypothetical: it put an unstyled skip link across
# the top of the live site.
#
# Stamping the hash into the URL means new HTML always asks for a URL the cache
# has never seen, so the two can never disagree.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1

hash_of() { md5 -q "$1" 2>/dev/null | cut -c1-8; }

changed=0
for asset in assets/css/*.css assets/js/*.js; do
    [ -f "$asset" ] || continue
    h=$(hash_of "$asset")
    [ -n "$h" ] || continue
    for page in *.html; do
        [ -f "$page" ] || continue
        # rewrite href/src for this asset, with or without an existing ?v=
        before=$(md5 -q "$page")
        /usr/bin/python3 - "$page" "$asset" "$h" <<'PY'
import re, sys
page, asset, h = sys.argv[1], sys.argv[2], sys.argv[3]
t = open(page, encoding="utf-8").read()
pat = re.compile(r'((?:href|src)=")' + re.escape(asset) + r'(?:\?v=[0-9a-f]+)?(")')
t2 = pat.sub(lambda m: m.group(1) + asset + "?v=" + h + m.group(2), t)
if t2 != t:
    open(page, "w", encoding="utf-8").write(t2)
PY
        after=$(md5 -q "$page")
        [ "$before" != "$after" ] && changed=$((changed+1))
    done
done

echo "stamped $(ls assets/css/*.css assets/js/*.js 2>/dev/null | wc -l | tr -d ' ') assets across the HTML ($changed file writes)"
grep -ho '\(href\|src\)="assets/[^"]*"' *.html | sort -u | sed 's/^/  /'
