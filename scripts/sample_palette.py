#!/usr/bin/env python3
"""Sample brand colors from the TSA and Spartan logos.

Usage: python sample_palette.py <tsa_logo> <spartan_png> <out.json>

For each hue family the most common exact pixel value among strongly
saturated pixels is taken, so large solid fills win and antialiased edge
pixels (which are all slightly different) never do.
"""
import json
import sys

import numpy as np
from PIL import Image


def dominant_colors(path: str, families: dict) -> dict:
    """families: name -> (hue_lo, hue_hi) in degrees; lo > hi wraps around."""
    rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32) / 255.0
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    diff = mx - mn + 1e-9
    hue = np.where(mx == r, (g - b) / diff % 6,
                   np.where(mx == g, (b - r) / diff + 2, (r - g) / diff + 4)) * 60
    sat = diff / (mx + 1e-9)

    packed = (np.asarray(Image.open(path).convert("RGB")).reshape(-1, 3)
              .astype(np.uint32))
    packed = (packed[:, 0] << 16) | (packed[:, 1] << 8) | packed[:, 2]
    hue, sat, val = hue.ravel(), sat.ravel(), mx.ravel()

    out = {}
    for name, (lo, hi) in families.items():
        in_hue = (hue >= lo) & (hue <= hi) if lo <= hi else (hue >= lo) | (hue <= hi)
        mask = in_hue & (sat > 0.35) & (val > 0.25)
        vals, counts = np.unique(packed[mask], return_counts=True)
        out[name] = f"#{vals[counts.argmax()]:06X}"
    return out


def main() -> None:
    tsa, spartan, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    palette = {
        **{k: v for k, v in zip(("tsaBlue", "tsaRed"),
           dominant_colors(tsa, {"b": (195, 260), "r": (340, 20)}).values())},
        **{k: v for k, v in zip(("spartanBlue", "spartanOrange"),
           dominant_colors(spartan, {"b": (190, 260), "o": (10, 60)}).values())},
    }
    with open(out_path, "w") as f:
        json.dump(palette, f, indent=2)
    print(json.dumps(palette, indent=2))


if __name__ == "__main__":
    main()
