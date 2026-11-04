#!/usr/bin/env bash
# Genereert de hero-frames uit een video met FFmpeg.
# Gebruik:  bash scripts/extract-frames.sh pad/naar/hero.mp4 [versie]
#   - d/  : desktop/tablet, native breedte (max 768 px), AVIF (crf 44)
#   - m/  : mobiel 9:16, 540 px breed, AVIF (crf 46)
#   - dw/ mw/ : WebP-fallback voor browsers zonder AVIF
# Bij een nieuwe video: verhoog de versie (v2, v3 …) en pas BASE + FRAME_COUNT aan in
# src/components/hero/HeroSequence.tsx. Een aparte 16:9-video kan als bron voor d/ dienen.
set -euo pipefail
SRC="${1:?Geef het pad naar de video op}"
VER="${2:-v1}"
OUT="public/hero/$VER"
TMP="$(mktemp -d)"
mkdir -p "$OUT"/{d,m,dw,mw}

# Lichte ruisonderdrukking: AI-video bevat veel ruis, dit scheelt ±25% bestandsgrootte.
ffmpeg -v error -y -i "$SRC" -vf "hqdn3d=2:2:3:3,scale='min(768,iw)':-2:flags=lanczos" "$TMP/%03d.png"

for f in "$TMP"/*.png; do
  n="$(basename "$f" .png)"
  ffmpeg -v error -y -i "$f" -c:v libaom-av1 -still-picture 1 -crf 44 -cpu-used 6 "$OUT/d/$n.avif"
  ffmpeg -v error -y -i "$f" -vf scale=540:-2:flags=lanczos -c:v libaom-av1 -still-picture 1 -crf 46 -cpu-used 6 "$OUT/m/$n.avif"
  ffmpeg -v error -y -i "$f" -c:v libwebp -quality 55 -compression_level 6 "$OUT/dw/$n.webp"
  ffmpeg -v error -y -i "$f" -vf scale=540:-2:flags=lanczos -c:v libwebp -quality 52 -compression_level 6 "$OUT/mw/$n.webp"
done

FIRST="$(ls "$TMP"/*.png | head -1)"; LAST="$(ls "$TMP"/*.png | tail -1)"
ffmpeg -v error -y -i "$FIRST" -q:v 4 "$OUT/poster.jpg"
ffmpeg -v error -y -i "$FIRST" -c:v libaom-av1 -still-picture 1 -crf 38 -cpu-used 6 "$OUT/poster.avif"
ffmpeg -v error -y -i "$LAST" -q:v 4 "$OUT/final.jpg"
ffmpeg -v error -y -i "$LAST" -c:v libaom-av1 -still-picture 1 -crf 38 -cpu-used 6 "$OUT/final.avif"

echo "Klaar: $(ls "$OUT/d" | wc -l) frames in $OUT"
du -sh "$OUT"/*
rm -rf "$TMP"
