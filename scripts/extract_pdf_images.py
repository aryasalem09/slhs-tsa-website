#!/usr/bin/env python3
"""Extract embedded raster images from PDF pages at native resolution.

Usage: python extract_pdf_images.py <file.pdf> <out_dir> <pages> [min_pixels]

<pages> is a comma list of 1-based page numbers (e.g. "2,3,18-20").
Images are saved as PNG named p<page>-x<xref>.png. SMask transparency is
applied when present; CMYK is converted to RGB.
"""
import os
import sys

import fitz  # PyMuPDF


def parse_pages(spec: str) -> list[int]:
    pages = []
    for part in spec.split(","):
        if "-" in part:
            a, b = part.split("-")
            pages.extend(range(int(a), int(b) + 1))
        else:
            pages.append(int(part))
    return pages


def main() -> None:
    pdf_path, out_dir, pages_spec = sys.argv[1], sys.argv[2], sys.argv[3]
    min_pixels = int(sys.argv[4]) if len(sys.argv) > 4 else 60_000
    os.makedirs(out_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    seen = set()
    for pno in parse_pages(pages_spec):
        for img in doc.get_page_images(pno - 1, full=True):
            xref, smask, width, height = img[0], img[1], img[2], img[3]
            if xref in seen or width * height < min_pixels:
                continue
            seen.add(xref)

            pix = fitz.Pixmap(doc, xref)
            if smask:  # apply soft mask as alpha channel
                pix = fitz.Pixmap(pix, fitz.Pixmap(doc, smask))
            if pix.colorspace and pix.colorspace.n > 3:  # CMYK etc. -> RGB
                pix = fitz.Pixmap(fitz.csRGB, pix)

            out = os.path.join(out_dir, f"p{pno}-x{xref}.png")
            pix.save(out)
            print(f"{out}  {pix.width}x{pix.height} alpha={bool(pix.alpha)}")
    doc.close()


if __name__ == "__main__":
    main()
