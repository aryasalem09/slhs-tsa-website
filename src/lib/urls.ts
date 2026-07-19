/** Accept only same-origin root-relative paths; reject protocol-relative and backslash-normalized URLs. */
export function isSafeInternalHref(value: unknown): value is string {
  return typeof value === "string"
    && /^\/(?!\/)/.test(value)
    && !/[\\\u0000-\u001f\u007f]/.test(value);
}

/** Studio images are served from this site or its authenticated media gateway. */
export function isSafeImageSrc(value: unknown): value is string {
  return isSafeInternalHref(value)
    && (/\.(png|jpe?g|webp|gif|avif)(?:\?.*)?$/i.test(value)
      || /^\/api\/studio\/media\/[0-9a-f-]{36}(?:\?.*)?$/i.test(value));
}
