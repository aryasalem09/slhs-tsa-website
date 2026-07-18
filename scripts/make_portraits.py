#!/usr/bin/env python3
"""Crop SLHS TSA officer photos from native PDF assets and export lossless WebP.

Usage: python make_portraits.py <raw_dir> <out_dir>

<raw_dir> holds native-resolution images extracted from "26-27 Officer Post.pdf"
(see extract_pdf_images.py), named p<page>-x<xref>.png. The manually verified
crop boxes preserve the existing officer framing exactly. This script never
upscales, synthesizes, or enhances a face; it only crops and losslessly encodes.
"""
import os
import sys

from PIL import Image

# name, source file, manually verified native-pixel crop box (left, top, right, bottom)
OFFICERS = [
    ("Vitor Jones Anicio", "p2-x314.png", (75, 0, 384, 387)),
    ("Niyatee Dalvi", "p3-x340.png", (104, 0, 387, 354)),
    ("Arya Salem", "p4-x366.png", (0, 4, 289, 365)),
    ("Sanvi Singh", "p4-x386.png", (9, 0, 223, 268)),
    ("Azaan Noman", "p5-x408.png", (0, 87, 343, 515)),
    ("Rianna Ganta", "p6-x431.png", (0, 10, 762, 962)),
    ("Shaarika Ganti", "p7-x454.png", (103, 0, 333, 288)),
    ("Alice Jin", "p7-x474.png", (84, 0, 312, 285)),
    ("Kelly Zheng", "p8-x530.png", (0, 9, 231, 297)),
    ("Bella Xiang", "p8-x551.png", (0, 0, 248, 310)),
    ("Elizabeth Hu", "p8-x508.png", (167, 0, 416, 312)),
]


def main() -> None:
    raw_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    for name, src, box in OFFICERS:
        path = os.path.join(raw_dir, src)
        im = Image.open(path).convert("RGB")
        if box[2] > im.width or box[3] > im.height:
            raise ValueError(f"Crop {box} is outside native image {src} ({im.width}x{im.height})")
        crop = im.crop(box)

        slug = name.lower().replace(" ", "-")
        out = os.path.join(out_dir, f"{slug}.webp")
        crop.save(out, "WEBP", lossless=True, method=6)
        print(f"{name}: {src} native={im.width}x{im.height} box={box} "
              f"-> {out} {crop.width}x{crop.height} lossless")


if __name__ == "__main__":
    main()
