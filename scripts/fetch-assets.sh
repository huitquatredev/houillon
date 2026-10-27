#!/usr/bin/env bash
# Downloads the original Barrique landing-3 assets into public/.
set -euo pipefail
BASE="https://assets-global.website-files.com/5f88225b697f3c2ab623b070"
CDN="https://cdn.prod.website-files.com/5f88225b697f3c2ab623b070"
IMG="public/images/landing3"
VID="public/video"
mkdir -p "$IMG" "$VID"

get() { curl -fsSL --retry 2 "$1" -o "$2"; }

get "$BASE/5f88225b697f3c2cfc23b0fe_m1.png"              "$IMG/bottle-hero.png"
get "$BASE/5f88225b697f3c55f823b137_1%20(2).jpg"        "$IMG/vineyard.jpg"
get "$BASE/5f88225b697f3c268423b13d_2.jpg"               "$IMG/cellar.jpg"
get "$BASE/5f88225b697f3c704323b0c1_1.jpg"               "$IMG/square-1.jpg"
get "$BASE/5f88225b697f3cb45223b12b_3.jpg"               "$IMG/square-2.jpg"
get "$BASE/5f88225b697f3c3f7e23b0c3_4.jpg"               "$IMG/square-3.jpg"
get "$BASE/5f88225b697f3c638123b133_about0.jpg"          "$IMG/about-bg.jpg"
get "$BASE/5f88225b697f3c80e223b125_m8.png"              "$IMG/bottle-red.png"
get "$BASE/5f88225b697f3c220b23b13c_m3.png"              "$IMG/bottle-white.png"
get "$CDN/5f88225b697f3c00ec23b0e0_glass7.jpg"           "$IMG/glass-1.jpg"
get "$CDN/5f88225b697f3c03cb23b145_hover1.jpg"           "$IMG/glass-2.jpg"
get "$CDN/5f88225b697f3cce5123b140_hover2.jpg"           "$IMG/glass-3.jpg"
get "$CDN/5f88225b697f3c33b823b0d9_barrique-transcode.mp4" "$VID/barrique.mp4"
get "$CDN/5f64735e63d6b87bb903835a/5f6db7dce1b16c55767eafbf_barrique-poster-00001.jpg" "$VID/barrique-poster.jpg"

echo "assets ok"
