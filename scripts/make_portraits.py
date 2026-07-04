#!/usr/bin/env python3
"""Crop SLHS TSA officer photos to a consistent 4:5 portrait and export WebP.

Usage: python make_portraits.py <raw_dir> <out_dir>

<raw_dir> holds the native-resolution images extracted from
"26-27 Officer Post.pdf" (see extract_pdf_images.py), named p<page>-x<xref>.png.
Face centers are auto-detected (OpenCV Haar cascade) unless a manual
(cx, cy) override is given below. Output is capped at 1000x1250 and is
never upscaled.
"""
import os
import sys

import cv2
from PIL import Image

ASPECT = 4 / 5           # width : height
MAX_W, MAX_H = 1000, 1250
QUALITY = 88
FACE_Y = 0.40            # face center sits at this fraction of crop height

# name, role, source file, optional manual face-center (px in source image)
OFFICERS = [
    ("Vitor Jones Anicio", "President",      "p2-x314.png", (230, 125)),
    ("Niyatee Dalvi",      "Vice President", "p3-x340.png", None),
    ("Arya Salem",         "Secretary",      "p4-x366.png", None),
    ("Sanvi Singh",        "Secretary",      "p4-x386.png", None),
    ("Azaan Noman",        "Treasurer",      "p5-x408.png", None),
    ("Rianna Ganta",       "Reporter",       "p6-x431.png", None),
    ("Shaarika Ganti",     "UTE Director",   "p7-x454.png", None),
    ("Alice Jin",          "UTE Director",   "p7-x474.png", None),
    ("Kelly Zheng",        "NQE Director",   "p8-x530.png", (108, 125)),
    ("Bella Xiang",        "NQE Director",   "p8-x551.png", None),
    ("Elizabeth Hu",       "NQE Director",   "p8-x508.png", (340, 105)),
]


def detect_face(path: str):
    """Return (cx, cy) of the most prominent face, or None."""
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = cascade.detectMultiScale(gray, 1.08, 4, minSize=(24, 24))
    if len(faces) == 0:
        return None
    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
    return (x + w / 2, y + h / 2)


def crop_box(iw: int, ih: int, cx: float, cy: float):
    """Largest 4:5 box inside iw x ih with (cx, cy) near its focal point."""
    cw, ch = (int(ih * ASPECT), ih) if iw / ih >= ASPECT else (iw, int(iw / ASPECT))
    x = min(max(int(cx - cw / 2), 0), iw - cw)
    y = min(max(int(cy - ch * FACE_Y), 0), ih - ch)
    return (x, y, x + cw, y + ch)


def main() -> None:
    raw_dir, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    for name, role, src, face in OFFICERS:
        path = os.path.join(raw_dir, src)
        im = Image.open(path).convert("RGB")
        center = face or detect_face(path) or (im.width / 2, im.height * 0.42)
        box = crop_box(im.width, im.height, *center)
        crop = im.crop(box)
        if crop.width > MAX_W:  # downscale only, never upscale
            crop = crop.resize((MAX_W, MAX_H), Image.LANCZOS)

        slug = name.lower().replace(" ", "-")
        out = os.path.join(out_dir, f"{slug}.webp")
        crop.save(out, "WEBP", quality=QUALITY, method=6)
        print(f"{name}: {src} face={tuple(round(c) for c in center)} "
              f"box={box} -> {out} {crop.width}x{crop.height}")


if __name__ == "__main__":
    main()
