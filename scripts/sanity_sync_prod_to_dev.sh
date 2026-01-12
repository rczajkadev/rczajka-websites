#!/bin/bash
set -euo pipefail

root_dir=$(git rev-parse --show-toplevel)

if [[ -d "$root_dir/apps/studio" ]]; then
  studio_dir="$root_dir/apps/studio"
elif [[ -d "$root_dir/studio" ]]; then
  studio_dir="$root_dir/studio"
else
  echo "Could not find Sanity Studio directory (expected apps/studio or studio)."
  exit 1
fi

sanity_cmd=(pnpm -C "$studio_dir" exec sanity)

echo "Checking Sanity login..."
if ! "${sanity_cmd[@]}" whoami >/dev/null 2>&1; then
  echo "Not logged in. Starting 'sanity login' (this may open a browser)..."
  "${sanity_cmd[@]}" login
  echo "Logged in."
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
archive="$tmp_dir/production.tar.gz"

echo "Exporting dataset 'production'..."
pnpm -C "$studio_dir" exec sanity dataset export production "$archive"

echo "Importing into dataset 'development' (overwriting)..."
pnpm -C "$studio_dir" exec sanity dataset import "$archive" development --replace

echo "Sync complete: production -> development"
