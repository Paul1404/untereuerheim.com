import { join } from "node:path";

const DIST = join(import.meta.dir, "dist");
const PORT = Number(process.env.PORT) || 4321;
const HOST = process.env.HOST ?? "0.0.0.0";

const CACHE_LONG = "public, max-age=31536000, immutable";
const CACHE_DAY = "public, max-age=86400";
const CACHE_NONE = "no-cache";

// Baseline security headers sent on every response. Inline scripts and styles
// are allowed because Astro inlines small page scripts and critical CSS at
// build time; this is a static brochure site with no user input, so the
// remaining value is framing, base-uri, object and transport hardening.
const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
};

const headersFor = (pathname: string): HeadersInit => {
  let cache = CACHE_NONE;
  if (pathname.startsWith("/_astro/")) cache = CACHE_LONG;
  else if (/\.(woff2?|ico|svg|webp|jpg|jpeg|png|gif|webmanifest)$/i.test(pathname)) {
    cache = CACHE_DAY;
  }
  return { ...SECURITY_HEADERS, "cache-control": cache };
};

const tryFile = async (path: string) => {
  const file = Bun.file(join(DIST, path));
  return (await file.exists()) ? file : null;
};

const resolve = async (pathname: string) => {
  if (pathname === "/") return tryFile("/index.html");
  const direct = await tryFile(pathname);
  if (direct) return direct;
  if (!pathname.endsWith("/") && !pathname.includes(".")) {
    return (
      (await tryFile(pathname + "/index.html")) ?? (await tryFile(pathname + ".html"))
    );
  }
  if (pathname.endsWith("/")) {
    return tryFile(pathname + "index.html");
  }
  return null;
};

Bun.serve({
  port: PORT,
  hostname: HOST,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = decodeURIComponent(url.pathname);

    const file = await resolve(pathname);
    if (file) {
      return new Response(file, { headers: headersFor(pathname) });
    }

    const notFound = await tryFile("/404.html");
    if (notFound) {
      return new Response(notFound, {
        status: 404,
        headers: {
          ...SECURITY_HEADERS,
          "content-type": "text/html; charset=utf-8",
          "cache-control": CACHE_NONE,
        },
      });
    }
    return new Response("Not Found", {
      status: 404,
      headers: { ...SECURITY_HEADERS, "cache-control": CACHE_NONE },
    });
  },
});

console.log(`static server: http://${HOST}:${PORT}`);
