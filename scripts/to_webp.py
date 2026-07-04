#!/usr/bin/env python3
"""Convert an image to web-ready WebP (downscale only, never upscale).

Usage: python to_webp.py <src> <dest.webp> [max_width] [quality]
"""
import sys

from PIL import Image


def main() -> None:
    src, dest = sys.argv[1], sys.argv[2]
    max_width = int(sys.argv[3]) if len(sys.argv) > 3 else 1600
    quality = int(sys.argv[4]) if len(sys.argv) > 4 else 82

    im = Image.open(src)
    im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    if im.width > max_width:
        im = im.resize((max_width, round(im.height * max_width / im.width)),
                       Image.LANCZOS)
    im.save(dest, "WEBP", quality=quality, method=6)
    print(f"{dest} {im.width}x{im.height}")


if __name__ == "__main__":
    main()
