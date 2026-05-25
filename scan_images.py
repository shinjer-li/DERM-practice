"""
scan_images.py
--------------
Run this script once (and whenever you add new images) from the root of
your GitHub Pages repo.  It walks every folder inside IMAGES_ROOT and
writes image-manifest.json so the website can find your files.

Usage:
    python scan_images.py

Adjust IMAGES_ROOT below if your images live somewhere other than ./images/
"""

import os
import json

IMAGES_ROOT = "images"          # folder relative to this script
OUTPUT_FILE = "image-manifest.json"
VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif"}


def scan():
    manifest = {}   # { "DiseaseFolder": ["relative/path/img1.jpg", ...] }

    for dirpath, dirnames, filenames in os.walk(IMAGES_ROOT):
        dirnames.sort()   # stable ordering
        filenames.sort()

        images = [
            f for f in filenames
            if os.path.splitext(f)[1].lower() in VALID_EXTENSIONS
        ]
        if not images:
            continue

        # Use the immediate parent folder name as the disease key
        disease_key = os.path.basename(dirpath)

        # Build relative paths with forward slashes (works on all OS + web)
        paths = [
            os.path.join(dirpath, img).replace("\\", "/")
            for img in images
        ]

        if disease_key in manifest:
            manifest[disease_key].extend(paths)
        else:
            manifest[disease_key] = paths

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    total_images = sum(len(v) for v in manifest.values())
    print(f"Done. Scanned {len(manifest)} disease folders, {total_images} images.")
    print(f"Manifest written to: {OUTPUT_FILE}")


if __name__ == "__main__":
    scan()