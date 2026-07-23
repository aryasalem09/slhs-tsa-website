## 2025-02-28 - [Prototype Pollution / Arbitrary Property Access]
**Vulnerability:** The codebase was retrieving dictionary values directly from a potentially unbounded dynamic key (e.g. `const art = STICKER_ART[name]`), which leaves it vulnerable to reading built-in prototype object properties like `constructor` or `__proto__`. If `art` is subsequently passed to `dangerouslySetInnerHTML`, this could lead to crashes or injection bugs.
**Learning:** Dynamic property access in TypeScript/Javascript objects is prone to prototype property leakage unless explicitly guarded against.
**Prevention:** Avoid `const val = obj[key]` for user-supplied string keys. Guard accesses with `Object.hasOwn(obj, key)` or initialize dictionaries with `Object.create(null)` to remove prototype chains.
