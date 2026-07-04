#!/usr/bin/env python3
"""Produce the /public/logos set from the original Spartan + TSA logos.

Usage: python prepare_logos.py <Spartan.png> <TSA_logo> <palette.json> <out_dir>

Outputs:
  spartan-tsa-colors.png  full-res transparent Spartan mark with orange
                          retargeted to TSA red and blue to TSA blue in HSV,
                          per-pixel value kept so shading/antialiasing survive.
  spartan-mark-512.png    square 512x512 centered/padded transparent version.
  spartan-original.png    original mark trimmed to content, background as-is.
  tsa-logo.webp           original TSA logo trimmed to content bounds.

Spartan.png already ships with a proper alpha channel, which is used
verbatim (clean edges, no halos). If a flattened copy is ever fed in
instead, the background is removed by flood fill from the image edges --
never a global white key -- so enclosed white art would survive.
"""
import json
import sys

import cv2
import numpy as np
from PIL import Image

LIGHTEST_FG = 167          # lightest true foreground channel (the silver)
WHITE_THRESH = 232         # min-channel level treated as background white


def hex_to_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def rgb_to_hsv_np(rgb):
    """Vectorized RGB [0..1] -> H (deg), S, V."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx, mn = rgb.max(-1), rgb.min(-1)
    d = mx - mn + 1e-12
    h = np.where(mx == r, (g - b) / d % 6,
                 np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, d / (mx + 1e-12), mx


def hsv_to_rgb_np(h, s, v):
    h = (h % 360) / 60
    i = np.floor(h)
    f = h - i
    p, q, t = v * (1 - s), v * (1 - s * f), v * (1 - s * (1 - f))
    i = i.astype(int) % 6
    conds = [i == k for k in range(6)]
    r = np.select(conds, [v, q, p, p, t, v])
    g = np.select(conds, [t, v, v, q, p, p])
    b = np.select(conds, [p, p, t, v, v, q])
    return np.stack([r, g, b], -1)


def flood_alpha(rgb: np.ndarray) -> np.ndarray:
    """Fallback for flattened sources: edge-connected near-white becomes
    transparent, with an unmixed 1-2px ramp on the boundary (no halos)."""
    minc = rgb.min(-1)
    whiteish = (minc >= WHITE_THRESH).astype(np.uint8)
    _, labels = cv2.connectedComponents(whiteish)
    border = np.unique(np.concatenate([
        labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bg = np.isin(labels, border[border != 0]) & (whiteish == 1)

    alpha = np.where(bg, 0, 255).astype(np.float32)
    ring = cv2.dilate(bg.astype(np.uint8), np.ones((3, 3), np.uint8),
                      iterations=2).astype(bool) & ~bg
    ramp = np.clip((255.0 - minc) / (255.0 - LIGHTEST_FG), 0, 1)
    alpha[ring] = np.minimum(alpha[ring], ramp[ring] * 255)

    a = alpha / 255.0
    mix = ring & (a > 0.03) & (a < 0.995)  # un-mix ring colors from white
    unmixed = (rgb - (1 - a[..., None]) * 255.0) / np.maximum(a[..., None], 1e-3)
    rgb[mix] = np.clip(unmixed[mix], 0, 255)
    return alpha.astype(np.uint8)


def load_rgba(path: str):
    """Return (rgb float32 array, alpha uint8 array)."""
    im = Image.open(path)
    if "A" in im.getbands():
        arr = np.asarray(im.convert("RGBA"))
        if (arr[..., 3] < 255).any():  # real transparency present: trust it
            return arr[..., :3].astype(np.float32), arr[..., 3].copy()
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    return rgb, flood_alpha(rgb)


def retarget(rgb, mask, src_hex, dst_hex):
    """Shift hue and scale sat/val so src brand color maps onto dst,
    preserving per-pixel shading and antialiasing."""
    sh, ss, sv = rgb_to_hsv_np(np.array([[hex_to_rgb(src_hex)]]) / 255.0)
    dh, ds, dv = rgb_to_hsv_np(np.array([[hex_to_rgb(dst_hex)]]) / 255.0)
    h, s, v = rgb_to_hsv_np(rgb / 255.0)
    h2 = h + (dh.item() - sh.item())
    s2 = np.clip(s * (ds.item() / max(ss.item(), 1e-6)), 0, 1)
    v2 = np.clip(v * (dv.item() / max(sv.item(), 1e-6)), 0, 1)
    out = hsv_to_rgb_np(h2, s2, v2) * 255.0
    rgb[mask] = out[mask]
    return rgb


def main() -> None:
    spartan_path, tsa_path, palette_path, out_dir = sys.argv[1:5]
    pal = json.load(open(palette_path))

    # --- recolored transparent Spartan -----------------------------------
    rgb, alpha = load_rgba(spartan_path)
    h, s, _ = rgb_to_hsv_np(rgb / 255.0)
    visible = alpha > 0
    orange = visible & (h >= 10) & (h < 60) & (s > 0.12)
    blue = visible & (h >= 190) & (h <= 260) & (s > 0.12)
    rgb = retarget(rgb, orange, pal["spartanOrange"], pal["tsaRed"])
    rgb = retarget(rgb, blue, pal["spartanBlue"], pal["tsaBlue"])

    rgba = np.dstack([np.clip(rgb, 0, 255).astype(np.uint8), alpha])
    full = Image.fromarray(rgba)
    full.save(f"{out_dir}/spartan-tsa-colors.png")

    # --- square padded 512 mark ------------------------------------------
    bbox = full.getchannel("A").getbbox()  # content bounds from alpha only
    mark = full.crop(bbox)
    side = round(max(mark.size) * 1.12)  # ~6% padding per side
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2))
    if side > 512:
        square = square.resize((512, 512), Image.LANCZOS)
    square.save(f"{out_dir}/spartan-mark-512.png")

    # --- trimmed originals (never upscaled, backgrounds left as-is) ------
    orig = Image.open(spartan_path).convert("RGBA")
    m = round(max(orig.size) * 0.02)
    x0, y0, x1, y1 = orig.getchannel("A").getbbox()
    orig.crop((max(x0 - m, 0), max(y0 - m, 0),
               min(x1 + m, orig.width), min(y1 + m, orig.height))
              ).save(f"{out_dir}/spartan-original.png")

    tsa = Image.open(tsa_path).convert("RGB")
    content = np.abs(np.asarray(tsa).astype(int) - 255).max(-1) > 12
    ys, xs = np.where(content)
    m = round(max(tsa.size) * 0.02)
    tsa.crop((max(xs.min() - m, 0), max(ys.min() - m, 0),
              min(xs.max() + 1 + m, tsa.width), min(ys.max() + 1 + m, tsa.height))
             ).save(f"{out_dir}/tsa-logo.webp", "WEBP", quality=95, method=6)

    for f in ("spartan-tsa-colors.png", "spartan-mark-512.png",
              "spartan-original.png", "tsa-logo.webp"):
        print(f"{out_dir}/{f} {Image.open(f'{out_dir}/{f}').size}")


if __name__ == "__main__":
    main()
