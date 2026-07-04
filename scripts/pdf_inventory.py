#!/usr/bin/env python3
"""Inventory embedded raster images in a PDF, page by page.

Usage: python pdf_inventory.py <file.pdf> [min_pixels]

Prints one line per page that contains embedded images at or above
min_pixels (width*height, default 40000), plus a total-page sanity line.
"""
import sys

import fitz  # PyMuPDF


def main() -> None:
    path = sys.argv[1]
    min_pixels = int(sys.argv[2]) if len(sys.argv) > 2 else 40_000

    doc = fitz.open(path)
    print(f"FILE: {path}")
    print(f"PAGES: {doc.page_count}")

    for pno in range(doc.page_count):
        images = doc.get_page_images(pno, full=True)
        entries = []
        for img in images:
            xref, width, height = img[0], img[2], img[3]
            if width * height >= min_pixels:
                entries.append(f"x{xref}:{width}x{height}")
        if entries:
            print(f"p{pno + 1}: {len(images)} imgs | big: {' '.join(entries)}")

    doc.close()


if __name__ == "__main__":
    main()
