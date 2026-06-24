"""
scan_images.py
--------------
Converts all images to .jpg first, then scans the folders and writes
image-manifest.json.

Usage:
    python scan_images.py
"""

import os
import json
from PIL import Image

IMAGES_ROOT = "images"
OUTPUT_FILE = "image-manifest.json"

VALID_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".gif",
    ".webp", ".bmp", ".tiff", ".tif"
}


def convert_to_jpg():
    """
    Convert every supported image to .jpg.
    Keeps original files unless you delete them manually.
    """

    converted = 0

    for dirpath, dirnames, filenames in os.walk(IMAGES_ROOT):
        dirnames.sort()
        filenames.sort()

        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()

            if ext not in VALID_EXTENSIONS:
                continue

            original_path = os.path.join(dirpath, filename)

            # Skip existing JPG/JPEG files
            if ext in {".jpg", ".jpeg"}:
                continue

            jpg_filename = os.path.splitext(filename)[0] + ".jpg"
            jpg_path = os.path.join(dirpath, jpg_filename)

            # Skip if already converted
            if os.path.exists(jpg_path):
                continue

            try:
                with Image.open(original_path) as img:

                    # Convert transparency to white background
                    if img.mode in ("RGBA", "LA", "P"):
                        background = Image.new("RGB", img.size, (255, 255, 255))
                        background.paste(img.convert("RGBA"), mask=img.convert("RGBA").split()[-1])
                        img = background
                    else:
                        img = img.convert("RGB")

                    img.save(jpg_path, "JPEG", quality=95)

                converted += 1
                print(f"Converted: {original_path} -> {jpg_path}")

            except Exception as e:
                print(f"Failed to convert {original_path}: {e}")

    print(f"\nFinished converting {converted} images to JPG.\n")


def scan():
    manifest = {}

    for dirpath, dirnames, filenames in os.walk(IMAGES_ROOT):
        dirnames.sort()
        filenames.sort()

        images = [
            f for f in filenames
            if os.path.splitext(f)[1].lower() in {".jpg", ".jpeg"}
        ]

        if not images:
            continue

        disease_key = os.path.basename(dirpath)

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

    print(f"Done. Scanned {len(manifest)} disease folders, {total_images} JPG images.")
    print(f"Manifest written to: {OUTPUT_FILE}")


if __name__ == "__main__":
    convert_to_jpg()
    scan()