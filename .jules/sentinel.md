## 2025-02-14 - Add Content Security Policy header
**Vulnerability:** The application was missing a Content-Security-Policy (CSP) header, which is a key security enhancement to mitigate Cross-Site Scripting (XSS) and data injection attacks.
**Learning:** Adding a CSP header provides an important layer of defense, but it must be carefully configured to not break legitimate external resources.
**Prevention:** Always ensure a CSP header is configured in `next.config.ts` or similar configuration files to enhance the security posture of the application.
